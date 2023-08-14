
const itemManagementMgmtService = require('../../../service/itemManagementMgmtService');
const constants = require('../../../constants');


//Create Management JWt Module
module.exports.itemManagementListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemManagementMgmtService.itemManagementListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//item Management List Module
module.exports.itemManagementList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemManagementMgmtService.itemManagementList(req.body); 
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
module.exports.saveItemManagementjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemManagementMgmtService.saveItemManagementjwt(req.body); 
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
module.exports.saveItemManagement = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemManagementMgmtService.saveItemManagement(req.body); 
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
module.exports.CheckDesignNojwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemManagementMgmtService.CheckDesignNojwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Check Designno Module
module.exports.CheckDesignNo = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemManagementMgmtService.CheckDesignNo(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}


module.exports.editItemListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemManagementMgmtService.editItemListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  
  //Edit Item Management Module
  module.exports.editItemList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemManagementMgmtService.editItemList(req.body); 
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

  
//Create item Management JWt Module
module.exports.deleteItemManagementjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemManagementMgmtService.deleteItemManagementjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  
//Delete item Management Module
module.exports.deleteItemManagement = async (req, res) => {
    let response = {};
    try {   
      const responseFromService = await itemManagementMgmtService.deleteItemManagement(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
    }
  