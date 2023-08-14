
const designationMgmtService = require('../../../service/designationMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.designationListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await designationMgmtService.designationListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Designation List Module
module.exports.designationList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await designationMgmtService.designationList(req.body); 
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
module.exports.saveDesignationjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await designationMgmtService.saveDesignationjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Save Designation Module
module.exports.saveDesignation = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await designationMgmtService.saveDesignation(req.body); 
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
module.exports.deleteDesignationjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await designationMgmtService.deleteDesignationjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Designation Module
module.exports.deleteDesignation = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await designationMgmtService.deleteDesignation(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }