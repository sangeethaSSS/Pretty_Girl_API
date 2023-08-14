const Joi = require('@hapi/joi');

module.exports.itemListjwt = Joi.object().keys({
    user_id: Joi.number().required(), 
  });
module.exports.itemList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
}); 
module.exports.moveToFGjwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    box_array: Joi.array().required().allow([]), 
    fg_job_array: Joi.array().required().allow([]), 
    jwtToken: Joi.string().allow(''), 
});  
module.exports.getFGJobIdListjwt = Joi.object().keys({
  user_id: Joi.number().required(), 
  box_array: Joi.array().required().allow([]), 
  jwtToken: Joi.string().allow(''), 
}); 
module.exports.getFGListJwt = Joi.object().keys({
  user_id: Joi.number().required(),  
  fg_from_date: Joi.string().required().allow(''),   
  fg_to_date: Joi.string().required().allow(''),
  limit:Joi.number().required(),   
  offset:Joi.number().required(),   
  size_id: Joi.string().required().allow(''),
  machine_id: Joi.string().required().allow(''),    
  process: Joi.string().required().allow(''),
  jwtToken: Joi.string().allow(''), 
}); 
module.exports.getCurrentStockJwt = Joi.object().keys({
  user_id: Joi.number().required(),  
  size_id: Joi.string().required().allow(''), 
  machine_id: Joi.string().required().allow(''),  
  limit:Joi.number().required(),   
  offset:Joi.number().required(),   
  process: Joi.string().required().allow(''),
  color_id: Joi.string().allow(''),
  jwtToken: Joi.string().allow(''), 
});
