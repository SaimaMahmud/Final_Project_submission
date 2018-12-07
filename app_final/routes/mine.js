var express = require('express');
var router = express.Router();

/* POST to add block. */
router.post('/', function(req, res) {
  req.bitcoin.minePendingTransactions(req.body);
  res.send({ msg:'' });
});

module.exports = router;
