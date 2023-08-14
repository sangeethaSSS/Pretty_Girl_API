/****************************
 File    : rate card MasterService.js
 Author  : Prabhavathy
 Date    : 2-09-2022
 Purpose : rate card Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');


//create Ratecard List jwt 
module.exports.ratecardListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Ratecard LIST
module.exports.ratecardList = async (req) => {
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
      const {status_id, limit, offset, designCode} = decoded.data;
      var status = '';
      if (decoded) {
          if(status_id == 0)
          {
              status = '1=1'
          }
          else{
              status = ` a.piece_rate = 0 `
          }
        // const design_Result = await client.query(`select a.design_id,a.piece_rate,a.design_no from tbl_design as a  where a.status_id = 1 and `+ status + ` order by a.created_date desc` );
          let designval = '1=1';
        if(designCode !== '0'){
          designval = `b.size_id in  (`+designCode+`)`
        }
        const design_rate_total = await client.query(`select count(*) as totalcount from (select distinct coalesce(rate,0) as piece_rate,qr_code as design_id,qr_code as design_no from tbl_job_details as a inner join tbl_item_sizes as b on a.design_id = b.size_id where design_id is not NULL and  coalesce(rate,0) != 0 and `+designval+`) as dev ` );
        const design_Result = await client.query(`select distinct coalesce(rate,0) as piece_rate,qr_code as design_id,qr_code as design_no from tbl_job_details as a inner join tbl_item_sizes as b on a.design_id = b.size_id where design_id is not NULL and coalesce(rate,0) != 0 and  `+designval+` order by qr_code LIMIT $1 OFFSET $2`,[limit, offset] );

        if (client) {
          client.end();
        }

        let Ratecard_Array = design_Result && design_Result.rows ? design_Result.rows : [];
        let RatecardTotal_Array = design_rate_total && design_rate_total.rows ? design_rate_total?.rows?.[0]?.totalcount : [];

        responseData = { "RatecardArray": Ratecard_Array,"RateCardTotal": RatecardTotal_Array }
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

//create Ratecard jwt 
module.exports.saveRatecardjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}


//create Ratecard service
module.exports.saveRatecard = async (req) => {
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
      const { design_id, user_id,rate_amount } = decoded.data;
      if (decoded) {
              const update_result = await client.query(`UPDATE "tbl_design" set piece_rate=$1,user_id=$2,updated_date=CURRENT_TIMESTAMP where design_id = $3 `, [rate_amount, user_id, design_id]);

              const design_Result = await client.query(`select job_id,total_pieces from tbl_job_details where design_id = $1 and rate = 0`, [design_id]);

              let design_Array = design_Result && design_Result.rows ? design_Result.rows : [];

              for(let i = 0; i < design_Array.length; i++) {
                const total = design_Array[i].total_pieces * rate_amount
                await client.query(`UPDATE "tbl_job_details" set rate=$1,total_amount=$2,updated_date=CURRENT_TIMESTAMP where job_id = $3 `, [rate_amount,total,design_Array[i].job_id]);
              }
              if (client) {
                client.end();
              let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
              if (update_code == 1) {
                return response = { "message": constants.userMessage.USER_UPDATED, "statusFlag": 1 };
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

//Delete Ratecard jwt 
module.exports.deleteRatecardjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}

//Delete Ratecard service
module.exports.deleteRatecard = async (req) => {
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
      const { user_id, design_id } = decoded.data;
      if (decoded) {
        const delete_result = await client.query(`UPDATE "tbl_design" set piece_rate='0',user_id=$1,updated_date=CURRENT_TIMESTAMP where design_id = $2 `, [user_id, design_id]);
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