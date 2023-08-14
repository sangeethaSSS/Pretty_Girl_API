const processMgmtService = require('../../../service/processMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.employeeListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await processMgmtService.employeeListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Employee List Module
module.exports.employeeList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await processMgmtService.employeeList(req.body); 
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
module.exports.saveProcessjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await processMgmtService.saveProcessjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Process Save Module
module.exports.saveProcess = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await processMgmtService.saveProcess(req.body); 
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
module.exports.processListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await processMgmtService.processListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Process List Module
module.exports.processList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await processMgmtService.processList(req.body); 
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
module.exports.editProcessjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await processMgmtService.editProcessjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Process List Module
module.exports.editProcess = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await processMgmtService.editProcess(req.body); 
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
module.exports.deleteProcessjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await processMgmtService.deleteProcessjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Process Delete Module
module.exports.deleteProcess = async (req, res) => {
let response = {};
try {   
  const responseFromService = await processMgmtService.deleteProcess(req.body); 
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
module.exports.payslipListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await processMgmtService.payslipListjwt(req.body); 
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
module.exports.payslipList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await processMgmtService.payslipList(req.body); 
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