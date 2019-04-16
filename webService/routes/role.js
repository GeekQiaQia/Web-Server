/**
 *角色管理
 *
 */

const express =require('express');
const router=express.Router();
const roleApi=require('../api/api/role-api');
const code=require('../api/code/code');
const Auth=require('../api/db/acl');
const valid =require('../token/token').valid();


router.post('/list', valid, function (request, response, next) {
    let {page, limit} = request.body;
    limit = Number(limit);
    page = Number(page);
    roleApi.getList(page, limit)
        .then((result) => {
            let data = result[0];
            let total = result[1];
            return response.json({
                code: code.CODE_OP_SUCCESS,
                data,
                total
            });
        })
        .catch(err => {
            return response.json({
                code: code.CODE_OP_ERROR,
                message: err.toString()
            })
        })
});
// 增加角色；
router.post('/add',valid,function (req,res,next) {
    let roleName=req.body.roleName;

    let role={
        roleName
    };
    // 传入一个对象 role；
    roleApi.save(role)
        .then(()=>{
            return res.json({
                code:code.CODE_OP_SUCCESS,
                message:'角色新增成功'
            });
        })
        .catch(err=>{
            if(err.message.match('E11000 duplicate key')){
                return res.json({
                    code:code.CODE_OP_FAILED,
                    message:'角色已经存在'
                });
            }
            return res.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            });
        })

});

// 删除一个角色；
router.post('/delete',valid,function (req,res,next) {
    let {roleId}=req.body;
    if(!roleId){
        return res.json({
            code:code.CODE_PARAM_CHECK_FAILED,
            message:'不合法的参数'
        });
    }
    //数据库删除成功以后，acl列表删除当前角色
    roleApi.deleteOneById(roleId)
        .then(()=>{
              return Auth.acl.removeRole(roleId);
        })
        .then(()=>{
            return res.json({
                code:code.CODE_OP_SUCCESS,
                message:'角色删除成功'
            });
        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            });
        })

});

//角色授权/解除授权；
router.post('/allow',valid,function(req,res,next){
  let {roleId,menus}=req.body;
  // 查询一个角色所拥有的权限；
    Auth.acl.whatResources(roleId)
        .then((key)=>{
            let keys=[];
            for(let item in key){
                if(item=='_bucketname') continue;
                keys.push(item);
            }
            if(keys.length){
                // remove permissions
                return Auth.acl.removeAllow(roleId,keys);
            }else {
                return Promise.resolve('success');
            }

        })
        .then(()=>{
            if(menus.length===0){
                return res.json({
                    code:code.CODE_OP_SUCCESS,
                    message:'解除授权成功'
                });
            }else {
                //allow( roles, resources, permissions, function(err) )
                return Auth.acl.allow(roleId,menus,'*')
                    .then(()=>{
                        return res.json({
                            code:code.CODE_OP_SUCCESS,
                            message:'授权成功'
                        });
                    }).catch(err=>{
                        return res.json({
                            code:code.CODE_OP_ERROR,
                            message:err.toString()
                        });
                    })
            }
        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_SUCCESS,
                message:err.toString()
            });
        })


});

// 查看当前角色授权列表；
router.post('/permissions',valid,function (req,res,next) {
    let {roleId}=req.body;
    Auth.acl.whatResources(roleId)
        .then((key)=>{
            let keys=[];
            for(let item in key){
            if(item=='_bucketname')continue;
            keys.push(item);

            }
            return res.json({
                code:code.CODE_OP_SUCCESS,
                data:keys
            });

        })
        .catch(err=>{
            return res.json({
                code:code.CODE_OP_ERROR,
                message:err.toString()
            });
        })

});

module.exports=router