const express = require('express');
const cors = require('cors');
const path = require('path');
const drogaRoutes = require('./routes/drogas.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/droga', drogaRoutes);

module.exports = app;
