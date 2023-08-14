
const departmentMgmtService = require('../../../service/departmentMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.departmentListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await departmentMgmtService.departmentListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Department List Module
module.exports.departmentList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await departmentMgmtService.departmentList(req.body); 
    if(!responseFromService.token) {
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
module.exports.saveDepartmentjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await departmentMgmtService.saveDepartmentjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Save Department Module
module.exports.saveDepartment = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await departmentMgmtService.saveDepartment(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create JWt Module
module.exports.deleteDepartmentjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await departmentMgmtService.deleteDepartmentjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Department Module
module.exports.deleteDepartment = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await departmentMgmtService.deleteDepartment(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }