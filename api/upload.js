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
  let pcid = req.body.pcid;
  console.log('对应商品: ' + pcid);
  // 设置响应类型及编码
  res.set({
    'content-type': 'application/json; charset=utf-8'
  });
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
          //这里修改文件名
          let orn = file.originalname;
          let purl = 'uploadimg/' + orn;
          try {
            fs.renameSync('./tmp/upload/' + file.filename, './public/uploadimg/' + orn);
            //fs.unlinkSync('./tmp/upload/' + file.filename);
          }
          catch(er) {
            console.log('上传后文件操作失败! ' + er.toString());
            res.send('-1');
            return;
          }
          
          db.query('insert into pic_list(pname, purl, pcid) values(?,?,?)', [orn, purl, pcid], 1, function (err, result) {
            if (err) console.log(err.toString()); 
          });
           
          //获取文件基本信息
          fileInfo.mimetype = file.mimetype;
          fileInfo.originalname = file.originalname;
          fileInfo.size = file.size;
          fileInfo.path = file.path;

          fileInfos.push(fileInfo);
          console.log(fileInfo);
        }
        
        //res.end("成功!");
        res.send('1');
      }
    });

  }
});
module.exports = router;