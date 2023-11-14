const constants = require('../../constants')
const appService = require('./appService')
const jwt = require('jsonwebtoken'); 
module.exports.createJwtToken = async (req, res) => {
  let response = {};
  try { 
    const responseFromService = await this.jwtCreate(req.body);
    response = responseFromService;
  } catch (error) {
    response.statusFlag = 2;
    let errormsg = error.message;
    if (error.message.indexOf(":") > 0) {
      errormsg = error.message.split(":")[1];
    }
    response.message = errormsg;
  }
  return res.send(response);
}
 
 //Create JWT Token 
 module.exports.jwtCreate = async function (data) { 
  try {
    const token = jwt.sign({ data }, process.env.SECRET_KEY || 'my-secret-key', { expiresIn: '10h' });
    return  { token };
  } catch (error) {     
    throw new Error(error);
  }
}

//getUserMaster List  
module.exports.getUserMaster = async (req, res) => {
let response = {};
try {   
  const responseFromService = await appService.getUserMaster(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}

//Sync device details 
module.exports.syncDetails = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.syncDetails(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}
  
//Insert Customer  
module.exports.insertCustomer = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.insertCustomer(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }
  
  //Delete Customer  
module.exports.deleteCustomer = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.deleteCustomer(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}
   
  //Get Master Data  
module.exports.getMaster = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.getMaster(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }
  

//Get Customer  
module.exports.getCustomer = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.getCustomer(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}
  
  //Get Item Management and items 
module.exports.getItemManagement = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.getItemManagement(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }
//Delete sync details using imeino
module.exports.syncDeleteSchema = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.syncDeleteDetails(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }
    
  
//Insert Order Taking  
module.exports.insertOrderTaking = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.insertOrderTaking(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }
  

  
//Delete Order Taking  
module.exports.deleteOrderTaking = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.deleteOrderTaking(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }
   
    
//Get stock transaction
module.exports.stockTransactionList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.stockTransactionList(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}
module.exports.OrderTakingCheck = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.OrderTakingCheck(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

  

    
//Check stock details
module.exports.checkStockDetails = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.checkStockDetails(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }
  
  module.exports.GetCurrentStock = async (req, res) => {
    let response = {};
    try {   
      const responseFromService = await appService.GetCurrentStock(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
    }
    module.exports.GetDispatchReportList = async (req, res) => {
      let response = {};
      try {   
        const responseFromService = await appService.GetDispatchReportList(req.body); 
        if(!responseFromService.token) {
          response.status = 200;
        }    
        response.body = responseFromService;
      } catch (error) {
        response.message = error.message;
      }
      return res.send(response);
      }
    
  //Hold Order Taking  
module.exports.holdOrderTaking = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await appService.holdOrderTaking(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }