/****************************
 File    : jobcuttingprocessService.js
 Author  : Kavitha P
 Date    : 28-10-2023
 Purpose : Job Cutting Process Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');


//create Process List jwt 
module.exports.ViewjobCuttingsjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create Process LIST
module.exports.ViewjobCuttings = async (req) => {
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
            const { employee_id, to_date, from_date, user_id, status_id } = decoded.data;
            if (decoded) {
                var employee = '', datediff;
                if (from_date && to_date) {
                    datediff = `to_char(a.completed_date,'YYYY-MM-DD') :: date BETWEEN `
                        .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
                }

                if (employee_id == 0 || employee_id == "0") {
                    employee = ' 1=1'
                }
                else {
                  if (employee_id && employee_id != "" && employee_id != "0") {
                    const employee_code_val = employee_id ? '\'' + employee_id.split(',').join('\',\'') + '\'' : '';
                    employee = `a.employee_id in (` + employee_code_val + `) `
                  }
                }
                
                const totalQuery = await client.query(`select count(*) as count,COALESCE(sum(total),0) as total_amount,COALESCE(sum(total_pieces),0) as total_pieces
                from (select a.employee_id, COALESCE(sum(total_amount*job_cutting_pieces*j.job_cutting_set),0) as total,COALESCE(sum(job_cutting_pieces*job_cutting_set),0) as total_pieces 
                from tbl_job_cutting as a inner join tbl_job_cutting_item_details as j on a.job_cutting_id = j.job_cutting_id 
                 inner join tbl_employee_details as b on a.employee_id = b.employee_id 
                    where ` + datediff + ` and  a.status_id = ` + status_id + ` and  
                a.salary_status_id = 0 and   ` + employee  +  ` group by a.employee_id) as dev`)
                var total_pieces = totalQuery && totalQuery.rows[0].total_pieces ? totalQuery.rows[0].total_pieces : 0
                var total_amount = totalQuery && totalQuery.rows[0].total_amount ? totalQuery.rows[0].total_amount : 0
                var total_count = totalQuery && totalQuery.rows[0].count ? totalQuery.rows[0].count : 0
           
                const exeQuery = await client.query(`select a.employee_id,b.employee_name,b.employee_code, sum(j.job_cutting_set) AS job_cutting_set, c.machine_no,c.machine_no::integer as machine_id, COALESCE(sum(j.total_amount*job_cutting_pieces*j.job_cutting_set),0) as total,COALESCE(sum(j.job_cutting_pieces*j.job_cutting_set),0) as total_pieces from tbl_job_cutting as a inner join tbl_employee_details as b on a.employee_id = b.employee_id left join tbl_job_cutting_item_details as j on a.job_cutting_id = j.job_cutting_id inner join tbl_machine as c on a.employee_id = c.employee_id where ` + datediff + ` and  a.status_id = ` + status_id + ` and a.salary_status_id = 0 and ` + employee + ` group by a.employee_id, b.employee_name, b.employee_code, c.machine_no order by machine_id`);

                let Lists = exeQuery && exeQuery.rows ? exeQuery.rows : [];
                let result = [];
                if (Lists.length > 0) {
                  for (let i = 0; i < Lists.length; i++) {
                        const Process_Result = await client.query(`select a.completed_date,a.job_cutting_id,j.total_amount as rate,(j.total_amount*j.job_cutting_pieces*j.job_cutting_set) as total_amount,j.size_id,
                        a.employee_id,b.employee_name,b.employee_code,a.machine_id, d.machine_no,j.design_id,f.qr_code as design_no,j.item_id,c.item_name,j.color_id,h.color_name,j.job_cutting_set, j.job_cutting_pieces*j.job_cutting_set as job_cutting_pieces,a.job_cutting_id,a.job_cutting_date,a.created_date from tbl_job_cutting as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_job_cutting_item_details as j on a.job_cutting_id = j.job_cutting_id inner join tbl_def_item as c on j.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id left join tbl_item_sizes as f on f.size_id = j.size_id left join tbl_color as h on j.color_id =  h.color_id where a.employee_id = ` + Lists[i].employee_id + `  and ` + datediff + ` and a.status_id = ` + status_id + ` and a.salary_status_id = 0 order by a.completed_date`);

                        let employeeList = Process_Result && Process_Result.rows ? Process_Result.rows : [];
                        let obj = Lists[i]
                        obj['employeeList'] = employeeList
                        result.push(obj)
                    }
                }
                if (client) {
                    client.end();
                }
                if(Lists && Lists.length > 0){
                    return response = { "Employeelist": result, "TotalPieces" : total_pieces, "TotalAmount":total_amount,"TotalCount":total_count}
                }
               else {
                return response = { "Employeelist": [], "TotalPieces" : 0, "TotalAmount":0,"TotalCount":0}
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

//create Process jwt 
module.exports.savejobCuttingProcessjwt = async (req) => {
  try {
        let obj = {}
        obj['process_id'] = req.process_id;
        obj['salary_amt'] = req.salary_amt;
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


//create Process service
module.exports.savejobCuttingProcess = async (req) => {
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
            const {  process_id, salary_amt, user_id, status_id, from_date,to_date,no_of_employee,total_pieces } = decoded.data;
          const { employee_details } = req; 
            if (decoded) {
                    if (process_id == 0) {
                        const id_max = await client.query(`select coalesce (max(process_id),0) + 1 as mr FROM tbl_job_cutting_process_details`)
                        var process_max = id_max && id_max.rows[0].mr;
                        var makerid = await commonService.insertLogs(user_id, "Insert Job Cutting Process");

                        const processresult = await client.query(`INSERT INTO "tbl_job_cutting_process_details"("process_id","from_date","to_date","maker_id","user_id","salary_amt","total_pieces","no_of_employee","created_date") values ($1, $2, $3, $4, $5, $6,$7,$8,CURRENT_TIMESTAMP) `, [process_max, from_date, to_date, makerid, user_id,salary_amt,total_pieces,no_of_employee]);

                        if (employee_details && employee_details.length > 0) {
                                for(let j = 0; j < employee_details.length; j++){
                                    await client.query(`UPDATE "tbl_job_cutting" set salary_status_id=1,updated_date=CURRENT_TIMESTAMP where job_cutting_id = $1 `, [employee_details[j].job_cutting_id]);

                                    const max = await client.query(`select coalesce (max(salaryprocess_id),0) + 1 as mr FROM tbl_job_cutting_salary_process`)
                                    var sub_max = max && max.rows[0].mr;

                                    const salaryresult = await client.query(`INSERT INTO "tbl_job_cutting_salary_process"("salaryprocess_id","process_id","employee_id","job_cutting_id","from_date","to_date", "net_amount","salary_status_id", "created_date","size_id","job_cutting_set","job_cutting_pieces","total_amount") values ($1, $2, $3, $4, $5,$6,$7,$8,CURRENT_TIMESTAMP,$9, $10, $11, $12) `, [sub_max, process_max, employee_details[j].employee_id, employee_details[j].job_cutting_id,from_date,to_date,employee_details[j].total_amount,status_id, employee_details[j].size_id, employee_details[j].job_cutting_set, employee_details[j].job_cutting_pieces, employee_details[j].total_amount]);
                                    let code = salaryresult && salaryresult.rowCount ? salaryresult.rowCount : 0;
                                }
                        }
                        if (client) {
                            client.end();
                        }

                        let create_code = processresult && processresult.rowCount ? processresult.rowCount : 0;
                        if (create_code == 1) {
                            return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1 };
                        }
                        else { return '' }
                    }
                    else {
                        var makerid = await commonService.insertLogs(user_id, "Update Item");
                        const count = await client.query(`select count(*) as count FROM tbl_job_cutting_process_details where process_id =` + process_id)
                        var count_Check = count && count.rows[0].count
                        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {

                            const update_result = await client.query(`UPDATE "tbl_job_cutting_process_details" set from_date=$1,to_date=$2,salary_amt=$3,user_id=$4,maker_id=$5,no_of_employee=$6,total_pieces=$7,updated_date=CURRENT_TIMESTAMP where process_id = $8 `, [from_date, to_date, salary_amt, user_id, makerid,no_of_employee,total_pieces, process_id]);


                            if (employee_details && employee_details.length > 0) {
                                var list = employee_details
                                for(let j = 0; j < list.length; j++){

                                    await client.query(`UPDATE "tbl_job_cutting" set salary_status_id=1,updated_date=CURRENT_TIMESTAMP where job_cutting_id = $1 `, [list[j].job_cutting_id]);

                                    await client.query(`DELETE FROM tbl_job_cutting_salary_process where process_id=` + process_id)

                                    const max = await client.query(`select coalesce (max(salaryprocess_id),0) + 1 as mr FROM tbl_job_cutting_salary_process`)
                                    var sub_max = max && max.rows[0].mr;
                                    const salaryresult = await client.query(`INSERT INTO "tbl_job_cutting_salary_process"("salaryprocess_id","process_id","employee_id","job_cutting_id","from_date","to_date", "net_amount","salary_status_id", "created_date","size_id","job_cutting_set","job_cutting_pieces","total_amount") values ($1, $2, $3, $4, $5,$6,$7,$8,CURRENT_TIMESTAMP,$9, $10, $11, $12) `, [sub_max, process_max, employee_details[j].employee_id, employee_details[j].job_cutting_id,from_date,to_date,employee_details[j].total_amount,status_id, employee_details[j].size_id, employee_details[j].job_cutting_set, employee_details[j].job_cutting_pieces, employee_details[j].total_amount]);
                                    let code = salaryresult && salaryresult.rowCount ? salaryresult.rowCount : 0;
                                }
                        }
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

//create Process List jwt 
module.exports.jobCuttingProcessListjwt = async (req) => {
    try {
      const token = await commonService.jwtCreate(req);
      return { token };
  
    } catch (error) {
      throw new Error(error);
    }
  }
  //create Process LIST
  module.exports.jobCuttingProcessList = async (req) => {
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
        const { to_date, from_date, limit, offset} = decoded.data;
        if (decoded) {
          if (from_date && to_date) {
            datediff = ` to_char(a.created_date,'YYYY-MM-DD') :: date between to_date('`+from_date+`','YYYY-MM-DD') and to_date('`+to_date+`','YYYY-MM-DD') `;
          }

          const total_process_Result = await client.query(`select COALESCE(sum(b.net_amount),0) as total,COALESCE(sum(b.job_cutting_pieces),0) as total_pieces,to_char(a.from_date, 'YYYY-MM-DD') as from_date,to_char(a.to_date, 'YYYY-MM-DD') as to_date,
          (select count(*) from (select distinct employee_id from tbl_job_cutting_salary_process where process_id = a.process_id) as derv) as count,a.process_id, 
           (select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1))
           as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1)  as createddate  from tbl_job_cutting_process_details as a  inner join tbl_job_cutting_salary_process as b on a.process_id = b.process_id inner join tbl_job_cutting_item_details as c on b.job_cutting_id = c.job_cutting_id and c.size_id = b.size_id
          where  ` + datediff + ` group by a.process_id,a.from_date,a.to_date  order by a.created_date desc`);

          const process_Result = await client.query(`select COALESCE(sum(b.net_amount),0) as total,COALESCE(sum(b.job_cutting_pieces),0) as total_pieces,to_char(a.from_date, 'YYYY-MM-DD') as from_date,to_char(a.to_date, 'YYYY-MM-DD') as to_date,
          (select count(*) from (select distinct employee_id from tbl_job_cutting_salary_process where process_id = a.process_id) as derv) as count,a.process_id, 
           (select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1))
           as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1)  as createddate  from tbl_job_cutting_process_details as a  inner join tbl_job_cutting_salary_process as b on a.process_id = b.process_id inner join tbl_job_cutting_item_details as c on b.job_cutting_id = c.job_cutting_id and c.size_id = b.size_id
          where  ` + datediff + ` group by a.process_id,a.from_date,a.to_date  order by a.created_date desc LIMIT ${limit} OFFSET ${offset}`);

          const company_Result = await client.query(`SELECT company_name,city from tbl_company`);

          if (client) {
            client.end();
          }
  
          let Process_Array = process_Result && process_Result.rows ? process_Result.rows : [];
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];
          let Total_Process = total_process_Result && total_process_Result.rowCount ? total_process_Result.rowCount : 0;

          responseData = { "ProcessArray": Process_Array,"CompanyArray":Company_Array, "Total_Process": Total_Process }
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
  

  //create Process EDit jwt 
module.exports.editProcessjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create Process EDit
module.exports.editProcess = async (req) => {
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
            const { process_id } = decoded.data;
            if (decoded) { 
                const exeQuery = await client.query(`select b.employee_id,b.employee_name,b.employee_code,COALESCE(sum(c.net_amount),0) as total,COALESCE(sum(c.job_cutting_pieces),0) as total_pieces
                , COALESCE(sum(c.job_cutting_set),0) as job_cutting_set,
                coalesce((select machine_no from tbl_machine where employee_id=b.employee_id),'') as machine_no,
                coalesce((select machine_no::integer from tbl_machine where employee_id=b.employee_id),0) as machine_id
                from tbl_job_cutting_process_details
                as a inner join tbl_job_cutting_salary_process as c on a.process_id = c.process_id inner join tbl_employee_details as b on 
                c.employee_id = b.employee_id
                where a.process_id = `+ process_id + ` group by b.employee_id,b.employee_name,b.employee_code,machine_no, machine_id  order by machine_id`);

                let Lists = exeQuery && exeQuery.rows ? exeQuery.rows : [];
                let result = [];

                if (Lists.length > 0) {
                    for (let i = 0; i < Lists.length; i++) {
                        const Process_Result = await client.query(`select distinct k.job_cutting_id, l.completed_date,j.total_amount as rate,k.net_amount as total_amount,j.size_id,
                        b.employee_id,b.employee_name,b.employee_code,d.machine_id, d.machine_no,j.design_id,f.qr_code as design_no,
                        j.item_id,c.item_name,j.color_id,h.color_name, k.job_cutting_set, k.job_cutting_pieces as job_cutting_pieces,
                        k.job_cutting_id,l.job_cutting_date,a.created_date from tbl_job_cutting_process_details 
                        as a inner join tbl_job_cutting_salary_process as k on a.process_id = k.process_id 
                        inner join tbl_employee_details as b
                        on k.employee_id = b.employee_id 
                        inner join tbl_job_cutting as l on k.job_cutting_id = l.job_cutting_id 
                        inner join tbl_job_cutting_item_details as j on k.job_cutting_id = j.job_cutting_id and k.size_id = j.size_id
                        inner join tbl_def_item as c on j.item_id = c.item_id inner join tbl_machine as d on k.employee_id=d.employee_id
                        left join tbl_item_sizes as f on f.size_id = j.size_id left join tbl_color as h on j.color_id =  h.color_id
                        where k.employee_id = ` + Lists[i].employee_id + ` and a.process_id =  `+ process_id+` order by l.completed_date` );
                        let employeeList = Process_Result && Process_Result.rows ? Process_Result.rows : [];
                        let obj = Lists[i]
                        obj['employeeList'] = employeeList
                        result.push(obj)
                    }
                }
                if (client) {
                    client.end();
                }
                if(Lists && Lists.length > 0){
                    return response = { "Employeelist": result}
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


//Delete Process jwt 
module.exports.deleteProcessjwt = async (req) => {
    try {
      const token = await commonService.jwtCreate(req);
      return { token };
    } catch (error) {
      throw new Error(error);
    }
  }
  
  //Delete Process service
  module.exports.deleteProcess = async (req) => {
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
        const { user_id, process_id } = decoded.data;
        if (decoded) {
          const process_Count = await client.query(`select count(*) as count FROM tbl_job_cutting_salary_payout where process_id = `+ process_id)
          var process_Check = process_Count && process_Count.rows[0].count;
         if (process_Check == 0 || process_Check == '0') {
            const group_Count = await client.query(`select count(*) as count FROM tbl_job_cutting_process_details where process_id =` + process_id)
            var count_Check = group_Count && group_Count.rows[0].count;
            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            const exeQuery = await client.query(`select job_cutting_id from tbl_job_cutting_salary_process where process_id=` + process_id)
             let Lists = exeQuery && exeQuery.rows ? exeQuery.rows : [];
             if (Lists.length > 0) {
                 for (let i = 0; i < Lists.length; i++) {
                    await client.query(`UPDATE "tbl_job_cutting" set salary_status_id=0,updated_date=CURRENT_TIMESTAMP where job_cutting_id =  $1 `, [Lists[i].job_cutting_id]);
                }
            }
              await commonService.insertLogs(user_id, "Delete Process");
              await client.query(`DELETE FROM tbl_job_cutting_salary_process where process_id=` + process_id)
              const delete_result = await client.query(`DELETE FROM tbl_job_cutting_process_details where process_id = $1 `,
                [process_id]);
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

//create Pay slip jwt 
module.exports.payslipListjwt = async (req) => {
  try {
      const token = await commonService.jwtCreate(req);
      return { token };

  } catch (error) {
      throw new Error(error);
  }
}
//create Pay slip
module.exports.payslipList = async (req) => {
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
      const {process_id} = decoded.data;
      if (decoded) {

        const exeQuery = await client.query(`select distinct a.employee_id,a.process_id,c.employee_code,c.employee_name,b.machine_no,a.from_date,a.to_date from tbl_job_cutting_salary_process as a inner join tbl_employee_details as c on a.employee_id = c.employee_id inner join tbl_machine as b on a.employee_id = b.employee_id where a.process_id = ` + process_id);

        let Lists = exeQuery && exeQuery.rows ? exeQuery.rows : [];
        let result = [];
        if (Lists.length > 0) {
            for (let i = 0; i < Lists.length; i++) {
                const Process_Result = await client.query(`select a.employee_id,a.job_cutting_id,d.job_cutting_date,d.completed_date,
                a.job_cutting_pieces as total_pieces,b.total_amount as rate,a.total_amount,b.design_id,c.qr_code 
                as design_no from tbl_job_cutting_salary_process as a 
                inner join tbl_job_cutting as d  on a.job_cutting_id = d.job_cutting_id
                inner join tbl_job_cutting_item_details as b on a.job_cutting_id = b.job_cutting_id and a.size_id = b.size_id
                left join tbl_item_sizes as c on cast(b.size_id as integer) = c.size_id where a.employee_id = ` + Lists[i].employee_id + ` and a.process_id = ` + Lists[i].process_id );
                let jobList = Process_Result && Process_Result.rows ? Process_Result.rows : [];
                let obj = Lists[i]
                obj['jobList'] = jobList
                result.push(obj)
            }
        }
        if(Lists && Lists.length > 0){
          return response = { "PayslipArray": result}
         }
        else {
          return response = { "PayslipArray": []}
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