const Joi = require('@hapi/joi');

module.exports.machineListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
  });
  module.exports.machineList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Machine
module.exports.saveMachinejwt = Joi.object().keys({
    user_id: Joi.number().required(),
    machine_no: Joi.string().required(),
    machine_id: Joi.number().required(),
    status_id: Joi.number().required(),
    employee_id: Joi.number().required().allow(null),
});

module.exports.saveMachine = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR delete Machine
module.exports.deleteMachinejwt = Joi.object().keys({
    user_id: Joi.number().required(),
    machine_id: Joi.number().required(),
});

module.exports.deleteMachine = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});