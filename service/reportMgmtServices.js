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
      const { jobtype_id, item_id } = decoded.data;
      var jobtype = '', item = '';
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
      const { from_date, to_date, item_id } = decoded.data;
      var datediff = '', item = '';
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
      const { from_date, to_date } = decoded.data;
      var datediff = '';
      if (decoded) {
        if (from_date && to_date) {
          datediff = `to_char(a.created_date,'YYYY-MM-DD') :: date BETWEEN `
            .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
        }

        const Payout_Result = await client.query(`select dev.employee_id,dev.machine_no,dev.employee_code,dev.employee_name,COALESCE(sum(dev.net_amount),0) as net_amount,COALESCE(sum(dev.total_pieces),0) as total_pieces, COALESCE(sum(dev.cash_amount),0) as cash_amount,COALESCE(sum(dev.credit_amount),0) as credit_amount,coalesce(COALESCE(sum(dev.carry_amount),0)-COALESCE(sum(dev.old_carry_amount),0),0) as carry_amount from (select a.employee_id,b.employee_code,b.employee_name,c.machine_no,COALESCE(sum(a.cash_amount),0) as cash_amount,COALESCE(sum(a.credit_amount),0)as credit_amount, COALESCE(sum(a.carry_amount),0) as carry_amount,COALESCE(sum(a.old_carryforward_amount),0)
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
      const { } = decoded.data;
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

        responseData = { "TotalJob": Total_Job, "TotalJobSet": Total_Job_Set, "TotalJobPiece": Total_Job_Pieces, "PendingJob": Pending_Job, "PendingJobSet": Pending_Job_Set, "PendingJobPiece": Pending_Job_Pieces, "CompletedJob": Completed_Job, "CompletedJobSet": Completed_Job_Set, "CompletedJobPiece": Completed_Job_Pieces, "TransferJob": Transfer_Job, "TransferJobSet": Transfer_Job_Set, "TransferJobPiece": Transfer_Job_Pieces }
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
      const { from_date, to_date, item_id, employee_id } = decoded.data;
      var datediff = '', item = '';
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
        const Specific_Employee_Result = await client.query(`select distinct a.employee_id,a.completed_date,b.employee_name,b.employee_code,a.machine_id,d.machine_no,a.design_id,f.qr_code as design_no,a.item_id,c.item_name,a.color_id,h.color_name,a.number_set,a.total_pieces,a.rate,a.total_amount,a.job_id,a.job_date from tbl_job_details as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id  inner join tbl_machine as d on a.machine_id = d.machine_id left join tbl_item_sizes as f on f.size_id = a.design_id left join tbl_color as h on a.color_id =  h.color_id where a.employee_id = ` + employee_id + ` and ` + item + ` and ` + datediff + ` and a.salary_status_id = 2`);

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
    z
  } catch (error) {
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
      const { } = decoded.data;
      if (decoded) {
        const Pending_List = await client.query(`select a.job_id,a.job_date,a.employee_id,b.employee_name,b.employee_code,a.machine_id,c.machine_no,a.design_id,d.qr_code as design_no,a.jobtype_id,e.jobtype_name from tbl_job_details as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_machine as c on a.machine_id = c.machine_id left join tbl_item_sizes as d on a.design_id = d.size_id inner join tbl_def_jobtype as e on a.jobtype_id = e.jobtype_id where a.status_id = 4`);

        var Pending_Array = Pending_List && Pending_List.rows ? Pending_List.rows : []

        responseData = { "PendingJobList": Pending_Array }
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
module.exports.pendingOrderReportListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
    z
  } catch (error) {
    throw new Error(error);
  }
}
//create Pending List
module.exports.pendingOrderReportList = async (req) => {
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
      const { user_id, size_id, customer_code, from_date, to_date, limit, offset, process, agent_code } = decoded.data;
      if (decoded) {
        let datediff = '1=1';
        let order_datediff = '1=1';
        let get_limit = '';
        if (from_date && to_date) {
          datediff = `to_char(a.order_date,'YYYY-MM-DD') :: date BETWEEN `
            .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
          order_datediff = `to_char(order_date,'YYYY-MM-DD') :: date BETWEEN `
            .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
        }
        let sizeid_val = '1=1';
        let dis_sizeid_val = '1=1';
        let agentcode = '1=1'
        let dis_agentcode = '1=1'
        if (size_id && size_id != "" && size_id != "0") {
          const size_id_val = size_id ? '\'' + size_id.split(',').join('\',\'') + '\'' : ''
          sizeid_val = ` b.size_id in (${size_id_val})`
          dis_sizeid_val = ` a.size_id in (${size_id_val})`
        }
        let customercode_val = '1=1';
        let dis_customercode_val = '1=1';
        if (customer_code && customer_code != "" && customer_code != "0") {
          const customer_code_val = customer_code ? '\'' + customer_code.split(',').join('\',\'') + '\'' : ''
          // customercode_val = `  lower(a.customer_code) = lower(${customer_code_val})`
          customercode_val = `  a.customer_code in (${customer_code_val})`
          dis_customercode_val = `  a.customer_code in (${customer_code_val})`
        }
        if (agent_code && agent_code != "" && agent_code != "0") {
          const agent_code_val = Number(agent_code)
          agentcode = `e.agent_code = ` + agent_code_val + ` `
          dis_agentcode = `e.agent_code = ` + agent_code_val + ` `
        }
        
        // const overallOrderTotal = await client.query(`SELECT SUM(dispatch_set) as dispatch_set, sum(dispatch_piece) as dispatch_piece FROM ( select c.item_code, a.size_id, SUM(a.dispatch_set) as dispatch_set,SUM((a.dispatch_set :: INTEGER * b.total_set :: INTEGER)) as dispatch_piece from tbl_dispatch_details as a inner join tbl_item_sizes as b on b.size_id=a.size_id                 inner join tbl_item_management as c on b.trans_no=c.trans_no inner join tbl_customer as e on e.customer_code =a.customer_code inner join tbl_order_taking as d on d.order_no = a.order_no where ${order_datediff} and ${customercode_val} and ${sizeid_val} and ${agentcode} group by c.item_code,a.size_id, a.dispatch_set,b.total_set order by c.item_code ) as dev inner join tbl_def_item as e on dev.item_code = e.item_id`);
        const Order_Pieces_Total = await client.query(`SELECT sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code
      where ${order_datediff} and ${customercode_val} and ${sizeid_val}  and ${dis_agentcode} and a.status_code = 1`)

      const Order_Set_Total = await client.query(`SELECT sum(b.qty) as qty FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON 
      c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner 
      join tbl_customer as e ON e.customer_code = a.customer_code where ${order_datediff} and ${customercode_val} and ${sizeid_val}  and ${dis_agentcode} and a.status_code = 1`)
        const Dispatch_Set_Total = await client.query(`SELECT sum(dispatch_set) as dispatch_set from tbl_dispatch_details as b inner join tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code where status_flag = 1 and ${datediff} and ${customercode_val} and ${sizeid_val}  and ${dis_agentcode} and a.status_code = 1`) 

        const Dispatch_Pieces_Total = await client.query(`SELECT sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code where status_flag = 1 and ${datediff} and ${customercode_val} and ${sizeid_val}  and ${dis_agentcode} and a.status_code = 1`) 
        var order_total = Order_Set_Total && Order_Set_Total.rows[0].qty ? Order_Set_Total.rows[0].qty : 0
        var order_total_pieces = Order_Pieces_Total && Order_Pieces_Total.rows[0].order_pieces ? Order_Pieces_Total.rows[0].order_pieces : 0

        var dipatch_total = Dispatch_Set_Total && Dispatch_Set_Total.rows[0].dispatch_set ? Dispatch_Set_Total.rows[0].dispatch_set : 0
        var dipatch_total_pieces = Dispatch_Pieces_Total && Dispatch_Pieces_Total.rows[0].dispatch_pieces ? Dispatch_Pieces_Total.rows[0].dispatch_pieces : 0
        var overallPendingTotal_sets = Number(order_total) - Number(dipatch_total)
        var overallPendingTotal_Pieces = Number(order_total_pieces) - Number(dipatch_total_pieces)
        const overallOrderTotal = await client.query(`SELECT SUM(order_set) as order_set, sum(order_piece) as order_piece FROM ( select d.item_code, b.size_id, SUM(b.qty) as order_set,SUM((b.qty :: INTEGER * c.total_set :: INTEGER)) as order_piece from tbl_order_taking as a inner join tbl_order_taking_items as b on b.order_no = a.order_no inner join tbl_item_sizes as c on c.size_id=b.size_id inner join tbl_item_management as d on c.trans_no=d.trans_no inner join tbl_customer as e on e.customer_code =a.customer_code where ${order_datediff} and ${customercode_val}  and ${sizeid_val}  and ${dis_agentcode} group by d.item_code,b.size_id, b.qty,c.total_set order by d.item_code ) as dev inner join tbl_def_item as e on dev.item_code = e.item_id`)
        var overallTotal_sets = overallOrderTotal && overallOrderTotal.rows[0].order_set ? overallOrderTotal.rows[0].order_set : 0
        var overallTotal_Pieces = overallOrderTotal && overallOrderTotal.rows[0].order_piece ? overallOrderTotal.rows[0].order_piece : 0
        
        const overallPendingTotal = await client.query(`SELECT sum(pending_set) as pending_set,
        sum(pending_pieces) as pending_pieces FROM (SELECT d.item_code,b.size_id,sum(qty) - coalesce(f.dispatchset, 0 ) as pending_set,(sum(qty) * sum(c.total_set :: INTEGER)) - coalesce(f.dispatch_pieces, 0 ) as pending_pieces from  tbl_order_taking as a  inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join (SELECT customer_code,size_id,order_no, dispatchset ,total_set, dispatchset * total_set as dispatch_pieces from (SELECT customer_code,a.size_id,order_no,sum(dispatch_set) as dispatchset,(total_set :: INTEGER) as total_set from tbl_dispatch_details as a inner join tbl_item_sizes as b on b.size_id=a.size_id where  a.status_flag = 1 and ${dis_customercode_val} and ${dis_sizeid_val} group by order_no,a.size_id,customer_code,total_set order by order_no)
        as t1) as f on f.order_no = a.order_no and f.size_id = b.size_id where  ${datediff} and ${customercode_val} and ${sizeid_val} and ${agentcode} group by d.item_code,b.size_id,f.dispatchset,f.dispatch_pieces) as dev where (pending_set) > 0 `)
        // var overallPendingTotal_sets = overallPendingTotal && overallPendingTotal.rows[0].pending_set ? overallPendingTotal.rows[0].pending_set : 0
        // var overallPendingTotal_Pieces = overallPendingTotal && overallPendingTotal.rows[0].pending_pieces ? overallPendingTotal.rows[0].pending_pieces : 0
        // const dispatchWidget = await client.query(`SELECT item_name,item_id,SUM(dispatch_set) as dispatch_set, sum(dispatch_piece) as dispatch_piece FROM ( select c.item_code, a.size_id, SUM(a.dispatch_set) as dispatch_set,SUM((a.dispatch_set :: INTEGER * b.total_set :: INTEGER)) as dispatch_piece  from tbl_dispatch_details as a inner join tbl_item_sizes as b on b.size_id=a.size_id  inner join tbl_item_management as c on b.trans_no=c.trans_no inner join tbl_customer as e on e.customer_code =a.customer_code inner join tbl_order_taking as d on d.order_no = a.order_no
        //    where ${order_datediff} and ${customercode_val} and ${sizeid_val} and ${agentcode}
        //    group by c.item_code,a.size_id, a.dispatch_set,b.total_set order by c.item_code ) as dev inner join 
        //   tbl_def_item as e on dev.item_code = e.item_id group by item_name,item_id order by item_id`)
          // const dispatchWidget = await client.query(` SELECT item_name,item_id,SUM(pending_set) as pending_set, sum(pending_pieces) as pending_pieces  FROM (SELECT d.item_code,b.size_id,sum(qty) - coalesce(f.dispatchset, 0 ) as pending_set,(sum(qty) * sum(c.total_set :: INTEGER)) - coalesce(f.dispatch_pieces, 0 ) as pending_pieces from  tbl_order_taking as a  inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join (SELECT customer_code,size_id,order_no, dispatchset ,total_set, dispatchset * total_set as dispatch_pieces from (SELECT customer_code,a.size_id,order_no,sum(dispatch_set) as dispatchset,(total_set :: INTEGER) as total_set from tbl_dispatch_details as a inner join tbl_item_sizes as b on b.size_id=a.size_id where  a.status_flag = 1 and ${dis_customercode_val} and ${dis_sizeid_val} group by order_no,a.size_id,customer_code,total_set order by order_no) as t1) as f on f.order_no = a.order_no and f.size_id = b.size_id where  ${datediff} and ${customercode_val} and ${sizeid_val} and ${agentcode} group by d.item_code,b.size_id,f.dispatchset,f.dispatch_pieces) as dev inner join tbl_def_item as e on dev.item_code = e.item_id  where (pending_set) > 0 group by item_name,item_id order by item_id`)
          const dispatchWidget = await client.query(`SELECT item_name,item_code,(qty-dispatch_set) as pending_set,(order_pieces-dispatch_pieces) as pending_pieces from (SELECT item_code, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT d.item_code,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON         c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner             join tbl_customer as e ON e.customer_code = a.customer_code where ${order_datediff} and ${customercode_val} and ${sizeid_val}  and ${dis_agentcode} and a.status_code = 1 group by d.item_code
            union all
            SELECT d.item_code,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b 
            inner join tbl_order_taking as a on a.order_no = b.order_no inner join 
            tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on 
            d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code 
            where status_flag = 1 and ${datediff} and ${customercode_val} and ${sizeid_val}  and ${dis_agentcode} and a.status_code = 1 group by d.item_code) as dev group by item_code
              ) as d1 inner join tbl_def_item as f on d1.item_code = f.item_id  where (qty-dispatch_set) > 0`)
        var dispatch_Widget = dispatchWidget && dispatchWidget.rows ? dispatchWidget.rows : []
        if (process != 'print') {
          get_limit = `LIMIT ${limit} OFFSET ${offset}`;
        }
        if (process == 'print') {
          const Pending_List = await client.query(`SELECT order_no,to_char(order_date,'DD-MM-YYYY') as order_date,customer_code,size_id,qr_code,dispatchset,dispatch_pieces,order_qty,order_pieces,(order_qty -  dispatchset) as pending_set,(order_pieces -  dispatch_pieces) as pending_pieces,
          customer_name,mobile_no,city FROM (SELECT a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,coalesce(f.dispatchset, 0 ) as dispatchset,sum(qty) as order_qty,sum(qty) * sum(c.total_set :: INTEGER) as order_pieces,e.customer_name,e.mobile_no, coalesce(e.city,'')||' - '|| 
          coalesce(e.pincode,'') as city,coalesce(f.dispatch_pieces, 0 ) as dispatch_pieces from             tbl_order_taking as a  inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join (SELECT customer_code,size_id,order_no, dispatchset ,total_set, dispatchset * total_set as
          dispatch_pieces from (SELECT customer_code,a.size_id,order_no,sum(dispatch_set) as 
          dispatchset,(total_set :: INTEGER) as total_set from tbl_dispatch_details as a inner join 
           tbl_item_sizes as b on b.size_id=a.size_id where  a.status_flag = 1 and 
           ${dis_customercode_val} and ${dis_sizeid_val} group by order_no,a.size_id,customer_code,total_set order by order_no)  as t1) as f on f.order_no = a.order_no and f.customer_code = a.customer_code and f.size_id = b.size_id where a.status_code = 1 and ${datediff} and ${customercode_val} and ${sizeid_val} and ${agentcode} group by a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,f.dispatchset,f.dispatch_pieces,e.customer_name,e.mobile_no,e.city,e.pincode,c.total_set order by a.order_date ) as dev where (order_qty -  dispatchset) > 0 `);
          let Pending_Array = Pending_List && Pending_List.rows ? Pending_List.rows : [];
          const company_Result = await client.query(`SELECT * from tbl_print_setting`);
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];
          responseData = { "PendingOrderList": Pending_Array, "Company_Array": Company_Array, "overallTotal_sets": overallPendingTotal_sets, "overallTotal_Pieces": overallPendingTotal_Pieces, "dispatchWidget": dispatch_Widget, "overallPendingTotal_sets": overallTotal_sets, "overallPendingTotal_Pieces": overallTotal_Pieces  }
        } else {
          const total_pending_order = await client.query(`SELECT order_no,to_char(order_date,'DD-MM-YYYY') as order_date,customer_code,size_id,qr_code,dispatchset,dispatch_pieces,order_qty,order_pieces,(order_qty -  dispatchset) as pending_set,(order_pieces -  dispatch_pieces) as pending_pieces,
          customer_name,mobile_no,city FROM (SELECT a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,coalesce(f.dispatchset, 0 ) as dispatchset,sum(qty) as order_qty,sum(qty) * sum(c.total_set :: INTEGER) as order_pieces,e.customer_name,e.mobile_no, coalesce(e.city,'')||' - '|| 
          coalesce(e.pincode,'') as city,coalesce(f.dispatch_pieces, 0 ) as dispatch_pieces from             tbl_order_taking as a  inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join (SELECT customer_code,size_id,order_no, dispatchset ,total_set, dispatchset * total_set as
          dispatch_pieces from (SELECT customer_code,a.size_id,order_no,sum(dispatch_set) as 
          dispatchset,(total_set :: INTEGER) as total_set from tbl_dispatch_details as a inner join 
           tbl_item_sizes as b on b.size_id=a.size_id where  a.status_flag = 1 and 
           ${dis_customercode_val} and ${dis_sizeid_val} group by order_no,a.size_id,customer_code,total_set order by order_no)  as t1) as f on f.order_no = a.order_no and f.customer_code = a.customer_code and f.size_id = b.size_id where a.status_code = 1 and ${datediff} and ${customercode_val} and ${sizeid_val} and ${agentcode} group by a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,f.dispatchset,f.dispatch_pieces,e.customer_name,e.mobile_no,e.city,e.pincode,c.total_set order by a.order_date ) as dev where (order_qty -  dispatchset) > 0`);
          var total_count = total_pending_order && total_pending_order.rowCount ? total_pending_order.rowCount : 0
          // const Pending_List = await client.query(`SELECT order_no,to_char(order_date,'DD-MM-YYYY') as order_date,customer_code,size_id,qr_code,dispatchset,order_qty,(order_qty -  dispatchset) as pending_set,customer_name,mobile_no,city FROM (SELECT a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,coalesce(f.dispatchset, 0 ) as dispatchset,sum(qty) as order_qty,e.customer_name,e.mobile_no, coalesce(e.city,'')||' - '|| coalesce(e.pincode,'') as city from tbl_order_taking as a  inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join  tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join (SELECT customer_code,size_id,order_no,sum(dispatch_set) as dispatchset from tbl_dispatch_details where status_flag = 1 and  ${dis_customercode_val} and ${dis_sizeid_val} group by order_no,size_id,customer_code order by order_no) as f on f.order_no = a.order_no and f.customer_code = a.customer_code and f.size_id = b.size_id where ${datediff} and ${customercode_val} and ${sizeid_val} and ${agentcode} group by a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,f.dispatchset,e.customer_name,e.mobile_no,e.city,e.pincode order by a.order_date ) as dev where (order_qty -  dispatchset) > 0 ${get_limit}`);
          const Pending_List = await client.query(`SELECT order_no,to_char(order_date,'DD-MM-YYYY') as order_date,customer_code,size_id,qr_code,dispatchset,dispatch_pieces,order_qty,order_pieces,(order_qty -  dispatchset) as pending_set,(order_pieces -  dispatch_pieces) as pending_pieces,
            customer_name,mobile_no,city FROM (SELECT a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,coalesce(f.dispatchset, 0 ) as dispatchset,sum(qty) as order_qty,sum(qty) * sum(c.total_set :: INTEGER) as order_pieces,e.customer_name,e.mobile_no, coalesce(e.city,'')||' - '|| 
            coalesce(e.pincode,'') as city,coalesce(f.dispatch_pieces, 0 ) as dispatch_pieces from             tbl_order_taking as a  inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join (SELECT customer_code,size_id,order_no, dispatchset ,total_set, dispatchset * total_set as
            dispatch_pieces from (SELECT customer_code,a.size_id,order_no,sum(dispatch_set) as 
            dispatchset,(total_set :: INTEGER) as total_set from tbl_dispatch_details as a inner join 
             tbl_item_sizes as b on b.size_id=a.size_id where  a.status_flag = 1 and 
             ${dis_customercode_val} and ${dis_sizeid_val} group by order_no,a.size_id,customer_code,total_set order by order_no)  as t1) as f on f.order_no = a.order_no and f.customer_code = a.customer_code and f.size_id = b.size_id where  a.status_code = 1 and ${datediff} and ${customercode_val} and ${sizeid_val} and ${agentcode} group by a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,f.dispatchset,f.dispatch_pieces,e.customer_name,e.mobile_no,e.city,e.pincode,c.total_set order by a.order_date ) as dev where (order_qty -  dispatchset) > 0 ${get_limit}`)

          var Pending_Array = Pending_List && Pending_List.rows ? Pending_List.rows : []

          responseData = { "PendingOrderList": Pending_Array, "total_count": total_count, "overallTotal_sets": overallPendingTotal_sets, "overallTotal_Pieces": overallPendingTotal_Pieces, "dispatchWidget": dispatch_Widget, "overallPendingTotal_sets": overallTotal_sets, "overallPendingTotal_Pieces": overallTotal_Pieces }
        }

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
module.exports.pendingOrderDropdownjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
    z
  } catch (error) {
    throw new Error(error);
  }
}
//create Pending List
module.exports.pendingOrderDropdown = async (req) => {
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
      const { user_id } = decoded.data;
      if (decoded) {

        const Pending_Customer_List = await client.query(`SELECT 'All' as label,'0' as value
            UNION ALL SELECT  distinct customer_name || '-'|| mobile_no as label , customer_code as value FROM (SELECT order_no,to_char(order_date,'DD-MM-YYYY') as order_date,customer_code,size_id,qr_code,dispatchset,order_qty,(order_qty -  dispatchset) as pending_set,customer_name,mobile_no,city FROM (SELECT a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,coalesce(f.dispatchset, 0 ) as dispatchset,sum(qty) as order_qty,e.customer_name,e.mobile_no, coalesce(e.city,'')||' - '|| coalesce(e.pincode,'') as city from tbl_order_taking as a  inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join  tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join (SELECT customer_code,size_id,order_no,sum(dispatch_set) as dispatchset from tbl_dispatch_details where status_flag = 1  group by order_no,size_id,customer_code order by order_no) as f on f.order_no = a.order_no and f.customer_code = a.customer_code and f.size_id = b.size_id group by a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,f.dispatchset,e.customer_name,e.mobile_no,e.city,e.pincode order by a.order_date ) as dev where (order_qty -  dispatchset) > 0) as dev1 ` );
        const Pending_Design_List = await client.query(`SELECT 'All' as label,'0' as value
            UNION ALL SELECT  distinct qr_code as label , size_id as value FROM (SELECT order_no,to_char(order_date,'DD-MM-YYYY') as order_date,customer_code,size_id,qr_code,dispatchset,order_qty,(order_qty -  dispatchset) as pending_set,customer_name,mobile_no,city FROM (SELECT a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,coalesce(f.dispatchset, 0 ) as dispatchset,sum(qty) as order_qty,e.customer_name,e.mobile_no, coalesce(e.city,'')||' - '|| coalesce(e.pincode,'') as city from tbl_order_taking as a  inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join  tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join (SELECT customer_code,size_id,order_no,sum(dispatch_set) as dispatchset from tbl_dispatch_details where status_flag = 1  group by order_no,size_id,customer_code order by order_no) as f on f.order_no = a.order_no and f.customer_code = a.customer_code and f.size_id = b.size_id group by a.order_no,a.order_date,a.customer_code,b.size_id,c.qr_code,f.dispatchset,e.customer_name,e.mobile_no,e.city,e.pincode order by a.order_date ) as dev where (order_qty -  dispatchset) > 0) as dev1 ` );
        const Pending_Agent_List = await client.query(`SELECT 'All' as label,'0' as value  UNION ALL 
            SELECT distinct agent_name as label , agent_code as value FROM (SELECT agent_code,agent_name,order_no,to_char(order_date,'DD-MM-YYYY') as order_date,customer_code,size_id,qr_code,dispatchset,order_qty,(order_qty -  dispatchset) as pending_set,customer_name,mobile_no,city FROM (SELECT e.agent_code,g.agent_name,a.order_no,a.order_date,a.customer_code,b.size_id,
            c.qr_code,coalesce(f.dispatchset, 0 ) as dispatchset,sum(qty) as order_qty,e.customer_name,e.mobile_no,coalesce(e.city,'')||' - '|| coalesce(e.pincode,'') as city from tbl_order_taking as a  inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c 
            ON c.size_id = b.size_id inner join  tbl_item_management as d on d.trans_no=c.trans_no 
            inner join tbl_customer as e ON e.customer_code = a.customer_code inner join tbl_agent as 
            g on g.agent_code = e.agent_code left join (SELECT customer_code,size_id,order_no,sum(dispatch_set) as dispatchset from tbl_dispatch_details where status_flag = 1  group by order_no,size_id,customer_code order by order_no) as f on f.order_no = a.order_no and f.customer_code = a.customer_code and f.size_id = b.size_id group by a.order_no,a.order_date,e.agent_code,g.agent_name,a.customer_code,b.size_id,c.qr_code,f.dispatchset,e.customer_name,e.mobile_no,e.city,e.pincode order by a.order_date )	as dev where (order_qty -  dispatchset) > 0) as dev1`)


        var Pending_Array = Pending_Customer_List && Pending_Customer_List.rows ? Pending_Customer_List.rows : []
        var Pending_Design_Array = Pending_Design_List && Pending_Design_List.rows ? Pending_Design_List.rows : []
        var Pending_Agent_Array = Pending_Agent_List && Pending_Agent_List.rows ? Pending_Agent_List.rows : []

        responseData = { "Pending_Customer_OrderList": Pending_Array, "Pending_Design_OrderList": Pending_Design_Array, "Pending_agent_list": Pending_Agent_Array }


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
//

//create DashBoard List jwt 
module.exports.dashboardListJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create DashBoard List
module.exports.dashboardList = async (req) => {
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
      const { date } = decoded.data;
      if (decoded) {

        const total_order = await client.query(`SELECT coalesce(sum(qty),0) as totalset,coalesce(sum(qty*coalesce(c.total_set,'0')::Integer),0) as totalpiece FROM tbl_order_taking as a inner join tbl_order_taking_items 
        as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 1`);

        const total_order_all = await client.query(`SELECT count(*) as total_order FROM tbl_order_taking as a where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') `);

        const total_Cancelled_order = await client.query(`SELECT count(*)  as total_cancel_order FROM tbl_order_taking as a where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 2 `);

        const current_Stock = await client.query(`SELECT item_name,item_id,coalesce(sum(current_pieces),0) as current_pieces,coalesce(sum(current_set),0) as current_set,count(item_id) as count from (select d.item_code,coalesce(coalesce(sum(coalesce(no_of_set,0)) +  COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = a.size_id ),0),0) - coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(COALESCE(sum(coalesce(no_of_pieces,0)) +  COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return where status_flag = 1 AND  size_id = a.size_id ),0),0) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a inner join tbl_item_sizes as c on c.size_id=a.size_id
        inner join tbl_item_management as d on c.trans_no=d.trans_no 
        left join tbl_color as f on f.color_id =c.color_id group by d.item_code,a.size_id order by d.item_code ) as dev right join tbl_def_item as
        e on dev.item_code = e.item_id  group by item_name,item_id order by item_id`);

        const total_cancelled_set_order = await client.query(`SELECT coalesce(sum(qty),0) as totalset,coalesce(sum(qty*coalesce(c.total_set,'0')::Integer),0) as totalpiece FROM tbl_order_taking as a inner join tbl_order_taking_items 
        as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 2`);

        const total_count_fg = await client.query(`SELECT count(fg_id) as count FROM tbl_fg_items where date = to_date('` + date + `','YYYY-MM-DD')`);

        // const top_five_customer_wise_order = await client.query(`SELECT * FROM (SELECT count(a.order_no) as order_count,a.customer_code,c.customer_name,c.city,c.mobile_no FROM tbl_order_taking as a          inner join tbl_customer as c on a.customer_code = c.customer_code where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 1
        // group by a.customer_code,c.customer_name,c.city,c.mobile_no ) as dev order by order_count 
        // desc limit 5`);
        const top_five_customer_wise_order = await client.query(`SELECT sum(order_count) as order_count,sum(order_set) as order_set,sum(order_piece) as order_piece,customer_code,customer_name,city,mobile_no
        FROM (SELECT (SELECT count(order_no) from tbl_order_taking where order_no = a.order_no )               as order_count,sum(b.qty) as order_set,SUM((b.qty :: INTEGER * d.total_set :: INTEGER)) as order_piece
         ,a.customer_code,c.customer_name,c.city,c.mobile_no FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as d on b.size_id = d.size_id inner join tbl_customer as c on a.customer_code = c.customer_code where                 to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and                 a.status_code = 1 group by a.order_no,a.customer_code,c.customer_name,c.city,c.mobile_no ) as dev     group by customer_code,customer_name,city,mobile_no order by order_piece desc limit 5`)

        const least_five_customer_wise_order = await client.query(`SELECT sum(order_count) as order_count,sum(order_set) as order_set,sum(order_piece) as order_piece,customer_code,customer_name,city,mobile_no
        FROM (SELECT (SELECT count(order_no) from tbl_order_taking where order_no = a.order_no )               as order_count,sum(b.qty) as order_set,SUM((b.qty :: INTEGER * d.total_set :: INTEGER)) as order_piece
         ,a.customer_code,c.customer_name,c.city,c.mobile_no FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as d on b.size_id = d.size_id inner join tbl_customer as c on a.customer_code = c.customer_code where                 to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and                 a.status_code = 1 group by a.order_no,a.customer_code,c.customer_name,c.city,c.mobile_no ) as dev     group by customer_code,customer_name,city,mobile_no order by order_piece asc limit 5`)

        const top_five_item_wise_order = await client.query(`SELECT * FROM (SELECT sum(b.qty) as order_set,
        SUM((b.qty :: INTEGER * c.total_set :: INTEGER)) as order_piece,b.size_id,c.qr_code FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c on b.size_id = c.size_id where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 1 group by b.size_id,c.qr_code ) as dev order by order_piece desc limit 5`);

        const least_five_item_wise_order = await client.query(`SELECT * FROM (SELECT sum(b.qty) as order_set,
        SUM((b.qty :: INTEGER * c.total_set :: INTEGER)) as order_piece,b.size_id,c.qr_code FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c on b.size_id = c.size_id where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 1 group by b.size_id,c.qr_code ) as dev order by order_piece asc limit 5`);

        // const top_five_agent_wise_order = await client.query(`SELECT * FROM (SELECT count(a.order_no) as order_count,c.agent_code,d.agent_name FROM tbl_order_taking as a inner join tbl_customer as c on a.customer_code = c.customer_code inner join tbl_agent as d on c.agent_code = d.agent_code
        // where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 1 group by c.agent_code,d.agent_name ) as dev order by order_count desc limit 2`);
        const top_five_agent_wise_order = await client.query(`SELECT sum(order_count) as order_count,sum(order_set) as order_set,sum(order_piece) as order_piece,
        agent_code, agent_name  FROM (SELECT (SELECT count(order_no) from tbl_order_taking where order_no = a.order_no ) as order_count,sum(b.qty) as order_set, SUM((b.qty :: INTEGER * e.total_set :: INTEGER)) as order_piece,c.agent_code,d.agent_name FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as e on b.size_id = e.size_id                inner join tbl_customer as c on a.customer_code = c.customer_code inner join tbl_agent as d on c.agent_code = d.agent_code where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 1 group by a.order_no,c.agent_code,d.agent_name ) as dev
        group by agent_code,agent_name order by order_piece desc limit 2`)

        // const least_five_agent_wise_order = await client.query(`SELECT * FROM (SELECT count(a.order_no) as order_count,c.agent_code,d.agent_name FROM tbl_order_taking as a inner join tbl_customer as c on a.customer_code = c.customer_code inner join tbl_agent as d on c.agent_code = d.agent_code
        // where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 1 group by c.agent_code,d.agent_name ) as dev order by order_count asc limit 2`)

        const least_five_agent_wise_order = await client.query(`SELECT sum(order_count) as order_count,sum(order_set) as order_set,sum(order_piece) as order_piece,
        agent_code, agent_name  FROM (SELECT (SELECT count(order_no) from tbl_order_taking where order_no = a.order_no ) as order_count,sum(b.qty) as order_set, SUM((b.qty :: INTEGER * e.total_set :: INTEGER)) as order_piece,c.agent_code,d.agent_name FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as e on b.size_id = e.size_id                inner join tbl_customer as c on a.customer_code = c.customer_code inner join tbl_agent as d on c.agent_code = d.agent_code where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 1 group by a.order_no,c.agent_code,d.agent_name ) as dev
        group by agent_code,agent_name order by order_piece asc limit 2`)


        const total_dispatch= await  client.query(`SELECT coalesce(sum(dispatch_set),0) as totalset,coalesce(sum(dispatch_pieces),0) as totalpiece from tbl_dispatch_details where status_flag = 1 and to_char(dispatch_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD')`);

        const total_Count_dispatch= await  client.query(`SELECT count(dispatch_id) as count from tbl_dispatch_details where status_flag = 1 and to_char(dispatch_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD')`);

        const total_Cancel_Count_dispatch= await  client.query(`SELECT count(dispatch_id) as count from tbl_dispatch_details where status_flag = 2 and to_char(dispatch_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD')`);

        const total_cancelled_dispatch= await  client.query(`SELECT coalesce(sum(dispatch_set),0) as totalset,coalesce(sum(dispatch_pieces),0) as totalpiece from tbl_dispatch_details where status_flag = 2 and to_char(dispatch_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD')`);

        const total_ready_dispatch_set= await  client.query(`SELECT item_name,item_code,COALESCE(SUM(pending_set),0) AS ready_set ,
        COALESCE(SUM(pending_pieces),0) AS ready_pieces FROM
        (SELECT size_id,item_code,SUM(qty) AS qty,SUM(order_pieces) AS order_pieces,SUM(dispatch_set) AS dispatch_set,
        SUM(dispatch_pieces) AS dispatch_pieces,(SUM(qty) - SUM(dispatch_set)) AS pending_set,
        (SUM(order_pieces) - SUM(dispatch_pieces)) AS pending_pieces,COALESCE(COALESCE((SELECT SUM(no_of_set) FROM  tbl_fg_items WHERE size_id = t.size_id ),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = t.size_id ),0),0) AS fg_set,COALESCE(COALESCE((SELECT SUM(no_of_pieces) FROM tbl_fg_items WHERE size_id = t.size_id ),0) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return where status_flag = 1 AND  size_id = t.size_id ),0),0) AS fg_pieces FROM (SELECT b.size_id,d.item_code,SUM(b.qty) AS qty,SUM(qty*COALESCE(c.total_set,'0')::Integer) AS order_pieces,0 AS dispatch_set, 0 AS dispatch_pieces FROM tbl_order_taking AS a INNER JOIN tbl_order_taking_items 
        AS b ON a.order_no =b.order_no INNER JOIN tbl_item_sizes AS c  ON c.size_id = b.size_id 
        INNER JOIN tbl_item_management AS d ON d.trans_no=c.trans_no GROUP BY b.size_id,d.item_code
        UNION ALL
        SELECT b.size_id,d.item_code,0 AS qty, 0 AS order_pieces,SUM(dispatch_set) AS dispatch_set,
        SUM(dispatch_pieces) AS dispatch_pieces FROM tbl_dispatch_details AS b INNER JOIN             
        tbl_order_taking AS a ON a.order_no = b.order_no INNER JOIN tbl_item_sizes AS c ON c.size_id = 
        b.size_id INNER JOIN tbl_item_management AS d ON d.trans_no=c.trans_no 
        WHERE status_flag = 1 AND a.status_code = 1 GROUP BY b.size_id,d.item_code) AS t GROUP BY size_id,item_code) 
        AS derv INNER JOIN tbl_def_item AS df ON df.item_id = derv.item_code WHERE pending_set > 0 AND 
        ((fg_set) - (dispatch_set)) >= pending_set GROUP BY item_name,item_code ORDER BY item_code`);

        const total_Ready_dispatch_set= await  client.query(`SELECT COALESCE(SUM(pending_set),0) AS ready_set ,COALESCE(SUM(pending_pieces),0) AS ready_pieces FROM
        (SELECT size_id,item_code,SUM(qty) AS qty,SUM(order_pieces) AS order_pieces,SUM(dispatch_set) AS dispatch_set,
        SUM(dispatch_pieces) AS dispatch_pieces,(SUM(qty) - SUM(dispatch_set)) AS pending_set,
        (SUM(order_pieces) - SUM(dispatch_pieces)) AS pending_pieces,COALESCE(COALESCE((SELECT SUM(no_of_set) FROM tbl_fg_items WHERE size_id = t.size_id ),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = t.size_id ),0),0) AS fg_set,COALESCE(COALESCE((SELECT SUM(no_of_pieces) FROM tbl_fg_items WHERE size_id = t.size_id ),0) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return where status_flag = 1 AND  size_id = t.size_id ),0),0) AS fg_pieces FROM (SELECT b.size_id,d.item_code,SUM(b.qty) AS qty,SUM(qty*COALESCE(c.total_set,'0')::Integer) AS order_pieces,0 AS dispatch_set, 0 AS dispatch_pieces FROM tbl_order_taking AS a INNER JOIN tbl_order_taking_items 
        AS b ON a.order_no =b.order_no INNER JOIN tbl_item_sizes AS c  ON c.size_id = b.size_id 
        INNER JOIN tbl_item_management AS d ON d.trans_no=c.trans_no GROUP BY b.size_id,d.item_code
        UNION ALL
        SELECT b.size_id,d.item_code,0 AS qty, 0 AS order_pieces,SUM(dispatch_set) AS dispatch_set,
        SUM(dispatch_pieces) AS dispatch_pieces FROM tbl_dispatch_details AS b INNER JOIN             
        tbl_order_taking AS a ON a.order_no = b.order_no INNER JOIN tbl_item_sizes AS c ON c.size_id = 
        b.size_id INNER JOIN tbl_item_management AS d ON d.trans_no=c.trans_no 
        WHERE status_flag = 1 AND a.status_code = 1 GROUP BY b.size_id,d.item_code) AS t GROUP BY size_id,item_code) 
        AS derv INNER JOIN tbl_def_item AS df ON df.item_id = derv.item_code WHERE pending_set > 0 AND 
        ((fg_set) - (dispatch_set)) >= pending_set`);

        const total_fg = await client.query(`SELECT coalesce(sum(no_of_set),0) as totalset,coalesce(sum(no_of_pieces),0) as totalpiece FROM tbl_fg_items where to_char(date,'YYYY-MM-DD') :: date = 
        to_date('` + date + `','YYYY-MM-DD') `);

        const totalCount = await client.query(`select count(*) as total_job,sum(coalesce(number_set,0)) as total_set,sum(coalesce(total_pieces,0)) as total_piece from tbl_job_details where to_char(job_date,'YYYY-MM-DD') :: date =  to_char(CURRENT_DATE , 'YYYY-MM-DD') :: date`);

        const total_job = await client.query(`SELECT coalesce(sum(number_set),0) as total_set,
        coalesce(sum(total_pieces),0) as total_piece from tbl_job_details where to_char(job_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') `)

        const total_order_categorywise = await client.query(`SELECT item_id,INITCAP(item_name) as item_name,sum(qty) as totalset,sum(qty*coalesce(c.total_set,'0')::Integer) as totalpiece FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c 
        ON c.size_id = b.size_id inner join tbl_item_management as d on c.trans_no = d.trans_no
        inner join tbl_def_item as e on d.item_code = e.item_id where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_code = 1  group by item_id,item_name       
        `)
        
        const total_dispatch_categorywise = await client.query(`SELECT item_id,INITCAP(item_name) as item_name,
        coalesce(sum(dispatch_set),0) as totalset,coalesce(sum(dispatch_pieces),0) as totalpiece from  tbl_dispatch_details as a inner join tbl_item_sizes as b ON a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on c.item_code = d.item_id where to_char(dispatch_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and  a.status_flag = 1 group by item_id,item_name`)
        const total_fg_categorywise = await client.query(`SELECT item_id,INITCAP(item_name) as item_name,
        coalesce(sum(no_of_set),0) as totalset,coalesce(sum(no_of_pieces),0) as totalpiece 
        FROM tbl_fg_items as a inner join tbl_item_sizes as b ON a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on c.item_code = d.item_id where to_char(date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD')  group by item_id,item_name`)

        const total_jobCard_categorywise = await client.query(`SELECT d.item_id,INITCAP(item_name) as item_name,coalesce(sum(coalesce(number_set,0)),0) as total_set,coalesce(sum(coalesce(total_pieces,0)),0) as total_piece
        from tbl_job_details  as a inner join tbl_item_sizes as b ON a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on c.item_code = d.item_id where to_char(job_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') group by d.item_id,item_name`)

        const total_jobCard_Employeewise_Top = await client.query(`SELECT * FROM (SELECT a.employee_id, employee_name,sum(number_set) as set , sum(total_pieces) as 
        pieces FROM tbl_job_details AS a INNER JOIN tbl_employee_details AS b on a.employee_id = b.employee_id
        WHERE a.status_id = 3 AND to_char(a.completed_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') 
                 GROUP BY a.employee_id, employee_name) AS DERV ORDER BY pieces DESC limit 5`)

        const total_jobCard_Employeewise_Least = await client.query(`SELECT * FROM (SELECT a.employee_id, employee_name,sum(number_set) as set , sum(total_pieces) as 
        pieces FROM tbl_job_details AS a INNER JOIN tbl_employee_details AS b on a.employee_id = b.employee_id
        WHERE a.status_id = 3 AND to_char(a.completed_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') 
                GROUP BY a.employee_id, employee_name) AS DERV ORDER BY pieces ASC limit 5`)

        const pendingCount = await client.query(`select count(*) as pending_job,coalesce(sum(coalesce(number_set,0)),0) as total_set,coalesce(sum(coalesce(total_pieces,0)),0) as total_piece from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
        left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
        inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
        inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id where to_char(a.completed_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_id = 4`);

        const completedCount = await client.query(`select count(*) as completed_job,coalesce(sum(coalesce(number_set,0)),0) as total_set,coalesce(sum(coalesce(total_pieces,0)),0) as total_piece  from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
        left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
        inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
        inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id where to_char(a.completed_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') and a.status_id = 3`);

        const JobCardLeastCount = await client.query(`SELECT * FROM (SELECT sum(number_set) as job_set , sum(total_pieces) as 
        job_pieces,b.size_id,c.qr_code FROM 
                 tbl_job_details as b 
                 inner join tbl_item_sizes as c on b.size_id = c.size_id where to_char(b.completed_date,'YYYY-MM-DD') 
                 :: date = to_date('` + date + `','YYYY-MM-DD') and status_id = 3 group by b.size_id,c.qr_code ) 
                 as dev order by job_pieces asc limit 5`);

        const JobCardTopCount = await client.query(`SELECT * FROM (SELECT sum(number_set) as job_set , sum(total_pieces) as 
        job_pieces,b.size_id,c.qr_code FROM 
                tbl_job_details as b 
                inner join tbl_item_sizes as c on b.size_id = c.size_id where to_char(b.completed_date,'YYYY-MM-DD') 
                :: date = to_date('` + date + `','YYYY-MM-DD') and status_id = 3 group by b.size_id,c.qr_code ) 
                as dev order by job_pieces desc limit 5`);

         const JobCardCatagories= await client.query(`SELECT b.item_name,b.item_id,sum(number_set) as set , sum(total_pieces) as 
         pieces FROM tbl_job_details as a inner join tbl_def_item as b on a.item_id = b.item_id
         where to_char(completed_date,'YYYY-MM-DD') ::date = to_date('` + date + `','YYYY-MM-DD') AND status_id = 3 GROUP BY b.item_name,b.item_id`);

        var Total_Order = total_order && total_order.rows ? total_order.rows : [];
        var Total_Count_Fg = total_count_fg && total_count_fg.rows[0]['count'] ? total_count_fg.rows[0]['count'] : 0;

        var Overall_Total_Order = total_order_all && total_order_all.rows && total_order_all.rows[0].total_order ? total_order_all.rows[0].total_order : 0
        var Total_Cancel_Order = total_Cancelled_order && total_Cancelled_order.rows && total_Cancelled_order.rows[0].total_cancel_order ? total_Cancelled_order.rows[0].total_cancel_order : 0;
        
        var Total_Current_Stock_List = current_Stock && current_Stock.rows && current_Stock.rows ? current_Stock.rows : [];
        var Total_Cancellled_Set_Order = total_cancelled_set_order && total_cancelled_set_order.rows && total_cancelled_set_order.rows ? total_cancelled_set_order.rows : [];
        
        var TotalJobCardEmployeewiseTop = total_jobCard_Employeewise_Top && total_jobCard_Employeewise_Top.rows ? total_jobCard_Employeewise_Top.rows : []
        var TotalJobCardEmployeewiseLeast = total_jobCard_Employeewise_Least && total_jobCard_Employeewise_Least.rows ? total_jobCard_Employeewise_Least.rows : []

        var TopFive_customerwiseOrder = top_five_customer_wise_order && top_five_customer_wise_order.rows ? top_five_customer_wise_order.rows : []
        var JobCardLeastTooltip = JobCardLeastCount && JobCardLeastCount.rows ? JobCardLeastCount.rows : []
        var JobCardTopTooltip = JobCardTopCount && JobCardTopCount.rows ? JobCardTopCount.rows : []
        var JobCardCatagoriesList = JobCardCatagories && JobCardCatagories.rows ? JobCardCatagories.rows : []

        // result = []; 
        // if (TopFive_customerwiseOrder.length > 0) {
        //   for (let i = 0; i < TopFive_customerwiseOrder.length; i++) {
        //     const item_Result = await client.query(`SELECT a.customer_code,sum(b.qty) as order_set,
        //     SUM((b.qty :: INTEGER * d.total_set :: INTEGER)) as order_piece FROM tbl_order_taking as a        
        //     inner join tbl_order_taking_items as b on a.order_no = b.order_no     
        //     inner join tbl_item_sizes as d on b.size_id = d.size_id     
        //     inner join tbl_customer as c on a.customer_code = c.customer_code where 
        //     to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') 
        //     and a.status_code = 1 and a.customer_code = $1
        //    group by a.customer_code,c.customer_name,c.city,c.mobile_no `,[TopFive_customerwiseOrder[i].customer_code] );
        //     let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
        //     let obj = TopFive_customerwiseOrder[i]
        //     obj['order_set'] = item_Array[0].order_set
        //     obj['order_piece'] = item_Array[0].order_piece
        //     result.push(obj)
        //   }
        // }

        var Leastfive_customerwiseOrder = least_five_customer_wise_order && least_five_customer_wise_order.rows ? least_five_customer_wise_order.rows : []

        // leastresult = []; 
        // if (Leastfive_customerwiseOrder.length > 0) {
        //   for (let i = 0; i < Leastfive_customerwiseOrder.length; i++) {
        //     const item_Result = await client.query(`SELECT a.customer_code,sum(b.qty) as order_set,
        //     SUM((b.qty :: INTEGER * d.total_set :: INTEGER)) as order_piece FROM tbl_order_taking as a        
        //     inner join tbl_order_taking_items as b on a.order_no = b.order_no     
        //     inner join tbl_item_sizes as d on b.size_id = d.size_id     
        //     inner join tbl_customer as c on a.customer_code = c.customer_code where 
        //     to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD') 
        //     and a.status_code = 1 and a.customer_code = $1
        //    group by a.customer_code,c.customer_name,c.city,c.mobile_no `,[Leastfive_customerwiseOrder[i].customer_code] );
        //     let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
        //     let obj = Leastfive_customerwiseOrder[i]
        //     obj['order_set'] = item_Array[0].order_set
        //     obj['order_piece'] = item_Array[0].order_piece
        //     leastresult.push(obj)
        //   }
        // }

        var TopFive_itemWiseOrder = top_five_item_wise_order && top_five_item_wise_order.rows ? top_five_item_wise_order.rows : []
        var LeastFive_itemWiseOrder = least_five_item_wise_order && least_five_item_wise_order.rows ? least_five_item_wise_order.rows : []
        var TopFive_agentWiseOrder = top_five_agent_wise_order && top_five_agent_wise_order.rows ? top_five_agent_wise_order.rows : []

        // topagentresult = []; 
        // if (TopFive_agentWiseOrder.length > 0) {
        //   for (let i = 0; i < TopFive_agentWiseOrder.length; i++) {
        //     const item_Result = await client.query(`SELECT c.agent_code,sum(b.qty) as order_set, SUM((b.qty :: INTEGER * e.total_set :: INTEGER)) as order_piece FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as e on b.size_id = e.size_id  inner join tbl_customer as c on a.customer_code = c.customer_code inner join tbl_agent as d on c.agent_code = d.agent_code where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('2023-09-27','YYYY-MM-DD') and a.status_code = 1 and c.agent_code = $1 group by c.agent_code,d.agent_name `,[TopFive_agentWiseOrder[i].agent_code] );
        //     let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
        //     let obj = TopFive_agentWiseOrder[i]
        //     obj['order_set'] = item_Array[0].order_set
        //     obj['order_piece'] = item_Array[0].order_piece
        //     topagentresult.push(obj)
        //   }
        // }

        var LeastFive_agentWiseOrder = least_five_agent_wise_order && least_five_agent_wise_order.rows ? least_five_agent_wise_order.rows : []

        // leaseagentresult = []; 
        // if (LeastFive_agentWiseOrder.length > 0) {
        //   for (let i = 0; i < LeastFive_agentWiseOrder.length; i++) {
        //     const item_Result = await client.query(`SELECT c.agent_code,sum(b.qty) as order_set, SUM((b.qty :: INTEGER * e.total_set :: INTEGER)) as order_piece FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as e on b.size_id = e.size_id  inner join tbl_customer as c on a.customer_code = c.customer_code inner join tbl_agent as d on c.agent_code = d.agent_code where to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('2023-09-27','YYYY-MM-DD') and a.status_code = 1 and c.agent_code = $1 group by c.agent_code,d.agent_name `,[LeastFive_agentWiseOrder[i].agent_code] );
        //     let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
        //     let obj = LeastFive_agentWiseOrder[i]
        //     obj['order_set'] = item_Array[0].order_set
        //     obj['order_piece'] = item_Array[0].order_piece
        //     leaseagentresult.push(obj)
        //   }
        // }
        
        var Total_Dispatch = total_dispatch && total_dispatch.rows ? total_dispatch.rows : []
        var Total_Cancelled_Dispatch = total_cancelled_dispatch && total_cancelled_dispatch.rows ? total_cancelled_dispatch.rows : []
        var Total_Ready_Dispatch_Catagory = total_ready_dispatch_set && total_ready_dispatch_set.rows ? total_ready_dispatch_set.rows : []

        var Total_Ready_Dispatch = total_Ready_dispatch_set && total_Ready_dispatch_set.rows ? total_Ready_dispatch_set.rows : []

        var Total_Count_Dispatch = total_Count_dispatch && total_Count_dispatch.rows[0]['count'] ? total_Count_dispatch.rows[0]['count'] : []
        var Total_Cancel_Count_Dispatch = total_Cancel_Count_dispatch && total_Cancel_Count_dispatch.rows[0]['count'] ? total_Cancel_Count_dispatch.rows[0]['count'] : [];
        
        var Total_FG = total_fg && total_fg.rows ? total_fg.rows : []
        var Total_Job = total_job && total_job.rows ? total_job.rows : []
        var Total_Order_Category_Wise = total_order_categorywise && total_order_categorywise.rows ? total_order_categorywise.rows : []
        var Total_Dispatch_Category_Wise = total_dispatch_categorywise && total_dispatch_categorywise.rows ? total_dispatch_categorywise.rows : [] 
        var Total_Fg_Category_Wise = total_fg_categorywise && total_fg_categorywise.rows ? total_fg_categorywise.rows : [] 
        var Total_JobCard_Category_Wise = total_jobCard_categorywise && total_jobCard_categorywise.rows ? total_jobCard_categorywise.rows : [];

        var Pending_Job = pendingCount && pendingCount.rows[0].pending_job ? pendingCount.rows[0].pending_job : 0
        var Pending_Job_Set = pendingCount && pendingCount.rows[0].total_set ? pendingCount.rows[0].total_set : 0
        var Pending_Job_Pieces = pendingCount && pendingCount.rows[0].total_piece ? pendingCount.rows[0].total_piece : 0
        var Completed_Job = completedCount && completedCount.rows[0].completed_job ? completedCount.rows[0].completed_job : 0
        var Completed_Job_Set = completedCount && completedCount.rows[0].total_set ? completedCount.rows[0].total_set : 0
        var Completed_Job_Pieces = completedCount && completedCount.rows[0].total_piece ? completedCount.rows[0].total_piece : 0

        var responseTotalData = {"PendingJob": Pending_Job, "PendingJobSet": Pending_Job_Set, "PendingJobPiece": Pending_Job_Pieces, "CompletedJob": Completed_Job, "CompletedJobSet": Completed_Job_Set, "CompletedJobPiece": Completed_Job_Pieces}

        responseData = { "TotalOrder": Total_Order, "OverallTotalOrder" : Overall_Total_Order, "TotalCancelOrder": Total_Cancel_Order,
        "Total_Cancellled_Set_Order": Total_Cancellled_Set_Order, "TotalCurrentStockList":Total_Current_Stock_List, 
        "TotalCancelDispatch":Total_Cancel_Count_Dispatch,"TopFiveCustomerwiseOrder" : TopFive_customerwiseOrder, "LeastFiveCustomerwiseOrder": Leastfive_customerwiseOrder, "TotalCountDispatch": Total_Count_Dispatch, "TopFiveItemWiseOrder" : TopFive_itemWiseOrder, "LeastFiveItemWiseOrder": LeastFive_itemWiseOrder,  "TopFiveAgentWiseOrder" : TopFive_agentWiseOrder, "LeastFiveAgentWiseOrder": LeastFive_agentWiseOrder, "TotalDispatch": Total_Dispatch,"TotalCancelledDispatch":Total_Cancelled_Dispatch,  
        "TotalReadyDispatch":Total_Ready_Dispatch, "ReadyToDispatchCategory":Total_Ready_Dispatch_Catagory,"TotalFG": Total_FG,  "TotalJob": Total_Job, "TotalOrderCategorywise": Total_Order_Category_Wise, "TotalDispatchCategorywise" : Total_Dispatch_Category_Wise, "TotalFgCategorywise" :Total_Fg_Category_Wise, "TotalJobCardCategorywise" : Total_JobCard_Category_Wise, "TotalCountFG" : Total_Count_Fg, JobCardList: responseTotalData, "JobCardLeastTooltip": JobCardLeastTooltip, "JobCardTopTooltip": JobCardTopTooltip,   "JobCardCatagoriesList": JobCardCatagoriesList, "TotalJobCardEmployeewiseLeast": TotalJobCardEmployeewiseLeast, "TotalJobCardEmployeewiseTop": TotalJobCardEmployeewiseTop
       }
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