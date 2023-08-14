/****************************
 File    : designationMasterService.js
 Author  : Prabhavathy
 Date    : 2-09-2022
 Purpose : Designation Master Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');


//create jwt 
module.exports.designationListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Designation LIST
module.exports.designationList = async (req) => {
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
        const designation_Result = await client.query(`select a.designation_id,a.designation_name,a.status_id,b.status_name,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate from tbl_designation as a  inner join tbl_def_status as b on a.status_id = b.status_id where  `+ status + ` order by  a.designation_id desc `);
        if (client) {
          client.end();
        }

        let Designation_Array = designation_Result && designation_Result.rows ? designation_Result.rows : [];

        responseData = { "DesignationArray": Designation_Array }
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

//create Designation jwt 
module.exports.saveDesignationjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}


//create Designation service
module.exports.saveDesignation = async (req) => {
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
      const { designation_id, designation_name, status_id, user_id } = decoded.data;
      if (decoded) {
        const exit_count = await client.query(`select count(*) as count FROM tbl_designation where lower(designation_name) = lower('` + designation_name + `') and designation_id != ` + designation_id)
        var exit_check = exit_count && exit_count.rows[0].count
        if (exit_check > 0) {
          return response = {"message": constants.userMessage.DESIGNATION_DUPLICATION, "statusFlag": 2 };
        }
        else{
          if (designation_id == 0) {
            var makerid = await commonService.insertLogs(user_id, "Insert Designation");
            const max = await client.query(`select coalesce(max(designation_id),0) + 1 as mr FROM tbl_designation`)
            var maxdesignation = max && max.rows[0].mr;
            const result = await client.query(`INSERT INTO tbl_designation (designation_id,designation_name,status_id,user_id,maker_id,created_date) values ($1, $2, $3,$4,$5,CURRENT_TIMESTAMP) `, [maxdesignation, designation_name, status_id, user_id, makerid]);
            if (client) {
              client.end();
            }
            let create_code = result && result.rowCount ? result.rowCount : 0;
            if (create_code == 1) {
              return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1 };
            }
            else { return '' }
          }
          else {
            var makerid = await commonService.insertLogs(user_id, "Update Designation");
            const count = await client.query(`select count(*) as count FROM tbl_designation where designation_id =` + designation_id)
            var count_Check = count && count.rows[0].count
            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
              const update_result = await client.query(`UPDATE "tbl_designation" set designation_name=$1,status_id=$2,user_id=$3,maker_id=$4,updated_date=CURRENT_TIMESTAMP where designation_id = $5 `, [designation_name, status_id, user_id, makerid, designation_id]);

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

//Delete Designation jwt 
module.exports.deleteDesignationjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}

//Delete Designation service
module.exports.deleteDesignation = async (req) => {
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
      const { user_id, designation_id } = decoded.data;
      if (decoded) { 
        const designation_Count = await client.query(`select count(*) as count FROM tbl_hr_details where designation_id =` + designation_id)
        var designation_Check = designation_Count && designation_Count.rows[0].count;
        if (designation_Check == 0 || designation_Check == '0') {
          const group_Count = await client.query(`select count(*) as count FROM tbl_designation where designation_id =` + designation_id)
          var count_Check = group_Count && group_Count.rows[0].count;
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            await commonService.insertLogs(user_id, "Delete Designation");
            const delete_result = await client.query(`DELETE FROM tbl_designation where designation_id = $1 `,
              [designation_id]);
            if (client) {
              client.end();
            }
            let deletecode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
            if (deletecode == 1) {
              responseData = { "message": constants.userMessage.USER_DELETED, "statusFlag": 2 }
              if (responseData) {
                return responseData;
              }
              else {
                return '';
              }
            }
            else { return '' }
          }
        }
        else{
          responseData = { "message": constants.userMessage.ALREADY_EXITS, "statusFlag": 2 }
          if (responseData) {
            return responseData;
          }
          else {
            return '';
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