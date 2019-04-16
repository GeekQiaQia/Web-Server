const menuModel=require('../models/menu-model');

module.exports={
    save:function (item) {
        return new menuModel(item).save();
    },
    update:function(id,param){
        return menuModel.updateOne({menuId:id},{$set:param}).exec();
    },
    deleteOneById:function (id) {
        return menuModel.deleteOne({menuId:id}).exec();
        
    },
    getOneByName:function (menuName) {
        return menuModel.findOne({menuName:menuName}).exec();

    },
    getOneById:function (id) {
        return menuModel.findOne({menuId:id}).exec();

    },
    getList:function (page,limit) {
        if(page&&limit){
            let skip=(page-1)*limit;
            return Promise.all([
                menuModel.find().skip(skip).limit(limit).exec(),
                menuModel.count().exec()

            ])
        }else{
            return Promise.all([
                menuModel.find().exec(),
                menuModel.count().exec()
            ])
        }
        
    },
    count:function () {
        return menuModel.count().exec();
    }
};

