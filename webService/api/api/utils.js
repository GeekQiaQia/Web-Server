// 获取ip;
const moment =require('moment');
const logger=require('./../../logger/logger');

const Utils={
    getIP(req){
        let str=req.headers['x-forwarded-for']||
            req.connection.remoteAddress||
            req.socket.remoteAddress||
            req.connection.socket.remoteAddress;

        let ip=str.match(/\d+.\d+.\d+.\d+/);
        ip=ip?ip.join('.'):'N/A';
        return ip;

    },
    //Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36
    getUserAgent(req){
        return req.headers['user-agent']||'N/A'
    },
    trace(user,req,resolve){
        let ip=Utils.getIP(req);
        let ua=Utils.getUserAgent(req);
        let trace={
            time:moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
            ip,
            ua
        }
        try{
            if(user.history.length>=5){
                user.history.shift();
            }
            user.history.push(trace);
            user.save();
        }catch(e) {
            logger.info(`user login trace error :${e.message}`);
        }finally {
            resolve();
        }
    }


};

module.exports=Utils;
