const Joi = require('@hapi/joi');

//Check input schema
module.exports.fetchcommonDataJwt = Joi.object().keys({
    user_id: Joi.number().required(),
  });
  module.exports.fetchcommonData = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.onchangeitemDataJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    searchvalue:Joi.string().required().allow(''),
  });
  module.exports.onchangeitemData = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.onchangeMachineDataJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    searchvalue:Joi.string().required().allow(''),
  });
  module.exports.onchangeMachineData = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.onchangeDesignDataJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    searchvalue:Joi.string().required().allow(''),
  });
  module.exports.onchangeDesignData = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.onchangeSizeDataJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    item_id: Joi.number().required(),
  });
  module.exports.onchangeSizeData = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.onchangeEmployeeDataJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    searchvalue:Joi.string().required().allow(''),
  });
  module.exports.onchangeEmployeeData = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.onchangeMachineEmployeeDataJwt = Joi.object().keys({
    machine_id: Joi.number().required(),
  });
  module.exports.onchangeMachineEmployeeData = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.onchangeJobCardJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    item_id: Joi.string().allow(''),
    process: Joi.string().allow(''),
  });
  module.exports.onchangeJobCard = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });