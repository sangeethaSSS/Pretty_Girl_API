
const colorMasterMgmtService = require('../../../service/colorMasterMgmtService');
const constants = require('../../../constants');
//Create JWt Module
module.exports.colorListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await colorMasterMgmtService.colorListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Color List Module
module.exports.colorList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await colorMasterMgmtService.colorList(req.body); 
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
module.exports.saveColorjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await colorMasterMgmtService.saveColorjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Save Color Module
module.exports.saveColor = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await colorMasterMgmtService.saveColor(req.body); 
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
module.exports.deleteColorjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await colorMasterMgmtService.deleteColorjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Color Module
module.exports.deleteColor = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await colorMasterMgmtService.deleteColor(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }