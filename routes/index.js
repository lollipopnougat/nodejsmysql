/* jshint esversion: 6 */
var express = require('express');
var path = require('path');
var router = express.Router();
var db = require("../db/db"); //引入数据库封装模块


//GET 主页
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
  console.log("request ip: " + getIp(req));
});

router.get('/test', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/index.html'));
});

router.get('/login', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/login.html'));
});

router.get('/register', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/register.html'));
});

router.get('/tpch', function (req, res, next) {
  //查询r表
  db.query("select * from r;", [], function (results, fields) {
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

router.post('/logintest', function (req, res) {
  response = {
    ac: req.body.account,
    pw: req.body.password
  };
  console.log(response);
  if(response.ac == 'test' && response.pw == '123456') res.send('1');
  res.end(JSON.stringify(response));

});

module.exports = router;