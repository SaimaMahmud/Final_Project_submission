var BlockChain = require('../libraries/blockchain');
var express = require('express');
var router = express.Router();

/* GET transaction listing. */
router.get('/all', function(req, res) {
  res.json(req.bitcoin.pendingTransactions);
});

/* POST to add transaction. */
router.post('/add', function(req, res) {
  console.log(req.body);
  if (req.bitcoin.createTransaction(req.body)) {
    res.send({ msg:'' });
  }
  else {
    res.send({ error:'' });
  }
});

/* DELETE to reset. */
router.delete('/reset/:difficult', function(req, res) {
  req.bitcoin.reset(req.params.difficult);
  res.send({ msg:'' });
});

module.exports = router;
