var express = require('express');
var router = express.Router();
var userModel = require('../db/userModel');

//注册页面
router.post('/regist',(req,res,next)=>{
  //接收post数据
  let {username,password,password2} = req.body;
  //查询是否存在这个用户
  userModel.find({username}).then((docs)=>{
    if(docs.length > 0){
      // res.send('用户名已存在');
      res.redirect('/regist');
    }else {
      //开始注册
      let createTime = Date.now();
      //数据插入
      userModel.insertMany({username,password,createTime}).then((data)=>{
        res.redirect('/login');
      }).catch((err)=>{
        res.redirect('/regist');
      })
    }
  })
})


//登陆页面
router.post('/login',(req,res,next)=>{
  //接收post数据
  let {username,password} = req.body;

  //查询是否存在这个用户
  userModel.find({username,password}).then((docs)=>{
    if(docs.length > 0){
       //res.send('登陆成功');
       //在服务端使用session记录用户信息
       req.session.username = username;
       res.redirect('/');
    }else {
      //res.send('用户不存在');
      res.redirect('/login');
    }
  }).catch((err)=>{
    res.redirect('/login');
  })
})

//退出登陆
router.get('/logout',(req,res,next)=>{
  req.session.username = null;
  res.redirect('/login');
})

module.exports = router;
