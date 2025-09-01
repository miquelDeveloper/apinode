const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');
const httpsRedirect = require('./middleware/httpsRedirect');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(httpsRedirect);
app.use('/users', usersRoutes);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;