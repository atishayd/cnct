const express = require('express');
const router = express.Router();

// Email routes will be implemented later
router.get('/', (req, res) => {
  res.json({ message: 'Email routes not implemented yet' });
});

module.exports = router; 