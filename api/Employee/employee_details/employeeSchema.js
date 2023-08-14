const Joi = require('@hapi/joi');


// FOR save Personal Details
module.exports.savePersonalDetailsjwt = Joi.object().keys({
    employee_id: Joi.number().required(),
    employee_name:Joi.string().required(),
    employee_code:Joi.number().required(),
    marital_id:Joi.number().required(),
    spouse_name:Joi.string().required().allow(""),
    gender_id:Joi.number().required(),
    mother_name:Joi.string().allow(""),
    group_id:Joi.number().required().allow(0),
    father_name:Joi.string().allow(""),
    dob:Joi.string().required().allow(null),
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
  });
  module.exports.savePersonalDetails = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Contact Details
module.exports.saveContactDetailsjwt = Joi.object().keys({
    employee_id: Joi.number().required(),
    contact_person_name: Joi.string().allow(""),
    contact_number:Joi.string().allow(""),
    addressline1:Joi.string().required().allow(""), 
    addressline2:Joi.string().allow(""),
    state_id: Joi.number().required(),
    email_id:Joi.string().allow(""),
    city:Joi.string().required().allow(""), 
    mobile_number:Joi.string().required().allow(""), 
    pincode:Joi.string().allow(""),
    user_id: Joi.number().required(),
});

module.exports.saveContactDetails = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR save Bank Details
module.exports.SaveBankDetailsjwt = Joi.object().keys({
    employee_id:Joi.number().required(),
    pan_number: Joi.string().required().allow(""), 
    aadhar_number:Joi.string().required().allow(""),
    ifsc_number:Joi.string().required().allow(""), 
    name_bank_account:Joi.string().required().allow(""), 
    bank_name:Joi.string().required().allow(""), 
    branch_name:Joi.string().required().allow(""), 
    account_number:Joi.string().required().allow(""),
    user_id: Joi.number().required(),
});

module.exports.SaveBankDetails = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR save Hr Details
module.exports.SaveHrDetailsjwt = Joi.object().keys({
    employee_id:Joi.number().required(),
    category_id:Joi.number().required(),
    designation_id:Joi.number().required(),
    department_id:Joi.number().required(),
    joining_date:Joi.string().required(), 
    user_id:Joi.number().required(),
});

module.exports.SaveHrDetails = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

module.exports.employeeListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
    category_id:Joi.number().required(),
    designation_id:Joi.number().required(),
    department_id:Joi.number().required(),
  });
  module.exports.employeeList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.editEmployeejwt = Joi.object().keys({
    employee_id: Joi.number().required(),
  });
  module.exports.editEmployee = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.deleteEmployeejwt = Joi.object().keys({
    user_id: Joi.number().required(),
    employee_id: Joi.number().required(),
  });
  module.exports.deleteEmployee = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });