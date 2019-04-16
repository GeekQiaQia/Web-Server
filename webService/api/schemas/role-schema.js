const uuid=require('node-uuid');
const Schema=require('mongoose').Schema;

const roleSchema=new Schema({
    roleId:{
        type:String,
        default:uuid.v4
    },
    roleName:{
        type:String,
        required:true,
        unique:true
    },
    state:{
        type:Number,
        default:1
    }
});

module.exports=roleSchema;