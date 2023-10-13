const Joi = require('@hapi/joi');
module.exports.getGRCustomerListJwt = Joi.object().keys({
    user_id: Joi.number().required(),   
    jwtToken: Joi.string().allow(''), 
  }); 

  module.exports.getGRItemListJwt = Joi.object().keys({
    user_id: Joi.number().required(),   
    customer_code: Joi.string().required(),   
    jwtToken: Joi.string().allow(''), 
  }); 
  module.exports.getDispatchListBasedOnItemCustomerJwt = Joi.object().keys({
    user_id: Joi.number().required(),   
    customer_code: Joi.string().required(),   
    size_id: Joi.number().required(),   
    // item_array: Joi.array().required().allow([]),
    goods_return_set: Joi.number().required(),
    goods_return_pieces: Joi.number().required(),
    jwtToken: Joi.string().allow(''), 
  }); 
  module.exports.saveGoodsReturnJwt = Joi.object().keys({
    user_id: Joi.number().required(),   
    customer_code: Joi.string().required(),   
    goodsreturn_date: Joi.string().required(),
    item_details: Joi.array().required().allow([]),
    dispatch_details: Joi.array().required().allow([]),
    jwtToken: Joi.string().allow(''), 
  }); 
  module.exports.getGRListJwt = Joi.object().keys({
    user_id: Joi.number().required(),  
    goods_return_from_date: Joi.string().required().allow(''),   
    goods_return_to_date: Joi.string().required().allow(''),  
    limit:Joi.number().required(),   
    offset:Joi.number().required(),   
    size_id: Joi.string().required().allow(''),
    customer_code: Joi.string().required().allow(''),        
    process: Joi.string().required().allow(''),
    jwtToken: Joi.string().allow(''), 
  });  
  
  module.exports.getGRFilterListJwt = Joi.object().keys({
    user_id: Joi.number().required(),   
    jwtToken: Joi.string().allow(''), 
  }); 
  module.exports.cancelGoodsReturnJwt = Joi.object().keys({
    user_id: Joi.number().required(),   
    goods_return_id: Joi.number().required(),   
    jwtToken: Joi.string().allow(''), 
  }); 

  