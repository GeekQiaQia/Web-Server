const userSchema=require('../schemas/user-schema');
const  mongoose=require('mongoose');

module.exports=mongoose.model('User',userSchema);
