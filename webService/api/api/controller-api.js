const  ControllerModel=require('../models/controller-model');
module.exports={
    save:function (item) {
        return new ControllerModel(item).save();

    },
    update:function (ctrlId,param) {
        return ControllerModel.updateOne({ctrlId},{$set:param}).exec();

    },
    deleteOneById:function (ctrlId) {
        return ControllerModel.deleteOne({ctrlId}).exec();

    },
    getOneById:function (ctrlId) {
        return ControllerModel.findOne({ctrlId}).exec();

    },
    getOneByAccount:function (param) {
        return ControllerModel.findOne({Account:param}).exec();

    },
    getList:function (page,limit) {
        if(page&&limit){
            let skip=(page-1)*limit;
            return Promise.all([
                ControllerModel.find().skip(skip).limit(limit).exec(),
                ControllerModel.count().exec()
            ])
        }else{
            return Promise.all([
                ControllerModel.find().exec(),
                ControllerModel.count().exec()
            ])
        }
    },
    count:function () {
        return ControllerModel.count().exec()
    },
    allOffline:function () {

        return ControllerModel.update({SignState: 1},{SignState: 0}).exec();
    }


}