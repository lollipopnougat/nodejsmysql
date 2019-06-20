/* jshint esversion: 6 */
var mysql = require('mysql');
var dbConfig = require('./db.config');
var isSelect = /select/;

module.exports = {
  query: function (sql, params, ident, callback) {
    let dbcon = null;
    //判断应该使用的用户
    switch (ident) {
      case 0:
        dbcon = dbConfig.bs;
        break;
      case 1:
        dbcon = dbConfig.ad;
        break;
      case 2:
        dbcon = dbConfig.se;
        break;
      case 3:
        dbcon = dbConfig.nu;
        break;
    }
    console.log('dbcon = ' + dbcon.user);
    //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
    var connection = mysql.createConnection(dbcon);
    connection.connect(function (err) {
      if (err) {
        console.log('数据库链接失败！\n' + err.toString());
        //throw err;
      }

      //开始数据操作
      if (isSelect.test(sql)) {
        connection.query(sql, params, function (err, results, fields) {
          if (err) {
            console.log('数据操作失败！\n' + err.toString() + '\n\n' + sql);
            return;
            //throw err;
          } else {
            let sss;
            if (params.length != 0) sss = ' ? -> ' + params;
            else sss = ' ';
            console.log('操作数据库: ' + sql + sss);
            if (results === undefined) callback(undefined);
            else {
              //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
              callback && callback(JSON.parse(JSON.stringify(results)), JSON.parse(JSON.stringify(fields)));
              //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
              //停止链接数据库，必须在查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
            }
            // JSON.stringify(jsonObj) -> 将json对象字符串化, JSON.parse(str) -> 将json字符串json对象化
          }
        });
      } else {
        connection.query(sql, params, function (err, results, fields) {
          if (err) console.log('数据库操作失败!' + err.toString());
          let sss;
            if (params.length != 0) sss = ' ? -> ' + params;
            else sss = ' ';
            console.log('操作数据库: ' + sql + sss);
          callback(err, results);
          //results作为数据操作后的结果
        });
      }
      connection.end(function (err) {
        if (err) {
          console.log('关闭数据库连接失败！\n' + err.toString());
          //throw err; 防止一出错就终止进程
        }
      });

    });
  }
};