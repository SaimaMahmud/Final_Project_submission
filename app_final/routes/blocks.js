var express = require('express');
var router = express.Router();

/* GET user listing. */
router.get('/all', function(req, res) {
  var bitcoin = req.bitcoin;
  res.json(bitcoin.chain);
});

module.exports = router;