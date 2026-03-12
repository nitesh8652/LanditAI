const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true 
}))

// Importing Routes
const authRouter = require('./Routes/Routes.auth');


app.use('/api/auth', authRouter);

module.exports = app; 