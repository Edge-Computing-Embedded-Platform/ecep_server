var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('userDashboard', { title: 'Express' });
  //res.send('respond with a resource...');
});

module.exports = router;
