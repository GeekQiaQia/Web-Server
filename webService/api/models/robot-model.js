const RobotSchema =require('../schemas/robot-schema');
const mongoose=require('mongoose');
module.exports=mongoose.model('Robot',RobotSchema);