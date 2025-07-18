const express = require('express');
const cors = require('cors');
const ApiError = require('./app/api-error');
const contactRouter = require('./app/routes/contact.route');
const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to book application1' });
    });
app.use('/api/contacts', contactRouter);

app.use((req, res, next) => {
   return next(new ApiError(404, 'Resource not found'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({message: err.message || 'Internal Server Error'});
});
module.exports = app;

