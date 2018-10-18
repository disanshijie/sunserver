var http = require('http');
var path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

var  fileHandle=require('../service/fileHandle');
var  resultMap=require('../util/resultMap');
var  fileUtil=require('../../util/fileUtil');
var  downloadFile=require('../util/download/download');

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
	//直接打开文件
	'/open.node':function(req,res){
        //var rootPath = req.query.rootPath;
		var raw = req.query.raw;
		var filePath = req.query.url;
		if(raw==1){	//下载
			//下载文件
			var params={
				'originalPath':filePath,
				"fileName":filePath.substring(filePath.lastIndexOf('/'),filePath.length),
				'way':2
			}
			downloadFile.simple(res,params);
		}else if(raw==2){	//文本形式
			//TODO 返回编码不对
			fs.readFile(filePath,'binary',function(err,fileContent){
				if(err){
					res.writeHead(404,"Not Found");
					res.end('<h1>404 Not Found!</h1>');
				}else{
					res.writeHead(200, {
						'Content-Type': 'text/plain',
					});
					res.write(fileContent,'binary');
					res.end();	
				}
			});
		}else {	//默认
			//异步读取文件数据
			fs.readFile(filePath,'binary',function(err,fileContent){
				if(err){
					res.writeHead(404,"Not Found");
					res.end('<h1>404 Not Found!</h1>');
				}else{
					res.writeHead(200,'ok');
					res.write(fileContent,'binary');
					res.end();	
				}
			});
		}

		//res.setHeader("Content-Type","text/plain; charset=utf-8"); 
       // res.end('当前路径是：'+ rootPath + ' 年龄是：'+fileName);
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
		var newPath=decodeURI(obj.newPath);

		var newName=obj.newName;
		var parentPath="";
		if(originalPath.length>1){
			var index=originalPath.lastIndexOf("/");
			if(index>0){
				parentPath=originalPath.substring(0,index);
			}
		}
		console.log("----重命名---");
		console.log(originalPath);
		console.log(newPath);
		console.log(parentPath+"/"+newName);
		if(parentPath){
			//----------原目录/文件--------新目录/文件-----回调函数
			fs.rename(originalPath,newPath,function(err){
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
		
		console.log("----移动---");
		console.log(originalPath);
		console.log(newName);

		fse.move(originalPath, newName, { overwrite: false }, err => {
			if (err) {
				console.error(err);
				params.msg='移动失败';
				//return console.error(err);
			}else{
				params.success=1;
				params.msg='移动成功';
				//console.log('success!');
				resultMap(res,params);
			}
		});
	},
	'/operate_delete.do':function(req,res,config){
		var params={};
		var obj = getParams(req);

		var originalPath=decodeURI(obj.originalPath);
		
		console.log("----删除---");
		console.log(originalPath);
		fse.remove(originalPath, err => {
			if (err) {
				console.error(err);
				params.msg='删除失败';
				//return console.error(err);
			}else{
				params.success=1;
				params.msg='删除成功';
				//console.log('success!');
			}
			resultMap(res,params);
		  })
	},
	'/operate_mkdirOrfile.do':function(req,res,config){
		var params={};
		var obj = getParams(req);
		//console.log(obj);

		var originalPath=decodeURI(obj.originalPath);
		var newName=decodeURI(obj.newName);
		var type=obj.type;
		
		console.log(originalPath);
		console.log(newName);
		if(type==="dir"){
			fs.mkdir(originalPath+"/"+newName, (err) => {
				if (err) {
					params.data=err;
					params.msg='创建失败';
				}else{
					params.success=1;
					params.msg='创建成功';
				}
				resultMap(res,params);
			});
		}
		/*
		fs.ensureDir(dir, err => {
			if (err) {
				console.error(err);
				params.msg='创建失败';
				//return console.error(err);
			}else{
				params.success=1;
				params.msg='创建成功';
				//console.log('success!');
			}
			resultMap(res,params);
		 });
		 */
		
		else if(type==="file"){
			fs.writeFile(originalPath+"/"+newName, '我是新写入的内容', function (err) {
				if (err) {
					params.data=err;
					params.msg='创建失败';
				}else{
					params.success=1;
					params.msg='创建成功';
				}
				resultMap(res,params);
			});
		}		
	},
	//下载图片文件，返回Base64
	'/file/downloadBase64Img.node':function(req,res,config){
		var responseBody = {};

		var obj = getParams(req);
		var originalPath=decodeURI(obj.originalPath);
		
		var filePath = originalPath;
		if(fs.existsSync(filePath)){
			var data = fs.readFileSync(filePath);
			var dataBase64 = data.toString('base64');
			responseBody ={
				code:'200',
				data:{
					filePath:filePath,
					fileData:dataBase64,
				},
				success:'1'
			};
			
		}else{
			responseBody={
				code:'400',
				msg:'没有此文件'
			};
		}
		
		resultMap(res,responseBody);
	}
	//下载文件
	,'/file/downloadFile.node':function(req,res,config){
		var responseBody = {};

		var obj = getParams(req);
		downloadFile.simple(res,obj);
	}

	
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