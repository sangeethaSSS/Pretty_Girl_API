const Joi = require('@hapi/joi');

module.exports.employeeListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    employee_id:Joi.number().required(),
    department_id:Joi.number().required(),
  });
  module.exports.employeeList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.saveProcessjwt = Joi.object().keys({
    process_id: Joi.number().required(),
    salary_amt: Joi.string().required(),
    employee_details:Joi.array().required().allow([]),
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    no_of_employee:Joi.number().required(),
    total_pieces:Joi.number().required(),
  });
module.exports.saveProcess = Joi.object().keys({
  process_id: Joi.number().required(),
  salary_amt: Joi.string().required(),
  employee_details:Joi.array().required().allow([]),
  user_id: Joi.number().required(),
  status_id:Joi.number().required(),
  from_date:Joi.string().required(),
  to_date:Joi.string().required(),
  no_of_employee:Joi.number().required(),
  total_pieces:Joi.number().required(),
    jwtToken: Joi.string().required(), 
  });
  module.exports.processListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
  });
  module.exports.processList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });
  module.exports.editProcessjwt = Joi.object().keys({
    process_id: Joi.number().required(),
  });
  module.exports.editProcess = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });
  module.exports.deleteProcessjwt = Joi.object().keys({
    process_id: Joi.number().required(),
    user_id: Joi.number().required(),
  });
  module.exports.deleteProcess = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });
  module.exports.payslipListjwt = Joi.object().keys({
    process_id: Joi.number().required(),
  });
  module.exports.payslipList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });