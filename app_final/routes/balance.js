var express = require('express');
var router = express.Router();
var users = require('../data/users');

/* GET user listing. */
router.get('/', function(req, res) {
  var bitcoin = req.bitcoin;
  var data = {};
  console.log('users = ' + users.length);
  for (var i = 0; i < users.length; i++) {
    console.log('user ' + users[i]);
    data[users[i]] = bitcoin.getBalanceOfAddress(users[i]);
  }
  res.json(data);
});

module.exports = router;