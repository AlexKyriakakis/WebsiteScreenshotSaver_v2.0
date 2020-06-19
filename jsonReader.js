const fs = require('fs');

let rawdata = fs.readFileSync('data.json');
var data = JSON.parse(rawdata);

exports.data = data;
