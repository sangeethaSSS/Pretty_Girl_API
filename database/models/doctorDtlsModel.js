/****************************
 File    : doctorDtlsModel.js
 Author  : Aruna Devi
 Date    : 24-06-2021
 Purpose : doctorDtlsModel Model 
 * ********************** */
const mongoose = require('mongoose');

const doctorDtlsSchema = new mongoose.Schema({
  regNo:String,
  lastName:String,
  subspecialization:String,
  pincode:String,
  city:String,
  docId:String,
  telephone3:String,
  telephone2:String,
  telephone1:String,
  mobileno:String,
  firstName:String,
  qualification:String,
  consultingTime:Array,
  hospitalLab:String,
  specialization:String,
  addressLine1:String,
  addressLine2:String,
  state:String,
  email:String,
  crdBy:Number,
  seqId:Number,
 
}, {
    timestamps: true,
    toObject: {
      transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  });

module.exports = mongoose.model('doctorDtls', doctorDtlsSchema,'doctorDtls');