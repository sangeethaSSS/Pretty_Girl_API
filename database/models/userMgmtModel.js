/****************************
 File    : userMgmtModel.js
 Author  : Aruna Devi
 Date    : 14-06-2021
 Purpose : userMgmt Model 
 * ********************** */
const mongoose = require('mongoose');

const userMgmtSchema = new mongoose.Schema({
  fName:String,
  lName:String,
  crdBy:Number,
  roleId:Number,
  ctcDtls:Object,
  roleName:String,
  pwd:String,
  userId:String,
  userCode:Number,
  drDtls:Object,
  makerId:Number,
  status:String

}, {
    timestamps: true,
    toObject: {
      transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.pwd;
        delete ret.__v;
        return ret;
      }
    }
  });

module.exports = mongoose.model('userMgmt', userMgmtSchema,'userMgmt');