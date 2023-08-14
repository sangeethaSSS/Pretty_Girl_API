const Joi = require('@hapi/joi');

module.exports.ironmachineListJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(), 
  });
  module.exports.ironmachineList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Itemgroup
module.exports.saveIronmachineJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    machine_name: Joi.string().required(),
    machine_id: Joi.number().required(),
    status_id: Joi.number().required(),
    machine_no:Joi.string().required(),
});

module.exports.saveIronmachine = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR delete Itemgroup
module.exports.deleteIronmachineJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    machine_id: Joi.number().required(),
});

module.exports.deleteIronmachine = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});