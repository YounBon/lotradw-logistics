import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // CORS configuration
    app.enableCors({
        origin: configService.get('ALLOWED_ORIGINS', 'http://localhost:3000').split(','),
        credentials: true,
    });

    // No global prefix for simple routing
    // app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'));

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