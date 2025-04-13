// routes/coldStorageRoutes.js
const express = require('express');
const router = express.Router();
const ColdStorage = require('../model/ColdStorage'); // Importing the model

// Route to register cold storage
router.post('/coldstorages', (req, res) => {
  const {location, capacity,available, contact } = req.body;

  const newColdStorage = new ColdStorage({
    location,
    capacity,
    available,
    contact
  });

  newColdStorage.save()
    .then(() => res.status(201).send('Cold storage registered successfully'))
    .catch(err => res.status(400).send('Error saving cold storage details: ' + err));
});

module.exports = router;
