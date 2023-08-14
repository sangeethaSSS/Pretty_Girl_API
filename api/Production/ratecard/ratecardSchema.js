const Joi = require('@hapi/joi');

module.exports.ratecardListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
    limit:Joi.number().required(),
    offset:Joi.number().required(),
    designCode: Joi.string().allow(''),
  });
  module.exports.ratecardList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Ratecard
module.exports.saveRatecardjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    design_id: Joi.number().required(),
    rate_amount: Joi.string().required(),
});

module.exports.saveRatecard = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR delete Ratecard
module.exports.deleteRatecardjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    design_id: Joi.number().required(),
});

module.exports.deleteRatecard = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});