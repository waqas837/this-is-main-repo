require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('module-alias/register');

const { errorHandler, notFound } = require('@middlewares/errorMiddleware.js');
const { connectDB } = require('@config/database.js');
const vendorRoutes = require('@routes/vendor.routes.js');
const hotelRoutes = require('@routes/hotel.routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

connectDB();


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});






app.use('/api/vendor', vendorRoutes);
app.use('/api/hotel', hotelRoutes);

app.use(errorHandler);
app.use(notFound);





app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
