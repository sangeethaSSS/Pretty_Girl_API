
const employeeMgmtService = require('../../../service/employeeMgmtService');
const constants = require('../../../constants');

//Create Personal JWt Module
module.exports.savePersonalDetailsjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.savePersonalDetailsjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//save Personal Module
module.exports.savePersonalDetails = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.savePersonalDetails(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}


//Create Contact Details JWt Module
module.exports.saveContactDetailsjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.saveContactDetailsjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Save Contact Details Module
module.exports.saveContactDetails = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.saveContactDetails(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create  Bank Details JWt Module
module.exports.SaveBankDetailsjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.SaveBankDetailsjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//save Bank Details Module
module.exports.SaveBankDetails = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.SaveBankDetails(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}


//Create  Hr Details JWt Module
module.exports.SaveHrDetailsjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.SaveHrDetailsjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//save Hr Details Module
module.exports.SaveHrDetails = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.SaveHrDetails(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create JWt Module
module.exports.employeeListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.employeeListjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Employee List Module
module.exports.employeeList = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.employeeList(req.body);
    if (!responseFromService.token) {
      response.status = 200;
      response.message = constants.success_message.LISTED_SUCCESS;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create JWt Module
module.exports.editEmployeejwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.editEmployeejwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Edit Employee List Module
module.exports.editEmployee = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.editEmployee(req.body);
    if (!responseFromService.token) {
      response.status = 200;
      response.message = constants.success_message.LISTED_SUCCESS;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create JWt Module
module.exports.deleteEmployeejwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.deleteEmployeejwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Employee List Module
module.exports.deleteEmployee = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await employeeMgmtService.deleteEmployee(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}