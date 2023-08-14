
const itemgroupMasterService = require('../../../service/itemgroupMasterService');
const constants = require('../../../constants');
//Create JWt Module
module.exports.itemgroupListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemgroupMasterService.itemgroupListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//itemgroup List Module
module.exports.itemgroupList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemgroupMasterService.itemgroupList(req.body); 
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
module.exports.saveItemgroupjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemgroupMasterService.saveItemgroupjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Save itemgroup Module
module.exports.saveItemgroup = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemgroupMasterService.saveItemgroup(req.body); 
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
module.exports.deleteItemgroupjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await itemgroupMasterService.deleteItemgroupjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete itemgroup Module
module.exports.deleteItemgroup = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemgroupMasterService.deleteItemgroup(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }