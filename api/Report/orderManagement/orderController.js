const orderMgmtServices = require('../../../service/orderManagamentReport');
const constants = require('../../../constants'); 
//Customer wise order report
module.exports.customerwiseOrderListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderMgmtServices.customerWiserOrderListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Customer wise order report
module.exports.customerwiseOrderList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await orderMgmtServices.customerWiserOrderList(req.body); 
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

//Item wise order report
module.exports.itemwiseOrderListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderMgmtServices.itemWiseOrderListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//item wise order report
module.exports.itemwiseOrderList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await orderMgmtServices.itemWiseOrderList(req.body); 
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


//Customer wise order report
module.exports.customerOrderListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderMgmtServices.customerOrderListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//customer wise order report
module.exports.customerOrderList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await orderMgmtServices.customerOrderList(req.body); 
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


//Stock wise order report
module.exports.currentStockListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderMgmtServices.currentStockListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//current stock wise order report
module.exports.currentStockList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await orderMgmtServices.currentStockList(req.body); 
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



//Master List Jwt
module.exports.reportMasterListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderMgmtServices.reportMasterListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Master List
module.exports.reportMasterList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await orderMgmtServices.reportMasterList(req.body); 
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

//Excel Item wise order report
module.exports.excelItemWiseOrderListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderMgmtServices.excelItemWiseOrderListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Excel item wise order report
module.exports.excelItemWiseOrderList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await orderMgmtServices.excelItemWiseOrderList(req.body); 
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
