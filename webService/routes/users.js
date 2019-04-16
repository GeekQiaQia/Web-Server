/**
 * 用户管理
 * */
const express =require('express');
const router=express.Router();
const userApi =require('../api/api/user-api');
const utils=require('../api/api/utils');
const gt=require('../token/token').gen();
const sha1=require('sha1');
const code=require('../api/code/code');
const Auth=require('../api/db/acl');
const logger=require('../logger/logger');
const valid =require('../token/token').valid();

router.post('/list', valid, function (req,res,next) {
    let {page,limit,key}=req.body;
    page=Number(page);
    limit=Number(limit);
    key=(key||'').trim();

    userApi.getList(page,limit,key)
        .then((result)=>{
            let users=result[0];
            let total=result[1];
            let data=users.map(user=>{
                return {
                    userName:user.userName,
                    userRealName:user.userRealName,
                    email:user.email,
                    ip:user.ip,
                    userId:user.userId,
                    state:user.state,
                }
            });
            return res.json({
                code:code.CODE_OP_SUCCESS,
                data,
                total
            });

        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_FAILED,
                message:err.toString()
            });
        })
});
// 查询一个用户
router.post('/query',valid,function (req,res,next){

    let{userId}=req.body;

    userApi.getOneById(userId)
        .then(user=>{
            if(user){
                user.password=undefined;

            }
            return res.json({
                code:code.CODE_OP_SUCCESS,
                data:user
            });
        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_FAILED,
                message:err.toString()
            });
        })


});
// 添加一个用户；
router.post('/add',valid,function (req,res,next) {

    let {userName,userRealName,email,password}=req.body;
    password=sha1(password);

    let user={
        userName,
        userRealName,
        email,
        password,

    };
    // 传入一个对象；
    userApi.save(user)
        .then(()=>{
            return res.json({
                code:code.CODE_OP_SUCCESS,
                message:'操作成功'
            });
        })
        .catch(err=>{
            if(err.message.match('E1100 duplicate key')){
                return res.json({
                    code:code.CODE_OP_SUCCESS,
                    message:'登录名已经存在'
                });

            }
            return res.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            });
        })
});
// 更新一个用户信息；
router.post('/update',valid,function(req,res,next){
    let {userId,userRealName,email}=req.body;
    let user={userRealName,email};
    userApi.update(userId,user)
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
            });
        })

});
// 重置用户密码
router.post('/reset',valid,function (req,res,next) {
 let {userId,password} =req.body;
 if(!userId||!password||password.length<6||password.length>24){
     return res.json({
         code:code.CODE_PARAM_CHECK_FAILED,
         message:'参数不合法'
     });

 }
 password =sha1(password);
 userApi.getOneById(userId)
     .then((user)=>{
         if(user){
             user.password=password;
             user.save();
             return res.json({
                 code:code.CODE_OP_SUCCESS,
                 message:'密码修改成功'
             });
         }else{
             return res.json({
                 code:code.CODE_WRONG_PWD,
                 message:'用户不存在'
             });
         }
     })
     .catch(err=>{
         return res.json({
             code:code.CODE_OP_ERROR,
             message:err.toString()
         });
     })
});
// 删除一个用户
router.post('/delete',valid,function (req,res,next) {
    let{userId}=req.body;
    if(!userId){
        return res.json({
            code:code.CODE_PARAM_CHECK_FAILED,
            message:'不合法的参数'
        });
    }
    userApi.deleteOneById(userId)
        .then(()=>{
            return res.json({
                code:code.CODE_OP_SUCCESS,
                message:'删除成功'
            });
        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            });
        })

});
// 给一个用户添加角色；
router.post('/role/add',valid,function (req,res,next) {
    let {userId,roles}=req.body;
   // Return all the roles from a given user.
    Auth.acl.userRoles(userId)
        .then((key)=>{
            if(key.length){
                let keys =key.filter((i)=>{
                    return i!=='_buckeyname'
                });

                //Remove roles from a given user.
                return Auth.acl.removeUserRoles(userId,keys);
            }else{
                return Promise.resolve('success');
            }
        })
        .then(()=>{
            if(roles.length===0){
                return res.json({
                    code:code.CODE_OP_SUCCESS,
                message:'角色删除成功'
                });
            }else{
                //Adds roles to a given user id.
                return Auth.acl.addUserRoles(userId,roles)
                    .then(()=>{
                        return res.json({
                            code:code.CODE_OP_SUCCESS,
                            message:'赋予角色成功'
                        });
                    })
                    .catch(err=>{
                        return res.json({
                            code:code.CODE_OP_ERROR,
                            message:err.toString()
                        });
                    })
            }
        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            });
        });

});
// 查询一个用户的授权角色
router.post('/role/list', valid, function (request, response, next) {
    let {userId} = request.body;
    Auth.acl.userRoles(userId).then((key) => {
        let keys = key.filter((i) => {
            return i !== '_bucketname';
        });
        return response.json({
            code: code.CODE_OP_SUCCESS,
            data: keys,
        })
    }).catch(err => {
        return response.json({
            code: code.CODE_OP_ERROR,
            message: err.toString()
        });
    });
});

module.exports=router;

