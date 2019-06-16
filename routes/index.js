/* jshint esversion: 6 */
var express = require('express');
var path = require('path');
var router = express.Router();
var db = require('../db/db'); //引入数据库封装模块
var session = require('express-session');
var condb = require('../db/dbConnect');
var captcha = require('../api/captcha');
var dbclient = condb.connect();
var sha1 = require('js-sha1');
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
    console.log("用户 " + req.session.userName + " 已登录");
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

router.post('/memchapas', function (req, res) {
  let tmp = {
    un: req.body.username,
    op: req.body.oldpass,
    np: req.body.newpass,
    rp: req.body.repass
  };
  console.log(tmp);
  res.send('1');
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
      req.app.locals['username'] = user.ac;
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
  //req.session.userName = null; // 删除session
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/home');
    }
  });
  //res.redirect('/home');
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

/*
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
    
  });

});
*/

router.get('/home', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/home.html'));
});

/*router.get('/preview', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/preview.html'));
});
*/
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

router.get('/preview', function (req, res, next) {
  db.query('select * from comm_list where cid=?', req.query.cid, 0, function (judgecomm, fields) {
    if (judgecomm.length == 0) res.sendFile(path.join(__dirname, '../pages/error.html'));
    else {
      db.query('select purl from pic_list where pcid=? order by pname', req.query.cid, 0, function (picurls, fields) {
        db.query('select cname,cdesc,cprice,cnum,ctype from comm_list where cid=?', req.query.cid, 0, function (results, fields) {
          res.render('preview', {
            title: results[0].cname + '商品页',
            curcategory: results[0].ctype,
            productslide1: picurls[0].purl,
            productslide2: picurls[1].purl,
            productslide3: picurls[2].purl,
            productslide4: picurls[3].purl,
            productslide5: picurls[4].purl,
            productslide6: picurls[5].purl,
            thumbnailslide1: picurls[6].purl,
            thumbnailslide2: picurls[7].purl,
            thumbnailslide3: picurls[8].purl,
            thumbnailslide4: picurls[9].purl,
            thumbnailslide5: picurls[10].purl,
            thumbnailslide6: picurls[11].purl,
            cname: results[0].cname,
            csdesc: results[0].cdesc,
            cprice: results[0].cprice,
            cdesc: '！'
          });
        });
      });
    }
  });
});

router.get('/homejs', function (req, res, next) {
  if (req.session.userName) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
    //res.redirect('/test');
    console.log("用户 " + req.session.userName + " 已登录");
    res.render('home', {
      username: req.session.userName
    });
  } else res.redirect('/login');
});

router.get('/welcome', function (req, res, next) {
  //if (req.session.userName) {
  //console.log("用户 " + req.session.userName + " 已登录");
  //db.query('select count(uid) from user_list', [], 0, function (result, fields) {
  //console.log(result);
  //});
  res.render('welcome', {
    username: 'lnp', //req.session.userName,
    articlenum: 0,
    usernum: 1,
    commentnum: 0,
    commoditnum: 1,
    version: '1.0.23',
    serveroot: '127.0.0.1',
    systeminfo: 'Windows NT 10.0',
    envinfo: 'Windows 10 x64',
    nodever: 'v10.16.0',
    expressver: '4.16.1',
    mysqlver: '8.0.15',
    npmver: '6.9.0'
  });
  //} else res.redirect('/login');
});

router.get('/captcha', function (req, res, next) {
  captcha.getCaptcha(req, res, next);
});

router.get('/bsindex', function (req, res, next) {
  //if (req.session.userName) {
  //console.log("用户 " + req.session.userName + " 已登录");
  res.sendFile(path.join(__dirname, '../pages/bsindex.html'));
  //}
  //else res.redirect('/login');
});

router.get('/memlist', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/memlist.html'));
});

router.get('/commlist', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/commlist.html'));
});

router.get('/memlst', function (req, res, next) {
  let pag = req.query.page;
  pag -= 1;
  pag *= 10;
  //console.log('pag = ' + pag + 'lim = ' + req.query.limit);
  db.query('select * from user_list limit ?,10', [pag], 1, function (results, fields) {
    let sresults = {
      "code": 0,
      "msg": "",
      "count": results.length,
      "data": results
    };
    res.json(sresults);
  });
});

router.get('/commlst', function (req, res, next) {
  let pag = req.query.page;
  pag -= 1;
  pag *= 10;
  //console.log('pag = ' + pag + 'lim = ' + req.query.limit);
  db.query('select * from comm_list limit ?,10', [pag], 1, function (results, fields) {
    let sresults = {
      "code": 0,
      "msg": "",
      "count": results.length,
      "data": results
    };
    res.json(sresults);
  });
});

router.post('/changemem', function (req, res) {
  let pd = {
    uid: req.body.puid,
    field: req.body.pfield,
    value: req.body.pvalue
  };
  db.query('update user_list set ' + pd.field + '=? where uid=?', [pd.value, pd.uid], 1, function (err, results, fields) {
    if (err) res.send('0');
    else res.send('1');
  });
});

router.post('/changecomm', function (req, res) {
  let pd = {
    cid: req.body.pcid,
    field: req.body.pfield,
    value: req.body.pvalue
  };
  db.query('update comm_list set ' + pd.field + '=? where cid=?', [pd.value, pd.cid], 1, function (err, results, fields) {
    if (err) res.send('0');
    else res.send('1');
  });
});

router.post('/delmem', function (req, res) {
  db.query('delete from user_list where uid=?', req.body.uid, 1, function (err, results, fields) {
    if (err) res.send('0');
    else res.send('1');
  });
});

router.post('/delcomm', function (req, res) {
  db.query('delete from comm_list where cid=?', req.body.cid, 1, function (err, results, fields) {
    if (err) res.send('0');
    else res.send('1');
  });
});

router.post('/memaddp', function (req, res) {
  let adp = {
    uid: req.body.uid,
    op: req.body.oldpass,
    np: req.body.newpass,
  };
  db.query('select upasswd from user_list where uid=?', adp.uid, function (results) {
    if (results.upasswd == adp.op) {
      db.query('update user_list set upasswd=? where uid=?', [adp.np, adp.uid], 1, function (err, results, fields) {
        if (err) res.send('0');
        else res.send('1');
      });
    }
  });
});
module.exports = router;