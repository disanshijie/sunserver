var multer = require('multer');//引入multer
var upload = multer({dest: 'uploads/'});//设置上传文件存储地址

//TODO https://blog.csdn.net/qq_36228442/article/details/81709272?utm_source=blogxgwz0
router.post('/uploadFile.node', upload.single('file'), (req, res, next) => {
 
    let ret = {};
    ret['code'] = 20000;
    var file = req.file;
    if (file) {
        var fileNameArr = file.originalname.split('.');
        var suffix = fileNameArr[fileNameArr.length - 1];
        //文件重命名
        fs.renameSync('./uploads/' + file.filename, `./uploads/${file.filename}.${suffix}`);
        file['newfilename'] = `${file.filename}.${suffix}`;
    }
    ret['file'] = file;
    res.send(ret);
})
