const userModel=require('../models/user-model');

// 导出一个对象；
module.exports={
    save:function (item) {

        return new userModel(item).save();


    },
    update:function (userId,param) {
        return userModel.updateOne({userId},{$set:param})
            .exec();
        
    },
    deleteOneById:function (userId) {
        return userModel.deleteOne({userId:userId}).exec();
    },
    getOneByName:function (userName) {
        return userModel.findOne({userName:userName}).exec();

    },
    getOneById:function (userId) {
        return userModel.findOne({userId:userId}).exec();

    },
    getList: function (page, limit, key) {
        if (page && limit) {
            let skip = (page - 1) * limit;
            if(key){
                return Promise.all([
                    UserModel
                        .find()
                        .regex('userRealName',key)
                        .skip(skip)
                        .limit(limit)
                        .exec(),
                    UserModel
                        .count()
                        .exec()
                ])
            }else{
                return Promise.all([
                    UserModel
                        .find()
                        .skip(skip)
                        .limit(limit)
                        .exec(),
                    UserModel
                        .count()
                        .exec()
                ])
            }
        } else {
            return Promise.all([
                UserModel.find().exec(),
                UserModel.count().exec()
            ])
        }
    },
    count:function () {
        return userModel.count().exec();

    }


};

//