/****************************
 File    : appService.js
 Author  : Suriya
 Date    : 06.01.2023
 Purpose : App Service 
 * ********************** */
const connectionString = require("../../database/connection");
const commonService = require("../../service/commonService");
const constants = require("../../constants");
const { Client } = require("pg");
//Require dependecies for pdf generation
const fs = require('fs') // file read and write permission
const path = require('path') // for get the html path
const utils = require('util') // for file checking
const puppeteer = require('puppeteer') //using headless mode
const hb = require('handlebars') //Compiing the template with handlebars
const https = require('https') //https 

const readFile = utils.promisify(fs.readFile)
//getUserMaster service
module.exports.getUserMaster = async (req) => {
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
      const { device_id } = decoded.data;
      var response = {};
      if (device_id) {
        const exeQuery = await client.query(
          "SELECT autonum, user_id, user_name, password, status_id, maker_id, created_date, updated_date, user_code, userrole_id, branch_id, devices_id, pin_number  from tbl_user  where lower(devices_id) = lower($1) ",
          [device_id]
        );
        if (client) {
          client.end();
        }
        if (exeQuery && exeQuery.rows.length > 0) {
          response = { userList: exeQuery.rows };
        } else {
          response = { userList: [] };
        }
        return response;
      } else {
        if (client) {
          client.end();
        }
        return response;
      }
    } else {
      if (client) {
        client.end();
      }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};

module.exports.syncDetails = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    const { device_id, file_name } = req;
    var response = {};
    if (device_id) {
      const exeQueryCount = await client.query(
        `select count(*) as synccount from tbl_sync_details where device_id=$1`,
        [device_id]
      );

      let counts = exeQueryCount?.rows?.[0].synccount;
      let totaldaycount = parseInt(counts);
      if (totaldaycount > 1000) {
        await client.query("DELETE FROM tbl_sync_details where device_id=$1 ", [
          device_id,
        ]);
      }
      const exeQuery = await client.query(
        "INSERT INTO tbl_sync_details (device_id, syncfile, syncdate) values ($1,$2,CURRENT_TIMESTAMP) ",
        [device_id, file_name]
      );
      if (client) {
        client.end();
      }
      if (exeQuery && exeQuery.rowCount > 0) {
        response = { Success: "1" };
      } else {
        response = { Success: "0" };
      }
      return response;
    } else {
      if (client) {
        client.end();
      }
      return response;
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};


//Insert Customer
module.exports.insertCustomer = async (req) => {
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
      const { device_id } = decoded.data;
      let { jsonCustomer } = req; 
      var response = [];
      if (device_id) {
        let Lists = jsonCustomer.JSonObject;
        if (Lists && Lists.length > 0) {
          for (var i = 0; i < Lists.length; i++) {
            const exeUserQuery = await client.query(`select count(customer_code) as total from tbl_customer  where device_code=$1 and type =$2 and customer_code=$3`, [Lists[i].device_code,Lists[i].type,Lists[i].customer_code]);
            let totalcount = exeUserQuery?.rows?.[0].total;
            if(Lists[i].updated_date == "null" || Lists[i].updated_date == "" || Lists[i].updated_date == undefined){
              Lists[i].updated_date = null
            }
            if (Number(totalcount) == 0) {
                //Insert User Log
              var makerid = await commonService.insertLogs(Lists[i].device_code, "Insert Customer Via Mobile - " + Lists[i].device_code);
              
              const exeUserQuerys = await client.query(`INSERT INTO tbl_customer(customer_name, contact_person, mobile_no, alternative_mobile_no, door_no, street, area, city, state, country, pincode, email_id, gstin_no, status_code, created_date, updated_date, sync_date, customer_code, type, maxrefno, device_code, maker_id,transport_name,transport_contact_no,transport_location,agent_code,transport_contact_person) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, now(), $17, $18, $19, $20,$21,$22,$23,$24,$25,$26) RETURNING customer_code`, [Lists[i].customer_name, Lists[i].contact_person, Lists[i].mobile_no, Lists[i].alternative_mobile_no, Lists[i].door_no, Lists[i].street, Lists[i].area, Lists[i].city, Lists[i].state, Lists[i].country, Lists[i].pincode, Lists[i].email_id, Lists[i].gstin_no, Lists[i].status_code, Lists[i].created_date, Lists[i].updated_date, Lists[i].customer_code, Lists[i].type, Lists[i].maxrefno, Lists[i].device_code, makerid,Lists[i].transport_name,Lists[i].transport_contact_no,Lists[i].transport_location,Lists[i].agent_code,Lists[i].transport_contact_person]);
              response.push(exeUserQuerys.rows[0].customer_code);
            } else {
                //Insert User Log
                var makerid = await commonService.insertLogs(Lists[i].device_code, "Update Customer Via Mobile - " + Lists[i].device_code);
                const exeUserQuerys = await client.query(`UPDATE tbl_customer set customer_name=$1, contact_person=$2, mobile_no=$3, alternative_mobile_no=$4, door_no=$5, street=$6, area=$7, city=$8, state=$9, country=$10, pincode=$11, email_id=$12, gstin_no=$13, status_code=$14, created_date=$15, updated_date=$16, sync_date=now() ,maxrefno=$17, maker_id=$18,transport_name=$22,transport_contact_no=$23,transport_location=$24,agent_code=$25,transport_contact_person=$26 where  customer_code=$19 and type=$20 and  device_code=$21  RETURNING customer_code`, [Lists[i].customer_name, Lists[i].contact_person, Lists[i].mobile_no, Lists[i].alternative_mobile_no, Lists[i].door_no, Lists[i].street, Lists[i].area, Lists[i].city, Lists[i].state, Lists[i].country, Lists[i].pincode, Lists[i].email_id, Lists[i].gstin_no, Lists[i].status_code, Lists[i].created_date, Lists[i].updated_date,  Lists[i].maxrefno,makerid, Lists[i].customer_code, Lists[i].type,Lists[i].device_code,Lists[i].transport_name,Lists[i].transport_contact_no,Lists[i].transport_location,Lists[i].agent_code,Lists[i].transport_contact_person]);
                response.push(exeUserQuerys.rows[0].customer_code);
            }              
          }
        }
        if (client) {
          client.end();
        } 
        return response;
      } else {
        if (client) {
          client.end();
        }
        return response;
      }
    } else {
      if (client) {
        client.end();
      }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};


