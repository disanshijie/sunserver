var http = require('http');
var path = require('path');
const fs = require('fs')

var  fileHandle=require('../service/fileHandle');
var  resultMap=require('../util/resultMap');
var  fileUtil=require('../../util/fileUtil');

module.exports = {
    '/get':function(req,res){
        var rootPath = req.query.rootPath;
        var fileName = req.query.fileName;
		res.setHeader("Content-Type","text/plain; charset=utf-8"); 
        res.end('当前路径是：'+ rootPath + ' 年龄是：'+fileName);
	},
    '/post':function(req,res){
    	var obj = {};
		req.msg.split('&').forEach(function(item,i){
			obj[item.split('=')[0]] = item.split('=')[1];	
		});
		res.setHeader("Content-Type","text/plain; charset=utf-8");  
		res.end('p名字是:' + obj.rootPath + ' , p年龄是:' + obj.fileName);
	},

	'/getFileList.do':function(req,res,config){
		var obj = getParams(req);
		console.log(obj);
		//var filePath=obj.rootPath;
		var result=fileHandle(req, res, obj, config);

		//res.setHeader("Content-Type","text/plain; charset=utf-8");  
		//res.end('p名字是:' + obj.rootPath + ' , p年龄是:' + obj.fileName);
	},
	'/operate_rename.do':function(req,res,config){
		var params={};
		var obj = getParams(req);
		//console.log(obj);

		var originalPath=decodeURI(obj.originalPath);
		var newName=obj.newName;
		var parentPath="";
		if(originalPath.length>1){
			var index=originalPath.lastIndexOf("/");
			if(index>0){
				parentPath=originalPath.substring(0,index);
			}
		}
		if(parentPath){
			//----------原目录/文件--------新目录/文件-----回调函数
			fs.rename(originalPath,parentPath+"/"+newName,function(err){
				if(err){
					//console.error(err);
					params.data=err;
					params.msg='重命名失败';
					//return;
				}else{
					params.success=1;
					params.msg='重命名成功';
				}
				resultMap(res,params);
			});
		}
	},
	'/operate_move.do':function(req,res,config){
		var params={};
		var obj = getParams(req);
		//console.log(obj);

		var originalPath=decodeURI(obj.originalPath);
		var newName=decodeURI(obj.newDir);
		
		console.log("----复制---");
		console.log(originalPath);
		console.log(newName);
		try {
			fileUtil.copyFile(originalPath,newName);
			params.success=1;
			params.msg='移动成功';
		} catch (error) {
			params.msg='移动失败';
		}
		resultMap(res,params);
	},
	'/operate_delete.do':function(req,res,config){
		var params={};
		var obj = getParams(req);

		var originalPath=decodeURI(obj.originalPath);
		
		console.log("----删除---");
		console.log(originalPath);
		try {
			fileUtil.deleteFolder(originalPath,newName);
			params.success=1;
			params.msg='删除成功';
		} catch (error) {
			params.msg='删除成功';
		}
		resultMap(res,params);
	},
	'/operate_mkdir.do':function(req,res,config){
		var params={};
		var obj = getParams(req);
		//console.log(obj);

		var originalPath=decodeURI(obj.originalPath);
		var newName=decodeURI(obj.newDir);
		
		console.log(originalPath);
		console.log(newName);

		fs.mkdir('dir', (err) => {
			if(err){
				//console.error(err);
				params.data=err;
				params.msg='重命名失败';
				//return;
			}else{
				params.success=1;
				params.msg='重命名成功';
			}
			resultMap(res,params);
		});
		
	},

}

//格式化参数
function getParams(req){
	var obj = {};
	req.msg.split('&').forEach(function(item,i){
		obj[item.split('=')[0]] = item.split('=')[1];	
	});
	return obj;

}

 // 对二进制进行解码
 //var body = iconv.decode(chunks, 'gbk');
 // 对字符"你"进行编码
//var reqBuff = iconv.encode('你', charset);

//设置允许跨域请求
/*
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
*/