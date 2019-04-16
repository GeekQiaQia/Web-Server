// 机器人唯一标识
// 机器人名称
//机器人主IP
//机器人从IP；
//机器人本地时间
// 机器人签到状态
// 机器人软件版本信息（collection）
//机器人状态（cellection）
//机器人其他附加信息；
// 机器人控制状态信息；
const uuid =require('node-uuid');
const Schema=require('mongoose').Schema;
const RobotSchema=new Schema({
    RobotId:{
        type:String,
        default:uuid.v4,
        unique:true
    },
    RobotName:{
        type:String,
        required:true
    },
    MasterIP:String,
    SlaveIP:String,
    MAC:String,
    LocalTime:String,
    RobotSignState:{
        type:Number,
        default:0
    },
    AppVersionInfo:{
        type:Schema.Types.Mixed,
        default:{MainVersion:'N/A',SubVersion:'N/A',LastUpdateTime:'N/A'}
    },
    RobotState:{
        type:Schema.Types.Mixed,
        default:{},
    },
    RobotDevState:{
        type:Schema.Types.Mixed,
        default:{},
    },
    OtherInfo:[],
    RobotControlState:{
        type:Number,
        default:0,
    }

});
module.exports=RobotSchema;
