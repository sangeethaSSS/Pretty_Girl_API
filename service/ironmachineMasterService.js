/****************************
 File    : ironmachineMasterService.js
 Author  : Krishnaveni
 Date    : 02-08-2023
 Purpose : ironmachineMaster Service 
 * ********************** */
 const connectionString = require('../database/connection');
 const commonService = require('../service/commonService');
 const jwt = require('jsonwebtoken');
 const constants = require('../constants');
 //Connect Postgres
 const { Client } = require('pg');
 
 
 //create jwt 
 module.exports.ironmachineListJwt = async (req) => {
   try {
     const token = await commonService.jwtCreate(req);
     return { token };
 
   } catch (error) {
     throw new Error(error);
   }
 }
 //create Itemgroup LIST
 module.exports.ironmachineList = async (req) => {
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
         const ironmachine_Result = await client.query(`SELECT machine_id,machine_no,machine_name,status_id,
         (select user_name from tbl_user where user_id =	(select user_id from tbl_userlog  
         where autonum = a.maker_id limit 1)) as employeename,
         (select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where
          autonum = a.maker_id limit 1) as createddate FROM tbl_ironmachine_master as a order by machine_id`);
         if (client) {
           client.end();
         }
 
         let Ironmachine_Array = ironmachine_Result && ironmachine_Result.rows ? ironmachine_Result.rows : [];
 
         responseData = { "IronmachineArray": Ironmachine_Array }
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
 module.exports.saveIronmachineJwt = async (req) => {
   try {
     const token = await commonService.jwtCreate(req);
     return { token };
   } catch (error) {
     throw new Error(error);
   }
 }
 
 
 //create Itemgroup service
 module.exports.saveIronmachine = async (req) => {
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
    //    user_id: Joi.number().required(),
    // machine_name: Joi.string().required(),
    // machine_id: Joi.number().required(),
    // status_id: Joi.number().required(),
    // machine_no:Joi.string().required(),
       const decoded = await commonService.jwtVerify(req.jwtToken);
       const { machine_name, machine_id, machine_no, user_id, status_id } = decoded.data;
       if (decoded) {
         const exit_count = await client.query(`select count(*) as count FROM tbl_ironmachine_master where lower(machine_no) = lower('` + machine_no + `') and machine_id != ` + machine_id)
         var exit_check = exit_count && exit_count.rows[0].count
 
         if (exit_check > 0) {
           return response = { "message": constants.userMessage.IRONMACHINENO_DUPLICATE, "statusFlag": 2};
         } 
         else{
           if (machine_id == 0) {
             var makerid = await commonService.insertLogs(user_id, "Insert Iron Machine");
             const max = await client.query(`select coalesce(max(machine_id),0) + 1 as mr FROM tbl_ironmachine_master`)
             var maxironmachine = max && max.rows[0].mr;
             const result = await client.query(`INSERT INTO tbl_ironmachine_master (machine_id, machine_no, machine_name, maker_id, user_id, status_id, created_date) values ($1, $2, UPPER($3),$4, $5, $6, CURRENT_TIMESTAMP) `, [maxironmachine, machine_no, machine_name, makerid, user_id, status_id]);
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
             var makerid = await commonService.insertLogs(user_id, "Update Iron Machine");
             const count = await client.query(`select count(*) as count FROM tbl_ironmachine_master where machine_id =` + machine_id)
             var count_Check = count && count.rows[0].count
             if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
               const update_result = await client.query(`UPDATE "tbl_ironmachine_master" set machine_no=$1,machine_name=UPPER($2),maker_id=$3 where machine_id = $4 `, [machine_no, machine_name,  makerid, machine_id]);
 
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
 module.exports.deleteIronmachineJwt = async (req) => {
   try {
     const token = await commonService.jwtCreate(req);
     return { token };
   } catch (error) {
     throw new Error(error);
   }
 }
 
 //Delete itemgroup service
 module.exports.deleteIronmachine = async (req) => {
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
           const group_Count = await client.query(`select count(*) as count FROM tbl_ironmachine_master where machine_id =` + machine_id)
           var count_Check = group_Count && group_Count.rows[0].count;
           if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            const machine_Count =  await client.query(`select count(ironmachine_id) as count from tbl_fg_items where ironmachine_id=$1 `,
            [machine_id]);  
            var machine_Check = machine_Count && machine_Count.rows[0].count || 0;
            if(machine_Check == 0 ||  machine_Check == '0' ){  
             await commonService.insertLogs(user_id, "Delete Iron Machine");
             const delete_result = await client.query(`DELETE FROM tbl_ironmachine_master where machine_id = $1 `,
               [machine_id]);
             if (client) {
               client.end();
             }
             let deletecode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
             if (deletecode == 1) {
               responseData = { "message": constants.success_message.DELETED_SUCCESS, "statusFlag": 1 }
               if (responseData) {
                 return responseData;
               }
               else {
                 return '';
               }
             }
             else { 
              responseData = { "message": constants.userMessage.SOMETHING_WENT_WRONG, "statusFlag": 2 }
             return responseData ; 
            }
           } else {
               responseData = { "message": constants.userMessage.ALREADY_EXITS, "statusFlag": 2 }
              return responseData ;
           }   
          } else {
            responseData = { "message": constants.userMessage.ALREADY_EXITS, "statusFlag": 2 }
            return responseData ;
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