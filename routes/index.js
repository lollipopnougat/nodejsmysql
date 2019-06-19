/* jshint esversion: 6 */
var express = require('express');
var path = require('path');
var router = express.Router();
var db = require('../db/db'); //引入数据库封装模块
var session = require('express-session');
var condb = require('../db/dbConnect');
var captcha = require('../api/captcha');
var dbclient = condb.connect();
var fs = require('fs');

var ltn = 0;
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


router.get('/login', function (req, res, next) {
  console.log(req.session.id);
  if (req.cookies.uid) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
    //res.redirect('/test');
    console.log("用户 " + req.cookies.uid + " 已登录");
    if (req.query.from) res.redirect(req.query.from);
    else res.redirect('/homejs');
  } else res.sendfile(path.join(__dirname, '../pages/login.html'));
});

router.post('/blogin', function (req, res) {
  console.log('id: ' + req.session.id);
  let pd = {
    name: req.body.username,
    pass: req.body.password,
    type: req.body.type
  };
  console.log(pd);
  if (pd.type == 'a') {
    //hash.update(pd.apass);
    db.query('select aid from admin_list where aname=? and apasswd=sha1(?)', [pd.name, pd.pass], 0, function (result, fields) {
      if (result.length == 0) {
        res.send('0');
      } else {
        req.session.aid = result[0].aid;
        req.session.aname = pd.name;
        if (req.cookies.sid) res.clearCookie('sid');
        if (req.cookies.sname) res.clearCookie('sname');
        res.cookie('aname', pd.name, {
          maxAge: 1000 * 60 * 10,
          httpOnly: true
        });
        res.cookie('aid', result[0].aid, {
          maxAge: 1000 * 60 * 10,
          httpOnly: true
        });
        res.send('1');
      }
    });
  } else if (pd.type == 's') {
    db.query('select sid from seller_list where sname=? and spasswd=sha1(?)', [pd.name, pd.pass], 0, function (result, fields) {
      if (result.length == 0) {
        res.send('0');
      } else {
        req.session.sid = result[0].sid;
        req.session.sname = pd.name;
        if (req.cookies.aid) res.clearCookie('aid');
        if (req.cookies.aname) res.clearCookie('aname');
        res.cookie('sname', pd.name, {
          maxAge: 1000 * 60 * 10,
          httpOnly: true
        });
        res.cookie('sid', result[0].sid, {
          maxAge: 1000 * 60 * 10,
          httpOnly: true
        });
        res.send('1');
      }
    });
  }
});

router.get('/register', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pages/register.html'));
});
/*
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
*/


router.post('/logintest', function (req, res) {
  console.log('id: ' + req.session.id);
  let pd = { //暂存post提交的数据 let 是ES6的语法，定义的是局部变量
    uname: req.body.account,
    upass: req.body.password,
    captc: req.body.captcha
  };
  console.log(pd);
  if (pd.captc != req.cookies.captcha) {
    res.send('2');
    return;
  }
  //hash.update(pd.upass);
  db.query('select uid from user_list where uname=? and upasswd = sha1(?)', [pd.uname, pd.upass], 0, function (result, fields) {
    if (result.length != 0) {
      req.session.uid = result[0].uid;
      req.session.uname = pd.uname;
      res.cookie('uname', pd.uname, {
        maxAge: 1000 * 60 * 10,
        httpOnly: true
      });
      res.cookie('uid', result[0].uid, {
        maxAge: 1000 * 60 * 10,
        httpOnly: true
      });
      res.send('1');
    } else res.send('0');
  });
});

//退出
router.get('/logout', function (req, res, next) {
  if (req.cookies.aid) {
    res.clearCookie('aid');
    res.clearCookie('aname');
  }
  if (req.cookies.sid) {
    res.clearCookie('sid');
    res.clearCookie('sname');
  }
  if (req.cookies.uid) {
    res.clearCookie('uid');
    res.clearCookie('uname');
  }

  //req.session.userName = null; // 删除session
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      if (req.query.from || req.query.goto) res.redirect(req.query.from || req.query.goto);
      else res.redirect('/home');
    }
  });
  //res.redirect('/home');
});

router.post('/chuser', function (req, res) {
  if (req.body.user == '') {
    res.send('-1');
    return;
  }
  db.query('select uid from user_list where uname = ?', req.body.user, 0, function (result, fields) {
    if (result.length == 0) res.send('1');
    else res.send('0');
  });
  /*if (req.body.user == "") res.send('-1');
  else {
    let isExisted = null;
    condb.userIsExisted(dbclient, req.body.user, function (isExisted) {
      if (isExisted[0] === undefined) res.send('1');
      else res.send('0');
      //
    });
  }*/
});
/* 使用memadd goto->580
router.post('/regtest', function (req, res) {
  let pd = {
    uname: req.body.user,
    passwd: req.body.pwd
  };
*/
/*condb.query('select count(uid) from test_user', function())
  condb.getLastUid(dbclient, function (lastuid) {
    condb.insertFun(dbclient, lastuid[0].count + 1, list.name, list.password, function (err) {
      if (err) {
        res.send('0');
        throw err;
      } else res.send('1');
    });

  });
});*/


