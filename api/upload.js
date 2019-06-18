/* jshint esversion: 6 */
var fs = require('fs');
var express = require('express');
var multer = require('multer');
var db = require('../db/db');
var router = express.Router();

//设置文件暂存路径
var loadfile = multer({
  dest: 'tmp/upload/'
});
router.post('/', loadfile.array('file', 10), function (req, res, next) {
  //这里10表示最大支持的文件上传数目
  console.log('参数: ' + req.body.pcid + req.query.pcid);
  for (let j in req.files)
  {
    console.log(j);
  }

  let adp = {};
  let files = req.files;
  if (files.length === 0) {
    res.send('上传文件不能为空');
    return;
  } else {
    db.query('select 6-(select count(pid) from pic_list where pcid=?) as c', req.body.pcid, 1, function (err, result, fields) {
      let alnum = parseInt(result[0].c);
      if (alnum <= 0) {
        res.send('0');
        return;
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
        //res.end("成功!");
        res.send('1');
      }
    });

  }
});
module.exports = router;