// NPM Packages
const express =        require('express');
const router =         express.Router();

// Functions
const response = require('../functions/response');

router.get('', (req, res) => {
  response.sendErr(500, 'Invalid Route', res);
})

router.post('', (req, res) => {
  response.sendErr(500, 'Invalid Route', res);
})

router.put('', (req, res) => {
  response.sendErr(500, 'Invalid Route', res);
})

router.delete('', (req, res) => {
  response.sendErr(500, 'Invalid Route', res);
})

module.exports = router;