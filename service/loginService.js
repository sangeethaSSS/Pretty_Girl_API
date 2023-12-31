/****************************
 File    : loginService.js
 Author  : Prabhavathy
 Date    : 3.09.2022
 Purpose : login Service 
 * ********************** */
const connectionString = require('../database/connection')
const commonService = require('../service/commonService')
const jwt = require('jsonwebtoken')
const constants = require('../constants')
const { Client } = require('pg')



//create jwt 
module.exports.loginJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

//login service
module.exports.login = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    if (req.jwtToken) {
      const decoded = await commonService.jwtVerify(req.jwtToken);
      const { user_name, password } = decoded.data;
      const newpwsd_en = await commonService.encryptpassword({ pwd: password });
      if (decoded) {
        var response = {}
        const count_check = await client.query(`SELECT a.user_id,a.user_name,a.user_code,a.userrole_id,b.userrole_name,a.status_id,(select branch_name from tbl_branch where branch_id = a.branch_id) as branchname,(select branch_id from tbl_branch where branch_id = a.branch_id) as branch_id,coalesce((select string_agg(menu_id::text, ',') from tbl_user_menu_details where user_id=a.user_id),'') as menu_id from tbl_user as a inner join tbl_def_userrole as b on a.userrole_id = b.userrole_id  where lower(a.user_code) = $1 and a.password = $2`, [user_name, newpwsd_en])
        if(client){
          client.end();
         }
        if (count_check && count_check.rows.length > 0) {
          var Loginarray =  JSON.parse(JSON.stringify(count_check.rows))
          if (Loginarray[0].status_id == 1) {
            response = { "UserInfo": Loginarray, "message": constants.userMessage.LOGIN_SUCCESS, "statusFlag": 1 }
            return response
          }
          else {
            response = {"message": constants.userMessage.INACTIVE_USER, "statusFlag": 2 }
            return response;
          }
        }
        else {
          response = {"message": constants.userMessage.INVALID_PASSWORD, "statusFlag": 2 }
          return response;
        }
      }
      else{
        if (client) {client.end();}
    }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
}
}

