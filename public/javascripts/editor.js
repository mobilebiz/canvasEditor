// 帳票編集画面

var _id = null;
var _token = null;
var _layout = null;
var _parts = null;
var _canvas = null;
var _selectedParts = null;

var _rects = [];
var _texts = [];
var _line1s = [];
var _line2s = [];
var _line3s = [];
var _line4s = [];

var grid = 10; // グリッド表示の単位（px）

// 処理画面の描画
function drawInit() {
  var w = _layout.width;
  var h = _layout.height;
  $('#myCanvas').attr('width', w);
  $('#myCanvas').attr('height', h);

  _canvas = new fabric.Canvas('myCanvas');
  _canvas.selection = false; // グループ選択を禁止する

  // 線種選択ポップオーバー
  ons.createPopover('popover.html');

  // 保存ボタン
  $("#btn_save").on('click', btn_save_click);

  // イベント
  // パーツが選択された
  _canvas.on('object:selected', function(e) {
    console.log('object selected. ' + e.target.index + '/' + _layout.parts.length);
    $("#btn_line").removeAttr("disabled");
    $("#btn_line").off('click');
    $("#btn_line").on('click', { index: e.target.index }, btn_line_click);
    $("#btn_delete").removeAttr("disabled");
    $("#btn_delete").off('click');
    $("#btn_delete").on('click', { index: e.target.index }, btn_delete_click);
    for (var i=0; i<4; i++) {
      $("#btn_popover_"+i).removeAttr("disabled");
      $("#btn_popover_"+i).off('click');
      $("#btn_popover_"+i).on('click', { stroke: i, index: e.target.index }, btn_popover_select);
    }
  });
  // パーツの選択が外れた
  _canvas.on('selection:cleared' ,function() {
    $("#btn_line").attr("disabled", "disabled");
    $("#btn_delete").attr("disabled", "disabled");
    for (var i=0; i<4; i++) {
      $("#btn_popover_"+i).off('click');
    }
  });

  // パーツリストを描画
  drawPartList();

  // パーツの描画
  _layout.parts.forEach(function(part, index) {
    drawPart(part, index);
  });
};

// パーツリストの描画
function drawPartList() {
  // リストを作成
  var content = document.getElementById("partsList");
  content.innerHTML = '';
  if (_parts) {
    _parts.parts.forEach(function(part, index) {
      content.innerHTML += '<ons-list-item modifier="chevron" onclick="list_parts_click('+index+');">'+part.title+'</ons-list-item>';
    });
  }
  ons.compile(content);

};

// パーツリストを選択
function list_parts_click(index) {
  var parts = {};
  parts.partsId = _parts.parts[index].partsId;  // パーツID
  parts.posX = 0;  // Left position
  parts.posY = 0;  // Top position
  parts.width = 150;  // 幅
  parts.height = 20;  // 高さ
  parts.thickness = 1;  // 線の太さ（細）
  // レイアウトデータに追加
  _layout.parts.push(parts);
  // 描画
  drawPart(parts, _layout.parts.length - 1);

};

