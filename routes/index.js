/* jshint esversion: 6 */
var express = require('express');
var path = require('path');
var router = express.Router();
var db = require('../db/db'); //引入数据库封装模块
var session = require('express-session');
var condb = require('../db/dbConnect');
var captcha = require('../api/captcha');
var dbclient = condb.connect();
//GET 主页
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    index: '主页'
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
    //res.redirect('/test');
    res.redirect('back');
  } else res.sendfile(path.join(__dirname, '../pages/login.html'));
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
  let user = { //暂存post提交的数据 let 是ES6的语法，定义的是局部变量
    ac: req.body.account,
    pw: req.body.password
  };
  console.log(user);
  condb.selectFun(dbclient, user.ac, function (result) {
    //console.log('name: ' + user.ac + ' is existed: ' + result);
    console.log(result[0] + ' <- 结果');
    if (result[0] === undefined) { //判断是不是undefined必须用 === ,===除了比较值，还会比较变量类型
      res.send('0');
    } else if (result[0].passwd === user.pw) {
        req.session.userName = user.ac;
        res.send('1');
      } else {
        res.send('0');
      }
    });
  /*
  if (response.ac == 'test' && response.pw == '123456') {
    req.session.userName = req.body.account; // 登录成功，设置 session
    res.send('1');
  } else res.send('0');
  */
  //res.end();

});

//退出
router.get('/logout', function (req, res, next) { 
  req.session.userName = null; // 删除session
  res.redirect('/home');
});

router.post('/chuser', function (req, res) {
  if (req.body.user == "") res.send('-1');
  else {
    let isExisted = null;
    condb.userIsExisted(dbclient, req.body.user, function (isExisted) {
      if (isExisted[0] === undefined) res.send('1');
      else res.send('0');
      //
    });
  }
});

router.post('/regtest', function (req, res) {
  let list = {
    name: req.body.user,
    password: req.body.pwd
  };
  //condb.query('select count(uid) from test_user', function())
  condb.getLastUid(dbclient, function (lastuid) {
    condb.insertFun(dbclient, lastuid[0].count + 1, list.name, list.password, function (err) {
      if (err) {
        res.send('0');
        throw err;
      } else res.send('1');
    });

  });
});

router.get('/recommend', function (req, res, next) {
  //查询r表
  let ssss = {
    0:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3076848760,3503526724&fm=26&gp=0.jpg',
    1:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=295181876,496282636&fm=26&gp=0.jpg',
    2:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3281070933,157035784&fm=26&gp=0.jpg',
    3:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2771201017,181968610&fm=26&gp=0.jpg',
    4:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2878128986,1256336885&fm=26&gp=0.jpg'
  };
  res.json(ssss);
  /*db.query('select * from r;', [], function (results, fields) {
    let sresults = {
      "code": 0,
      "msg": "",
      "count": 6,
      "data": results
    };
    console.log(sresults);
    res.json(sresults);
    //res.render('index', { title: 'Express11' });
    
  });*/

});

router.get('/home', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/home.html'));
});

router.get('/preview', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/preview.html'));
});

router.get('/about', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/about.html'));
});

router.get('/delivery', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/delivery.html'));
});

router.get('/news', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/news.html'));
});

router.get('/contact', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/contact.html'));
});

router.get('/previewejs', function (req, res, next) {
  res.render('preview', {
    title: '商品',
    'img5': 'images/thumbnailslide-5.jpg'
  });
});

router.get('/captcha', function (req, res, next) {
  captcha.getCaptcha(req, res, next);
});
module.exports = router;