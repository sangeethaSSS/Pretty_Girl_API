const Joi = require('@hapi/joi');

module.exports.designListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
  });
  module.exports.designList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Design
module.exports.saveDesignjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    design_no: Joi.string().required(),
    design_id: Joi.number().required(),
    status_id: Joi.number().required(),
    piece_rate:Joi.number().allow(0),
});

module.exports.saveDesign = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

module.exports.designPhotography = Joi.object().keys({ 
    image_array:Joi.array().required().allow([]),
    delete_array:Joi.array().required().allow([]),
    design_id: Joi.number().required(), 
    user_id: Joi.number().required(),
  });

//FOR delete Design
module.exports.deleteDesignjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    design_id: Joi.number().required(),
});

module.exports.deleteDesign = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

module.exports.editdesignjwt = Joi.object().keys({
  design_id:Joi.number().required(),
});
module.exports.editdesign = Joi.object().keys({
  jwtToken: Joi.string().required(), 
});