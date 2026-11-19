const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb://localhost:27017/customer-feedback';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Customer Feedback API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
