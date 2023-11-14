const jobCuttingMgmtService = require('../../../service/jobCuttingMgmtService');
const constants = require('../../../constants');

module.exports.generateJobCuttingNoJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.generateJobCuttingNoJwt(req.body);
      if (!responseFromService.token) {
        response.status = 200;
      }
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  
  //Job Cutting List Module
  module.exports.generateJobCuttingNo = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.generateJobCuttingNo(req.body);
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

  module.exports.onchangeJobCuttingJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.onchangeJobCuttingJwt(req.body);
      if (!responseFromService.token) {
        response.status = 200;
      }
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  
  //Job Cutting List Module
  module.exports.onchangeJobCutting = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.onchangeJobCutting(req.body);
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

  
  module.exports.getSizeForJobCuttingJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.getSizeForJobCuttingJwt(req.body);
      if (!responseFromService.token) {
        response.status = 200;
      }
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  
  //Job Cutting List Module
  module.exports.getSizeForJobCutting = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.getSizeForJobCutting(req.body);
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

  module.exports.getItemsForJobCuttingJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.getItemsForJobCuttingJwt(req.body);
      if (!responseFromService.token) {
        response.status = 200;
      }
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  
  //Job Cutting List Module
  module.exports.getItemsForJobCutting = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.getItemsForJobCutting(req.body);
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

  module.exports.getColorsForJobCuttingJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.getColorsForJobCuttingJwt(req.body);
      if (!responseFromService.token) {
        response.status = 200;
      }
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  
  //Job Cutting List Module
  module.exports.getColorsForJobCutting = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.getColorsForJobCutting(req.body);
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
  

  module.exports.saveJobCuttingJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.saveJobCuttingJwt(req.body);
      if (!responseFromService.token) {
        response.status = 200;
      }
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  
  //Job Cutting List Module
  module.exports.saveJobCutting = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await jobCuttingMgmtService.saveJobCutting(req.body);
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
module.exports.jobcuttingListJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobCuttingMgmtService.jobcuttingListJwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Job Cutting List Module
module.exports.jobcuttingList = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobCuttingMgmtService.jobcuttingList(req.body);
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
module.exports.editJobCuttingJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobCuttingMgmtService.editJobCuttingJwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Job Cutting List Module
module.exports.editJobCutting = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobCuttingMgmtService.editJobCutting(req.body);
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
module.exports.deleteJobCuttingJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobCuttingMgmtService.deleteJobCuttingJwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Job Cutting Delete Module
module.exports.deleteJobCutting = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobCuttingMgmtService.deleteJobCutting(req.body);
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
module.exports.printJobCuttingJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobCuttingMgmtService.printJobCuttingJwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Job Cutting Delete Module
module.exports.printJobCutting = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobCuttingMgmtService.printJobCutting(req.body);
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
module.exports.fetchFilterDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobCuttingMgmtService.fetchFilterDataJwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Job Cutting Delete Module
module.exports.fetchFilterData = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await jobCuttingMgmtService.fetchFilterData(req.body);
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

