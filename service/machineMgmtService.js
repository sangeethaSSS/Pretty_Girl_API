/****************************
 File    : machineMasterService.js
 Author  : Prabhavathy
 Date    : 2-09-2022
 Purpose : Machine Master Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');


//create Machine List jwt 
module.exports.machineListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Machine LIST
module.exports.machineList = async (req) => {
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
        const machine_Result = await client.query(`select a.machine_id,a.employee_id,a.machine_no,a.status_id,b.status_name,c.employee_name,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate from tbl_machine as a  inner join tbl_def_status as b on a.status_id = b.status_id left join tbl_employee_details as c on a.employee_id = c.employee_id where  `+ status + ` order by  a.machine_id desc `);
        if (client) {
          client.end();
        }

        let Machine_Array = machine_Result && machine_Result.rows ? machine_Result.rows : [];

        responseData = { "MachineArray": Machine_Array }
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

//create Machine jwt 
module.exports.saveMachinejwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}


//create Machine service
module.exports.saveMachine = async (req) => {
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
      const { machine_id, machine_no, status_id, user_id, employee_id} = decoded.data;
      if (decoded) {
        const exit_count = await client.query(`select count(*) as count FROM tbl_machine where lower(machine_no) = lower('` + machine_no + `') and machine_id != ` + machine_id)
        var exit_check = exit_count && exit_count.rows[0].count
        if (exit_check > 0) {
          return response = { "message": constants.userMessage.MACHINE_DUPLICATION, "statusFlag": 2};
        }
        else{
          if (machine_id == 0) {
            var makerid = await commonService.insertLogs(user_id, "Insert Machine");
            const max = await client.query(`select coalesce(max(machine_id),0) + 1 as mr FROM tbl_machine`)
            var maxmachine = max && max.rows[0].mr;
            const result = await client.query(`INSERT INTO tbl_machine (machine_id,machine_no,status_id,user_id,maker_id,employee_id,created_date) values ($1, $2, $3,$4,$5,$6,CURRENT_TIMESTAMP) `, [maxmachine, machine_no, status_id, user_id, makerid,employee_id]);
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
            var makerid = await commonService.insertLogs(user_id, "Update Machine");
            const count = await client.query(`select count(*) as count FROM tbl_machine where machine_id =` + machine_id)
            var count_Check = count && count.rows[0].count
            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
              const update_result = await client.query(`UPDATE "tbl_machine" set machine_no=$1,status_id=$2,user_id=$3,maker_id=$4,employee_id=$5,updated_date=CURRENT_TIMESTAMP where machine_id = $6 `, [machine_no, status_id, user_id, makerid, employee_id,machine_id]);

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

//Delete Machine jwt 
module.exports.deleteMachinejwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}

//Delete Machine service
module.exports.deleteMachine = async (req) => {
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
      const { user_id, machine_id } = decoded.data;
      if (decoded) {
        const machine_Count = await client.query(`select count(*) as count FROM tbl_job_details where machine_id =` + machine_id)
        var machine_Check = machine_Count && machine_Count.rows[0].count;
        if (machine_Check == 0 || machine_Check == '0') {
          const group_Count = await client.query(`select count(*) as count FROM tbl_machine where machine_id =` + machine_id)
          var count_Check = group_Count && group_Count.rows[0].count;
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            await commonService.insertLogs(user_id, "Delete Machine");
            const delete_result = await client.query(`DELETE FROM tbl_machine where machine_id = $1 `,
              [machine_id]);
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