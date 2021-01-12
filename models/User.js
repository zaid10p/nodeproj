const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min : 3
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        min : 5
    },
    date : {
        type :Date,
        default : Date.now
    },
    resetToken:String,
    expireToken:Date,
  
})

module.exports =  mongoose.model("User",userSchema);