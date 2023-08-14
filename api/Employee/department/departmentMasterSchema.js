const Joi = require('@hapi/joi');

module.exports.departmentListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
  });
  module.exports.departmentList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Department
module.exports.saveDepartmentjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    department_name: Joi.string().required(),
    department_id: Joi.number().required(),
    status_id: Joi.number().required(),
});

module.exports.saveDepartment = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR delete Department
module.exports.deleteDepartmentjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    department_id: Joi.number().required(),
});

module.exports.deleteDepartment = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});