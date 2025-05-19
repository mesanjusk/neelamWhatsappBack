const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

let store = null;

const initMongoStore = async () => {
  await mongoose.connect('mongodb+srv://sanjuahuja:cY7NtMKm8M10MbUs@cluster0.wdfsd.mongodb.net/framee', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  store = new MongoStore({ mongoose });
  console.log('🗄️ MongoStore initialized');
};

const getStore = () => {
  if (!store) {
    throw new Error('MongoStore not initialized');
  }
  return store;
};

module.exports = { initMongoStore, getStore };
