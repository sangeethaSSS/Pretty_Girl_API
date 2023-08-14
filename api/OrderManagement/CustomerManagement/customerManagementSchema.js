const Joi = require('@hapi/joi');

module.exports.getCustomersJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().allow(''),
    state: Joi.number().allow(''), 
    agent_id: Joi.number().allow(''), 
    customer_name: Joi.string().allow(''),
  });
  module.exports.getCustomers = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Customer Management
module.exports.saveCustomerManagementjwt = Joi.object().keys({
    customer_name: Joi.string().required(),
    contact_person: Joi.string().allow(''), 
    mobile_no: Joi.string().required(), 
    alternative_mobile_no: Joi.string().allow(''), 
    // door_no: Joi.string().allow(''),
    street: Joi.string().allow(''), 
    area: Joi.string().allow(''), 
    city: Joi.string().allow(''), 
    pincode: Joi.string().allow(''), 
    email_id: Joi.string().allow(''), 
    gstin_no: Joi.string().allow(''), 
    status_code: Joi.number().allow(''), 
    type: Joi.string().allow(''),
    state: Joi.number().allow(''),
    // country: Joi.number().allow(''),
    transport_name: Joi.string().allow(''), 
    transport_contact_no: Joi.string().allow(''),
    transport_contact_person: Joi.string().allow(''),
    agent_code:Joi.number().required(),
    transport_location: Joi.string().allow(''),
    user_id:Joi.number().required(),
});

module.exports.saveCustomerManagement = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});


// FOR updateCustomerJwt
module.exports.updateCustomerJwt = Joi.object().keys({
    customer_name: Joi.string().required(),
    contact_person: Joi.string().allow(''), 
    mobile_no: Joi.string().required(), 
    alternative_mobile_no: Joi.string().allow(''), 
    // door_no: Joi.string().allow(''),
    street: Joi.string().allow(''), 
    area: Joi.string().allow(''), 
    city: Joi.string().allow(''), 
    pincode: Joi.string().allow(''), 
    email_id: Joi.string().allow(''), 
    gstin_no: Joi.string().allow(''), 
    status_code: Joi.number().required(), 
    state: Joi.number().allow(''),
    // country: Joi.number().allow(''),
    type: Joi.string().allow(''),
    transport_name: Joi.string().allow(''), 
    agent_code:Joi.number().required(),
    transport_contact_no: Joi.string().allow(''),
    transport_location: Joi.string().allow(''),
    transport_contact_person: Joi.string().allow(''),
    user_id:Joi.number().required(),
    customer_code:Joi.string().required()
});

module.exports.updateCustomer = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

module.exports.deleteCustomerJwt = Joi.object().keys({
    user_id:Joi.number().required(),
    customer_code:Joi.string().required(),
});

module.exports.deleteCustomer = Joi.object().keys({
    jwtToken: Joi.string().required(),  
});

//FOR Edit Item
module.exports.getCustomerDetailsJwt = Joi.object().keys({
    user_id:Joi.number().required(),
    customer_code:Joi.string().required(),
});

module.exports.getCustomerDetails = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});
