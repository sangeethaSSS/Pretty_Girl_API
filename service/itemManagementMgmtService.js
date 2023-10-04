/****************************
 File    : itemManagementService.js
 Author  : Prabhavathy
 Date    : 23-01-2023
 Purpose : Item Management Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');

//create Item Management List jwt 
module.exports.itemManagementListjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create Item Management LIST
module.exports.itemManagementList = async (req) => {
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
            const { status_id } = decoded.data;
            var status = '';
            if (decoded) {
                if (status_id == 0) {
                    status = ' 1=1'
                }
                else {
                    status = ` a.status_id = ` + status_id
                }
                const item_Result = await client.query(`SELECT item_code,trans_no,design_id,status_id,item_name,status_name,employeename,createddate FROM (select a.item_code,a.trans_no,a.design_id,a.status_id,c.item_name,b.status_name,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate,(select log_date  from tbl_userlog where autonum = a.maker_id limit 1) as log_date from tbl_item_management as a  inner join tbl_def_status as b on a.status_id = b.status_id inner join tbl_def_item as c on a.item_code = c.item_id  where  `+ status + ` order by a.trans_no desc) as dev order by log_date desc`);

                let Lists = item_Result && item_Result.rows ? item_Result.rows : [];
                let result = [];

                if (Lists.length > 0) {
                    for (let i = 0; i < Lists.length; i++) {
                        const size_Result = await client.query(`select a.size_id,a.trans_no,a.start_size as starting_size,a.end_size as ending_size,a.total_set as total_pieces,a.trans_no,a.color_id,b.color_name,a.qr_code,a.current_stock,c.item_code,c.design_id,d.item_name from tbl_item_sizes as a left join tbl_color as b on a.color_id = b.color_id inner join tbl_item_management as c on a.trans_no = c.trans_no inner join tbl_def_item as d on c.item_code = d.item_id where a.trans_no = ` + Lists[i].trans_no );
                        let size_Array = size_Result && size_Result.rows ? size_Result.rows : [];
                        let obj = Lists[i]
                        obj['SizeArray'] = size_Array
                        result.push(obj)
                    }
                }

                if (client) {
                    client.end();
                }
                if(Lists && Lists.length > 0){
                    return response = { "ItemManagementlist": result}
                }
               else {
                return response = { "ItemManagementlist": []}
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

//create Item jwt 
module.exports.saveItemManagementjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//create Item service
module.exports.saveItemManagement = async (req) => {
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
            const { size_array, item_id, user_id, status_id, design_id,trans_no } = decoded.data;
            if (decoded) {
                if (size_array && size_array.length > 0) {
                    let delete_array = size_array.filter(e => e.isaddflag == 3)
                    if (delete_array && delete_array.length > 0) {
                     for (let i = 0; i < delete_array.length; i++) {
                        const size_count = await client.query(`select count(*) from tbl_order_taking_items where size_id = $1 `, [delete_array[i].size_id])
                         var sizecount = size_count && size_count.rows[0].count;
                         
                        const size_count1 = await client.query(`select count(*) from tbl_job_details where design_id = $1 `, [delete_array[i].size_id])
                        var sizecount1 = size_count1 && size_count1.rows[0].count;
                        if(sizecount > 0 ) {
                            return response = { "message": delete_array[i].qr_code + " " + constants.userMessage.ALREADY_USE+" in order taking", "statusFlag": 2 };
                         }
                         if(sizecount1 > 0 ) {
                            return response = { "message": delete_array[i].qr_code + " " + constants.userMessage.ALREADY_USE+" in job card", "statusFlag": 2 };
                        }
                     }
                    }
                   }
                   
                    if (trans_no == 0) {
                        const id_max = await client.query(`select coalesce (max(trans_no),0) + 1 as mr FROM tbl_item_management`)
                        var item_max = id_max && id_max.rows[0].mr;
                        var makerid = await commonService.insertLogs(user_id, "Insert Item Management");

                        const itemresult = await client.query(`INSERT INTO "tbl_item_management"("trans_no","item_code","design_id","status_id","maker_id","user_id","created_date") values ($1, $2, $3, $4, $5, $6,CURRENT_TIMESTAMP) `, [item_max, item_id, design_id, status_id, makerid, user_id]);

                        
                        if (size_array && size_array.length > 0) {
                            let delete_array = size_array.filter(e => e.isaddflag == 3)
                            if (delete_array && delete_array.length > 0) {
                             for (let i = 0; i < delete_array.length; i++) {
                               const Delete_size = await client.query(`DELETE FROM tbl_item_sizes where size_id=` + delete_array[i].size_id) 
                               let Delete_code = Delete_size && Delete_size.rowCount ? Delete_size.rowCount : 0;
                                 console.log(Delete_code)
                            }  
                           }
                            let insert_array = size_array.filter(e => e.isaddflag == 1)
                            if (insert_array && insert_array.length > 0) {
                            for (let i = 0; i < insert_array.length; i++) {
                                const size = await client.query(`select coalesce (max(size_id),0) + 1 as mr FROM tbl_item_sizes`)
                                var size_max = size && size.rows[0].mr;
                                const sizeresult = await client.query(`INSERT INTO "tbl_item_sizes"("trans_no","start_size","end_size","total_set","size_id","color_id","qr_code","current_stock","created_date","settype") values ($1, $2, $3, $4,$5,$6,$7,$8,CURRENT_TIMESTAMP,$9) `, [ item_max, insert_array[i].starting_size, insert_array[i].ending_size, insert_array[i].total_pieces,size_max,insert_array[i].color_id,insert_array[i].qr_code,insert_array[i].current_stock,insert_array[i].settype]);
                                let size_code = sizeresult && sizeresult.rowCount ? sizeresult.rowCount : 0;
                                console.log(size_code)
                            }
                            }
                        }
                        if (client) {
                            client.end();
                        }

                        let create_code = itemresult && itemresult.rowCount ? itemresult.rowCount : 0;
                        if (create_code == 1) {
                            return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1 };
                        }
                        else { return '' }
                    }
                    else {
                        var makerid = await commonService.insertLogs(user_id, "Update Item Management");
                        const count = await client.query(`select count(*) as count FROM tbl_item_management where trans_no =` + trans_no)
                        var count_Check = count && count.rows[0].count
                        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {

                            const update_result = await client.query(`UPDATE "tbl_item_management" set item_code=$1,design_id=$2,status_id=$3,user_id=$4,maker_id=$5,updated_date=CURRENT_TIMESTAMP where trans_no = $6 `, [item_id, design_id, status_id, user_id, makerid,trans_no]);
                        
                            if (size_array && size_array.length > 0) {
                                let delete_array = size_array.filter(e => e.isaddflag == 3)
                                if (delete_array && delete_array.length > 0) {
                                 for (let i = 0; i < delete_array.length; i++) {
                                   const Delete_size = await client.query(`DELETE FROM tbl_item_sizes where size_id=` + delete_array[i].size_id) 
                                   let Delete_code = Delete_size && Delete_size.rowCount ? Delete_size.rowCount : 0;
                                }  
                               }
                                let insert_array = size_array.filter(e => e.isaddflag == 1)
                                if (insert_array && insert_array.length > 0) {
                                    for (let i = 0; i < insert_array.length; i++) {
                                        const size = await client.query(`select coalesce (max(size_id),0) + 1 as mr FROM tbl_item_sizes`)
                                        var size_max = size && size.rows[0].mr;
                                        const sizeresult = await client.query(`INSERT INTO "tbl_item_sizes"("trans_no","start_size","end_size","total_set","size_id","color_id","qr_code","current_stock","created_date","settype") values ($1, $2, $3, $4,$5,$6,$7,$8,CURRENT_TIMESTAMP,$9) `, [trans_no, insert_array[i].starting_size, insert_array[i].ending_size, insert_array[i].total_pieces,size_max,insert_array[i].color_id,insert_array[i].qr_code,insert_array[i].current_stock,insert_array[i].settype]);
                                        let size_code = sizeresult && sizeresult.rowCount ? sizeresult.rowCount : 0;
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

//create Check Design No. jwt 
module.exports.CheckDesignNojwt = async (req) => {
    try {
      const token = await commonService.jwtCreate(req);
      return { token };
    } catch (error) {
      throw new Error(error);
    }
  }
  
  //create Check Design No. service
  module.exports.CheckDesignNo = async (req) => {
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
        const { design_id } = decoded.data;
        if (decoded) {
          const exit_count = await client.query(`select count(*) as count FROM tbl_item_management where lower(design_id) = lower('` + design_id + `')`)
          var exit_check = exit_count && exit_count.rows[0].count
          if (exit_check > 0) {
            return response = { "message": constants.userMessage.DESIGN_DUPLICATION, "checkFlag": 2};
          } else {
            return response = {"message": "","checkFlag": 1};
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
module.exports.editItemListjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create Item LIST
module.exports.editItemList = async (req) => {
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
            const { trans_no } = decoded.data;
            if (decoded) {
                const item_Result = await client.query(`select a.item_code,a.trans_no,a.design_id,a.status_id,c.item_name,b.status_name from tbl_item_management as a  inner join tbl_def_status as b on a.status_id = b.status_id inner join tbl_def_item as c on a.item_code = c.item_id    where a.trans_no = ` + trans_no);

                // const size_Result = await client.query(`select a.size_id,a.trans_no,a.start_size as starting_size,a.end_size as ending_size,a.total_set as total_pieces,a.trans_no,a.color_id,b.color_name,a.qr_code,a.current_stock from tbl_item_sizes as a left join tbl_color as b on a.color_id = b.color_id where a.trans_no = ` + trans_no);
                const size_Result = await client.query(`select a.size_id,a.trans_no,a.start_size as starting_size,a.end_size as ending_size,a.total_set as total_pieces,a.trans_no,0 as color_id,'' as color_name,a.qr_code,a.current_stock,a.settype from tbl_item_sizes as a  where a.trans_no = ` + trans_no);
                if (client) {
                    client.end();
                }
                let size_Array = size_Result && size_Result.rows ? size_Result.rows : [];
                let editItem_Array = item_Result && item_Result.rows ? item_Result.rows : [];

                responseData = { "EditSizeList": size_Array, "EditItemArray": editItem_Array }
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

//Delete Item Management jwt 
module.exports.deleteItemManagementjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}

//Delete Item Management service
module.exports.deleteItemManagement = async (req) => {
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
            const { user_id, trans_no } = decoded.data;
            if (decoded) {
                const item_Count_date = await client.query(`select count(*) from tbl_order_taking_items where size_id in (select size_id from tbl_item_sizes where trans_no = $1)`, [trans_no])
                var order_item_Check = item_Count_date && item_Count_date.rows[0].count;

                const itemsize_Count_date = await client.query(`select count(*) from tbl_job_details where design_id in (select size_id from tbl_item_sizes where trans_no = $1)`, [trans_no])
                var order_item_Check1 = itemsize_Count_date && itemsize_Count_date.rows[0].count || 0;

                const itemsize_Count_Stock_Transaction = await client.query(`SELECT count(*) as count FROM tbl_stock_transaction where size_id in (select size_id from tbl_item_sizes where trans_no = $1)`, [trans_no])
                var stock_item_Check1 = itemsize_Count_Stock_Transaction && itemsize_Count_Stock_Transaction.rows[0].count || 0;

                const itemsize_Count_Dispatch = await client.query(`select count(*) as count from tbl_dispatch_details where size_id in (select size_id from tbl_item_sizes where trans_no = $1)`, [trans_no])
                var dispatch_item_Check1 = itemsize_Count_Dispatch && itemsize_Count_Dispatch.rows[0].count || 0;
                
                const itemsize_Count_FG = await client.query(`select count(*) as count from tbl_fg_items where size_id in (select size_id from tbl_item_sizes where trans_no = $1)`, [trans_no])
                var fg_item_Check1 = itemsize_Count_FG && itemsize_Count_FG.rows[0].count || 0;

                const itemsize_Sync_Count = await client.query(`SELECT count(*) as count FROM tbl_item_management where trans_no = $1 and created_date <
                (SELECT syncdate from  tbl_sync_details  where syncfile = 'itemManagement'
                order by syncdate desc limit 1
                )`, [trans_no])
                var item_sync_count = itemsize_Sync_Count && itemsize_Sync_Count.rows[0].count || 0;
                
                if (order_item_Check1 > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_USE +" in job card", "statusFlag": 2 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
                    }
                }
                if (stock_item_Check1 > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_USE +" in stock transaction", "statusFlag": 2 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
                    }
                }
                if (fg_item_Check1 > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_USE +" in FG", "statusFlag": 2 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
                    }
                }
                if (dispatch_item_Check1 > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_USE +" in dispatch", "statusFlag": 2 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
                    }
                }
                if (item_sync_count > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_SYNC, "statusFlag": 2 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
                    }
                }
                
                if (order_item_Check == 0 || order_item_Check == '0') {
                const item_Count = await client.query(`select count(*) as count FROM tbl_item_management where trans_no =` + trans_no)
                var count_Check = item_Count && item_Count.rows[0].count;
                if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                    await commonService.insertLogs(user_id, "Delete Item Management");
                    await client.query(`DELETE FROM tbl_item_sizes where trans_no=` + trans_no)
                    const delete_result = await client.query(`DELETE FROM tbl_item_management where trans_no = $1 `,
                        [trans_no]);
                    if (client) {
                        client.end();
                    }
                    let deletecode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
                    if (deletecode == 1) {
                        responseData = { "message": constants.userMessage.USER_DELETED, "statusFlag": 1 }
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
            else{
                responseData = { "message": constants.userMessage.ALREADY_USE+" in order taking", "statusFlag": 2 }
                if (responseData) {
                  return responseData;
                }
                else {
                  return '';
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

//Delete Item Management jwt 
module.exports.checkItemExistTransactionjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}

//Delete Item Management service
module.exports.checkItemExistTransaction = async (req) => {
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
            const { user_id, size_id } = decoded.data;
            if (decoded) {
                const item_Count_date = await client.query(`select count(*) as count from tbl_order_taking_items where size_id = $1`, [size_id])
                var order_item_Check = item_Count_date && item_Count_date.rows[0].count;

                const itemsize_Count_date = await client.query(`select count(*) as count from tbl_job_details where design_id = $1`, [size_id])
                var order_item_Check1 = itemsize_Count_date && itemsize_Count_date.rows[0].count || 0;

                const itemsize_Count_Stock_Transaction = await client.query(`SELECT count(*) as count FROM tbl_stock_transaction where size_id = $1`, [size_id])
                var stock_item_Check1 = itemsize_Count_Stock_Transaction && itemsize_Count_Stock_Transaction.rows[0].count || 0;

                const itemsize_Count_Dispatch = await client.query(`select count(*) as count from tbl_dispatch_details where size_id = $1`, [size_id])
                var dispatch_item_Check1 = itemsize_Count_Dispatch && itemsize_Count_Dispatch.rows[0].count || 0;
                
                const itemsize_Count_FG = await client.query(`select count(*) as count from tbl_fg_items where size_id = $1`, [size_id])
                var fg_item_Check1 = itemsize_Count_FG && itemsize_Count_FG.rows[0].count || 0;

                const itemsize_Sync_Count = await client.query(`SELECT count(*) as count FROM tbl_item_sizes where size_id = $1 and created_date <  (SELECT syncdate from  tbl_sync_details  where syncfile = 'itemSizes' order by syncdate desc limit 1 ) `, [size_id])
                var item_sync_count = itemsize_Sync_Count && itemsize_Sync_Count.rows[0].count || 0;
                

                if (order_item_Check1 > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_USE +" in job card", "statusFlag": 2 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
                    }
                } else if (stock_item_Check1 > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_USE +" in stock transaction", "statusFlag": 2 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
                    }
                } else if (fg_item_Check1 > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_USE +" in FG", "statusFlag": 2 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
                    }
                } else if (dispatch_item_Check1 > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_USE +" in dispatch", "statusFlag": 2 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
                    }
                } else if (order_item_Check > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_USE+" in order taking", "statusFlag": 2 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
                    }            
                } else if (item_sync_count > 0) {
                    responseData = { "message": constants.userMessage.ALREADY_SYNC, "statusFlag": 2 }
                    if (responseData) {
                    return responseData;
                    }
                    else {
                    return '';
                    }            
            } else {
                responseData = { "message": "", "statusFlag": 1 }
                    if (responseData) {
                      return responseData;
                    }
                    else {
                      return '';
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