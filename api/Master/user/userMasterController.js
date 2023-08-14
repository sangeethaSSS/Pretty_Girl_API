
const userMaserMgmtService = require('../../../service/userMaserMgmtService');
const constants = require('../../../constants');

//Create JWt Module
module.exports.userListjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await userMaserMgmtService.userListjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//User List Module
module.exports.userList = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await userMaserMgmtService.userList(req.body); 
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
module.exports.saveUserjwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await userMaserMgmtService.saveUserjwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Save User Module
module.exports.saveUser = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await userMaserMgmtService.saveUser(req.body); 
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
module.exports.deleteUserjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await userMaserMgmtService.deleteUserjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete User Module
module.exports.deleteUser = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await userMaserMgmtService.deleteUser(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
  }


  //resetPasswordJwt Module
module.exports.resetPasswordJwt = async (req, res) => {
  let response = {};
  try {
      const responseFromService = await userMaserMgmtService.resetPasswordJwt(req.body);
      if (!responseFromService.token) {
          response.status = 200;
      }
  response.body = responseFromService;
  } catch (error) {
      response.message = error.message;
  }
  return res.send(response);
}
//resetPassword Module
module.exports.resetPassword = async (req, res) => {
  let response = {};
  try {
      const responseFromService = await userMaserMgmtService.resetPassword(req.body);
      if (!responseFromService.token) {
          response.status = 200;
      }
      response.body = responseFromService;
  } catch (error) {
      response.message = error.message;
  }
  return res.send(response);
}

  //Change Password Jwt Module
  module.exports.onchangepasswordJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userMaserMgmtService.onchangepasswordJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
  }
  
  //Change Password Module
  module.exports.onchangepassword = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userMaserMgmtService.onchangepassword(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
  }