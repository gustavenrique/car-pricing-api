import { DataSource, DataSourceOptions, Db } from 'typeorm';

// database options
let databaseOptions;

switch (process.env.NODE_ENV) {
    case 'dev':
        databaseOptions = {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: [`**/**/*.entity.js`],
        };
        break;
    case 'test':
        databaseOptions = {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: [`**/**/*.entity.ts`],
            migrationsRun: true,
        };
        break;
    case 'production':
        databaseOptions = {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [`**/**/*.entity.js`],
            ssl: { rejectUnauthorized: false },
        } as DataSourceOptions;
        break;
}

export const databaseConfig: DataSourceOptions = {
    synchronize: false,
    ...(databaseOptions as DataSourceOptions),
};

// database source for connection
const datasource = new DataSource(databaseConfig);

datasource.initialize();

export default datasource;
