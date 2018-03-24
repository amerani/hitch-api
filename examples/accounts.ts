import {createConnection} from 'typeorm';
import { fetchUserByEmail } from '../domain/query/queries';

createConnection({
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "am",
    "database": "hitch_test",
    "synchronize": true,
    "entities": [
       "src/entity/**/*.ts"
    ],
    "migrations": [
       "src/migration/**/*.ts"
    ],
    "subscribers": [
       "src/subscriber/**/*.ts"
    ],
    "cli": {
       "entitiesDir": "src/entity",
       "migrationsDir": "src/migration",
       "subscribersDir": "src/subscriber"
    }
 }).then(async () => { 
    const user = await fetchUserByEmail("notavalidacc@gmail.com");
    console.log(user);
 })