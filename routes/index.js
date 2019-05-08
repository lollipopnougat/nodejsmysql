/* jshint esversion: 6 */ 
var express = require('express');
var path = require('path');
var router = express.Router();
var db = require("../db/db"); //引入数据库封装模块
//GET 主页
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/index.html'));
});

router.get('/tpch', function (req, res, next) {
  //查询r表
  db.query("select * from r;",[],function (results,fields) {
    let sresults = {
      "code": 0,
      "msg": "",
      "count": 6,
      "data": results
    };
    console.log(sresults);
    res.json(sresults);
    //res.render('index', { title: 'Express11' });
  });
});

module.exports = router;
