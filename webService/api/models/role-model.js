const roleSchema=require('../schemas/role-schema');
const mongoose=require('mongoose');

module.exports=mongoose.model('Role',roleSchema);