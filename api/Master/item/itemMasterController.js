
const itemMasterMgmtService = require('../../../service/itemMasterMgmtService');
const constants = require('../../../constants');
//Create JWt Module
module.exports.itemListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemMasterMgmtService.itemListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//item List Module
module.exports.itemList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemMasterMgmtService.itemList(req.body); 
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
module.exports.saveItemjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemMasterMgmtService.saveItemjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Save item Module
module.exports.saveItem = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemMasterMgmtService.saveItem(req.body); 
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
module.exports.deleteItemjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await itemMasterMgmtService.deleteItemjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}


//Edit Item Jwt Module 

module.exports.editItemjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await itemMasterMgmtService.editItemjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Edit Item Module
module.exports.editItem = async (req, res) => {
let response = {};
try {   
  const responseFromService = await itemMasterMgmtService.editItem(req.body); 
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

//Delete item Module
module.exports.deleteItem = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemMasterMgmtService.deleteItem(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }

//Size List Jwt
  module.exports.sizeListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemMasterMgmtService.sizeListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Size List Module
module.exports.sizeList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemMasterMgmtService.sizeList(req.body); 
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
