// NPM Packages
const express =        require('express');
const router =         express.Router();

// Functions
const response = require('../functions/response');

router.get('**', (req, res) => {
  response.sendErr()
})

router.post('**', (req, res) => {
  res.status(404).json({err: 'Invalid route'});
})

router.put('**', (req, res) => {
  res.status(404).json({err: 'Invalid route'});
})

router.delete('**', (req, res) => {
  res.status(404).json({err: 'Invalid route'});
})

module.exports = router;