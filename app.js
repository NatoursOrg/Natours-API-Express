import path from 'path';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { tourRouter, userRouter } from './routers/route.js';
import AppError from './utils/AppError.js';
import GlobalErrorHandling from './controllers/errorController.js';

dotenv.config();

const app = express();
const __dirname = path.resolve(path.dirname(''));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling middleware
app.use(GlobalErrorHandling);

export default app;

// Handlers are called controllers on MVC arch thats why we put that handler in controller.
