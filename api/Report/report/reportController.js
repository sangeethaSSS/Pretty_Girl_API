const reportMgmtServices = require('../../../service/reportMgmtServices');
const constants = require('../../../constants');

//Create JWt Module
module.exports.pendingJobReportListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await reportMgmtServices.pendingJobReportListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Pending Job Report List Module
module.exports.pendingJobReportList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await reportMgmtServices.pendingJobReportList(req.body); 
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
module.exports.employeePerformanceReportListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await reportMgmtServices.employeePerformanceReportListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Employee Performance Report List Module
module.exports.employeePerformanceReportList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await reportMgmtServices.employeePerformanceReportList(req.body); 
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
module.exports.payoutReportListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await reportMgmtServices.payoutReportListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Employee Payout Report List Module
module.exports.payoutReportList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await reportMgmtServices.payoutReportList(req.body); 
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
module.exports.dashboardCountListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await reportMgmtServices.dashboardCountListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Dashboart List Module
module.exports.dashboardCountList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await reportMgmtServices.dashboardCountList(req.body); 
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
module.exports.specificEmployeeListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await reportMgmtServices.specificEmployeeListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Specific Employee  List Module
module.exports.specificEmployeeList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await reportMgmtServices.specificEmployeeList(req.body); 
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
module.exports.pendingListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await reportMgmtServices.pendingListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Pending List Module
module.exports.pendingList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await reportMgmtServices.pendingList(req.body); 
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
module.exports.pendingOrderReportListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await reportMgmtServices.pendingOrderReportListjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Pending Order Report List Module
module.exports.pendingOrderReportList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await reportMgmtServices.pendingOrderReportList(req.body); 
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
module.exports.pendingOrderDropdownjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await reportMgmtServices.pendingOrderDropdownjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Pending Order Report Dropdown Module
module.exports.pendingOrderDropdown = async (req, res) => {
let response = {};
try {   
  const responseFromService = await reportMgmtServices.pendingOrderDropdown(req.body); 
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