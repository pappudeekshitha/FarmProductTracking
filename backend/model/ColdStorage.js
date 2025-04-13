// models/ColdStorage.js
const mongoose = require('mongoose');

const coldStorageSchema = new mongoose.Schema({
  location: String,
  capacity: Number,
  available: Number,
  contact: String
});

module.exports = mongoose.model('ColdStorage', coldStorageSchema);
