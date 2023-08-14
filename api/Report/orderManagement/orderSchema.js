const Joi = require('@hapi/joi');
 
  module.exports.customerwiseOrderListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date: Joi.string().required(),
    limit: Joi.number().required(),
    offset: Joi.number().required(),
    status_id: Joi.number().required(),
    process: Joi.string().required(),
    company_code:Joi.string().allow(''),
  });
  module.exports.customerwiseOrderList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.itemwiseOrderListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date: Joi.string().required(),
    limit: Joi.number().required(),
    offset: Joi.number().required(),
    color_id: Joi.string().allow(''),
    design_id: Joi.string().allow(''),
    size_id: Joi.string().allow(''),
    customer_code: Joi.string().allow('')
  });
  module.exports.itemwiseOrderList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  
  module.exports.customerOrderListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date: Joi.string().required(),
    limit: Joi.number().required(),
    offset: Joi.number().required(),
    company_code: Joi.string().allow(''),
    design_id: Joi.string().allow(''),
    color_id: Joi.string().allow(''),
    size_id: Joi.string().allow(''),
    process:Joi.string().required(),
  });
  module.exports.customerOrderList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });
  
  
  module.exports.currentStockListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date: Joi.string().required(),
    limit: Joi.number().required(),
    offset: Joi.number().required(),
    company_code:Joi.string().allow(''),
  });
  module.exports.currentStockList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.reportMasterListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    process:Joi.string().required(), 
  });
  module.exports.reportMasterList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.excelItemWiseOrderListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date: Joi.string().required(),
    color_id: Joi.string().allow(''),
    design_id: Joi.string().allow(''),
    size_id: Joi.string().allow(''),
    customer_code: Joi.string().allow('')
  });
  module.exports.excelItemWiseOrderList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });