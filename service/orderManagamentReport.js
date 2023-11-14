const commonService = require('../service/commonService')
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');

module.exports.customerWiserOrderListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//Get Order taking list
module.exports.customerWiserOrderList = async (req) => {
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
      const { status_id, from_date, to_date, limit, offset, process,company_code } = decoded.data;
      var datediff = '1=1', status_code = "1=1",getcustomercode = '1=1';
      if (decoded) {
        if (status_id != "0" && status_id != 0) {
          status_code = `a.status_code='` + status_id + `' `;
        }
        if (from_date && to_date) {
          datediff = `to_char(a.order_date,'YYYY-MM-DD') :: date BETWEEN `
            .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
        }
        if (company_code && company_code != "" && company_code != "0") {
          getcustomercode = `a.customer_code='` + company_code + `'`;
        }
        const order_count = await client.query(`select count(1) as totalcount  from tbl_order_taking as a inner join tbl_customer as b on a.customer_code = b.customer_code where ` + datediff + ` and ` + status_code + ` and `+ getcustomercode +` `);

        const order_qty = await client.query(`select sum(qty) as totalset,sum(qty*coalesce(d.total_set,'0')::Integer) as totalpiece  from tbl_order_taking as a inner join tbl_customer as b
          on a.customer_code = b.customer_code  inner join tbl_order_taking_items as c on a.order_no=c.order_no
          inner join tbl_item_sizes as d on c.size_id=d.size_id where ` + datediff + ` and ` + status_code + ` and `+ getcustomercode +``);
          const OrderWidget = await client.query(`SELECT item_name,item_code,order_set,order_pieces  FROM (SELECT d.item_code,sum(b.qty) as order_set, sum(qty*coalesce(c.total_set,'0')::Integer) as order_pieces FROM tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no =b.order_no inner join tbl_item_sizes as c ON c.size_id = b.size_id inner join tbl_item_management as d on d.trans_no=c.trans_no inner join tbl_customer as e ON e.customer_code = a.customer_code where ` + datediff + ` and ` + status_code + ` and `+ getcustomercode +` group by d.item_code) as dev inner join tbl_def_item as f on dev.item_code = f.item_id  `)

        if (process === 'View') {
          // const order_Result = await client.query(`select a.order_no,b.customer_code,b.customer_name,b.city,b.contact_person,b.mobile_no,b.gstin_no,b.alternative_mobile_no,(select coalesce(sum(qty),0) from tbl_order_taking_items where order_no= a.order_no) as totalset,(select sum(coalesce(qty,0) * coalesce((select coalesce(total_set,'1')::integer from tbl_item_sizes where size_id=d.size_id),'1')) from tbl_order_taking_items as d inner join tbl_order_taking as e on
          //   d.order_no= e.order_no where e.order_no= a.order_no)   
          //  as totalpiece,to_char(a.order_date,'dd-mm-yyyy') as order_date,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate,a.status_code,case when a.status_code=1 then 'Active' else 'Cancelled' end as statusname from tbl_order_taking as a inner join tbl_customer as b on a.customer_code = b.customer_code where ` + datediff + ` and ` + status_code + `  and `+ getcustomercode +`  order by a.created_date LIMIT $1 OFFSET $2`, [limit, offset]);

          const order_Result = await client.query(`SELECT order_no,customer_code,customer_name,city,contact_person,mobile_no,gstin_no,alternative_mobile_no,totalset,totalpiece,order_date,employeename,createddate,status_code,statusname,dispatch_set,dispatch_pieces, (totalset - dispatch_set) as pending_dispatch_set,(totalpiece - dispatch_pieces) as pending_dispatch_pieces FROM (select a.order_no,b.customer_code,b.customer_name,b.city,b.contact_person,b.mobile_no,b.gstin_no,b.alternative_mobile_no,(select coalesce(sum(qty),0) from tbl_order_taking_items where order_no= a.order_no) as totalset,(select sum(coalesce(qty,0) * coalesce((select coalesce(total_set,'1')::integer from tbl_item_sizes where size_id=d.size_id),'1')) from tbl_order_taking_items as d inner join tbl_order_taking as e on d.order_no= e.order_no where e.order_no= a.order_no) as totalpiece,to_char(a.order_date,'dd-mm-yyyy') as order_date,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select 
           coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate,a.status_code,case when a.status_code=1 then 'Active' else case when a.status_code=3 then 'Hold' else 'Cancelled' end end as statusname,coalesce((SELECT sum(dispatch_set) as dispatch_set  FROM tbl_dispatch_details where order_no = a.order_no and status_flag = 1),0) as dispatch_set,coalesce((SELECT sum(dispatch_pieces) as dispatch_pieces FROM tbl_dispatch_details where order_no = a.order_no and status_flag = 1),0) as dispatch_pieces from tbl_order_taking as a inner join tbl_customer as b on a.customer_code = b.customer_code where ` + datediff + ` and ` + status_code + `  and `+ getcustomercode +` order by a.created_date) as dev LIMIT $1 OFFSET $2`,  [limit, offset]);

          let Lists = order_Result && order_Result.rows ? order_Result.rows : [];
          let TotalList = order_count && order_count.rows ? order_count.rows[0].totalcount : 0;
          let TotalQty = order_qty && order_qty.rows ? order_qty.rows : [];
          let Order_Widget = OrderWidget && OrderWidget.rows ? OrderWidget.rows : [];
          if (client) {
            client.end();
          }
          if (Lists && Lists.length > 0) {
            return response = { "OrderTakinglist": Lists, "OrderTotalCount": TotalList, "TotalQty": TotalQty, "OrderWidget" : Order_Widget }
          }
          else {
            return response = { "OrderTakinglist": [], "OrderTotalCount": 0, "TotalQty": [], "OrderWidget" : [] }
          }
        }
        else {
          const company_details = await client.query(`SELECT  print_id, company_name, addressline1, addressline2, area, city, gstin, mobile_number, telephone_number, status_id, footer_name
            FROM  tbl_print_setting where  print_id = 1`);
          
          // const order_Result = await client.query(`select a.order_no,b.customer_code,b.customer_name,b.city,b.contact_person,b.mobile_no,b.gstin_no,b.alternative_mobile_no,(select coalesce(sum(qty),0) from tbl_order_taking_items where order_no= a.order_no) as totalset,(select sum(coalesce(qty,0) * coalesce((select coalesce(total_set,'1')::integer from tbl_item_sizes where size_id=d.size_id),'1')) from tbl_order_taking_items as d inner join tbl_order_taking as e on
          //   d.order_no= e.order_no where e.order_no= a.order_no)   
          //  as totalpiece,to_char(a.order_date,'dd-mm-yyyy') as order_date,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate,a.status_code,case when a.status_code=1 then 'Active' else 'Cancelled' end as statusname from tbl_order_taking as a inner join tbl_customer as b on a.customer_code = b.customer_code where ` + datediff + ` and ` + status_code + ` and `+ getcustomercode +`  order by a.created_date`);

          const order_Result = await client.query(`SELECT order_no,customer_code,customer_name,city,contact_person,mobile_no,gstin_no,alternative_mobile_no,totalset,totalpiece,order_date,employeename,createddate,status_code,statusname,dispatch_set,dispatch_pieces, (totalset - dispatch_set) as pending_dispatch_set,(totalpiece - dispatch_pieces) as pending_dispatch_pieces FROM (select a.order_no,b.customer_code,b.customer_name,b.city,b.contact_person,b.mobile_no,b.gstin_no,b.alternative_mobile_no,(select coalesce(sum(qty),0) from tbl_order_taking_items where order_no= a.order_no) as totalset,(select sum(coalesce(qty,0) * coalesce((select coalesce(total_set,'1')::integer from tbl_item_sizes where size_id=d.size_id),'1')) from tbl_order_taking_items as d inner join tbl_order_taking as e on d.order_no= e.order_no where e.order_no= a.order_no) as totalpiece,to_char(a.order_date,'dd-mm-yyyy') as order_date,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select 
            coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate,a.status_code,case when a.status_code=1 then 'Active' else 'Cancelled' end as statusname,coalesce((SELECT sum(dispatch_set) as dispatch_set FROM tbl_dispatch_details where order_no = a.order_no and status_flag = 1),0) as dispatch_set,coalesce((SELECT sum(dispatch_pieces) as dispatch_pieces FROM tbl_dispatch_details where order_no = a.order_no and status_flag = 1),0) as dispatch_pieces from tbl_order_taking as a inner join tbl_customer as b on a.customer_code = b.customer_code where ` + datediff + ` and ` + status_code + `  and `+ getcustomercode +` order by a.created_date) as dev`);

          const item_Result = await client.query(` SELECT  c.item_code,sum(qty) ||' set '|| sum(qty*coalesce(b.total_set,'0')::Integer) || ' piece' as total_piece,
           (select item_name from tbl_def_item where item_id=c.item_code) as item_name,'body' as process
           from tbl_order_taking as a   inner join  tbl_order_taking_items as c on  c.order_no=a.order_no inner join tbl_item_sizes as b on c.size_id=b.size_id  where ` + datediff + ` and ` + status_code + ` and `+ getcustomercode +`   group by c.item_code  order by c.item_code`);


          let Lists = order_Result && order_Result.rows ? order_Result.rows : [];
          let TotalList = order_count && order_count.rows ? order_count.rows[0].totalcount : 0;
          let company_data = company_details && company_details.rows ? company_details.rows : [];
          let item_Result_list = item_Result && item_Result.rows ? item_Result.rows : [];
          let Order_Widget = OrderWidget && OrderWidget.rows ? OrderWidget.rows : [];
          if (client) {
            client.end();
          }
          if (Lists && Lists.length > 0) {
            return response = { "OrderTakinglist": Lists, "OrderTotalCount": TotalList, "company_details": company_data, "item_Result": item_Result_list,  "OrderWidget" : Order_Widget }
          }
          else {
            return response = { "OrderTakinglist": [], "OrderTotalCount": 0, "company_details": [], "item_Result": [],"OrderWidget" : [] }
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


module.exports.itemWiseOrderListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//Get Order taking list
module.exports.itemWiseOrderList = async (req) => {
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
      const { user_id, from_date, to_date, limit, offset, color_id, design_id, customer_code,size_id } = decoded.data;
      var datediff = '1=1';
      var getcolor_id = '1=1';
      var getdesign_id = '1=1';
      var getcustomer_code = '1=1';
      var getsize_id = '1=1';
      if (decoded) {
        if (from_date && to_date) {
          datediff = `to_char(c.order_date,'YYYY-MM-DD') :: date BETWEEN `
            .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
        }
        if (color_id != "0" && color_id != '') {
          const color_code_val = color_id ? '\'' + color_id.split(',').join('\',\'') + '\'' : ''
          getcolor_id = `f.color_id in (` + color_code_val + `) `;
        }
        if (design_id != "0" && design_id != '') {
          const design_code_val = design_id ? '\'' + design_id.split(',').join('\',\'') + '\'' : ''
          getdesign_id = `e.design_id in  (` + design_code_val + `) `;
        }
        if (customer_code != "0" && customer_code != 0) {
          const color_code_val = customer_code ? '\'' + customer_code.split(',').join('\',\'') + '\'' : ''
          getcustomer_code = `d.customer_code in (` + color_code_val + `) `;
        }
        if (size_id != "0" && size_id != '') {
          const color_code_val = size_id ? '\'' + size_id.split(',').join('\',\'') + '\'' : ''
          getsize_id = `coalesce(b.start_size,'') || '-'|| coalesce(b.end_size,'') in (` + color_code_val + `) `;
        }
        const order_count = await client.query(` SELECT count(*) as totalcount from (select a.size_id 
          from tbl_order_taking_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id
          inner join tbl_order_taking  as c on  c.order_no=a.order_no   inner join tbl_customer as d on d.customer_code=c.customer_code   inner join tbl_item_management as e on e.design_id=a.design_code 
          left join tbl_color as f on f.color_id =b.color_id where `+ datediff + ` and ` + getcolor_id + ` and ` + getdesign_id + ` and ` + getcustomer_code + ` and `+getsize_id+` and c.status_code=1  group by a.size_id,b.qr_code,a.item_code) as dev `);

        const item_data_Result = await client.query(` SELECT a.size_id,b.qr_code,a.item_code,sum(qty) as total_set , sum(qty*coalesce(b.total_set,'0')::Integer) as total_piece,
          (select item_name from tbl_def_item where item_id=a.item_code) as item_name,'body' as process
          from tbl_order_taking_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id
          inner join tbl_order_taking  as c on  c.order_no=a.order_no   inner join tbl_customer as d on d.customer_code=c.customer_code   inner join tbl_item_management as e on e.design_id=a.design_code 
          left join tbl_color as f on f.color_id =b.color_id where `+ datediff + ` and ` + getcolor_id + ` and ` + getdesign_id + ` and ` + getcustomer_code + ` and `+getsize_id+` and c.status_code=1 group by a.size_id,b.qr_code,a.item_code LIMIT $1 OFFSET $2`, [limit, offset]);

        const item_data_qty = await client.query(` SELECT sum(total_set) as totalset,sum(total_piece) as  totalpiece from (SELECT a.size_id,b.qr_code,a.item_code,sum(qty) as total_set , sum(qty*coalesce(b.total_set,'0')::Integer) as total_piece,
          (select item_name from tbl_def_item where item_id=a.item_code) as item_name
          from tbl_order_taking_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id
          inner join tbl_order_taking  as c on  c.order_no=a.order_no   inner join tbl_customer as d on d.customer_code=c.customer_code   inner join tbl_item_management as e on e.design_id=a.design_code 
          left join tbl_color as f on f.color_id =b.color_id where `+ datediff + ` and ` + getcolor_id + ` and ` + getdesign_id + ` and ` + getcustomer_code + ` and `+getsize_id+` and c.status_code=1 group by a.size_id,b.qr_code,a.item_code  ) as dev`);

        let Lists = item_data_Result && item_data_Result.rows ? item_data_Result.rows : [];
        let result = [];

        if (Lists.length > 0) {
          for (let i = 0; i < Lists.length; i++) {
            const size_Result = await client.query(` SELECT d.customer_code,
                d.customer_name,d.mobile_no,d.contact_person,sum(qty) as total_set ,d.city, 
                sum(qty*coalesce(b.total_set,'0')::Integer) as total_piece 
                    from tbl_order_taking_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id
                    inner join tbl_order_taking  as c on  c.order_no=a.order_no  
                inner join tbl_customer as d on d.customer_code=c.customer_code inner join tbl_item_management as e on e.design_id=a.design_code 
                left join tbl_color as f on f.color_id =b.color_id where `+ datediff + ` and ` + getcolor_id + ` and ` + getdesign_id + ` and ` + getcustomer_code + ` and `+getsize_id+` and   a.size_id='` + Lists[i].size_id + `' and c.status_code=1  group by a.size_id,d.customer_code,
                d.customer_name,d.mobile_no,d.contact_person ` );
            let size_Array = [];
            if (customer_code != "0" && customer_code != 0) {
              size_Array = [];
            } else {
              size_Array = size_Result && size_Result.rows ? size_Result.rows : [];
            }
            let obj = Lists[i]
            obj['SizeArray'] = size_Array
            result.push(obj)
          }
          let total_sets = item_data_qty && item_data_qty.rows.length > 0 ? item_data_qty.rows[0].totalset : 0;
          let total_pieces = item_data_qty && item_data_qty.rows.length > 0 ? item_data_qty.rows[0].totalpiece : 0;
          let obj1 = { size_id: "", qr_code: "Total", item_code: "", total_set: total_sets, total_piece: total_pieces, item_name: "", process: "footer", SizeArray: [] }
          result.push(obj1)
        }
        const single_item_qtys = await client.query(`select sum(total_set) as totalset,sum(total_piece) as  totlapiece from ( SELECT  a.item_code,sum(qty) as total_set , sum(qty*coalesce(b.total_set,'0')::Integer) as total_piece,
          (select item_name from tbl_def_item where item_id=a.item_code) as item_name
          from tbl_order_taking_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id
          inner join tbl_order_taking  as c on  c.order_no=a.order_no   inner join tbl_customer as d on d.customer_code=c.customer_code   inner join tbl_item_management as e on e.design_id=a.design_code 
          left join tbl_color as f on f.color_id =b.color_id  where `+ datediff + ` and ` + getcolor_id + ` and ` + getdesign_id + ` and ` + getcustomer_code + ` and `+getsize_id+` and c.status_code=1  group by a.item_code ) as dev`)
        let item_set = single_item_qtys && single_item_qtys.rows.length > 0 ? single_item_qtys.rows[0].totalset : 0;
        let item_piece = single_item_qtys && single_item_qtys.rows.length > 0 ? single_item_qtys.rows[0].totlapiece : 0;

        let item_design = '';
        if (item_set > 0) {
          item_design = ` union all select 0, ` + item_set + ` ,` + item_piece + `,'Total' ,'footer' as process`;
        }


        const item_Result = await client.query(` SELECT  a.item_code,sum(qty) as total_set , sum(qty*coalesce(b.total_set,'0')::Integer) as total_piece,
          (select item_name from tbl_def_item where item_id=a.item_code) as item_name,'body' as process
          from tbl_order_taking_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id
          inner join tbl_order_taking  as c on  c.order_no=a.order_no   inner join tbl_customer as d on d.customer_code=c.customer_code   inner join tbl_item_management as e on e.design_id=a.design_code 
          left join tbl_color as f on f.color_id =b.color_id   where `+ datediff + ` and ` + getcolor_id + ` and ` + getdesign_id + ` and ` + getcustomer_code + ` and `+getsize_id+` and c.status_code=1  group by a.item_code  ` + item_design + ` `);

        let TotalList = order_count && order_count.rows.length > 0 ? order_count.rows[0].totalcount : 0;
        let TotalDesignList = 0;
        let ItemDesignResult = [];
        let TotalItemList = 0;
        let ItemResultList = item_Result && item_Result.rows.length > 0 ? item_Result.rows : [];
        let item_data_qty_result = item_data_qty && item_data_qty.rows.length > 0 ? item_data_qty.rows : [];

        if (client) {
          client.end();
        }
        if (TotalList) {
          return response = { "Itemwiselist": result, "ItemwiseCount": TotalList, "Designlist": ItemDesignResult, "DesignCount": TotalDesignList, "Itemlist": ItemResultList, "ItemCount": TotalItemList, "item_data_qty_result": item_data_qty_result }
        }
        else {
          return response = { "Itemwiselist": [], "ItemwiseCount": 0, "Designlist": [], "DesignCount": 0, "Itemlist": [], "ItemCount": 0, "item_data_qty_result": [] }
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

module.exports.customerOrderListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//Get Customer taking list
module.exports.customerOrderList = async (req) => {
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
      const { user_id, from_date, to_date, limit, offset, company_code, process,design_id, set_type, size_id  } = decoded.data;
      var datediff = '1=1', getcustomercode = '1=1', getdesign_id='1=1', getset_type='1=1', get_another_set_type='1=1', getsize_id='1=1', get_another_size_id='1=1';
      if (decoded) {
        if (from_date && to_date) {
          datediff = `to_char(order_date,'YYYY-MM-DD') :: date BETWEEN `
            .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
        }
        if (company_code && company_code != "" && company_code != "0") {
          const color_code_val = company_code ? '\'' + company_code.split(',').join('\',\'') + '\'' : ''
          getcustomercode = `a.customer_code in (` + color_code_val + `) ` 
        }
        
        if (design_id && design_id != "" && design_id != "0") {
          const design_code_val = design_id ? '\'' + design_id.split(',').join('\',\'') + '\'' : ''
          getdesign_id = `e.design_id in (` + design_code_val + `) `;
        }
        if (set_type != "0" && set_type != '') {
          const color_code_val = set_type ? '\'' + set_type.split(',').join('\',\'') + '\'' : ''
          getset_type = `d.settype in (` + color_code_val + `) `;
          get_another_set_type= `c.settype in (` + color_code_val + `) `;
        }
        if (size_id != "0" && size_id != '') {
          const color_code_val = size_id ? '\'' + size_id.split(',').join('\',\'') + '\'' : ''
          getsize_id = `coalesce(d.start_size,'') || '-'|| coalesce(d.end_size,'') in (` + color_code_val + `) `;
          get_another_size_id = `coalesce(c.start_size,'') || '-'|| coalesce(c.end_size,'') in (` + color_code_val + `) `;
        }
        const order_count = await client.query(`select count(*) as totalcount from (select a.customer_code from tbl_customer as a inner join tbl_order_taking as b on a.customer_code=b.customer_code  inner join tbl_order_taking_items as c on b.order_no = c.order_no inner join tbl_item_sizes as d   on d.size_id=c.size_id  inner join tbl_item_management as e on e.trans_no =d.trans_no where  ` + datediff + ` and ` + getcustomercode + ` and `+getdesign_id+` and `+getset_type+` and `+getsize_id+` and b.status_code=1 group by a.customer_name,a.contact_person,a.mobile_no,a.alternative_mobile_no,a.street ,a.area,a.city,a.pincode,a.email_id,a.gstin_no, a.customer_code) as dev`);

        if (process === 'View') {
          const item_Result = await client.query(`select a.customer_name,a.contact_person,a.mobile_no,a.alternative_mobile_no,a.street,a.area,a.city,a.pincode,a.email_id,a.gstin_no, a.customer_code, sum(coalesce(qty,'0'))  
          as sumqty,sum(qty*coalesce(d.total_set,'0')::Integer) as totalpiece from tbl_customer as a inner join tbl_order_taking as b on a.customer_code=b.customer_code inner join tbl_order_taking_items as c on b.order_no = c.order_no inner join tbl_item_sizes as d   on d.size_id=c.size_id  inner join tbl_item_management as e on e.trans_no =d.trans_no where  `+ datediff + `and ` + getcustomercode + `  and `+getdesign_id+`  and `+getset_type+` and `+getsize_id+`  and b.status_code=1  group by a.customer_name,a.contact_person,a.mobile_no,a.alternative_mobile_no,a.street  ,a.area,a.city,a.pincode,a.email_id,a.gstin_no, a.customer_code  LIMIT $1 OFFSET $2`, [limit, offset]);

          let Lists = item_Result && item_Result.rows ? item_Result.rows : [];
          let result = [];

          if (Lists.length > 0) {
            for (let i = 0; i < Lists.length; i++) { 
              const single_item_qtys = await client.query(`select sum(total_set) as qty,sum(total_piece) as  totlapiece from ( SELECT sum(b.qty) as total_set , sum(b.qty*coalesce(c.total_set,'0')::Integer) as total_piece from tbl_order_taking as a inner join tbl_order_taking_items  as b on  b.order_no = a.order_no  inner join tbl_item_sizes as c on b.size_id = c.size_id inner join tbl_item_management as  e on e.trans_no=c.trans_no  and a.status_code=1  where a.customer_code='` + Lists[i].customer_code + `' and  ` + datediff + ` and `+getdesign_id+` and `+get_another_set_type+` and `+get_another_size_id+` ) as dev`)
              let item_set = single_item_qtys && single_item_qtys.rows.length > 0 ? single_item_qtys.rows[0].qty : 0;
              let item_piece = single_item_qtys && single_item_qtys.rows.length > 0 ? single_item_qtys.rows[0].totlapiece : 0;

              let item_design = '';
              if (item_set > 0) {
                item_design = ` union all select  99999 as sno,'','','','', ` + item_set + ` ,0,0,0,` + item_piece + `,'Total' ,'footer' as process`;
              }

              const size_Result = await client.query(`select * from (select 1 as sno,a.order_no,a.customer_code,b.design_code,to_char(a.order_date,'dd-mm-yyyy') as order_date,sum(b.qty) as qty,b.size_id,b.item_code,b.color_id,sum(b.qty*coalesce(c.total_set,'0')::Integer) as total_piece, (select item_name from tbl_def_item where item_id=b.item_code ) || ' '|| b.design_code|| '-'||  (select settype from tbl_item_sizes  where size_id=b.size_id) ||  (select '('||start_size||'/'||end_size||')' from tbl_item_sizes where size_id=b.size_id) as item_name,'body' as process   from tbl_order_taking as a inner join tbl_order_taking_items as b  on a.order_no=b.order_no inner join tbl_item_sizes as c on b.size_id = c.size_id inner join tbl_item_management as  e on e.trans_no=c.trans_no  where a.customer_code='` + Lists[i].customer_code + `' and  ` + datediff + ` and `+getdesign_id+`  and `+get_another_set_type+`  and `+get_another_size_id+`  and a.status_code=1   group by b.design_code, a.customer_code,a.order_date,b.size_id,b.item_code,b.color_id,a.order_no `+ item_design +` ) as dev order by sno,order_date`);
              let size_Array = size_Result && size_Result.rows ? size_Result.rows : [];
              let obj = Lists[i]
              obj['SizeArray'] = size_Array
              result.push(obj)
            }
          }
          let TotalList = order_count && order_count.rows.length > 0 ? order_count.rows[0].totalcount : 0;

          if (client) {
            client.end();
          }
          if (Lists && Lists.length > 0) {
            return response = { "Customerwiselist": result, "CustomerwiseCount": TotalList }
          }
          else {
            return response = { "Customerwiselist": [], "CustomerwiseCount": 0, }
          }
        }
        else {

          const item_Result = await client.query(`select a.customer_name,a.contact_person,a.mobile_no,a.alternative_mobile_no,a.street,a.area,a.city,a.pincode,a.email_id,a.gstin_no, a.customer_code, sum(coalesce(qty,'0'))  
          as sumqty,sum(qty*coalesce(d.total_set,'0')::Integer) as totalpiece from tbl_customer as a inner join tbl_order_taking as b on a.customer_code=b.customer_code inner join tbl_order_taking_items as c on b.order_no = c.order_no inner join tbl_item_sizes as d   on d.size_id=c.size_id inner join tbl_item_management as e on e.trans_no =d.trans_no where  `+ datediff + `and ` + getcustomercode + `  and `+getdesign_id+` and `+getset_type+` and `+getsize_id+`  and b.status_code=1  group by a.customer_name,a.contact_person,a.mobile_no,a.alternative_mobile_no,a.street  ,a.area,a.city,a.pincode,a.email_id,a.gstin_no, a.customer_code`);
          let Lists = item_Result && item_Result.rows ? item_Result.rows : [];
          let result = [];

          if (Lists.length > 0) {
            for (let i = 0; i < Lists.length; i++) {
              const size_Result = await client.query(`select a.order_no,a.customer_code,b.design_code,to_char(a.order_date,'dd-mm-yyyy') as order_date,sum(b.qty) as qty,b.size_id,b.item_code,b.color_id,sum(b.qty*coalesce(c.total_set,'0')::Integer) as total_piece, (select item_name from tbl_def_item where item_id=b.item_code ) || ' '|| b.design_code|| '-'||  (select settype from tbl_item_sizes where size_id=b.size_id) ||  (select '('||start_size||'/'||end_size||')' from tbl_item_sizes where size_id=b.size_id) as item_name   from tbl_order_taking as a inner join tbl_order_taking_items as b  on a.order_no=b.order_no inner join tbl_item_sizes as c on b.size_id = c.size_id  inner join tbl_item_management as  e on e.trans_no=c.trans_no  where a.customer_code='` + Lists[i].customer_code + `' and  ` + datediff + ` and `+getdesign_id+`  and `+get_another_set_type+` and `+get_another_size_id+` and a.status_code=1  group by b.design_code, a.customer_code,a.order_date,b.size_id,b.item_code,b.color_id,a.order_no order by a.order_date  `);
              let size_Array = size_Result && size_Result.rows ? size_Result.rows : [];
              let obj = Lists[i]
              obj['SizeArray'] = size_Array
              result.push(obj)
            }
          }
          const company_Result = await client.query(`SELECT * from tbl_print_setting`);
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];
          let TotalList = order_count && order_count.rows.length > 0 ? order_count.rows[0].totalcount : 0;

          if (client) {
            client.end();
          }
          if (Lists && Lists.length > 0) {
            return response = { "Customerwiselist": result, "CustomerwiseCount": TotalList, "CompanyArray": Company_Array }
          }
          else {
            return response = { "Customerwiselist": [], "CustomerwiseCount": 0, "CompanyArray": [] }
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


module.exports.currentStockListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//Get current stock
module.exports.currentStockList = async (req) => {
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
      const { limit, offset } = decoded.data;

      if (decoded) {
        const stock_count = await client.query(`select count(*) as totalcount  from (select b.size_id   from tbl_stock_transaction as a  right outer join tbl_item_sizes as b on a.size_id=b.size_id inner join tbl_item_management as  c on c.trans_no =b.trans_no   inner join tbl_def_item as d on c.item_code=d.item_id group by b.size_id,d.item_name) as dev    `);


        const stock_Result = await client.query(`select coalesce(b.current_stock,0)+sum(coalesce(inward_set,0)) as inward,b.size_id, sum(coalesce(outward_set,0)) as outward, coalesce((coalesce(current_stock,0)+sum(coalesce(inward_set,0)))-sum(coalesce(outward_set,0)),0) as closingstock,  d.item_name,b.qr_code  from tbl_stock_transaction as a  right outer join tbl_item_sizes as b on a.size_id=b.size_id inner join tbl_item_management as  c on c.trans_no =b.trans_no   inner join tbl_def_item as d on c.item_code=d.item_id group by b.size_id,d.item_name  LIMIT $1 OFFSET $2`, [limit, offset]);

        let Lists = stock_Result && stock_Result.rows ? stock_Result.rows : [];
        let TotalList = stock_count && stock_count.rows ? stock_count.rows[0].totalcount : 0;

        if (client) {
          client.end();
        }
        if (Lists && Lists.length > 0) {
          return response = { "CurrentStockList": Lists, "CurrentStockCount": TotalList }
        }
        else {
          return response = { "CurrentStockList": [], "CurrentStockCount": 0 }
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



module.exports.reportMasterListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//Get Master data
module.exports.reportMasterList = async (req) => {
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
      const { user_id, process } = decoded.data;

      if (decoded) {
        const customer_data = await client.query(`select 'All' as label, '0' as value  union all select coalesce(customer_name,'') || ' - '|| coalesce(mobile_no,'') as label, customer_code as value from tbl_customer order by value,label    `);

        const design_data = await client.query(`select 'All' as label,'0' as value union all select design_id as label,design_id as value from tbl_item_management order by value  `);

        const color_data = await client.query(`select 'All' as label,'0' as value union all select color_name as label,color_id as value from tbl_color order by value,label `);

        const size_data = await client.query(`select * from (SELECT 'All' as label,'0' as value union all SELECT distinct coalesce(start_size,'') || '-'|| coalesce(end_size,'') as label, coalesce(start_size,'') || '-'||
        coalesce(end_size,'') as value FROM tbl_item_sizes) as dev where trim(dev.label) != '-' order by dev.value,dev.label`);

        const design_Result = await client.query(`select distinct  qr_code as label,b.size_id as value from tbl_job_details as a inner join tbl_item_sizes as b on a.design_id = b.size_id where design_id is not NULL`  );

        const design_Result1 = await client.query(` select a.size_id as value,a.qr_code as label,total_set,
        coalesce((select sum(no_of_set) from tbl_fg_items where size_id=a.size_id),0) -
        coalesce((select sum(dispatch_set) from tbl_dispatch_details where  status_flag = 1 and size_id=a.size_id),0) as total_qty
        from tbl_item_sizes as a  order by value `);

        const ironMachine_Result = await client.query(`SELECT '0' as value,'All' as label union all SELECT machine_id as value, machine_no || coalesce(' - ' || machine_name,'') as label FROm tbl_ironmachine_master`);

        let Customer_Lists = customer_data && customer_data.rows ? customer_data.rows : [];
        let Design_Lists = design_data && design_data.rows ? design_data.rows : [];
        let Color_Lists = color_data && color_data.rows ? color_data.rows : [];
        let Size_Lists = size_data && size_data.rows ? size_data.rows : [];
        let item_Array = design_Result1 && design_Result1.rows ? design_Result1.rows : [];
        let ironmachine_Array = ironMachine_Result && ironMachine_Result.rows ? ironMachine_Result.rows : []; 

        let job_design_code = design_Result && design_Result.rows ? design_Result.rows : [];

        if (client) {
          client.end();
        }
        return response = { "Customer_Lists": Customer_Lists, "Design_Lists": Design_Lists, "Color_Lists": Color_Lists, "Size_Lists": Size_Lists, "design_code_list":job_design_code, "itemArray": item_Array,"ironmachineArray": ironmachine_Array }

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


module.exports.excelItemWiseOrderListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

//Get Excel Item Order list
module.exports.excelItemWiseOrderList = async (req) => {
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
      const { user_id, from_date, to_date, color_id, design_id, customer_code, size_id } = decoded.data;
      var datediff = '1=1';
      var getcolor_id = '1=1';
      var getdesign_id = '1=1';
      var getcustomer_code = '1=1';
      var getsize_id = '1=1';
      if (decoded) {
        if (from_date && to_date) {
          datediff = `to_char(c.order_date,'YYYY-MM-DD') :: date BETWEEN `
            .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
        }
        if (color_id != "0" && color_id != '') {
          const color_code_val = color_id ? '\'' + color_id.split(',').join('\',\'') + '\'' : ''
          getcolor_id = `f.color_id in (` + color_code_val + `) `;
        }
        if (design_id != "0" && design_id != '') {
          const design_code_val = design_id ? '\'' + design_id.split(',').join('\',\'') + '\'' : ''
          getdesign_id = `e.design_id in  (` + design_code_val + `) `;
        }
        if (customer_code != "0" && customer_code != '') {
          const color_code_val = customer_code ? '\'' + customer_code.split(',').join('\',\'') + '\'' : ''
          getcustomer_code = `d.customer_code in (` + color_code_val + `) `;
        }
        if (size_id != "0" && size_id != '') {
          const color_code_val = size_id ? '\'' + size_id.split(',').join('\',\'') + '\'' : ''
          getsize_id = `coalesce(b.start_size,'') || '-'|| coalesce(b.end_size,'') in (` + color_code_val + `) `;
        }
        
        const item_data_Result = await client.query(` SELECT a.size_id,b.qr_code,a.item_code,sum(qty) as total_set , sum(qty*coalesce(b.total_set,'0')::Integer) as total_piece,
          (select item_name from tbl_def_item where item_id=a.item_code) as item_name,'body' as process
          from tbl_order_taking_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id
          inner join tbl_order_taking  as c on  c.order_no=a.order_no   inner join tbl_customer as d on d.customer_code=c.customer_code   inner join tbl_item_management as e on e.design_id=a.design_code 
          left join tbl_color as f on f.color_id =b.color_id where `+ datediff + ` and ` + getcolor_id + ` and ` + getdesign_id + ` and ` + getcustomer_code + ` and `+getsize_id+`  and c.status_code=1 group by a.size_id,b.qr_code,a.item_code order by a.item_code asc`);

        let Lists = item_data_Result && item_data_Result.rows ? item_data_Result.rows : [];
        let result = [];

        if (Lists.length > 0) {
          for (let i = 0; i < Lists.length; i++) {
            const size_Result = await client.query(` SELECT d.customer_code,
              d.customer_name,d.mobile_no,d.contact_person,sum(qty) as total_set ,d.city, 
              sum(qty*coalesce(b.total_set,'0')::Integer) as total_piece 
                  from tbl_order_taking_items as a inner join tbl_item_sizes as b on a.size_id=b.size_id
                  inner join tbl_order_taking  as c on  c.order_no=a.order_no  
              inner join tbl_customer as d on d.customer_code=c.customer_code inner join tbl_item_management as e on e.design_id=a.design_code 
              left join tbl_color as f on f.color_id =b.color_id where `+ datediff + ` and ` + getcolor_id + ` and ` + getdesign_id + ` and ` + getcustomer_code + `  and `+getsize_id+`  and   a.size_id='` + Lists[i].size_id + `'  and c.status_code=1  group by a.size_id,d.customer_code,
              d.customer_name,d.mobile_no,d.contact_person ` );
            let size_Array = [];
            if (customer_code != "0" && customer_code != 0) {
              size_Array = [];
            } else {
              size_Array = size_Result && size_Result.rows ? size_Result.rows : [];
            }
            let obj = Lists[i]
            obj['SizeArray'] = size_Array
            result.push(obj)
          }
        }
        const company_Result = await client.query(`SELECT * from tbl_print_setting`);
        let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];

        if (client) {
          client.end();
        }
        if (Lists && Lists.length > 0) {
          return response = { "ExcelItemwiselist": result, "CompanyArray": Company_Array }
        }
        else {
          return response = { "ExcelItemwiselist": [], CompanyArray: [] }
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