/****************************
 File    : ReportService.js
 Author  : Prabhavathy
 Date    : 27-09-2022
 Purpose : Report Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');


//create pending Job Report List jwt 
module.exports.pendingJobReportListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create pending Job Report LIST
module.exports.pendingJobReportList = async (req) => {
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
      const {jobtype_id,item_id} = decoded.data;
      var jobtype = '',item ='';
      if (decoded) {
        if (jobtype_id == 0) {
            jobtype = ' 1=1'
        }
        else {
            jobtype = ` a.jobtype_id = ` + jobtype_id
        }
        if (item_id == 0) {
            item = ' 1=1'
        }
        else {
            item = ` a.item_id = ` + item_id
        }
        const job_Result = await client.query(`SELECT a.job_id,a.employee_id,b.employee_name,b.employee_code,a.machine_id,c.machine_no,a.design_id,d.qr_code as design_no,e.department_id,f.department_name,extract(day from CURRENT_DATE::timestamp - a.job_date::date ) as noofdays,a.number_set,a.total_pieces FROM tbl_job_details as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_machine as c on a.machine_id = c.machine_id left join tbl_item_sizes as d on a.design_id = d.size_id inner join tbl_hr_details as e on a.employee_id = e.employee_id inner join tbl_department as f on e.department_id = f.department_id where a.status_id = 4 and ` + item + ` and ` + jobtype + `  order by a.job_id desc`);
        if (client) {
          client.end();
        }

        let PendingJob_Array = job_Result && job_Result.rows ? job_Result.rows : [];

        responseData = { "PendingJobArray": PendingJob_Array }
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
//create Employee Performance Report List jwt 
module.exports.employeePerformanceReportListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Employee Performance Report List
module.exports.employeePerformanceReportList = async (req) => {
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
      const {from_date,to_date,item_id} = decoded.data;
      var datediff = '',item ='';
      if (decoded) {
        if (from_date && to_date) {
          datediff = `to_char(a.created_date,'YYYY-MM-DD') :: date BETWEEN `
              .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
          }
        if (item_id == 0) {
            item = ' 1=1'
        }
        else {
            item = ` e.item_id = ` + item_id
        }
        const Performance_Result = await client.query(`select count(*) as total_jobs,dev.employee_id,COALESCE(sum(dev.net_amount),0) as net_amount,COALESCE(sum(dev.total_pieces),0) as total_pieces,dev.employee_code,dev.machine_no,dev.employee_name,dev.department_name from (select c.employee_id,f.machine_no,COALESCE(sum(c.net_amount),0) as net_amount,COALESCE(sum(d.total_pieces),0) as total_pieces,b.employee_code,b.employee_name,g.department_name,(select count (*) from tbl_job_details where job_id = c.job_id) from tbl_process_details as a inner join tbl_salary_process as c on a.process_id = c.process_id  inner join tbl_job_details as d on c.job_id = d.job_id inner join tbl_employee_details as b on b.employee_id = c.employee_id inner join tbl_def_item as e on d.item_id = e.item_id left join tbl_machine as f on c.employee_id = f.employee_id inner join tbl_hr_details as h on c.employee_id = h.employee_id inner join tbl_department as g on h.department_id = g.department_id where ` + datediff + ` and ` + item + ` group by c.employee_id,c.job_id,b.employee_code,b.employee_name,f.machine_no,g.department_name) as  dev group by dev.employee_id,dev.employee_code,dev.employee_name,dev.machine_no,dev.department_name`);

        let Performance_Array = Performance_Result && Performance_Result.rows ? Performance_Result.rows : [];

        responseData = { "PerformanceArray": Performance_Array }
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

//create Payout Report List jwt 
module.exports.payoutReportListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Payout Report List
module.exports.payoutReportList = async (req) => {
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
      const {from_date,to_date} = decoded.data;
      var datediff = '';
      if (decoded) {
        if (from_date && to_date) {
          datediff = `to_char(a.created_date,'YYYY-MM-DD') :: date BETWEEN `
              .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
          }
          
        const Payout_Result = await client.query( `select dev.employee_id,dev.machine_no,dev.employee_code,dev.employee_name,COALESCE(sum(dev.net_amount),0) as net_amount,COALESCE(sum(dev.total_pieces),0) as total_pieces, COALESCE(sum(dev.cash_amount),0) as cash_amount,COALESCE(sum(dev.credit_amount),0) as credit_amount,coalesce(COALESCE(sum(dev.carry_amount),0)-COALESCE(sum(dev.old_carry_amount),0),0) as carry_amount from (select a.employee_id,b.employee_code,b.employee_name,c.machine_no,COALESCE(sum(a.cash_amount),0) as cash_amount,COALESCE(sum(a.credit_amount),0)as credit_amount, COALESCE(sum(a.carry_amount),0) as carry_amount,COALESCE(sum(a.old_carryforward_amount),0)
        as old_carry_amount,COALESCE(sum(a.payout_amount),0) as net_amount, (select COALESCE(sum(total_pieces),0) from tbl_job_details where job_id in (select job_id from tbl_salary_process where process_id = a.process_id)) as total_pieces from tbl_salary_payout as a inner join tbl_employee_details as b on b.employee_id = a.employee_id left join tbl_machine as c on a.employee_id = c.employee_id where ` + datediff + ` and  a.salary_status_id = 2 group by  a.employee_id, b.employee_code,b.employee_name,c.machine_no,a.process_id) as dev  group by  dev.employee_id,dev.machine_no,dev.employee_code,dev.employee_name`);

        let Payout_Array = Payout_Result && Payout_Result.rows ? Payout_Result.rows : [];

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

//create DashBoard List jwt 
module.exports.dashboardCountListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create DashBoard List
module.exports.dashboardCountList = async (req) => {
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
          const totalCount = await client.query(`select count(*) as total_job,sum(coalesce(number_set,0)) as total_set,sum(coalesce(total_pieces,0)) as total_piece from tbl_job_details where to_char(job_date,'YYYY-MM-DD') :: date =  to_char(CURRENT_DATE , 'YYYY-MM-DD') :: date`);

          const pendingCount = await client.query(`select count(*) as pending_job,sum(coalesce(number_set,0)) as total_set,sum(coalesce(total_pieces,0)) as total_piece from tbl_job_details where to_char(job_date,'YYYY-MM-DD') :: date =  to_char(CURRENT_DATE , 'YYYY-MM-DD') :: date and  status_id = 4`);
          
          const completedCount = await client.query(`select count(*) as completed_job,sum(coalesce(number_set,0)) as total_set,sum(coalesce(total_pieces,0)) as total_piece  from tbl_job_details where to_char(completed_date,'YYYY-MM-DD') :: date = to_char(CURRENT_DATE , 'YYYY-MM-DD') :: date and  status_id = 3`);

          const transferCount = await client.query(`select count(*) as transfer_job,sum(coalesce(number_set,0)) as total_set,sum(coalesce(total_pieces,0)) as total_piece  from tbl_job_details where to_char(job_date,'YYYY-MM-DD') :: date = to_char(CURRENT_DATE , 'YYYY-MM-DD') :: date and  status_id = 5`);

          var Total_Job = totalCount && totalCount.rows[0].total_job ? totalCount.rows[0].total_job : 0
          var Total_Job_Set = totalCount && totalCount.rows[0].total_set ? totalCount.rows[0].total_set : 0
          var Total_Job_Pieces = totalCount && totalCount.rows[0].total_piece ? totalCount.rows[0].total_piece : 0
        
          var Pending_Job = pendingCount && pendingCount.rows[0].pending_job ? pendingCount.rows[0].pending_job : 0
          var Pending_Job_Set = pendingCount && pendingCount.rows[0].total_set ? pendingCount.rows[0].total_set : 0
          var Pending_Job_Pieces = pendingCount && pendingCount.rows[0].total_piece ? pendingCount.rows[0].total_piece : 0
         
          var Completed_Job = completedCount && completedCount.rows[0].completed_job ? completedCount.rows[0].completed_job : 0
          var Completed_Job_Set = completedCount && completedCount.rows[0].total_set ? completedCount.rows[0].total_set : 0
          var Completed_Job_Pieces = completedCount && completedCount.rows[0].total_piece ? completedCount.rows[0].total_piece : 0
          
          var Transfer_Job = transferCount && transferCount.rows[0].transfer_job ? transferCount.rows[0].transfer_job : 0
          var Transfer_Job_Set = transferCount && transferCount.rows[0].total_set ? transferCount.rows[0].total_set : 0
          var Transfer_Job_Pieces = transferCount && transferCount.rows[0].total_piece ? transferCount.rows[0].total_piece : 0

          responseData = { "TotalJob" : Total_Job, "TotalJobSet" : Total_Job_Set, "TotalJobPiece" : Total_Job_Pieces,"PendingJob" : Pending_Job,"PendingJobSet" : Pending_Job_Set,"PendingJobPiece" : Pending_Job_Pieces,"CompletedJob" : Completed_Job,"CompletedJobSet" : Completed_Job_Set,"CompletedJobPiece" : Completed_Job_Pieces,"TransferJob" : Transfer_Job,"TransferJobSet" : Transfer_Job_Set,"TransferJobPiece" : Transfer_Job_Pieces }
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

//create Specific Employee Report List jwt 
module.exports.specificEmployeeListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Specific Employee Report List
module.exports.specificEmployeeList = async (req) => {
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
      const {from_date,to_date,item_id,employee_id} = decoded.data;
      var datediff = '',item ='';
      if (decoded) {
        if (from_date && to_date) {
          datediff = `to_char(a.completed_date,'YYYY-MM-DD') :: date BETWEEN `
              .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
          }
        if (item_id == 0) {
            item = ' 1=1'
        }
        else {
            item = ` e.item_id = ` + item_id
        } 
        const Specific_Employee_Result = await client.query(`select distinct a.employee_id,a.completed_date,b.employee_name,b.employee_code,a.machine_id,d.machine_no,a.design_id,f.qr_code as design_no,a.item_id,c.item_name,a.color_id,h.color_name,a.number_set,a.total_pieces,a.rate,a.total_amount,a.job_id,a.job_date from tbl_job_details as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id  inner join tbl_machine as d on a.machine_id = d.machine_id left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_color as h on a.color_id =  h.color_id where a.employee_id = ` + employee_id + ` and ` + item + ` and ` + datediff + ` and a.salary_status_id = 2`);
        
        let Specific_Employee_Array = Specific_Employee_Result && Specific_Employee_Result.rows ? Specific_Employee_Result.rows : [];

        responseData = { "SpecificEmployeeArray": Specific_Employee_Array }
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

//create Pending List jwt 
module.exports.pendingListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
z  } catch (error) {
    throw new Error(error);
  }
}
//create Pending List
module.exports.pendingList = async (req) => {
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
          const Pending_List = await client.query(`select a.job_id,a.job_date,a.employee_id,b.employee_name,b.employee_code,a.machine_id,c.machine_no,a.design_id,d.qr_code as design_no,a.jobtype_id,e.jobtype_name from tbl_job_details as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_machine as c on a.machine_id = c.machine_id left join tbl_item_sizes as d on a.design_id = d.size_id inner join tbl_def_jobtype as e on a.jobtype_id = e.jobtype_id where a.status_id = 4`);

          var Pending_Array = Pending_List && Pending_List.rows ? Pending_List.rows : []
         
          responseData = { "PendingJobList" : Pending_Array }
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