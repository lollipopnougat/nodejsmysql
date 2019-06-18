/* jshint esversion: 6 */
var express = require('express');
var path = require('path');
var router = express.Router();
var db = require('../db/db'); //引入数据库封装模块
var session = require('express-session');
var condb = require('../db/dbConnect');
var captcha = require('../api/captcha');
var dbclient = condb.connect();
//var sha1 = require('js-sha1');
//var token = require('../api/token');
//const crypto = require('crypto');
//const hash = crypto.createHash('sha1');
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
  console.log(req.session.id);
  if (req.session.uid) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
    //res.redirect('/test');
    console.log("用户 " + req.session.uid + " 已登录");
    if (req.query.from) res.redirect(req.query.from);
    else res.redirect('/homejs');
  } else res.sendfile(path.join(__dirname, '../pages/login.html'));
});

router.post('/blogin', function (req, res) {
  console.log('id: ' + req.session.id);
  let pd = {
    aname: req.body.username,
    apass: req.body.password
  };
  console.log(pd);
  //hash.update(pd.apass);
  db.query('select aid from admin_list where aname=? and apasswd=sha1(?)', [pd.aname, pd.apass], 0, function (result, fields) {
    if (result.length == 0) {
      res.send('0');
    } else {
      req.session.aid = result[0].aid;
      req.session.aname = pd.aname;
      res.send('1');
    }
  });
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
  console.log('id: ' + req.session.id);
  let pd = { //暂存post提交的数据 let 是ES6的语法，定义的是局部变量
    uname: req.body.account,
    upass: req.body.password
  };
  console.log(pd);
  //hash.update(pd.upass);
  db.query('select uid from user_list where uname=? and upasswd = sha1(?)', [pd.uname, pd.upass], 0, function (result, fields) {
    if (result.length != 0) {
      req.session.uid = result[0].uid;
      req.session.uname = pd.uname;
      res.send('1');
    } else res.send('0');
  });
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


router.get('/home', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/home.html'));
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

router.get('/preview', function (req, res, next) {
  db.query('select * from comm_list where cid=?', req.query.cid, 0, function (judgecomm, fields) {
    if (judgecomm.length == 0) res.sendFile(path.join(__dirname, '../pages/error.html'));
    else {
      db.query('select purl from pic_list where pcid=? order by pname', req.query.cid, 0, function (picurls, fields) {
        let p = [];
        for (let i = 0; i < 6; i++) {
          if (picurls[i] === undefined) {
            p.push('images/noimg.png');
            continue;
          } else {
            p.push(picurls[i].purl);
          }
        }
        console.log('暂存数组: ' + p);
        db.query('select cname,cdesc,cprice,cnum,ctype from comm_list where cid=?', req.query.cid, 0, function (results, fields) {
          res.render('preview', {
            title: results[0].cname + '商品页',
            curcategory: results[0].ctype,
            productslide1: p[0],
            productslide2: p[1],
            productslide3: p[2],
            productslide4: p[3],
            productslide5: p[4],
            productslide6: p[5],
            thumbnailslide1: p[0],
            thumbnailslide2: p[1],
            thumbnailslide3: p[2],
            thumbnailslide4: p[3],
            thumbnailslide5: p[4],
            thumbnailslide6: p[5],
            cname: results[0].cname,
            csdesc: results[0].ctype,
            cprice: results[0].cprice,
            cdesc: results[0].cdesc,
            cnum: results[0].cnum
          });
        });
      });
    }
  });
});

router.get('/homejs', function (req, res, next) {
  if (req.session.uid) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
    //res.redirect('/test');
    let un = req.session.uname;
    console.log("用户 " + un + " 已登录");
    res.render('home', {
      username: un
    });
  } else res.redirect('/login');
});

router.get('/welcome', function (req, res, next) {
  if (req.session.aname) {
    res.render('welcome', {
      username: req.session.aname, //req.session.userName,
      articlenum: 0,
      usernum: 1,
      commentnum: 0,
      commoditnum: 1,
      version: '1.0.31',
      serveroot: '127.0.0.1',
      systeminfo: 'Windows NT 10.0',
      envinfo: 'Windows 10 x64',
      nodever: 'v10.16.0',
      expressver: '4.16.1',
      mysqlver: '8.0.15',
      npmver: '6.9.0',
      filelimits: '2.0 MByte'
    });
  } else {
    res.redirect('/bslogin');
  }
  //console.log("用户 " + req.session.userName + " 已登录");
  //db.query('select count(uid) from user_list', [], 0, function (result, fields) {
  //console.log(result);
  //});

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

router.get('/bslogin', function (req, res, next) {
  console.log(req.session.id);
  if (req.session.uid) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
    //res.redirect('/test');
    console.log("用户 " + req.session.uid + " 已登录");
    if (req.query.from) res.redirect(req.query.from);
    else res.redirect('/bsindex');
  } else res.sendfile(path.join(__dirname, '../pages/bslogin.html'));
});

router.get('/orderlist', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/orderlist.html'));
});

router.get('/memlist', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/memlist.html'));
});

router.get('/sellist', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/sellerlist.html'));
});

router.get('/commlist', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/commlist.html'));
});

