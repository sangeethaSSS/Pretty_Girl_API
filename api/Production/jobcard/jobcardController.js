
const jobcardMgmtService = require('../../../service/jobcardMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.jobcardListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.jobcardListjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Jobcard List Module
module.exports.jobcardList = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.jobcardList(req.body);
    if (!responseFromService.token) {
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
module.exports.saveJobcardjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.saveJobcardjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Save Jobcard Module
module.exports.saveJobcard = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.saveJobcard(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create JWt Module
module.exports.deleteJobcardjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.deleteJobcardjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Jobcard Module
module.exports.deleteJobcard = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.deleteJobcard(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create JWt Module
module.exports.editJobcardjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.editJobcardjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Jobcard EDit Module
module.exports.editJobcard = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.editJobcard(req.body);
    if (!responseFromService.token) {
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
module.exports.generateJobnojwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.generateJobnojwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Jobcard  Module
module.exports.generateJobno = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.generateJobno(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create JWt Module
module.exports.saveTransferJobJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.saveTransferJobJwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Save Jobcard Module
module.exports.saveTransferJob = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.saveTransferJob(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create JWt Module
module.exports.viewTransferJobcardjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.viewTransferJobcardjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Jobcard Transfer Module
module.exports.viewTransferJobcard = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.viewTransferJobcard(req.body);
    if (!responseFromService.token) {
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
module.exports.updateRateJobcardjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.updateRateJobcardjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//update Jobcard Module
module.exports.updateRateJobcard = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobcardMgmtService.updateRateJobcard(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}