//Deelte Customer
module.exports.deleteCustomer = async (req) => {
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
      const { device_id } = decoded.data;
      let { jsonCustomer } = req; 
      var response = [];
      if (device_id) {
        let Lists = jsonCustomer.JSonObject;
        if (Lists && Lists.length > 0) {
          for (var i = 0; i < Lists.length; i++) {
            const exeUserQuery = await client.query(`select count(customer_code) as total from tbl_customer  where device_code=$1 and type =$2 and customer_code=$3`, [Lists[i].device_code,Lists[i].type,Lists[i].customer_code]);
            let totalcount = exeUserQuery?.rows?.[0].total;
            if (Number(totalcount) > 0) {
                //Insert User Log
              var makerid = await commonService.insertLogs(Lists[i].device_code, "Delete Customer Via Mobile - " + Lists[i].device_code);
              const exeUserQuerys = await client.query(`Delete from tbl_customer where device_code=$1 and type =$2 and customer_code=$3 `, [Lists[i].device_code,Lists[i].type,Lists[i].customer_code]);
              response.push(exeUserQuerys.rows[0].customer_code);
            }             
          }
        }
        if (client) {
          client.end();
        } 
        return response;
      } else {
        if (client) {
          client.end();
        }
        return response;
      }
    } else {
      if (client) {
        client.end();
      }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};
//Get User Master
module.exports.getMaster = async (req) => {
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
      const { device_id } = decoded.data;
      var response = {};
      if (device_id) {
        const exeQuery = await client.query(
          "SELECT state_id, state_name, status_id  from tbl_def_state order by state_id "
        );
        const exeQuery1 = await client.query(
          "SELECT  country_id, country  from tbl_def_country order by country_id "
        );

        //Get Agent Master List
        const exeQuery_agent_sync = await client.query("SELECT count(1) as countval  from tbl_sync_details where device_id=$1 and syncfile='agentMaster'  ",[device_id]);
        var exit_check = exeQuery_agent_sync && exeQuery_agent_sync.rows[0].countval ? exeQuery_agent_sync && exeQuery_agent_sync.rows[0].countval : 0;
        let exeQuery_agent;
        if (exit_check > 0) {
          exeQuery_agent = await client.query(
            "select * from (SELECT 'Insert' as process , autonum, agent_code, agent_name, address, city, state_code, pincode, mobile_no, phone_no, email_id, default_column,created_date, updated_date  from tbl_agent where (select syncdate from tbl_sync_details where device_id=$1 and syncfile='agentMaster' order by syncdate desc limit 1 ) <= created_date union all SELECT 'Update' as process , autonum, agent_code, agent_name, address, city, state_code, pincode, mobile_no, phone_no, email_id, default_column,created_date, updated_date   from tbl_agent where (select syncdate from tbl_sync_details where device_id=$1 and syncfile='agentMaster' order by syncdate desc limit 1 ) <= updated_date) as dev ",[device_id]
          );
        } else {
          exeQuery_agent = await client.query(
            "SELECT  'Insert' as process ,autonum, agent_code, agent_name, address, city, state_code, pincode, mobile_no, phone_no, email_id, default_column,created_date, updated_date  from tbl_agent order by created_date "
          );
        } 

        //Get Item Managment List
        const exeQuery_sync = await client.query("SELECT count(1) as countval  from tbl_sync_details where device_id=$1 and syncfile='colorMaster'  ",[device_id]);
        var exit_check = exeQuery_sync && exeQuery_sync.rows[0].countval ? exeQuery_sync && exeQuery_sync.rows[0].countval : 0;
        let exeQuery2;
        if (exit_check > 0) {
          exeQuery2 = await client.query(
            "select * from (SELECT 'Insert' as process , autonum, color_id, color_name, status_id, maker_id, created_date, updated_date, user_id, color_picker from tbl_color where (select syncdate from tbl_sync_details where device_id=$1 and syncfile='colorMaster' order by syncdate desc limit 1 ) <= created_date union all SELECT 'Update' as process , autonum, color_id, color_name, status_id, maker_id, created_date, updated_date, user_id, color_picker  from tbl_color where (select syncdate from tbl_sync_details where device_id=$1 and syncfile='colorMaster' order by syncdate desc limit 1 ) <= updated_date) as dev ",[device_id]
          );
        } else {
          exeQuery2 = await client.query(
            "SELECT  'Insert' as process ,autonum, color_id, color_name, status_id, maker_id, created_date, updated_date, user_id, color_picker  from tbl_color order by created_date "
          );
        } 

        const exeQuery3 = await client.query(
          "select '1' as code, 'Order' as type, coalesce(max(coalesce(ref_no,0)),0)+1 as refno from tbl_order_taking  where device_code=(select user_id from tbl_user where status_id=1 and devices_id=$1 limit 1)",[device_id]
        );
       
        if (client) {
          client.end();
        }
         
        response = { stateList: exeQuery?.rows? exeQuery?.rows : [] , countryList: exeQuery1?.rows? exeQuery1?.rows : [],colorList:exeQuery2?.rows? exeQuery2?.rows : [],maxrefno: exeQuery3?.rows? exeQuery3?.rows : [],agentList: exeQuery_agent?.rows? exeQuery_agent?.rows : []};
        
        return response;
      } else {
        if (client) {
          client.end();
        }
        return response;
      }
    } else {
      if (client) {
        client.end();
      }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};

//Get Customer Master
module.exports.getCustomer = async (req) => {
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
      const { device_id } = decoded.data;
      var response = {};
      if (device_id) {
        const exeQuery_sync = await client.query("SELECT count(1) as countval  from tbl_sync_details where device_id=$1 and syncfile='customerMaster'  ",[device_id]);
        var exit_check = exeQuery_sync && exeQuery_sync.rows[0].countval ? exeQuery_sync && exeQuery_sync.rows[0].countval : 0;
        let exeQuery;
        if (exit_check > 0) {
          exeQuery = await client.query(
            "select * from (SELECT 'Insert' as process , autonum, customer_name, contact_person, mobile_no, alternative_mobile_no, door_no, street, area, city, state, country, pincode, email_id, gstin_no, status_code, created_date, updated_date, sync_date, customer_code, type, maxrefno, device_code, maker_id,transport_name,transport_contact_no,transport_location,agent_code,transport_contact_person  from tbl_customer where (select syncdate from tbl_sync_details where device_id=$1 and syncfile='customerMaster' order by syncdate desc limit 1 ) <= created_date union all SELECT 'Update' as process , autonum, customer_name, contact_person, mobile_no, alternative_mobile_no, door_no, street, area, city, state, country, pincode, email_id, gstin_no, status_code, created_date, updated_date, sync_date, customer_code, type, maxrefno, device_code, maker_id,transport_name,transport_contact_no,transport_location,agent_code,transport_contact_person  from tbl_customer where (select syncdate from tbl_sync_details where device_id=$1 and syncfile='customerMaster' order by syncdate desc limit 1 ) <= updated_date) as dev ",[device_id]
          );
        } else {
          exeQuery = await client.query(
            "SELECT  'Insert' as process ,autonum, customer_name, contact_person, mobile_no, alternative_mobile_no, door_no, street, area, city, state, country, pincode, email_id, gstin_no, status_code, created_date, updated_date, sync_date, customer_code, type, maxrefno, device_code, maker_id,transport_name,transport_contact_no,transport_location,agent_code,transport_contact_person  from tbl_customer order by created_date "
          );
        } 
      
        if (client) {
          client.end();
        }
         
        response = { customerList: exeQuery?.rows? exeQuery?.rows : []   };
        
        return response;
      } else {
        if (client) {
          client.end();
        }
        return response;
      }
    } else {
      if (client) {
        client.end();
      }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};


//Get Item and Item sizes 
module.exports.getItemManagement = async (req) => {
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
      const { device_id } = decoded.data;
      var response = {};
      if (device_id) {
         //Get Item Managment List
         const exeQuery_sync = await client.query("SELECT count(1) as countval  from tbl_sync_details where device_id=$1 and syncfile='itemManagement'  ",[device_id]);
         var exit_check = exeQuery_sync && exeQuery_sync.rows[0].countval ? exeQuery_sync && exeQuery_sync.rows[0].countval : 0;
         let exeQuery2;
         if (exit_check > 0) {
           exeQuery2 = await client.query(
             "select * from (SELECT 'Insert' as process , autonum, trans_no, item_code, design_id , created_date, updated_date, maker_id from tbl_item_management where (select syncdate from tbl_sync_details where device_id=$1 and syncfile='itemManagement' order by syncdate desc limit 1 ) <= created_date union all SELECT 'Update' as process , autonum, trans_no, item_code, design_id , created_date, updated_date, maker_id  from tbl_item_management where (select syncdate from tbl_sync_details where device_id=$1 and syncfile='itemManagement' order by syncdate desc limit 1 ) <= updated_date) as dev ",[device_id]
           );
         } else {
           exeQuery2 = await client.query(
             "SELECT  'Insert' as process ,autonum, trans_no, item_code, design_id , created_date, updated_date, maker_id from tbl_item_management order by created_date "
           );
         } 
         //Get Item Sizes
         const exeQuery_sync1 = await client.query("SELECT count(1) as countval  from tbl_sync_details where device_id=$1 and syncfile='itemSizes' ",[device_id]);
         var exit_check = exeQuery_sync1 && exeQuery_sync1.rows[0].countval ? exeQuery_sync1 && exeQuery_sync1.rows[0].countval : 0;
         let exeQuery3;
         if (exit_check > 0) {
           exeQuery3 = await client.query(
             " SELECT 'Insert' as process , autonum, trans_no, start_size, end_size, total_set, created_date ,size_id,color_id,qr_code,current_stock from tbl_item_sizes where (select syncdate from tbl_sync_details where device_id=$1 and syncfile='itemSizes' order by syncdate desc limit 1 ) <= created_date   ",[device_id]
           );
         } else {
           exeQuery3 = await client.query(
             "SELECT  'Insert' as process , autonum, trans_no, start_size, end_size, total_set, created_date,size_id,color_id,qr_code,current_stock from tbl_item_sizes order by created_date "
           );
         } 
         //Get Item Master
         const exeQuery_sync2 = await client.query("SELECT count(1) as countval  from tbl_sync_details where device_id=$1 and syncfile='itemMaster' ",[device_id]);
         var exit_check = exeQuery_sync2 && exeQuery_sync2.rows[0].countval ? exeQuery_sync2 && exeQuery_sync2.rows[0].countval : 0;
         let exeQuery4;
         
           exeQuery4 = await client.query(
             "SELECT  'Insert' as process , autonum, item_id, item_name, '' as itemgroup_id, '' as status_id, '' as maker_id, '' as created_date, '' as  updated_date, '' as user_id  from tbl_def_item   "
           );
         
        if (client) {
          client.end();
        }
         
        response = {  itemManagementList: exeQuery2?.rows? exeQuery2?.rows : [], itemSizesList: exeQuery3?.rows? exeQuery3?.rows : [], itemList: exeQuery4?.rows? exeQuery4?.rows : []     };
        
        return response;
      } else {
        if (client) {
          client.end();
        }
        return response;
      }
    } else {
      if (client) {
        client.end();
      }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};
