const express = require('express');
const app = express();
const morgan = require('morgan');
const connectDB = require('./db/connect');
require('dotenv').config()
// middleware
app.use(express('dev'));
app.use(express.json());
app .use(express.urlencoded({ extended: false }))

// routes
app.get('/', (req, res) => {
    res.send('Hello World, Welcome to The Central Bank of Learnable !');
});

// app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));


const port = 8080

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server started at port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();