// パーツの描画
function drawPart(part, index) {
  // パーツのプロパティを取得
  var left = part.posX, top = part.posY, width = part.width, height = part.height;
  var stroke = '#000';  // 線の色
  var strokeWidth = 1;  // 線の幅
  switch (part.thickness) {
    case 0:
      stroke = null;
      break;
    case 1:
    case 2:
    case 3:
      strokeWidth = part.thickness;
      break;
    default:
  }

  var rect = new fabric.Rect({
    fill: '#eee',
    width: width,
    height: height,
    top: top,
    left: left,
    lockRotation: true,
    selectable: true,
    minScaleLimit: 1,
    index: index
  });
  rect.on('moving', function() {
    // 枠ハズレチェック
    if (rect.getTop() < 0) rect.set('top', 0);
    if (rect.getLeft() < 0) rect.set('left', 0);
    if (rect.getTop()+rect.getHeight() > _canvas.getHeight()) rect.set('top', _canvas.getHeight()-rect.getHeight());
    if (rect.getLeft()+rect.getWidth() > _canvas.getWidth()) rect.set('left', _canvas.getWidth()-rect.getWidth());
    rect.setLeft(Math.floor(rect.getLeft()) - (Math.floor(rect.getLeft()) % grid));
    rect.setTop(Math.floor(rect.getTop()) - (Math.floor(rect.getTop()) % grid));
    _layout.parts[index].posX = rect.getLeft();
    _layout.parts[index].posY = rect.getTop();
    movingAndScaling();
  });
  rect.on('modified', function() {
    var width = Math.floor(rect.width * rect.scaleX) - (Math.floor(rect.width * rect.scaleX) % grid);
    var height = Math.floor(rect.height * rect.scaleY) - (Math.floor(rect.height * rect.scaleY) % grid);
    rect.set({
      width: width,
      height: height,
      scaleX: 1,
      scaleY: 1
    });

    // 枠ハズレチェック
    if (rect.getTop() < 0) {
      rect.set('top', 0);
      rect.set('height', (rect.getHeight() + rect.getTop()));
    }
    if (rect.getLeft()+rect.getWidth() > _canvas.getWidth()) {
      rect.set('width', rect.getWidth() - ((rect.getLeft() + rect.getWidth()) - _canvas.getWidth()));
    }
    _layout.parts[index].posX = rect.getLeft();
    _layout.parts[index].posY = rect.getTop();
    _layout.parts[index].width = rect.getWidth();
    _layout.parts[index].height = rect.getHeight();
    movingAndScaling();
  });
  rect.on('scaling', function() {
    /*
    console.log(rect);
    // 縦横比を再計算
    var newWidth = rect.getWidth() * Math.abs(rect.getScaleX());
    var newHeight = rect.getHeight() * Math.abs(rect.getScaleY());
    rect.set({
      width: Math.floor(newWidth),
      height: Math.floor(newHeight),
      scaleX: 1,
      scaleY: 1
    });
    // 枠ハズレチェック
    if (rect.getTop() < 0) {
      rect.set('top', 0);
      rect.set('height', (rect.getHeight() + rect.getTop()));
    }
    if (rect.getLeft()+rect.getWidth() > _canvas.getWidth()) {
      rect.set('width', rect.getWidth() - ((rect.getLeft() + rect.getWidth()) - _canvas.getWidth()));
    }
    _layout.parts[index].posX = rect.getLeft();
    _layout.parts[index].posY = rect.getTop();
    _layout.parts[index].width = rect.getWidth();
    _layout.parts[index].height = rect.getHeight();
    movingAndScaling();
    */
  });

  function movingAndScaling() {
    // テキストを追随
    text.set('top', rect.getTop() + 2);
    text.set('left', rect.getLeft() + 2);
    // 枠線を追随
    line1.set({ 'x1': rect.getLeft(), 'y1': rect.getTop(), 'x2': rect.getLeft()+rect.getWidth(), 'y2': rect.getTop() });
    line2.set({ 'x1': rect.getLeft()+rect.getWidth(), 'y1': rect.getTop(), 'x2': rect.getLeft()+rect.getWidth(), 'y2': rect.getTop()+rect.getHeight() });
    line3.set({ 'x1': rect.getLeft()+rect.getWidth(), 'y1': rect.getTop()+rect.getHeight(), 'x2': rect.getLeft(), 'y2': rect.getTop()+rect.getHeight() });
    line4.set({ 'x1': rect.getLeft(), 'y1': rect.getTop()+rect.getHeight(), 'x2': rect.getLeft(), 'y2': rect.getTop() });
  };

  // テキスト
  var text = new fabric.Text(getTitle(part.partsId), {
    fontSize: 12,
    top: top + 2,
    left: left + 2,
    fill: '#666',
    selectable: false
  });

  // 枠線
  var line1 = makeLine([ rect.getLeft(), rect.getTop(), rect.getLeft()+rect.getWidth(), rect.getTop() ], stroke, strokeWidth),
      line2 = makeLine([ rect.getLeft()+rect.getWidth(), rect.getTop(), rect.getLeft()+rect.getWidth(), rect.getTop()+rect.getHeight() ], stroke, strokeWidth),
      line3 = makeLine([ rect.getLeft()+rect.getWidth(), rect.getTop()+rect.getHeight(), rect.getLeft(), rect.getTop()+rect.getHeight() ], stroke, strokeWidth),
      line4 = makeLine([ rect.getLeft(), rect.getTop()+rect.getHeight(), rect.getLeft(), rect.getTop() ], stroke, strokeWidth);

  // 配列に保存
  _rects[index] = rect;
  _texts[index] = text;
  _line1s[index] = line1;
  _line2s[index] = line2;
  _line3s[index] = line3;
  _line4s[index] = line4;

  // 描画
  _canvas.add(_rects[index], _texts[index], _line1s[index], _line2s[index], _line3s[index], _line4s[index]);

};

// 枠線の描画
function makeLine(coords, stroke, strokeWidth) {
  return new fabric.Line(coords, {
    fill: null,
    stroke: stroke,
    strokeWidth: strokeWidth,
    selectable: false
  });
};

// パーツのタイトル取得
function getTitle(partsId) {
  var title = 'N/A';
  _parts.parts.forEach(function(part, index) {
    if (part.partsId === partsId) title = part.title;
  });
  return title;
};

// パーツの削除
function btn_delete_click(e) {
  _layout.parts.splice(e.data.index, 1); // レイアウトデータ上でオブジェクトを削除
  console.log('_layout.parts.length:'+_layout.parts.length);
  _canvas.clear();
  _layout.parts.forEach(function(part, index) {
    drawPart(part, index);
  });
};

// 線種の選択
function btn_line_click(e) {
  popover.show(this);
};
function btn_popover_select(e) {
  var index = e.data.index;
  var stroke = e.data.stroke;
  console.log(index, stroke);
  _layout.parts[index].thickness = stroke;
  _canvas.clear();
  _layout.parts.forEach(function(part, index) {
    drawPart(part, index);
  });
  popover.hide();
};

// 保存ボタンを押下
function btn_save_click() {
  // レイアウトデータを取得
  var params = {
    id: _id,
    token: _token,
    layout: JSON.stringify(_layout)
  };
  $.ajax({
    type: "POST",
    url: "saveLayout",
    data: params,
    timeout: 10000,
    success: function(results) {
      if (results.status === 'NG') {
        alert('サーバ保存時にエラーが発生しました。（'+results.reason+'）');
        return false;
      }
    },
    error: function(err) {
      alert('エラーが発生しました');
      return false;
    }
  });

};

ons.bootstrap();
ons.ready(function() {
  // idとtokenを取得する
  _id = $("#id").text();
  _token = $("#token").text();

  // レイアウトデータを取得
  var params = {
    id: _id,
    token: _token
  };
  $.ajax({
    type: "POST",
    url: "layout",
    data: params,
    timeout: 10000,
    success: function(layout) {
      _layout = layout;
      // 部品データを取得
      $.ajax({
        type: "POST",
        url: "parts",
        data: params,
        timeout: 10000,
        success: function(parts) {
          _parts = parts;
          drawInit();
        },
        error: function(err) {
          alert('エラーが発生しました('+err.message+')');
          return false;
        }
      });
    },
    error: function(err) {
      alert('エラーが発生しました('+err.message+')');
      return false;
    }
  });

});
