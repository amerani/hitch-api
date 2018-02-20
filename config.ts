import * as dotenv from 'dotenv';

dotenv.config({ silent: true });

export const {
  JWT_SECRET,
  PG_PORT,
  PG_USERNAME,
  PG_DATABASE,  
} = process.env;

export let { PG_HOST } = process.env;

const defaults = {
  JWT_SECRET: 'JWT_SECRET',
  PG_HOST: 'PG_HOST',
  PG_PORT: 'PG_PORT',
  PG_USERNAME: 'PG_USERNAME',
  PG_DATABASE: 'PG_DATABASE'
};

Object.keys(defaults).forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Please enter a custom ${key} in .env on the root directory`);
  }
});

if(process.env.NODE_ENV == 'docker') {
  PG_HOST = 'db'
}

export default {
  JWT_SECRET,
  PG_HOST,
  PG_PORT,
  PG_USERNAME,
  PG_DATABASE,  
}