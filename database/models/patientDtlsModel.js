/****************************
 File    : userMgmtModel.js
 Author  : Aruna Devi
 Date    : 14-06-2021
 Purpose : patientDtls Model 
 * ********************** */
 const mongoose = require('mongoose');

 const patientDtlsSchema = new mongoose.Schema({
   lName:String,
   pincode:String,
   gender:Number,
   city:String,
   patId:String,
   mobileNbr:String,
   fName:String,
   dob:Date,
   addressLine1:String,
   addressLine2:String,
   state:String,
   age:Number,
   email:String,
   relation:String,
   event:Boolean,
   notify:Boolean,
   lang:String,
   seqId:Number
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
 
 module.exports = mongoose.model('patientDtls', patientDtlsSchema,'patientDtls');