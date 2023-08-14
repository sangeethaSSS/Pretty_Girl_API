
const commonDataMgmtService = require('../../service/commonDataMgmtService');

//Create JWt Module
module.exports.fetchcommonDataJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await commonDataMgmtService.fetchcommonDataJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Fetch Common Data Module
module.exports.fetchcommonData = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await commonDataMgmtService.fetchcommonData(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
      // response.message = constants.userMessage.USER_CREATED;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}


module.exports.onchangeitemDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.onchangeitemDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Item Data Module
module.exports.onchangeitemData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.onchangeitemData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}


module.exports.onchangeMachineDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.onchangeMachineDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Machine Data Module
module.exports.onchangeMachineData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.onchangeMachineData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}


module.exports.onchangeDesignDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.onchangeDesignDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Design Data Module
module.exports.onchangeDesignData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.onchangeDesignData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}


module.exports.onchangeSizeDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.onchangeSizeDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Size Data Module
module.exports.onchangeSizeData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.onchangeSizeData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}



module.exports.onchangeEmployeeDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.onchangeEmployeeDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Employee Data Module
module.exports.onchangeEmployeeData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.onchangeEmployeeData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}


module.exports.onchangeMachineEmployeeDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.onchangeMachineEmployeeDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Machice wise Employee Data Module
module.exports.onchangeMachineEmployeeData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.onchangeMachineEmployeeData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}


//On change job card
module.exports.onchangeJobCardJwt = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await commonDataMgmtService.onchangeJobCardJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }
  
  
  module.exports.onchangeJobCard = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await commonDataMgmtService.onchangeJobCard(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }