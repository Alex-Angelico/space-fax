'use strict';

function display_c() {
  var refresh = 1000; // Refresh rate in milliseconds
  var mytime = setTimeout('display_ct()', refresh)
}

function display_ct() {
  var x = new Date()

  var month = x.getMonth() + 1;
  var day = x.getDate();
  var year = x.getFullYear();
  if (month < 10) { month = '0' + month; }
  if (day < 10) { day = '0' + day; }
  var x3 = month + '-' + day + '-' + year;

  // time part //
  var hour = x.getHours();
  var minute = x.getMinutes();
  var second = x.getSeconds();
  if (hour < 10) { hour = '0' + hour; }
  if (minute < 10) { minute = '0' + minute; }
  if (second < 10) { second = '0' + second; }
  var x3 = x3 + ' ' + hour + ':' + minute + ':' + second;

  document.getElementById('ct').innerHTML = x3;
  display_c();
}
