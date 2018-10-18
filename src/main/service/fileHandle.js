const fs = require('fs')
const Handlebars = require('handlebars')
const path = require('path')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const mime = require('../../util/mime')
const compress = require('../../util/compress')
const isFresh = require('../../util/cache')
const readFileToStr = require('../../util/readFileToStr')

//获取文件目录结构，并以json格式返回
module.exports = async function (req, res, params, config) {
 
    try {
        var zTree=[],idIndex=100;
        // id:5, pId:0, name
        var opt_name=params.name;
        var opt_pid=params.pId;
        var opt_id=params.id;
        var filePath=decodeURI(params.filePath);


        console.log("根路径"+filePath);
        if(filePath =="/" || filePath =="" || filePath ==null || filePath =='undefined'){
            //根路径
            filePath="D:/opt";
            opt_id=1;
            zTree.push( {id:1, pId:0, name:"D:/opt", open:true});
        }

        var stats = await stat(filePath);
        // console.log(stats);
        if(stats.isFile()) {
            //console.log("File");
            var contentType = mime(filePath).contentType
            if(isFresh(stats, req, res)) {
                res.statusCode = 304
                res.end()
                return ;
            }
            res.statusCode = 200
            res.setHeader('Content-Type', contentType)
            var rs = fs.createReadStream(filePath,{encoding: config.encoding})

            if(filePath.match(config.compress)) {
                rs = compress(rs,req, res)
            }
            rs.pipe(res)
            // 读取文件内容
            //var content = fs.readFileSync(filedir, 'utf-8');
           // console.log(content);

        } else if(stats.isDirectory()) {
            console.log("dir");
            var files = await readdir(filePath)
            var desc ={};
            for (var i =0; i<files.length; i++){
                let testPath = path.join(filePath, files[i])
                let stats = await stat(testPath)
                if(stats.isDirectory()){
                    //目录路径
                    zTree.push({id:opt_id+"_"+(++idIndex), 'pId':opt_id, name:files[i],ico_open:'',isParent: true,t:"我是title"}); //TODO

                    // files[i] = {
                    //     file: files[i],
                    //     icon: 'dir'
                    // }
                    
                }else{
                    //目录路径
                    zTree.push({id:opt_id+"_"+(++idIndex), 'pId':opt_id, name:files[i],ico_docu:'./img/bootstrap.png'});

                    var desReg=new RegExp("readme.txt",'i');
                    if(desReg.test(files[i])){
                        desc.name=files[i];
                        desc.content=readFileToStr(testPath);
                    }

                    // files[i] = {
                    //     file: files[i],
                    //     icon: mime(files[i]).icon
                    // }
                }
            }
            //console.log("组织data--");
            //获取相对路径
            //const dir = path.relative(config.root, filePath)
            //console.log(dir);

           
            console.log("组织data");
            var data = {
                title: path.basename(filePath),
                //dir: dir ? `/${dir}` : '',
               // files,
                zTree,
                prevDir:filePath,
                desc,
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json; charset=UTF-8')
            console.log(data);
            res.end(JSON.stringify(data))
        }
    } catch (error) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end(`${filePath} is not a directory or file`)
        return ;
    }
}

