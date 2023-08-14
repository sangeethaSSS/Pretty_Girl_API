
const ironmachineMasterService = require('../../../service/ironmachineMasterService');
const constants = require('../../../constants');
//Create JWt Module
module.exports.ironmachineListJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await ironmachineMasterService.ironmachineListJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//ironmachine List Module
module.exports.ironmachineList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await ironmachineMasterService.ironmachineList(req.body); 
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
module.exports.saveIronmachineJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await ironmachineMasterService.saveIronmachineJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//ironmachine List Module
module.exports.saveIronmachine = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await ironmachineMasterService.saveIronmachine(req.body); 
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
module.exports.deleteIronmachineJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await ironmachineMasterService.deleteIronmachineJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//ironmachine List Module
module.exports.deleteIronmachine = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await ironmachineMasterService.deleteIronmachine(req.body); 
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

