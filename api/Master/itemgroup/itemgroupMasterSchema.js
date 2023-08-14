const Joi = require('@hapi/joi');

module.exports.itemgroupListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(), 
  });
  module.exports.itemgroupList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Itemgroup
module.exports.saveItemgroupjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    itemgroup_name: Joi.string().required(),
    itemgroup_id: Joi.number().required(),
    status_id: Joi.number().required(),
    short_name:Joi.string().required(),
});

module.exports.saveItemgroup = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR delete Itemgroup
module.exports.deleteItemgroupjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    itemgroup_id: Joi.number().required(),
});

module.exports.deleteItemgroup = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});