import {
    PG_HOST,
    PG_PORT,
    PG_USERNAME,
    PG_DATABASE,  
} from './config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export function typeorm(): PostgresConnectionOptions
{
    return {
        type: "postgres",
        host: PG_HOST,
        port: parseInt(PG_PORT),
        username: PG_USERNAME,
        database: PG_DATABASE,
        synchronize: true,
        entities: [
           "src/entity/**/*.ts"
        ],
        migrations: [
           "src/migration/**/*.ts"
        ],
        subscribers: [
           "src/subscriber/**/*.ts"
        ],
        cli: {
           "entitiesDir": "src/entity",
           "migrationsDir": "src/migration",
           "subscribersDir": "src/subscriber"
        }        
    }
}