一、创建一个项目应用骨架
0、创建一个项目 npm init
1、通过应用生成器工具 express-generator 可以快速创建一个应用的骨架。
2、express webService
二、分析项目
 modules：
  express  body-parser  express-session  connect-mongo

  数据库 mongoDB;
    数据库连接测试：modules: mongoose

    E:\Professional learning\web-server\webService\api\db>node odm
    Mongoose connection open to mongodb://@127.0.0.1:27017/TGWebApp

1/从路由出发；
通过使用：node-uuid 生成唯一ID;
2：acl
3：jsonwebtoken
