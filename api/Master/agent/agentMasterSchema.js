const Joi = require('@hapi/joi');

// FOR save Agent Management
module.exports.saveAgentjwt = Joi.object().keys({
    agent_id:Joi.number().required(),
    user_id:Joi.number().required(),
    agent_name: Joi.string().required(),
    mobile_no: Joi.string().required(), 
    city_name: Joi.string().required(), 
    alternative_mobile_no: Joi.string().allow(''), 
    status_id: Joi.number().required(), 
    state_id: Joi.number().required(),
    address_name: Joi.string().allow(''), 
    pincode: Joi.string().allow(''), 
    email_id: Joi.string().allow(''), 
});

module.exports.saveAgent = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

// FOR List Agent Management
module.exports.listAgentjwt = Joi.object().keys({
    status_id:Joi.number().required(),
    user_id:Joi.number().required(),
});

module.exports.listAgent = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

// FOR Delete Agent Management
module.exports.deleteAgentjwt = Joi.object().keys({
    agent_id:Joi.number().required(),
    user_id:Joi.number().required(),
});

module.exports.deleteAgent = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});