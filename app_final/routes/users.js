var express = require('express');
var router = express.Router();
var users = require('../data/users');

/* GET user listing. */
router.get('/all', function(req, res) {
  res.json({"users": users});
});

module.exports = router;
