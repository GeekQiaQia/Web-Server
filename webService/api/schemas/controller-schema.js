const uuid=require('node-uuid');
const Schema=require('mongoose').Schema;
const controllerSchema=new Schema({
    ctrlId:{type:String,default:uuid.v4},
    Account:{
        type:String,
        required:true,
        unique:true
    },
    PIN:String,
    IP:String,
    LastIP:String,
    SignState:{
        type:Number,
        default: 0
    },
    State:{
        type:Number,
        default:1,
    },
    OtherInfo:String

});
module.exports=controllerSchema;