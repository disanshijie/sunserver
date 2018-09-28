const http = require('http')
const conf = require('../config/defaultConf')
const chalk = require('chalk')
const path = require('path')
const url = require('url');
var fs=require("fs");

//const router = require('./router')
const ajaxHandle = require('./control/ajaxHandle')
const openUrl = require('../util/openUrl')

class Server {
    constructor(config) {
        this.conf = Object.assign({}, conf, config)
    }
    start() {
        const server = http.createServer((req, res) => {
           // const filePath = path.join(this.conf.root, req.url)
           // router(req, res, filePath, this.conf)
           console.log(req.method);
            var pathObj = url.parse(req.url, true);
            //新添处理路由的代码
            var handleFn = ajaxHandle[pathObj.pathname];
            if(handleFn){
                req.query = pathObj.query;    //获取get提交方式数据
                console.log('query值');
                console.log(req.query);

                var msg = '';
                req.on('data',function(chunk){
                    console.log('chunk值'+chunk);
                    msg += chunk;		      //获取post提交方式数据
                }).on('end',function(){
                    
                    //req.msg = iconv.decode(msg, 'utf-8');
                    req.msg = decodeURIComponent(msg); //encodeURIComponent
                   // req.msg = decodeURI(msg); //encodeURIComponent
                    handleFn(req, res,this.conf);
                });

            }else{

                var staticPath = path.join(this.conf.root,'web');
                //如果没有后缀，默认他显示是index.html
                if(pathObj.pathname =='/'){
                    //pathObj.pathname += 'index.html';	 
                    pathObj.pathname += 'module/ztree/treeList.html';	 
                    res.writeHead(302,{
                        //'Location': 'module/ztree/treeList.html'
                        'Location': 'module/ztree/async.html'
                    })
                    res.end();
                    return ;
                }
                var filePath = path.join(staticPath,pathObj.pathname);
                console.log("请求路径："+filePath);
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

        })
        
        server.listen(this.conf.port, this.conf.hostname, () => {
            const addr = `http://${this.conf.hostname}:${this.conf.port}`
            console.log(`server at: ${chalk.green(addr)}`)
            openUrl(addr)
        })
    }
}

module.exports = Server