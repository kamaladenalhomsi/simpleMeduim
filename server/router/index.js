const express = require('express')
const router = express.Router()

router.post('/sign', (req, res) => {
  console.log(req.body);
});

router.get('/sign', (req, res) => {
  console.log(req.body);
});

module.exports = router