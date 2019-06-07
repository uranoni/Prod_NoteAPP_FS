const mongoose = require('mongoose');
const validator = require('validator');
const isEmail = require('validator/lib/isEmail')
const dayjs = require('dayjs')
const _ = require('lodash')
const uuidv4 = require('uuid/v4');

const UserSchema = new mongoose.Schema({
  id:{
    type:String,
    default:uuidv4()
  },
  email:{
    type:String,
    required:true,
    trim: true,
    minlength:5,
    unique:true,
    validate:{
      validator:(value)=>{validator.isEmail(value)},
      message:'${value}是不合法信箱'
    }
    },
    password:{
    type:String,
    required:true,
    minlength:6
  },
    name:{
      type:String,
      required:true
      }  ,
    tokens:[{
    token:{
      type:String
    }
  }],
      role:{
    type:String,
    default:"user"
},
createAt:{
  type:String,
  default:dayjs().format('YYYY-MM-DD HH:mm:ss')
}
})

const User = mongoose.model("User",UserSchema);
module.exports = {User}