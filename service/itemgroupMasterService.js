/****************************
 File    : itemgroupMasterService.js
 Author  : Prabhavathy
 Date    : 30-08-2022
 Purpose : itemgroupMaster Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');


//create jwt 
module.exports.itemgroupListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Itemgroup LIST
module.exports.itemgroupList = async (req) => {
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
        const itemgroup_Result = await client.query(`select a.item_id,a.item_name ,short_item_name,
        (SELECT count(item_code) from tbl_item_management where item_code = a.item_id)  as noofitem,(select user_name from tbl_user where user_id =	(select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate from tbl_def_item as a order by  a.item_id desc`);
        if (client) {
          client.end();
        }

        let Itemgroup_Array = itemgroup_Result && itemgroup_Result.rows ? itemgroup_Result.rows : [];

        responseData = { "ItemgroupArray": Itemgroup_Array }
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

//create Itemgroup jwt 
module.exports.saveItemgroupjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}


//create Itemgroup service
module.exports.saveItemgroup = async (req) => {
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
      const { itemgroup_id, itemgroup_name, short_name, user_id } = decoded.data;
      if (decoded) {
        const exit_count = await client.query(`select count(*) as count FROM tbl_def_item where lower(item_name) = lower('` + itemgroup_name + `') and item_id != ` + itemgroup_id)
        var exit_check = exit_count && exit_count.rows[0].count

        const exit_count1 = await client.query(`select count(*) as count FROM tbl_def_item where lower(short_item_name) = lower('` + short_name + `') and item_id != ` + itemgroup_id)
        var exit_check1 = exit_count1 && exit_count1.rows[0].count

        if (exit_check > 0) {
          return response = { "message": constants.userMessage.ITEMGROUP_DUPLICATION, "statusFlag": 2};
        } 
        else if (exit_check1 > 0) {
          return response = { "message": constants.userMessage.SHORTNAME_DUPLICATION, "statusFlag": 2};
        }
        else{
          if (itemgroup_id == 0) {
            var makerid = await commonService.insertLogs(user_id, "Insert Item Group");
            const max = await client.query(`select coalesce(max(item_id),0) + 1 as mr FROM tbl_def_item`)
            var maxitemgroup = max && max.rows[0].mr;
            const result = await client.query(`INSERT INTO tbl_def_item (item_id,item_name,short_item_name,maker_id,created_date) values ($1, UPPER($2), UPPER($3),$4,CURRENT_TIMESTAMP) `, [maxitemgroup, itemgroup_name,  short_name, makerid]);
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
            var makerid = await commonService.insertLogs(user_id, "Update Item Group");
            const count = await client.query(`select count(*) as count FROM tbl_def_item where item_id =` + itemgroup_id)
            var count_Check = count && count.rows[0].count
            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
              const update_result = await client.query(`UPDATE "tbl_def_item" set item_name=UPPER($1),short_item_name=UPPER($2),maker_id=$3 where item_id = $4 `, [itemgroup_name, short_name,  makerid, itemgroup_id]);

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

//Delete itemgroup jwt 
module.exports.deleteItemgroupjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}

//Delete itemgroup service
module.exports.deleteItemgroup = async (req) => {
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
      const { user_id, itemgroup_id } = decoded.data;
      if (decoded) {
        const item_Count = await client.query(`select count(*) as count FROM tbl_item_management where item_code =` + itemgroup_id)
        var itemcount_Check = item_Count && item_Count.rows[0].count;
        if (itemcount_Check == 0 || itemcount_Check == '0') {
          const group_Count = await client.query(`select count(*) as count FROM tbl_def_item where item_id =` + itemgroup_id)
          var count_Check = group_Count && group_Count.rows[0].count;
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            await commonService.insertLogs(user_id, "Delete Item Group");
            const delete_result = await client.query(`DELETE FROM tbl_def_item where item_id = $1 `,
              [itemgroup_id]);
            if (client) {
              client.end();
            }
            let deletecode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
            if (deletecode == 1) {
              responseData = { "message": constants.userMessage.USER_DELETED, "statusFlag": 0 }
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