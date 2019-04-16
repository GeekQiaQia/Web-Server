/**
 * 菜单管理
 * */
const express =require('express');
const router =express.Router();

const menuApi =require('../api/api/menu-api');
const code =require('../api/code/code');
const Auth =require('../api/db/acl');
const valid =require('../token/token').valid();


// 获取菜单列表
router.post('/list',valid,function (req,res,next) {
    let {page,limit}=req.body;
    // 数字化处理；
    limit =Number(limit);
    page =Number(page);


    // 调用数据库查询函数；
    menuApi.getList(page,limit)
        .then((result)=>{
            let data=result[0];
            let total=result[1];
            return res.json({
                code:code.CODE_OP_SUCCESS,
                data,
                total
            });

        })
        .catch(err=>{
            console.log(err.message);
            return res.json({

                code:code.CODE_OP_ERROR,
                message:err.toString()
            });
        })
});
// 添加一个菜单项；
router.post('/add',valid,function (req,res,next) {

    let {menuName,menuIcon,menuPath}=req.body;
    let menu={
        menuName,menuIcon,menuPath
    }
    menuApi.save(menu)
        .then(()=>{
            return res.json({
                code:code.CODE_OP_SUCCESS,
                message:'添加成功'
            });
        })
        .catch(err=>{
            if(err.message.match('E11000 duplicate key')){
                return res.json({
                    code:code.CODE_OP_FAILED,
                    message:'该菜单名称已经存在'
                });
            }
            return res.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            });
        })

});
// 删除一个菜单项；
router.post('/delete',valid,function (req,res,next) {
    let {menuId}=req.body;
    if(!menuId){
        return res.json({
            code:code.CODE_PARAM_CHECK_FAILED,
            message:'不合法的参数'
        });
    }
    menuApi.deleteOneById(menuId)
        .then(()=>{
            Auth.acl.removeResource(menuId);
        })
        .then(()=>{
            return res.json({
                code:code.CODE_OP_SUCCESS,
                message:'删除成功'
            });
        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_FAILED,
                message:err.toString()
            });
        })
});
// 更新菜单项；
router.post('/update',valid,function(req,res,next){
    let{menuId,menuName,menuIcon,menuPath}=req.body;
    let menu={
        menuName,menuIcon,menuPath
    }
    menuApi.update(menuId,menu)
        .then(()=>{
            return res.json({
                code:code.CODE_OP_SUCCESS,
                message:'修改成功'
            });
        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_FAILED,
                message:err.toString()
            });
        })
});

module.exports=router;