router.get('/memadd', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/memadd.html'));
});

router.get('/seladd', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/selladd.html'));
});

router.get('/commadd', function (req, res) {
  res.sendFile(path.join(__dirname, '../pages/commadd.html'));
});

router.get('/orderlist', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/orderlist.html'));
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

router.get('/ordlst', function (req, res, next) {
  let pag = req.query.page;
  pag -= 1;
  pag *= 10;
  //console.log('pag = ' + pag + 'lim = ' + req.query.limit);
  db.query('select * from order_list limit ?,10', [pag], 1, function (results, fields) {
    let sresults = {
      "code": 0,
      "msg": "",
      "count": results.length,
      "data": results
    };
    res.json(sresults);
  });
});

router.get('/sellst', function (req, res, next) {
  let pag = req.query.page;
  pag -= 1;
  pag *= 10;
  //console.log('pag = ' + pag + 'lim = ' + req.query.limit);
  db.query('select * from seller_list limit ?,10', [pag], 1, function (results, fields) {
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

router.post('/changesel', function (req, res) {
  let pd = {
    sid: req.body.psid,
    field: req.body.pfield,
    value: req.body.pvalue
  };
  db.query('update seller_list set ' + pd.field + '=? where sid=?', [pd.value, pd.sid], 1, function (err, results, fields) {
    if (err) res.send('0');
    else res.send('1');
  });
});

router.post('/changeord', function (req, res) {
  let pd = {
    oid: req.body.poid,
    field: req.body.pfield,
    value: req.body.pvalue
  };
  db.query('update order_list set ' + pd.field + '=? where oid=?', [pd.value, pd.oid], 1, function (err, results, fields) {
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

router.post('/delsel', function (req, res) {
  db.query('delete from seller_list where sid=?', req.body.sid, 1, function (err, results, fields) {
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

router.post('/memchangepass', function (req, res) {
  let adp = {
    uid: req.body.uid,
    op: req.body.oldpass,
    np: req.body.newpass,
  };
  db.query('select upasswd from user_list where uid=?', adp.uid, function (results, fields) {
    if (results.upasswd == adp.op) {
      db.query('update user_list set upasswd=? where uid=?', [adp.np, adp.uid], 1, function (err, results, fields) {
        if (err) res.send('0');
        else res.send('1');
      });
    }
  });
});


router.post('/memadd', function (req, res) {
  let pd = {
    name: req.body.username,
    pass: req.body.pass,
    phone: req.body.phone
  };
  db.query('select count(uid) as count from user_list', [], 1, function (curruid, fields) {
    let newuid = parseInt(curruid[0].count);
    newuid += 1;
    db.query('insert into user_list values(?,?,?,?)', [newuid, pd.name, pd.pass, pd.phone], 1, function (err, results, fields) {
      if (err) res.send('0');
      else res.send('1');
    });
  });
});

router.post('/memadd', function (req, res) {
  let pd = {
    name: req.body.username,
    pass: req.body.pass,
    phone: req.body.phone
  };
  db.query('select count(uid) as count from user_list', [], 1, function (curruid, fields) {
    let newuid = parseInt(curruid[0].count);
    newuid += 1;
    db.query('insert into user_list values(?,?,?,?)', [newuid, pd.name, pd.pass, pd.phone], 1, function (err, results, fields) {
      if (err) res.send('0');
      else res.send('1');
    });
  });
});



router.post('/commaddp', function (req, res) {
  let pd = {
    cname: req.body.cname,
    price: req.body.price,
    desc: req.body.desc,
    num: req.body.cnum,
    ctype: req.body.ctype,
    csid: req.body.seller
  };
  db.query('select count(cid) as count from comm_list', [], 1, function (currcid, fields) {
    let newcid = parseInt(currcid[0].count);
    newcid += 1;
    db.query('insert into comm_list values(?,?,?,?,?,?,?)', [newcid, pd.cname, pd.desc, pd.price, pd.ctype, pd.num, pd.csid], 1, function (err, results, fields) {
      if (err) res.send('0');
      else res.send('1');
    });
  });
});


router.get('/uploadimg', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/upload.html'));
});

router.get('/checkimg', function (req, res, next) {
  db.query('select count(cid) as count from pic_list where cid=?', req.query.cid, 0, function (result, fields) {
    result[0].count;
  });
});

router.post('/buy', function (req, res) {
  let pd = {
    cid: req.body.cid,
    num: req.body.num,
    uid: req.session.uid
  };
  if (pd.uid === undefined) res.redirect('/login?from=/preview?cid=' + pd.cid);
  db.query('select count(oid) as count from order_list', [], 0, function (curroid, fields) {
    let newoid = parseInt(curroid[0].count);
    console.log('新订单号oid: ' + newoid);
    newoid += 1;
    db.query('select cprice from comm_list where cid = ?', pd.cid, 3, function (cprice, fields) {
      let price = parseFloat(cprice[0].cprice) * parseInt(pd.num);

      db.query('insert into order_list values(?,?,?,?,?)', [newoid, pd.cid, pd.num, price, pd.uid], 3, function (err, results, fields) {
        if (err) res.send('0');
        else res.send('1');
      });
    });
  });
});


module.exports = router;