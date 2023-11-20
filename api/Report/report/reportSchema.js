const Joi = require('@hapi/joi');


module.exports.employeePerformanceFilterListJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  jwtToken: Joi.string().allow(""), 
});
module.exports.pendingJobReportListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    item_id:Joi.number().required(),
    jobtype_id:Joi.number().required(),
  });
  module.exports.pendingJobReportList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.employeePerformanceReportListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    item_id:Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    employee_code:Joi.string().allow(''),
  });
  module.exports.employeePerformanceReportList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.payoutReportListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
  });
  module.exports.payoutReportList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.dashboardCountListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
  });
  module.exports.dashboardCountList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.specificEmployeeListjwt = Joi.object().keys({
    employee_id: Joi.number().required(),
    user_id: Joi.number().required(),
    item_id:Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
  });
  module.exports.specificEmployeeList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.pendingListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
  });
  module.exports.pendingList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });
  module.exports.pendingOrderReportListjwt = Joi.object().keys({
    size_id: Joi.string().allow(''), 
    customer_code: Joi.string().allow(''),  
    user_id: Joi.number().required(),   
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    limit:Joi.number().required(),   
    offset:Joi.number().required(),
    process: Joi.string().required().allow(''),
    agent_code: Joi.string().required().allow(''),
  });
  module.exports.pendingOrderReportList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.pendingOrderDropdownjwt = Joi.object().keys({
    user_id: Joi.number().required(),
  });
  module.exports.pendingOrderDropdown = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });
  //
  module.exports.dashboardListJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    date:Joi.string().required(),
    jwtToken: Joi.string().allow(''), 
  });
  module.exports.customerRetailReportJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date: Joi.string().required(),
    to_date: Joi.string().required(),
    customer_name: Joi.string().required(),
    jwtToken: Joi.string().allow(''), 
  });

  module.exports.GetCustomerDetailsJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    jwtToken: Joi.string().allow('')
  });

  module.exports.GetDetailedOrdersJwt = Joi.object().keys({
    user_id: Joi.number().required(),    
    limit: Joi.number().required(),
    offset: Joi.number().required(),
    process: Joi.string().required(),
    from_date: Joi.string().required(),
    to_date: Joi.string().required(),
    customer_name: Joi.string().required(),
    jwtToken: Joi.string().allow(''),
  });


  /******************* Employee Performance for job cutting *******************/   
  module.exports.employeeJobCuttingPerformanceFilterListJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    jwtToken: Joi.string().allow(""), 
  });
  module.exports.employeeJobCuttingPerformanceReportListJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    item_id:Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    employee_code:Joi.string().allow(''),
    jwtToken: Joi.string().allow(''),
  });

  module.exports.specificJobCuttingEmployeeListJwt = Joi.object().keys({
    employee_id: Joi.number().required(),
    user_id: Joi.number().required(),
    item_id:Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    jwtToken: Joi.string().allow(''),
  });
  