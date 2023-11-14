
const itemsubcategoryMasterService = require('../../../service/itemsubcategoryMasterService');
const constants = require('../../../constants');
//Create JWt Module
module.exports.itemsubcategoryFilterListJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await itemsubcategoryMasterService.itemsubcategoryFilterListJwt(req.body); 
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
module.exports.itemsubcategoryFilterList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await itemsubcategoryMasterService.itemsubcategoryFilterList(req.body); 
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


module.exports.saveItemSubCategoryJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await itemsubcategoryMasterService.saveItemSubCategoryJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//saveItemSubCategoryJwt List Module
module.exports.saveItemSubCategory = async (req, res) => {
let response = {};
try {   
  const responseFromService = await itemsubcategoryMasterService.saveItemSubCategory(req.body); 
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

module.exports.itemGubCategoryListJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await itemsubcategoryMasterService.itemGubCategoryListJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//itemGubCategoryListJwt List Module
module.exports.itemGubCategoryList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await itemsubcategoryMasterService.itemGubCategoryList(req.body); 
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

module.exports.deleteItemSubgroupJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await itemsubcategoryMasterService.deleteItemSubgroupJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//itemGubCategoryListJwt List Module
module.exports.deleteItemSubgroup = async (req, res) => {
let response = {};
try {   
  const responseFromService = await itemsubcategoryMasterService.deleteItemSubgroup(req.body); 
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

