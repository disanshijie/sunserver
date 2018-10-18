var fs = require("fs");
//var request = require('request');

var router = function(app){
   
    app.get('/one', function(req, res){
   
    });
    
    //https://blog.csdn.net/u013992330/article/details/78486909
    app.get('/file/downloadFile.node', function(req, res, next) {

        var originalPath=decodeURI(req.query.originalPath);
        var way = req.query.way;
        var fileName = req.query.fileName;
    
        console.log(req.query);
        console.log(req.body);
        console.log(originalPath);
        console.log(way);
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
                res.set({
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename=' + fileName,
                    'Content-Length': stats.size
                });
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.end(404);
            }
        } else {
            res.end(404);
        }
    });
    
};
   
  exports.router = router;
  