//Delete Sync Details
module.exports.syncDeleteDetails = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    const { device_id, file_name } = req;
    var response = {};
    if (device_id) {
      
        const exeQuery = await client.query("DELETE FROM tbl_sync_details where device_id=$1 ", [
          device_id,
        ]);
       
      if (client) {
        client.end();
      }
      if (exeQuery && exeQuery.rowCount > 0) {
        response = { Success: "1" };
      } else {
        response = { Success: "0" };
      }
      return response;
    } else {
      if (client) {
        client.end();
      }
      return response;
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};


//Insert Order Taking
module.exports.insertOrderTaking = async (req) => {
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
      const { device_id } = decoded.data;
      let { jsonOrder,jsonOrderItems } = req; 
      var response = [],response1 = [];
      let totalOrderItemCount = 0
      if (device_id) {
        let Lists = jsonOrder.JSonObject;
        if (Lists && Lists.length > 0) {
          for (var i = 0; i < Lists.length; i++) {
            const exeUserQuery = await client.query(`select count(1) as total from tbl_order_taking  where ref_no=$1 and order_no =$2 and device_code=$3`, [Lists[i].ref_no,Lists[i].order_no,Lists[i].device_code]);
            let totalcount = exeUserQuery?.rows?.[0].total;
            const exeUserOrderQuery = await client.query(`select count(1) as total from tbl_order_taking_items  where order_no=$1 and device_code=$2`, [Lists[i].order_no,Lists[i].device_code]);
            totalOrderItemCount = exeUserOrderQuery?.rows?.[0].total;
            if (Number(totalOrderItemCount) > 0) {
              await client.query(`DELETE FROM tbl_order_taking_items where order_no=$1 and device_code=$2`, [Lists[i].order_no,Lists[i].device_code]);
            }
            const exeStockQuery = await client.query(`select count(1) as total from tbl_stock_transaction  where trans_no =$1 and  user_id=$2`, [Lists[i].order_no,Lists[i].device_code ]);
            let totalstockcount = exeStockQuery?.rows?.[0].total;
            if (Number(totalstockcount) > 0) {
              await client.query(`DELETE FROM tbl_stock_transaction where trans_no=$1 and user_id=$2`, [Lists[i].order_no,Lists[i].device_code]);
            }
            if (Number(totalcount) == 0) {
                //Insert User Log
              var makerid = await commonService.insertLogs(Lists[i].device_code, "Insert Order Taking Via Mobile - " + Lists[i].device_code+" - "+Lists[i].order_no);
              const exeUserQuerys = await client.query(`INSERT INTO tbl_order_taking(ref_no, order_no, order_date, customer_code, created_date, status_code, device_code,  sync_date,maker_id,type, remarks) values ($1, $2, $3, $4, $5, $6, $7,now() ,$8,'Mobile',$9) RETURNING order_no`, [Lists[i].ref_no, Lists[i].order_no, Lists[i].order_date, Lists[i].customer_code, Lists[i].created_date, Lists[i].status_code, Lists[i].device_code, makerid,Lists[i].remarks]); 
              response.push(exeUserQuerys.rows[0].order_no);
            } else {
                //Insert User Log
                var makerid = await commonService.insertLogs(Lists[i].device_code, "Update Order Taking Via Mobile - " + Lists[i].device_code+" - "+Lists[i].order_no);
                const exeUserQuerys = await client.query(`UPDATE tbl_order_taking set order_date=$1, customer_code=$2, created_date=$3, status_code=$4, sync_date=now(),maker_id=$5 , remarks=$9 where  ref_no=$6 and order_no=$7 and  device_code=$8  RETURNING order_no`, [Lists[i].order_date, Lists[i].customer_code, Lists[i].created_date, Lists[i].status_code,makerid, Lists[i].ref_no, Lists[i].order_no, Lists[i].device_code,Lists[i].remarks ]);
                response.push(exeUserQuerys.rows[0].order_no);
            }              
          }
        }

        //Order Taking Items insert
        let ListsItems = jsonOrderItems.JSonObject;
        if (ListsItems && ListsItems.length > 0) {
          
          for (var i = 0; i < ListsItems.length; i++) {
            // const exeUserQuery = await client.query(`select count(1) as total from tbl_order_taking_items  where order_no=$1 and item_code =$2 and design_code=$3 and size_id=$4 and color_id=$5  and device_code=$6`, [ListsItems[i].order_no,ListsItems[i].item_code,ListsItems[i].design_code,ListsItems[i].size_id,ListsItems[i].color,ListsItems[i].device_code]);
            if (ListsItems[i].color == "" || ListsItems[i].color == "null" || ListsItems[i].color == undefined
           || ListsItems[i].color == null){
            ListsItems[i].color = 0
           }
                 var makerid = await commonService.insertLogs(ListsItems[i].device_code, "Insert Order Taking Items Via Mobile - " + ListsItems[i].device_code+" - "+ListsItems[i].order_no);
                //Insert User Log
              const exeUserQuerys = await client.query(`INSERT INTO tbl_order_taking_items(order_no, item_code, design_code, color_id, item_size, qty, created_date,device_code,status_code,sync_date,maker_id,size_id) values ($1, $2, $3, $4, $5, $6, $7, $8,$9,now(),$10,$11) RETURNING order_no`, [ListsItems[i].order_no, ListsItems[i].item_code, ListsItems[i].design_code, ListsItems[i].color, ListsItems[i].item_size, ListsItems[i].qty, ListsItems[i].created_date, ListsItems[i].device_code, ListsItems[i].status_code, makerid,ListsItems[i].size_id]);
              response1.push(exeUserQuerys.rows[0].order_no);               
          
            // if (Number(totalcount) == 0) {
            //     //Insert User Log
            //   var makerid = await commonService.insertLogs(ListsItems[i].device_code, "Insert Order Taking Items Via Mobile - " + ListsItems[i].device_code+" - "+ListsItems[i].order_no);
              
            //   const exeUserQuerys = await client.query(`INSERT INTO tbl_order_taking_items(order_no, item_code, design_code, color_id, item_size, qty, created_date,device_code,status_code,sync_date,maker_id,size_id) values ($1, $2, $3, $4, $5, $6, $7, $8,$9,now(),$10,$11) RETURNING order_no`, [ListsItems[i].order_no, ListsItems[i].item_code, ListsItems[i].design_code, ListsItems[i].color, ListsItems[i].item_size, ListsItems[i].qty, ListsItems[i].created_date, ListsItems[i].device_code, ListsItems[i].status_code, makerid,ListsItems[i].size_id]);
            //   response1.push(exeUserQuerys.rows[0].order_no);
            // } else {
            //     //Update User Log
            //     var makerid = await commonService.insertLogs(ListsItems[i].device_code, "Update Order Taking Items Via Mobile - " + ListsItems[i].device_code+" - "+ListsItems[i].order_no);
              
            //     const exeUserQuerys = await client.query(`Update tbl_order_taking_items set  qty=$1 ,maker_id=$2, status_code=$3,sync_date=now() where order_no=$4 and item_code =$5 and design_code=$6 and size_id=$7 and color_id=$8  and device_code=$9 RETURNING order_no`, [ListsItems[i].qty,makerid,ListsItems[i].status_code,ListsItems[i].order_no,ListsItems[i].item_code,ListsItems[i].design_code,ListsItems[i].size_id,ListsItems[i].color,ListsItems[i].device_code]);
            //     response1.push(exeUserQuerys.rows[0].order_no);
            // }

            //Order taking stock transaction

                //Insert User Log
              var makerid = await commonService.insertLogs(ListsItems[i].device_code, "Insert Stock Order Taking Items Via Mobile - " + ListsItems[i].device_code+" - "+ListsItems[i].order_no);
              
               await client.query(`INSERT INTO tbl_stock_transaction(stock_date, size_id, trans_no, inward, outward, user_id, created_date, sync_date, maker_id) values ($1, $2, $3, $4, $5, $6, $7, now(),$8 ) RETURNING size_id`, [ListsItems[i].created_date, ListsItems[i].size_id, ListsItems[i].order_no,'0', ListsItems[i].qty, ListsItems[i].device_code, ListsItems[i].created_date ,makerid ]);

              
           
            // const exeStockQuery = await client.query(`select count(1) as total from tbl_stock_transaction  where size_id=$1 and trans_no =$2 and  user_id=$3`, [ListsItems[i].size_id,ListsItems[i].order_no,ListsItems[i].device_code ]);
            // let totalstockcount = exeStockQuery?.rows?.[0].total;
            // if (Number(totalstockcount) == 0) {
            //     //Insert User Log
            //   var makerid = await commonService.insertLogs(ListsItems[i].device_code, "Insert Stock Order Taking Items Via Mobile - " + ListsItems[i].device_code+" - "+ListsItems[i].order_no);
              
            //    await client.query(`INSERT INTO tbl_stock_transaction(stock_date, size_id, trans_no, inward, outward, user_id, created_date, sync_date, maker_id) values ($1, $2, $3, $4, $5, $6, $7, now(),$8 ) RETURNING size_id`, [ListsItems[i].created_date, ListsItems[i].size_id, ListsItems[i].order_no,'0', ListsItems[i].qty, ListsItems[i].device_code, ListsItems[i].created_date ,makerid ]);
              
            // } else {
            //     //Update User Log
            //     var makerid = await commonService.insertLogs(ListsItems[i].device_code, "Update Stock Order Taking Items Via Mobile - " + ListsItems[i].device_code+" - "+ListsItems[i].order_no);
              
            //      await client.query(`Update tbl_stock_transaction set  outward=$1 ,maker_id=$2, sync_date=now() where size_id=$3 and trans_no =$4 and  user_id=$5 `, [ListsItems[i].qty,makerid,ListsItems[i].size_id,ListsItems[i].order_no,ListsItems[i].device_code ]);
                 
            // }
                        
          }
        }

        if (Lists && Lists.length > 0) {
        
          const company_Result = await client.query(`SELECT print_id, company_name, addressline1, addressline2, area, city, gstin, mobile_number, telephone_number, status_id, footer_name from tbl_print_setting`);
          let Company_Array = company_Result && company_Result.rows ? company_Result.rows?.[0] || {} : {};
          for (let k = 0; k < Lists.length; k++){  
            const exeUserQuery = await client.query(`select count(1) as total from tbl_order_taking  where ref_no=$1 and order_no =$2 and device_code=$3 and coalesce(pdf_sent_status,'')!='sent'`, [Lists[k].ref_no,Lists[k].order_no,Lists[k].device_code]);
            let totalcount = exeUserQuery?.rows?.[0].total; 
            if (totalcount > 0) {
              const exeQuery1 = await client.query(
                `select order_no,to_char(order_date, 'dd-MM-YYYY') as orderdate,a.customer_code,UPPER(b.customer_name) as customer_name,b.contact_person,b.mobile_no,coalesce(b.alternative_mobile_no,'') as alternative_mobile_no,coalesce(b.street,'') as street,coalesce(b.area,'') as area,coalesce(b.city,'') as city,coalesce(b.pincode,'') as pincode,coalesce(b.email_id,'') as email_id,coalesce(b.gstin_no,'') as gstin_no,b.country,coalesce(b.transport_name,'') as transport_name,coalesce(b.transport_contact_no,'') as transport_contact_no,coalesce(b.transport_location,'') as transport_location,coalesce(b.transport_contact_person,'') as transport_contact_person,coalesce(b.agent_code,0) as agent_code, (select agent_name from tbl_agent where agent_code=b.agent_code) as agent_name from tbl_order_taking  as a inner join tbl_customer as b on a.customer_code=b.customer_code where ref_no=$1 and order_no =$2 and a.device_code=$3 `, [Lists[k].ref_no, Lists[k].order_no, Lists[k].device_code] 
              );
              let order_customer_details = exeQuery1?.rows[0] || {};
              let order_id = exeQuery1?.rows[0]?.order_no || '';

              const exeQuery2= await client.query(
                `select ROW_NUMBER () OVER (ORDER BY a.order_no) as sno,a.order_no,b.item_code,c.item_name,b.design_code,b.item_size,b.qty,b.color_id,b.size_id,d.color_name,e.total_set,a.order_date,e.total_set::INTEGER*b.qty as total_pcs,remarks from tbl_order_taking  as a inner join tbl_order_taking_items as b on a.order_no = b.order_no inner join tbl_def_item as c on b.item_code = c.item_id left join tbl_color as d on b.color_id = d.color_id inner join tbl_item_sizes as e on b.size_id = e.size_id where a.ref_no=$1 and a.order_no =$2 and a.device_code=$3 order by b.item_code asc`, [Lists[k].ref_no, Lists[k].order_no, Lists[k].device_code] 
              );
              let order_item_details = exeQuery2?.rows || []; 
              const exeQuery3= await client.query(
                `select coalesce(mobile_no,'') as mobile_no from tbl_user where user_id=$1`, [Lists[k].device_code] 
              );
              let user_mobileno = exeQuery3?.rows ? exeQuery3?.rows[0].mobile_no: '' || ''; 
              const Order_Item_List = await client.query(`SELECT order_no,item_code,item_name,SUM(qty) as qty,
              sum(total_piece) as total_piece from (select a.order_no,b.item_code,c.item_name,
              b.qty,e.total_set,(b.qty::INTEGER*e.total_set::INTEGER) as total_piece
              from tbl_order_taking  as a inner join tbl_order_taking_items as b 
              on a.order_no = b.order_no inner join tbl_def_item as c on b.item_code = c.item_id 
              inner join tbl_color as d on b.color_id = d.color_id inner join tbl_item_sizes as 
              e on b.size_id = e.size_id where a.ref_no=$1 and a.order_no =$2 and (a.device_code=$3 or a.user_id=$3) order by b.item_code asc) as dev group by order_no,item_code,item_name order by item_code asc`, [order_details[k].ref_no, order_details[k].order_no, order_details[k].user_id]);
              let ItemLists = Order_Item_List && Order_Item_List.rows ? Order_Item_List.rows : [];
              let responseData = {
                "OrderSlip": order_item_details, "CustomerArray": order_customer_details, "CompanyArray": Company_Array ,"order_id":order_id, "user_mobile_no":user_mobileno,"ItemLists":ItemLists
              } 
              await generateOrderPDF(responseData,req, Lists[k]);
            }
          }
         
        }

        if (client) {
          client.end();
        } 
        return {order: response, orderItems : response1};
      } else {
        if (client) {
          client.end();
        }
        return {order: [], orderItems : []};
      }
    } else {
      if (client) {
        client.end();
      }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};
