const express=require('express');
const router =express.Router();
const sha1=require('sha1');
const code =require('../api/code/code');
const userApi=require('../api/api/user-api');
const menuApi=require('../api/api/menu-api');
const gt=require('./../token/token').gen();
const valid=require('./../token/token').valid();

//权限验证；
const Auth=require('../api/db/acl');


// 引入日志记录；
const logger=require('../logger/logger').loggerWeb;
// 登录
router.post('/login',function (request,response,next) {
    // 获取登录名和密码
    let name=request.body.userName;
    let password=request.body.password||'N/A';
    // 如果为空则返回对应的结果；
    if(!name){
        // 返回一个json 对象；
        return response.json({
            code:code.CODE_PARAM_CHECK_FAILED,
            message:'请输入正确的用户名和密码'
        });
    }
    //
    logger.info(`username ${name} login`);
    // 对密码进行加密处理；

    password=sha1(password);
    logger.info(`username ${password} login`);
    // 从数据库中查找相应结果；
    userApi.getOneByName(name)
        .then((user)=>{
            // 如果用户存在，且密码一致；
            if(user&&user.password===password){
                // 1、存储session ；
                request.session.user={
                    userId:user.userId,
                    userName:user.userRealName
                };
                // 2、返回应答吗
                return response.json({
                    code:code.CODE_OP_SUCCESS,
                    userId:user.userId,
                    userName:user.userRealName,
                    token:gt(user.userId)

                });

            // new Promise(resolve=>{
            //
            // })

            }else{
                return response.json({
                    code:code.CODE_WRONG_PWD,
                    message:'用户名或者密码错误'
                });
            }
        })
        .catch(err=>{
                return response.json({
                    code:code.CODE_OP_ERROR,
                    message:err.toString()
                })
            }

        )



});
// 添加注册
router.post('/reg',function (request,response,next) {
    //获取注册提交信息；
    console.log(request.body);
    let {userName,userRealName,email,password} = request.body;

    logger.info(`password is  ${password} login`);
   password = sha1(password);
    let user={
        userName,
        userRealName,
        email,
        password
    };
    userApi.save(user)
        .then(()=>{
            return response.json({
                code:code.CODE_OP_SUCCESS,
                message:'注册成功'
            })

        })
        .catch(err=>{
            if(err.message.match('E11000 duplicate key')){
                return response.json({
                    code:code.CODE_OP_FAILED,
                    message:'用户名已经存在'
                })
            }
            return response.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            })
        })


});
// 退出登录
router.post('/logout',valid,function(request,response,next) {
     //清楚session 数据
     request.session.user=undefined;
     request.session.destroy(err=>{
         if(!err){
             return response.json({
                 code:code.CODE_OP_SUCCESS,
                 message:'注销成功'
             })
         }else{}
         return response.json({
             code:code.CODE_OP_FAILED,
             message:'注销失败'+err.toString()
         })
     })

});

// 修改密码;
router.post('/pwd',valid,function (request,response,next) {
    //
    let {userId,oldPassword,password}=request.body;
    if(!userId||!oldPassword||!password||password.length<6){
        response.json({
            code:code.CODE_PARAM_CHECK_FAILED,
            message:'参数不合法'
        });

    }
    // 修改密码新旧密码不能一致；
    oldPassword=sha1(oldPassword);
    password=sha1(password);

    if(oldPassword==password){
        response.json({
            code:code.CODE_OP_FAILED,
            message:'新旧密码不能一致'
        });

    }
    // 修改密码；
    userApi.getOneById(userId)
        .then((user)=>{
            // 如果旧密码正确，则进行密码修改；
            if(user&&oldPassword==user.password){
                // 清除session 对象；
                request.session.user=undefined;
                user.password=password;
                user.save();
                response.json({
                    code:code.CODE_OP_SUCCESS,
                    message:'密码修改成功!'
                });
            }else{
                // 如果旧密码错误，则提示旧密码错误；
                response.json({
                    code:code.CODE_WRONG_PWD,
                    message:'旧密码错误'
                });
            }

        })
        .catch(err=>{
            return response.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            })
        })

});

//展示当前用户的授权菜单列表
router.post('/menu',valid,function(request,response,next){
    let id=request.body.userId;
    let data;
    // 返回一个promise;
menuApi.getList()
    .then((result)=>{
        data=result[0];
        let res=[]; // 存储menuId;
        for(let i of data){
            res.push(i.menuId)
        }

        //Returns all the allowable permissions a given user have to access the given resources.
        return Auth.acl.allowedPermissions(id, res);
    })
    .then(key=>{
        let res=data.filter((item)=>{
            return (key[itme.menuId].length)>0;
        });
    return response.json({
        code:code.CODE_OP_SUCCESS,
        message:res
    })
    })
    .catch(err=>{
        response.json({
            code:code.CODE_OP_ERROR,
            message:err.toString()
        })
    })

});


module.exports=router;


