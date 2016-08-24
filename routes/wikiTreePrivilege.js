var express = require('express');
var router = express.Router();

/* GET contact page. */
router.get('/', function(req, res, next) {
  res.render('wikiTreePrivilege', {
    wikiManage: 'active'
  });
});

module.exports = router;
