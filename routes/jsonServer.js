var express = require('express');
var router = express.Router();

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
    res.sendStatus(500);
    return;
  }

  // Tokenのチェック

  // jsonを返却する
  var data = {
    id: id,  // レイアウトデータを識別するID値
    width: 566, // レイアウトエディタで使用するcanvasの横幅（px）
    height: 800,  // レイアウトエディタで使用するcanvasの縦幅（px）
    parts: [
      /*
      {
        partsId: 'parts001',  // レイアウトパーツを識別するID値
        posX: 10, // パーツの左上の横位置（px）
        posY: 10, // パーツの左上の縦位置（px）
        width: 80, // パーツの横幅（px）
        height: 20, // パーツの高さ（px）
        thickness: 2, // パーツの線の太さ（0:なし、1:細、2:中、3:太）
      },
      {
        partsId: 'parts002',  // レイアウトパーツを識別するID値
        posX: 10, // パーツの左上の横位置（px）
        posY: 30, // パーツの左上の縦位置（px）
        width: 200, // パーツの横幅（px）
        height: 20, // パーツの高さ（px）
        thickness: 0, // パーツの線の太さ（0:なし、1:細、2:中、3:太）
      },
      */
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
    res.sendStatus(500);
    return;
  }

  // Tokenのチェック

  // jsonを返却する
  var data = {
    parts: [
      { partsId: 'parts001', title: 'タイトル' },
      { partsId: 'parts002', title: 'クラス名' },
      { partsId: 'parts003', title: '園児名' },
      { partsId: 'parts004', title: '保育の月間目標' },
      { partsId: 'parts005', title: '今月の行事予定' },
      { partsId: 'parts006', title: '子供の姿' },
      { partsId: 'parts007', title: '養護に関わる狙い' },
      { partsId: 'parts008', title: '教育に関わる狙い' },
      { partsId: 'parts009', title: '養護に関わる内容' },
      { partsId: 'parts010', title: '教育に関わる内容' },
      { partsId: 'parts011', title: '食育' },
      { partsId: 'parts012', title: 'この時期の遊具' },
      { partsId: 'parts013', title: '配慮と環境構成' },
      { partsId: 'parts014', title: '連携' },
      { partsId: 'parts015', title: '評価' },
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
