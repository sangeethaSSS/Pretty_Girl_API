const Joi = require('@hapi/joi');

module.exports.jobcardListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
    itemgroup_id:Joi.number().required(),
    design_id:Joi.number().required(),
    employee_id:Joi.number().required(),
    color_id:Joi.number().required(),
    jobtype_id:Joi.number().required(),
    from_date:Joi.string().required().allow(""),
    to_date:Joi.string().required().allow(""),
  });
  module.exports.jobcardList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Jobcard
module.exports.saveJobcardjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    job_id:Joi.number().required(),
    job_date:Joi.string().required(),
    employee_id:Joi.number().required(),
    machine_id:Joi.number().required(),
    design_id:Joi.number().required().allow(null),
    item_id:Joi.number().required(),
    color_id:Joi.number().required(),
    number_set:Joi.number().required(),
    total_pieces:Joi.number().required(),
    rate:Joi.string().allow(0),
    total_amount:Joi.number().allow(0),
    size_id:Joi.number().required(),
    jobtype_id:Joi.number().required(),
    completed_date:Joi.string().required().allow(null),
    status_id:Joi.number().required(),
    job_seq_no:Joi.number().required(),
    size_name:Joi.string().allow(''),
});

module.exports.saveJobcard = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR delete Jobcard
module.exports.deleteJobcardjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    job_id:Joi.number().required(),
});

module.exports.deleteJobcard = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

module.exports.editJobcardjwt = Joi.object().keys({
    job_id:Joi.number().required(),
});
module.exports.editJobcard = Joi.object().keys({
  jwtToken: Joi.string().required(), 
});

module.exports.generateJobnojwt = Joi.object().keys({
  user_id:Joi.number().required(),
});
module.exports.generateJobno = Joi.object().keys({
jwtToken: Joi.string().required(), 
});

module.exports.saveTransferJobJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  job_id:Joi.number().required(),
  job_date:Joi.string().required(),
  employee_id:Joi.number().required(),
  machine_id:Joi.number().required(),
  design_id:Joi.number().required().allow(null),
  item_id:Joi.number().required(),
  color_id:Joi.number().required(),
  number_set:Joi.number().required(),
  total_pieces:Joi.number().required(),
  rate:Joi.string().allow(0),
  total_amount:Joi.number().allow(0),
  size_id:Joi.number().required(),
  jobtype_id:Joi.number().required(),
  completed_date:Joi.string().required().allow(null),
  status_id:Joi.number().required(),
});
module.exports.saveTransferJob = Joi.object().keys({
jwtToken: Joi.string().required(), 
});

module.exports.viewTransferJobcardjwt = Joi.object().keys({
  job_id:Joi.number().required(),
});
module.exports.viewTransferJobcard = Joi.object().keys({
jwtToken: Joi.string().required(), 
});

module.exports.updateRateJobcardjwt = Joi.object().keys({
  job_id: Joi.number().required(),
  process: Joi.string().required(),
  total_amount: Joi.string().required(),
  rate: Joi.string().required(),
  user_id: Joi.number().required(),
});
module.exports.updateRateJobcard = Joi.object().keys({
jwtToken: Joi.string().required(), 
});