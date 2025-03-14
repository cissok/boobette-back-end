require('dotenv').config();

const express = require('express');
const listEndpoints = require('express-list-endpoints');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', userRoutes);

app.get('/endpoints', (req, res) => {
  res.json(listEndpoints(app));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});