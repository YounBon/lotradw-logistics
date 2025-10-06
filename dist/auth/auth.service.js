"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const database_service_1 = require("../database/database.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(databaseService, jwtService, configService) {
        this.databaseService = databaseService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(registerDto) {
        const { email, password, role = 'customer', firstName, lastName, phone, companyName } = registerDto;
        const existingUser = await this.databaseService.query('SELECT id FROM auth.users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS', 12);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return this.databaseService.transaction(async (client) => {
            const userResult = await client.query(`INSERT INTO auth.users (email, password_hash, role, status, email_verified)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, role, status`, [email, hashedPassword, role, role === 'carrier' ? 'pending' : 'active', true]);
            const user = userResult.rows[0];
            await client.query(`INSERT INTO auth.user_profiles (user_id, first_name, last_name, phone, company_name)
         VALUES ($1, $2, $3, $4, $5)`, [user.id, firstName, lastName, phone, companyName]);
            if (role === 'carrier' && companyName) {
                await client.query(`INSERT INTO logistics.carriers (user_id, company_name, approval_status)
           VALUES ($1, $2, $3)`, [user.id, companyName, 'pending']);
            }
            const tokens = await this.generateTokens(user);
            await this.storeRefreshToken(user.id, tokens.refreshToken);
            this.logger.log(`User registered: ${email} as ${role}`);
            return {
                user,
                ...tokens,
            };
        });
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const result = await this.databaseService.query('SELECT id, email, password_hash, role, status FROM auth.users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        await this.databaseService.query('UPDATE auth.users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
        const tokens = await this.generateTokens(user);
        await this.storeRefreshToken(user.id, tokens.refreshToken);
        this.logger.log(`User logged in: ${email}`);
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
            },
            ...tokens,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const tokenResult = await this.databaseService.query('SELECT user_id FROM auth.refresh_tokens WHERE token_hash = $1 AND revoked = false AND expires_at > NOW()', [await bcrypt.hash(refreshToken, 10)]);
            if (tokenResult.rows.length === 0) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const userResult = await this.databaseService.query('SELECT id, email, role, status FROM auth.users WHERE id = $1', [payload.sub]);
            if (userResult.rows.length === 0) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const user = userResult.rows[0];
            const accessToken = this.jwtService.sign({
                sub: user.id,
                email: user.email,
                role: user.role,
            }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            });
            return { accessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(refreshToken) {
        await this.databaseService.query('UPDATE auth.refresh_tokens SET revoked = true WHERE token_hash = $1', [await bcrypt.hash(refreshToken, 10)]);
    }
    async validateUser(userId) {
        const result = await this.databaseService.query('SELECT id, email, role, status FROM auth.users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        });
        return { accessToken, refreshToken };
    }
    async storeRefreshToken(userId, refreshToken) {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.databaseService.query('INSERT INTO auth.refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [userId, hashedToken, expiresAt]);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map