// routes/atlasSearchRoutes.js
const express = require('express');
const router = express.Router();
const atlasSearchController = require('../controllers/atlasSearchController');

// Define your route, e.g., a POST request to create the Atlas Search index
router.post('/createAtlasSearchIndex', async (req, res) => {
  try {
    await atlasSearchController.createAtlasSearchIndex(req.body.publicKey, req.body.privateKey, req.body.projectId);
    res.status(200).json({ message: 'Atlas Search index creation initiated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
