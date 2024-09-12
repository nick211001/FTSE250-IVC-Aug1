// src/config/config.js

const path = require('path');

module.exports = {
    dataDirectory: path.join(__dirname, '../backend/data'),
    port: process.env.PORT || 3000,
};
