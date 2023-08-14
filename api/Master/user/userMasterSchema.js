const Joi = require('@hapi/joi');

module.exports.userListjwt = Joi.object().keys({
    status_id:Joi.number().required(),
    user_id: Joi.number().required(), 
  });
  module.exports.userList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save User
module.exports.saveUserjwt = Joi.object().keys({
    user_code: Joi.string().required().allow(""), 
    user_name: Joi.string().required().allow(""), 
    password: Joi.string().required().allow(""),
    userrole_id:Joi.number().required().allow(0), 
    status_id: Joi.number().required(),
    user_id: Joi.number().required(), 
    branch_id:Joi.number().required(), 
    created_by : Joi.number().required(), 
    devices_id:Joi.string().required().allow(""),
    pin_number: Joi.string().required().allow(""),
    mobile_no : Joi.string().allow(""),
    access_flag: Joi.number().required(),
    menu_array: Joi.array()
});

module.exports.saveUser = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR delete User
module.exports.deleteUserjwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    created_by : Joi.number().required(),
});

module.exports.deleteUser = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

module.exports.resetPasswordJwt = Joi.object().keys({
    new_password: Joi.string().required(),
    user_id: Joi.number().required(), 
  });
  module.exports.resetPassword = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.onchangepasswordJwt = Joi.object().keys({
    user_id :Joi.number().required(),
    old_password:Joi.string().required(),
    new_password:Joi.string().required(),
});

module.exports.onchangepassword = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});