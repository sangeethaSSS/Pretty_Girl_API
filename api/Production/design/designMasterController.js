
const designMasterMgmtService = require('../../../service/designMasterMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.designListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await designMasterMgmtService.designListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Design List Module
module.exports.designList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await designMasterMgmtService.designList(req.body); 
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
module.exports.saveDesignjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await designMasterMgmtService.saveDesignjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Save Design Module
module.exports.saveDesign = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await designMasterMgmtService.saveDesign(req.body); 
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
module.exports.deleteDesignjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await designMasterMgmtService.deleteDesignjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Design Module
module.exports.deleteDesign = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await designMasterMgmtService.deleteDesign(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }

  //Design Module
module.exports.designPhotography = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await designMasterMgmtService.designPhotography(req.body); 
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
module.exports.editdesignjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await designMasterMgmtService.editdesignjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Design EDit Module
module.exports.editdesign = async (req, res) => {
let response = {};
try {   
  const responseFromService = await designMasterMgmtService.editdesign(req.body); 
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
