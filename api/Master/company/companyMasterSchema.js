const Joi = require('@hapi/joi');

//Check input schema
module.exports.companyListJwt = Joi.object().keys({
    user_id: Joi.number().required(),
  });
  module.exports.companyList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.saveCompanyJwt = Joi.object().keys({
    company_id: Joi.number().required(), 
    company_name: Joi.string().required(), 
    short_name:Joi.string().allow(""), 
    addressline1: Joi.string().allow(""), 
    addressline2: Joi.string().allow(""), 
    area: Joi.string().allow(""), 
    city_name:Joi.string().required(),
    pincode:Joi.string().allow(""), 
    state_id: Joi.number().required(), 
    mobile_number: Joi.string().required(),
    telephone_number:Joi.string().allow(""),
    user_id: Joi.number().required(),
    email_id :Joi.string().allow(""), 
    gstin : Joi.string().allow(""), 
    status_id :Joi.number().required()
  });
  module.exports.saveCompany = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.deleteCompanyJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    company_id: Joi.number().required(), 
  });
  module.exports.deleteCompany = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });