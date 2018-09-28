const fs = require('fs')
const iconv = require('iconv-lite');

module.exports = function(filePath) {

    var fileStr = fs.readFileSync(filePath, {encoding:'binary'});
    var buf = new Buffer(fileStr, 'binary');
    //var str = iconv.decode(buf,'utf8');
    var str = iconv.decode(buf,'gbk');
   // str= str.replaceAll("\r\n","<br/>");
    return  str;
}