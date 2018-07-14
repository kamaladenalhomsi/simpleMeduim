const express = require('express')
const router = express.Router()

router.get('/sign', (req, res) => {
  console.log(req.body);
});

module.exports = router