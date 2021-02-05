import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

import apiRoutes from './routes/api.routes';

import trim from './middleware/trim';
import { errorHandler, notFound } from './middleware/error-handlers';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(trim);
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use(express.static('public'))

app.get('/', (_, res) => res.send('Hello World'));
app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);

  try {
    await createConnection();
    console.log('Database connected!');
  } catch (err) {
    console.log(err);
  }
});