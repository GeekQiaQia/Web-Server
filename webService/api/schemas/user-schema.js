/**
 * Created by baixiyang on 2018/11/7.
 *
 * v1 是基于时间戳生成的，v4是基于随机数生成的；
 *
 */

const uuid=require('node-uuid');

const Schema =require('mongoose').Schema;

const userSchema=new Schema({
    userId:{type:String,default:uuid.v1},
    userName:{
        type:String,
        required:true,
        unique:true
    },
    userRealName:{
        type:String,
        required: true
    },
    email:{
      type:String,
      required:true
    },
    password:String,
    state:{
        type:Number,
        default: 1
    },
history:[]
});

module.exports=userSchema;
