'use strict';

function display_c() {
  var refresh = 1000; // Refresh rate in milliseconds
  var mytime = setTimeout('display_ct()', refresh)
}

function display_ct() {
  var zulu = new Date()

  var year = zulu.getUTCFullYear();
  var month = zulu.getUTCMonth() + 1;
  var day = zulu.getUTCDate();
  if (month < 10) { month = '0' + month; }
  if (day < 10) { day = '0' + day; }
  var zuluDate = `${year}-${month}-${day}`;

  // time part //
  var hour = zulu.getUTCHours();
  var minute = zulu.getUTCMinutes();
  var second = zulu.getUTCSeconds();
  if (hour < 10) { hour = '0' + hour; }
  if (minute < 10) { minute = '0' + minute; }
  if (second < 10) { second = '0' + second; }
  var zuluTime = `${hour}:${minute}:${second}`;

  $('#zd').text(zuluDate);
  $('#zt').text(zuluTime);
  display_c();
}

$('body').attr('onload', 'display_ct()');