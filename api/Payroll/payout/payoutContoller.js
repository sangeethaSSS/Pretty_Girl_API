const payoutMgmtService = require('../../../service/payoutMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.employeeProcessListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await payoutMgmtService.employeeProcessListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Employee Process List Module
module.exports.employeeProcessList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await payoutMgmtService.employeeProcessList(req.body); 
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
module.exports.savePayoutjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await payoutMgmtService.savePayoutjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Payout List Module
module.exports.savePayout = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await payoutMgmtService.savePayout(req.body); 
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
module.exports.payoutListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await payoutMgmtService.payoutListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Payout List Module
module.exports.payoutList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await payoutMgmtService.payoutList(req.body); 
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


//Edit Payout JWt Module
module.exports.editPayoutjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await payoutMgmtService.editPayoutjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Payout List Module
module.exports.editPayout = async (req, res) => {
let response = {};
try {   
  const responseFromService = await payoutMgmtService.editPayout(req.body); 
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
module.exports.payoutslipListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await payoutMgmtService.payoutslipListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Pay slip List Module
module.exports.payoutslipList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await payoutMgmtService.payoutslipList(req.body); 
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