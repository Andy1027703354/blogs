var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel');
//操作文件上传的模块
var multiparty = require('multiparty');
//得到解析上传文件的对象
var fs = require('fs');

//文章修改与新增
router.post('/write',(req,res,next)=>{
    //获取请求参数
   let {title,content,time} = req.body;
   let username = req.session.username;
   let createTime = Date.now();
   if(time){
       //修改文章
       time = parseInt(time);
       articleModel.updateOne({createTime:time},{content,title,username}).then(data=>{
           res.redirect('/')
       }).catch(err=>{
           console.log(err);
           res.redirect('/write');
       })
   }else{
       //新增文章
       //记录写文章的用户名
       articleModel.insertMany({title,content,createTime,username}).then((data)=>{
        //入库成功执行这里
        res.redirect('/');
    }).catch((err)=>{
        //入库失败的操作
        res.redirect('/write');
    })
   }
})


//上传文件
router.post('/upload',(req,res,next)=>{
    var form = new multiparty.Form();
    form.parse(req,(err,field,files)=>{
        if(err){
            console.log('文件上传失败');
        }else {
            
            var file = files.filedata[0];
            //console.log(file)
            //读取流
            var read = fs.createReadStream(file.path);
            // //写入流
            var write = fs.createWriteStream('./public/imgs/'+file.originalFilename);
            // //管道流，图片写入指定目录
            read.pipe(write);
            write.on('close',()=>{
                res.send({err:0,msg:'/imgs/'+file.originalFilename})
            })
        }
    })
})

//删除文章
router.get('/delete',(req,res,next)=>{
    let time = req.query.time;
    articleModel.deleteOne({createTime:time}).then((data)=>{
        res.redirect('/');
    }).catch(err=>{
        res.redirect('/');
    })
})

module.exports = router;