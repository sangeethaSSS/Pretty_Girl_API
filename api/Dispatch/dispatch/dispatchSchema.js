const Joi = require('@hapi/joi');

module.exports.itemCustomerWiseListJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    process: Joi.string().allow(''), 
    size_id: Joi.string().allow(''), 
    customer_code: Joi.string().allow(''),  
    jwtToken: Joi.string().allow(''), 
  }); 
  module.exports.designListJwt = Joi.object().keys({
    user_id: Joi.number().required(),  
    jwtToken: Joi.string().allow(''), 
  }); 
  module.exports.saveItemWiseDispatchJwt = Joi.object().keys({
    user_id: Joi.number().required(),  
    item_details: Joi.object().required().allow({}),   
    order_details: Joi.array().required().allow([]),  
    dispatch_date: Joi.string().required(),
    jwtToken: Joi.string().allow(''), 
  });   
  module.exports.saveCustomerWiseDispatchJwt = Joi.object().keys({
    user_id: Joi.number().required(),  
    customer_details: Joi.object().required().allow({}),   
    order_details: Joi.array().required().allow([]),  
    dispatch_date: Joi.string().required(),
    jwtToken: Joi.string().allow(''), 
  }); 
  module.exports.dispatchJwt = Joi.object().keys({
    user_id: Joi.number().required(),  
    dispatch_from_date: Joi.string().required().allow(''),   
    dispatch_to_date: Joi.string().required().allow(''),
    filter_type: Joi.string().required().allow(''),    
    limit:Joi.number().required(),   
    offset:Joi.number().required(),   
    designcode: Joi.string().required().allow(''),
    customercode: Joi.string().required().allow(''), 
    itemcategary_code: Joi.string().required().allow(''),
    agent_code: Joi.string().required().allow(''),    
    process: Joi.string().required().allow(''),
    jwtToken: Joi.string().allow(''), 
  });  
  module.exports.dispatchDropdownListJwt = Joi.object().keys({
    user_id: Joi.number().required(),  
    jwtToken: Joi.string().allow(''), 
  });
  module.exports.cancelDispatchDataJwt = Joi.object().keys({
    user_id: Joi.number().required(),  
    dispatch_id: Joi.number().required(),
    jwtToken: Joi.string().allow(''), 
  });
  module.exports.printItemCustomerWiseDispatchJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    process: Joi.string().allow(''), 
    dispatch_id: Joi.number().required(), 
    jwtToken: Joi.string().allow(''), 
  });
  


  