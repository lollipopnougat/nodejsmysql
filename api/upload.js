var fs = require('fs');
var express = require('express');
var multer = require('multer');

var router = express.Router();
/*
var upload = multer({
  dest: 'tmp/upload'
});*/
/*
router.post('/', upload.any(), function (req, res, next) {
  console.log(req.files[0]); // 上传的文件信息

  var des_file = "./public/images/upload/" + req.files[0].originalname;
  fs.readFile(req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        console.log(err);
      } else {
        response = {
          message: '上传成功',
          filename: req.files[0].originalname
        };
        console.log(response);
        res.end(JSON.stringify(response));
      }
    });
  });
});
*/
router.post('/', multer({
  //设置文件存储路径
  dest: 'tmp/upload/'
}).array('file', 10), function (req, res, next) { //这里10表示最大支持的文件上传数目
  let files = req.files;
  if (files.length === 0) {
    res.render("error", {
      message: "上传文件不能为空！"
    });
    return
  } else {
    let fileInfos = [];
    for (var i in files) {
      let file = files[i];
      let fileInfo = {};

      fs.renameSync('./tmp/upload/' + file.filename, './public/images/upload/' + file.originalname); //这里修改文件名。

      //获取文件基本信息
      fileInfo.mimetype = file.mimetype;
      fileInfo.originalname = file.originalname;
      fileInfo.size = file.size;
      fileInfo.path = file.path;

      fileInfos.push(fileInfo);
      console.log(fileInfo);
    }
    // 设置响应类型及编码
    res.set({
      'content-type': 'application/json; charset=utf-8'
    });
    res.end("success!");
  }
});
module.exports = router;