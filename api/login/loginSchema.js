const Joi = require('@hapi/joi');

//Check input schema
module.exports.loginJwt = Joi.object().keys({
    user_name: Joi.string().required(), 
    password: Joi.string().required(), 
    // generativeToken: Joi.string().required()
  });
  module.exports.login = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });