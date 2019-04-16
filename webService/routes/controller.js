const express=require('express');
const router=express.Router();

const controllerApi=require('../api/api/controller-api');
const utils=require('../api/api/utils');
const code=require('../api/code/code');
const sha1=require('sha1');
const valid =require('../token/token').valid();

router.post('/list',valid,function (req,res,next) {
    let {page,limit}=req.body;
    limit=Number(limit);
    page=Number(page);
    controllerApi.getList(page,limit)
        .then((res)=>{
            let data=res[0];
            let total=res[1];
            return res.json({
                code:code.CODE_OP_SUCCESS,
                data,
                total
            });
        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            });
        })

});

router.post('/add',valid,function (req,res,next) {
    let {Account,password,password2} =req.body;

    // 获取IP；
    let ip=utils.getIP(req);
    // 检验密码
    if(password!==password2){
        return res.json({
            code:code.CODE_PARAM_CHECK_FAILED,
            message:'密码不一致'
        });
    }
    // 检查名称
    if(!Account||Account.length<4||Account.length>16){
        return res.json({
            code:code.CODE_PARAM_CHECK_FAILED,
            message:'名称不合法'
        });
    }
    // 密码进行加密处理；
    password=sha1(password);

    // 封装保存对象；
    let controller={
        Account,
        PIN:password,
        IP:ip
    };

    // 调用API 新增方法存入数据库；
    controllerApi.save(controller)
        .then(()=>{
            return res.json({
                code:code.CODE_OP_SUCCESS,
                message:'新增成功'
            });
        })
        .catch(err=>{
            if(err.message.match('E11000 duplicate key')){
                return res.json({
                    code:code.CODE_OP_FAILED,
                    message:'该名称已经存在'
                });
            }
            return res.json({
                code:code.CODE_OP_FAILED,
                message:err.toString()
            })
        })


});

router.post('/update',valid,function (req,res,next) {

    let {ctrlId,password,password2}=req.body;
    // 检验密码；
    if(password!==password2){
        return res.json({
            code:code.CODE_PARAM_CHECK_FAILED,
            message:'密码输入不一致'
        });
    }
    //  密码进行sha1加密；
    password=sha1(password);
    let ctrl={
        PIN:password
    };
    // 执行controllerApi 的update 方法；
    controllerApi.update(ctrlId,ctrlId)
        .then(res=>{
            return res.json({
                code:code.CODE_OP_SUCCESS,
                message:'操作成功'
            });
        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            })
        })
});

router.post('/delete',valid,function (req,res,next) {
    let {ctrlId}=req.body;
    // 检查合法性；
    if(!ctrlId){
        return res.json({
            code:code.CODE_PARAM_CHECK_FAILED,
            message:'不合法的参数'
        });
    }
    // 调用 mongodb
    controllerApi.getOneById(ctrlId)
        .then(res=>{
            if(res&&res.SignState===1){
                res.json({
                    code:code.CODE_OP_ERROR,
                    message:'已经签到无法删除'
                });
                return 'REJECT'
            }else{
                return controllerApi.deleteOneById(ctrlId)
            }
        })
        .then((res)=>{
            if(res!=='REJECT'){
                return res.json({
                    code:code.CODE_OP_SUCCESS,
                    message:'删除成功'
                });
            }
        })
        .catch((err)=>{
            return res.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            });
        })

});

module.exports=router;
