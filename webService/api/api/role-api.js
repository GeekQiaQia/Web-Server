const roleModel=require('../models/role-model');

module.exports={
    save:function (item) {
        return new roleModel(item).save();

    },
    update:function (id,param) {
        return roleModel.updateOne({roleId: id},{$set:param}).exec();
        
    },
    deleteOneById:function (id) {
        return roleModel.deleteOne({roleId:id}).exec();

    },
    getOneByName:function (roleName) {
        return roleModel.findOne({roleName:roleName}).exec();

    },
    getList:function (page,limit) {
       if(page&&limit){
            let skip=(page-1)*limit;

            return Promise.all([
                roleModel.find().skip(skip).limit(limit).exec(),
                roleModel.count().exec()
            ]);
       }else{
           return Promise.all([
               roleModel.find().exec(),
               roleModel.count().exec()
           ])
       }
    },
    count:function () {
        return roleModel.count().exec()
    }
};