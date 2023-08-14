
const companyMgmtService = require('../../../service/companyMgmtService');
const constants = require('../../../constants');
//Create JWt Module
module.exports.companyListJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await companyMgmtService.companyListJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Company List Module
module.exports.companyList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await companyMgmtService.companyList(req.body); 
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
module.exports.saveCompanyJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await companyMgmtService.saveCompanyJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Save Company Module
module.exports.saveCompany = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await companyMgmtService.saveCompany(req.body); 
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
module.exports.deleteCompanyJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await companyMgmtService.deleteCompanyJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Company Module
module.exports.deleteCompany = async (req, res) => {
let response = {};
try {   
  const responseFromService = await companyMgmtService.deleteCompany(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}