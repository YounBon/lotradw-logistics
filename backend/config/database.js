// Database Configuration for LoTraDW Logistics
// Environment variables for different environments

module.exports = {
    development: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'lotradw',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'minhphuc293',
        dialect: 'postgres',
        logging: console.log,
        pool: {
            max: 20,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true
        }
    },

    test: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'lotradw_test',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'minhphuc293',
        dialect: 'postgres',
        logging: false
    },

    production: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: 'postgres',
        logging: false,
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        pool: {
            max: 50,
            min: 5,
            acquire: 60000,
            idle: 10000
        }
    }
};