const Joi = require('@hapi/joi');
module.exports.employeeProcessListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    employee_id:Joi.number().required(),
    department_id:Joi.number().required(),
  });
  module.exports.employeeProcessList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.savePayoutjwt = Joi.object().keys({
    payout_id: Joi.number().required(),
    payout_amt: Joi.string().required(),
    payout_details:Joi.array().required().allow([]),
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    no_of_employee:Joi.number().required(),
    total_pieces:Joi.number().required(),
  });
  module.exports.savePayout = Joi.object().keys({
    payout_id: Joi.number().required(),
    payout_amt: Joi.string().required(),
    payout_details:Joi.array().required().allow([]),
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    no_of_employee:Joi.number().required(),
    total_pieces:Joi.number().required(),
    jwtToken: Joi.string().required(), 
  });

  module.exports.payoutListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
  });
  module.exports.payoutList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.editPayoutjwt = Joi.object().keys({
    payout_id: Joi.number().required(),
    process_id: Joi.number().required()
  });
  module.exports.editPayout = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.payoutslipListjwt = Joi.object().keys({
    process_id: Joi.number().required(),
    payout_id:  Joi.number().required()
  });
  module.exports.payoutslipList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });