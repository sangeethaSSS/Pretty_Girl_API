
const dispatchMgmtService = require('../../../service/dispatchMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.itemCustomerWiseListJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await dispatchMgmtService.itemCustomerWiseListJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//dispatch List Module
module.exports.itemCustomerWiseList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await dispatchMgmtService.itemCustomerWiseList(req.body); 
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
module.exports.designListJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await dispatchMgmtService.designListJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//dispatch List Module
module.exports.designList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await dispatchMgmtService.designList(req.body); 
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
module.exports.saveItemWiseDispatchJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await dispatchMgmtService.saveItemWiseDispatchJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//item wise List Module
module.exports.saveItemWiseDispatch = async (req, res) => {
let response = {};
try {   
  const responseFromService = await dispatchMgmtService.saveItemWiseDispatch(req.body); 
  if(!responseFromService.token) {
    response.status = 200;   }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}


//Create JWt Module
module.exports.saveCustomerWiseDispatchJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await dispatchMgmtService.saveCustomerWiseDispatchJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//customer wise List Module
module.exports.saveCustomerWiseDispatch = async (req, res) => {
let response = {};
try {   
  const responseFromService = await dispatchMgmtService.saveCustomerWiseDispatch(req.body); 
  if(!responseFromService.token) {
    response.status = 200;   }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}

//Create JWt Module
module.exports.dispatchListJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await dispatchMgmtService.dispatchListJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//dispatch List Module
module.exports.dispatchList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await dispatchMgmtService.dispatchList(req.body); 
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
module.exports.dispatchDropdownListJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await dispatchMgmtService.dispatchDropdownListJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//dispatch List Module
module.exports.dispatchDropdownList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await dispatchMgmtService.dispatchDropdownList(req.body); 
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
module.exports.cancelDispatchDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await dispatchMgmtService.cancelDispatchDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//dispatch List Module
module.exports.cancelDispatchData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await dispatchMgmtService.cancelDispatchData(req.body); 
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
module.exports.printItemCustomerWiseDispatchJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await dispatchMgmtService.printItemCustomerWiseDispatchJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//dispatch print Module
module.exports.printItemCustomerWiseDispatch = async (req, res) => {
let response = {};
try { 
  const responseFromService = await dispatchMgmtService.printItemCustomerWiseDispatch(req.body); 
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

//edit dispatch 
//Create JWt Module
module.exports.editDispatchDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await dispatchMgmtService.editDispatchDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//edit dispatch Module
module.exports.editDispatchData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await dispatchMgmtService.editDispatchData(req.body); 
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
module.exports.deleteDispatchDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await dispatchMgmtService.deleteDispatchDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//delete dispatch Module
module.exports.deleteDispatchData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await dispatchMgmtService.deleteDispatchData(req.body); 
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

