/****************************
 File    : AgentMasterService.js
 Author  : Prabhavathy
 Date    : 2-02-2023
 Purpose : AgentMaster Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('./commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');

//create Agent jwt 
module.exports.saveAgentjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//create Agent service
module.exports.saveAgent = async (req) => {
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
            const { agent_name,mobile_no, alternative_mobile_no,address_name, city_name, state_id,pincode, email_id,status_id,user_id,agent_id} = decoded.data;
            if (decoded) {
                if(agent_id === 0) {
                    const id_max = await client.query(`select coalesce (max(agent_code),0) + 1 as mr FROM tbl_agent`)
                    var agent_code = id_max && id_max.rows[0].mr;
                    var makerid = await commonService.insertLogs(user_id, "Insert Agent");
                   
                    const Createresult = await client.query(`INSERT INTO public.tbl_agent(agent_code, agent_name, mobile_no, phone_no,address,city, state_code, pincode, email_id, status_id, maker_id,user_id,created_date)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12,CURRENT_TIMESTAMP)`, 
                    [agent_code, agent_name, mobile_no, alternative_mobile_no,address_name,city_name,state_id,pincode,email_id,status_id,
                    makerid,user_id]);

                    if (client) {
                        client.end();
                      }
                      
                    let create_code = Createresult && Createresult.rowCount ? Createresult.rowCount : 0;
                    if (create_code == 1) {
                      return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1 };
                    }
                    else { return '' }
                }
                else {
                    var makerid = await commonService.insertLogs(user_id, "Update Agent");
                    const count = await client.query(`select count(*) as count FROM tbl_agent where agent_code =` + agent_id)
                    var count_Check = count && count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE public.tbl_agent SET agent_name=$1, mobile_no=$2, phone_no=$3, address=$4, city=$5, state_code=$6, pincode=$7, email_id=$8, status_id=$9, maker_id=$10, user_id=$11, updated_date=CURRENT_TIMESTAMP WHERE agent_code=$12`, [agent_name, mobile_no, alternative_mobile_no,address_name,city_name,state_id,pincode,email_id,status_id,makerid,user_id,agent_id]);

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

//create List Agent jwt 
module.exports.listAgentjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//create Agent LIST
module.exports.listAgent = async (req) => {
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
          const agent_Result = await client.query(`select a.agent_code,a.agent_name,a.status_id,b.status_name,a.mobile_no,a.default_column, a.phone_no,a.address,a.city,a.pincode,a.email_id,a.state_code,c.state_name,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate from tbl_agent as a  
          inner join tbl_def_status as b on a.status_id = b.status_id inner join tbl_def_state as c on c.state_id = a.state_code where  `+ status + ` order by a.agent_code desc `);
          if (client) {
            client.end();
          }
  
          let agent_Array = agent_Result && agent_Result.rows ? agent_Result.rows : [];
  
          responseData = { "AgentList": agent_Array }
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

  //Delete Agent jwt 
module.exports.deleteAgentjwt = async (req) => {
    try {
      const token = await commonService.jwtCreate(req);
      return { token };
    } catch (error) {
      throw new Error(error);
    }
  }
  
  //Delete Agent service
  module.exports.deleteAgent = async (req) => {
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
        const { user_id, agent_id } = decoded.data;
        if (decoded) {
          const customer_Count = await client.query(`select count(*) as count FROM tbl_customer where agent_code =` + agent_id)
          var agent_Check = customer_Count && customer_Count.rows[0].count;
          if (agent_Check == 0 || agent_Check == '0') {
            const agent_Count = await client.query(`select count(*) as count FROM tbl_agent where agent_code =` + agent_id)
            var count_Check = agent_Count && agent_Count.rows[0].count;
            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
              await commonService.insertLogs(user_id, "Delete Agent");
              const delete_result = await client.query(`DELETE FROM tbl_agent where agent_code = $1 `,
                [agent_id]);
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