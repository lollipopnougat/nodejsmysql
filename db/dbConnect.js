var mysql = require('mysql');
// 之前的数据库连接、查询模块，已弃用
function connectServer() {

    var client=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'1024',
        database:'website'
    });

    return client;
}


function selectFun(client, username, callback) {
    //client为一个mysql连接对象
    client.query('select passwd from test_user where name=?', username, function(err,results,fields) {
        if(err) throw err;

        callback(results);
    });
}

function insertFun(client, uid, username, password, callback) {
    client.query('insert into test_user value(?,?,?)', [uid, username, password], function(err) {
        if(err) {
            console.log( "error:" + err.message);
            return err;
        }
        callback(err);
    });
}

function userIsExisted(client, username, callback) {
    if(username === undefined) callback(false);
    else client.query('select uid from test_user where name=?', username ,function(err,results,fields) {
        if(err) throw err;
        //if(results[0]) callback(true);
        callback(results);
    });
}

function getLastUid(client, callback) {
    client.query('select count(uid) as count from test_user',function(err,results,fields) {
        if(err) throw err;
        console.log('results[0] ' + results[0]);
        callback(results);
    });
}

exports.connect = connectServer;
exports.selectFun  = selectFun;
exports.insertFun = insertFun;
exports.userIsExisted = userIsExisted;
exports.getLastUid = getLastUid;