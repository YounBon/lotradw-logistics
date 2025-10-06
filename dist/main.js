"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: configService.get('ALLOWED_ORIGINS', 'http://localhost:3000').split(','),
        credentials: true,
    });
    app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'));
    const port = configService.get('PORT', 3001);
    await app.listen(port);
    logger.log(`🚀 LoTraDW Backend API is running on: http://localhost:${port}`);
    logger.log(`📊 Database: ${configService.get('DB_NAME')}`);
    logger.log(`🌐 CORS enabled for: ${configService.get('ALLOWED_ORIGINS')}`);
}
bootstrap().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map