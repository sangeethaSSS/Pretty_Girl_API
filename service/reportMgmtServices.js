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
