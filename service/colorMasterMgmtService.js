/****************************
 File    : colorMasterService.js
 Author  : Prabhavathy
 Date    : 1-09-2022
 Purpose : Color Master Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');


//create jwt 
module.exports.colorListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Color LIST
module.exports.colorList = async (req) => {
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
      const { status_id } = decoded.data;
      var status = '';
      if (decoded) {
        if (status_id == 0) {
          status = ' 1=1'
        }
        else {
          status = ` a.status_id = ` + status_id
        }
        const color_Result = await client.query(`SELECT * FROM(select a.color_id,a.color_name,a.status_id,b.status_name,a.color_picker,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate,(select log_date  from tbl_userlog where autonum = a.maker_id limit 1) as log_date from tbl_color as a  inner join tbl_def_status as b on a.status_id = b.status_id where  `+ status + ` order by a.color_id desc) as dev order by log_date desc `);
        if (client) {
          client.end();
        }

        let Color_Array = color_Result && color_Result.rows ? color_Result.rows : [];

        responseData = { "ColorArray": Color_Array }
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

//create Color jwt 
module.exports.saveColorjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}


//create Color service
module.exports.saveColor = async (req) => {
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
      const { color_id, color_name, status_id, user_id,color_picker } = decoded.data;
      if (decoded) {
        const exit_count = await client.query(`select count(*) as count FROM tbl_color where lower(color_name) = lower('` + color_name + `') and color_id != ` + color_id)
        var exit_check = exit_count && exit_count.rows[0].count
        if (exit_check > 0) {
          return response = { "message": constants.userMessage.COLOR_DUPLICATION, "statusFlag": 2 };
        }
        else {
          if (color_id == 0) {
            var makerid = await commonService.insertLogs(user_id, "Insert Color");
            const max = await client.query(`select coalesce(max(color_id),0) + 1 as mr FROM tbl_color`)
            var maxcolor = max && max.rows[0].mr;
            const result = await client.query(`INSERT INTO tbl_color (color_id,color_name,status_id,color_picker,user_id,maker_id,created_date) values ($1, $2, $3,$4,$5,$6,CURRENT_TIMESTAMP) `, [maxcolor, color_name, status_id,color_picker,user_id, makerid]);
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
            var makerid = await commonService.insertLogs(user_id, "Update Color");
            const count = await client.query(`select count(*) as count FROM tbl_color where color_id =` + color_id)
            var count_Check = count && count.rows[0].count
            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
              const update_result = await client.query(`UPDATE "tbl_color" set color_name=$1,status_id=$2,user_id=$3,maker_id=$4,color_picker = $5, updated_date=CURRENT_TIMESTAMP where color_id = $6 `, [color_name, status_id, user_id, makerid,color_picker,color_id]);

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

//Delete Color jwt 
module.exports.deleteColorjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}

//Delete Color service
module.exports.deleteColor = async (req) => {
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
      const { user_id, color_id } = decoded.data;
      if (decoded) {
        const item_color_Count = await client.query(`select count(*) from tbl_item_sizes where color_id =` + color_id)
        var itemcolor_Count = item_color_Count && item_color_Count.rows[0].count;
        const job_color_Count = await client.query(`select count(*) as count FROM tbl_job_details where color_id =` + color_id)
        var jobcolor_Check = job_color_Count && job_color_Count.rows[0].count;
        if ((jobcolor_Check == 0 || jobcolor_Check == '0') && (itemcolor_Count == 0 || itemcolor_Count == '0')) {
          const group_Count = await client.query(`select count(*) as count FROM tbl_color where color_id =` + color_id)
          var count_Check = group_Count && group_Count.rows[0].count;
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            await commonService.insertLogs(user_id, "Delete Color");
            const delete_result = await client.query(`DELETE FROM tbl_color where color_id = $1 `,
              [color_id]);
            if (client) {
              client.end();
            }
            let deletecode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
            if (deletecode == 1) {
              responseData = { "message": constants.userMessage.USER_DELETED, "statusFlag": 1 }
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
        else {
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