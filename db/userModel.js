var mongoose = require('mongoose');

var userScheam = mongoose.Schema({
    username:String,
    password:String,
    createTime:Number
})

var userModel = mongoose.model('users',userScheam);

module.exports = userModel;