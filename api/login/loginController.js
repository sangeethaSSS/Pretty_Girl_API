const constants = require('../../constants')
const loginService = require('../../service/loginService')

//Create JWt Module
module.exports.loginJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await loginService.loginJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Login List Module
module.exports.login = async (req, res) => {
let response = {};
try {   
  const responseFromService = await loginService.login(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}