//Generate Order pdf
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
      let remark = ''
      let row = responseData.OrderSlip || []
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
      responseData = {
        ...responseData, total_pcs_value: total_pcs_value, short_frock_set: short_frock_set, short_frock_pcs: short_frock_pcs, long_frock_set: long_frock_set, long_frock_pcs: long_frock_pcs, total_set_value: total_set_value, checkshortfrock:checkshortfrock, checklongfrock: checklongfrock, remark : remark
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
       
        var configURL = {
          method: 'get',
          url: whatsappurl,
          headers: {
            'Content-Type': 'application/json'
          },
        };    
            
        client.query(`UPDATE tbl_order_taking set whatsappurl = $1 where ref_no=$2 and order_no =$3 and device_code=$4 and coalesce(pdf_sent_status,'')!='sent'`, [whatsappurl,List.ref_no,List.order_no,List.device_code]);
        await axios(configURL).then(function (response) {
          //  console.log(response,'response SMS SUCCDD')     
           client.query(`UPDATE tbl_order_taking set pdf_sent_status = 'sent' where ref_no=$1 and order_no =$2 and device_code=$3 and coalesce(pdf_sent_status,'')!='sent'`, [List.ref_no,List.order_no,List.device_code]);
        }).catch(function (error) {
          console.log(error, "error")
        });
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
      if (client) {
        client.end();
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
//Delete Order Taking
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
      const decoded = await commonService.jwtVerify(req.jwtToken); 
      const { device_id } = decoded.data;
      let { jsonOrder } = req; 
      var response = [] ;
      if (device_id) {
        let Lists = jsonOrder.JSonObject;
        if (Lists && Lists.length > 0) {
          for (var i = 0; i < Lists.length; i++) {
            const exeUserQuery = await client.query(`select count(1) as total from tbl_order_taking  where ref_no=$1 and order_no =$2 and device_code=$3`, [Lists[i].ref_no,Lists[i].order_no,Lists[i].device_code]);
            let totalcount = exeUserQuery?.rows?.[0].total;
            if (Number(totalcount) > 0) {
                //Insert User Log
                var makerid =await commonService.insertLogs(Lists[i].device_code, "Delete Order Taking Via Mobile - " + Lists[i].device_code + " - " + Lists[i].order_no);

              const exeQuerys = await client.query(`UPDATE tbl_order_taking set order_date=$1, customer_code=$2, created_date=$3, status_code=$4, sync_date=now(),maker_id=$5 where  ref_no=$6 and order_no=$7 and  device_code=$8  RETURNING order_no`, [Lists[i].order_date, Lists[i].customer_code, Lists[i].created_date, Lists[i].status_code, makerid, Lists[i].ref_no, Lists[i].order_no, Lists[i].device_code]);
              //Delete stock transaction
              await client.query(`Delete from tbl_stock_transaction where trans_no=$1 and user_id =$2  `, [Lists[i].order_no, Lists[i].device_code ]);
              /*//Delete Order datas
              const exeQuerys = await client.query(`Delete from tbl_order_taking where ref_no=$1 and order_no =$2 and device_code=$3 RETURNING order_no`, [Lists[i].ref_no, Lists[i].order_no, Lists[i].device_code]);
              //Delete order items details
               await client.query(`Delete from tbl_order_taking_items where   order_no =$1 and device_code=$2 RETURNING order_no`, [ Lists[i].order_no,Lists[i].device_code]);*/
              response.push(exeQuerys.rows[0].order_no);
            }              
          }
        }
 
        if (client) {
          client.end();
        } 
        return {order: response };
      } else {
        if (client) {
          client.end();
        }
        return {order: [] };
      }
    } else {
      if (client) {
        client.end();
      }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};



//Get Stock transaction data service
module.exports.stockTransactionList = async (req) => {
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
      const { device_id } = decoded.data;
      var response = {};
      if (device_id) {
        const exeQuery = await client.query(
          "select to_char(CURRENT_DATE,'YYYY-MM-DD') as stock_date ,row_number() over(order by b.size_id) as stock_code,  sum(coalesce(inward,0))+coalesce(b.current_stock,0)  as inward,sum(coalesce(outward,0)) as outward,b.size_id,coalesce(((select sum(coalesce(no_of_set,0)) from tbl_fg_items where size_id=b.size_id) +coalesce(b.current_stock,0)) - (select coalesce(sum(coalesce(dispatch_set,0)),0) from tbl_dispatch_details where status_flag = 1 and  size_id=b.size_id ),0) as current_stock  from tbl_stock_transaction as a right join  tbl_item_sizes as b on a.size_id=b.size_id group by b.size_id " 
        );
        const exeQuery_Order = await client.query(
          "select to_char(CURRENT_DATE,'YYYY-MM-DD') as order_date,sum(qty) as qty, size_id from tbl_order_taking_items as a inner join tbl_order_taking as b on a.order_no=b.order_no where b.order_date=CURRENT_DATE and b.status_code=1 group by size_id " );
        if (client) {
          client.end();
        }
        
        let stocklist = exeQuery?.rows ? exeQuery.rows : [];
        let orderlist = exeQuery_Order?.rows ? exeQuery_Order.rows : [];
        response = { stockList: stocklist, orderList: orderlist};
         
        return response;
      } else {
        if (client) {
          client.end();
        }
        return response;
      }
    } else {
      if (client) {
        client.end();
      }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};



//Check Stock for each item
module.exports.checkStockDetails = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    if (req) {
    
      const { device_id,process,jsonItems,size_id,qty } = req;
      var response = {};
      if (device_id && process == 'Single') {
        if (qty != '' || qty != null || qty != 0) {
          let getqty = Number(qty);
          // const exeInwardQuery = await client.query(
          //   "select coalesce(current_stock,0)  as sumqty  from tbl_item_sizes  where size_id='" + size_id + "'  ");
          // let getstock = exeInwardQuery?.rows?.length > 0 ? exeInwardQuery.rows[0].sumqty : []; 
          // if (Number(getstock) > 0) { 
           
            // const exeQuery = await client.query(
            //   `select count(1) as totalcount from (select (sum(coalesce(inward,0))+coalesce(b.current_stock,0)-sum(coalesce(outward,0)))  as sumqty  from tbl_stock_transaction as  a right join  tbl_item_sizes as b on a.size_id=b.size_id where b.size_id='` + size_id + `' group by b.size_id) as dev where dev.sumqty >= ` + getqty + ` `);
              const exeQuery = await client.query(
                `select count(1) as totalcount from (select (sum(a.no_of_set) - coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = b.size_id ),0))  as sumqty  from tbl_fg_items as  a  right join  tbl_item_sizes as b on a.size_id=b.size_id where b.size_id='` + size_id + `' group by b.size_id) as dev where dev.sumqty >= ` + getqty + ` `);
            let stockcount = exeQuery?.rows?.length > 0 ? exeQuery.rows[0].totalcount : 0;
            response = { stockList: stockcount };
            if (client) {
              client.end();
            }
            return response;
          // } else {
          //   response = { stockList: "1" };
          //   if (client) {
          //     client.end();
          //   }
          //   return response;
          // }
        } else {
          return response;
        } 
      }
      if (device_id && process == 'Bulk') {
        let Lists = jsonItems.JSonObject;
        if (Lists && Lists.length > 0) { 
          let stockcount = -1;
          for (var i = 0; i < Lists.length; i++) {
            let getqty = Number(Lists[i].qty);
            
            // const exeInwardQuery = await client.query(
            //   "select coalesce(current_stock,0)  as sumqty  from tbl_item_sizes  where size_id='" + Lists[i].size_id + "'   ");
            // let getstock = exeInwardQuery?.rows?.length > 0 ? exeInwardQuery.rows[0].sumqty : []; 
            // if (Number(getstock) > 0) { 
              const exeQuery = await client.query(
                `select count(1) as totalcount from (select (sum(a.no_of_set) - coalesce((SELECT sum(dispatch_set) from tbl_dispatch_details where status_flag = 1 and size_id = b.size_id ),0))  as sumqty  from tbl_fg_items as  a  right join  tbl_item_sizes as b on a.size_id=b.size_id where b.size_id='` + Lists[i].size_id + `' group by b.size_id) as dev where dev.sumqty >= ` + getqty + ` `);
              // const exeQuery = await client.query(
              //   "select count(1) as totalcount from (select (sum(coalesce(inward,0))+coalesce(b.current_stock,0)-sum(coalesce(outward,0)))  as sumqty  from tbl_stock_transaction as  a right join  tbl_item_sizes as b on a.size_id=b.size_id where b.size_id='" + Lists[i].size_id + "' group by b.size_id) as dev where dev.sumqty >= '" + getqty + "' ");
                  stockcount = exeQuery?.rows?.length > 0 ? exeQuery.rows[0].totalcount : [];
                if (stockcount == 0) {
                  response = { stockList: stockcount, itemname: Lists[i].itemName };
                  return response;
                }
            // } else {
            //   response = { stockList: "1" , itemname: "" };
            //   if (client) {
            //     client.end();
            //   }
            //   return response;
            // }
          }
        
          response = { stockList: "1", itemname: ""};
          return response;
           
        }        
      }
      else {
        if (client) {
          client.end();
        }
        return response;
      }
    } else {
      if (client) {
        client.end();
      }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};

//Insert Order Taking
module.exports.OrderTakingCheck = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
      let { device_id,order_no } = req; 
      var response = [],response1 = [];
      if (device_id) {
        const exeUserQuery = await client.query(`SELECT count(order_no) as count FROM tbl_dispatch_details where order_no = $1`,[order_no]);
        let totalcount = exeUserQuery?.rows?.[0].count;       

        if (client) {
          client.end();
        } 
        return {totalcount: totalcount};
      } else {
        if (client) {
          client.end();
        }
        return {totalcount: ''};
      }
  } catch (error) {
    if (client) {
      client.end();
    }
    throw new Error(error);
  } finally {
    if (client) {
      client.end();
    } // always close the resource
  }
};
