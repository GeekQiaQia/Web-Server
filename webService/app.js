const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session=require('express-session');

const acl=require('./api/db/acl');
const mongoose =require('./api/db/odm');
const routes=require('./routes');
const setting=require('./setting');
// 数据库连接成功时，创建访问控制列表；
mongoose.connection.on('connected',()=>{
  acl.init(mongoose);
});

const  app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:setting.Secret,
  resave:true,
  saveUninitialized:false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static('public'));
app.use("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,ETag,token, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials",true);

    if (req.method === 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
});

routes(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
