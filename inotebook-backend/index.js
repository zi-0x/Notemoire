const connectToMongo = require('./db');
const express = require('express'); 
var cors = require('cors')
const app = express(); 
const port = 5000;

app.use(express.json());

connectToMongo(); 

// Routes which are available
app.use (cors())
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.listen(port, () => {
  console.log(`iNotebbok-backend listening on port https://notemore-dashboard.onrender.com/:${port}`);
