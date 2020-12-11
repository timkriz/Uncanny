var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/uncanny', function(req, res) {
  res.render('uncanny', { title: 'Uncanny' });
});


module.exports = router;
