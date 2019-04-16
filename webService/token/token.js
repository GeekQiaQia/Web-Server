// 生成token;
const JWT=require('jsonwebtoken');
const setting=require('./../setting');
const code=require('./../api/code/code');

module.exports={
    gen(){
        return function(name){
            let expiry=new Date();
            expiry.setDate(expiry.getDate()+1);

            return JWT.sign(
                {
                name:name,
                exp:parseInt(expiry.getTime()/1000)
                },
                setting.JWT_SECRET


            );
        }
    },
    valid() {
        return function (req, res, next) {
            if (req.headers['token']) {
                let token = req.headers['token'];
                if (!token) {
                    return res.send({
                        code: code.CODE_TOKEN_MISS,
                        message: "非法访问"
                    })
                }
                JWT.verify(token, setting.JWT_SECRET, function (err, decoded) {
                    if (!err) {
                        let user=req.session.user||{userId:'N/A'};
                        let id = user.userId;
                        if (!decoded || decoded.name != id) {
                            return res.send({
                                code: code.CODE_TOKEN_ERROR,
                                message: "无效Token"
                            })
                        }
                        next();
                    } else {
                        return res.send({
                            code: code.CODE_TOKEN_EXPIRED,
                            message: "授权已经过期，请重新登陆"
                        })
                    }
                });
            }
            else {
                return res.send({
                    code: code.CODE_TOKEN_MISS,
                    message: "非法访问"
                })
            }

        }
    }
}