const Joi = require('@hapi/joi');
module.exports.employeeProcessListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    employee_id:Joi.string().required().allow(''),
    jwtToken: Joi.string().allow('')
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
    jwtToken: Joi.string().allow('')
  });

  module.exports.jobCuttingPayoutListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date:Joi.string().required(),
    limit: Joi.number().required(),
    offset: Joi.number().required(),
    jwtToken: Joi.string().allow('')
  });

  module.exports.editPayoutjwt = Joi.object().keys({
    payout_id: Joi.number().required(),
    process_id: Joi.number().required(),
    jwtToken: Joi.string().allow('')
  });

  module.exports.payoutslipListjwt = Joi.object().keys({
    process_id: Joi.number().required(),
    payout_id:  Joi.number().required()
  });
  module.exports.payoutslipList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });