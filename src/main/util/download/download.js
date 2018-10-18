var path = require('path');
var fs = require('fs');

//https://blog.csdn.net/u013992330/article/details/78486909

/**
 *  简单的 下载文件
 *  //TODO 下载后卡住 好像是没有 结束流
 * @param {*} res
 * @param {*} params
 */
function downloadFileSimple(res,params){

    var originalPath=decodeURI(params.originalPath);
    var way = params.way;
    var fileName = params.fileName;
    console.log(fileName);
    if (way == 1) {
        //直接访问文件进行下载
        res.redirect(originalPath);
    } else if (way == 2) {
        //以文件流的形式下载文件
        var filePath = originalPath;
        var stats = fs.statSync(filePath);
        var isFile = stats.isFile();
       
        if(isFile){
            //设置响应头
            //res.set({
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',//告诉浏览器这是一个二进制文件
                'Content-Disposition': 'attachment; filename=' + encodeURI(fileName),//告诉浏览器这是一个需要下载的文件
                'Content-Length': stats.size
            });
            //fs.createReadStream(filePath).pipe(res); //错误
            var readStream = fs.createReadStream(filePath);//得到文件输入流
            debugger
            readStream.on('data', (chunk) => {
                res.write(chunk, 'binary');//文档内容以二进制的格式写到response的输出流
            });
            readStream.on('end', () => {
                res.end();
            })
        } else {
            res.end(404);
        }
    } else {
        res.end(404);
    }
};

exports.simple = downloadFileSimple;
