var express = require('express');
var app = express();//创建express实例
var routes=require('./routes.js');//吧路由引入；
 
routes.router(app);//调用路由

var server = app.listen(8001, function () {
 
  var host = server.address().address
  var port = server.address().port
  console.log(__dirname);//这里的目录就是/Users/wofu/Desktop/node，其中node文件夹我是直接放在了桌面
	console.log(host);//主机地址
	console.log(port);//端口号
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})