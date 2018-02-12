import * as dotenv from 'dotenv';

dotenv.config({ silent: true });

export const {
  JWT_SECRET,
} = process.env;

const defaults = {
  JWT_SECRET: 'your_secret',
};

Object.keys(defaults).forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Please enter a custom ${key} in .env on the root directory`);
  }
});

export default JWT_SECRET;