/****************************
 File    : payoutService.js
 Author  : Prabhavathy
 Date    : 17-09-2022
 Purpose : Payout Service 
 * ********************** */
 const connectionString = require('../database/connection');
 const commonService = require('../service/commonService');
 const jwt = require('jsonwebtoken');
 const constants = require('../constants');
 //Connect Postgres
 const { Client } = require('pg');
 
 
 //create Process List jwt 
 module.exports.employeeProcessListjwt = async (req) => {
     try {
         const token = await commonService.jwtCreate(req);
         return { token };
 
     } catch (error) {
         throw new Error(error);
     }
 }
 
 //create Employee Process LIST
 module.exports.employeeProcessList = async (req) => {
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
             const { employee_id, department_id, to_date, from_date } = decoded.data;
             if (decoded) {
                 var department = '', employee = '', datediff;
                 if (from_date && to_date) {
                     datediff = ` to_char(a.from_date,'YYYY-MM-DD') :: date = to_date('`+from_date+`','YYYY-MM-DD') and  to_char(a.to_date,'YYYY-MM-DD') :: date = to_date('`+to_date+`','YYYY-MM-DD') `;
                 }
 
                 if (department_id == 0) {
                     department = ' 1=1'
                 }
                 else {
                     department = ` i.department_id = ` + department_id
                 }
                 if (employee_id == 0) {
                     employee = ' 1=1'
                 }
                 else {
                     employee = ` c.employee_id = ` + employee_id
                 }
 
                 const totalQuery = await client.query(`select count(*),COALESCE(sum(dev.total),0) as total,COALESCE(sum(dev.total_pieces),0) as total_pieces from (select COALESCE(sum(a.net_amount),0) as total,COALESCE(sum(c.total_pieces),0) as total_pieces,count(*),a.employee_id from tbl_salary_process as a inner join tbl_job_details as c on a.job_id = c.job_id inner join tbl_employee_details as b on b.employee_id = a.employee_id 
                 inner join tbl_hr_details as j on a.employee_id = j.employee_id inner join tbl_department as i on j.department_id = i.department_id where ` + datediff + ` and   ` + department + ` and  c.salary_status_id = 1 and` + employee + `group by a.employee_id) as dev`)
 
                 var total_pieces = totalQuery && totalQuery.rows[0].total_pieces ? totalQuery.rows[0].total_pieces : 0
                 var total_amount = totalQuery && totalQuery.rows[0].total ? totalQuery.rows[0].total : 0
                 var total_count = totalQuery && totalQuery.rows[0].count ? totalQuery.rows[0].count : 0
                  
                 const exeQuery = await client.query(`select count(*),dev.machine_no,dev.machine_id,dev.process_id,dev.employee_id,COALESCE(sum(dev.net_amount),0) as net_amount,dev.employee_code,dev.employee_name,false as checked,COALESCE((dev.carryforward_amount),0) as carryforward_amount,COALESCE(sum(dev.net_amount),0) + COALESCE((dev.carryforward_amount),0)  as total_amount from (select a.process_id,c.employee_id,COALESCE(sum(c.net_amount),0) as net_amount,b.employee_code,b.employee_name,k.machine_no,k.machine_no::integer as machine_id,(select count (*) from tbl_job_details where job_id = c.job_id),(select COALESCE(carryforward_amount,0) from tbl_employee_carryforward_details where employee_id = c.employee_id  order by carryforward_id desc limit 1) as carryforward_amount from tbl_process_details as a  inner join tbl_salary_process as c on a.process_id = c.process_id inner join tbl_employee_details as b on b.employee_id = c.employee_id  inner join tbl_hr_details as j on b.employee_id = j.employee_id  inner join tbl_department as i on j.department_id = i.department_id inner join tbl_machine as k on k.employee_id = b.employee_id   where ` + datediff + ` and   ` + department + `and  c.salary_status_id = 1 and ` + employee + ` group by a.process_id,c.employee_id,c.job_id,b.employee_code,b.employee_name,k.machine_no) as  dev group by dev.process_id,dev.employee_id,
                 dev.employee_code,dev.employee_name,dev.machine_no,dev.machine_id,dev.carryforward_amount order by dev.machine_id`);
                 let Lists = exeQuery && exeQuery.rows ? exeQuery.rows : [];
 
                 if (client) {
                     client.end();
                 }
                 if (Lists && Lists.length > 0) {
                     return response = { "EmployeeProcesslist": Lists, "TotalPieces": total_pieces, "TotalAmount": total_amount, "TotalCount": total_count }
                 }
                 else {
                     return ''
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
 
 
 //create Payout jwt 
 module.exports.savePayoutjwt = async (req) => {
     try {
        let obj = {}
        obj['payout_id'] = req.payout_id;
        obj['payout_amt'] = req.payout_amt;
        obj['user_id'] = req.user_id;
        obj['status_id'] = req.status_id;
        obj['from_date'] = req.from_date;
        obj['to_date'] = req.to_date;
        obj['no_of_employee'] = req.no_of_employee;
        obj['total_pieces'] = req.total_pieces;
        const token = await commonService.jwtCreate(obj); 
         return { token };
     } catch (error) {
         throw new Error(error);
     }
 }
 
 
 //create Payout service
 module.exports.savePayout = async (req) => {
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
             const { payout_id, payout_amt, user_id, status_id, from_date, to_date, no_of_employee, total_pieces } = decoded.data;
             const { payout_details } = req;
             if (decoded) {
                 if (payout_id == 0) {
                     const id_max = await client.query(`select coalesce (max(payout_id),0) + 1 as mr FROM tbl_payout_details`)
                     var payout_max = id_max && id_max.rows[0].mr;
                     var makerid = await commonService.insertLogs(user_id, "Insert Payout");
 
                     const payoutresult = await client.query(`INSERT INTO "tbl_payout_details"("payout_id","from_date","to_date","maker_id","user_id","payout_amt","no_of_employee","total_pieces","created_date") values ($1, $2, $3, $4, $5, $6,$7,$8,CURRENT_TIMESTAMP) `, [payout_max, from_date, to_date, makerid, user_id, payout_amt, no_of_employee, total_pieces]);
 
                     if (payout_details && payout_details.length > 0) {
                         var list = payout_details
                         for (let j = 0; j < list.length; j++) {
 
                             await client.query(`UPDATE "tbl_salary_process" set salary_status_id=2 where process_id = $1 and employee_id = $2 `, [list[j].process_id, list[j].employee_id]);
 
                             const count_job = await client.query(`select job_id from tbl_salary_process where process_id = $1 and  employee_id = $2`, [list[j].process_id, list[j].employee_id]);
 
                             let count_JobArray = count_job && count_job.rows ? count_job.rows : [];
 
 
                             for (let i = 0; i < count_JobArray.length; i++) {
                                 await client.query(`UPDATE "tbl_job_details" set salary_status_id=2,updated_date=CURRENT_TIMESTAMP where job_id = $1 `, [count_JobArray[i].job_id]);
                             }
 
                            // Carryforward Entry
                             const maxamount = await client.query(`select coalesce (max(carryforward_id),0) + 1 as mr FROM tbl_employee_carryforward_details`)
                             var sub_maxamount = maxamount && maxamount.rows[0].mr;
                             await client.query(`INSERT INTO "tbl_employee_carryforward_details"("carryforward_id","employee_id","from_date","to_date","carryforward_amount","payout_id","created_date") values ($1, $2, $3, $4, $5,$6,CURRENT_TIMESTAMP) `, [sub_maxamount, list[j].employee_id, from_date, to_date, list[j].carryamount, payout_max]);
 
 
                             const max = await client.query(`select coalesce (max(salarypayout_id),0) + 1 as mr FROM tbl_salary_payout`)
                             var sub_max = max && max.rows[0].mr;
                             const salaryresult = await client.query(`INSERT INTO "tbl_salary_payout"("salarypayout_id","payout_id","employee_id","from_date","to_date", "payout_amount","salary_status_id","process_id","cash_amount","credit_amount","carry_amount","old_carryforward_amount","created_date") values ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,CURRENT_TIMESTAMP) `, [sub_max, payout_max, list[j].employee_id, from_date, to_date, list[j].net_amount, status_id, list[j].process_id, list[j].cashamount, list[j].creditamount, list[j].carryamount,list[j].old_carryforward_amount]);
                             let code = salaryresult && salaryresult.rowCount ? salaryresult.rowCount : 0;
                             console.log(code)
 
                         }
                     }
                     if (client) {
                         client.end();
                     }
 
                     let create_code = payoutresult && payoutresult.rowCount ? payoutresult.rowCount : 0;
                     if (create_code == 1) {
                         return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1 };
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
 
 //create Payout List jwt 
 module.exports.payoutListjwt = async (req) => {
     try {
         const token = await commonService.jwtCreate(req);
         return { token };
 
     } catch (error) {
         throw new Error(error);
     }
 }
 //create Payout LIST
 module.exports.payoutList = async (req) => {
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
             const { to_date, from_date} = decoded.data;
             if (decoded) {
                if (from_date && to_date) {
                    datediff = ` to_char(a.created_date,'YYYY-MM-DD') :: date between to_date('`+from_date+`','YYYY-MM-DD') and to_date('`+to_date+`','YYYY-MM-DD') `;
                }
 
                 const payout_Result = await client.query(`select a.payout_id,b.process_id ,a.from_date,a.to_date,COALESCE(sum(b.payout_amount),0)
                 as payout_amt,count(b.employee_id) as no_of_employee,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum 
                  = a.maker_id limit 1) as createddate,(select COALESCE(sum(total_pieces),0) from tbl_job_details where job_id in (select job_id from tbl_salary_process where process_id = b.process_id)) as total_pieces from tbl_payout_details as a inner join tbl_salary_payout as b on a.payout_id = b.payout_id where ` + datediff + ` group by a.payout_id,b.process_id,a.from_date,a.to_date order by a.created_date desc`);
                 if (client) {
                     client.end();
                 }
 
                 let Payout_Array = payout_Result && payout_Result.rows ? payout_Result.rows : [];
 
                 responseData = { "PayoutArray": Payout_Array }
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
 
 //create Edit Payout List jwt 
 module.exports.editPayoutjwt = async (req) => {
     try {
         const token = await commonService.jwtCreate(req);
         return { token };
 
     } catch (error) {
         throw new Error(error);
     }
 }
 
 //create Edit Payout LIST
 module.exports.editPayout = async (req) => {
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
             const { payout_id,process_id } = decoded.data;
             if (decoded) {
                 const exeQuery = await client.query(`select distinct c.employee_id,a.payout_id,b.payout_amount as net_amount,b.cash_amount as cashamount,b.credit_amount as creditamount,b.carry_amount as carryamount,c.employee_name,d.machine_no,d.machine_no::integer as machine_id,c.employee_code,(select count (*) from tbl_salary_process where employee_id = c.employee_id and process_id = b.process_id),b.old_carryforward_amount as carryforward_amount,COALESCE((b.payout_amount),0)  + b.old_carryforward_amount as total_amount from tbl_payout_details as a inner join tbl_salary_payout as b on a.payout_id = b.payout_id inner join tbl_employee_details as c on b.employee_id = c.employee_id inner join tbl_machine as d on d.employee_id = c.employee_id  where b.payout_id =` + payout_id +` and b.process_id=`+process_id+` order by machine_id`);
                 let Lists = exeQuery && exeQuery.rows ? exeQuery.rows : [];
                 const company_Result = await client.query(`SELECT company_name,city from tbl_company`);
                 let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];
                 if (client) {
                     client.end();
                 }
                 if (Lists && Lists.length > 0) {
                     return response = { "EmployeeProcesslist": Lists, "CompanyData":Company_Array }
                 }
                 else {
                     return ''
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

 
//create Payout jwt 
module.exports.payoutslipListjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
  
    } catch (error) {
        throw new Error(error);
    }
  }
  //create Pay out
  module.exports.payoutslipList = async (req) => {
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
        const {process_id, payout_id} = decoded.data;
        if (decoded) {
  
          const exeQuery = await client.query(`select distinct a.employee_id,a.process_id,c.employee_code,c.employee_name,b.machine_no,a.from_date,a.to_date from tbl_salary_process as a inner join tbl_employee_details as c on a.employee_id = c.employee_id inner join tbl_machine as b on a.employee_id = b.employee_id where a.process_id = ` + process_id);
  
          let Lists = exeQuery && exeQuery.rows ? exeQuery.rows : [];
          let result = [];
          if (Lists.length > 0) {
              for (let i = 0; i < Lists.length; i++) { 
                  const Process_Result = await client.query(`select a.employee_id,a.job_id,b.job_date,b.completed_date,b.total_pieces,b.rate,b.total_amount,b.design_id,c.qr_code as design_no from tbl_salary_process as a  inner join tbl_job_details as b on a.job_id = b.job_id left join tbl_item_sizes as c on b.design_id = c.size_id  where a.employee_id = ` + Lists[i].employee_id + ` and a.process_id = ` + Lists[i].process_id );
                  let jobList = Process_Result && Process_Result.rows ? Process_Result.rows : [];
                  const Payout_Result = await client.query(`select sum(coalesce(cash_amount,0)) as cash_amount, sum(coalesce(credit_amount,0)) as credit_amount, 
                  sum(coalesce(carry_amount,0)) as carry_amount from tbl_salary_payout where  
                  employee_id = ` + Lists[i].employee_id + `  and  process_id =  ` + Lists[i].process_id +` and payout_id=`+payout_id+`  ` );
                  let payoutList = Payout_Result && Payout_Result.rows ? Payout_Result.rows[0] : {};
                  let obj = Lists[i]
                  obj['jobList'] = jobList
                  obj['payoutTotal'] = payoutList
                  result.push(obj)
              }
            }
            const company_Result = await client.query(`SELECT company_name,city from tbl_company`);
         let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];
          if(Lists && Lists.length > 0){
            return response = { "PayslipArray": result, "CompanyArray":Company_Array }
           }
          else {
            return  { "PayslipArray": [], "CompanyArray":[] };
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