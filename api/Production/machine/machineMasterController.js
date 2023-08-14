
const machineMgmtService = require('../../../service/machineMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.machineListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await machineMgmtService.machineListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Machine List Module
module.exports.machineList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await machineMgmtService.machineList(req.body); 
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
module.exports.saveMachinejwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await machineMgmtService.saveMachinejwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Save Machine Module
module.exports.saveMachine = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await machineMgmtService.saveMachine(req.body); 
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
module.exports.deleteMachinejwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await machineMgmtService.deleteMachinejwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Machine Module
module.exports.deleteMachine = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await machineMgmtService.deleteMachine(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }