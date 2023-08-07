import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || '';

mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Connection is successful');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });