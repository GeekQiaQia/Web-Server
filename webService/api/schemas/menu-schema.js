
const uuid=require('node-uuid');
const Schema=require('mongoose').Schema;

const menuSchema=new Schema({
    menuId:{type:String,default:uuid.v4},
    menuName:{
        type:String,
        required:true,
        unique:true
    },
    menuIcon:String,
    menuPath:{
        type:String,
        required: true
    },
    parentId:{
        type:String
    },
    state:{
        type:Number,
        default:1
    }

});

module.exports=menuSchema;