const express = require('express');
const httpsRedirect = require('./middleware/httpsRedirect');
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.use(httpsRedirect);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});