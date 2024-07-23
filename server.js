import dotenv from 'dotenv';
import express from 'express';
import initialize from './app/app.js';

dotenv.config({path: "./config.env"});

const app = express();
// const port = 3000;
initialize(app);
app.listen(process.env.PORT, () => console.log(`Server started listening at port ${process.env.PORT}`));