const Joi = require('@hapi/joi');

module.exports.generateJobCuttingNoJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  jwtToken: Joi.string().allow(""),
});

module.exports.onchangeJobCuttingJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  item_id: Joi.number().required(),
  jwtToken: Joi.string().allow("")
});
module.exports.getSizeForJobCuttingJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  item_id: Joi.number().required(),
  design_id: Joi.string().required(),
  jwtToken: Joi.string().allow("")
});
module.exports.getItemsForJobCuttingJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  item_id: Joi.number().required(),
  design_id: Joi.string().required(),
  start_size: Joi.string().required(),
  end_size: Joi.string().required(),
  sub_category_id: Joi.number().required(),
  color_code: Joi.string().allow(''),
  jwtToken: Joi.string().allow("")
});

module.exports.getColorsForJobCuttingJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  item_id: Joi.number().required(),
  design_id: Joi.string().required(),
  start_size: Joi.string().required(),
  end_size: Joi.string().required(),
  jwtToken: Joi.string().allow("")
});
// FOR save Jobcard
module.exports.saveJobCuttingJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  job_cutting_id: Joi.number().required(),
  job_cutting_date: Joi.string().required(),
  employee_id: Joi.number().required(),
  machine_id: Joi.number().required(),
  completed_date: Joi.string().required().allow(null),
  status_id: Joi.number().required(),
  job_cutting_seq_no: Joi.number().required(),
  item_array: Joi.array().required().allow([]),
  jwtToken: Joi.string().allow("")
});

module.exports.jobcuttingListJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  status_id: Joi.number().required(),
  itemgroup_id: Joi.number().required(),
  size_id: Joi.number().required(),
  employee_id: Joi.number().required(),
  color_id: Joi.number().required(),
  from_date: Joi.string().required().allow(""),
  to_date: Joi.string().required().allow(""),
  limit: Joi.number().required(),
  offset: Joi.number().required(),
  jwtToken: Joi.string().allow(""),
});


module.exports.editJobCuttingJwt = Joi.object().keys({
  job_cutting_id: Joi.number().required(),
  jwtToken: Joi.string().allow(""),
});


module.exports.deleteJobCuttingJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  job_cutting_id: Joi.number().required(),
  jwtToken: Joi.string().allow(""),
});

module.exports.printJobCuttingJwt = Joi.object().keys({
  job_cutting_id: Joi.number().required(),
  jwtToken: Joi.string().allow(""),
});

module.exports.fetchFilterDataJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  jwtToken: Joi.string().allow(""),
});

