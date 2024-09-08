/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync, readFileSync } from 'fs';
import { parse } from 'ini';
import { join } from 'path';
import { loadNumber, loadString } from '../helpers/env.helper';

const configFilePath = 'config.ini';

if (!existsSync(configFilePath)) {
  console.error('config.ini file is missing or invalid using default settings');
}

const configFile = readFileSync('config.ini', 'utf-8');
const configData = parse(configFile);

process.env.NODE_ENV = configData.NODE_ENV;
process.env.LOGS_DISABLED = configData.LOGS_DISABLED;

const envFileMap = {
  production: '.env',
  development: '.dev.env',
  default: '.dev.env',
};

const basePath = process.cwd();

require('dotenv').config({
  path: join(
    basePath,
    envFileMap[configData.NODE_ENV as keyof typeof envFileMap] ||
      envFileMap.default,
  ),
});

export default {
  productionMode: configData.NODE_ENV === 'production',
  logsDisabled: process.env.LOGS_DISABLED === 'true',
  host: loadString('HOST', { defaultValue: '0.0.0.0' }),
  remote: loadString('REMOTE', { defaultValue: 'http://127.0.0.1' }),
  port: loadNumber('PORT', { defaultValue: 5000 }),
  jwtSecret: loadString('JWT_SECRET'),
  jwtExpireSecs: loadNumber('JWT_EXPIRE_SECS', { defaultValue: 60 * 60 * 24 }),
};
