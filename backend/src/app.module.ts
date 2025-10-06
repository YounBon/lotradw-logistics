import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';

@Module({
    imports: [
        // Environment Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Database Configuration
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'minhphuc293',
            database: process.env.DB_NAME || 'lotradw',
            entities: [User],
            synchronize: false, // Don't sync, use existing database
            logging: process.env.NODE_ENV === 'development',
        }),

        // Feature Modules
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }