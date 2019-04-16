const menuSchema=require('../schemas/menu-schema');
const mongoose =require('mongoose');

module.exports=mongoose.model('Menu',menuSchema);