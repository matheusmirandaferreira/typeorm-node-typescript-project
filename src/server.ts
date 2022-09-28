import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';

import { routes } from './routes';
import { AppDataSource } from './database';

const app = express();

dotenv.config();

app.use('/', routes);

const main = () =>
  Promise.resolve(AppDataSource.initialize())
    .then(() => console.log('Database started successfully'))
    .catch((err) => console.log('Error on start database', err));

app.listen(process.env.APP_PORT, main);
