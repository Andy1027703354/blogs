
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blogs',{
   useNewUrlParser: true,
   useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',(err)=>{
   console.log('连接数据库错误');
})

db.once('open',()=>{
   console.log('连接数据库成功');
})