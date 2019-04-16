/*
* 对外一个函数，
* 在函数中执行一个个的路由；
* */

module.exports=function (app) {
//
 app.use('/api/auth',require('./auth'));
 app.use('/api/users',require('./users'));
 app.use('/api/menu',require('./menu'));
 app.use('/api/role',require('./role'));
 app.use('/api/count',require('./counts'));

}