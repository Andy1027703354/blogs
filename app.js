var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/articles');

//引入session模块
var session = require('express-session');
//favicon
var favicon = require('serve-favicon');
//连接数据库
var db = require('./db/connect');
var app = express();
//favicon配置
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//在路由前面写session配置
app.use(session({
  secret:'hello blogs',
  resave:false,
  saveUninitialized:true,
  cookie:{maxAge:1000*60*60}//指定session的有效时长
}))
//在这里进行用户登录拦截
app.get('*',(req,res,next)=>{
  let url = req.url;
  let {username} = req.session;
  if(url != '/login' && url != '/regist'){
     if(!username){
       //用户没有登陆
       res.redirect('/login');
     }
  }
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles',articleRouter);

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
