const express = require('express'),
      router = express.Router(),
      path = require('path');

// API Hompeage - Guide
router.get('/', (req, res) => {
  res.sendFile((path.resolve('views/index.html')));
})

module.exports = router;