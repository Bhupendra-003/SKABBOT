const express = require('express');
const serverless = require('serverless-http');
const app = require('../app.js');
const path = require('path');

// Set the views directory for the serverless function
app.set('views', path.join(__dirname, '../views'));

module.exports.handler = serverless(app);