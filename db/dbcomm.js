var mysql = require('mysql');

function connectServer() {

    var client=mysql.createConnection({
        host:'localhost',
        user:'backsystem',
        password:'bspasswd',
        database:'website'
    });

    return client;
}


function getPicUrl(client, pcid, callback) {
    //client为一个mysql连接对象
    client.query('select purl from pic_list where pcid=?', pcid, function(err,results,fields) {
        if(err) throw err;
        // console.log("这是dbcomm里面" + results);
        callback(results);
    });
}



exports.connect = connectServer;
exports.getPicUrl  = getPicUrl;
