import express, { Express } from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './db/connect';

import routes from './routes/api/v1'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Enable cors
app.use(cors());
app.options('*', cors());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(ExpressMongoSanitize());

// v1 api routes
app.use('/api/v1', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
