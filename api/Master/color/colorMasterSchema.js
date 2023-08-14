const Joi = require('@hapi/joi');

module.exports.colorListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id : Joi.number().required(),
  });
  module.exports.colorList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Color
module.exports.saveColorjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    color_name: Joi.string().required(),
    color_id: Joi.number().required(),
    color_picker:Joi.string().required().allow(""),
    status_id: Joi.number().required(),
});

module.exports.saveColor = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR delete Color
module.exports.deleteColorjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    color_id: Joi.number().required(),
});

module.exports.deleteColor = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});