router.get('/home', function (req, res, next) {
  ltn++;
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
  if (req.cookies.uid) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
    //res.redirect('/test');
    let un = req.cookies.uname;
    console.log("用户 " + un + " 已登录");
    res.render('home', {
      username: un
    });
  } else res.redirect('/login');
});

router.get('/welcome', function (req, res, next) {
  if (req.cookies.aid) {
    db.query('select count(uid) as c from user_list', [], 1, function (cuid, fields) {
      db.query('select count(cid) as c from comm_list', [], 1, function (ccid, fields) {
        db.query('select count(aid) as c from admin_list', [], 1, function (caid, fields) {
          db.query('select count(sid) as c from seller_list', [], 1, function (csid, fields) {
            db.query('select count(pid) as c from pic_list', [], 1, function (cpid, fields) {
              db.query('select count(oid) as c from order_list', [], 1, function (coid, fields) {
                res.render('welcome', {
                  username: req.cookies.aname, //req.session.userName,
                  anum: caid[0].c,
                  unum: cuid[0].c,
                  snum: csid[0].c,
                  cnum: ccid[0].c,
                  onum: coid[0].c,
                  pnum: cpid[0].c,
                  todaynum: ltn,
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
              });
            });
          });
        });
      });
    });
  } else if(req.cookies.sid) {
    db.query('select count(cid) as c from comm_list where csid=?', req.cookies.sid, 2, function (ccid, fields) {
      db.query('select count(oid) as c from order_list where ocid = (select cid from comm_list where csid=?)',req.cookies.sid, 2, function (coid, fields) {
        db.query('select count(pid) as c from pic_list where pcid = (select cid from comm_list where csid=2);',req.cookies.sid, 2, function (cpid, fields) {
          res.render('wsell', {
            username: req.cookies.sname,
            cnum: ccid[0].c,
            onum: coid[0].c,
            pnum: cpid[0].c
          });
        });
      });
    });
  }
    else res.redirect('/bslogin');
  
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
  if (req.cookies.aid) {
    //console.log("用户 " + req.session.userName + " 已登录");
    res.sendFile(path.join(__dirname, '../pages/bsindex.html'));
  } else if (req.cookies.sid) {
    res.sendFile(path.join(__dirname, '../pages/bsell.html'));
  } else res.redirect('/bslogin');
});

router.get('/bslogin', function (req, res, next) {
  //console.log(req.session.id);
  if (req.cookies.aid || req.cookies.sid) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
    //res.redirect('/test');
    console.log("用户 " + req.cookies.aid || req.cookies.sid + " 已登录");
    if (req.query.from) res.redirect(req.query.from);
    else res.redirect('/bsindex');
  } else res.sendfile(path.join(__dirname, '../pages/bslogin.html'));
});

router.get('/piclist', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/piclist.html'));
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
  db.query('select count(uid) as c from user_list', [], 1, function (uidnum, fields) {
    db.query('select * from user_list limit ?,10', [pag], 1, function (results, fields) {
      let sresults = {
        "code": 0,
        "msg": "",
        "count": uidnum[0].c,
        "data": results
      };
      res.json(sresults);
    });
  });
});

router.get('/commlst', function (req, res, next) {
  let pag = req.query.page;
  pag -= 1;
  pag *= 10;
  db.query('select count(cid) as c from comm_list', [], 1, function (cidnum, fields) {
    db.query('select * from comm_list limit ?,10', [pag], 1, function (results, fields) {
      let sresults = {
        "code": 0,
        "msg": "",
        "count": cidnum[0].c,
        "data": results
      };
      res.json(sresults);
    });
  });
});

router.get('/ordlst', function (req, res, next) {
  let pag = req.query.page;
  pag -= 1;
  pag *= 10;
  db.query('select count(oid) as c from order_list', [], 1, function (oidnum, fields) {
    db.query('select * from order_list limit ?,10', [pag], 1, function (results, fields) {
      let sresults = {
        "code": 0,
        "msg": "",
        "count": oidnum[0].c,
        "data": results
      };
      res.json(sresults);
    });
  });
});

router.get('/sellst', function (req, res, next) {
  let pag = req.query.page;
  pag -= 1;
  pag *= 10;
  //console.log('pag = ' + pag + 'lim = ' + req.query.limit);
  db.query('select count(sid) as c from seller_list', [], 1, function (sidnum, fields) {
    db.query('select * from seller_list limit ?,10', [pag], 1, function (results, fields) {
      let sresults = {
        "code": 0,
        "msg": "",
        "count": sidnum[0].c,
        "data": results
      };
      res.json(sresults);
    });
  });
});

router.get('/piclst', function (req, res, next) {
  let pag = req.query.page;
  pag -= 1;
  pag *= 10;
  //console.log('pag = ' + pag + 'lim = ' + req.query.limit);
  db.query('select count(pid) as c from pic_list', [], 1, function (pidnum, fields) {
    db.query('select * from pic_list limit ?,10', [pag], 1, function (results, fields) {
      let sresults = {
        "code": 0,
        "msg": "",
        "count": pidnum[0].c,
        "data": results
      };
      res.json(sresults);
    });
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

router.post('/renpic', function (req, res) {
  let pd = {
    pid: req.body.ppid,
    field: req.body.pfield,
    value: req.body.pvalue
  };

  db.query('select purl from pic_list where pid=?', pd.pid, 1, function (purl, fields) {
    db.query('update pic_list set ' + pd.field + '=? where pid=?', [pd.value, pd.pid], 1, function (err, results, fields) {
      if (err) res.send('0');
      else {
        if (pd.field == 'pname') {
          try {
            console.log(path.join(__dirname, '../public/uploadimg/' + pd.value).toString());
            fs.renameSync(path.join(__dirname, '../public/' + purl[0].purl), path.join(__dirname, '../public/uploadimg/' + pd.value));
          } catch (er) {
            console.log('重命名错误! ' + er.toString());
            let oname = purl[0].purl.split('/')[1];
            db.query('update pic_list set pname=? where pid = ?', [oname, pd.pid], function (e, resu) {
              if (e) console.log(e.toString());
              res.send('2');
              return;
            });
          }
          res.send('1');
        } else res.send('1');
      }
    });
  });

});

router.post('/delmem', function (req, res) {
  db.query('delete from user_list where uid=?', req.body.uid, 1, function (err, results, fields) {
    if (err) res.send('0');
    else res.send('1');
  });
});

router.post('/delpic', function (req, res) {
  db.query('select purl from pic_list where pid=?', req.body.pid, 1, function (purl, fields) {
    try {
      fs.unlinkSync(path.join(__dirname, '../public/' + purl[0].purl));
    } catch (er) {
      console.log('操作文件失败' + er.toString());
      res.send('0');
      return;
    }
    db.query('delete from pic_list where pid=?', req.body.pid, 1, function (err, results, fields) {
      if (err) res.send('2');
      else res.send('1');
    });
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

router.post('/delord', function (req, res) {
  db.query('delete from order_list where oid=?', req.body.oid, 1, function (err, results, fields) {
    if (err) res.send('0');
    else res.send('1');
  });
});

router.get('/chmypas', function (req, res) {
  let idtype;
  if (req.cookies.aid) idtype = 'aid';
  else if (req.cookies.sid) idtype = 'sid';
  else res.redirect('/bslogin');
  res.render('changepas', {
    idtype: idtype,
    id: req.cookies.aid || req.cookies.sid
  });
});

router.post('/changepass', function (req, res) {
  console.log(req.body.aid || req.body.sid);
  let adp = {
    id: req.body.aid || req.body.sid,
    op: req.body.oldpass,
    np: req.body.newpass,
  };
  console.log(adp);
  if (req.body.aid) {
    db.query('select aname from admin_list where aid=? and apasswd=sha1(?)', [adp.id, adp.op], 1, function (results, fields) {
      if (results.length != 0) {
        db.query('update admin_list set apasswd=? where aid=?', [adp.np, adp.id], 1, function (err, result, fields) {
          if (err) res.send('0');
          else res.send('1');
        });
      }
    });
  } else if (req.body.sid) {
    db.query('select sname from seller_list where sid=? and spasswd=sha1(?)', [adp.id, adp.op], 2, function (results, fields) {
      if (results.length != 0) {
        db.query('update seller_list set spasswd=? where sid=?', [adp.np, adp.id], 1, function (err, result, fields) {
          if (err) res.send('0');
          else res.send('1');
        });
      }
    });
  } else res.send('0');


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

router.post('/selladd', function (req, res) {
  let pd = {
    name: req.body.username,
    pass: req.body.pass,
    phone: req.body.phone
  };
  db.query('select count(sid) as count from seller_list', [], 1, function (currsid, fields) {
    let newsid = parseInt(currsid[0].count);
    newsid += 1;
    db.query('insert into seller_list values(?,?,?,?)', [newsid, pd.name, pd.pass, pd.phone], 1, function (err, results, fields) {
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


router.get('/uploadi', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/upload.html'));
});

router.get('/checkimg', function (req, res, next) {
  db.query('select count(cid) as count from pic_list where cid=?', req.query.cid, 0, function (result, fields) {
    result[0].count;
  });
});

router.post('/buy', function (req, res) {
  if (req.cookies.uid === undefined) {
    res.redirect('/login?from=/preview?cid=' + req.body.cid);
    return;
  }
  let pd = {
    cid: req.body.cid,
    num: req.body.num,
    uid: req.cookies.uid
  };
  console.log(pd);
  db.query('select count(oid) as count from order_list', [], 3, function (curroid, fields) {
    let newoid = parseInt(curroid[0].count);
    newoid += 1;
    console.log('新订单号oid: ' + newoid);
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