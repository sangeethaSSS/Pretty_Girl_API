/****************************
 File    : DispatchMasterService.js
 Author  : Suriya
 Date    : 07-04-2023
 Purpose : Dispatch Master Service 
 * ********************** */
 const connectionString = require('../database/connection');
 const commonService = require('../service/commonService');
 const jwt = require('jsonwebtoken');
 const constants = require('../constants');
 //Connect Postgres
 const { Client } = require('pg'); 
 //create jwt 
 module.exports.itemCustomerWiseListJwt = async (req) => {
   try {
     const token = await commonService.jwtCreate(req);
     return { token };
 
   } catch (error) {
     throw new Error(error);
   }
 }
 // Get Dispatch list  
 module.exports.itemCustomerWiseList = async (req) => {
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
        const {process,size_id,customer_code} = decoded.data
        let item_exec_Result  = ''
        let result = [];
        if(process == 'itemwise'){
       
          let sizeid_val = '1=1';
          if(size_id  && size_id != "" && size_id != "0"){
            const size_id_val = size_id ? '\'' + size_id.split(',').join('\',\'') + '\'' : '' 
            sizeid_val = ` b.size_id in (${size_id_val})`
          }
          
          item_exec_Result = await client.query(` SELECT size_id,qr_code FROM (SELECT a.order_no,b.size_id,qr_code,to_char(a.order_date,'DD-MM-YYYY') as order_date,sum(b.qty)::Integer - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details   where status_flag = 1 and order_no=a.order_no and size_id = b.size_id),0) as total_piece,COALESCE(coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = b.size_id ),0),0) - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and size_id=b.size_id),0) as fg_qty FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no=b.order_no inner join tbl_item_sizes as c on b.size_id=c.size_id where a.status_code = 1 and ${sizeid_val} group by a.order_no,b.size_id,qr_code,a.order_date ) as dev where total_piece > 0 and fg_qty > 0 group by size_id,qr_code`)
          // item_exec_Result = await client.query(`Select * from (select a.order_no,a.ref_no,to_char(a.order_date,'DD-MM-YYYY') as order_date,a.customer_code, b.size_id,sum(b.qty)::Integer - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details   where status_flag = 1 and order_no=a.order_no),0) as total_piece,d.customer_name,d.mobile_no, coalesce(d.city,'')||' - '||coalesce(d.pincode,'') as city,'0' as dispatch_qty, coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id),0) - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and size_id=b.size_id),0) as fg_qty from tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no=b.order_no  inner join tbl_item_sizes as c on b.size_id=c.size_id inner join tbl_customer as d  on d.customer_code=a.customer_code where  ${sizeid_val} group by a.order_no,a.ref_no,a.order_date,a.customer_code,b.size_id,d.customer_name,d.mobile_no,d.city,d.pincode) as dev where total_piece > 0 and fg_qty > 0`);
          let dispatch_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : [];      
          result = [];
          
          
          if (dispatch_array.length > 0) {
            for (let i = 0; i < dispatch_array.length; i++) {
              const item_Result = await client.query(` Select * from (select a.order_no,a.ref_no,to_char(a.order_date,'DD-MM-YYYY') as order_date,a.customer_code, b.size_id,sum(b.qty)::Integer - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details   where status_flag = 1 and order_no=a.order_no and size_id = b.size_id),0) as total_piece,d.customer_name,d.mobile_no, coalesce(d.city,'')||' - '||coalesce(d.pincode,'') as city,'0' as dispatch_qty, COALESCE(coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = b.size_id ),0),0) - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and size_id=b.size_id),0) as fg_qty,COALESCE(coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = b.size_id ),0),0) - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and size_id=b.size_id),0) as org_fg_qty from tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no=b.order_no  inner join tbl_item_sizes as c on b.size_id=c.size_id inner join tbl_customer as d  on d.customer_code=a.customer_code where a.status_code = 1 and b.size_id= $1 group by a.order_no,a.ref_no,a.order_date,a.customer_code,b.size_id,d.customer_name,d.mobile_no,d.city,d.pincode) as dev where total_piece > 0 and fg_qty > 0`,[dispatch_array[i].size_id] );
              let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
              let obj = dispatch_array[i]
              obj['ItemArray'] = item_Array
              result.push(obj)
            }
          }   
        }
        if(process == 'customerwise'){
          let customercode_val = '1=1';
          if(customer_code && customer_code != "" && customer_code != "0"){
            const customer_code_val = customer_code ? '\'' + customer_code.split(',').join('\',\'') + '\'' : ''
            // customercode_val = `  lower(a.customer_code) = lower(${customer_code_val})`
            customercode_val = `  a.customer_code in (${customer_code_val})`
          }
          // const customer_code_val = customer_code ? '\'' + customer_code.split(',').join('\',\'') + '\'' : ''
       
          // let customercode_val = '1=1';
          // if(customer_code_val && customer_code_val != "0" && customer_code_val !='0' && customer_code_val !="" &&  customer_code_val !=''){
          //   customercode_val = `  lower(a.customer_code) = lower(${customer_code_val})`
          // } 
          item_exec_Result = await client.query(`SELECT customer_code,customer_name  from (
            SELECT a.order_no,to_char(a.order_date,'DD-MM-YYYY') as order_date,a.customer_code,
            d.customer_name,COALESCE(coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = b.size_id ),0),0) - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and size_id=b.size_id),0) as fg_qty, sum(b.qty)::Integer - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details where status_flag = 1 and order_no=a.order_no and size_id = b.size_id),0) as total_piece  from tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no=b.order_no inner join tbl_item_sizes as  c on b.size_id=c.size_id inner join tbl_customer as d on d.customer_code=a.customer_code where a.status_code = 1 and ${customercode_val} and c.size_id in (select size_id from tbl_fg_items) group by a.order_no,a.order_date,a.customer_code,d.customer_name,b.size_id) as dev where total_piece > 0 and fg_qty > 0 group by customer_code,customer_name
          order by customer_name  `) 
          let dispatch_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : [];      
          result = []; 
          if (dispatch_array.length > 0) {
            for (let i = 0; i < dispatch_array.length; i++) {
              const item_Result = await client.query(`select * from (select a.order_no,a.ref_no,to_char(a.order_date,'DD-MM-YYYY') as order_date, a.customer_code,b.size_id,c.qr_code,                  sum(b.qty)::Integer - coalesce((select sum(coalesce(dispatch_set,0)) from 
              tbl_dispatch_details  where status_flag = 1 and order_no=a.order_no and size_id = b.size_id),0) as total_piece,'0' as 
              dispatch_qty,b.size_id, COALESCE(coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items 
              where size_id=b.size_id),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = b.size_id ),0),0) - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details where status_flag = 1 and size_id=b.size_id),0) as fg_qty,COALESCE(coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items 
              where size_id=b.size_id),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = b.size_id ),0),0) - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details where status_flag = 1 and size_id=b.size_id),0) as org_fg_qty from tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no=b.order_no inner join tbl_item_sizes as  c on b.size_id=c.size_id inner join tbl_customer as d on d.customer_code=a.customer_code where a.status_code = 1 and lower(a.customer_code) = lower($1) and c.size_id in (select size_id from tbl_fg_items) group by a.order_no,a.ref_no,a.order_date,a.customer_code,b.size_id,c.qr_code,b.size_id) as dev where  total_piece > 0 and fg_qty > 0`,[dispatch_array[i].customer_code] );
              let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
              let obj = dispatch_array[i]
              obj['ItemArray'] = item_Array
              result.push(obj)
            }
          }
          // item_exec_Result = await client.query(`select * from (select a.order_no,a.ref_no,to_char(a.order_date,'DD-MM-YYYY') as order_date,a.customer_code,b.size_id,c.qr_code, 
          // sum(b.qty)::Integer - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and order_no=a.order_no),0) as total_piece,'0' as dispatch_qty,
          // b.size_id, coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id),0) - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and size_id=b.size_id),0) as fg_qty from tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no=b.order_no inner join tbl_item_sizes as  c on b.size_id=c.size_id inner join tbl_customer as d on d.customer_code=a.customer_code
          // where ${customercode_val} and c.size_id in (select size_id from tbl_fg_items) 
          // group by a.order_no,a.ref_no,a.order_date,a.customer_code,b.size_id,c.qr_code,b.size_id) as dev where  total_piece > 0 and fg_qty > 0`);         
        }
        
         if (client) {
           client.end();
         }  
        //  let item_Array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : [];
         responseData = { "itemArray": result, "statusFlag": result && result.length > 0 ? 1 : 0}
        //  responseData = { "itemArray": item_Array }
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
  module.exports.designListJwt = async (req) => {
    try {
      const token = await commonService.jwtCreate(req);
      return { token };
  
    } catch (error) {
      throw new Error(error);
    }
  }
  // Get design list  
  module.exports.designList = async (req) => {
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
          // const item_exec_Result = await client.query(`SELECT 'All' as label,'0' as value, 0 as total_piece, '0' as fg_id 
          // UNION ALL
          // SELECT * FROM (select * from (select qr_code as label,a.size_id as value,sum(coalesce(no_of_set,0))-coalesce((select  sum(coalesce(dispatch_set,0)) from  tbl_dispatch_details where status_flag = 1 and size_id=a.size_id),0)  as total_piece,  string_agg(fg_id::text,',') as fg_id from tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id 	inner join tbl_order_taking_items as c on a.size_id=c.size_id  group by a.size_id,qr_code) as dev where total_piece > 0 order by label) as d`); 
          // const customer_exec_Result = await client.query(`SELECT 'All' as label,'0' as value, 0 as total_piece, '0' as fg_id
          // UNION ALL
          // SELECT * FROM (select distinct label,value,sum(total_piece) as total_piece,fg_id from (select  coalesce(d.customer_name,'') ||' - '||  coalesce(d.mobile_no,'') as label,d.customer_code  as value,sum(b.qty)::Integer -  coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and order_no=a.order_no),0) as order_qty,coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id),0) - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and size_id=b.size_id),0) as total_piece,(select  string_agg(fg_id::text,',') from tbl_fg_items where size_id=b.size_id) as fg_id  from tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no=b.order_no inner join tbl_item_sizes as c on b.size_id=c.size_id inner join tbl_customer  as d on d.customer_code=a.customer_code  and c.size_id in  (select size_id from tbl_fg_items) group by a.order_no,d.customer_name, d.mobile_no,d.customer_code,b.size_id ) as dev where order_qty > 0 and total_piece > 0  group by label,value,fg_id) as d`); 
          // const item_exec_Result = await client.query(`SELECT 'All' as label,'0' as value, 0 as total_piece
          // UNION ALL SELECT * FROM (select * from (select qr_code as label,a.size_id as value,sum(coalesce(no_of_set,0))-coalesce((select  sum(coalesce(dispatch_set,0)) from  tbl_dispatch_details where status_flag = 1 and size_id=a.size_id),0)  as total_piece from tbl_fg_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id 	inner join tbl_order_taking_items as c on a.size_id=c.size_id where c.status_code = 1 group by a.size_id,qr_code) as dev where total_piece > 0 order by label) as d`); 
          const item_exec_Result = await client.query(`SELECT 'All' as label,'0' as value, 0 as total_piece
          UNION ALL SELECT * FROM (select distinct label,value,sum(total_piece) as total_piece from (select qr_code as label,b.size_id as value,sum(b.qty)::Integer - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details where status_flag = 1 and order_no=a.order_no and size_id = b.size_id),0) as order_qty,coalesce(coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = b.size_id ),0),0)-coalesce((select  sum(coalesce(dispatch_set,0)) from  tbl_dispatch_details where status_flag = 1 and size_id=b.size_id),0)  as total_piece from tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no=b.order_no inner join tbl_item_sizes as c on b.size_id=c.size_id where a.status_code = 1 group by a.order_no,b.size_id,qr_code) as dev where order_qty > 0  and total_piece > 0 group by label,value order by label) as d`); 
          const customer_exec_Result = await client.query(` SELECT 'All' as label,'0' as value, 0 as total_piece
          UNION ALL SELECT * FROM (select distinct label,value,sum(total_piece) as total_piece from (select  coalesce(d.customer_name,'') ||' - '||  coalesce(d.mobile_no,'') as label,d.customer_code  as value,sum(b.qty)::Integer - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and order_no=a.order_no and size_id = b.size_id),0) as order_qty,COALESCE(coalesce((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id),0) + COALESCE((SELECT sum(goods_return_set) from tbl_goods_return where status_flag = 1 AND  size_id = b.size_id ),0),0) - coalesce((select sum(coalesce(dispatch_set,0)) from tbl_dispatch_details  where status_flag = 1 and size_id=b.size_id),0) as total_piece,(select  string_agg(fg_id::text,',')  from tbl_fg_items where size_id=b.size_id) as fg_id  from tbl_order_taking as a inner join  tbl_order_taking_items as b on a.order_no=b.order_no inner join tbl_item_sizes as c on b.size_id=c.size_id inner join tbl_customer  as d on d.customer_code=a.customer_code and c.size_id in  (select size_id from tbl_fg_items) where a.status_code = 1 group by a.order_no,d.customer_name,d.mobile_no,d.customer_code,b.size_id ) as dev where order_qty > 0 and total_piece > 0  group by label,value) as d`);
          const company_Result = await client.query(`SELECT * from tbl_print_setting`);
          if (client) {
            client.end();
          }  
          let item_Array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : [];
          let Customer_Array = customer_exec_Result && customer_exec_Result.rows ? customer_exec_Result.rows : [];
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows : []; 
          responseData = { "DesignArray": item_Array , "Customer_Array":Customer_Array, "Company_Array":Company_Array }
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
module.exports.saveItemWiseDispatchJwt = async (req) => {
  try {
      let obj = {} 
      obj['user_id'] = req.user_id; 
      const token = await commonService.jwtCreate(obj); 
      return { token };

  } catch (error) {
      throw new Error(error);
  }
}
//Save item wise dispatch
module.exports.saveItemWiseDispatch = async (req) => {
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
  const {item_details, order_details,dispatch_date} = req; 
  if (decoded) { 
    const {user_id} = decoded.data
    if(order_details && order_details.length > 0 ){
      const id_max = await client.query(`select coalesce (max(dispatch_id),0) + 1 as dispatch_id FROM tbl_dispatch_details`)
      var dispatch_id = id_max && id_max.rows[0].dispatch_id;
      const dispacth_number = await client.query(`select   'D'||case when `+user_id+` <= 99 then  (select LPAD(`+user_id+`::text,2,'0'))    else (`+user_id+` ::text) end  || '-' || case when coalesce(max(dispatch_id),0) + 1 <= 9999 then  (select LPAD((SELECT coalesce(max(dispatch_id),0) + 1 from tbl_dispatch_details)::text,4,'0')) else (select (SELECT coalesce(max(dispatch_id),0) + 1 from tbl_dispatch_details  )::text)
      end as dispatch_id from tbl_dispatch_details `) 
      var dispatch_no = dispacth_number && dispacth_number.rows[0].dispatch_id;
     
      for(let i=0; i < order_details.length; i++){
        for(let j = 0 ; j < order_details[i].ItemArray.length; j++){
          if(order_details[i].size_id == order_details[i].ItemArray[j].size_id) {
            if(order_details[i].ItemArray[j].dispatch_qty && order_details[i].ItemArray[j].dispatch_qty != '0'){
              let total_set =  await client.query(`SELECT total_set::INTEGER FROM tbl_item_sizes where size_id = `+order_details[i].ItemArray[j].size_id+``)
              var total_pieces = total_set && total_set.rows[0].total_set;
              total_pieces = total_pieces * Number(order_details[i].ItemArray[j].dispatch_qty)
               await client.query(`INSERT INTO  tbl_dispatch_details(dispatch_id, order_no, customer_code, order_set, dispatch_set, size_id, dispatch_type, user_id, created_at,dispatch_date,dispatch_no,status_flag,dispatch_pieces) VALUES ($1, $2, $3, $4, $5,$6, $7, $8, CURRENT_TIMESTAMP,$9,$10,1,$11) `,[dispatch_id, order_details[i].ItemArray[j].order_no, order_details[i].ItemArray[j].customer_code,order_details[i].ItemArray[j].total_piece,order_details[i].ItemArray[j].dispatch_qty,order_details[i].ItemArray[j].size_id,'itemwise' , user_id,dispatch_date,dispatch_no,total_pieces]);
            }
          }
        
        }
        
      } 
    } 
    
    if (client) {
      client.end();
    } 
    return response = { "message": "Dispatched successfully", "statusFlag": 1, "itemdispatchId": dispatch_id }; 
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
module.exports.saveCustomerWiseDispatchJwt = async (req) => {
  try {
      let obj = {} 
      obj['user_id'] = req.user_id; 
      const token = await commonService.jwtCreate(obj); 
      return { token };

  } catch (error) {
      throw new Error(error);
  }
}
//Save Customer wise dispatch
module.exports.saveCustomerWiseDispatch = async (req) => {
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
  const {customer_details, order_details,dispatch_date} = req; 
  if (decoded) { 
    const {user_id} = decoded.data
    if(order_details && order_details.length > 0 ){
      const id_max = await client.query(`select coalesce (max(dispatch_id),0) + 1 as dispatch_id FROM tbl_dispatch_details`)
      var dispatch_id = id_max && id_max.rows[0].dispatch_id;
      const dispacth_number = await client.query(`select   'D'||case when `+user_id+` <= 99 then  (select LPAD(`+user_id+`::text,2,'0'))    else (`+user_id+` ::text) end  || '-' || case when coalesce(max(dispatch_id),0) + 1 <= 9999 then  (select LPAD((SELECT coalesce(max(dispatch_id),0) + 1 from tbl_dispatch_details)::text,4,'0')) else (select (SELECT coalesce(max(dispatch_id),0) + 1 from tbl_dispatch_details  )::text)
      end as dispatch_id from tbl_dispatch_details `) 
      var dispatch_no = dispacth_number && dispacth_number.rows[0].dispatch_id;
      for(let i=0; i < order_details.length; i++){
        for(let j = 0 ; j < order_details[i].ItemArray.length; j++){
          if(order_details[i].customer_code == order_details[i].ItemArray[j].customer_code) {
            if(order_details[i].ItemArray[j].dispatch_qty && order_details[i].ItemArray[j].dispatch_qty != '0'){
              let total_set =  await client.query(`SELECT total_set::INTEGER FROM tbl_item_sizes where size_id = `+order_details[i].ItemArray[j].size_id+``)
              var total_pieces = total_set && total_set.rows[0].total_set;
              total_pieces = total_pieces * Number(order_details[i].ItemArray[j].dispatch_qty)
              
              await client.query(`INSERT INTO  tbl_dispatch_details(dispatch_id, order_no, customer_code, order_set, dispatch_set, size_id, dispatch_type, user_id, created_at,dispatch_date,dispatch_no,status_flag,dispatch_pieces) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, $9, $10,1,$11) `,[dispatch_id, order_details[i].ItemArray[j].order_no, order_details[i].ItemArray[j].customer_code,order_details[i].ItemArray[j].total_piece,order_details[i].ItemArray[j].dispatch_qty,order_details[i].ItemArray[j].size_id,'customerwise' , user_id,dispatch_date,dispatch_no,total_pieces]);
            }
          }
        } 
      }
    }  
    if (client) {
      client.end();
    } 
    return response = { "message": "Dispatched successfully", "statusFlag": 1,"customerdispatchId": dispatch_id }; 
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
 module.exports.itemWisePendingOrderListJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
// Get itemWisePendingOrder  list  
module.exports.itemWisePendingOrderList = async (req) => {
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
        const item_exec_Result = await client.query(`select a.order_no,a.ref_no,a.customer_code,b.size_id,c.customer_name,c.city,c.mobile_no,
        sum(b.qty*coalesce(d.total_set,'0')::Integer) as order_qty,
        sum(b.qty*coalesce(d.total_set,'0')::Integer) - 
        coalesce((select sum(coalesce(dispatch_qty,0)) from tbl_dispatch_details
        where status_flag = 1 and size_id=b.size_id),0) as pending_qty
        from tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no
        inner join tbl_customer as c on a.customer_code=c.customer_code inner join tbl_item_sizes as d 
        on d.size_id=b.size_id where a.status_code = 1 group by   a.order_no,a.ref_no,a.customer_code,b.size_id,c.customer_name,c.city,c.mobile_no`); 
        
        if (client) {
          client.end();
        }  
        let item_pending_order_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : []; 

        responseData = { "item_pending_order_array": item_pending_order_array }
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
 module.exports.dispatchListJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
// Get dispatch  list  
module.exports.dispatchList = async (req) => {
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
        const {dispatch_from_date, dispatch_to_date,filter_type, limit, offset, designcode, customercode, itemcategary_code, agent_code, process} = decoded.data;    
        let dispatch_date = '1=1';
        let design_code = '1=1';
        let customer_code = '1=1';
        let itemcategarycode = '1=1'
        let agentcode = '1=1'
        let get_limit = '';
        if(dispatch_from_date && dispatch_to_date){
          dispatch_date = `dispatch_date between '`+dispatch_from_date+`' and '`+dispatch_to_date+`' `;
        }
        // && filter_type === 'itemwise'
        if(designcode && designcode != "" && designcode != "0" ){
          const design_code_val = designcode ? '\'' + designcode.split(',').join('\',\'') + '\'' : ''
          design_code = `c.design_id in (` + design_code_val + `) `
        }
        if(customercode && customercode != "" && customercode != "0"  && filter_type === 'customerwise'){
          const customer_code_val = customercode ? '\'' + customercode.split(',').join('\',\'') + '\'' : ''
          customer_code = `a.customer_code in (` + customer_code_val + `) `
        }
        if(itemcategary_code && itemcategary_code != "" && itemcategary_code != "0"){
          const itemcategory_code_val = Number(itemcategary_code)
          itemcategarycode = `c.item_code = ` + itemcategory_code_val + ``
        }
        if(agent_code && agent_code != "" && agent_code != "0"){
          const agent_code_val = Number(agent_code)
          agentcode = `e.agent_code = ` + agent_code_val + ` `
        }
        const overallTotal = await client.query(`SELECT SUM(dispatch_set) as dispatch_set, sum(dispatch_piece) as dispatch_piece FROM ( select c.item_code, a.size_id, SUM(a.dispatch_set) as dispatch_set,SUM((a.dispatch_set :: INTEGER * b.total_set :: INTEGER)) as dispatch_piece from tbl_dispatch_details as a inner join tbl_item_sizes as b on b.size_id=a.size_id  inner join tbl_item_management as c on b.trans_no=c.trans_no inner join tbl_customer as e on e.customer_code =a.customer_code inner join tbl_order_taking as d on d.order_no = a.order_no where  d.status_code = 1 and status_flag = 1 and a.dispatch_type = '${filter_type}' and  ${dispatch_date} and ${customer_code} and ${design_code} and ${agentcode} and ${itemcategarycode} group by c.item_code,a.size_id, a.dispatch_set,b.total_set order by c.item_code ) as dev inner join tbl_def_item as e on dev.item_code = e.item_id`);
        var overallTotal_sets = overallTotal && overallTotal.rows[0].dispatch_set ? overallTotal.rows[0].dispatch_set : 0
        var overallTotal_Pieces = overallTotal && overallTotal.rows[0].dispatch_piece ? overallTotal.rows[0].dispatch_piece : 0
        const dispatchWidget  = await client.query(`SELECT item_name,item_id,SUM(dispatch_set) as dispatch_set, sum(dispatch_piece) as dispatch_piece FROM ( select c.item_code, a.size_id, SUM(a.dispatch_set) as dispatch_set,SUM((a.dispatch_set :: INTEGER * b.total_set :: INTEGER)) as dispatch_piece  from tbl_dispatch_details as a inner join tbl_item_sizes as b on b.size_id=a.size_id  inner join tbl_item_management as c on b.trans_no=c.trans_no inner join tbl_customer as e on e.customer_code =a.customer_code inner join tbl_order_taking as d on d.order_no = a.order_no
         where d.status_code = 1 and status_flag = 1 and a.dispatch_type = '${filter_type}' and ${dispatch_date} and ${customer_code} and ${design_code} and ${agentcode} and ${itemcategarycode} group by c.item_code,a.size_id, a.dispatch_set,b.total_set order by c.item_code ) as dev inner join tbl_def_item as e on dev.item_code = e.item_id group by item_name,item_id order by item_id`)
         var dispatch_Widget = dispatchWidget && dispatchWidget.rows ? dispatchWidget.rows : []
        if(process != 'excel'){
          get_limit =`LIMIT ${limit} OFFSET ${offset}`;
        }
        if(process == 'excel') { 
          // const item_exec_Result = await client.query(`SELECT dispatch_id, coalesce(order_set,0) as order_set,coalesce(dispatch_set,0) as dispatch_set ,a.user_id,dispatch_no,to_char(dispatch_date, 'dd-MM-YYYY') as dispatch_date,b.qr_code,a.order_no,d.customer_name  from tbl_dispatch_details a inner join tbl_item_sizes as b ON b.size_id = a.size_id inner join tbl_item_management as c on c.trans_no=b.trans_no inner join tbl_customer as d ON d.customer_code = a.customer_code inner join tbl_agent as e on d.agent_code = e.agent_code where a.dispatch_type = '${filter_type}' and a.status_flag = 1 and ${dispatch_date} and ${design_code} and ${customer_code} and ${itemcategarycode} and ${agentcode} order by dispatch_id desc ` ); 
          const item_exec_Result = await client.query(`SELECT dispatch_id,dispatch_no,dispatch_date,dispatch_time,sum(order_set) as order_set,sum(order_pieces) as order_pieces,sum(dispatch_set) as dispatch_set,sum(dispatch_pieces) as dispatch_pieces, user_id,string_agg(distinct customer_name, ',') as customer_name FROM (SELECT dispatch_id,dispatch_no,to_char(dispatch_date, 'YYYY-MM-dd') as dispatch_date,coalesce(to_char(created_at,'HH12:MI PM'),'') as dispatch_time,sum(coalesce(order_set,0)) as order_set,sum(order_set*coalesce(b.total_set,'0')::Integer)  as order_pieces,sum(coalesce(dispatch_set,0)) as dispatch_set ,sum(coalesce(dispatch_pieces,0)) as dispatch_pieces,a.user_id,string_agg(distinct customer_name, ',') as customer_name from tbl_dispatch_details a inner join tbl_item_sizes as b ON b.size_id = a.size_id inner join tbl_item_management as c on c.trans_no=b.trans_no inner join tbl_customer as d on                    a.customer_code = d.customer_code inner join tbl_agent as e on d.agent_code = e.agent_code  where 
          a.dispatch_type = '${filter_type}' and a.status_flag = 1 and  ${dispatch_date} and ${design_code} and ${customer_code} and ${itemcategarycode} and ${agentcode} group by dispatch_id,a.user_id,dispatch_no,dispatch_date,created_at order by dispatch_id desc ) 
          as dev group by dispatch_id,user_id,dispatch_no,dispatch_date,dispatch_time order by dispatch_id desc` ); 
          let dispatch_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : []; 
          const company_Result = await client.query(`SELECT * from tbl_print_setting`);
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows : []; 
          responseData = { "dispatch_array": dispatch_array, "Company_Array":Company_Array, "overallTotal_sets" : overallTotal_sets, "overallTotal_Pieces" : overallTotal_Pieces, "dispatchWidget": dispatch_Widget }
        } else { 
            // const item_total_Result = await client.query(`SELECT count(dispatch_id) as totalcount   from tbl_dispatch_details where dispatch_type ='${filter_type}' and status_flag = 1 and ${dispatch_date} ` ); 
               //  group by dispatch_id
            // let dispatch_total = item_total_Result && item_total_Result.rows.length > 0 ? item_total_Result.rows[0].totalcount : 0;
            const item_total_Result = await client.query(`SELECT dispatch_id,dispatch_no,dispatch_date,dispatch_time,sum(order_set) as order_set,sum(dispatch_set) as dispatch_set,user_id FROM (SELECT dispatch_id,sum(coalesce(order_set,0)) as order_set,sum(coalesce(dispatch_set,0)) as dispatch_set ,a.user_id,dispatch_no,to_char(dispatch_date, 'dd-MM-YYYY') as dispatch_date,coalesce(to_char(created_at,'HH12:MI PM'),'') as dispatch_time  from tbl_dispatch_details a inner join tbl_item_sizes as b ON b.size_id = a.size_id inner join tbl_item_management as c on c.trans_no=b.trans_no inner join tbl_customer as d on a.customer_code = d.customer_code inner join tbl_agent as e on d.agent_code = e.agent_code where a.dispatch_type = '${filter_type}' and a.status_flag = 1 and  ${dispatch_date} and ${design_code} and ${customer_code} and ${itemcategarycode} and ${agentcode} group by dispatch_id,a.user_id,dispatch_no,dispatch_date,created_at order by dispatch_id desc ) 
            as dev group by dispatch_id,user_id,dispatch_no,dispatch_date,dispatch_time order by dispatch_id desc` );
         
            let dispatch_total = item_total_Result && item_total_Result.rowCount ? item_total_Result.rowCount : 0;
            
            // rowCount
            const item_exec_Result = await client.query(`SELECT dispatch_id,dispatch_no,dispatch_date,dispatch_time,sum(order_set) as order_set,sum(dispatch_set) as dispatch_set,user_id,goods_return_count  FROM (SELECT dispatch_id,sum(coalesce(order_set,0)) as order_set,sum(coalesce(dispatch_set,0)) as dispatch_set ,a.user_id,dispatch_no,to_char(dispatch_date, 'dd-MM-YYYY') as dispatch_date,coalesce(to_char(created_at,'HH12:MI PM'),'') as dispatch_time,(SELECT count(goods_return_id)  as goods_return_count FROM tbl_goods_return_dispatch where dispatch_no = a.dispatch_no and status_flag = 1) as goods_return_count  from tbl_dispatch_details a inner join tbl_item_sizes as b ON b.size_id = a.size_id inner join tbl_item_management as c on c.trans_no=b.trans_no inner join tbl_customer as d on a.customer_code = d.customer_code inner join tbl_agent as e on d.agent_code = e.agent_code where a.dispatch_type = '${filter_type}' and a.status_flag = 1 and  ${dispatch_date} and ${design_code} and ${customer_code} and ${itemcategarycode} and ${agentcode} group by dispatch_id,a.user_id,dispatch_no,dispatch_date,created_at order by dispatch_id desc ) 
            as dev group by dispatch_id,user_id,dispatch_no,dispatch_date,dispatch_time,goods_return_count order by dispatch_id desc ${get_limit}`);  
            let dispatch_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : []; 
            let result = [];
            if (dispatch_array.length > 0) {
              for (let i = 0; i < dispatch_array.length; i++) {
                const item_Result = await client.query(` select b.qr_code,order_set ,dispatch_set,order_no,(SELECT order_date FROM tbl_order_taking where order_no = a.order_no ) as order_date,d.customer_name,coalesce(dispatch_pieces, 0 ) as dispatch_pieces from tbl_dispatch_details as a inner join tbl_item_sizes as b ON b.size_id = a.size_id  inner join tbl_item_management as c on c.trans_no=b.trans_no  inner join tbl_customer as d ON d.customer_code = a.customer_code inner join tbl_agent as e on d.agent_code = e.agent_code  where a.dispatch_type = '${filter_type}' and a.status_flag = 1 and dispatch_id=$1 and ${design_code} and ${customer_code} and ${itemcategarycode} and ${agentcode}`,[dispatch_array[i].dispatch_id] );
                let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
                let obj = dispatch_array[i]
                obj['ItemArray'] = item_Array
                result.push(obj)
              }
            } 
            responseData = { "dispatch_array": result, "dispatch_total":dispatch_total, "overallTotal_sets" : overallTotal_sets, "overallTotal_Pieces" : overallTotal_Pieces, "dispatchWidget": dispatch_Widget }
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
 module.exports.dispatchDropdownListJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
// Get design list  
module.exports.dispatchDropdownList = async (req) => {
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
        const item_exec_Result = await client.query(`select 'All' as label, '0' as value union all select distinct c.design_id as label,c.design_id as value from tbl_dispatch_details as a inner join tbl_item_sizes as b ON b.size_id = a.size_id inner join 
        tbl_item_management as c on c.trans_no=b.trans_no where a.status_flag = 1 and a.dispatch_type='itemwise'`); 
        const item_exec_Result_All = await client.query(`select 'All' as label, '0' as value union all select distinct c.design_id as label,c.design_id as value from tbl_dispatch_details as a inner join tbl_item_sizes as b ON b.size_id = a.size_id inner join 
        tbl_item_management as c on c.trans_no=b.trans_no where a.status_flag = 1 and a.dispatch_type='customerwise'`); 
        const customer_exec_Result = await client.query(`select 'All' as label, '0' as value union all select DISTINCT c.customer_name || '-'||c.mobile_no as label,a.customer_code as value  from tbl_dispatch_details as a  inner join tbl_customer as c ON c.customer_code = a.customer_code where a.status_flag = 1 and a.dispatch_type='customerwise' `); 
        const itemcategory_exec_Result = await client.query(`select 'All' as label, '0' as value union all  SELECT * FROM (select DISTINCT d.item_name as label,c.item_code as value from tbl_dispatch_details as a inner join tbl_item_sizes as b on a.size_id=b.size_id inner join tbl_item_management as c on c.trans_no =b.trans_no inner join tbl_def_item as d on c.item_code = d.item_id where status_flag = 1 ) as dev       group by value ,label `); 
        const agent_exec_Result = await client.query(`select 'All' as label, '0' as value union all
        SELECT * FROM (SELECT DISTINCT a.agent_name as label,a.agent_code as value from tbl_agent as a inner join 
        tbl_customer as b on a.agent_code = b.agent_code
        inner join tbl_dispatch_details as c on b.customer_code = c.customer_code where
        status_flag = 1 ) as dev group by label,value `); 
        
       
        if (client) {
          client.end();
        }  
        let item_Array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : [];
        let Customer_Array = customer_exec_Result && customer_exec_Result.rows ? customer_exec_Result.rows : [];
        let item_Custom_Array = item_exec_Result_All && item_exec_Result_All.rows ? item_exec_Result_All.rows : [];
        let itemCategory_Array = itemcategory_exec_Result && itemcategory_exec_Result.rows ? itemcategory_exec_Result.rows : [];
        let Agent_Array = agent_exec_Result && agent_exec_Result.rows ? agent_exec_Result.rows : [];

        responseData = { "DesignArray": item_Array , "Customer_Array":Customer_Array, "itemCategory_Array":itemCategory_Array, "Agent_Array":Agent_Array,"Item_Custom_Array" :item_Custom_Array }
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
module.exports.cancelDispatchDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
      throw new Error(error);
  }
}
//cancle dispatch
module.exports.cancelDispatchData = async (req) => {
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
  const {user_id, dispatch_id} = decoded.data; 
  if (decoded) { 
    var makerid = await commonService.insertLogs(user_id, "Cancel Dispatch");
    const update_result = await client.query(`UPDATE tbl_dispatch_details set status_flag = 2 where dispatch_id = $1 `,[dispatch_id]);     
     
    if (client) {
      client.end();
    } 
    let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
    if (update_code > 0) {
      return response = { "message": constants.userMessage.CANCEL_SUCCESS, "statusFlag": 1 };
    }else{
      return response = { "message": constants.userMessage.CANCEL_SUCCESS, "statusFlag": 2 }; 

    }
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

module.exports.printItemCustomerWiseDispatchJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
// Get Dispatch list  
module.exports.printItemCustomerWiseDispatch = async (req) => {
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
       const {process,dispatch_id, designcode, customercode, itemcategary_code, agent_code} = decoded.data
       let item_exec_Result  = ''      
       let result = [];
       let design_code = '1=1';
       let customer_code = '1=1';
       let itemcategarycode = '1=1'
       let agentcode = '1=1'
       
       if(designcode && designcode != "" && designcode != "0" ){
        const design_code_val = designcode ? '\'' + designcode.split(',').join('\',\'') + '\'' : ''
        design_code = `c.design_id in (` + design_code_val + `) `
      }
      if(customercode && customercode != "" && customercode != "0"  && process === 'customerwise'){
        const customer_code_val = customercode ? '\'' + customercode.split(',').join('\',\'') + '\'' : ''
        customer_code = `a.customer_code in (` + customer_code_val + `) `
      }
      if(itemcategary_code && itemcategary_code != "" && itemcategary_code != "0"){
        const itemcategory_code_val = Number(itemcategary_code)
        itemcategarycode = `c.item_code = ` + itemcategory_code_val + ``
      }
      if(agent_code && agent_code != "" && agent_code != "0"){
        const agent_code_val = Number(agent_code)
        agentcode = `d.agent_code = ` + agent_code_val + ` `
      }
       if(process == 'itemwise'){
        item_exec_Result = await client.query(`SELECT a.dispatch_id,a.size_id,qr_code,dispatch_no FROm tbl_dispatch_details as a inner join tbl_item_sizes as b on a.size_id=b.size_id 
        inner join tbl_item_management as c on b.trans_no=c.trans_no
        inner join tbl_customer as e on e.customer_code =a.customer_code
        where dispatch_type = '${process}' and dispatch_id=${dispatch_id} and status_flag = 1 and ${customer_code} and ${design_code} and ${agentcode} and ${itemcategarycode} group by a.dispatch_id,a.size_id,qr_code,dispatch_no`)
         let dispatch_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : [];      
         result = [];
         
         
         if (dispatch_array.length > 0) {
           for (let i = 0; i < dispatch_array.length; i++) {
             const item_Result = await client.query(` SELECT a.dispatch_id,a.order_no,(SELECT order_date FROM tbl_order_taking where order_no = a.order_no ) as order_date, a.customer_code,a.order_set,a.dispatch_set,coalesce(a.dispatch_pieces, 0 ) as dispatch_pieces,a.size_id,qr_code,
             (SELECT customer_name from tbl_customer where customer_code = a.customer_code) as customer_name,
             (SELECT mobile_no from tbl_customer where customer_code = a.customer_code) as mobile_no
             FROm tbl_dispatch_details as a inner join tbl_item_sizes as b on a.size_id=b.size_id 
             inner join tbl_item_management as c on b.trans_no=c.trans_no
             inner join tbl_customer as e on e.customer_code =a.customer_code 
             where a.dispatch_type = '${process}' and a.status_flag = 1 and dispatch_id=$1 and a.size_id=$2
             and ${customer_code} and ${design_code} and ${agentcode} and ${itemcategarycode} 
             group by a.order_no,a.dispatch_id,a.customer_code,a.order_set,a.dispatch_set,a.dispatch_pieces,a.size_id,qr_code,created_at order by created_at desc`,[dispatch_array[i].dispatch_id,dispatch_array[i].size_id] );
             let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
             let obj = dispatch_array[i]
             obj['ItemArray'] = item_Array
             result.push(obj)
           }
         }          
       }
       if(process == 'customerwise'){
        item_exec_Result = await client.query(`SELECT a.dispatch_id,d.customer_code,d.customer_name as customer_name,coalesce(street, '') as street,coalesce(area, '') as area,coalesce(city,'') as city,coalesce(pincode,'') as pincode,coalesce(mobile_no,'') as mobile_no,dispatch_no FROm tbl_dispatch_details as a inner join tbl_customer as d on a.customer_code=d.customer_code
        inner join tbl_item_sizes as b on a.size_id=b.size_id 
        inner join tbl_item_management as c on b.trans_no=c.trans_no 
        where a.dispatch_type = '${process}' and dispatch_id=${dispatch_id} and status_flag = 1 and ${customer_code} and ${design_code} and ${agentcode} and ${itemcategarycode} group by a.dispatch_id,d.customer_code,d.customer_name,dispatch_no `)
        let dispatch_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : [];          
         
         if (dispatch_array.length > 0) {
           for (let i = 0; i < dispatch_array.length; i++) {
             const item_Result = await client.query(` SELECT a.dispatch_id,a.order_no,(SELECT order_date FROM tbl_order_taking where order_no = a.order_no ) as order_date,d.customer_code,a.order_set,a.dispatch_set,coalesce(a.dispatch_pieces, 0 ) as dispatch_pieces,a.size_id,(SELECT qr_code from tbl_item_sizes where size_id=a.size_id) as qr_code,d.customer_name,mobile_no FROm tbl_dispatch_details as a inner join tbl_customer as d on a.customer_code = d.customer_code   
             inner join tbl_item_sizes as b on a.size_id=b.size_id 
             inner join tbl_item_management as c on b.trans_no=c.trans_no 
             where a.dispatch_type = '${process}' and a.status_flag = 1 and dispatch_id=$1 and a.customer_code=$2 and ${design_code} and ${agentcode} and ${itemcategarycode} group by a.order_no,a.dispatch_id,d.customer_code,a.order_set,a.dispatch_set,a.dispatch_pieces,a.size_id,d.customer_name,created_at order by created_at desc`,[dispatch_array[i].dispatch_id,dispatch_array[i].customer_code] );
             let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
             let obj = dispatch_array[i]
             obj['ItemArray'] = item_Array
             result.push(obj)
           }
         }
       }
       const company_Result = await client.query(`SELECT * from tbl_print_setting`);
       let Company_Array = company_Result && company_Result.rows ? company_Result.rows : []; 
       responseData = { "dispatch_array": result,"Company_Array":Company_Array}
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
module.exports.editDispatchDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
      throw new Error(error);
  }
}
//cancle dispatch
module.exports.editDispatchData = async (req) => {
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
  const {user_id, dispatch_id} = decoded.data; 
  if (decoded) { 
    let result = [];
    const item_exec_Result = await client.query(`SELECT a.dispatch_id,b.customer_code,b.customer_name AS customer_name,coalesce(street, '') AS street,coalesce(area, '') AS area,coalesce(city,'') AS city,coalesce(pincode,'') AS pincode,coalesce(mobile_no,'') AS mobile_no,dispatch_no FROM tbl_dispatch_details AS a INNER JOIN tbl_customer AS b ON a.customer_code=b.customer_code WHERE dispatch_id=${dispatch_id} AND status_flag = 1 GROUP BY a.dispatch_id,b.customer_code,b.customer_name,dispatch_no `)
    let dispatch_array = item_exec_Result && item_exec_Result.rows ? item_exec_Result.rows : [];          
     
     if (dispatch_array.length > 0) {
       for (let i = 0; i < dispatch_array.length; i++) {
         const item_Result = await client.query(` SELECT dispatch_no,a.dispatch_id,c.customer_code,a.dispatch_set,coalesce(a.dispatch_pieces, 0 ) AS dispatch_pieces,a.size_id,b.qr_code AS 
         qr_code,(SELECT coalesce(sum(goods_return_set),0) AS goods_return_set FROM tbl_goods_return_dispatch 
         WHERE dispatch_no = a.dispatch_no AND customer_code = $2 AND status_flag = 1 AND size_id  = a.size_id ) AS goods_return_set FROM tbl_dispatch_details AS a INNER JOIN tbl_item_sizes AS b  ON b.size_id=a.size_id INNER JOIN tbl_customer AS  c ON a.customer_code = c.customer_code  WHERE dispatch_id=$1 AND a.customer_code=$2 GROUP BY dispatch_no,a.dispatch_id,c.customer_code,a.dispatch_set,a.dispatch_pieces,a.size_id,b.qr_code,created_at ORDER BY created_at desc`,[dispatch_array[i].dispatch_id,dispatch_array[i].customer_code] );
         let item_Array = item_Result && item_Result.rows ? item_Result.rows : []; 
         let obj = dispatch_array[i]
         obj['ItemArray'] = item_Array
         result.push(obj)
       }
     }
     responseData = { "dispatch_array": result}
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

// 

//create jwt 
module.exports.deleteDispatchDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
      throw new Error(error);
  }
}
//delete dispatch
module.exports.deleteDispatchData = async (req) => {
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
  const {user_id, dispatch_details} = decoded.data; 
  if (decoded) { 
    // tbl_dispatch_delete_details
    var makerid = await commonService.insertLogs(user_id, "Delete Dispatch");
  
    if(dispatch_details && dispatch_details.length > 0 ){
      const id_max = await client.query(`select coalesce (max(delete_dispatch_id),0) + 1 as delete_dispatch_id FROM tbl_dispatch_delete_details`)
      var delete_dispatch_id = id_max && id_max.rows[0].delete_dispatch_id;
     
      for(let i=0; i < dispatch_details.length; i++){
        var makerid = await commonService.insertLogs(user_id, "Cancel Dispatch");           
        const exeQuery = await client.query(`INSERT INTO  tbl_dispatch_delete_details(dispatch_id, order_no, customer_code, order_set,dispatch_set, size_id, dispatch_type, user_id, created_at,dispatch_date,dispatch_no,status_flag,dispatch_pieces,delete_dispatch_id)
                SELECT dispatch_id,order_no,customer_code,order_set,dispatch_set,size_id,dispatch_type,$1,
                CURRENT_TIMESTAMP,dispatch_date,dispatch_no,status_flag,dispatch_pieces,$2
                from tbl_dispatch_details where dispatch_id = $3 and dispatch_no = $4 and size_id = $5 and customer_code= $6 `,[user_id, delete_dispatch_id, dispatch_details[i].dispatch_id,dispatch_details[i].dispatch_no,dispatch_details[i].size_id,dispatch_details[i].customer_code])
        if (exeQuery && exeQuery.rowCount > 0) {
          await client.query(`DELETE FROM tbl_dispatch_details where  dispatch_id = $1 and dispatch_no = $2 and size_id = $3 and customer_code= $4`,[dispatch_details[i].dispatch_id,dispatch_details[i].dispatch_no,dispatch_details[i].size_id,dispatch_details[i].customer_code]); 
        }
      } 
    } 
    
    if (client) {
      client.end();
    } 
    return response = { "message": constants.DispatchMessage.DELETESUCCESS, "statusFlag": 1 }; 
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