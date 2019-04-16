/**
 * Created by baixiyang on 2018/11/7.
 */
const Acl=require('acl');

const Auth={
    acl:{},
    init(mongoose){
        //
        Auth.acl=new Acl(new Acl.mongodbBackend(mongoose.connection.db,'acl_',true));

    }
}

module.exports=Auth;