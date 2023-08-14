const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
  ip_addr :String,
  user_id:Number,
  role_id:Number,
  operation:String
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

module.exports = mongoose.model('user_logs', userLogSchema,'user_logs');