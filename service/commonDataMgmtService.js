const commonService = require('../service/commonService')
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');

//create jwt 
module.exports.fetchcommonDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Fetch Commonlist
module.exports.fetchcommonData = async (req) => {
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
        const blood_Result = await client.query(`select group_id as value,group_name as label from tbl_def_blood_group where status_id = 1`);

        const state_Result = await client.query(`select state_id as value,state_name as label from tbl_def_state where status_id = 1`);

        const status_Result = await client.query(`select status_name as label,status_id as value from tbl_def_status`);

        const gender_Result = await client.query(`select gender_name as label,gender_id as value from tbl_def_gender where status_id = 1`);

        const employeecatery_Result = await client.query(`select category_id as value,category_name as label from tbl_def_employee_category where status_id = 1`);

        const userrole_Result = await client.query(`select userrole_id as value,userrole_name as label from tbl_def_userrole where status_id = 1`);

        const marital_Result = await client.query(`select marital_id as value,marital_name as label from tbl_def_marital_status where status_id = 1`);

        const jobtype_Result = await client.query(`select jobtype_id as value,jobtype_name as label from tbl_def_jobtype where status_id = 1`);

        const itemgroup_Result = await client.query(`select itemgroup_id as value,itemgroup_name as label from tbl_itemgroup where status_id = 1`);

        const designation_Result = await client.query(`select designation_id as value,designation_name as label from tbl_designation where status_id = 1`);

        const department_Result = await client.query(`select department_id as value,department_name as label from tbl_department where status_id = 1`);

        const design_Result = await client.query(`select design_id as value,design_no as label from tbl_design where status_id = 1`);

        const machine_Result = await client.query(`select machine_id as value,machine_no as label from tbl_machine where status_id = 1`);

        const color_Result = await client.query(`select color_id as value,color_name as label from tbl_color where status_id = 1`);

        const item_Result = await client.query(`select item_id as value,item_name as label from tbl_def_item `);

        const alldepartment_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_department UNION ALL SELECT department_id as value,department_name as label FROM tbl_department`);

        const alldesignation_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_designation UNION ALL SELECT designation_id as value,designation_name as label FROM tbl_designation`);

        const allemployeecatery_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_def_employee_category UNION ALL SELECT category_id as value,category_name as label from tbl_def_employee_category `);

        const alljobtype_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_def_jobtype UNION ALL SELECT jobtype_id as value,jobtype_name as label from tbl_def_jobtype `);

        const allitem_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_item UNION ALL select item_id as value,item_name as label from tbl_item where status_id = 1 `);

        const allcolor_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_color UNION ALL SELECT color_id as value,color_name as label from tbl_color `);

        const employee_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_employee_details UNION ALL  select  a.employee_id as value,coalesce(b.machine_no,'')||' - '|| coalesce(a.employee_name,'')  as label from tbl_employee_details as a inner join tbl_machine as b on a.employee_id=b.employee_id where a.status_id = 1`);

        const select_employee_Result = await client.query(`select employee_id as value,employee_name as label from tbl_employee_details where employee_id NOT IN  (select employee_id from tbl_machine where employee_id !=0) and status_id = 1`);

        const edit_employee_Result = await client.query(`select employee_id as value,employee_name as label from tbl_employee_details where status_id = 1`);

        const allitemgroup_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_itemgroup UNION ALL SELECT itemgroup_id as value,itemgroup_name as label from tbl_itemgroup `);

        const alldesign_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_design UNION ALL select distinct size_id as value,qr_code as label from tbl_item_sizes order by value,label`);

        const designrate_Result = await client.query(`select design_id as value,design_no as label from tbl_design where status_id = 1 and piece_rate = 0`);

        const def_item_Result = await client.query(`select item_id as value,item_name as label,short_item_name from tbl_def_item`);

        const agent_Result = await client.query(`select agent_code as value,agent_name as label from tbl_agent where status_id =  1 order by agent_code`);

        const customer_Result = await client.query(`select 'All' as label, '0' as value  union all select coalesce(customer_name,'') || ' - '|| coalesce(mobile_no,'') as label, customer_code as value from tbl_customer order by value,label   ` );

        const menu_Result = await client.query(`select menu_id, menu_name, false as checked from tbl_def_menu_details`);
        if (client) {
          client.end();
        }
        let BloodGroup_Array = blood_Result && blood_Result.rows ? blood_Result.rows : [];
        let state_Array = state_Result && state_Result.rows ? state_Result.rows : [];
        let status_Array = status_Result && status_Result.rows ? status_Result.rows : [];
        let gender_Array = gender_Result && gender_Result.rows ? gender_Result.rows : [];
        let employeecatery_Array = employeecatery_Result && employeecatery_Result.rows ? employeecatery_Result.rows : [];
        let marital_Array = marital_Result && marital_Result.rows ? marital_Result.rows : [];
        let userrole_Array = userrole_Result && userrole_Result.rows ? userrole_Result.rows : [];
        let jobtype_Array = jobtype_Result && jobtype_Result.rows ? jobtype_Result.rows : [];
        let itemgroup_Array = itemgroup_Result && itemgroup_Result.rows ? itemgroup_Result.rows : [];
        let designation_Array = designation_Result && designation_Result.rows ? designation_Result.rows : [];
        let department_Array = department_Result && department_Result.rows ? department_Result.rows : [];
        let allDepartment_Array = alldepartment_Result && alldepartment_Result.rows ? alldepartment_Result.rows : [];
        let allDesignation_Array = alldesignation_Result && alldesignation_Result.rows ? alldesignation_Result.rows : [];
        let allemployeecatery_Array = allemployeecatery_Result && allemployeecatery_Result.rows ? allemployeecatery_Result.rows : [];
        let Design_Array = design_Result && design_Result.rows ? design_Result.rows : [];
        let Machine_Array = machine_Result && machine_Result.rows ? machine_Result.rows : [];
        let Color_Array = color_Result && color_Result.rows ? color_Result.rows : [];
        let Employee_Array = employee_Result && employee_Result.rows ? employee_Result.rows : [];
        let Item_Array = item_Result && item_Result.rows ? item_Result.rows : [];
        let allcolor_Array = allcolor_Result && allcolor_Result.rows ? allcolor_Result.rows : [];
        let alljobtype_Array = alljobtype_Result && alljobtype_Result.rows ? alljobtype_Result.rows : [];
        let allitem_Array = allitem_Result && allitem_Result.rows ? allitem_Result.rows : [];
        let allitemgroup_Array = allitemgroup_Result && allitemgroup_Result.rows ? allitemgroup_Result.rows : [];
        const alldesign_Array = alldesign_Result && alldesign_Result.rows ? alldesign_Result.rows : [];
        const designrate_Array = designrate_Result && designrate_Result.rows ? designrate_Result.rows : [];
        const select_employee_Array = select_employee_Result && select_employee_Result.rows ? select_employee_Result.rows : [];
        const edit_employee_Array = edit_employee_Result && edit_employee_Result.rows ? edit_employee_Result.rows:[];
        const def_item_Array = def_item_Result && def_item_Result.rows ? def_item_Result.rows : [];
        const agent_Array = agent_Result && agent_Result.rows ? agent_Result.rows : [];
        let customerData = customer_Result && customer_Result.rows ? customer_Result.rows : [];
        const menu_Array = menu_Result && menu_Result.rows ? menu_Result.rows : [];

        
        responseData = {"BloodGroupArray": BloodGroup_Array, "StateArray": state_Array, "StatusArray": status_Array, "GenderArray": gender_Array,"EmployeecateryArray": employeecatery_Array, "UserroleArray": userrole_Array, "MaritalArray": marital_Array, "JobTypeArray": jobtype_Array, "ItemgroupArray" : itemgroup_Array,"DesignationArray":designation_Array,"DepartmentArray":department_Array,"allDepartmentArray":allDepartment_Array,"allDesignationArray":allDesignation_Array,"allemployeecateryArray":allemployeecatery_Array,"DesignArray":Design_Array,"MachineArray":Machine_Array,"ColorArray":Color_Array,"EmployeeArray":Employee_Array,"ItemArray":Item_Array,"alljobtypeArray":alljobtype_Array,"allcolorArray":allcolor_Array,"allitemgroupArray":allitemgroup_Array,"alldesignArray":alldesign_Array,"designRateArray":designrate_Array,"SelectEmployeeArray":select_employee_Array,"EditEmployeeArray":edit_employee_Array,"allitemArray":allitem_Array,"DefItemArray":def_item_Array,"AgentArray":agent_Array,"customerList": customerData, "menuArray":menu_Array}

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

//Bind Item
module.exports.onchangeitemDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.onchangeitemData = async (req) => {
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
      if (decoded != null) { 
        const {searchvalue} = decoded.data
        if(searchvalue !== "")
        {
          const itemList = await client.query(`select distinct a.item_id as value, a.item_name as label,b.itemgroup_name from tbl_item as a inner join tbl_itemgroup as b on a.itemgroup_id = b.itemgroup_id where a.status_id = 1 and Lower(a.item_name) like '%'||$1||'%' order by a.item_name`,[searchvalue])
          if (client) { client.end(); }
          let List_Array = itemList && itemList.rows ? itemList.rows : [];
            var response = {}
             response = { "ItemList": List_Array}
            if (response) {
              return response
            }
            else {
              return response
            }
        }
        else{
          response = { "ItemList": []}
          return response
        }
      } else {
        if (client) { client.end(); }
        throw new Error(constants.userMessage.USER_NOT_FOUND);
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.token.INVALID_TOKEN);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}


//Bind Machine
module.exports.onchangeMachineDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.onchangeMachineData = async (req) => {
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
      if (decoded != null) { 
        const {searchvalue} = decoded.data
        if(searchvalue !== "")
        {
          const machineList = await client.query(`select distinct machine_id as value, machine_no as label from tbl_machine where  status_id = 1 and Lower(machine_no) like '%'||$1||'%' order by machine_no`,[searchvalue])
          if (client) { client.end(); }
          let List_Array = machineList && machineList.rows ? machineList.rows : [];
            var response = {}
             response = { "MachineList": List_Array}
            if (response) {
              return response
            }
            else {
              return response
            }
        }
        else{
          response = { "MachineList": []}
          return response
        }
      } else {
        if (client) { client.end(); }
        throw new Error(constants.userMessage.USER_NOT_FOUND);
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.token.INVALID_TOKEN);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}


//Bind Design
module.exports.onchangeDesignDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.onchangeDesignData = async (req) => {
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
      if (decoded != null) { 
        const {searchvalue} = decoded.data
        if(searchvalue !== "")
        {
          const designList = await client.query(`select distinct design_id as value, design_no as label, COALESCE(piece_rate, 0) as rate from tbl_design where status_id = 1 and Lower(design_no) like '%'||$1||'%' order by design_no`,[searchvalue])
          if (client) { client.end(); }
          let List_Array = designList && designList.rows ? designList.rows : [];
            var response = {}
             response = { "DesignList": List_Array}
            if (response) {
              return response
            }
            else {
              return response
            }
        }
        else{
          response = { "DesignList": []}
          return response
        }
      } else {
        if (client) { client.end(); }
        throw new Error(constants.userMessage.USER_NOT_FOUND);
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.token.INVALID_TOKEN);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}

//Bind User
module.exports.onchangeSizeDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.onchangeSizeData = async (req) => {
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
      if (decoded != null) { 
        const {item_id} = decoded.data
        if(item_id !== "")
        {
          const sizeList = await client.query(`select distinct size_id as value, concat_ws(' - ', starting_size, ending_size) as label,total_pieces from tbl_size where item_id =  $1 `,[item_id])
          if (client) { client.end(); }
          let List_Array = sizeList && sizeList.rows ? sizeList.rows : [];
            var response = {}
             response = { "SizeList": List_Array}
            if (response) {
              return response
            }
            else {
              return response
            }
        }
        else{
          response = { "SizeList": []}
          return response
        }
      } else {
        if (client) { client.end(); }
        throw new Error(constants.userMessage.USER_NOT_FOUND);
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.token.INVALID_TOKEN);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}


//Bind Employee
module.exports.onchangeEmployeeDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.onchangeEmployeeData = async (req) => {
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
      if (decoded != null) { 
        const {searchvalue} = decoded.data
        if(searchvalue !== "")
        {
          const employeeList = await client.query(`select distinct employee_id as value, employee_name as label from tbl_employee_details where status_id = 1 and Lower(employee_name) like '%'||$1||'%' order by employee_name`,[searchvalue])
          if (client) { client.end(); }
          let List_Array = employeeList && employeeList.rows ? employeeList.rows : [];
            var response = {}
             response = { "EmployeeList": List_Array}
            if (response) {
              return response
            }
            else {
              return response
            }
        }
        else{
          response = { "EmployeeList": []}
          return response
        }
      } else {
        if (client) { client.end(); }
        throw new Error(constants.userMessage.USER_NOT_FOUND);
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.token.INVALID_TOKEN);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}



//Bind Employee
module.exports.onchangeMachineEmployeeDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.onchangeMachineEmployeeData = async (req) => {
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
      if (decoded != null) { 
        const {machine_id} = decoded.data
        if(machine_id)
        {
          const EmployeeList = await client.query(`select a.employee_id as value,b.employee_name as label,a.machine_no from tbl_machine as a  inner join tbl_employee_details as b on a.employee_id = b. employee_id
          where a.status_id = 1 and a.machine_id  =  $1 `,[machine_id])
          if (client) { client.end(); }
          let List_Array = EmployeeList && EmployeeList.rows ? EmployeeList.rows : [];
            var response = {}
             response = { "MachineEmployeeList": List_Array}
            if (response) {
              return response
            }
            else {
              return response
            }
        }
        else{
          response = { "MachineEmployeeList": []}
          return response
        }
      } else {
        if (client) { client.end(); }
        throw new Error(constants.userMessage.USER_NOT_FOUND);
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.token.INVALID_TOKEN);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}



//On Change job card
module.exports.onchangeJobCardJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.onchangeJobCard = async (req) => {
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
      if (decoded != null) { 
        const {item_id,process} = decoded.data
        if(process == 'GetDesign')
        {
          const design_list = await client.query(`select distinct qr_code as label, size_id as value,(select color_name from tbl_color where color_id=a.color_id) as colorname,coalesce(start_size,'')||'-'||coalesce(end_size,'') as sizename,a.color_id,coalesce(total_set,'0') as total_set,coalesce((select distinct coalesce(rate,0) as piece_rate  from tbl_job_details as b where
          size_id=a.size_id and coalesce(rate,0) !=0   limit 1 ),0) as perrate   from tbl_item_sizes as a where trans_no in  (select trans_no from tbl_item_management where item_code=$1) order by label`,[item_id])
          if (client) { client.end(); }
          let List_Array = design_list && design_list.rows ? design_list.rows : [];
            var response = {}
             response = { "DesignList": List_Array}
            if (response) {
              return response
            }
            else {
              return response
            }
        } 
      } else {
        if (client) { client.end(); }
        throw new Error(constants.userMessage.USER_NOT_FOUND);
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.token.INVALID_TOKEN);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}