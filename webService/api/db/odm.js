/**
 * Created by baixiyang on 2018/11/7.
 */

const mongoose=require('mongoose');
mongoose.Promise=global.Promise;

const config=require('../../setting');
const {logger}=require('../../logger/logger');

const options={
    useNewUrlParser:true
}
let url=`mongodb://${config.db.auth}@${config.db.host}:${config.db.port}/${config.db.db}`;
mongoose.connect(url,options)
    .then(connection=>{

    })
    .catch(err=>{
        logger.info(err.message);
    });

let db=mongoose.connection;

db.on('connected',()=>{
    logger.info(`Mongoose connection open to ${url}`);
});
db.on('error',(err)=>{
    logger.info(`Mongoose connection error:${url}`);
});
db.on('disconnected',()=>{
    logger.info(`Mongoose connection disconnected`);
});

module.exports=mongoose;
