const Joi = require('@hapi/joi');

module.exports.ViewjobCuttingsjwt = Joi.object().keys({
  user_id: Joi.number().required(),
  from_date: Joi.string().required(),
  to_date: Joi.string().required(),
  employee_id: Joi.string().required().allow(''),
  jwtToken: Joi.string().allow(''),
  status_id: Joi.number().required(),
});

module.exports.savejobCuttingProcessjwt = Joi.object().keys({
  process_id: Joi.number().required(),
  salary_amt: Joi.string().required(),
  employee_details: Joi.array().required().allow([]),
  jwtToken: Joi.string().allow(''),
  user_id: Joi.number().required(),
  status_id: Joi.number().required(),
  from_date: Joi.string().required(),
  to_date: Joi.string().required(),
  no_of_employee: Joi.number().required(),
  total_pieces: Joi.number().required(),
});

module.exports.jobCuttingProcessListjwt = Joi.object().keys({
  user_id: Joi.number().required(),
  from_date: Joi.string().required(),
  to_date: Joi.string().required(),
  limit: Joi.number().required(),
  offset: Joi.number().required(),
  jwtToken: Joi.string().allow(''),
});

module.exports.editProcessjwt = Joi.object().keys({
  process_id: Joi.number().required(),
  jwtToken: Joi.string().allow('')
});
module.exports.editProcess = Joi.object().keys({
});
module.exports.deleteProcessjwt = Joi.object().keys({
  process_id: Joi.number().required(),
  user_id: Joi.number().required(),
  jwtToken: Joi.string().allow('')
});
module.exports.payslipListjwt = Joi.object().keys({
  process_id: Joi.number().required(),
});
module.exports.payslipList = Joi.object().keys({
  jwtToken: Joi.string().required(),
});