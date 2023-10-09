/****************************
 File    : CompanyMasterService.js
 Author  : Prabhavathy
 Date    : 30-08-2022
 Purpose : Company Master Service 
 *********************** */
const commonService = require('../service/commonService')
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');

//create jwt 
module.exports.companyListJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Company LIST
module.exports.companyList = async (req) => {
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
      if (decoded) {
        const company_Result = await client.query(`select a.company_id,a.company_name,a.short_name,a.addressline1,a.addressline2,a.area,a.city,a.pincode,a.email_id,a.gstin,a.mobile_number,a.telephone_number,a.state_id,a.status_id,b.state_name,c.status_name,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate from tbl_company as a  inner join tbl_def_state as b on a.state_id = b.state_id inner join tbl_def_status as c on a.status_id = c.status_id order by a.company_id desc`);
        if (client) {
          client.end();
        }

        let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];

        responseData = { "CompanyArray": Company_Array }
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
//create Company jwt 
module.exports.saveCompanyJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}
//create Company service
module.exports.saveCompany = async (req) => {
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
      const { company_id, company_name, short_name, addressline1, addressline2, area, city_name, pincode, state_id, mobile_number, telephone_number, email_id, gstin, status_id, user_id } = decoded.data;
      if (decoded) {
        const exit_count = await client.query(`select count(*) as count FROM tbl_company where lower(company_name) = lower('` + company_name.replace(/'/g, "''") + `') and company_id != ` + company_id)
        var exit_check = exit_count && exit_count.rows[0].count
        if (exit_check > 0) {
          return response = { "message": constants.userMessage.CUSTOMEREXIT, "statusFlag": 2 };
        }
        else{
          if (company_id == 0) {
            var makerid = await commonService.insertLogs(user_id, "Insert Company");
            const max = await client.query(`select coalesce(max(company_id),0) + 1 as mr FROM tbl_company`)
            var maxcompany = max && max.rows[0].mr;
            const result = await client.query(`INSERT INTO tbl_company (company_id,company_name,short_name,addressline1,addressline2,area,city,pincode,state_id,mobile_number,telephone_number,email_id,gstin,status_id,user_id,maker_id,created_date) values ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,CURRENT_TIMESTAMP) `, [maxcompany, company_name.replace(/'/g, "'"), short_name.replace(/'/g, "'"), addressline1.replace(/'/g, "'"), addressline2.replace(/'/g, "'"), area.replace(/'/g, "'"), city_name, pincode, state_id, mobile_number, telephone_number, email_id.replace(/'/g, "'"), gstin, status_id, user_id, makerid]);
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
            var makerid = await commonService.insertLogs(user_id, "Update Company");
            const count = await client.query(`select count(*) as count FROM tbl_company where company_id =` + company_id)
            var count_Check = count && count.rows[0].count
            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
              const update_result = await client.query(`UPDATE "tbl_company" set company_name=$1,short_name=$2,addressline1=$3,addressline2=$4,area=$5,city=$6,pincode=$7,state_id=$8,mobile_number=$9,telephone_number=$10,email_id=$11,gstin=$12,status_id=$13,user_id=$14,maker_id=$15,updated_date=CURRENT_TIMESTAMP where company_id = $16 `, [company_name.replace(/'/g, "'"), short_name.replace(/'/g, "'"), addressline1.replace(/'/g, "'"), addressline2.replace(/'/g, "'"), area.replace(/'/g, "'"), city_name, pincode, state_id, mobile_number, telephone_number, email_id.replace(/'/g, "'"), gstin, status_id, user_id, makerid, company_id]);
  
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
//Delete Company jwt 
module.exports.deleteCompanyJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}
//Delete Company service
module.exports.deleteCompany = async (req) => {
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
      const { user_id, company_id } = decoded.data;
      if (decoded) {
        await commonService.insertLogs(user_id, "Delete Company");
        const company_Count = await client.query(`select count(*) as count FROM tbl_company where company_id =` + company_id)
        var count_Check = company_Count && company_Count.rows[0].count;
        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
          const delete_result = await client.query(`DELETE FROM tbl_company where company_id = $1 `,
            [company_id]);
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