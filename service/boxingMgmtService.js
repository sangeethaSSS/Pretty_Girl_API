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
    
     const FGPrint_Result = await client.query(`SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(e.color_name for 1))) as designname,(SELECT machine_no FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_no,coalesce(settype,'') as settype FROM tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on c.item_code = d.item_id left join tbl_color as e on b.color_id = e.color_id where a.fg_id =$1`, [fgid]);
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
         const item_exec_Result = await client.query(`SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(e.color_name for 1))) as designname,(SELECT machine_no || coalesce(' - ' || machine_name,'') FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_name,(SELECT machine_no FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_no,f.user_name,to_char(date, 'dd-MM-YYYY') as fg_date,sum(a.no_of_set) as qty,b.qr_code,sum(a.no_of_pieces) as no_of_pieces FROM tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on
         c.item_code = d.item_id left  join tbl_color as e on b.color_id = e.color_id 
         inner join tbl_user as f on f.user_id=a.user_id where ${fg_date} and ${size_code} and ${machineid}
         group by a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,f.user_name,a.date,b.qr_code
         order by date,a.fg_id ` ); 
         let FG_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : []; 
         const company_Result = await client.query(`SELECT * from tbl_print_setting`);
         let Company_Array = company_Result && company_Result.rows ? company_Result.rows : []; 
         responseData = { "FGArray": FG_array, "Company_Array":Company_Array }
       } else {
       // const fg_total_Result = await client.query(`SELECT count(fg_id) as totalcount   from tbl_fg_items where  ${fg_date}  ` );
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
       order by date,a.fg_id  ${get_limit} `);
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
       const {limit, offset, size_id, machine_id, process,user_id,color_id} = decoded.data 
       
       let designid_val = '1=1';
       let get_limit = '';
       let machineid = '1=1';
       let getcolor_id = '1=1';
       
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
       if (color_id && color_id != "0" && color_id != "") {
         const color_code_val = color_id ? '\'' + color_id.split(',').join('\',\'') + '\'' : ''
         getcolor_id = `f.color_id in (` + color_code_val + `) `;
       }
       if(process == 'print') { 
         const Current_Stock_Result = await client.query(`select a.size_id,(sum(a.no_of_set) - 
         coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and  size_id = a.size_id ),0)) as qty,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a  
         inner join tbl_item_sizes as b on a.size_id=b.size_id  
         inner join tbl_user as c on c.user_id=a.user_id  inner join 
         tbl_item_management as d on d.trans_no =b.trans_no left  join tbl_color as f on f.color_id =b.color_id inner join tbl_def_item as e on d.item_code = e.item_id where ${designid_val}  and ${machineid} and ${getcolor_id}
         group by a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id order by d.design_id ` ); 
         let CS_array = Current_Stock_Result && Current_Stock_Result.rows ? Current_Stock_Result.rows : []; 
         const company_Result = await client.query(`SELECT * from tbl_print_setting`);
         
         const Current_Stock_widget = await client.query( ` SELECT item_name,item_id,sum(current_pieces) as current_pieces,sum(current_set) as current_set,count(item_id) as count from (select d.item_code,
         coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a 
         inner join tbl_item_sizes as c on c.size_id=a.size_id
         inner join tbl_item_management as d on c.trans_no=d.trans_no 
         left join tbl_color as f on f.color_id =c.color_id where ${designid_val}  and ${getcolor_id} group by d.item_code,a.size_id order by d.item_code ) as dev inner join tbl_def_item as
         e on dev.item_code = e.item_id  group by item_name,item_id order by item_id`);
         
         let Company_Array = company_Result && company_Result.rows ? company_Result.rows : []; 
         responseData = { "CurrentStockArray": CS_array, "Company_Array":Company_Array,"CurrentStockwidget":Current_Stock_widget && Current_Stock_widget.rows ? Current_Stock_widget.rows : [] }
       } else {
         const fg_total_Result = await client.query(`select a.size_id,(sum(a.no_of_set) - 
         coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0)) as qty,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a  
         inner join tbl_item_sizes as b on a.size_id=b.size_id  
         inner join tbl_user as c on c.user_id=a.user_id  inner join 
         tbl_item_management as d on d.trans_no =b.trans_no  left  join tbl_color as f on f.color_id =b.color_id inner join tbl_def_item as e on d.item_code = e.item_id where ${designid_val}  and ${machineid} and ${getcolor_id}
         group by a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id order by d.design_id ` ); 
         let fg_total = fg_total_Result && fg_total_Result.rows.length > 0 ? fg_total_Result.rowCount : 0; 
         
         const Current_Stock_Result = await client.query( `select a.size_id,(sum(a.no_of_set) - 
         coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0)) as qty,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a  
         inner join tbl_item_sizes as b on a.size_id=b.size_id  
         inner join tbl_user as c on c.user_id=a.user_id  inner join 
         tbl_item_management as d on d.trans_no =b.trans_no left  join tbl_color as f on f.color_id =b.color_id  inner join tbl_def_item as e on 
         d.item_code = e.item_id where ${designid_val}  and ${machineid} and ${getcolor_id}
         group by a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id order by d.design_id ${get_limit} `);
         const Current_Stock_widget = await client.query( ` SELECT item_name,item_id,sum(current_pieces) as current_pieces,sum(current_set) as current_set,count(item_id) as count from (select d.item_code,
           coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set,coalesce(sum(coalesce(no_of_pieces,0)) - (SELECT coalesce(sum(dispatch_pieces),0) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id )) as current_pieces from tbl_fg_items as a 
           inner join tbl_item_sizes as c on c.size_id=a.size_id
           inner join tbl_item_management as d on c.trans_no=d.trans_no 
           left join tbl_color as f on f.color_id =c.color_id where ${designid_val}  and ${getcolor_id} group by d.item_code,a.size_id order by d.item_code ) as dev inner join tbl_def_item as
           e on dev.item_code = e.item_id  group by item_name,item_id order by item_id`);
        
         responseData = { "CurrentStockArray": Current_Stock_Result && Current_Stock_Result.rows ? Current_Stock_Result.rows : [], "CurrentStock_total":fg_total, "CurrentStockwidget":Current_Stock_widget && Current_Stock_widget.rows ? Current_Stock_widget.rows : [] }
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
