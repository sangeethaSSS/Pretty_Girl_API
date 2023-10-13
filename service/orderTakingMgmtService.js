const commonService = require('../service/commonService')
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
//Require dependecies for pdf generation
const fs = require('fs') // file read and write permission
const path = require('path') // for get the html path
const utils = require('util') // for file checking
const puppeteer = require('puppeteer') //using headless mode
const hb = require('handlebars') //Compiing the template with handlebars
const https = require('https') //https 
const readFile = utils.promisify(fs.readFile)
//Bind Company Name
module.exports.ChangeAutoCompanyNamejwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.ChangeAutoCompanyName = async (req) => {
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
        const { searchvalue } = decoded.data
        if (searchvalue !== "") {
          const CustomerList = await client.query(`select distinct a.customer_code as value, a.customer_name as label,a.customer_name,a.contact_person,a.mobile_no,a.alternative_mobile_no,a.street,a.area,a.city,a.pincode,a.state,a.gstin_no from tbl_customer as a where a.status_code = 1 and Lower(a.customer_name) like '%'||Lower($1)||'%' order by a.customer_name`, [searchvalue])
          if (client) { client.end(); }
          let List_Array = CustomerList && CustomerList.rows ? CustomerList.rows : [];
          var response = {}
          response = { "CompanyList": List_Array }
          if (response) {
            return response
          }
          else {
            return response
          }
        }
        else {
          response = { "CompanyList": [] }
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

//Bind Item Code
module.exports.ChangeAutoItemCodejwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.ChangeAutoItemCode = async (req) => {
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
        const { itemcode } = decoded.data
        const Size_Result = await client.query(`select a.trans_no,b.start_size,b.size_id,b.end_size,b.total_set,b.qr_code,b.color_id,'' as qty,a.item_code,c.item_name,d.color_name,a.design_id from tbl_item_management as a inner join tbl_item_sizes as b on a.trans_no = b.trans_no inner join tbl_def_item as c on a.item_code = c.item_id left join tbl_color as d on b.color_id = d.color_id where b.size_id = $1`, [itemcode]);
        let sizeList = Size_Result && Size_Result.rows ? Size_Result.rows[0] : '';
        if (client) {
          client.end();

          if (sizeList && Object.keys(sizeList).length > 0) {
            return response = { "ItemList": sizeList }
          }
          else {
            return response = { "ItemList": [] }
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
module.exports.getCurrentOrderStockJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
} 

module.exports.getCurrentOrderStock = async (req) => {
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
      if (decoded != null) {
        const { itemcode, order_date } = decoded.data       
        const order_qty = await client.query(`SELECT coalesce(sum(b.qty),0) as order_qty from tbl_order_taking as a inner join tbl_order_taking_items as b on a.order_no = b.order_no where  to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('${order_date}','YYYY-MM-DD') and b.size_id = ${itemcode}`);
        let orderqty = order_qty && order_qty.rows && order_qty.rows[0] ? order_qty.rows[0].order_qty : 0;
        const current_stock = await client.query(`SELECT coalesce(sum(coalesce(no_of_set,0))- coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = a.size_id ),0),0) as current_set from tbl_fg_items as a inner join tbl_item_sizes as b on b.size_id=a.size_id where a.size_id = ${itemcode}  group by a.size_id`);
        let currentstock = current_stock && current_stock.rows && current_stock.rows[0] ? current_stock.rows[0].current_set : 0;
        if (client) {
          client.end();
          responseData = { "Order_Qty": orderqty, "Current_Stock": currentstock}
          if (responseData) {
            return responseData;
          }
          else {
            return '';
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

//create Save Check Order Taking jwt 
module.exports.saveOrderTakingjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}

//create Save Check Order Taking
module.exports.saveOrderTaking = async (req) => {
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
      const { order_date, customer_id, user_id, order_id, status_id, type, item_array, ref_no, process_flag, remarks } = decoded.data;
      if (decoded) {
        if (process_flag === 'Check_flag') {
          if (item_array && item_array.length > 0) {
            for (let i = 0; i < item_array.length; i++) {
              const total_qty = await client.query(`select coalesce(sum(current_stock),0) as stock  from tbl_item_sizes where size_id = $1 `, [item_array[i].size_id])
              var current_stock = total_qty && total_qty.rows[0].stock;
              if (current_stock > 0 && (order_id == '0' || order_id == 0)) {
                const CheckQty = await client.query(`select count(1) from (select coalesce(current_stock,0) + (select coalesce(sum(inward),0) - coalesce(sum(outward),0) from tbl_stock_transaction where size_id = $1 ) as current_stock from tbl_item_sizes where size_id = $1) as dev where current_stock >= $2`, [item_array[i].size_id, item_array[i].qty])

                let Stock_count = CheckQty && CheckQty.rows[0].count;
                if (Number(Stock_count) === 0) {
                  let text_message = item_array[i].item_name + " / " + item_array[i].qr_code
                  return response = { "message": `Quantity should be less than or equal to stock qty for this ` + text_message + `  `, "statusFlag": 2 };
                }
              }
              if (current_stock > 0 && order_id) {
                const total_qty = await client.query(`select distinct b.size_id,(sum(coalesce(inward,0))+
                coalesce(b.current_stock,0)-sum(coalesce(outward,0))) as currentstock 
                from tbl_stock_transaction as  a right join  tbl_item_sizes 
                as b on a.size_id=b.size_id where b.size_id = $1  group by b.size_id`, [item_array[i].size_id])

                var currentstock = total_qty && total_qty.rows[0].currentstock;

                const CheckQty = await client.query(`select coalesce(sum(inward),0) - coalesce(sum(outward),0) as old_qty from tbl_stock_transaction where size_id = $1 and lower(trans_no) = lower($2)`, [item_array[i].size_id, order_id])
                let old_Stock = CheckQty && CheckQty.rows[0].old_qty;
                let now_stock = (Number(currentstock) + Number(old_Stock)) - Number(item_array[i].qty);
                if (now_stock < Number(item_array[i].qty)) {
                  let text_message = item_array[i].qr_code
                  return response = { "message": `Quantity should be less than or equal to stock qty for this ` + text_message + `  `, "statusFlag": 2 };
                }
              }

            }
          }
        }

        if (order_id == '0') {
          const id_max = await client.query(`select case when coalesce(max(ref_no),0) + 1 <= 9999 then  (select LPAD((SELECT coalesce(max(ref_no),0) + 1 from tbl_order_taking where type = 'Portal' )::text,4,'0')) else (select (SELECT coalesce(max(ref_no),0) + 1 from tbl_order_taking where type = 'Portal' )::text) end as order_number from tbl_order_taking where type = 'Portal' `)
          var order_max = id_max && id_max.rows[0].order_number;

          const user_max = await client.query(`select case when `+ user_id + ` <= 99 then  (select LPAD(`+ user_id + `::text,2,'0'))  else (`+ user_id + ` ::text) end as userid`)

          var userid = user_max && user_max.rows[0].userid;

          var makerid = await commonService.insertLogs(user_id, "Insert Order Taking");

          var order_number = 'P' + userid + '-' + order_max
          const order_taking_result = await client.query(`INSERT INTO "tbl_order_taking"("ref_no","order_no","order_date","customer_code","status_code","type","maker_id","user_id","created_date",remarks) values ($1, $2, $3, $4, $5, $6,$7,$8,CURRENT_TIMESTAMP,$9) `, [order_max, order_number, order_date, customer_id, status_id, type, makerid, user_id,remarks]);

          if (item_array && item_array.length > 0) {
            for (let i = 0; i < item_array.length; i++) {
              const item_size = item_array[i].start_size + '-' + item_array[i].end_size
              const Item_list = await client.query(`INSERT INTO "tbl_order_taking_items"("order_no","item_code","design_code","item_size","color_id","qty","size_id","user_id","status_code","old_qty","created_date") values ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP) `, [order_number, item_array[i].item_code, item_array[i].design_id, item_size, item_array[i].color_id, item_array[i].qty, item_array[i].size_id, user_id, 1, item_array[i].qty]);
              let normal_code = Item_list && Item_list.rowCount ? Item_list.rowCount : 0;
              console.log(normal_code)

              const Stock_list = await client.query(`INSERT INTO "tbl_stock_transaction"("stock_date","size_id","trans_no","inward","outward","user_id","created_date") values ($1, $2, $3, $4,$5,$6,CURRENT_TIMESTAMP) `, [order_date, item_array[i].size_id, order_number, 0, item_array[i].qty, user_id]);
              let stock_code = Stock_list && Stock_list.rowCount ? Stock_list.rowCount : 0;
              console.log(stock_code)

            }
          }

          if (client) {
            client.end();
          }
          let create_code = order_taking_result && order_taking_result.rowCount ? order_taking_result.rowCount : 0;
          if (create_code == 1) {
            return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1 };
          }
          else { return '' }
        }
        else {
          var makerid = await commonService.insertLogs(user_id, "Update Order Taking");
          const count = await client.query(`select count(*) as count FROM tbl_order_taking where lower(order_no) = lower($1)`, [order_id])
          var count_Check = count && count.rows[0].count
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {

            const update_result = await client.query(`UPDATE "tbl_order_taking" set ref_no=$1,order_date=$2,customer_code=$3,status_code=$4,maker_id = $5,"user_id"= $6,updated_date=CURRENT_TIMESTAMP,remarks=$8 where order_no = $7 `, [ref_no, order_date, customer_id, status_id, makerid, user_id, order_id,remarks]);

            const delete_result = await client.query(`DELETE FROM tbl_order_taking_items where lower(order_no) = lower($1)`, [order_id])
            var deleteresult = delete_result && delete_result.rowCount;
            const delete_stock =  await client.query(`DELETE FROM tbl_stock_transaction where lower(trans_no) = lower($1) and user_id = $2`, [order_id, user_id])
            var deletestock = delete_stock && delete_stock.rowCount;
            if (item_array && item_array.length > 0) {
              for (let i = 0; i < item_array.length; i++) {
                var item_size = ''
                if (item_array[i].start_size && item_array[i].end_size) {
                  item_size = item_array[i].start_size + '-' + item_array[i].end_size
                } else {
                  item_size = item_array[i].item_size
                }
                if(deleteresult > 0) {
                const Item_list = await client.query(`INSERT INTO "tbl_order_taking_items"("order_no","item_code","design_code","item_size","color_id","qty","size_id","user_id","status_code","old_qty","created_date") values ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP) `, [order_id, item_array[i].item_code, item_array[i].design_id, item_size, item_array[i].color_id, item_array[i].qty, item_array[i].size_id, user_id, 1, item_array[i].qty]);
                let normal_code = Item_list && Item_list.rowCount ? Item_list.rowCount : 0;
                console.log(normal_code)
                }
                if(deletestock > 0){
                const Stock_list = await client.query(`INSERT INTO "tbl_stock_transaction"("stock_date","size_id","trans_no","inward","outward","user_id","created_date") values ($1, $2, $3, $4,$5,$6,CURRENT_TIMESTAMP) `, [order_date, item_array[i].size_id, order_id, 0, item_array[i].qty, user_id]);
                let stock_code = Stock_list && Stock_list.rowCount ? Stock_list.rowCount : 0;
                console.log(stock_code)
                }

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



//create Order Taking List jwt 
module.exports.orderTakingListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Order Taking LIST
module.exports.orderTakingList = async (req) => {
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
      const { from_date, to_date } = decoded.data;
      if (decoded) {
        if (from_date && to_date) {
          datediff = `to_char(a.order_date,'YYYY-MM-DD') :: date BETWEEN `
            .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
        }
        const order_Result = await client.query(`select a.ref_no,a.order_no,b.customer_code,b.customer_name,b.city,b.contact_person,b.mobile_no,b.gstin_no,b.alternative_mobile_no,(select coalesce(sum(qty),0) from tbl_order_taking_items where order_no= a.order_no) as totalset,a.order_date as order_date,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate,a.type, (SELECT count(dispatch_no) FROM tbl_dispatch_details where order_no = a.order_no and status_flag = 1) as dispatch_count from tbl_order_taking as a inner join tbl_customer as b on a.customer_code = b.customer_code where a.status_code = 1 and  ` + datediff + ` order by a.created_date desc`);

        let Lists = order_Result && order_Result.rows ? order_Result.rows : [];

        if (client) {
          client.end();
        }
        responseData = { "OrderTakinglist": Lists }
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

//create Order Taking List jwt 
module.exports.orderToWhatsappListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Order Taking LIST
module.exports.orderToWhatsappList = async (req) => {
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
      const { date, ordertype } = decoded.data;
      if (decoded) {
        let order_type = '1=1'
        if (date) {
          datediff = `to_char(a.order_date,'YYYY-MM-DD') :: date = to_date('` + date + `','YYYY-MM-DD')`;
        }
        if (ordertype && ordertype != 'All'){
          order_type = ' a.type =' + '\'' + ordertype + '\''          
        }
        const order_Result = await client.query(`select a.ref_no,a.order_no,b.customer_code,b.customer_name,b.city,b.contact_person,b.mobile_no,b.gstin_no,b.alternative_mobile_no,(select coalesce(sum(qty),0) from tbl_order_taking_items where order_no= a.order_no) as totalset,a.order_date as order_date,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate,'yes' as enableagent,'yes' as enablecompany,'yes' as enableAll,CASE WHEN a.user_id is not null then a.user_id else a.device_code end as user_id,a.type from tbl_order_taking as a inner join tbl_customer as b on a.customer_code = b.customer_code where coalesce(a.pdf_sent_status,'')!='sent' and a.status_code = 1 and `+order_type+` and ` + datediff + ` order by a.created_date desc`);

        let Lists = order_Result && order_Result.rows ? order_Result.rows : [];

        if (client) {
          client.end();
        }
        responseData = { "OrderTakinglist": Lists }
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
//Delete Order Taking jwt 
module.exports.deleteOrderTakingjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}

//Delete Order Taking service
module.exports.deleteOrderTaking = async (req) => {
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
      const { user_id, order_no } = decoded.data;
      if (decoded) {
        const taking_Count = await client.query(`select count(*) as count FROM tbl_order_taking where lower(order_no) = lower($1)`, [order_no])
        var count_Check = taking_Count && taking_Count.rows[0].count;
        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
          var maker_id = await commonService.insertLogs(user_id, "Delete Order Taking");
          await client.query(`DELETE FROM tbl_stock_transaction where lower(trans_no) = lower($1)`, [order_no])
          await client.query(`Update tbl_order_taking_items set "status_code"=$1 ,"maker_id" = $2 where lower(order_no) = lower($3) `, [2, maker_id, order_no]);
          const delete_result = await client.query(`Update tbl_order_taking set "status_code"=$1 ,"maker_id" = $2 where lower(order_no) = lower($3) `, [2, maker_id, order_no]);

          if (client) {
            client.end();
          }
          let deletecode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
          if (deletecode == 1) {
            responseData = { "message": constants.userMessage.USER_DELETED, "statusFlag": 2 }
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

//Bind Company List Name
module.exports.customerListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.customerList = async (req) => {
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
        const { customer_id } = decoded.data
        const CustomerList = await client.query(`select distinct a.customer_code as value, a.customer_name as label,a.customer_name,a.contact_person,a.mobile_no,a.alternative_mobile_no,a.street,a.area,a.city,a.pincode,a.state,a.gstin_no from tbl_customer as a where Lower(a.customer_code) = Lower($1)`, [customer_id])
        if (client) { client.end(); }
        let List_Array = CustomerList && CustomerList.rows ? CustomerList.rows : [];
        var response = {}
        response = { "CustomerList": List_Array }
        if (response) {
          return response
        }
        else {
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

//Edit Order Taking List jwt 
module.exports.editOrderTakingjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//Edit Order Taking List
module.exports.editOrderTaking = async (req) => {
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
      const { order_no } = decoded.data;
      if (decoded) {
        const order_Result = await client.query(`select a.ref_no,a.order_no,a.order_date as order_date,a.type,a.customer_code,b.customer_name,coalesce(a.remarks,'') as remarks 
              from tbl_order_taking as a inner join tbl_customer as b on a.customer_code = b.customer_code where lower (a.order_no) = lower ($1) ` , [order_no]);

        let Lists = order_Result && order_Result.rows ? order_Result.rows : [];
        let result = [];

        if (Lists.length > 0) {

          for (let i = 0; i < Lists.length; i++) {
            const order_item_Result = await client.query(`select a.order_no,a.item_code,a.design_code as design_id,a.color_id,a.item_size,a.qty,b.item_name,c.color_name,a.size_id,e.start_size,e.size_id,e.end_size,e.total_set,e.qr_code,a.old_qty,coalesce((SELECT sum(dispatch_set) as dispatch_set 
            FROM tbl_dispatch_details where order_no = a.order_no and size_id =a.size_id  and status_flag = 1),0) as dispatch_set from tbl_order_taking_items as a inner join tbl_def_item as b on a.item_code = b.item_id left join tbl_color as c on a.color_id = c.color_id inner join tbl_item_sizes as e on a.size_id = e.size_id where lower (a.order_no)  = lower($1)`, [Lists[i].order_no]);
            let Order_ListArray = order_item_Result && order_item_Result.rows ? order_item_Result.rows : [];
            let obj = Lists[i]
            obj['Order_ItemList'] = Order_ListArray
            result.push(obj)
          }
        }
        if (client) {
          client.end();
        }
        if (Lists && Lists.length > 0) {
          return response = { "EditOrderList": result }
        }
        else {
          return response = { "EditOrderList": [] }
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

//Print Order Slip Jwt
module.exports.printOrderSlipjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

//Print Order Slip
module.exports.printOrderSlip = async (req) => {
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
      const { order_no } = decoded.data;

      if (decoded) {

        const Order_Slip_Result = await client.query(`select a.order_no,b.item_code,c.item_name,b.design_code,b.item_size,b.qty,b.color_id,b.size_id,d.color_name,e.total_set,a.order_date,remarks from tbl_order_taking  as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_def_item as c on b.item_code = c.item_id left join tbl_color as d on b.color_id = d.color_id inner join tbl_item_sizes as e on b.size_id = e.size_id
        where lower(a.order_no) = lower('`+ order_no + `') order by b.item_code asc`);

        const Order_Item_List = await client.query(`SELECT order_no,item_code,item_name,SUM(qty) as qty,
        sum(total_piece) as total_piece from (select a.order_no,b.item_code,c.item_name,
        b.qty,e.total_set,(b.qty::INTEGER*e.total_set::INTEGER) as total_piece
        from tbl_order_taking  as a inner join tbl_order_taking_items as b 
        on a.order_no = b.order_no inner join tbl_def_item as c on b.item_code = c.item_id 
        left join tbl_color as d on b.color_id = d.color_id inner join tbl_item_sizes as 
        e on b.size_id = e.size_id where lower(a.order_no) = lower('`+ order_no + `') order by b.item_code asc) as dev group by order_no,item_code,item_name order by item_code asc`);

        const Customer_Result = await client.query(`select a.order_no,b.customer_code,b.street,b.area,b.transport_name,b.gstin_no,b.transport_contact_no,b.transport_contact_person,b.transport_location,b.customer_name,b.city,b.contact_person,b.mobile_no,b.gstin_no,b.alternative_mobile_no,b.agent_code,c.agent_name  from tbl_order_taking as a inner join tbl_customer as b on a.customer_code = b.customer_code inner join tbl_agent as c on b.agent_code = c.agent_code where lower(a.order_no) = lower('` + order_no + `')`);

        const item_count = await client.query(`select count(*) as total_count,item_code from tbl_order_taking_items where lower(order_no) = lower('` + order_no + `')  group by item_code`)

        const company_Result = await client.query(`SELECT * from tbl_print_setting`);

        if (client) {
          client.end();
        }

        var itemcount = item_count && item_count.rows ? item_count.rows : [];
        let Customer_array = Customer_Result && Customer_Result.rows ? Customer_Result.rows : [];
        let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];
        let Lists = Order_Slip_Result && Order_Slip_Result.rows ? Order_Slip_Result.rows : [];
        let ItemLists = Order_Item_List && Order_Item_List.rows ? Order_Item_List.rows : [];

        responseData = {
          "OrderSlip": Lists, "CustomerArray": Customer_array, "CompanyArray": Company_Array, "ItemCount": itemcount,"ItemLists":ItemLists
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

//Bind Design Name
module.exports.ChangeAutoDesignNamejwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.ChangeAutoDesignName = async (req) => {
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
        const { searchvalue } = decoded.data
        if (searchvalue !== "") {
          // const DesignList = await client.query(`select distinct b.size_id as value, b.qr_code as label,coalesce(((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id) +coalesce(b.current_stock,0))
          // - (select coalesce(sum(coalesce(dispatch_set,0)),0) from tbl_dispatch_details where status_flag = 1 and  size_id=b.size_id ),0) as current_stock , (select coalesce(sum(a.qty),0) as qty from tbl_order_taking_items as a inner join tbl_order_taking as d on a.order_no = d.order_no where d.order_date=CURRENT_DATE and size_id = b.size_id 
          // and d.status_code = 1) as order_qty from tbl_item_sizes  as b where  Lower(b.qr_code) like '%'||$1||'%' limit 50 `, [searchvalue])
          const DesignList = await client.query(`select distinct b.size_id as value, b.qr_code as label,0 as current_stock , 0 as order_qty from tbl_item_sizes  as b where  Lower(b.qr_code) like '%'||$1||'%'`, [searchvalue])
          if (client) { client.end(); }
          let List_Array = DesignList && DesignList.rows ? DesignList.rows : [];
          var response = {}
          response = { "DesignList": List_Array }
          if (response) {
            return response
          }
          else {
            return response
          }
        }
        else {
          response = { "DesignList": [] }
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


//Check Qty
module.exports.onChangeQtyjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.onChangeQty = async (req) => {
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
        const { qty, size_id } = decoded.data

        const total_qty = await client.query(`select coalesce(sum(current_stock),0) as stock  from tbl_item_sizes where size_id = $1 `, [size_id])
        var order_qty = total_qty && total_qty.rows[0].stock;
        if (order_qty > 0) {
          const CheckQty = await client.query(`select count(1) from (select coalesce(current_stock,0) + 
          (select coalesce(sum(inward),0) - coalesce(sum(outward),0) from tbl_stock_transaction where size_id = $1 ) 
          as current_stock from tbl_item_sizes where size_id = $1) as dev where current_stock >= $2`, [size_id, qty])

          if (client) { client.end(); }

          let Stock_count = CheckQty && CheckQty.rows[0].count;
          var response = {}
          response = { "StockCount": Stock_count }
          if (response) {
            return response
          }
          else {
            return response
          }
        } else {
          var response = {}
          response = { "StockCount": 1 }
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


//Bind Item Name
module.exports.ChangeAutoItemNamejwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.ChangeAutoItemName = async (req) => {
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
        const { itemname } = decoded.data

        const Size_Result = await client.query(`select a.trans_no,b.start_size,b.size_id,b.end_size,b.total_set,b.qr_code,b.color_id,'' as qty,a.item_code,c.item_name,d.color_name,a.design_id from tbl_item_management as a inner join tbl_item_sizes as b on a.trans_no = b.trans_no inner join tbl_def_item as c on a.item_code = c.item_id left join tbl_color as d on b.color_id = d.color_id where lower(b.qr_code) = lower($1)`, [itemname]);
        let sizeList = Size_Result && Size_Result.rows ? Size_Result.rows[0] : '';
        if (client) {
          client.end();

          if (sizeList && Object.keys(sizeList).length > 0) {
            return response = { "ScanSizeList": sizeList }
          }
          else {
            return response = { "ScanSizeList": [] }
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
//Bind Item Name
module.exports.sendOrderToWhatsappJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.sendOrderToWhatsapp = async (req) => {
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
        const { order_details } = decoded.data

        if (order_details && order_details.length > 0) {
        
          const company_Result = await client.query(`SELECT print_id, company_name, addressline1, addressline2, area, city, gstin, mobile_number, telephone_number, status_id, footer_name from tbl_print_setting`);
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows?.[0] || {} : {};
          for (let k = 0; k < order_details.length; k++){  
            const exeUserQuery = await client.query(`select count(1) as total from tbl_order_taking  where ref_no=$1 and order_no =$2 and (device_code=$3 or user_id=$3)and coalesce(pdf_sent_status,'')!='sent'`, [order_details[k].ref_no,order_details[k].order_no,order_details[k].user_id]);
            let totalcount = exeUserQuery?.rows?.[0].total; 
            if (totalcount > 0) {
              const exeQuery1 = await client.query(
                `select order_no,to_char(order_date, 'dd-MM-YYYY') as orderdate,a.customer_code,UPPER(b.customer_name) as customer_name,b.contact_person,b.mobile_no,coalesce(b.alternative_mobile_no,'') as alternative_mobile_no,coalesce(b.street,'') as street,coalesce(b.area,'') as area,coalesce(b.city,'') as city,coalesce(b.pincode,'') as pincode,coalesce(b.email_id,'') as email_id,coalesce(b.gstin_no,'') as gstin_no,b.country,coalesce(b.transport_name,'') as transport_name,coalesce(b.transport_contact_no,'') as transport_contact_no,coalesce(b.transport_location,'') as transport_location,coalesce(b.transport_contact_person,'') as transport_contact_person,coalesce(b.agent_code,0) as agent_code, (select agent_name from tbl_agent where agent_code=b.agent_code) as agent_name from tbl_order_taking  as a inner join tbl_customer as b on a.customer_code=b.customer_code where ref_no=$1 and order_no =$2 and (a.device_code=$3 or a.user_id=$3) `, [order_details[k].ref_no, order_details[k].order_no, order_details[k].user_id] 
              );
              let order_customer_details = exeQuery1?.rows[0] || {};
              let order_id = exeQuery1?.rows[0]?.order_no || '';

              const exeQuery2= await client.query(
                `select ROW_NUMBER () OVER (ORDER BY a.order_no) as sno,a.order_no,b.item_code,c.item_name,b.design_code,b.item_size,b.qty,b.color_id,b.size_id,d.color_name,e.total_set,a.order_date,e.total_set::INTEGER*b.qty as total_pcs,remarks from tbl_order_taking  as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_def_item as c on b.item_code = c.item_id left join tbl_color as d on b.color_id = d.color_id inner join tbl_item_sizes as e on b.size_id = e.size_id where a.ref_no=$1 and a.order_no =$2 and (a.device_code=$3 or a.user_id=$3) order by b.item_code asc`, [order_details[k].ref_no, order_details[k].order_no, order_details[k].user_id] 
              );
              let order_item_details = exeQuery2?.rows || []; 
              const exeQuery3= await client.query(
                `select coalesce(mobile_no,'') as mobile_no from tbl_user where user_id=$1`, [order_details[k].user_id] 
              );
              let user_mobileno = exeQuery3?.rows ? exeQuery3?.rows[0].mobile_no: '' || ''; 
              const Order_Item_List = await client.query(`SELECT order_no,item_code,item_name,SUM(qty) as qty,
              sum(total_piece) as total_piece from (select a.order_no,b.item_code,c.item_name,
              b.qty,e.total_set,(b.qty::INTEGER*e.total_set::INTEGER) as total_piece
              from tbl_order_taking  as a inner join tbl_order_taking_items as b 
              on a.order_no = b.order_no inner join tbl_def_item as c on b.item_code = c.item_id 
              left join tbl_color as d on b.color_id = d.color_id inner join tbl_item_sizes as 
              e on b.size_id = e.size_id where a.ref_no=$1 and a.order_no =$2 and (a.device_code=$3 or a.user_id=$3) order by b.item_code asc) as dev group by order_no,item_code,item_name order by item_code asc`, [order_details[k].ref_no, order_details[k].order_no, order_details[k].user_id]);
              let ItemLists = Order_Item_List && Order_Item_List.rows ? Order_Item_List.rows : [];
              let responseData = {
                "OrderSlip": order_item_details, "CustomerArray": order_customer_details, "CompanyArray": Company_Array ,"order_id":order_id, "user_mobile_no":user_mobileno,"ItemLists":ItemLists
              } 
              console.log("Start")
              await generateOrderPDF(responseData,req, order_details[k]);
            }
          }
         
        }
        if (client) {
          client.end();
            // return response = { "Message": "" }

            return response = { "message": "Sent successfully", "statusFlag": 1 }; 

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
//Upload PDF File in S3 Bucket
module.exports.uploadFile = async (fileName, req) => { 
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    var aws = require('aws-sdk');
    var s3path = '';
    var foldername = fileName.indexOf('./') >= 0 ? fileName.split('./')[1] : ''
    const exeQuery = await client.query(`SELECT  bucketname, secretkey, accesskey
  from tbl_credentials  where credential_type='aws'`);
    let bucket_name = exeQuery?.rows?.[0]?.bucketname || '';
    let access_key = exeQuery?.rows?.[0]?.accesskey || '';
    let secret_key = exeQuery?.rows?.[0]?.secretkey || '';
  
    if (bucket_name) {
      // Read content from the file
      const fileContent = fs.readFileSync(fileName);
      // Setting up S3 upload parameters
      const params = {
        Bucket: bucket_name,
        Key: foldername, // File name you want to save as in S3
        Body: fileContent,
        isBase64Encoded: true,
        ContentType: 'application/pdf;charset=utf-8',
      };

      //S3 Access and Secret Key
      const s3pdf = new aws.S3({
        accessKeyId: access_key,
        secretAccessKey: secret_key
      });
      const uploads3 = await s3pdf.upload(params, function (err, data) {
        if (err) {
          console.log(err, 'err')
          throw err;
        }

        s3path = data.Location;

      }).promise();
      if (client) {
        client.end();
      }
      return uploads3.Location;
    } else {
      if (client) {
        client.end();
      }
      return '';
    }
  } catch (error) {  
    if (client) {
      client.end();
    } 
    throw new Error(error);
  }
};
module.exports.getTemplateHtml = async () => {
  try {
    const invoicePath = path.resolve('./orderpdf.html');
    return await readFile(invoicePath, 'utf8');
  } catch (err) { 
    console.log(err, 'err')
    return Promise.reject("Could not load html template");
  }
}
const generateOrderPDF = async (responseData, req, List) => {  
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  try {  
    if (responseData.order_id) {
      let addr = '';
      const space1 = ",";
      if (responseData?.CustomerArray.street && responseData?.CustomerArray.area && responseData?.CustomerArray.city) {
        addr = responseData?.CustomerArray.street + space1 + responseData?.CustomerArray.area + space1 + responseData?.CustomerArray.city
      } else if (responseData?.CustomerArray.street && responseData?.CustomerArray.area) {
        addr = responseData?.CustomerArray.street + space1 + responseData?.CustomerArray.area
      } else if (responseData?.CustomerArray.street && responseData?.CustomerArray.city) {
        addr = responseData?.CustomerArray.street + space1 + responseData?.CustomerArray.city
      } else if (responseData?.CustomerArray.area && responseData?.CustomerArray.city) {
        addr = responseData?.CustomerArray.area + space1 + responseData?.CustomerArray.city
      } else if (responseData?.CustomerArray.street) {
        addr = responseData?.CustomerArray.street
      } else if (responseData?.CustomerArray.area) {
        addr = responseData?.CustomerArray.area
      } else if (responseData?.CustomerArray.city) {
        addr = responseData?.CustomerArray.city
      }
      responseData.CustomerArray['address'] = addr;

      let total_pcs_value = 0, short_frock_set = 0, short_frock_pcs = 0, long_frock_set = 0, long_frock_pcs = 0, total_set_value = 0
      let row = responseData.OrderSlip || []
      let remark = ''
      for (let i = 0; i < row.length; i++) {
        remark = row[0].remarks
        total_set_value += row[i].qty
        let total_pcs = 0
        total_pcs = row[i].total_set * row[i].qty
        total_pcs_value += total_pcs
        if (row[i].item_code === 1) {
          short_frock_set += row[i].qty
          short_frock_pcs += row[i].total_set * row[i].qty
        }
        if (row[i].item_code === 2) {
          long_frock_set += row[i].qty
          long_frock_pcs += row[i].total_set * row[i].qty
        }
      }
      let checkshortfrock = '' , checklongfrock = ''
      if (short_frock_set > 0 ) {
        checkshortfrock = 'true';
      }
      if (short_frock_set == 0) {
        checklongfrock = 'true';
      }
      const ImagePath = path.resolve('./pretty_girl_svg.svg');
      responseData = {
        ...responseData, total_pcs_value: total_pcs_value, short_frock_set: short_frock_set, short_frock_pcs: short_frock_pcs, long_frock_set: long_frock_set, long_frock_pcs: long_frock_pcs, total_set_value: total_set_value, checkshortfrock:checkshortfrock, checklongfrock: checklongfrock, remark : remark, ImagePath: ImagePath
      }
      
      // launch a new chrome instance 
      const browser = await puppeteer.launch({
        headless: true, args: ['--font-render-hinting=none'],
      });
    
      // create a new page
      const page = await browser.newPage()
      var res = await this.getTemplateHtml();
      const template = hb.compile(res, { strict: true });
      // we have compile our code with handlebars
      const resultTemplate = template(responseData);
      // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
      const html = resultTemplate;
      // await page.setViewport({ width: 0, height: 1000}); 
      await page.setContent(html);
      //Generate PDF
      await page.pdf({
        format: 'A4',
        path: './PDFFiles/Order_Form_' + responseData.order_id + '.pdf',
        displayHeaderFooter: true,
        printBackground: true,
        preferCSSPageSize: true,
        footerTemplate: `<div style="width:100%;padding: 0 20px;"></div>`,
      });
      // close the browser
      await browser.close();
      //Get PDF and push into bucket
      let pdfLink = './PDFFiles/Order_Form_' + responseData.order_id + '.pdf';
      let pdf_url = await this.uploadFile(pdfLink, req);
      if (pdf_url && responseData?.CustomerArray.mobile_no) {
        setTimeout(() => {
          if (fs.existsSync(pdfLink)) {
            fs.unlink(pdfLink, function (err) {
              if (err) {
                throw err
              } else {
                console.log("Successfully deleted the eRxMedicine file.")
              }
            })
          }
        }, 20000);
        let mobileno = responseData?.CustomerArray.mobile_no;
        const axios = require("axios");
        await client.connect();
        const exeQuery_aws = await client.query(`SELECT whatsappurl from tbl_credentials  where credential_type='whatsapp'`);
        let get_whatsappurl = exeQuery_aws?.rows?.[0]?.whatsappurl || '';
        let get_whatsappdata = get_whatsappurl ;
        get_whatsappurl = get_whatsappurl.replace("mobile_no", '91'+mobileno);
        let whatsappurl = get_whatsappurl.replace("pdf_url", pdf_url);
        let usermobile_no = responseData?.user_mobile_no || ''
        if(List.enablecompany == "yes"){  
          var configURL = {
            method: 'get',
            url: whatsappurl,
            headers: {
              'Content-Type': 'application/json'
            },
          };   
          const exeQuery_update = await client.query(`UPDATE tbl_order_taking set whatsappurl = $1 where ref_no=$2 and order_no =$3 and (device_code=$4 or user_id=$4) and coalesce(pdf_sent_status,'')!='sent'`, [whatsappurl,List.ref_no,List.order_no,List.user_id]);
          if(exeQuery_update.rowCount > 0){
            await axios(configURL).then(async function (response) {
                        //  console.log(response,'response SMS SUCCDD')   
                        await client.query(`UPDATE tbl_order_taking set pdf_sent_status = 'sent' where ref_no=$1 and order_no =$2 and (device_code=$3 or user_id=$3) and coalesce(pdf_sent_status,'')!='sent'`, [List.ref_no,List.order_no,List.user_id]);
                        if (client) {
                          client.end();
                        } 
              }).catch(function (error) {
                console.log(error, "error")
              });
          }
        }    
        if(List.enableagent == "yes") {
          if(usermobile_no && usermobile_no.length == 10) {
            get_whatsappdata = get_whatsappdata.replace("mobile_no", '91'+usermobile_no);
            get_whatsappdata = get_whatsappdata.replace("pdf_url", pdf_url);
            var configURL = {
              method: 'get',
              url: get_whatsappdata,
              headers: {
                'Content-Type': 'application/json'
              },
            };        
            await axios(configURL).then(function (response) {
                console.log(usermobile_no,'response SMS SUCCDD')   
            }).catch(function (error) {
              console.log(error, "error")
            });
          }
        }
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {  
    if (client) {
      client.end();
    } 
    throw new Error(error);
  }
} 