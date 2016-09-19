var express = require('express');
var router = express.Router();

/* GET contact page. */
router.get('/', function(req, res, next) {
  res.render('adsBuild', {
    ads: 'active',
    appId: req.query.id,
  });
});

module.exports = router;
