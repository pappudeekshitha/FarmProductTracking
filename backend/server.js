const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ColdStorage = require('./model/ColdStorage');

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/coldStorageDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// POST route to register cold storage
app.post('/api/cold-storages', async (req, res) => {
  const { location, capacity, available, contact } = req.body;

  if (!location || !capacity || !available || !contact) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newStorage = new ColdStorage({ location, capacity, available, contact });
    await newStorage.save();
    console.log('✅ New cold storage saved to DB:', newStorage);
    res.status(201).json({ message: 'Cold storage registered successfully' });
  } catch (error) {
    console.error('❌ Error saving to DB:', error);
    res.status(500).json({ message: 'Failed to save cold storage' });
  }
});

// Optional: GET all cold storages
app.get('/api/coldstorages', async (req, res) => {
  try {
    const storages = await ColdStorage.find();
    res.json(storages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cold storages' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
