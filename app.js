import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from "./routes/userRoutes.js";
import errorMiddleware from './middlewares/error.Middleware.js';
import { config } from 'dotenv';
import cartRoutes from './routes/cartRoutes.js'
import { isLoggedIn } from './middlewares/auth.middleware.js';

config();

const app = express();

// Enable CORS at the beginning
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.use("/api/v1/user" ,userRoutes);
app.use("/api/v1/cart", isLoggedIn, cartRoutes);

app.all('*', (req, res) => {
  res.status(404).send('OOPS! 404 Page not found');
});

app.use(errorMiddleware);

export default app;
