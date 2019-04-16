const controllerSchema=require('../schemas/controller-schema');
const mongoose=require('mongoose');
module.exports=mongoose.model('Controller',controllerSchema);