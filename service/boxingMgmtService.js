/****************************
 File    : boxingMasterService.js
 Author  : Suriya
 Date    : 07-03-2023
 Purpose : boxing Master Service 
 * ********************** */
 const connectionString = require('../database/connection');
 const commonService = require('../service/commonService');
 const jwt = require('jsonwebtoken');
 const constants = require('../constants');
 //Connect Postgres
 const { Client } = require('pg'); 
 //create jwt 
 module.exports.itemListjwt = async (req) => {
   try {
     const token = await commonService.jwtCreate(req);
     return { token };
 
   } catch (error) {
     throw new Error(error);
   }
 }
 // Get itemList  
 module.exports.itemList = async (req) => {
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
         const boxing_Result = await client.query(` select a.size_id as value,a.qr_code as label,total_set,
         coalesce((select sum(no_of_set) from tbl_fg_items where size_id=a.size_id),0) -
         coalesce((select sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id=a.size_id),0) as total_qty
         from tbl_item_sizes as a  order by value `);
         const boxing_result1 = await client.query(`SELECT machine_id as value, machine_no || coalesce(' - ' || machine_name,'') as label FROm tbl_ironmachine_master`);
         if (client) {
           client.end();
         }
 
         let item_Array = boxing_Result && boxing_Result.rows ? boxing_Result.rows : [];
         let ironmachine_Array = boxing_result1 && boxing_result1.rows ? boxing_result1.rows : []; 
         responseData = { "itemArray": item_Array,"ironmachineArray": ironmachine_Array }
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
 
  //create jwt 
  module.exports.getFGJobIdListjwt = async (req) => {
    try {
      let obj = {} 
      obj['user_id'] = req.user_id; 
      const token = await commonService.jwtCreate(obj); 
      return { token };
  
    } catch (error) {
      throw new Error(error);
    }
  }
  // getFGJobIdListjwt
  module.exports.getFGJobIdList = async (req) => {
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
          const {box_array} = req; 
          if(box_array.length > 0 ){ 
          let keyWithQoutes = box_array.map((it) => {return `'${it.value}'`}) 
          const boxing_Result = await client.query(`SELECT * from (SELECT distinct a.job_id, a.design_id  ,d.qr_code , coalesce(total_pieces,0)- coalesce((select sum(coalesce(no_of_pieces,0)) from tbl_fg_job_details where job_id=a.job_id),0) as total_qty,completed_date  from tbl_job_details as a inner join tbl_item_sizes as d  on a.design_id=d.size_id where a.status_id=3 and a.design_id  in (${keyWithQoutes})) as dev where dev.total_qty>0  order by completed_date`); 
        
          let item_Array = boxing_Result && boxing_Result.rows ? boxing_Result.rows : [];
          let completed_job_list = []
          if(item_Array.length > 0 ){  
            for(let i=0; i<box_array.length; i++){
              let get_box_data = box_array[i]
              let get_array = []
              var filter_arr =  item_Array.filter(e => e.design_id.toString() == box_array[i].value.toString())   
              //Get total sum of each size id
              const sum_qty = filter_arr.reduce((accumulator, object) => {
                return accumulator + Number(object.total_qty);
              }, 0); 
              if(sum_qty < Number(box_array[i].qty)){
                if (client) { client.end(); }
                return "This "+ filter_arr[0].qr_code+" design code have more qty. Qty should be less than "+sum_qty;
              } 
              let total_qty=box_array[i].qty; 
              for(let j=0; j< filter_arr.length;  j++){
                if(Number(total_qty) > 0 ){
                  if(Number(filter_arr[j].total_qty) > Number(total_qty)){ 
                    get_array.push({"job_id":filter_arr[j].job_id,"value":total_qty,"status":'pending'})
                    break;
                  } else { 
                    if(Number(total_qty) > Number(filter_arr[j].total_qty)){ 
                        total_qty = Number(total_qty) - Number(filter_arr[j].total_qty) 
                      get_array.push({"job_id":filter_arr[j].job_id,"value":filter_arr[j].total_qty,"status":'completed'}) 
                    } else { 
                      get_array.push({"job_id":filter_arr[j].job_id,"value":total_qty,"status":'completed'})
                      break;
                    }
                  }
                } 
              }
              completed_job_list.push({"designcode":get_box_data.label,"qty":get_box_data.qty, array:get_array})
             }
          }    
          responseData = { "JobFGList": completed_job_list }

          if (client) {
            client.end();
          } 
          if (responseData) {
            return responseData;
          }
          else {
            return '';
          }
        }else {
          if (client) { client.end(); }
          throw new Error(constants.userMessage.SOMETHING_WRONG);
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
  
//create jwt 
module.exports.moveToFGjwt = async (req) => {
    try {
        let obj = {} 
        obj['user_id'] = req.user_id; 
        const token = await commonService.jwtCreate(obj); 
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create boxing LIST
module.exports.moveToFG = async (req) => {
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
    const {box_array, fg_job_array, process, fg_id} = req; 
    if (decoded) { 
      const {user_id} = decoded.data
      let fgid = fg_id
      if(process == 'save'){
        const id_max = await client.query(`select coalesce (max(fg_id),0) + 1 as fgid FROM tbl_fg_items`)
        fgid = id_max && id_max.rows[0].fgid;
        if(box_array && box_array.length > 0 ){       
          for(let i=0; i < box_array.length; i++){
            const total_set  = Number(box_array[i].qty) || 0
            const no_of_pieces  = Number(box_array[i].total_set) || 0
            const total_piece = total_set * no_of_pieces
            await client.query(`INSERT INTO  tbl_fg_items(fg_id, size_id,no_of_set, no_of_pieces, user_id, created_at, updated_at, ironmachine_id, date) VALUES ($1, $2, $3, $4,$5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $6,$7) `,[fgid, box_array[i].value, box_array[i].qty,total_piece, user_id, box_array[i].machineid,box_array[i].boxingdate]);        
          } 
        }
      }
      if(process == 'update') {
        if(box_array && box_array.length > 0 ){       
          for(let i=0; i < box_array.length; i++){
            const total_set  = Number(box_array[i].qty) || 0
            const no_of_pieces  = Number(box_array[i].total_set) || 0
            const total_piece = total_set * no_of_pieces
            await client.query(`UPDATE tbl_fg_items set no_of_set = $1, no_of_pieces = $2, user_id =$3,updated_at = CURRENT_TIMESTAMP where fg_id = $4 `,[box_array[i].qty, total_piece, user_id, fg_id]);        
          } 
        } 
      }     
     console.log(fgid, "fgid")
      const FGPrint_Result = await client.query(`SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(e.color_name for 1))) as designname,(SELECT machine_no FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_no,a.no_of_set as qty,coalesce(settype,'') as settype FROM tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on c.item_code = d.item_id left join tbl_color as e on b.color_id = e.color_id where a.fg_id =$1`, [fgid]);
      let FGPrint_json = FGPrint_Result && FGPrint_Result.rows ? FGPrint_Result.rows[0] : {};
      // if(fg_job_array && fg_job_array.length > 0 ){  
      //   for(let i=0; i < fg_job_array?.length; i++){ 
      //     for(let j=0; j < fg_job_array?.[i]?.array.length; j++){ 
      //       await client.query(`INSERT INTO  tbl_fg_job_details(job_id, no_of_pieces, fg_id, user_id, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`, [fg_job_array[i].array[j].job_id,fg_job_array[i].array[j].value,fg_id,user_id]);
      //     }  
      //   }
      // } 
      if (client) {
        client.end();
      } 
      return response = { "message": "Item successfully added in FG", "statusFlag": 1, "resultData":FGPrint_json  }; 
    }
    else {
        if (client) { client.end(); }
        return ""; 
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

//create jwt 
module.exports.getFGListJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token }; 
  } catch (error) {
    throw new Error(error);
  }
}
// getFGList
module.exports.getFGList = async (req) => {
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
        const {fg_from_date, fg_to_date, limit, offset, size_id, machine_id, process} = decoded.data;
        let fg_date = '1=1';
        let size_code = '1=1';
        let get_limit = '';
        let machineid = '1=1';
        if(fg_from_date && fg_to_date){
          fg_date = `date between '`+fg_from_date+`' and '`+fg_to_date+`' `;
        }
        if(size_id && size_id != "" && size_id != "0"){
          const size_code_val = size_id ? '\'' + size_id.split(',').join('\',\'') + '\'' : ''
          size_code = `b.size_id in (` + size_code_val + `) `
        }
        if(process != 'excel'){
          // ${limit}${limit}
          get_limit =`LIMIT ${limit} OFFSET ${offset}`;
        }
        if(machine_id && machine_id != "" && machine_id != "0"){
          machineid = `a.ironmachine_id = ${Number(machine_id)}`
        }
        if(process == 'excel') { 
          const item_exec_Result = await client.query(`SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(e.color_name for 1))) as designname,(SELECT machine_no || coalesce(' - ' || machine_name,'') FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_name,(SELECT machine_no FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_no,f.user_name,to_char(date, 'dd-MM-YYYY') as fg_date,sum(a.no_of_set) as qty,b.qr_code,sum(a.no_of_pieces) as no_of_pieces,coalesce(settype,'') as settype FROM tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on
          c.item_code = d.item_id left join tbl_color as e on b.color_id = e.color_id 
          inner join tbl_user as f on f.user_id=a.user_id where ${fg_date} and ${size_code} and ${machineid}
          group by a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,f.user_name,a.date,b.qr_code,settype
          order by date,a.fg_id desc ` ); 
          let FG_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : []; 
          const company_Result = await client.query(`SELECT * from tbl_print_setting`);
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows : []; 
          responseData = { "FGArray": FG_array, "Company_Array":Company_Array }
        } else {          
        // const fg_total_Result = await client.query(`SELECT count(fg_id) as totalcount from (SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(e.color_name for 1))) as designname,(SELECT machine_no || coalesce(' - ' || machine_name,'') FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_name,(SELECT machine_no FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_no,f.user_name,to_char(date, 'dd-MM-YYYY') as fg_date,sum(a.no_of_set) as qty,b.qr_code,sum(a.no_of_pieces) as no_of_pieces FROM tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on  c.item_code = d.item_id left join tbl_color as e on b.color_id = e.color_id 
        // inner join tbl_user as f on f.user_id=a.user_id where ${fg_date} and ${size_code} and ${machineid}
        // group by a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,f.user_name,a.date,b.qr_code
        // order by date,a.fg_id desc  ) as dev  ` ); 
        const fg_total_Result = await client.query(`SELECT count(fg_id) as totalcount from (SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(e.color_name for 1))) as designname,(SELECT machine_no || coalesce(' - ' || machine_name,'') FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_name,(SELECT machine_no FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_no,f.user_name,to_char(date, 'dd-MM-YYYY') as fg_date,sum(a.no_of_set) as qty,b.qr_code,sum(a.no_of_pieces) as no_of_pieces,coalesce(settype,'') as settype FROM tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on  c.item_code = d.item_id left join tbl_color as e on b.color_id = e.color_id 
        inner join tbl_user as f on f.user_id=a.user_id where ${fg_date} and ${size_code} and ${machineid}
        group by a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,f.user_name,a.date,b.qr_code,settype
        order by date,a.fg_id  ) as dev  ` ); 
        let fg_total = fg_total_Result && fg_total_Result.rows.length > 0 ? fg_total_Result.rows[0].totalcount : 0; 
        // const boxing_Result = await client.query(` select a.size_id,sum(a.no_of_set) as qty,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a  inner join tbl_item_sizes as b on a.size_id=b.size_id   inner join tbl_user as c on c.user_id=a.user_id  inner join tbl_item_management as d on d.trans_no =b.trans_no where ${fg_date} and ${design_code} and ${customer_code} group by a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id  `);
        const boxing_Result = await client.query(`SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(e.color_name for 1))) as designname,(SELECT machine_no || coalesce(' - ' || machine_name,'') FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_name,(SELECT machine_no FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_no,f.user_name,to_char(date, 'dd-MM-YYYY') as fg_date,sum(a.no_of_set) as qty,b.qr_code,sum(a.no_of_pieces) as no_of_pieces,coalesce(settype,'') as settype FROM tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on
       c.item_code = d.item_id left join tbl_color as e on b.color_id = e.color_id 
       inner join tbl_user as f on f.user_id=a.user_id where ${fg_date} and ${size_code} and ${machineid}
       group by a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,f.user_name,a.date,b.qr_code,settype
       order by date,a.fg_id desc ${get_limit} `);
        responseData = { "FGArray": boxing_Result && boxing_Result.rows ? boxing_Result.rows : [],"FG_total":fg_total  }
        }
        if (client) {
          client.end();
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

module.exports.getCurrentStockJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token }; 
  } catch (error) {
    throw new Error(error);
  }
}
// getFGList
module.exports.getCurrentStock = async (req) => {
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
        const {limit, offset, size_id, machine_id, process,user_id,settype} = decoded.data 
        
        let designid_val = '1=1';
        let get_limit = '';
        let machineid = '1=1';
        let getsettype = '1=1';
        let getset_type = '1=1';
        if(size_id && size_id != "" && size_id != "0"){
          const design_code_val = size_id ? '\'' + size_id.split(',').join('\',\'') + '\'' : ''
          designid_val = `d.design_id in (` + design_code_val + `) `
        }
        if(process != 'print'){
          // ${limit}${limit}
          get_limit =`LIMIT ${limit} OFFSET ${offset}`;
        }
        if(machine_id && machine_id != "" && machine_id != "0"){
          const machine_id_val = machine_id ? '\'' + machine_id.split(',').join('\',\'') + '\'' : ''
          machineid = `a.ironmachine_id in (` + machine_id_val + `)`
        }
        if (settype && settype != "0" && settype != "") {
          const set_type = settype ? '\'' + settype.split(',').join('\',\'') + '\'' : ''
          getsettype = `c.settype in (` + set_type + `) `;
          getset_type = `b.settype in (` + set_type + `) `;
        }
        if(process == 'print') { 
          const Current_Stock_Result = await client.query(`select a.size_id,(sum(a.no_of_set) - 
          coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and  size_id = a.size_id ),0)) as qty,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a  
          inner join tbl_item_sizes as b on a.size_id=b.size_id  
          inner join tbl_user as c on c.user_id=a.user_id  inner join 
          tbl_item_management as d on d.trans_no =b.trans_no left join tbl_color as f on f.color_id =b.color_id inner join tbl_def_item as e on d.item_code = e.item_id where ${designid_val}  and ${machineid} and ${getset_type}
          group by a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id order by d.design_id ` ); 
          let CS_array = Current_Stock_Result && Current_Stock_Result.rows ? Current_Stock_Result.rows : []; 
          const company_Result = await client.query(`SELECT * from tbl_print_setting`);
          
          const Current_Stock_widget = await client.query( ` SELECT item_name,item_id,sum(current_pieces) as current_pieces,sum(current_set) as current_set,count(item_id) as count from (select d.item_code,
          coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a 
          inner join tbl_item_sizes as c on c.size_id=a.size_id
          inner join tbl_item_management as d on c.trans_no=d.trans_no 
          left join tbl_color as f on f.color_id =c.color_id where ${designid_val}  and ${getsettype} group by d.item_code,a.size_id order by d.item_code ) as dev inner join tbl_def_item as
          e on dev.item_code = e.item_id  group by item_name,item_id order by item_id`);
          
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows : []; 
          responseData = { "CurrentStockArray": CS_array, "Company_Array":Company_Array,"CurrentStockwidget":Current_Stock_widget && Current_Stock_widget.rows ? Current_Stock_widget.rows : [] }
        } else {
          // const fg_total_Result = await client.query(`select a.size_id,(sum(a.no_of_set) - 
          // coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0)) as qty,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a  
          // inner join tbl_item_sizes as b on a.size_id=b.size_id  
          // inner join tbl_user as c on c.user_id=a.user_id  inner join 
          // tbl_item_management as d on d.trans_no =b.trans_no  left join tbl_color as f on f.color_id =b.color_id inner join tbl_def_item as e on d.item_code = e.item_id where ${designid_val}  and ${machineid} and ${getcolor_id}
          // group by a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id order by d.design_id ` ); 
          // let fg_total = fg_total_Result && fg_total_Result.rows.length > 0 ? fg_total_Result.rowCount : 0; 
          const Pending_Orders = await client.query(`SELECT item_name,f.item_id,coalesce((qty-dispatch_set),0) as pending_set,coalesce((order_pieces-dispatch_pieces),0) as pending_pieces from (SELECT item_code, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT d.item_code,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON         c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner             join tbl_customer as e ON e.customer_code = a.customer_code where ${designid_val}  and ${getsettype} and a.status_code = 1 group by d.item_code
                      union all
          SELECT d.item_code,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code         where status_flag = 1 and ${designid_val}  and ${getsettype} and a.status_code = 1 group by d.item_code) as dev  group by item_code ) as d1 right join tbl_def_item as f on d1.item_code = f.item_id `)
          let pending_order_result = Pending_Orders && Pending_Orders.rows ? Pending_Orders.rows : []
          const NotReadyForDispatch = await client.query(`SELECT item_name,f.item_id,coalesce((qty-dispatch_set),0) as not_ready_set,coalesce((order_pieces-dispatch_pieces),0) as not_ready_pieces from (SELECT item_code, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT item_code, sum(qty) as qty,sum(order_pieces) as order_pieces,
          sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from 
           (SELECT b.size_id,d.item_code,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code where ${designid_val}  and ${getsettype} and a.status_code = 1 group by b.size_id,d.item_code
                      union all
          SELECT b.size_id,d.item_code,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code where status_flag = 1 and ${designid_val}  and ${getsettype} and a.status_code = 1  
           group by b.size_id,d.item_code)as t1 where size_id not in (SELECT size_id from (SELECT size_id, coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set from tbl_fg_items as a group by size_id) as dev where current_set > 0) group by item_code ) as dev group by item_code) as d1 right join tbl_def_item as f on d1.item_code = f.item_id`)
           let not_ready_stock_result = NotReadyForDispatch && NotReadyForDispatch.rows ? NotReadyForDispatch.rows : []

          //  const Excess_stock = await client.query(`SELECT item_code,sum(coalesce(excess_set,0)) as excess_set,sum(coalesce(excess_pieces,0)) as excess_pieces from (select a.size_id,d.item_code,                  sum(coalesce(no_of_set,0)) as excess_set,sum(coalesce(no_of_pieces,0)) as excess_pieces            from tbl_fg_items as a inner join tbl_item_sizes as c on c.size_id=a.size_id inner join tbl_item_management as d on c.trans_no=d.trans_no left join tbl_color as f on f.color_id =c.color_id where ${designid_val}  and ${getcolor_id} and a.size_id not in (SELECT size_id from (SELECT item_code,size_id,sum(pending_set) as pending_set,sum(pending_pieces) as pending_pieces,
          //  sum(current_set) as current_set,sum(current_pieces) as current_pieces from(SELECT item_code,size_id, coalesce((qty-dispatch_set),0) as pending_set,coalesce((order_pieces-dispatch_pieces),0) as pending_pieces,0 as current_set, 0 as current_pieces from (SELECT d.item_code,b.size_id,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code where  a.status_code = 1 group by d.item_code,b.size_id
          //                                   union all
          // SELECT d.item_code,b.size_id,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,          sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join                  tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON                  c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no                  inner join tbl_customer as e ON e.customer_code = a.customer_code where status_flag = 1 and  a.status_code = 1 group by d.item_code,b.size_id) as dev 
          //     union all
          // select d.item_code,a.size_id,0 as pending_set,0 as pending_pieces,coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a inner join tbl_item_sizes as c on c.size_id=a.size_id          inner join tbl_item_management as d on c.trans_no=d.trans_no left join tbl_color as f on f.color_id =c.color_id group by d.item_code,a.size_id ) as d1 group by item_code,size_id) as t1 where current_set <= pending_set ) group by d.item_code,a.size_id order by d.item_code) as dev group by item_code`)
          const Excess_stock = await client.query(`SELECT item_code,sum(current_set-pending_set) as excess_set,sum(current_pieces-pending_pieces) as excess_pieces from (SELECT item_code,size_id,sum(pending_set) as pending_set,sum(pending_pieces) as pending_pieces,sum(current_set) as current_set,sum(current_pieces) as current_pieces from(SELECT item_code,size_id, coalesce((qty-dispatch_set),0) as pending_set,coalesce((order_pieces-dispatch_pieces),0) as pending_pieces,0 as current_set, 0 as current_pieces from (SELECT d.item_code,b.size_id,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner           
           join tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id where  a.status_code = 1 and ${designid_val}  and ${getsettype}  group by d.item_code,b.size_id
                                union all
           SELECT d.item_code,b.size_id,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,         sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join                tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON                 c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no                 inner join tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id where status_flag = 1 and  
           ${designid_val}  and ${getsettype} and a.status_code = 1 group by d.item_code,b.size_id
             ) as dev union all
             select d.item_code,a.size_id,0 as pending_set,0 as pending_pieces,coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a inner join tbl_item_sizes as c on c.size_id=a.size_id inner join tbl_item_management as d on c.trans_no=d.trans_no 
             left join tbl_color as f on f.color_id =c.color_id where ${designid_val}  and ${getsettype}
              group by d.item_code,a.size_id ) as d1 group by item_code,size_id) as t1 where current_set > pending_set group by item_code`);
            let excess_stock_result = Excess_stock && Excess_stock.rows ? Excess_stock.rows : []
          const Current_Stock_Result = await client.query( `select a.size_id,(sum(a.no_of_set) - 
          coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0)) as qty,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a  
          inner join tbl_item_sizes as b on a.size_id=b.size_id  inner join tbl_user as c on c.user_id=a.user_id  inner join tbl_item_management as d on d.trans_no =b.trans_no left join tbl_color as f on f.color_id =b.color_id  inner join tbl_def_item as e on 
          d.item_code = e.item_id where ${designid_val}  and ${machineid} and ${getset_type}
          group by a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id order by d.design_id ${get_limit} `);
          
          const Current_Stock_widget = await client.query( ` SELECT item_name,item_id,coalesce(sum(current_pieces),0) as current_pieces,coalesce(sum(current_set),0) as current_set,count(item_id) as count from (select d.item_code,coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a inner join tbl_item_sizes as c on c.size_id=a.size_id
            inner join tbl_item_management as d on c.trans_no=d.trans_no 
            left join tbl_color as f on f.color_id =c.color_id where ${designid_val}  and ${getsettype} group by d.item_code,a.size_id order by d.item_code ) as dev right join tbl_def_item as
            e on dev.item_code = e.item_id  group by item_name,item_id order by item_id`);
            var result_array = []
            let Current_stock_result = Current_Stock_widget && Current_Stock_widget.rows ? Current_Stock_widget.rows : []
            for(let i = 0; i<Current_stock_result.length; i++){
              let not_ready_stock = not_ready_stock_result.filter(e => (e.item_id === Current_stock_result[i].item_id));
              let pending_stock = pending_order_result.filter(e => (e.item_id === Current_stock_result[i].item_id));
              let excess_stock = excess_stock_result.filter(e => (e.item_code === Current_stock_result[i].item_id));
              var obj = {"item_code":Current_stock_result[i].item_id, "item_name":Current_stock_result[i].item_name,"current_set":Current_stock_result[i].current_set,"current_pieces":Current_stock_result[i].current_pieces,"not_ready_set":not_ready_stock && not_ready_stock.length > 0 ? not_ready_stock[0].not_ready_set : 0,"not_ready_pieces":not_ready_stock && not_ready_stock.length > 0 ? not_ready_stock[0].not_ready_pieces : 0,"pending_set":pending_stock && pending_stock.length > 0 ? pending_stock[0].pending_set : 0,"pending_pieces":pending_stock && pending_stock.length > 0 ?  pending_stock[0].pending_pieces : 0,"excess_set":excess_stock && excess_stock.length > 0 ?  excess_stock[0].excess_set: 0,"excess_pieces":excess_stock && excess_stock.length > 0 ? excess_stock[0].excess_pieces : 0}

              result_array.push(obj)

            }
          responseData = { "CurrentStockwidget":result_array  ? result_array : [] }
        }
        if (client) {
          client.end();
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
module.exports.getAllStockJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token }; 
  } catch (error) {
    throw new Error(error);
  }
}
module.exports.getAllStock = async (req) => {
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
        const {limit, offset, size_id, machine_id, process,user_id,settype,item_code} = decoded.data 
        
        let designid_val = '1=1';
        let get_limit = '';
        let machineid = '1=1';        
        let getsettype = '1=1';
        let getset_type = '1=1';
        
        if(size_id && size_id != "" && size_id != "0"){
          const design_code_val = size_id ? '\'' + size_id.split(',').join('\',\'') + '\'' : ''
          designid_val = `d.design_id in (` + design_code_val + `) `
        }
        if(process != 'print'){
          // ${limit}${limit}
          get_limit =`LIMIT ${limit} OFFSET ${offset}`;
        }
        if(machine_id && machine_id != "" && machine_id != "0"){
          const machine_id_val = machine_id ? '\'' + machine_id.split(',').join('\',\'') + '\'' : ''
          machineid = `a.ironmachine_id in (` + machine_id_val + `)`
        }
        if (settype && settype != "0" && settype != "") {
          const set_type = settype ? '\'' + settype.split(',').join('\',\'') + '\'' : ''
          getsettype = `c.settype in (` + set_type + `) `;
          getset_type = `b.settype in (` + set_type + `) `;
        }
        if(process == 'currentstock'){
          const total_Current_stock = await client.query(`SELECT item_code,sum(qty) as qty,design_id from (select a.size_id,d.item_code,(sum(a.no_of_set) - coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0)) as qty,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces,d.design_id 
					from tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id  inner join tbl_user 
          as c on c.user_id=a.user_id  inner join tbl_item_management as d on d.trans_no =b.trans_no left join tbl_color as f on f.color_id =b.color_id inner join tbl_def_item as e on d.item_code = e.item_id where ${designid_val}  and ${machineid} and ${getset_type} and e.item_id = ${item_code} group by d.item_code,d.design_id,a.size_id order by d.design_id ) as dev group by item_code,design_id`)
          let Current_stock_total = total_Current_stock && total_Current_stock.rows.length > 0 ? total_Current_stock.rowCount : 0; 
          const Current_stock = await client.query(`SELECT item_code,sum(qty) as qty,sum(current_pieces) as current_pieces,design_id from (select a.size_id,d.item_code,(sum(a.no_of_set) - coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0)) as qty,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces,d.design_id 
					from tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id  inner join tbl_user 
          as c on c.user_id=a.user_id  inner join tbl_item_management as d on d.trans_no =b.trans_no left join tbl_color as f on f.color_id =b.color_id inner join tbl_def_item as e on d.item_code = e.item_id where ${designid_val}  and ${machineid} and ${getset_type} and e.item_id = ${item_code} group by d.item_code,d.design_id,a.size_id order by d.design_id ) as dev group by item_code,design_id ${get_limit}`)
          let Current_stock_array = Current_stock && Current_stock.rows ? Current_stock.rows : []; 
            let result = [];
            if (Current_stock_array.length > 0) {
              for (let i = 0; i < Current_stock_array.length; i++) {
                const item_Result = await client.query(` select a.size_id,(sum(a.no_of_set) - 
                coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0)) as qty,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a  
                inner join tbl_item_sizes as b on a.size_id=b.size_id  inner join tbl_user as c on c.user_id=a.user_id  inner join tbl_item_management as d on d.trans_no =b.trans_no left join tbl_color as f on f.color_id =b.color_id  inner join tbl_def_item as e on 
                d.item_code = e.item_id where ${designid_val}  and ${machineid} and ${getset_type} and d.design_id = $1 group by a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id order by d.design_id`,[Current_stock_array[i].design_id] );
                let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
                let obj = Current_stock_array[i]
                obj['ItemArray'] = item_Array
                result.push(obj)
              }
            }
            responseData = { "Stock_Array": result , "Stock_Total":Current_stock_total}           
        }
        if(process == 'pendingstock'){
          // const total_Pending_stock = await client.query(`Select design_id,item_code,coalesce((qty-dispatch_set),0) as pending_set,coalesce((order_pieces-dispatch_pieces),0) as pending_pieces
          // from (SELECT design_id,item_code, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT d.design_id,d.item_code,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 
          // 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items 
          // as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON   
          // c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner    
          // join tbl_customer as e ON e.customer_code = a.customer_code 
          // where ${designid_val}  and ${getcolor_id} and d.item_code = ${item_code} and a.status_code = 1  group by d.item_code,d.design_id 
          //                       union all
          // SELECT d.design_id,d.item_code,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,
          // sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join tbl_order_taking 
          // as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner 
          // join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e 
          // ON e.customer_code = a.customer_code  where status_flag = 1 and ${designid_val}  and ${getcolor_id}
          // and d.item_code = ${item_code} and a.status_code = 1 group by d.item_code,d.design_id) as dev  group by item_code,design_id order by design_id) as d1`)
          const total_Pending_stock = await client.query(`Select order_no,customer_name,city,coalesce((qty-dispatch_set),0) as pending_set,coalesce((order_pieces-dispatch_pieces),0) as pending_pieces from (SELECT order_no,customer_name,city, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT a.order_no,e.customer_name,e.city,a.customer_code,d.design_id,d.item_code,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as 
          order_pieces,0 as dispatch_set,0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id  inner join tbl_customer as e ON e.customer_code = a.customer_code where ${designid_val}  and ${getsettype}
          and d.item_code = ${item_code} and a.status_code = 1 group by a.order_no,e.customer_name,e.city,a.customer_code,d.item_code,d.design_id
                                                    union all
            SELECT a.order_no,e.customer_name,e.city,a.customer_code,d.design_id,d.item_code,0 as qty,
          0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id inner join tbl_customer as e ON e.customer_code = a.customer_code  where status_flag = 1 and ${designid_val}  and ${getsettype} and d.item_code = ${item_code} and 
          a.status_code = 1 group by a.order_no,e.customer_name,e.city,a.customer_code,d.item_code,d.design_id) as dev group by order_no,customer_name,city order by order_no) as d1 where coalesce((qty-dispatch_set),0) > 0 order by order_no`)
          let Pending_stock_total = total_Pending_stock && total_Pending_stock.rows.length > 0 ? total_Pending_stock.rowCount : 0; 
          
          const Pending_stock = await client.query(`Select order_no,customer_name,city,coalesce((qty-dispatch_set),0) as pending_set,coalesce((order_pieces-dispatch_pieces),0) as pending_pieces from (SELECT order_no,customer_name,city, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT a.order_no,e.customer_name,e.city,a.customer_code,d.design_id,d.item_code,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set,0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id inner join tbl_customer as e ON e.customer_code = a.customer_code where ${designid_val}  and ${getsettype}
           and d.item_code = ${item_code} and a.status_code = 1 group by a.order_no,e.customer_name,e.city,a.customer_code,d.item_code,d.design_id
                                                     union all
             SELECT a.order_no,e.customer_name,e.city,a.customer_code,d.design_id,d.item_code,0 as qty,
           0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id inner join tbl_customer as e ON e.customer_code = a.customer_code  where status_flag = 1 and ${designid_val}  and ${getsettype} and d.item_code = ${item_code} and 
           a.status_code = 1 group by a.order_no,e.customer_name,e.city,a.customer_code,d.item_code,d.design_id) as dev group by order_no,customer_name,city order by order_no) as d1 where coalesce((qty-dispatch_set),0) > 0 order by order_no ${get_limit}`);
          let Pending_stock_array = Pending_stock && Pending_stock.rows ? Pending_stock.rows : []; 
            responseData = { "Stock_Array": Pending_stock_array , "Stock_Total":Pending_stock_total}           
        }
        if(process == 'requiredstock'){
          const total_Required_stock = await client.query(`SELECT design_id,item_code,coalesce((qty-dispatch_set),0) as not_ready_set,coalesce((order_pieces-dispatch_pieces),0) as not_ready_pieces from (SELECT design_id,item_code, sum(qty) as qty,sum(order_pieces) as order_pieces, sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from (SELECT design_id,item_code, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT d.design_id,b.size_id,d.item_code,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code where ${designid_val}  and ${getsettype} and a.status_code = 1 and d.item_code = ${item_code} group by d.design_id,b.size_id,d.item_code
                                union all
          SELECT d.design_id,b.size_id,d.item_code,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer 
          as e ON e.customer_code = a.customer_code where status_flag = 1 and d.item_code = ${item_code} and ${designid_val}  and ${getsettype} and a.status_code = 1  group by d.design_id,b.size_id,d.item_code)as t1 where size_id not in (SELECT size_id from (SELECT size_id, coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set from tbl_fg_items as a group by size_id) as dev where current_set > 0) group by item_code,design_id) as dev group by item_code,design_id) 
          as d1 order by design_id`)
          let Current_required_total = total_Required_stock && total_Required_stock.rows.length > 0 ? total_Required_stock.rowCount : 0; 
          const Required_stock = await client.query(`SELECT design_id,item_code,coalesce((qty-dispatch_set),0) as not_ready_set,coalesce((order_pieces-dispatch_pieces),0) as not_ready_pieces from (SELECT design_id,item_code, sum(qty) as qty,sum(order_pieces) as order_pieces, sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from (SELECT design_id,item_code, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT d.design_id,b.size_id,d.item_code,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code where 
          ${designid_val}  and ${getsettype} and a.status_code = 1 and d.item_code = ${item_code} group by d.design_id,b.size_id,d.item_code
                                union all
          SELECT d.design_id,b.size_id,d.item_code,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer 
          as e ON e.customer_code = a.customer_code where status_flag = 1 and d.item_code = ${item_code} and ${designid_val}  and ${getsettype} and a.status_code = 1  group by d.design_id,b.size_id,d.item_code)as t1 where size_id 
          not in (SELECT size_id from (SELECT size_id, coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set from tbl_fg_items as a group by size_id) as dev where current_set > 0) group by item_code,design_id) as dev group by item_code,design_id) 
          as d1 order by design_id ${get_limit}`)
          let Required_stock_array = Required_stock && Required_stock.rows ? Required_stock.rows : []; 
            let result = [];
            if (Required_stock_array.length > 0) {
              for (let i = 0; i < Required_stock_array.length; i++) {
                const item_Result = await client.query(` SELECT design_id,item_code,size_id,qr_code,coalesce((qty-dispatch_set),0) as not_ready_set,coalesce((order_pieces-dispatch_pieces),0) as not_ready_pieces from (SELECT design_id,item_code,size_id,qr_code, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from (SELECT design_id,item_code,size_id,qr_code, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT d.design_id,b.size_id,d.item_code,c.qr_code,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code where ${designid_val}  and ${getsettype} and a.status_code = 1 and d.design_id = $1 group by d.design_id,b.size_id,d.item_code,c.qr_code
                                      union all
                SELECT d.design_id,b.size_id,d.item_code,c.qr_code,0 as qty, 0 as order_pieces,                 sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces                     from tbl_dispatch_details as b inner join tbl_order_taking as a on                       a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id                inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer            as e ON e.customer_code = a.customer_code where status_flag = 1 and ${designid_val}  and ${getsettype} and a.status_code = 1 and d.design_id = $1 group by d.design_id,b.size_id,d.item_code,c.qr_code)as t1 where size_id not in (SELECT size_id from (SELECT size_id, coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set from tbl_fg_items as a group by size_id) as dev where current_set > 0) group by item_code,design_id,size_id,qr_code ) as dev group by item_code,design_id,size_id,qr_code) 
                as d1 order by design_id`,[Required_stock_array[i].design_id] );
                let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
                let obj = Required_stock_array[i]
                obj['ItemArray'] = item_Array
                result.push(obj)
              }
            }
            responseData = { "Stock_Array": result , "Stock_Total":Current_required_total}           
        }
        if(process == 'excessstock'){
          const total_excess_stock = await client.query(`SELECT design_id,item_code,sum(current_set-pending_set) as excess_set,sum(current_pieces-pending_pieces) as 
          excess_pieces from (SELECT item_code,design_id,size_id,sum(pending_set) as pending_set,              sum(pending_pieces) as pending_pieces,sum(current_set) as current_set,sum(current_pieces) as current_pieces from(SELECT item_code,design_id,size_id, coalesce((qty-dispatch_set),0) as pending_set,coalesce((order_pieces-dispatch_pieces),0) as pending_pieces,0 as current_set, 0 as current_pieces from (SELECT d.item_code,d.design_id,b.size_id,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces, 0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id where  a.status_code = 1 and ${designid_val}  and ${getsettype} and d.item_code = ${item_code} group by d.item_code,d.design_id,b.size_id
                                union all
          SELECT d.item_code,d.design_id,b.size_id,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join       tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON                 c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no                 inner join tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id where status_flag = 1 and  a.status_code = 1 and ${designid_val}  and ${getsettype} and d.item_code = ${item_code} group by d.item_code,d.design_id,b.size_id
             ) as dev 
             union all
          select d.item_code,d.design_id,a.size_id,0 as pending_set,0 as pending_pieces,coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a inner join tbl_item_sizes as c on c.size_id=a.size_id inner join tbl_item_management as d on c.trans_no=d.trans_no                     left join tbl_color as f on f.color_id =c.color_id where ${designid_val}  and ${getsettype}        and d.item_code = ${item_code}  group by d.item_code,d.design_id,a.size_id ) as d1 group by item_code,design_id,size_id) as t1 where current_set > pending_set group by item_code,design_id order by design_id `)
          let Excess_stock_total = total_excess_stock && total_excess_stock.rows.length > 0 ? total_excess_stock.rowCount : 0; 
          const Excess_stock = await client.query(`SELECT design_id,item_code,sum(current_set-pending_set) as excess_set,sum(current_pieces-pending_pieces) as 
          excess_pieces from (SELECT item_code,design_id,size_id,sum(pending_set) as pending_set,              sum(pending_pieces) as pending_pieces,sum(current_set) as current_set,sum(current_pieces) as current_pieces from(SELECT item_code,design_id,size_id, coalesce((qty-dispatch_set),0) as pending_set,coalesce((order_pieces-dispatch_pieces),0) as pending_pieces,0 as current_set, 0 as current_pieces from (SELECT d.item_code,d.design_id,b.size_id,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces, 0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id where  a.status_code = 1 and ${designid_val}  and ${getsettype} and d.item_code = ${item_code} group by d.item_code,d.design_id,b.size_id
                                union all
          SELECT d.item_code,d.design_id,b.size_id,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join       tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON                 c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no                 inner join tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id where status_flag = 1 and  a.status_code = 1 and ${designid_val}  and ${getsettype} and d.item_code = ${item_code} group by d.item_code,d.design_id,b.size_id
             ) as dev 
             union all
          select d.item_code,d.design_id,a.size_id,0 as pending_set,0 as pending_pieces,coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a inner join tbl_item_sizes as c on c.size_id=a.size_id inner join tbl_item_management as d on c.trans_no=d.trans_no                     left join tbl_color as f on f.color_id =c.color_id where ${designid_val}  and ${getsettype}        and d.item_code = ${item_code}  group by d.item_code,d.design_id,a.size_id ) as d1 group by item_code,design_id,size_id) as t1 where current_set > pending_set group by item_code,design_id order by design_id ${get_limit}`)
          let Excess_stock_array = Excess_stock && Excess_stock.rows ? Excess_stock.rows : []; 
            let result = [];
            if (Excess_stock_array.length > 0) {
              for (let i = 0; i < Excess_stock_array.length; i++) {
                const item_Result = await client.query(` SELECT design_id,qr_code,item_code,sum(current_set-pending_set) as excess_set,sum(current_pieces-pending_pieces) as 
                excess_pieces from (SELECT item_code,design_id,qr_code,size_id,sum(pending_set) as pending_set,              sum(pending_pieces) as pending_pieces,sum(current_set) as current_set,sum(current_pieces) as current_pieces from(SELECT item_code,design_id,qr_code,size_id, coalesce((qty-dispatch_set),0) as pending_set,coalesce((order_pieces-dispatch_pieces),0) as pending_pieces,0 as current_set, 0 as current_pieces from (SELECT d.item_code,d.design_id,c.qr_code,b.size_id,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces, 0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id where  a.status_code = 1 and ${designid_val}  and ${getsettype} and d.design_id = $1 group by d.item_code,d.design_id,c.qr_code,b.size_id
                                      union all
                SELECT d.item_code,d.design_id,c.qr_code,b.size_id,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join       tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON                 c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no                 inner join tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id where status_flag = 1 and  a.status_code = 1 and ${designid_val}  and ${getsettype} and d.design_id = $1 group by d.item_code,d.design_id,c.qr_code,b.size_id
                   ) as dev 
                   union all
                select d.item_code,d.design_id,c.qr_code,a.size_id,0 as pending_set,0 as pending_pieces,coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a inner join tbl_item_sizes as c on c.size_id=a.size_id inner join tbl_item_management as d on c.trans_no=d.trans_no                     left join tbl_color as f on f.color_id =c.color_id where ${designid_val}  and ${getsettype}        and d.design_id = $1  group by d.item_code,d.design_id,c.qr_code,a.size_id ) as d1 group by item_code,design_id,qr_code,size_id) as t1 where current_set > pending_set group by item_code,design_id,qr_code order by design_id`,[Excess_stock_array[i].design_id] );
              //   const item_Result = await client.query(` SELECT design_id,qr_code,item_code,sum(coalesce(excess_set,0)) as excess_set,sum(coalesce(excess_pieces,0)) as excess_pieces
              //   from (select d.design_id,a.size_id,d.item_code,c.qr_code,sum(coalesce(no_of_set,0)) as excess_set,sum(coalesce(no_of_pieces,0)) as excess_pieces from tbl_fg_items as a inner join tbl_item_sizes as c on c.size_id=a.size_id inner join tbl_item_management as d on c.trans_no=d.trans_no left join tbl_color as f on f.color_id =c.color_id where ${designid_val}  and ${getcolor_id} and d.design_id = $1 and a.size_id not in (SELECT size_id from (SELECT item_code,size_id,sum(pending_set) as pending_set,sum(pending_pieces) as pending_pieces,
              //   sum(current_set) as current_set,sum(current_pieces) as current_pieces from(SELECT item_code,size_id, coalesce((qty-dispatch_set),0) as pending_set,coalesce((order_pieces-dispatch_pieces),0) as pending_pieces,0 as current_set, 0 as current_pieces from (SELECT d.item_code,b.size_id,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code where  a.status_code = 1 group by d.item_code,b.size_id
              //                                    union all
              //  SELECT d.item_code,b.size_id,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,          sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b inner join                  tbl_order_taking as a on a.order_no = b.order_no inner join tbl_item_sizes as c ON                  c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no                  inner join tbl_customer as e ON e.customer_code = a.customer_code where status_flag = 1 and  a.status_code = 1 group by d.item_code,b.size_id) as dev 
              //      union all
              //  select d.item_code,a.size_id,0 as pending_set,0 as pending_pieces,coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a inner join tbl_item_sizes as c on c.size_id=a.size_id          inner join tbl_item_management as d on c.trans_no=d.trans_no left join tbl_color as f on f.color_id =c.color_id group by d.item_code,a.size_id ) as d1 group by item_code,size_id) as t1 where current_set <= pending_set ) group by d.item_code,d.design_id,a.size_id,qr_code order by d.item_code) as dev group by item_code,design_id,qr_code order by design_id`,[Excess_stock_array[i].design_id] );
                let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
                let obj = Excess_stock_array[i]
                obj['ItemArray'] = item_Array
                result.push(obj)
              }
            }
            responseData = { "Stock_Array": result , "Stock_Total":Excess_stock_total}           
        }
        if (client) {
          client.end();
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

module.exports.getPendingStockForOrderJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token }; 
  } catch (error) {
    throw new Error(error);
  }
}
// getFGList
module.exports.getPendingStockForOrder = async (req) => {
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
        const {size_id, user_id,settype,item_code, order_no} = decoded.data;
        let designid_val = '1=1';
        let getsettype = '1=1';
        let getset_type = '1=1';
        let getorder_no = '1=1';
        
        if(size_id && size_id != "" && size_id != "0"){
          const design_code_val = size_id ? '\'' + size_id.split(',').join('\',\'') + '\'' : ''
          designid_val = `d.design_id in (` + design_code_val + `) `
        }
        if (settype && settype != "0" && settype != "") {
          const set_type = settype ? '\'' + settype.split(',').join('\',\'') + '\'' : ''
          getsettype = `c.settype in (` + set_type + `) `;
          getset_type = `b.settype in (` + set_type + `) `;
        }
        if (order_no ) {
           getorder_no = order_no ? '\'' + order_no.split(',').join('\',\'') + '\'' : ''
          
        }
        const pending_stock_Result = await client.query(`SELECT * from (SELECT item_name,qr_code,sum(qty) - sum(dispatch_set) as pending_set,sum(order_pieces) - sum(dispatch_pieces) as  pending_pieces from(
        SELECT e.item_name,a.order_no,d.item_code,c.qr_code,sum(b.qty) as qty,sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces, 0 as dispatch_set, 0 as dispatch_pieces from tbl_order_taking as 
          a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no 
          left join tbl_color as f on f.color_id =c.color_id inner join tbl_def_item as e on d.item_code = e.item_id where d.item_code = ${item_code} and a.order_no = ${getorder_no} and a.status_code = 1 and ${designid_val}  and ${getsettype} group by a.order_no,d.item_code,e.item_name,c.qr_code
             union all               
            SELECT g.item_name,a.order_no,d.item_code,b.qr_code,0 as qty, 0 as order_pieces,sum(dispatch_set) 
            as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as a
              inner join tbl_item_sizes as b ON b.size_id = a.size_id inner join tbl_item_management as d on d.trans_no=b.trans_no left join tbl_color as f on f.color_id =b.color_id inner join tbl_def_item as g on d.item_code = g.item_id where d.item_code = ${item_code} and a.order_no = ${getorder_no} and a.status_flag = 1  and ${designid_val}  and ${getset_type} group by a.order_no,d.item_code,g.item_name,b.qr_code) as dev group by item_name,qr_code ) as d1 where pending_set > 0`);
        responseData = { "Pending_Stock": pending_stock_Result && pending_stock_Result.rows ? pending_stock_Result.rows : []}        
        if (client) {
          client.end();
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

//create jwt 
module.exports.checkFGItemDispatchJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token }; 
  } catch (error) {
    throw new Error(error);
  }
}
// getFGList
module.exports.checkFGItemDispatch = async (req) => {
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
        const {user_id, size_id, fg_qty, process} = decoded.data;
        
        const fg_Result = await client.query(`SELECT * FROM (SELECT size_id,coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where
        status_flag = 1 and size_id = a.size_id ),0),0) as current_set from tbl_fg_items as a 
        where size_id = ${size_id}  group by size_id) as dev where current_set > 0 `);
        // const fg_Result = await client.query(`SELECT * FROM (SELECT size_id,coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0) as current_set from tbl_fg_items as a where size_id = ${size_id}  group by size_id) as dev where current_set < ${fg_qty} `);
        responseData = { "FGArray": fg_Result && fg_Result.rows ? fg_Result.rows : [], "Message" :  fg_Result && fg_Result.rowCount > 0 ? "" : process === "delete" ? constants.FGMessage.ERRORINDELETE : constants.FGMessage.ERRORINEDIT }        
        if (client) {
          client.end();
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


 //Delete itemgroup jwt 
 module.exports.DeleteFGItemJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}

//Delete itemgroup service
module.exports.DeleteFGItem = async (req) => {
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
      const { user_id, fg_id } = decoded.data;
      if (decoded) { 
            await commonService.insertLogs(user_id, "Delete Finished Goods");
            const delete_result = await client.query(`DELETE FROM tbl_fg_items where fg_id = $1 `,
              [fg_id]);
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
