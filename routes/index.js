/* jshint esversion: 6 */
var express = require('express');
var path = require('path');
var router = express.Router();
var db = require('../db/db'); //引入数据库封装模块
var session = require('express-session');
var condb = require('../db/dbConnect');
var dbclient = condb.connect();
//GET 主页
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
  // console.log('request ip: ' + getIp(req));
});

router.get('/test', function (req, res, next) {
  if (req.session.userName) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
    res.sendfile(path.join(__dirname, '../pages/index.html'));
  } else {
    //console.log('req.session.userName is ' + req.session.userName);
    res.redirect('/login');
  }
});

router.get('/login', function (req, res, next) {

  if (req.session.userName) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
     res.redirect('/test');
  }
  else res.sendfile(path.join(__dirname, '../pages/login.html'));
});

router.get('/register', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/register.html'));
});

router.get('/tpch', function (req, res, next) {
  //查询r表
  db.query('select * from r;', [], function (results, fields) {
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
  user = {
    ac: req.body.account,
    pw: req.body.password
  };
  let results = null;
  console.log(user);
  condb.selectFun(dbclient, user.ac, function (result) {
    //console.log('name: ' + user.ac + ' is existed: ' + result);
    if (result[0] === undefined) {
      res.send('0');
    } else {
      if (result[0].passwd === user.pw) {
        req.session.userName = user.ac;
        res.send('1');
      } else {
        res.send('0');
      }
    }
  });
  /*
  if (response.ac == 'test' && response.pw == '123456') {
    req.session.userName = req.body.account; // 登录成功，设置 session
    res.send('1');
  } else res.send('0');
  */
  //res.end(JSON.stringify(response));

});

router.get('/logout', function (req, res) {
  req.session.userName = null; // 删除session
  res.redirect('/login');
});

router.post('/chuser', function (req, res) { 
  let isExisted = null;
  condb.userIsExisted(dbclient, req.body.account, function(isExisted) {});
  if (isExisted) res.send(0);
  else res.send(1);
});

router.post('/regtest', function(req, res) {
  let lastuid = null;
  let err = null;
  //condb.query('select count(uid) from test_user', function())
  condb.getLastUid(dbclient, function(lastuid) {});
  console.log('uid: ' + lastuid[0]);
  condb.insertFun(dbclient, lastuid[0] + 1, req.body.account, req.body.password, function(err) {});
  if(err) {
    res.send(0);
    throw err;
  }
  else res.send(1);
});
module.exports = router;