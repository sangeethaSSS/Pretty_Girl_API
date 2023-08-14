
const agentMasterMgmtService = require('../../../service/agentMasterMgmtService');
const constants = require('../../../constants');

//Create JWt Module - Agent
module.exports.saveAgentjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await agentMasterMgmtService.saveAgentjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Save Agent Module
module.exports.saveAgent = async (req, res) => {
let response = {};
try {   
  const responseFromService = await agentMasterMgmtService.saveAgent(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}

//List JWt Module - Agent
module.exports.listAgentjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await agentMasterMgmtService.listAgentjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//List Agent Module
module.exports.listAgent = async (req, res) => {
let response = {};
try {   
  const responseFromService = await agentMasterMgmtService.listAgent(req.body); 
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

//Delete JWt Module - Agent
module.exports.deleteAgentjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await agentMasterMgmtService.deleteAgentjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Agent Module
module.exports.deleteAgent = async (req, res) => {
let response = {};
try {   
  const responseFromService = await agentMasterMgmtService.deleteAgent(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}