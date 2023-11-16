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
         const boxing_Result = await client.query(` SELECT a.size_id as value,a.qr_code as label,total_set,
         COALESCE((SELECT sum(no_of_set) from tbl_fg_items WHERE size_id=a.size_id),0) -
         COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id=a.size_id),0) as total_qty
         from tbl_item_sizes as a  ORDER BY value `);
         const boxing_result1 = await client.query(`SELECT machine_id as value, machine_no || COALESCE(' - ' || machine_name,'') as label FROm tbl_ironmachine_master`);
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
          const boxing_Result = await client.query(`SELECT * from (SELECT distinct a.job_id, a.design_id  ,d.qr_code , COALESCE(total_pieces,0)- COALESCE((SELECT sum(COALESCE(no_of_pieces,0)) from tbl_fg_job_details WHERE job_id=a.job_id),0) as total_qty,completed_date  from tbl_job_details as a INNER JOIN tbl_item_sizes as d  on a.design_id=d.size_id WHERE a.status_id=3 AND a.design_id  in (${keyWithQoutes})) as dev WHERE dev.total_qty>0  ORDER BY completed_date`); 
        
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
        try {
          // Start Transaction                        
          await client.query('BEGIN')
          var makerid = await commonService.insertLogs(user_id, "Insert Finished Goods");
        const id_max = await client.query(`SELECT COALESCE (max(fg_id),0) + 1 as fgid FROM tbl_fg_items`)
        fgid = id_max && id_max.rows[0].fgid;
        if(box_array && box_array.length > 0 ){       
          for(let i=0; i < box_array.length; i++){
            const total_set  = Number(box_array[i].qty) || 0
            const no_of_pieces  = Number(box_array[i].total_set) || 0
            const total_piece = total_set * no_of_pieces
            await client.query(`INSERT INTO tbl_stock_transaction(
              stock_date, size_id, trans_no, inward_set, outward_set, user_id, created_date, maker_id, inward_pieces, outward_pieces, type)
             VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, $8, $9, $10)`, [box_array[i].boxingdate, box_array[i].value, fgid, box_array[i].qty, 0,  user_id,makerid,total_piece,0,'FinishedGood']);
            await client.query(`INSERT INTO  tbl_fg_items(fg_id, size_id,no_of_set, no_of_pieces, user_id, created_at, updated_at, ironmachine_id, date) VALUES ($1, $2, $3, $4,$5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $6,$7) `,[fgid, box_array[i].value, box_array[i].qty,total_piece, user_id, box_array[i].machineid,box_array[i].boxingdate]);        
          } 
        }
          // Commit Changes                   
          await client.query('COMMIT')
        } catch (error) {
          await client.query('ROLLBACK')
          if (client) { client.end(); }
          throw new Error(error); 
        }
        
      }
      if(process == 'update') {
        try {
          // Start Transaction                        
          await client.query('BEGIN')
          var makerid = await commonService.insertLogs(user_id, "Update Finished Goods");
          if(box_array && box_array.length > 0 ){       
            for(let i=0; i < box_array.length; i++){
              const total_set  = Number(box_array[i].qty) || 0
              const no_of_pieces  = Number(box_array[i].total_set) || 0
              const total_piece = total_set * no_of_pieces
              await client.query(`UPDATE tbl_stock_transaction SET inward_set = $1 , inward_pieces = $2,
              maker_id = $3, updated_at=CURRENT_TIMESTAMP  WHERE trans_no = cast($4 as text) and size_id = $5`, [box_array[i].qty,total_piece,makerid, fgid, box_array[i].value]);
              await client.query(`UPDATE tbl_fg_items set no_of_set = $1, no_of_pieces = $2, user_id =$3,updated_at = CURRENT_TIMESTAMP WHERE fg_id = $4 `,[box_array[i].qty, total_piece, user_id, fg_id]);        
            } 
          }
          // Commit Changes                   
          await client.query('COMMIT')
        } catch (error) {
          await client.query('ROLLBACK')
          if (client) { client.end(); }
          throw new Error(error); 
        }        
      }     
     
      const FGPrint_Result = await client.query(`SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(settype for 1))) as designname,(SELECT machine_no || COALESCE(' - ' || machine_name,'') FROM tbl_ironmachine_master WHERE machine_id = a.ironmachine_id ) as machine_name,(SELECT machine_no FROM tbl_ironmachine_master WHERE machine_id = a.ironmachine_id ) as machine_no,f.user_name,to_char(date, 'dd-MM-YYYY') as fg_date,sum(a.no_of_set) as qty,b.qr_code,sum(a.no_of_pieces) as no_of_pieces,coalesce(settype,'') as settype FROM tbl_fg_items as a INNER JOIN tbl_item_sizes as b on a.size_id = b.size_id INNER JOIN tbl_item_management as c on b.trans_no = c.trans_no INNER JOIN tbl_def_item as d on c.item_code = d.item_id LEFT JOIN tbl_color as e on b.color_id = e.color_id INNER JOIN tbl_user as f on f.user_id=a.user_id WHERE a.fg_id = $1 GROUP BY a.fg_id, a.size_id,settype,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,f.user_name,a.date,b.qr_code ORDER BY date,a.fg_id`, [fgid]);
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
          fg_date = `date between '`+fg_from_date+`' AND '`+fg_to_date+`' `;
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
          const item_exec_Result = await client.query(`SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(settype for 1))) as designname,(SELECT machine_no || COALESCE(' - ' || machine_name,'') FROM tbl_ironmachine_master WHERE machine_id = a.ironmachine_id ) as machine_name,(SELECT machine_no FROM tbl_ironmachine_master WHERE machine_id = a.ironmachine_id ) as machine_no,f.user_name,to_char(date, 'dd-MM-YYYY') as fg_date,sum(a.no_of_set) as qty,b.qr_code,sum(a.no_of_pieces) as no_of_pieces,coalesce(settype,'') as settype,COALESCE(to_char(updated_at,'DD-MM-YYYY HH12:MI PM'),'') as fg_date_time FROM tbl_fg_items as a INNER JOIN tbl_item_sizes as b on a.size_id = b.size_id INNER JOIN tbl_item_management as c on b.trans_no = c.trans_no INNER JOIN tbl_def_item as d on
          c.item_code = d.item_id LEFT JOIN tbl_color as e on b.color_id = e.color_id 
          INNER JOIN tbl_user as f on f.user_id=a.user_id WHERE ${fg_date} AND ${size_code} AND ${machineid}
          GROUP BY a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,f.user_name,a.date,b.qr_code,settype,updated_at
          ORDER BY updated_at desc,a.fg_id desc ` ); 
          const boxing_widget = await client.query(`SELECT c.item_code,d.item_name,COALESCE(sum(a.no_of_set), 0) as qty, COALESCE(sum(a.no_of_pieces),0) as no_of_pieces FROM tbl_fg_items as a INNER JOIN tbl_item_sizes as b on a.size_id = b.size_id INNER JOIN tbl_item_management as c on b.trans_no = c.trans_no INNER JOIN tbl_def_item as d on c.item_code = d.item_id  WHERE ${fg_date} AND ${size_code} AND ${machineid}  GROUP BY  c.item_code,d.item_name`)
 
          let FG_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : []; 
          const company_Result = await client.query(`SELECT * from tbl_print_setting`);
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows : []; 
          responseData = { "FGArray": FG_array, "Company_Array":Company_Array,"FGWidget":  boxing_widget && boxing_widget.rows ? boxing_widget.rows : [] }
        } else {   
           // const fg_total_Result = await client.query(`SELECT count(fg_id) as totalcount from (SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(e.color_name for 1))) as designname,(SELECT machine_no || coalesce(' - ' || machine_name,'') FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_name,(SELECT machine_no FROM tbl_ironmachine_master where machine_id = a.ironmachine_id ) as machine_no,f.user_name,to_char(date, 'dd-MM-YYYY') as fg_date,sum(a.no_of_set) as qty,b.qr_code,sum(a.no_of_pieces) as no_of_pieces FROM tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id = b.size_id inner join tbl_item_management as c on b.trans_no = c.trans_no inner join tbl_def_item as d on  c.item_code = d.item_id left join tbl_color as e on b.color_id = e.color_id 
        // inner join tbl_user as f on f.user_id=a.user_id where ${fg_date} and ${size_code} and ${machineid}
        // group by a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,f.user_name,a.date,b.qr_code
        // order by date,a.fg_id desc  ) as dev  ` );       
        const fg_total_Result = await client.query(`SELECT count(fg_id) as totalcount from (SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(settype for 1))) as designname,(SELECT machine_no || COALESCE(' - ' || machine_name,'') FROM tbl_ironmachine_master WHERE machine_id = a.ironmachine_id ) as machine_name,(SELECT machine_no FROM tbl_ironmachine_master WHERE machine_id = a.ironmachine_id ) as machine_no,f.user_name,to_char(date, 'dd-MM-YYYY') as fg_date,sum(a.no_of_set) as qty,b.qr_code,sum(a.no_of_pieces) as no_of_pieces,coalesce(settype,'') as settype,COALESCE(to_char(updated_at,'DD-MM-YYYY HH12:MI PM'),'') as fg_date_time FROM tbl_fg_items as a INNER JOIN tbl_item_sizes as b on a.size_id = b.size_id INNER JOIN tbl_item_management as c on b.trans_no = c.trans_no INNER JOIN tbl_def_item as d on  c.item_code = d.item_id LEFT JOIN tbl_color as e on b.color_id = e.color_id 
        INNER JOIN tbl_user as f on f.user_id=a.user_id WHERE ${fg_date} AND ${size_code} AND ${machineid}
        GROUP BY a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,f.user_name,a.date,b.qr_code,settype,updated_at
        ORDER BY updated_at desc,a.fg_id desc  ) as dev  ` ); 
        let fg_total = fg_total_Result && fg_total_Result.rows.length > 0 ? fg_total_Result.rows[0].totalcount : 0; 
        // const boxing_Result = await client.query(` SELECT a.size_id,sum(a.no_of_set) as qty,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a  INNER JOIN tbl_item_sizes as b on a.size_id=b.size_id   INNER JOIN tbl_user as c on c.user_id=a.user_id  INNER JOIN tbl_item_management as d on d.trans_no =b.trans_no WHERE ${fg_date} AND ${design_code} AND ${customer_code} GROUP BY a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id  `);
        const boxing_widget = await client.query(`SELECT c.item_code,d.item_name,COALESCE(sum(a.no_of_set), 0) as qty, COALESCE(sum(a.no_of_pieces),0) as no_of_pieces FROM tbl_fg_items as a INNER JOIN tbl_item_sizes as b on a.size_id = b.size_id INNER JOIN tbl_item_management as c on b.trans_no = c.trans_no INNER JOIN tbl_def_item as d on c.item_code = d.item_id  WHERE ${fg_date} AND ${size_code} AND ${machineid}  GROUP BY  c.item_code,d.item_name`)
 
        const boxing_total_set =await client.query(`SELECT COALESCE(sum(a.no_of_set),0) as qty,
        COALESCE(sum(a.no_of_pieces),0) as no_of_pieces FROM tbl_fg_items as a INNER JOIN tbl_item_sizes 
        as b on a.size_id = b.size_id INNER JOIN tbl_item_management as c on b.trans_no = c.trans_no INNER JOIN tbl_def_item as d on c.item_code = d.item_id  WHERE ${fg_date} AND ${size_code} AND ${machineid}`);
 
        const boxing_Result = await client.query(`SELECT a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,concat(c.design_id,' - ',(SELECT substring(settype for 1))) as designname,(SELECT machine_no || COALESCE(' - ' || machine_name,'') FROM tbl_ironmachine_master WHERE machine_id = a.ironmachine_id ) as machine_name,(SELECT machine_no FROM tbl_ironmachine_master WHERE machine_id = a.ironmachine_id ) as machine_no,f.user_name,to_char(date, 'dd-MM-YYYY') as fg_date,sum(a.no_of_set) as qty,b.qr_code,sum(a.no_of_pieces) as no_of_pieces,coalesce(settype,'') as settype,COALESCE(to_char(updated_at,'DD-MM-YYYY HH12:MI PM'),'') as fg_date_time FROM tbl_fg_items as a INNER JOIN tbl_item_sizes as b on a.size_id = b.size_id INNER JOIN tbl_item_management as c on b.trans_no = c.trans_no INNER JOIN tbl_def_item as d on
        c.item_code = d.item_id LEFT JOIN tbl_color as e on b.color_id = e.color_id 
        INNER JOIN tbl_user as f on f.user_id=a.user_id WHERE ${fg_date} AND ${size_code} AND ${machineid}
        GROUP BY a.fg_id, a.size_id,e.color_name,c.design_id,d.item_name,start_size,end_size,total_set,ironmachine_id,f.user_name,a.date,b.qr_code,settype,updated_at
        ORDER BY updated_at desc,a.fg_id desc  ${get_limit} `);
        responseData = { "FGArray": boxing_Result && boxing_Result.rows ? boxing_Result.rows : [],"FG_total":fg_total, "FGWidget":  boxing_widget && boxing_widget.rows ? boxing_widget.rows : [], "FGTotalSet" : boxing_total_set && boxing_total_set.rows ? boxing_total_set.rows : []  }
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
          const Current_Stock_Result = await client.query(`SELECT a.size_id,((SUM(a.no_of_set) + COALESCE((SELECT SUM(goods_return_set) FROM tbl_goods_return WHERE status_flag = 1 AND size_id = a.size_id ),0)) - COALESCE((SELECT sum(dispatch_set) FROM tbl_dispatch_details WHERE status_flag = 1 AND  size_id = a.size_id ),0)) as qty,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a  
          INNER JOIN tbl_item_sizes AS b ON a.size_id=b.size_id  
          INNER JOIN tbl_user AS c ON c.user_id=a.user_id  INNER JOIN 
          tbl_item_management AS d ON d.trans_no =b.trans_no LEFT JOIN tbl_color AS f ON f.color_id =b.color_id INNER JOIN tbl_def_item AS e ON d.item_code = e.item_id WHERE ${designid_val}  AND ${machineid} AND ${getset_type}
          GROUP BY a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id ORDER BY d.design_id ` ); 
          let CS_array = Current_Stock_Result && Current_Stock_Result.rows ? Current_Stock_Result.rows : []; 
          const company_Result = await client.query(`SELECT * from tbl_print_setting`);
          
          const Current_Stock_widget = await client.query( ` SELECT item_name,item_id,sum(current_pieces) as current_pieces,sum(current_set) as current_set,count(item_id) as count from (SELECT d.item_code,
            COALESCE((sum(COALESCE(no_of_set,0)) +  COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 AND  size_id = a.size_id ),0)) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as current_set,COALESCE((sum(COALESCE(no_of_pieces,0)) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1 AND  size_id = a.size_id ),0)) - (SELECT COALESCE(sum(dispatch_pieces),0) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id )) as current_pieces from tbl_fg_items as a INNER JOIN tbl_item_sizes as c on c.size_id=a.size_id
          INNER JOIN tbl_item_management as d on c.trans_no=d.trans_no LEFT JOIN tbl_color as f on f.color_id =c.color_id WHERE ${designid_val}  AND ${getsettype} GROUP BY d.item_code,a.size_id ORDER BY d.item_code ) as dev INNER JOIN tbl_def_item as e on dev.item_code = e.item_id  GROUP BY item_name,item_id ORDER BY item_id`);
          
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows : []; 
          responseData = { "CurrentStockArray": CS_array, "Company_Array":Company_Array,"CurrentStockwidget":Current_Stock_widget && Current_Stock_widget.rows ? Current_Stock_widget.rows : [] }
        } else {
          
          // 2nd try
          // const Pending_Orders = await client.query(`SELECT item_name,f.item_id,COALESCE((qty-dispatch_set),0) as pending_set,COALESCE((order_pieces-dispatch_pieces),0) as pending_pieces from (SELECT item_code, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT d.item_code,sum(b.qty) as qty,sum(qty*COALESCE(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a INNER JOIN tbl_order_taking_items as b on a.order_no =b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no inner  join tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id WHERE ${designid_val}  AND ${getcolor_id} AND a.status_code = 1 GROUP BY d.item_code
          //             union all
          // SELECT d.item_code,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b INNER JOIN tbl_order_taking as a on a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code  
          // left join tbl_color as f on f.color_id =c.color_id   WHERE status_flag = 1 AND ${designid_val}  AND ${getcolor_id} AND a.status_code = 1 GROUP BY d.item_code) as dev  GROUP BY item_code ) as d1 right join tbl_def_item as f on d1.item_code = f.item_id `)
 
          const Pending_Orders = await client.query(`SELECT item_id,item_name,sum(pending_set) as pending_set,sum(pending_pieces) AS pending_pieces FROM(SELECT a.order_no,item_id,item_name,pending_dispatch AS pending_set ,b.size_id,(total_set :: INTEGER * pending_dispatch) AS pending_pieces FROM tbl_order_taking AS a INNER JOIN tbl_order_taking_items AS b ON a.order_no = b.order_no
          INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id 
          INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no 
          INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code 
          LEFT JOIN tbl_color as f on f.color_id =c.color_id
          INNER JOIN tbl_def_item as g on d.item_code = g.item_id
          WHERE ${designid_val}  AND ${getsettype} AND a.status_code = 1 AND (a.close_status != 1 OR a.close_status is null) AND pending_dispatch > 0) AS DERV
          GROUP BY item_id,item_name `)
          let pending_order_result = Pending_Orders && Pending_Orders.rows ? Pending_Orders.rows : []
          
 // 2nd chanes
          // const NotReadyForDispatch = await client.query(`SELECT item_name,f.item_id,COALESCE(not_ready_set,0) as not_ready_set,COALESCE(not_ready_pieces,0) as not_ready_pieces from (SELECT item_code, sum(not_ready_set) as not_ready_set,sum(not_ready_pieces) as not_ready_pieces from (SELECT item_code,size_id, COALESCE((qty-fg_set),0) as not_ready_set,COALESCE((order_pieces- fg_pieces ),0) as not_ready_pieces from 
          //   (SELECT item_code,size_id, sum(qty) as qty,sum(order_pieces) as order_pieces,   sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces,COALESCE((SELECT sum(no_of_set) from 
          // tbl_fg_items WHERE size_id = t1.size_id ),0)  +  COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and  size_id = t1.size_id ),0) as fg_set,COALESCE((SELECT sum(no_of_pieces) from tbl_fg_items WHERE size_id = t1.size_id ),0) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1 and  size_id = t1.size_id ),0) as fg_pieces from (SELECT b.size_id,d.item_code,sum(b.qty) as qty,sum(qty*COALESCE(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a INNER JOIN tbl_order_taking_items as b on a.order_no =b.order_no INNER JOIN tbl_item_sizes as c  ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id WHERE ${designid_val}  AND ${getcolor_id} AND a.status_code = 1 GROUP BY b.size_id,d.item_code
          //            union all
          //   SELECT b.size_id,d.item_code,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,
          //   sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b INNER JOIN               
          //   tbl_order_taking as a on a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = 
          //   b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no INNER JOIN tbl_customer 
          //   as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id 
          //   WHERE status_flag = 1 AND ${designid_val}  AND ${getcolor_id} AND a.status_code = 1 
          //   GROUP BY b.size_id,d.item_code)as t1 WHERE size_id not in (SELECT size_id from 
          // (SELECT size_id, COALESCE(COALESCE(sum(COALESCE(no_of_set,0)) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as  current_set,COALESCE(COALESCE((SELECT sum(qty) from tbl_order_taking_items WHERE status_code = 1 AND size_id = a.size_id ),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as pending_set from tbl_fg_items as a GROUP BY size_id) as dev WHERE current_set > pending_set) GROUP BY item_code,t1.size_id) as t2  WHERE COALESCE((qty-fg_set),0) > 0) as dev GROUP BY item_code) as d1 right join tbl_def_item  as f on d1.item_code = f.item_id `)
          const NotReadyForDispatch = await client.query(`SELECT item_name,f.item_id,sum(pending_set - current_set) AS not_ready_set,
          sum(pending_pieces - current_pieces) AS not_ready_pieces FROM (SELECT item_code,size_id,sum(current_set) AS current_set,sum(current_pieces) AS current_pieces,sum(pending_set) AS pending_set,sum(pending_pieces) AS pending_pieces FROM(
          SELECT d.item_code,a.size_id,sum(inward_set) - sum(outward_set) AS current_set,sum(inward_pieces) - sum(outward_pieces) AS current_pieces,0 AS pending_set,0 AS pending_pieces FROM tbl_stock_transaction AS a 
          INNER JOIN tbl_item_sizes AS b ON a.size_id =b.size_id
          INNER JOIN tbl_item_management AS d ON d.trans_no=b.trans_no 
          LEFT JOIN tbl_color AS f ON f.color_id =b.color_id
          WHERE ${designid_val}  AND ${getset_type} AND type!= 'Order' GROUP BY d.item_code,a.size_id
          UNION ALL
          SELECT d.item_code,b.size_id,0 AS current_set,0 AS current_pieces,sum(pending_dispatch) AS pending_set,sum(pending_dispatch * c.total_set :: INTEGER) AS pending_pieces FROM tbl_order_taking AS a INNER JOIN tbl_order_taking_items AS b ON a.order_no = b.order_no
          INNER JOIN tbl_item_sizes AS c ON c.size_id =b.size_id
          INNER JOIN tbl_item_management AS d ON d.trans_no=c.trans_no 
          LEFT JOIN tbl_color AS f ON f.color_id =c.color_id
          WHERE ${designid_val}  AND ${getsettype} AND  a.status_code = 1 AND (a.close_status != 1 OR a.close_status is null) GROUP BY d.item_code,b.size_id) AS DERV GROUP BY item_code,size_id)
          AS DER RIGHT JOIN tbl_def_item  AS f ON DER.item_code = f.item_id WHERE COALESCE((pending_set-current_set),0) > 0  
          GROUP BY  item_name,f.item_id `)
           let not_ready_stock_result = NotReadyForDispatch && NotReadyForDispatch.rows ? NotReadyForDispatch.rows : []
          
          //  2 nd try
          // const Excess_stock = await client.query(`SELECT item_code,sum(current_set-pending_set) as excess_set,sum(current_pieces-pending_pieces) as excess_pieces from (SELECT item_code,size_id,sum(pending_set) as pending_set,sum(pending_pieces) as pending_pieces,sum(current_set) as current_set,sum(current_pieces) as current_pieces from(SELECT item_code,size_id, COALESCE((qty-dispatch_set),0) as pending_set,COALESCE((order_pieces-dispatch_pieces),0) as pending_pieces,0 as current_set, 0 as current_pieces from (SELECT d.item_code,b.size_id,sum(b.qty) as qty,sum(qty*COALESCE(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a INNER JOIN tbl_order_taking_items as b on a.order_no =b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no inner           
          //  join tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id WHERE  a.status_code = 1 AND ${designid_val}  AND ${getcolor_id}  GROUP BY d.item_code,b.size_id
          //                       union all
          //  SELECT d.item_code,b.size_id,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,         sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b INNER JOIN                tbl_order_taking as a on a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON                 c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no                 INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id WHERE status_flag = 1 AND  
          //  ${designid_val}  AND ${getcolor_id} AND a.status_code = 1 GROUP BY d.item_code,b.size_id
          //    ) as dev union all
          //    SELECT d.item_code,a.size_id,0 as pending_set,0 as pending_pieces,COALESCE(COALESCE(sum(COALESCE(no_of_set,0)) +  COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0)- COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as current_set,COALESCE(COALESCE(sum(COALESCE(no_of_pieces,0)) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1  and size_id = a.size_id ),0), 0) - (SELECT COALESCE(sum(dispatch_pieces),0) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id )) as current_pieces from tbl_fg_items as a INNER JOIN tbl_item_sizes as c on c.size_id=a.size_id INNER JOIN tbl_item_management as d on c.trans_no=d.trans_no 
          //    left join tbl_color as f on f.color_id =c.color_id WHERE ${designid_val}  AND ${getset_type}
          //     GROUP BY d.item_code,a.size_id ) as d1 GROUP BY item_code,size_id) as t1 WHERE current_set > pending_set GROUP BY item_code`);
          
          const Excess_stock = await client.query(`SELECT item_code,sum(current_set - pending_set) as excess_set,
          sum(current_pieces - pending_pieces) as excess_pieces FROM (SELECT item_code,size_id,sum(current_set) as current_set,sum(current_pieces) as current_pieces,sum(pending_set) as pending_set,sum(pending_pieces) as pending_pieces FROM(
          SELECT d.item_code,a.size_id,sum(inward_set) - sum(outward_set) as current_set,sum(inward_pieces) - sum(outward_pieces) as current_pieces,0 as pending_set,0 as pending_pieces
          FROM tbl_stock_transaction as a 
          INNER JOIN tbl_item_sizes AS b on a.size_id =b.size_id
          INNER JOIN tbl_item_management as d on d.trans_no=b.trans_no 
          LEFT JOIN tbl_color as f on f.color_id =b.color_id
          WHERE type!= 'Order' AND ${designid_val}  AND ${getset_type} GROUP BY d.item_code,a.size_id
          UNION ALL
          SELECT d.item_code,b.size_id,0 as current_set,0 as current_pieces,sum(pending_dispatch) as pending_set,sum(pending_dispatch * c.total_set :: INTEGER) as pending_pieces FROM tbl_order_taking AS a INNER JOIN 
          tbl_order_taking_items AS b ON a.order_no = b.order_no
          INNER JOIN tbl_item_sizes AS c on c.size_id =b.size_id
          INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no 
          LEFT JOIN tbl_color as f on f.color_id =c.color_id
          WHERE a.status_code = 1 AND (a.close_status != 1 OR a.close_status is null) AND ${designid_val}  AND ${getsettype} GROUP BY d.item_code,b.size_id) AS DERV GROUP BY item_code,size_id)
          AS DER WHERE  current_set  > pending_set GROUP BY  item_code`);
          
          let excess_stock_result = Excess_stock && Excess_stock.rows ? Excess_stock.rows : []         
          
          // const Current_Stock_widget = await client.query( ` SELECT item_name,item_id,COALESCE(sum(current_pieces),0) as current_pieces,COALESCE(sum(current_set),0) as current_set,count(item_id) as count from (SELECT d.item_code,COALESCE(COALESCE(sum(COALESCE(no_of_set,0)) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as current_set,COALESCE(COALESCE(sum(COALESCE(no_of_pieces,0)) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - (SELECT COALESCE(sum(dispatch_pieces),0) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id )) as current_pieces from tbl_fg_items as a INNER JOIN tbl_item_sizes as c on c.size_id=a.size_id  INNER JOIN tbl_item_management as d on c.trans_no=d.trans_no 
          //   left join tbl_color as f on f.color_id =c.color_id WHERE ${designid_val}  AND ${getset_type} GROUP BY d.item_code,a.size_id ORDER BY d.item_code ) as dev right join tbl_def_item as
          //   e on dev.item_code = e.item_id  GROUP BY item_name,item_id ORDER BY item_id`);
          const Current_Stock_widget = await client.query( ` SELECT item_name,item_id,sum(COALESCE(current_set,0)) as current_set,sum(COALESCE(current_pieces,0)) as current_pieces FROM (SELECT d.item_code,a.size_id,(sum(inward_set) - sum(outward_set)) as current_set, 
          (sum(inward_pieces) - sum(outward_pieces)) as current_pieces FROM tbl_stock_transaction AS a INNER JOIN tbl_item_sizes as c on c.size_id=a.size_id  INNER JOIN tbl_item_management as d on c.trans_no=d.trans_no LEFT JOIN tbl_color as f on f.color_id =c.color_id WHERE type!='Order' AND ${designid_val}  AND ${getsettype} group by d.item_code,a.size_id) AS DERV RIGHT JOIN tbl_def_item as e on DERV.item_code = e.item_id GROUP BY item_name,item_id ORDER BY item_id`);
         
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
          // const total_Current_stock = await client.query(`SELECT item_code,sum(qty) as qty,design_id from (SELECT a.size_id,d.item_code,(COALESCE(sum(a.no_of_set) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0)) as qty,COALESCE(COALESCE(sum(COALESCE(no_of_pieces,0)) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - (SELECT COALESCE(sum(dispatch_pieces),0) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id )) as current_pieces,d.design_id 
          // from tbl_fg_items as a INNER JOIN tbl_item_sizes as b on a.size_id=b.size_id  INNER JOIN tbl_user 
          // as c on c.user_id=a.user_id  INNER JOIN tbl_item_management as d on d.trans_no =b.trans_no left join tbl_color as f on f.color_id =b.color_id INNER JOIN tbl_def_item as e on d.item_code = e.item_id WHERE ${designid_val}  AND ${machineid} AND ${getsettype} AND e.item_id = ${item_code} GROUP BY d.item_code,d.design_id,a.size_id ORDER BY d.design_id ) as dev WHERE qty > 0 GROUP BY item_code,design_id`)
 
          const total_Current_stock = await client.query(`SELECT item_code,design_id,sum(current_set) AS qty, sum(current_pieces) AS current_pieces FROM (SELECT d.item_code,
          a.size_id,d.design_id,(sum(inward_set) - sum(outward_set)) AS current_set, 
                    (sum(inward_pieces) - sum(outward_pieces)) AS current_pieces FROM 
          tbl_stock_transaction AS a INNER JOIN tbl_item_sizes AS c ON c.size_id=a.size_id  
          INNER JOIN tbl_item_management as d on c.trans_no=d.trans_no LEFT JOIN tbl_color AS 
          f ON f.color_id =c.color_id WHERE type!='Order' AND ${designid_val}  AND ${getsettype} AND d.item_code = ${item_code} GROUP BY d.item_code,a.size_id,d.design_id) AS DEV WHERE current_set > 0 GROUP BY item_code,design_id 
          ORDER BY design_id`)
          let Current_stock_total = total_Current_stock && total_Current_stock.rows.length > 0 ? total_Current_stock.rowCount : 0; 
          // const Current_stock = await client.query(`SELECT item_code,sum(qty) as qty,sum(current_pieces) as current_pieces,design_id from (SELECT a.size_id,d.item_code,(COALESCE(sum(a.no_of_set) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0)) as qty,COALESCE(COALESCE(sum(COALESCE(no_of_pieces,0)) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - (SELECT COALESCE(sum(dispatch_pieces),0) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id )) as current_pieces,d.design_id 
          // from tbl_fg_items as a INNER JOIN tbl_item_sizes as b on a.size_id=b.size_id  INNER JOIN tbl_user 
          // as c on c.user_id=a.user_id  INNER JOIN tbl_item_management as d on d.trans_no =b.trans_no left join tbl_color as f on f.color_id =b.color_id INNER JOIN tbl_def_item as e on d.item_code = e.item_id WHERE ${designid_val}  AND ${machineid} AND ${getsettype} AND e.item_id = ${item_code} GROUP BY d.item_code,d.design_id,a.size_id ORDER BY d.design_id ) as dev WHERE qty > 0 GROUP BY item_code,design_id ${get_limit}`)
 
          const Current_stock = await client.query(`SELECT item_code,design_id,sum(current_set) AS qty, sum(current_pieces) AS current_pieces FROM (SELECT d.item_code,a.size_id,d.design_id,(sum(inward_set) - sum(outward_set)) AS current_set,(sum(inward_pieces) - sum(outward_pieces)) AS current_pieces FROM 
            tbl_stock_transaction AS a INNER JOIN tbl_item_sizes AS c ON c.size_id=a.size_id  
            INNER JOIN tbl_item_management as d on c.trans_no=d.trans_no LEFT JOIN tbl_color AS 
            f ON f.color_id =c.color_id WHERE type!='Order' AND ${designid_val}  AND ${getsettype} AND d.item_code = ${item_code} GROUP BY d.item_code,a.size_id,d.design_id) AS DEV WHERE current_set > 0 GROUP BY item_code,design_id ORDER BY design_id ${get_limit}`)
          let Current_stock_array = Current_stock && Current_stock.rows ? Current_stock.rows : []; 
            let result = [];
            if (Current_stock_array.length > 0) {
              for (let i = 0; i < Current_stock_array.length; i++) {
                // const item_Result = await client.query(` SELECT * FROM (SELECT a.size_id,(COALESCE(sum(a.no_of_set) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0)) as qty,COALESCE(COALESCE(sum(COALESCE(no_of_pieces,0)) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - (SELECT COALESCE(sum(dispatch_pieces),0) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id )) as current_pieces,a.user_id,b.qr_code,c.user_name,d.design_id from tbl_fg_items as a INNER JOIN tbl_item_sizes as b on a.size_id=b.size_id  INNER JOIN tbl_user as c on c.user_id=a.user_id  INNER JOIN tbl_item_management as d on d.trans_no =b.trans_no left join tbl_color as f on f.color_id =b.color_id  INNER JOIN tbl_def_item as e on d.item_code = e.item_id WHERE ${designid_val}  AND ${machineid} AND ${getcolor_id} AND d.design_id = $1 GROUP BY a.size_id,a.user_id,b.qr_code,c.user_name,d.design_id ORDER BY d.design_id) AS DERV WHERE qty > 0`,[Current_stock_array[i].design_id] );
 
                const item_Result = await client.query(`SELECT size_id,design_id,qr_code,sum(current_set) as qty,sum(current_pieces) as current_pieces FROM (SELECT a.size_id,d.design_id,qr_code,
                (sum(inward_set) - sum(outward_set)) as current_set,(sum(inward_pieces) - sum(outward_pieces)) as current_pieces FROM tbl_stock_transaction AS a INNER JOIN tbl_item_sizes as c on c.size_id=a.size_id INNER JOIN tbl_item_management as d on c.trans_no=d.trans_no LEFT JOIN tbl_color as f on f.color_id =c.color_id WHERE type!='Order' AND  ${getsettype} AND d.design_id = $1 group by d.item_code,d.design_id,a.size_id,qr_code) AS DEV WHERE current_set > 0 GROUP BY design_id,size_id,qr_code`,[Current_stock_array[i].design_id] );
                let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
                let obj = Current_stock_array[i]
                obj['ItemArray'] = item_Array
                result.push(obj)
              }
            }
            responseData = { "Stock_Array": result , "Stock_Total":Current_stock_total}           
        }
        if(process == 'pendingstock'){
          // 2nd try
          // const total_Pending_stock = await client.query(`Select order_no,customer_name,city,COALESCE((qty-dispatch_set),0) as pending_set,COALESCE((order_pieces-dispatch_pieces),0) as pending_pieces from (SELECT order_no,customer_name,city, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT a.order_no,e.customer_name,e.city,a.customer_code,d.design_id,d.item_code,sum(b.qty) as qty,sum(qty*COALESCE(c.total_set,'0')::Integer) as 
          // order_pieces,0 as dispatch_set,0 as dispatch_pieces FROM tbl_order_taking as a INNER JOIN tbl_order_taking_items as b on a.order_no =b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id  INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code WHERE ${designid_val}  AND ${getsettype}
          // AND d.item_code = ${item_code} AND a.status_code = 1 GROUP BY a.order_no,e.customer_name,e.city,a.customer_code,d.item_code,d.design_id
          //                                           union all
          //   SELECT a.order_no,e.customer_name,e.city,a.customer_code,d.design_id,d.item_code,0 as qty,
          // 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b INNER JOIN tbl_order_taking as a on a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code  WHERE status_flag = 1 AND ${designid_val}  AND ${getcolor_id} AND d.item_code = ${item_code} AND 
          // a.status_code = 1 GROUP BY a.order_no,e.customer_name,e.city,a.customer_code,d.item_code,d.design_id) as dev GROUP BY order_no,customer_name,city ORDER BY order_no) as d1 WHERE COALESCE((qty-dispatch_set),0) > 0 ORDER BY order_no`)
 
          const total_Pending_stock = await client.query(`SELECT order_no,customer_name,city,customer_code
          ,sum(pending_set) as qty,sum(pending_pieces) AS pending_pieces FROM(
            SELECT a.order_no,e.customer_name,e.city,a.customer_code,pending_dispatch AS pending_set 
            ,b.size_id,(total_set :: INTEGER * pending_dispatch) AS pending_pieces FROM 
            tbl_order_taking AS a INNER JOIN tbl_order_taking_items AS b ON a.order_no = b.order_no
                    INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id 
                    INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no 
                    INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code 
                    LEFT JOIN tbl_color as f on f.color_id =c.color_id
                    INNER JOIN tbl_def_item as g on d.item_code = g.item_id
                    WHERE ${designid_val}  AND ${getsettype} AND d.item_code = ${item_code}  AND a.status_code = 1 and pending_dispatch > 0 AND (a.close_status != 1 OR a.close_status is null)) AS DERV
                    GROUP BY order_no,customer_name,city,customer_code ORDER BY order_no`)
          let Pending_stock_total = total_Pending_stock && total_Pending_stock.rows.length > 0 ? total_Pending_stock.rowCount : 0; 
          
          // const Pending_stock = await client.query(`Select order_no,customer_name,city,COALESCE((qty-dispatch_set),0) as pending_set,COALESCE((order_pieces-dispatch_pieces),0) as pending_pieces from (SELECT order_no,customer_name,city, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces from (SELECT a.order_no,e.customer_name,e.city,a.customer_code,d.design_id,d.item_code,sum(b.qty) as qty,sum(qty*COALESCE(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set,0 as dispatch_pieces FROM tbl_order_taking as a INNER JOIN tbl_order_taking_items as b on a.order_no =b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code WHERE ${designid_val}  AND ${getcolor_id}
          //  AND d.item_code = ${item_code} AND a.status_code = 1 GROUP BY a.order_no,e.customer_name,e.city,a.customer_code,d.item_code,d.design_id
          //                                            union all
          //    SELECT a.order_no,e.customer_name,e.city,a.customer_code,d.design_id,d.item_code,0 as qty,
          //  0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b INNER JOIN tbl_order_taking as a on a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code  WHERE status_flag = 1 AND ${designid_val}  AND ${getcolor_id} AND d.item_code = ${item_code} AND 
          //  a.status_code = 1 GROUP BY a.order_no,e.customer_name,e.city,a.customer_code,d.item_code,d.design_id) as dev GROUP BY order_no,customer_name,city ORDER BY order_no) as d1 WHERE COALESCE((qty-dispatch_set),0) > 0 ORDER BY order_no ${get_limit}`);
 
          const Pending_stock = await client.query(`SELECT order_no,customer_name,city,customer_code
          ,sum(pending_set) as pending_set,sum(pending_pieces) AS pending_pieces FROM(
            SELECT a.order_no,e.customer_name,e.city,a.customer_code,pending_dispatch AS pending_set 
            ,b.size_id,(total_set :: INTEGER * pending_dispatch) AS pending_pieces FROM 
            tbl_order_taking AS a INNER JOIN tbl_order_taking_items AS b ON a.order_no = b.order_no
                    INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id 
                    INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no 
                    INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code 
                    LEFT JOIN tbl_color as f on f.color_id =c.color_id
                    INNER JOIN tbl_def_item as g on d.item_code = g.item_id
                    WHERE ${designid_val}  AND ${getsettype} AND d.item_code = ${item_code}  AND a.status_code = 1 and pending_dispatch > 0 AND (a.close_status != 1 OR a.close_status is null)) AS DERV
                    GROUP BY order_no,customer_name,city,customer_code ORDER BY order_no ${get_limit}`);
          let Pending_stock_array = Pending_stock && Pending_stock.rows ? Pending_stock.rows : []; 
            responseData = { "Stock_Array": Pending_stock_array , "Stock_Total":Pending_stock_total}           
        }
        if(process == 'requiredstock'){
          // const total_Required_stock = await client.query(`SELECT design_id,item_code,COALESCE(((qty-dispatch_set)-fg_set),0) as not_ready_set,COALESCE(((order_pieces-dispatch_pieces)- fg_pieces),0) as not_ready_pieces from (SELECT design_id,item_code,sum(qty) as qty,sum(order_pieces) as order_pieces, sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces,sum(fg_set) as  fg_set,sum(fg_pieces) as fg_pieces from (SELECT design_id,item_code, sum(qty) as qty,
          // sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as 
          // dispatch_pieces,COALESCE((SELECT sum(no_of_set) from tbl_fg_items WHERE size_id = t1.size_id ),0)
          // as fg_set,COALESCE((SELECT sum(no_of_pieces) from tbl_fg_items WHERE size_id = t1.size_id ),0) as 
          // fg_pieces from (SELECT d.design_id,b.size_id,d.item_code,sum(b.qty) as qty,
          // sum(qty*COALESCE(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces 
          // FROM tbl_order_taking as a INNER JOIN tbl_order_taking_items as b on a.order_no =b.order_no inner 
          // join tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on 
          // d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code WHERE ${designid_val}  AND ${getcolor_id} AND a.status_code = 1 AND d.item_code = ${item_code} GROUP BY d.design_id,b.size_id,d.item_code
          //                                 union all
          //           SELECT d.design_id,b.size_id,d.item_code,0 as qty, 0 as order_pieces,sum(dispatch_set) 
          // as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b INNER JOIN 
          // tbl_order_taking as a on a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code WHERE status_flag = 1 AND d.item_code = ${item_code} AND ${designid_val}  AND ${getcolor_id} AND a.status_code = 1 GROUP BY d.design_id,b.size_id,d.item_code) as t1 WHERE size_id not in (SELECT size_id from (SELECT size_id, COALESCE(sum(COALESCE(no_of_set,0))- COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as current_set,COALESCE(COALESCE((SELECT sum(qty) from tbl_order_taking_items WHERE status_code = 1 AND size_id = a.size_id ),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as pending_set
          // from tbl_fg_items as a GROUP BY size_id) as dev WHERE current_set > pending_set) GROUP BY            item_code,design_id,t1.size_id) as dev GROUP BY item_code,design_id) as d1 WHERE COALESCE(((qty-dispatch_set)-fg_set),0) > 0 ORDER BY design_id`)
 
          // 2nd try
        //   const total_Required_stock = await client.query(`SELECT item_code,design_id,
        //   sum(not_ready_set) as not_ready_set,sum(not_ready_pieces) as not_ready_pieces
        //    from (SELECT item_code,design_id,size_id, COALESCE((qty-fg_set),0) as not_ready_set
        //    ,COALESCE((order_pieces- fg_pieces ),0) as not_ready_pieces from (SELECT item_code,design_id,size_id, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as 
        //     dispatch_set, sum(dispatch_pieces) as dispatch_pieces,COALESCE((SELECT sum(no_of_set) from 
        //  tbl_fg_items WHERE size_id = t1.size_id ),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = t1.size_id ),0) as fg_set,COALESCE((SELECT sum(no_of_pieces) from tbl_fg_items WHERE size_id = t1.size_id ),0) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1 and size_id = t1.size_id ),0) as fg_pieces from  (SELECT d.design_id,b.size_id,d.item_code,sum(b.qty) as qty,sum(qty*COALESCE(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a INNER JOIN tbl_order_taking_items as b on a.order_no =b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as  f on f.color_id =c.color_id WHERE d.item_code = ${item_code} AND ${designid_val}  AND ${getcolor_id} AND a.status_code = 1 GROUP BY d.design_id, b.size_id,d.item_code
        //             union all
        //   SELECT d.design_id,b.size_id,d.item_code,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b INNER JOIN     
        //    tbl_order_taking as a on a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = 
        //    b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no INNER JOIN tbl_customer 
        //    as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id 
        //    WHERE status_flag = 1 AND d.item_code = ${item_code} AND ${designid_val}  AND ${getcolor_id} AND a.status_code = 1 GROUP BY d.design_id,b.size_id,d.item_code)as t1 WHERE size_id not in (SELECT size_id from (SELECT size_id, COALESCE(COALESCE(sum(COALESCE(no_of_set,0)) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0)- COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as    current_set,COALESCE(COALESCE((SELECT sum(qty) from tbl_order_taking_items WHERE status_code = 1 AND size_id = a.size_id ),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE 
        //  status_flag = 1 AND size_id = a.size_id ),0),0) as pending_set from tbl_fg_items as a GROUP BY size_id) as dev WHERE current_set > pending_set) GROUP BY item_code,design_id,t1.size_id) as t2  WHERE COALESCE((qty-fg_set),0) > 0  ) as dev GROUP BY item_code,design_id ORDER BY design_id`)
 
        const total_Required_stock = await client.query(`SELECT item_code,design_id,sum(pending_set - current_set) AS not_ready_set,sum(pending_pieces - current_pieces) AS not_ready_pieces FROM (SELECT item_code,design_id,size_id,sum(current_set) AS current_set,sum(current_pieces) AS current_pieces,sum(pending_set) AS pending_set,sum(pending_pieces) AS pending_pieces FROM(
        SELECT d.item_code,d.design_id,a.size_id,sum(inward_set) - sum(outward_set) AS current_set,sum(inward_pieces) - sum(outward_pieces) AS current_pieces,0 AS pending_set,0 AS pending_pieces FROM tbl_stock_transaction AS a INNER JOIN tbl_item_sizes AS b ON a.size_id =b.size_id
        INNER JOIN tbl_item_management AS d ON d.trans_no=b.trans_no LEFT JOIN tbl_color AS f ON f.color_id =b.color_id WHERE d.item_code = ${item_code} AND ${designid_val}  AND ${getsettype} AND type!= 'Order' GROUP BY d.item_code,d.design_id,a.size_id
        UNION ALL
        SELECT d.item_code,d.design_id,b.size_id,0 AS current_set,0 AS current_pieces,sum(pending_dispatch) AS pending_set,sum(pending_dispatch * c.total_set :: INTEGER) AS pending_pieces FROM tbl_order_taking AS a INNER JOIN tbl_order_taking_items AS b ON a.order_no = b.order_no INNER JOIN tbl_item_sizes AS c ON c.size_id =b.size_id INNER JOIN tbl_item_management AS d ON d.trans_no=c.trans_no 
        LEFT JOIN tbl_color AS f ON f.color_id =c.color_id WHERE d.item_code = ${item_code} AND ${designid_val}  AND ${getsettype} AND  a.status_code = 1 AND (a.close_status != 1 OR a.close_status is null) GROUP BY d.item_code,d.design_id,b.size_id) AS DERV GROUP BY item_code,design_id,size_id)
        AS DER  WHERE COALESCE((pending_set-current_set),0) > 0  
        GROUP BY  item_code,design_id ORDER BY design_id`)
          let Current_required_total = total_Required_stock && total_Required_stock.rows.length > 0 ? total_Required_stock.rowCount : 0; 
          const Required_stock = await client.query(`SELECT item_code,design_id,sum(pending_set - current_set) AS not_ready_set,sum(pending_pieces - current_pieces) AS not_ready_pieces FROM (SELECT item_code,design_id,size_id,sum(current_set) AS current_set,sum(current_pieces) AS current_pieces,sum(pending_set) AS pending_set,sum(pending_pieces) AS pending_pieces FROM(
            SELECT d.item_code,d.design_id,a.size_id,sum(inward_set) - sum(outward_set) AS current_set,sum(inward_pieces) - sum(outward_pieces) AS current_pieces,0 AS pending_set,0 AS pending_pieces FROM tbl_stock_transaction AS a INNER JOIN tbl_item_sizes AS b ON a.size_id =b.size_id
            INNER JOIN tbl_item_management AS d ON d.trans_no=b.trans_no LEFT JOIN tbl_color AS f ON f.color_id =b.color_id WHERE d.item_code = ${item_code} AND ${designid_val}  AND ${getset_type} AND type!= 'Order' GROUP BY d.item_code,d.design_id,a.size_id
            UNION ALL
            SELECT d.item_code,d.design_id,b.size_id,0 AS current_set,0 AS current_pieces,sum(pending_dispatch) AS pending_set,sum(pending_dispatch * c.total_set :: INTEGER) AS pending_pieces FROM tbl_order_taking AS a INNER JOIN tbl_order_taking_items AS b ON a.order_no = b.order_no INNER JOIN tbl_item_sizes AS c ON c.size_id =b.size_id INNER JOIN tbl_item_management AS d ON d.trans_no=c.trans_no 
            LEFT JOIN tbl_color AS f ON f.color_id =c.color_id WHERE d.item_code = ${item_code} AND ${designid_val}  AND ${getsettype} AND  a.status_code = 1 AND (a.close_status != 1 OR a.close_status is null) GROUP BY d.item_code,d.design_id,b.size_id) AS DERV GROUP BY item_code,design_id,size_id)
            AS DER  WHERE COALESCE((pending_set-current_set),0) > 0  
            GROUP BY  item_code,design_id ORDER BY design_id ${get_limit}`)
          let Required_stock_array = Required_stock && Required_stock.rows ? Required_stock.rows : []; 
            let result = [];
            if (Required_stock_array.length > 0) {
              for (let i = 0; i < Required_stock_array.length; i++) {
                //  const item_Result = await client.query(`SELECT * FROM (SELECT design_id,item_code,size_id,qr_code,COALESCE((qty-fg_set),0) as not_ready_set,COALESCE((order_pieces-fg_pieces),0) as not_ready_pieces from (SELECT design_id,item_code,size_id,qr_code, sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces,sum(fg_set) as  fg_set,sum(fg_pieces) as fg_pieces from (SELECT design_id,item_code,size_id,qr_code,sum(qty) as qty,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set, sum(dispatch_pieces) as dispatch_pieces,COALESCE((SELECT sum(no_of_set) from tbl_fg_items WHERE size_id = t1.size_id ),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = t1.size_id ),0) as fg_set,COALESCE((SELECT sum(no_of_pieces) from tbl_fg_items WHERE size_id = t1.size_id ),0) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1 and size_id = t1.size_id ),0) as fg_pieces from (SELECT d.design_id,b.size_id,d.item_code,c.qr_code,sum(b.qty) as qty,sum(qty*COALESCE(c.total_set,'0')::Integer) as order_pieces,0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a INNER JOIN tbl_order_taking_items as b on a.order_no =b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code WHERE ${designid_val}  AND ${getcolor_id} AND a.status_code = 1 AND d.design_id = $1 GROUP BY d.design_id,b.size_id,
                // d.item_code,c.qr_code
                //                                       union all
                // SELECT d.design_id,b.size_id,d.item_code,c.qr_code,0 as qty, 0 as order_pieces,  
                // sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces                    
                // from tbl_dispatch_details as b INNER JOIN tbl_order_taking as a on                      
                // a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id          
                // INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no left join tbl_color as f on f.color_id =c.color_id INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code WHERE status_flag = 1 AND ${designid_val}  AND ${getsettype} AND a.status_code = 1 AND d.design_id = $1 GROUP BY d.design_id,b.size_id ,d.item_code,c.qr_code) as t1 WHERE size_id not in (SELECT size_id from (SELECT size_id, COALESCE(COALESCE(sum(COALESCE(no_of_set,0)) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0), 0)- COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as current_set,COALESCE(COALESCE((SELECT sum(qty) from tbl_order_taking_items WHERE status_code = 1 AND size_id = a.size_id ),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as pending_set from tbl_fg_items as a GROUP BY size_id) as dev WHERE current_set > pending_set) GROUP BY item_code,design_id,size_id,qr_code )as dev GROUP BY item_code,design_id,size_id,qr_code) as d1 WHERE COALESCE((qty-fg_set),0) > 0 ORDER BY design_id) AS DERV WHERE not_ready_set > 0`,[Required_stock_array[i].design_id] );
 
                const item_Result = await client.query(`SELECT item_code,design_id,size_id,qr_code,sum(pending_set - current_set) AS not_ready_set,
                sum(pending_pieces - current_pieces) AS not_ready_pieces FROM (SELECT item_code,design_id,size_id,qr_code,sum(current_set) AS current_set,sum(current_pieces) AS current_pieces,sum(pending_set) AS pending_set,sum(pending_pieces) AS pending_pieces FROM(
                SELECT d.item_code,d.design_id,a.size_id,b.qr_code,sum(inward_set) - sum(outward_set) AS current_set,sum(inward_pieces) - sum(outward_pieces) AS current_pieces,0 AS pending_set,0 AS pending_pieces FROM tbl_stock_transaction AS a 
                INNER JOIN tbl_item_sizes AS b ON a.size_id =b.size_id
                INNER JOIN tbl_item_management AS d ON d.trans_no=b.trans_no 
                LEFT JOIN tbl_color AS f ON f.color_id =b.color_id
                WHERE ${getset_type} AND d.design_id = $1 AND type!= 'Order' GROUP BY d.item_code,d.design_id,a.size_id,b.qr_code
                UNION ALL
                SELECT d.item_code,d.design_id,b.size_id,c.qr_code,0 AS current_set,0 AS current_pieces,sum(pending_dispatch) AS pending_set,sum(pending_dispatch * c.total_set :: INTEGER) AS pending_pieces FROM tbl_order_taking AS a INNER JOIN tbl_order_taking_items AS b ON a.order_no = b.order_no
                INNER JOIN tbl_item_sizes AS c ON c.size_id =b.size_id
                INNER JOIN tbl_item_management AS d ON d.trans_no=c.trans_no 
                LEFT JOIN tbl_color AS f ON f.color_id =c.color_id
                WHERE ${getset_type} AND d.design_id = $1 AND  a.status_code = 1 AND (a.close_status != 1 OR a.close_status is null) GROUP BY d.item_code,d.design_id,b.size_id,c.qr_code) AS DERV GROUP BY item_code,design_id,size_id,qr_code)
                AS DER  WHERE COALESCE((pending_set-current_set),0) > 0  
                GROUP BY  item_code,design_id,size_id,qr_code`,[Required_stock_array[i].design_id] );
                let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
                let obj = Required_stock_array[i]
                obj['ItemArray'] = item_Array
                result.push(obj)
              }
            }
            responseData = { "Stock_Array": result , "Stock_Total":Current_required_total}           
        }
        if(process == 'excessstock'){
          // const total_excess_stock = await client.query(`SELECT design_id,item_code,sum(current_set-pending_set) as excess_set,sum(current_pieces-pending_pieces) as 
          // excess_pieces from (SELECT item_code,design_id,size_id,sum(pending_set) as pending_set,              sum(pending_pieces) as pending_pieces,sum(current_set) as current_set,sum(current_pieces) as current_pieces from(SELECT item_code,design_id,size_id, COALESCE((qty-dispatch_set),0) as pending_set,COALESCE((order_pieces-dispatch_pieces),0) as pending_pieces,0 as current_set, 0 as current_pieces from (SELECT d.item_code,d.design_id,b.size_id,sum(b.qty) as qty,sum(qty*COALESCE(c.total_set,'0')::Integer) as order_pieces, 0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a INNER JOIN tbl_order_taking_items as b on a.order_no =b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id WHERE  a.status_code = 1 AND ${designid_val}  AND ${getcolor_id} AND d.item_code = ${item_code} GROUP BY d.item_code,d.design_id,b.size_id
          //                       union all
          // SELECT d.item_code,d.design_id,b.size_id,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b INNER JOIN       tbl_order_taking as a on a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON                 c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no                 INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id WHERE status_flag = 1 AND  a.status_code = 1 AND ${designid_val}  AND ${getcolor_id} AND d.item_code = ${item_code} GROUP BY d.item_code,d.design_id,b.size_id
          //    ) as dev 
          //    union all
          // SELECT d.item_code,d.design_id,a.size_id,0 as pending_set,0 as pending_pieces,COALESCE(COALESCE(sum(COALESCE(no_of_set,0)) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as current_set,COALESCE(COALESCE(sum(COALESCE(no_of_pieces,0)) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - (SELECT COALESCE(sum(dispatch_pieces),0) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id )) as current_pieces from tbl_fg_items as a INNER JOIN tbl_item_sizes as c on c.size_id=a.size_id INNER JOIN tbl_item_management as d on c.trans_no=d.trans_no                     left join tbl_color as f on f.color_id =c.color_id WHERE ${designid_val}  AND ${getcolor_id}        AND d.item_code = ${item_code}  GROUP BY d.item_code,d.design_id,a.size_id ) as d1 GROUP BY item_code,design_id,size_id) as t1 WHERE current_set > pending_set GROUP BY item_code,design_id ORDER BY design_id `)
 
          const total_excess_stock = await client.query(`SELECT item_code,design_id,sum(current_set - pending_set) as excess_set,sum(current_pieces - pending_pieces) as excess_pieces FROM (SELECT item_code,design_id,size_id,sum(current_set) as current_set,sum(current_pieces) as current_pieces,sum(pending_set) as pending_set,sum(pending_pieces) as pending_pieces FROM(
          SELECT d.item_code,d.design_id,a.size_id,sum(inward_set) - sum(outward_set) as current_set,sum(inward_pieces) - sum(outward_pieces) as current_pieces,0 as pending_set,0 as pending_pieces
          FROM tbl_stock_transaction as a 
          INNER JOIN tbl_item_sizes AS b on a.size_id =b.size_id
          INNER JOIN tbl_item_management as d on d.trans_no=b.trans_no 
          LEFT JOIN tbl_color as f on f.color_id =b.color_id
          WHERE ${designid_val}  AND ${getset_type}  AND d.item_code = ${item_code} AND type!= 'Order' GROUP BY d.item_code,d.design_id,a.size_id
          UNION ALL
          SELECT d.item_code,d.design_id,b.size_id,0 as current_set,0 as current_pieces,sum(pending_dispatch) as pending_set,sum(pending_dispatch * c.total_set :: INTEGER) as pending_pieces FROM tbl_order_taking AS a INNER JOIN 
          tbl_order_taking_items AS b ON a.order_no = b.order_no
          INNER JOIN tbl_item_sizes AS c on c.size_id =b.size_id
          INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no 
          LEFT JOIN tbl_color as f on f.color_id =c.color_id
          WHERE ${designid_val}  AND ${getsettype} AND d.item_code = ${item_code} AND a.status_code = 1 AND (a.close_status != 1 OR a.close_status is null) GROUP BY d.item_code,d.design_id,b.size_id) AS DERV GROUP BY item_code,design_id,size_id)
          AS DER WHERE  current_set  > pending_set GROUP BY  item_code,design_id ORDER BY design_id `)
          let Excess_stock_total = total_excess_stock && total_excess_stock.rows.length > 0 ? total_excess_stock.rowCount : 0; 
          const Excess_stock = await client.query(`SELECT item_code,design_id,sum(current_set - pending_set) as excess_set,sum(current_pieces - pending_pieces) as excess_pieces FROM (SELECT item_code,design_id,size_id,sum(current_set) as current_set,sum(current_pieces) as current_pieces,sum(pending_set) as pending_set,sum(pending_pieces) as pending_pieces FROM(
            SELECT d.item_code,d.design_id,a.size_id,sum(inward_set) - sum(outward_set) as current_set,sum(inward_pieces) - sum(outward_pieces) as current_pieces,0 as pending_set,0 as pending_pieces
            FROM tbl_stock_transaction as a 
            INNER JOIN tbl_item_sizes AS b on a.size_id =b.size_id
            INNER JOIN tbl_item_management as d on d.trans_no=b.trans_no 
            LEFT JOIN tbl_color as f on f.color_id =b.color_id
            WHERE ${designid_val}  AND ${getset_type}  AND d.item_code = ${item_code} AND type!= 'Order' GROUP BY d.item_code,d.design_id,a.size_id
            UNION ALL
            SELECT d.item_code,d.design_id,b.size_id,0 as current_set,0 as current_pieces,sum(pending_dispatch) as pending_set,sum(pending_dispatch * c.total_set :: INTEGER) as pending_pieces FROM tbl_order_taking AS a INNER JOIN 
            tbl_order_taking_items AS b ON a.order_no = b.order_no
            INNER JOIN tbl_item_sizes AS c on c.size_id =b.size_id
            INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no 
            LEFT JOIN tbl_color as f on f.color_id =c.color_id
            WHERE ${designid_val}  AND ${getsettype} AND d.item_code = ${item_code} AND a.status_code = 1 AND (a.close_status != 1 OR a.close_status is null) GROUP BY d.item_code,d.design_id,b.size_id) AS DERV GROUP BY item_code,design_id,size_id)
            AS DER WHERE  current_set  > pending_set GROUP BY  item_code,design_id ORDER BY design_id  ${get_limit}`)
          let Excess_stock_array = Excess_stock && Excess_stock.rows ? Excess_stock.rows : []; 
            let result = [];
            if (Excess_stock_array.length > 0) {
              for (let i = 0; i < Excess_stock_array.length; i++) {
                // const item_Result = await client.query(` SELECT * FROM (SELECT design_id,qr_code,item_code,sum(current_set-pending_set) as excess_set,sum(current_pieces-pending_pieces) as 
                // excess_pieces from (SELECT item_code,design_id,qr_code,size_id,sum(pending_set) as pending_set,              sum(pending_pieces) as pending_pieces,sum(current_set) as current_set,sum(current_pieces) as current_pieces from(SELECT item_code,design_id,qr_code,size_id, COALESCE((qty-dispatch_set),0) as pending_set,COALESCE((order_pieces-dispatch_pieces),0) as pending_pieces,0 as current_set, 0 as current_pieces from (SELECT d.item_code,d.design_id,c.qr_code,b.size_id,sum(b.qty) as qty,sum(qty*COALESCE(c.total_set,'0')::Integer) as order_pieces, 0 as dispatch_set, 0 as dispatch_pieces FROM tbl_order_taking as a INNER JOIN tbl_order_taking_items as b on a.order_no =b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id WHERE  a.status_code = 1 AND ${designid_val}  AND ${getcolor_id} AND d.design_id = $1 GROUP BY d.item_code,d.design_id,c.qr_code,b.size_id
                //                       union all
                // SELECT d.item_code,d.design_id,c.qr_code,b.size_id,0 as qty, 0 as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as b INNER JOIN       tbl_order_taking as a on a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON                 c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no                 INNER JOIN tbl_customer as e ON e.customer_code = a.customer_code left join tbl_color as f on f.color_id =c.color_id WHERE status_flag = 1 AND  a.status_code = 1 AND ${designid_val}  AND ${getcolor_id} AND d.design_id = $1 GROUP BY d.item_code,d.design_id,c.qr_code,b.size_id
                //    ) as dev 
                //    union all
                // SELECT d.item_code,d.design_id,c.qr_code,a.size_id,0 as pending_set,0 as pending_pieces,COALESCE(COALESCE(sum(COALESCE(no_of_set,0)) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0),0) as current_set,COALESCE(COALESCE(sum(COALESCE(no_of_pieces,0)) + COALESCE((SELECT sum(goods_return_pieces) from tbl_goods_return WHERE status_flag = 1 and size_id = a.size_id ),0),0) - (SELECT COALESCE(sum(dispatch_pieces),0) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id )) as current_pieces from tbl_fg_items as a INNER JOIN tbl_item_sizes as c on c.size_id=a.size_id INNER JOIN tbl_item_management as d on c.trans_no=d.trans_no                     left join tbl_color as f on f.color_id =c.color_id WHERE ${designid_val}  AND ${getcolor_id}        AND d.design_id = $1  GROUP BY d.item_code,d.design_id,c.qr_code,a.size_id ) as d1 GROUP BY item_code,design_id,qr_code,size_id) as t1 WHERE current_set > pending_set GROUP BY item_code,design_id,qr_code ORDER BY design_id) AS DERV WHERE excess_set > 0`,[Excess_stock_array[i].design_id] );
 
                const item_Result = await client.query(`SELECT item_code,design_id,qr_code,sum(current_set - pending_set) as excess_set,
                sum(current_pieces - pending_pieces) as excess_pieces FROM (SELECT item_code,design_id,size_id,qr_code,sum(current_set) as current_set,sum(current_pieces) as current_pieces,sum(pending_set) as pending_set,sum(pending_pieces) as pending_pieces FROM(
                SELECT d.item_code,d.design_id,a.size_id,b.qr_code,sum(inward_set) - sum(outward_set) as current_set,sum(inward_pieces) - sum(outward_pieces) as current_pieces,0 as pending_set,0 as pending_pieces
                FROM tbl_stock_transaction as a 
                INNER JOIN tbl_item_sizes AS b on a.size_id =b.size_id
                INNER JOIN tbl_item_management as d on d.trans_no=b.trans_no 
                LEFT JOIN tbl_color as f on f.color_id =b.color_id
                WHERE  ${designid_val}  AND ${getset_type} AND d.design_id = $1 AND type!= 'Order' GROUP BY d.item_code,d.design_id,a.size_id,b.qr_code
                UNION ALL
                SELECT d.item_code,d.design_id,b.size_id,c.qr_code,0 as current_set,0 as current_pieces,sum(pending_dispatch) as pending_set,sum(pending_dispatch * c.total_set :: INTEGER) as pending_pieces FROM tbl_order_taking AS a INNER JOIN 
                tbl_order_taking_items AS b ON a.order_no = b.order_no
                INNER JOIN tbl_item_sizes AS c on c.size_id =b.size_id
                INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no 
                LEFT JOIN tbl_color as f on f.color_id =c.color_id
                WHERE  ${designid_val}  AND ${getsettype} AND d.design_id = $1 AND a.status_code = 1 AND (a.close_status != 1 OR a.close_status is null)  GROUP BY d.item_code,d.design_id,b.size_id,c.qr_code) AS DERV GROUP BY item_code,design_id,size_id,qr_code)  AS DER WHERE  current_set  > pending_set GROUP BY  item_code,design_id,qr_code ORDER BY design_id`,[Excess_stock_array[i].design_id] );
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
        SELECT e.item_name,a.order_no,d.item_code,c.qr_code,sum(b.qty) as qty,sum(qty*COALESCE(c.total_set,'0')::Integer) as order_pieces, 0 as dispatch_set, 0 as dispatch_pieces from tbl_order_taking as 
          a INNER JOIN tbl_order_taking_items as b on a.order_no = b.order_no INNER JOIN tbl_item_sizes as c ON c.size_id = b.size_id INNER JOIN tbl_item_management as d on d.trans_no=c.trans_no 
          LEFT JOIN tbl_color as f on f.color_id =c.color_id INNER JOIN tbl_def_item as e on d.item_code = e.item_id WHERE d.item_code = ${item_code} AND a.order_no = ${getorder_no} AND a.status_code = 1 AND (a.close_status != 1 OR a.close_status is null) AND ${designid_val}  AND ${getsettype} GROUP BY a.order_no,d.item_code,e.item_name,c.qr_code
             union all               
            SELECT g.item_name,a.order_no,d.item_code,b.qr_code,0 as qty, 0 as order_pieces,sum(dispatch_set) 
            as dispatch_set,sum(dispatch_pieces) as dispatch_pieces from tbl_dispatch_details as a
              INNER JOIN tbl_item_sizes as b ON b.size_id = a.size_id INNER JOIN tbl_item_management as d on d.trans_no=b.trans_no LEFT JOIN tbl_color as f on f.color_id =b.color_id INNER JOIN tbl_def_item as g on d.item_code = g.item_id WHERE d.item_code = ${item_code} AND a.order_no = ${getorder_no} AND a.status_flag = 1  AND ${designid_val}  AND ${getset_type} GROUP BY a.order_no,d.item_code,g.item_name,b.qr_code) as dev GROUP BY item_name,qr_code ) as d1 WHERE pending_set > 0`);
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
        const {user_id, size_id, fg_qty, process, fg_id} = decoded.data;
 
        if (process === "delete") {     
          const fg_Result = await client.query(`SELECT * FROM (SELECT size_id,COALESCE(sum(COALESCE(no_of_set,0))- COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE
          status_flag = 1 AND size_id = a.size_id ),0),0) as current_set from tbl_fg_items as a 
          WHERE size_id = ${size_id}  GROUP BY size_id) as dev WHERE current_set > 0 `);
          responseData = { "FGArray": fg_Result && fg_Result.rows ? fg_Result.rows : [], "Message" :  fg_Result && fg_Result.rowCount > 0 ? "" : constants.FGMessage.ERRORINDELETE }        
        }
        if (process === "edit") {
          // const fg_Result = await client.query(`SELECT * FROM (SELECT size_id,COALESCE(sum(COALESCE(no_of_set,0))- COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE
          // status_flag = 1 AND size_id = a.size_id ),0),0) as current_set from tbl_fg_items as a 
          // WHERE size_id = ${size_id}  GROUP BY size_id) as dev WHERE current_set >= ${fg_qty} `);
 
          const fg_Result = await client.query(`SELECT *,(fg_set - fgset + ${fg_qty} ) - dispatch_set  as current_set FROM (SELECT size_id,sum(COALESCE(no_of_set,0)) as fg_set, COALESCE((SELECT no_of_set FROM tbl_fg_items WHERE fg_id = ${fg_id} AND size_id = ${size_id}),0) as fgset,COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0) as dispatch_set from tbl_fg_items as a WHERE size_id = ${size_id}  GROUP BY size_id) as dev WHERE dispatch_set <= (fg_set - fgset +  ${fg_qty} ) `);
 
          // const fg_Result = await client.query(`SELECT * FROM (SELECT size_id,COALESCE((SELECT sum(dispatch_set) from tbl_dispatch_details WHERE status_flag = 1 AND size_id = a.size_id ),0) as current_set from tbl_fg_items as a WHERE size_id = ${size_id}  GROUP BY size_id) as dev WHERE current_set < ${fg_qty} `);
          responseData = { "FGArray": fg_Result && fg_Result.rows ? fg_Result.rows : [], "Message" :  fg_Result && fg_Result.rowCount > 0 ? "" : constants.FGMessage.ERRORINEDIT }  
 
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
        try {    
          // Start Transaction            
          await client.query('BEGIN')       
          await commonService.insertLogs(user_id, "Delete Finished Goods");
          await client.query(`DELETE FROM tbl_stock_transaction where trans_no = cast($1 as text)`, [fg_id])
          const delete_result = await client.query(`DELETE FROM tbl_fg_items WHERE fg_id = $1 `,
            [fg_id]);
            // Commit Changes
            await client.query('COMMIT')
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
        } catch (error) {
          await client.query('ROLLBACK')
          if (client) { client.end(); }
          throw new Error(error);
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
