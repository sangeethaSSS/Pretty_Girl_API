const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    patId: String,
    erxReqId: Number,
    chatLogs: Array
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

module.exports = mongoose.model('patchatLogs', chatLogSchema,'patchatLogs');