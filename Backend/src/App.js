const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser())

// Importing Routes
const authRouter = require('./Routes/Routes.auth');


app.use('/api/auth', authRouter);

module.exports = app; 