const Joi = require('@hapi/joi');

//Check input schema
module.exports.userMasterJwt = Joi.object().keys({
    device_id: Joi.string().required(),  
    jwtToken: Joi.string().allow(''), 
}); 
//Check sync details
module.exports.syncDetails = Joi.object().keys({
  device_id: Joi.string().required(),   
  file_name: Joi.string().required(),   
}); 

//Check input schema
module.exports.customerSchema = Joi.object().keys({
  device_id: Joi.string().required(),  
  jsonCustomer : Joi.object(),
  jwtToken: Joi.string().allow(''), 
}); 

//Check Master Schema
module.exports.masterSchema = Joi.object().keys({
  device_id: Joi.string().required(),   
  jwtToken: Joi.string().allow(''), 
}); 
 
//Check Delete details
module.exports.syncDeleteSchema = Joi.object().keys({
  device_id: Joi.string().required(),   
  jwtToken: Joi.string().allow(''), 
}); 
module.exports.OrderTakingCheck = Joi.object().keys({
  device_id: Joi.string().required(),   
  order_no: Joi.string().required(), 
});



//Check input schema
module.exports.orderSchema = Joi.object().keys({
  device_id: Joi.string().required(),  
  jsonOrder: Joi.object(),
  jsonOrderItems : Joi.object(),
  jwtToken: Joi.string().allow(''), 
}); 

//Check input schema
module.exports.deleteOrderSchema = Joi.object().keys({
  device_id: Joi.string().required(),  
  jsonOrder: Joi.object(), 
  jwtToken: Joi.string().allow(''), 
}); 

//Check input schema
module.exports.stockTransaction = Joi.object().keys({
  device_id: Joi.string().required(),    
  jwtToken: Joi.string().allow(''), 
});  
//Check input schema
module.exports.checkStock = Joi.object().keys({
  device_id: Joi.string().required(),  
  jsonItems: Joi.object(), 
  size_id: Joi.string().allow(''), 
  qty: Joi.string().allow(''), 
  process: Joi.string().allow(''), 
}); 

module.exports.getCurrentStock = Joi.object().keys({
  device_id: Joi.string().required(),   
  set_type: Joi.string().allow(''),
  design_id:Joi.string().allow(''),
  item_id:Joi.string().allow('')
});
module.exports.GetDispatchReportList = Joi.object().keys({
  device_id: Joi.string().required(),   
  company_code: Joi.string().allow(''),
  from_date: Joi.string().required().allow(''),  
  to_date: Joi.string().required().allow(''),   
});