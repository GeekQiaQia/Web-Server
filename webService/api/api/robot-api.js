const RobotModel=require('../models/robot-model');
module.exports={
    save:function (item) {
        return new RobotModel(item).save();
    },
    update:function (id,param) {
        return RobotModel.updateOne({RobotId:id},{$set:param}).exec();
    },
    deleteOneById:function (id) {
        return RobotModel.deleteOne({RobotId: id}).exec();
    },
    getOneById:function (RobotId) {
        return RobotModel.findOne({RobotId}).exec();
    },
    getList:function (page,limit,key) {
        if(page&&limit){
        let skip=(page-1)*limit;
        if(key){
            return Promise.all([
                RobotModel
                    .find()
                    .regex('RobotName',key)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                RobotModel
                    .count()
                    .exec()
            ])
        }else{
            return Promise.all([
                RobotModel.find()
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                RobotModel
                    .count()
                    .exec()
            ])
        }
        }else{
            return Promise.all([
                RobotModel.find().exec(),
                RobotModel.count().exec()
            ])

        }
    },
    count:function () {
        return RobotModel.count().exec();
    },
    allOffline:function () {
        return RobotModel.update({RobotSignState:1},{RobotSignState: 0}).exec();
    }

}