/**
 * Created by baixiyang on 2018/11/7.
 */

const config={
    service:{
        port:3006
    },
    db:{
        auth:'',
        host:'127.0.0.1',
        port:'27017',
        db:'TGWebApp'

    },
    Secret:'my-secret',
    JWT_SECRET:'ServerJwtTokenSecret',
    site:'TGWebApp'
}

module.exports=config;