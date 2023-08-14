const Joi = require('@hapi/joi');

module.exports.designationListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
  });
  module.exports.designationList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Designation
module.exports.saveDesignationjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    designation_name: Joi.string().required(),
    designation_id: Joi.number().required(),
    status_id: Joi.number().required(),
});

module.exports.saveDesignation = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR delete Designation
module.exports.deleteDesignationjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    designation_id: Joi.number().required(),
});

module.exports.deleteDesignation = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});