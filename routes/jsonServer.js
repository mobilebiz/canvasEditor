var express = require('express');
var router = express.Router();

var _token = 'abcdefg';
/**
 * layout
 * レイアウトデータを返却する
 */
router.post('/layout', function(req, res, next) {
  console.log('layout called.');

  var id = req.body.id || '';
  var token = req.body.token || '';

  if (id === '' || token === '') {
    console.error('パラメータが不正です。');
    var results = {
      status: 'NG',
      reason: 'パラメータが不正です。'
    };
    res.json(results);
    return;
  }

  // Tokenのチェック
  if (token !== _token) {
    console.error('トークンが一致しません。');
    var results = {
      status: 'NG',
      reason: 'トークンが一致しません。'
    };
    res.json(results);
    return;
  }

  // jsonを返却する
  var data = {
    width: 566, // レイアウトエディタで使用するcanvasの横幅（px）
    height: 800,  // レイアウトエディタで使用するcanvasの縦幅（px）
    parts: [
    ]
  };
  res.json(data);

});

/**
 * parts
 * 部品データを返却する
 */
router.post('/parts', function(req, res, next) {
  console.log('parts called.');

  var id = req.body.id || '';
  var token = req.body.token || '';

  if (id === '' || token === '') {
    console.error('パラメータが不正です。');
    var results = {
      status: 'NG',
      reason: 'パラメータが不正です。'
    };
    res.json(results);
    return;
  }

  // Tokenのチェック
  if (token !== _token) {
    console.error('トークンが一致しません。');
    var results = {
      status: 'NG',
      reason: 'トークンが一致しません。'
    };
    res.json(results);
    return;
  }

  // jsonを返却する
  var data = {
    parts: [
      { partsId: 'parts001', title: 'パーツ１' },
      { partsId: 'parts002', title: 'パーツ２' },
      { partsId: 'parts003', title: 'パーツ３' },
      { partsId: 'parts004', title: 'パーツ４' },
      { partsId: 'parts005', title: 'パーツ５' },
      { partsId: 'parts006', title: 'パーツ６' },
      { partsId: 'parts007', title: 'パーツ７' },
      { partsId: 'parts008', title: 'パーツ８' },
      { partsId: 'parts009', title: 'パーツ９' },
    ]
  };
  res.json(data);

});

/**
 * saveLayout
 * 部品データを返却する
 */
router.post('/saveLayout', function(req, res, next) {
  console.log('saveLayout called.');

  var id = req.body.id || '';
  var token = req.body.token || '';
  var layout = req.body.layout || {};

  if (id === '' || token === '') {
    console.error('パラメータが不正です。');
    var results = {
      status: 'NG',
      reason: 'パラメータが不正です。'
    };
    res.json(results);
    return;
  }

  // Tokenのチェック

  console.log(JSON.parse(layout));

  // 結果を返却する
  var results = {
    status: 'OK',
    reason: ''
  };
  res.json(results);
});

module.exports = router;
