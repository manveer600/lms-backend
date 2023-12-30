import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from "./routes/userRoutes.js"
import courseRoutes from './routes/courseRoutes.js';
import errorMiddleware from './middlewares/error.Middleware.js'
import paymentRoutes from './routes/paymentRoutes.js';
import miscellaneousRoutes from './routes/miscellaneousRoutes.js';
import { config } from 'dotenv';
config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(cookieParser());

app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
}));


//   FRONTEND_URL= 'http://localhost:5173'
// app.use(cors());



app.use("/api/v1/user", userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', miscellaneousRoutes);

app.all('*', (req, res) => {
  res.status(404).send('OOPS! 404 Page not found');
});
// app.options('*', cors());
app.use(errorMiddleware);

export default app;
