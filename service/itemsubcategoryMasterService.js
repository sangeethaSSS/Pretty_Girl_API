/****************************
 File    : itemsubcategoryMasterService.js
 Author  : Krishnaveni
 Date    : 18-10-2023
 Purpose : itemsubcategoryMasterService Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');

module.exports.itemsubcategoryFilterListJwt = async (req) => {
    try {
      const token = await commonService.jwtCreate(req);
      return { token };
  
    } catch (error) {
      throw new Error(error);
    }
  }
  //create Itemgroup LIST
  module.exports.itemsubcategoryFilterList = async (req) => {
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
        const {} = decoded.data;
        if (decoded) {
           
          const itemgroup_Result = await client.query(`
          SELECT item_id as value,item_name as label FROM tbl_def_item`);
          if (client) {
            client.end();
          }
  
          let Itemgroup_Array = itemgroup_Result && itemgroup_Result.rows ? itemgroup_Result.rows : [];
  
          responseData = { "ItemgroupArray": Itemgroup_Array, message: '' }
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

//create jwt 
module.exports.itemGubCategoryListJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Itemgroup LIST
module.exports.itemGubCategoryList = async (req) => {
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
      const {} = decoded.data;
      if (decoded) {        
        const itemgroup_Result = await client.query(`SELECT * FROM (select a.sub_category_id,a.sub_category_name,a.item_group_id,a.short_name,(SELECT item_name from tbl_def_item where item_id = a.item_group_id) as itemgroupname,
          (select user_name from tbl_user where user_id =	(select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate,(select log_date from tbl_userlog where autonum = a.maker_id limit 1) as log_date,price from tbl_item_sub_category  as a order by  a.sub_category_id desc) as dev order by log_date desc`);
        if (client) {
          client.end();
        }

        let Itemgroup_Array = itemgroup_Result && itemgroup_Result.rows ? itemgroup_Result.rows : [];

        responseData = { "ItemsubgroupArray": Itemgroup_Array, "message": '' }
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
module.exports.saveItemSubCategoryJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}


//create Item sub grouop group service
module.exports.saveItemSubCategory = async (req) => {
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
      const { item_subcategory_id, itemsubcategory_name, status_id, item_group_id, user_id, short_name, price } = decoded.data;
      if (decoded) {
        const exit_count = await client.query(`select count(*) as count FROM tbl_item_sub_category where lower(short_name) = lower('` + short_name.replace(/'/g, "''") + `') and sub_category_id != ` + item_subcategory_id)
        var exit_check = exit_count && exit_count.rows[0].count
        // '` + customer_name.replace(/'/g, "''") + `'
        // const exit_count1 = await client.query(`select count(*) as count FROM tbl_item_sub_category where lower(short_item_name) = lower('` + short_name.replace(/'/g, "''") + `') and item_id != ` + itemgroup_id)
        // var exit_check1 = exit_count1 && exit_count1.rows[0].count

        if (exit_check > 0) {
          return response = { "message": constants.userMessage.ITEMSUBGROUP_DUPLICATION, "statusFlag": 2};
        } 
        // else if (exit_check1 > 0) {
        //   return response = { "message": constants.userMessage.SHORTNAME_DUPLICATION, "statusFlag": 2};
        // }
        else{
          if (item_subcategory_id == 0) {
            var makerid = await commonService.insertLogs(user_id, "Insert Item Sub Category");
            const max = await client.query(`select coalesce(max(sub_category_id),0) + 1 as mr FROM tbl_item_sub_category`)
            var maxitemgroup = max && max.rows[0].mr;
            const result = await client.query(`INSERT INTO tbl_item_sub_category (sub_category_id,sub_category_name,short_name,item_group_id,maker_id,created_date,price) values ($1, UPPER($2), UPPER($3),$4,$5,CURRENT_TIMESTAMP,$6) `, [maxitemgroup, itemsubcategory_name,  short_name.replace(/'/g, "'"),item_group_id, makerid, Number(price)]);
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
            const count = await client.query(`select count(*) as count FROM tbl_item_sub_category where sub_category_id =` + item_subcategory_id)
            var count_Check = count && count.rows[0].count
            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
              const update_result = await client.query(`UPDATE "tbl_item_sub_category" set sub_category_name=UPPER($1),short_name=UPPER($2),maker_id=$3,item_group_id=$4,price=$5 where sub_category_id = $6 `, [itemsubcategory_name, short_name.replace(/'/g, "'").replace(/'/g, "'"),  makerid,item_group_id,Number(price),item_subcategory_id]);

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
module.exports.deleteItemSubgroupJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}

//Delete itemgroup service
module.exports.deleteItemSubgroup = async (req) => {
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
      const { user_id, sub_category_id } = decoded.data;
      if (decoded) {
        const item_Count = await client.query(`SELECT COUNT(job_cutting_id) AS count FROM tbl_job_cutting_item_details where item_sub_category_id  =` + sub_category_id)
        var itemcount_Check = item_Count && item_Count.rows[0].count;
        // var itemcount_Check = 0;
        if (itemcount_Check == 0 || itemcount_Check == '0') {
          const group_Count = await client.query(`select count(*) as count FROM tbl_item_sub_category where sub_category_id =` + sub_category_id)
          var count_Check = group_Count && group_Count.rows[0].count;
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            await commonService.insertLogs(user_id, "Delete Item Sub Category");
            const delete_result = await client.query(`DELETE FROM tbl_item_sub_category where sub_category_id = $1 `,
              [sub_category_id]);
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