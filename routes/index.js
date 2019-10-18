var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel');
//处理时间格式的模块
var moment = require('moment');
//首页路由
router.get('/', function (req, res, next) {

  //数据类型，要求是int
  let page = parseInt(req.query.page || 1);
  let size = parseInt(req.query.size || 3);
  let username = req.session.username;

  //第一步：查询文章总数和总页数
  articleModel.find().count().then((total) => {
    //获取总页数
    var pages = Math.ceil(total / size);
    //第二步：分页查询
    //sort() 按文章时间，倒序查询
    //limit() 每页显示多少条
    //skip() 分页实现
    articleModel.find().sort({ "createTime": -1 }).limit(size).skip((page - 1) * size).then((docs) => {
      //对数据中时间进行处理
      docs.map((ele, idx) => {
        docs[idx].createTimeZH = moment(ele.createTime).format('YYYY-MM-DD HH:mm:ss');
      })
      res.render('index', { data: { list: docs, total: pages, username: username } });
    }).catch((err) => {
      res.redirect('/');
    })
  }).catch((err) => {
    res.redirect('/');
  })


});

//注册页
router.get('/regist', function (req, res, next) {
  res.render('regist', {});
})

//登陆页路由
router.get('/login', function (req, res, next) {
  res.render('login', {});
})

//写文章路由
router.get('/write', function (req, res, next) {
  var time = parseInt(req.query.time);
  if (time) {
    //编辑
    //用唯一时间戳查询数据
    articleModel.find({ createTime: time }).then((docs) => {
      //有这条数据渲染写文章页面
      res.render('write', { docs: docs[0] })
    }).catch(err => {
      //没有就跳转首页
      res.redirect('/');
    })
  } else {
    //新增之前置空前面的数据，用户名保留
    var docs = {
      createTime: '',
      username: req.session.username,
      title: '',
      content: ''
    }
    //渲染写文章页面
    res.render('write', { docs: docs });
  }
})

//详情页路由
router.get('/detail', function (req, res, next) {
  //获取请求参数
  var time = parseInt(req.query.time);
  //查询数据
  articleModel.find({ createTime: time }).then((docs) => {
    //时间处理
    docs[0].createTimeZH = moment(docs[0].createTime).format('YYYY-MM-DD HH:mm:ss');
    //渲染详情页面
    res.render('detail', { docs: docs[0] })
  }).catch((err) => {
    //错误信息
    res.send(err);
  })

})

module.exports = router;
