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
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const config_1 = require("@nestjs/config");
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(DatabaseService_1.name);
        this.pool = new pg_1.Pool({
            host: this.configService.get('DB_HOST', 'localhost'),
            port: this.configService.get('DB_PORT', 5432),
            database: this.configService.get('DB_NAME', 'lotradw'),
            user: this.configService.get('DB_USER', 'postgres'),
            password: this.configService.get('DB_PASSWORD'),
            ssl: this.configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });
        this.pool.on('error', (err) => {
            this.logger.error('Unexpected error on idle client', err);
        });
    }
    async onModuleInit() {
        try {
            const client = await this.pool.connect();
            const result = await client.query('SELECT current_database(), current_user, version()');
            this.logger.log(`Connected to database: ${result.rows[0].current_database}`);
            this.logger.log(`Connected as user: ${result.rows[0].current_user}`);
            client.release();
        }
        catch (error) {
            this.logger.error('Failed to connect to database', error);
            throw error;
        }
    }
    async getClient() {
        return this.pool.connect();
    }
    async query(text, params) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        }
        finally {
            client.release();
        }
    }
    async transaction(callback) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async healthCheck() {
        try {
            const result = await this.query(`
        SELECT 
          current_database() as database,
          current_user as user,
          (SELECT COUNT(*) FROM information_schema.tables 
           WHERE table_schema IN ('auth', 'logistics', 'admin', 'dw')) as table_count
      `);
            return {
                healthy: true,
                info: result.rows[0]
            };
        }
        catch (error) {
            return {
                healthy: false,
                error: error.message
            };
        }
    }
    async close() {
        await this.pool.end();
        this.logger.log('Database connection pool closed');
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map