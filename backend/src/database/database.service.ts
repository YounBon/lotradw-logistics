import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private readonly logger = new Logger(DatabaseService.name);
    private pool: Pool;

    constructor(private configService: ConfigService) {
        this.pool = new Pool({
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

        // Handle pool errors
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
        } catch (error) {
            this.logger.error('Failed to connect to database', error);
            throw error;
        }
    }

    async getClient(): Promise<PoolClient> {
        return this.pool.connect();
    }

    async query(text: string, params?: any[]): Promise<any> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        } finally {
            client.release();
        }
    }

    async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async healthCheck(): Promise<{ healthy: boolean; info?: any; error?: string }> {
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
        } catch (error) {
            return {
                healthy: false,
                error: error.message
            };
        }
    }

    async close(): Promise<void> {
        await this.pool.end();
        this.logger.log('Database connection pool closed');
    }
}