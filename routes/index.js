/* jshint esversion: 6 */
var express = require('express');
var path = require('path');
var router = express.Router();
var db = require("../db/db"); //引入数据库封装模块
var session = require('express-session');

//GET 主页
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
  console.log("request ip: " + getIp(req));
});

router.get('/test', function (req, res, next) {
  if (req.session.userName == 'test') { //判断session 状态，如果有效，则返回主页，否则转到登录页面
    res.sendfile(path.join(__dirname, '../pages/index.html'));
  } else {
    console.log('req.session.userName is ' + req.session.userName);
    res.redirect('/login');
  }
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
  if (response.ac == 'test' && response.pw == '123456') {
    req.session.userName = req.body.account; // 登录成功，设置 session
    res.send('1');
  } else res.send('0');
  res.end(JSON.stringify(response));

});

router.get('/logout', function (req, res) {
  req.session.userName = null; // 删除session
  res.redirect('/login');
});

module.exports = router;