
const ratecardMgmtService = require('../../../service/ratecardMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.ratecardListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await ratecardMgmtService.ratecardListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//rate card List Module
module.exports.ratecardList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await ratecardMgmtService.ratecardList(req.body); 
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
module.exports.saveRatecardjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await ratecardMgmtService.saveRatecardjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Save Rate card Module
module.exports.saveRatecard = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await ratecardMgmtService.saveRatecard(req.body); 
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
module.exports.deleteRatecardjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await ratecardMgmtService.deleteRatecardjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Rate card Module
module.exports.deleteRatecard = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await ratecardMgmtService.deleteRatecard(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }