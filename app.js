import express  from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from "./routes/userRoutes.js"
import courseRoutes from './routes/courseRoutes.js';
import errorMiddleware from './middlewares/error.Middleware.js'
import paymentRoutes from './routes/paymentRoutes.js';
import { config } from 'dotenv';
config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

//   FRONTEND_URL= 'http://localhost:5173'

// app.use(cors());
// http://localhost:5173/

app.get('/ping',(req,res)=>{
    res.send('Pong');
})


// routes of 3 modules;
app.use("/api/v1/user", userRoutes);
app.use('/api/v1/courses', courseRoutes );
app.use('/api/v1/payments', paymentRoutes);

app.all('*', (req,res)=>{
    res.status(404).send('OOPS! 404 Page not found');
});

app.use(errorMiddleware);

export default app;
