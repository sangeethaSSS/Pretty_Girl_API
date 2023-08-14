/****************************
 File    : reportDtlsModel.js
 Author  : Mangaleswari
 Date    : 23-03-2022
 Purpose : reportDtls collection structure
 * ********************** */

const mongoose = require('mongoose');
// const paterxDtls = new mongoose.Schema({
//   ocrData:String,
//   temparature:Number,
//   labobsv:Object,
//   patId:String,
//   docId:String,
//   weight:Number,
//   presFileType:String,
//   bp:String,
//   presFileName:String,
//   l2Status:Number,
//   createdAt:Number,
//   doctorobsv:Object,
//   erxUrl:String,
//   l1Status:Number,
//   spo2:String,
//   l3Status:Number,
//   pulse:String,
//   erxReqId:Number,
//   erxId:String,
//   hypertension:String,
//   diabetes:String,
//   mediaName:String,
//   updatedAt:Number,
//   presDtls:Array,
//   status:Number,
//   rejectnotes:String
// }, {
//     timestamps: true,
//     toObject: {
//       transform: function (doc, ret, options) {
//         ret.id = ret._id;
//         delete ret._id;
//         delete ret.__v;
//         return ret;
//       }
//     }
//   });

//  module.exports = mongoose.model('reportDtls', reportDtls,'reportDtls');