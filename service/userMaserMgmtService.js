/****************************
 File    : userMasterService.js
 Author  : Prabhavathy
 Date    : 2-09-2022
 Purpose : User Master Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');


//create jwt 
module.exports.userListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create User LIST
module.exports.userList = async (req) => {
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
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      const {status_id} = decoded.data;
      var status = '';
      if (decoded) {
          if(status_id == 0)
          {
              status = ' 1=1'
          }
          else{
              status = ` a.status_id = ` + status_id
          }
        const user_Result = await client.query(`select a.user_id,a.user_code,a.user_name,a.devices_id,a.status_id,b.status_name,a.userrole_id,c.userrole_name,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate, coalesce(mobile_no,'') as mobile_no,coalesce((select string_agg(menu_id::text, ',') from tbl_user_menu_details where user_id=a.user_id),'') as menu_id from tbl_user as a  inner join tbl_def_status as b on a.status_id = b.status_id inner join tbl_def_userrole as c on a.userrole_id = c.userrole_id where  `+ status + ` order by a.user_id desc `);
        if (client) {
          client.end();
        }

        let User_Array = user_Result && user_Result.rows ? user_Result.rows : [];

        responseData = { "UserArray": User_Array }
        if (responseData) {
          return responseData;
        }
        else {
          return '';
        }
      }
      else {
        if (client) { client.end(); }
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

//create User jwt 
module.exports.saveUserjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}


//create User service
module.exports.saveUser = async (req) => {
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
      const { user_code, user_name,password,userrole_id, status_id, user_id, branch_id,created_by,pin_number,devices_id,access_flag, mobile_no, menu_array } = decoded.data;
      if (decoded) {
        const newpwsd_en = await commonService.encryptpassword({ pwd: password });
        const newpincode_en = await commonService.appencryptpassword({ pwd: pin_number });
        var user_password = newpwsd_en
        var user_pincode = newpincode_en

        if (user_id == 0) {
          if(access_flag == -1){
            condition = (`LOWER ("user_code") =  LOWER (` + "'" + user_code + "')" + ` or ("devices_id") =  LOWER (` + "'" + devices_id + "')")
          }
          if(access_flag == 1){
            condition = `LOWER ("user_code") = LOWER (` + "'" + user_code + "')"
          }

          if(access_flag == 2){
            condition = `LOWER ("devices_id") = LOWER (` + "'" + devices_id + "')"
          }
        }
        else {
          if(access_flag == -1){
            condition = (`(LOWER ("user_code") =  LOWER (` + "'" + user_code + "')" + ` or ("devices_id") =  LOWER (` + "'" + devices_id + "')" + `) and user_id !=` + user_id)
          }
          if(access_flag == 1){
            condition = `LOWER ("user_code") = LOWER (` + "'" + user_code + "')" + `and user_id !=` + user_id
          }

          if(access_flag == 2){
            condition = `LOWER ("devices_id") = LOWER (` + "'" + devices_id + "')" + `and user_id !=` + user_id
          }
        }
        if(user_id != 0) {
          var count_user = await client.query(`select password,pin_number FROM tbl_user where user_id = $1`, [user_id])
          var olduser_password = count_user && count_user.rows[0].password;
          var olduser_pincode = count_user && count_user.rows[0].pin_number;
          if(!password) {
            user_password = olduser_password
          }
          if(!pin_number) {
            user_pincode = olduser_pincode
          }
        }
        
        var count = await client.query(`select count(*) as count FROM tbl_user where ` + condition)
        var usercount_Check = count && count.rows[0].count;
        if (usercount_Check > 0) {
          if(access_flag == 1){
            return response = { "message": constants.userMessage.USER_NAME_CHECK, "statusFlag": 2 };
          }
          if(access_flag == 2){
            return response = { "message": constants.userMessage.DEVICE_NAME_CHECK, "statusFlag": 2 };
          }
          if(access_flag == -1){
            return response = { "message": constants.userMessage.BOTH_NAME_CHECK, "statusFlag": 2 };
          }
        }
        else { 
          if (user_id == 0) { 
              var makerid = await commonService.insertLogs(created_by, "Insert User");
              const max = await client.query(`select coalesce(max(user_id),0) + 1 as mr FROM tbl_user`)
              var maxuser = max && max.rows[0].mr;
              const create_result = await client.query(`INSERT INTO "tbl_user"(user_id,user_code,user_name,password,userrole_id,status_id,maker_id,branch_id,pin_number,devices_id,created_date,mobile_no) values ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP,$11) `, [maxuser,user_code, user_name, newpwsd_en, userrole_id, status_id, makerid,branch_id,user_pincode,devices_id, mobile_no]);
              if (menu_array && menu_array.length > 0) {
                for (let i = 0; i < menu_array.length; i++){
                  if (menu_array[i].checked && menu_array[i].checked == true) {
                    await client.query(`INSERT INTO "tbl_user_menu_details"(menu_id, user_id, maker_id, created_at) values ($1, $2, $3,CURRENT_TIMESTAMP) `, [menu_array[i].menu_id, maxuser, makerid]);
                  }
                }
              }
              if (client) {
                client.end();
              }
              let create_usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
              if (create_usercode == 1) {
                return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1 };
              }
              else { return '' }
            }
            else {
              var makerid = await commonService.insertLogs(created_by, "Update User");
              await client.query(`delete FROM tbl_user_menu_details where user_id =` + user_id)
              const user_Count = await client.query(`select count(*) as count FROM tbl_user where user_id =` + user_id)
              var count_Check = user_Count && user_Count.rows[0].count
              if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                const update_result = await client.query(`UPDATE "tbl_user" set "user_name"=$1, "user_code"=$2,"userrole_id"=$3,"status_id"=$4,"maker_id"=$5,"branch_id"=$6,"devices_id"= $7,"password"= $8,"pin_number" = $9,"updated_date"= CURRENT_TIMESTAMP, mobile_no=$11 where "user_id" = $10 `, [user_name, user_code, userrole_id, status_id, makerid, branch_id, devices_id, user_password, user_pincode, user_id, mobile_no]);
                if (menu_array && menu_array.length > 0) {
                  for (let i = 0; i < menu_array.length; i++){
                    if (menu_array[i].checked && menu_array[i].checked == true) {
                      await client.query(`INSERT INTO "tbl_user_menu_details"(menu_id, user_id, maker_id, created_at) values ($1, $2, $3,CURRENT_TIMESTAMP) `, [menu_array[i].menu_id, user_id, makerid]);
                    }
                  }
                }
                if (client) {
                  client.end();
                }
                let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                if (update_code == 1) {
                  return response = { "message": constants.userMessage.USER_UPDATED, "statusFlag": 1 };
                }
                else { return '' }
              }
            }
          }
      }
      else {
        if (client) { client.end(); }
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

//Delete User jwt 
module.exports.deleteUserjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}
//Delete User service
module.exports.deleteUser = async (req) => {
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
      const {user_id,created_by } = decoded.data;
      if (decoded) {
        const log_Count = await client.query(`select count(*) as count FROM tbl_userlog where user_id =` + user_id)
        var log_counts = log_Count && log_Count.rows[0].count;
        if (log_counts && Number(log_counts) > 0) {
          if (client) { client.end(); }
          return response = { "message": constants.userMessage.USER_IN_USE, "statusFlag": 2 };
        } else {
          const user_Count = await client.query(`select count(*) as count FROM tbl_user where user_id =` + user_id)
          var count_Check = user_Count && user_Count.rows[0].count;
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            await commonService.insertLogs(created_by, "Delete User");
            await client.query(`delete FROM tbl_user_menu_details where user_id =` + user_id)
            const create_result = await client.query(`DELETE FROM tbl_user where user_id = $1 `,
              [user_id]);
            if (client) {
              client.end();
            }
            let usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
            if (usercode == 1) {
              return response = { "message": constants.userMessage.USER_DELETED, "statusFlag": 1 };
            }
            else { return '' }
          }
        }
      }
      else {
        if (client) { client.end(); }
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


//reset Password Jwt
module.exports.resetPasswordJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//reset Password service
module.exports.resetPassword = async (req) => {
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
      const { new_password, user_id } = decoded.data;
      var response = {}
      const newpwsd_en = await commonService.encryptpassword({ pwd: new_password });
      if (decoded) {
        const user_Count = await client.query(`select count(*) as count FROM tbl_user where user_id =` + user_id)
        var count_Check = user_Count && user_Count.rows[0].count
        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
          const update_password = await client.query(`UPDATE "tbl_user" set "password" = $1,"updated_date"=CURRENT_TIMESTAMP where "user_id" = $2 `, [newpwsd_en, user_id]);
          if (client) {
            client.end();
          }
          let update_code = update_password && update_password.rowCount ? update_password.rowCount : 0;
          if (update_code == 1) {
            return response = { "message": constants.userMessage.RESET_PASWD, "statusFlag": 1 };
          }
          else { return '' }
        }
      }
      else {
        if (client) { client.end(); }
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

// onchange password Jwt
module.exports.onchangepasswordJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

// onchange password 
module.exports.onchangepassword = async (req) => {
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
      if (decoded != null) {
        const { old_password, new_password, user_id } = decoded.data
        const encryptpassword = await commonService.encryptpassword({ pwd: old_password });
        const checkrow = await client.query(`select count(*) as name from tbl_user where user_id = $1 and password = $2`, [user_id, encryptpassword])
        if (checkrow.rows[0].name == 0) {
          return { message: 'Old password is wrong',statusFlag: 2}
        } else {
          var makerid = await commonService.insertLogs(user_id, "Change Password");
          const encryptpassword = await commonService.encryptpassword({ pwd: new_password });

          const result = await client.query(`UPDATE "tbl_user" SET "updated_date"=CURRENT_TIMESTAMP,"password"=$1, "maker_id"=$2  where "user_id"=$3`,[encryptpassword, makerid, user_id]);
          console.log(result)

          if (client) {
            client.end();
          }
          return { message: constants.success_message.CHANGE_PASWD, statusFlag: 1}
        }
      } else {

        if (client) {
          client.end();
        }
        throw new Error(constants.userMessage.USER_NOT_FOUND);
      }
    } else {

      if (client) {
        client.end();
      }
      throw new Error(constants.token.INVALID_TOKEN);
    }
  } catch (error) {

    if (client) {
      client.end();
    }

    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}