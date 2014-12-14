var ss = SpreadsheetApp.openById('1f6JbfA7aoWvM7mMEHVpBOaQviCdNbACVe1vluLR3qVg'),
    sheets = ss.getSheets();

function doGet(e) {
  var t = HtmlService.createTemplateFromFile('index');
  return t.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle('Angular-GAS-Zoo');
}

function require(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getData() {
  var ret = {validUser: isValidUser(), data: {}};
  sheets.forEach(function(sh) {
    ret.data[sh.getName()] = sh.getDataRange().getValues();
  });
  return JSON.parse(JSON.stringify(ret));
}

function create(shName, arr, shIndex) {
  if (!isValidUser()) return {error: "Invalid user"};
  var sh = ss.getSheetByName(shName);
  if (!sh) return {error: 'Invalid sheet name'};
  var lastColumn = sh.getLastColumn(), lastRow = sh.getLastRow(), id = sh.getRange(lastRow, 1).getValue() + 1;
  arr[0] = typeof id === 'number' ? id : 1;
  var data = arr.slice(0, lastColumn);
  sh.getRange(lastRow + 1, 1, 1, lastColumn).setValues([data]);
  return {data: data, shIndex: shIndex};
}

function remove(shName, id, shIndex, itemIndex) {
  if (!isValidUser()) return {error: "Invalid user"};
  var sh = ss.getSheetByName(shName);
  if (!sh) return {error: 'Invalid sheet name'};
  var rowIndex = getRowIndex_(sh, id);
  if (!rowIndex) return {error: 'Invalid item id'};
  sh.deleteRow(rowIndex);
  return {shIndex: shIndex, itemIndex: itemIndex};
}

function getRowIndex_(sh, id) {
  var values = sh.getDataRange().getValues(), i = 0, len = values.length;
  for (; i < len; i += 1) {
    if (values[i][0] == id) return i + 1;
  }
}

function update(shName, arr, shIndex, itemIndex) {
  if (!isValidUser()) return {error: "Invalid user"};
  var sh = ss.getSheetByName(shName);
  if (!sh) return {error: 'Invalid sheet name'};
  var rowIndex = getRowIndex_(sh, arr[0]);
  if (!rowIndex) return {error: 'Invalid item id'};
  var lastColumn = sh.getLastColumn();
  var data = arr.slice(0, lastColumn);
  sh.getRange(rowIndex, 1, 1, lastColumn).setValues([data]);
  return {data: data, shIndex: shIndex, itemIndex: itemIndex};
}

function isValidUser() {
  return true;
}
