const processMgmtService = require('../../../service/jobCuttingProcessMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.ViewjobCuttingsjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await processMgmtService.ViewjobCuttingsjwt(req.body); 
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
module.exports.ViewjobCuttings = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await processMgmtService.ViewjobCuttings(req.body); 
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
module.exports.savejobCuttingProcessjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await processMgmtService.savejobCuttingProcessjwt(req.body); 
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
module.exports.savejobCuttingProcess = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await processMgmtService.savejobCuttingProcess(req.body); 
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
module.exports.jobCuttingProcessListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await processMgmtService.jobCuttingProcessListjwt(req.body); 
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
module.exports.jobCuttingProcessList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await processMgmtService.jobCuttingProcessList(req.body); 
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