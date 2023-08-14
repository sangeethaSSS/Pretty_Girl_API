
const customerMgmtService = require('../../../service/customerMgmtService');
const constants = require('../../../constants');


//Create JWt Module - get customers
module.exports.getCustomersJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await customerMgmtService.getCustomersJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//get customers Module
module.exports.getCustomers = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await customerMgmtService.getCustomers(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create JWt Module - customer
module.exports.saveCustomerManagementjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await customerMgmtService.saveCustomerManagementjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Save customer Module
module.exports.saveCustomerManagement = async (req, res) => {
let response = {};
try {   
  const responseFromService = await customerMgmtService.saveCustomerManagement(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}



//Create JWt Module - update customer
module.exports.updateCustomerJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await customerMgmtService.updateCustomerJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//update customer Module
module.exports.updateCustomer = async (req, res) => {
let response = {};
try {   
  const responseFromService = await customerMgmtService.updateCustomer(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}



//Create JWt Module - delete customer
module.exports.deleteCustomerJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await customerMgmtService.deleteCustomerJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//delete customer Module
module.exports.deleteCustomer = async (req, res) => {
let response = {};
try {   
  const responseFromService = await customerMgmtService.deleteCustomer(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}




//Create JWt Module - edit customer
module.exports.getCustomerDetailsJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await customerMgmtService.getCustomerDetailsJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//edit customer Module
module.exports.getCustomerDetails = async (req, res) => {
let response = {};
try {   
  const responseFromService = await customerMgmtService.getCustomerDetails(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}
