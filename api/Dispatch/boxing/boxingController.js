
const boxingMgmtService = require('../../../service/boxingMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.itemListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await boxingMgmtService.itemListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//boxing List Module
module.exports.itemList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await boxingMgmtService.itemList(req.body); 
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
module.exports.getFGJobIdListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await boxingMgmtService.getFGJobIdListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//getFGJobIdList Module
module.exports.getFGJobIdList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await boxingMgmtService.getFGJobIdList(req.body); 
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
module.exports.moveToFGjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await boxingMgmtService.moveToFGjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//moveToFG List Module
module.exports.moveToFG = async (req, res) => {
let response = {};
try {   
  const responseFromService = await boxingMgmtService.moveToFG(req.body); 
  if(!responseFromService.token) {
    response.status = 200;   }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}

 
//Create JWt Module
module.exports.getFGListJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await boxingMgmtService.getFGListJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//FG List Module
module.exports.getFGList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await boxingMgmtService.getFGList(req.body); 
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
module.exports.getCurrentStockJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await boxingMgmtService.getCurrentStockJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

// CUrrent stock Module
module.exports.getCurrentStock = async (req, res) => {
let response = {};
try {   
  const responseFromService = await boxingMgmtService.getCurrentStock(req.body); 
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
module.exports.getAllStockJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await boxingMgmtService.getAllStockJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

// CUrrent stock Module
module.exports.getAllStock = async (req, res) => {
let response = {};
try {   
  const responseFromService = await boxingMgmtService.getAllStock(req.body); 
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
module.exports.getPendingStockForOrderJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await boxingMgmtService.getPendingStockForOrderJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

// CUrrent stock Module
module.exports.getPendingStockForOrder = async (req, res) => {
let response = {};
try {   
  const responseFromService = await boxingMgmtService.getPendingStockForOrder(req.body); 
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
module.exports.checkFGItemDispatchJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await boxingMgmtService.checkFGItemDispatchJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//check FG in dispatch Module
module.exports.checkFGItemDispatch = async (req, res) => {
let response = {};
try {   
  const responseFromService = await boxingMgmtService.checkFGItemDispatch(req.body); 
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
module.exports.DeleteFGItemJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await boxingMgmtService.DeleteFGItemJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Fg 
module.exports.DeleteFGItem = async (req, res) => {
let response = {};
try {   
  const responseFromService = await boxingMgmtService.DeleteFGItem(req.body); 
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

