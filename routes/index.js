var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Uncanny project' });
});
router.get('/uncanny', function(req, res) {
  res.render('uncanny', { title: 'Uncanny' });
});
router.get('/info', function(req, res) {
  res.render('info', { title: 'Info' });
});
router.get('/travel', function(req, res) {
  res.render('travel', { title: 'Travel' });
});

module.exports = router;
