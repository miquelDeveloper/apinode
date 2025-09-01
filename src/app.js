const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');
const httpsRedirect = require('./middleware/httpsRedirect');
require('dotenv').config();

const app = express();

app.use(express.json());

// Only apply HTTPS redirect in development (Vercel handles HTTPS automatically)
if (process.env.NODE_ENV === 'development') {
    app.use(httpsRedirect);
}

app.use('/users', usersRoutes);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

module.exports = app;