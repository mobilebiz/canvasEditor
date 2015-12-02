var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('editor called.');

  var id = req.query.id || '';
  var token = req.query.token || '';

  if (id === '' || token === '') {
    var err = new Error('パラメータが不正です。');
    err.status = 500;
    next(err);
    return;
  }

  res.render('editor', {
    id: id,
    token: token
  });
});

module.exports = router;
