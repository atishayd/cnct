const express = require('express');
const router = express.Router();

// Sender routes will be implemented later
router.get('/', (req, res) => {
  res.json({ message: 'Sender routes not implemented yet' });
});

module.exports = router; 