/****************************
 File    : itemMasterService.js
 Author  : Prabhavathy
 Date    : 1-09-2022
 Purpose : itemMaster Service 
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
//create Item LIST
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
            const { status_id } = decoded.data;
            var status = '';
            if (decoded) {
                if (status_id == 0) {
                    status = ' 1=1'
                }
                else {
                    status = ` a.status_id = ` + status_id
                }
                const item_Result = await client.query(`select a.item_id,a.itemgroup_id,a.item_name,c.itemgroup_name,a.status_id,b.status_name,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate from tbl_item as a  inner join tbl_def_status as b on a.status_id = b.status_id inner join tbl_itemgroup as c on a.itemgroup_id = c.itemgroup_id where  `+ status + ` order by a.item_id desc`);

                let Lists = item_Result && item_Result.rows ? item_Result.rows : [];
                let result = [];

                if (Lists.length > 0) {
                    for (let i = 0; i < Lists.length; i++) {
                        const size_Result = await client.query(`select starting_size,ending_size,total_pieces,item_id from tbl_size where item_id  = ` + Lists[i].item_id );
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
                    return response = { "ItemArray": result}
                }
               else {
                return ''
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
module.exports.editItemjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create Edit LIST
module.exports.editItem = async (req) => {
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
            const { item_id } = decoded.data;
            if (decoded) {
                const item_Result = await client.query(`select a.item_id,a.itemgroup_id,a.item_name,c.itemgroup_name,a.status_id,b.status_name from tbl_item as a  inner join tbl_def_status as b on a.status_id = b.status_id inner join tbl_itemgroup as c on a.itemgroup_id = c.itemgroup_id where  a.item_id = ` + item_id);

                if (client) {
                    client.end();
                }
                let editItem_Array = item_Result && item_Result.rows ? item_Result.rows : [];

                responseData = { "EditItemArray": editItem_Array}
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

//create Item jwt 
module.exports.saveItemjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//create Item service
module.exports.saveItem = async (req) => {
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
            const { size_array, item_id, item_name, user_id, status_id, itemgroup_id } = decoded.data;
            if (decoded) {
                const exit_count = await client.query(`select count(*) as count FROM tbl_item where lower(item_name) = lower('` + item_name + `') and item_id != ` + item_id)
                var exit_check = exit_count && exit_count.rows[0].count
                if (exit_check > 0) {
                  return response = { "message": constants.userMessage.ITEM_DUPLICATION, "statusFlag": 2 };
                }
                else{
                    if (item_id == 0) {
                        const id_max = await client.query(`select coalesce (max(item_id),0) + 1 as mr FROM tbl_item`)
                        var item_max = id_max && id_max.rows[0].mr;
                        var makerid = await commonService.insertLogs(user_id, "Insert Item");

                        const itemresult = await client.query(`INSERT INTO "tbl_item"("item_id","itemgroup_id","item_name","status_id","maker_id","user_id","created_date") values ($1, $2, $3, $4, $5, $6,CURRENT_TIMESTAMP) `, [item_max, itemgroup_id, item_name, status_id, makerid, user_id]);

                        
                        if (size_array && size_array.length > 0) {
                            let delete_array = size_array.filter(e => e.isaddflag == 3)
                            // console.log(delete_array, "delete_array")
                            if (delete_array && delete_array.length > 0) {
                             for (let i = 0; i < delete_array.length; i++) {
                               const Delete_size = await client.query(`DELETE FROM tbl_size where size_id=` + delete_array[i].size_id) 
                               let Delete_code = Delete_size && Delete_size.rowCount ? Delete_size.rowCount : 0;
                                 console.log(Delete_code)
                            }  
                           }
                            let insert_array = size_array.filter(e => e.isaddflag == 1)
                            // console.log(insert_array, "insert_array")
                            if (insert_array && insert_array.length > 0) {
                            for (let i = 0; i < insert_array.length; i++) {
                                const size = await client.query(`select coalesce (max(size_id),0) + 1 as mr FROM tbl_size`)
                                var size_max = size && size.rows[0].mr;
                                const sizeresult = await client.query(`INSERT INTO "tbl_size"("size_id","item_id","starting_size","ending_size","total_pieces","created_date") values ($1, $2, $3, $4, $5,CURRENT_TIMESTAMP) `, [size_max, item_max, insert_array[i].starting_size, insert_array[i].ending_size, insert_array[i].total_pieces]);
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
                        var makerid = await commonService.insertLogs(user_id, "Update Item");
                        const count = await client.query(`select count(*) as count FROM tbl_item where item_id =` + item_id)
                        var count_Check = count && count.rows[0].count
                        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {

                            const update_result = await client.query(`UPDATE "tbl_item" set itemgroup_id=$1,item_name=$2,status_id=$3,user_id=$4,maker_id=$5,updated_date=CURRENT_TIMESTAMP where item_id = $6 `, [itemgroup_id, item_name, status_id, user_id, makerid, item_id]);
                        
                            if (size_array && size_array.length > 0) {
                                let delete_array = size_array.filter(e => e.isaddflag == 3)
                                // console.log(delete_array, "delete_array")
                                if (delete_array && delete_array.length > 0) {
                                 for (let i = 0; i < delete_array.length; i++) {
                                   const Delete_size = await client.query(`DELETE FROM tbl_size where size_id=` + delete_array[i].size_id) 
                                   let Delete_code = Delete_size && Delete_size.rowCount ? Delete_size.rowCount : 0;
                                     console.log(Delete_code)
                                }  
                               }
                                let insert_array = size_array.filter(e => e.isaddflag == 1)
                                // console.log(insert_array, "insert_array")
                                if (insert_array && insert_array.length > 0) {
                                for (let i = 0; i < insert_array.length; i++) {
                                    const size = await client.query(`select coalesce (max(size_id),0) + 1 as mr FROM tbl_size`)
                                    var size_max = size && size.rows[0].mr;
                                    const sizeresult = await client.query(`INSERT INTO "tbl_size"("size_id","item_id","starting_size","ending_size","total_pieces","created_date") values ($1, $2, $3, $4, $5,CURRENT_TIMESTAMP) `, [size_max, item_id, insert_array[i].starting_size, insert_array[i].ending_size, insert_array[i].total_pieces]);
                                    let size_code = sizeresult && sizeresult.rowCount ? sizeresult.rowCount : 0;
                                    console.log(size_code)
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

//Delete Item jwt 
module.exports.deleteItemjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}

//Delete Item service
module.exports.deleteItem = async (req) => {
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
            const { user_id, item_id } = decoded.data;
            if (decoded) {
                const item_Count_date = await client.query(`select count(*) as count FROM tbl_job_details where item_id =` + item_id)
                var item_Check = item_Count_date && item_Count_date.rows[0].count;
                if (item_Check == 0 || item_Check == '0') {
                const item_Count = await client.query(`select count(*) as count FROM tbl_item where item_id =` + item_id)
                var count_Check = item_Count && item_Count.rows[0].count;
                if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                    await commonService.insertLogs(user_id, "Delete Item");
                    await client.query(`DELETE FROM tbl_size where item_id=` + item_id)
                    const delete_result = await client.query(`DELETE FROM tbl_item where item_id = $1 `,
                        [item_id]);
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
            else{
                responseData = { "message": constants.userMessage.ALREADY_EXITS, "statusFlag": 2 }
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


//create jwt 
module.exports.sizeListjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create Size LIST
module.exports.sizeList = async (req) => {
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
            const { item_id } = decoded.data;
            if (decoded) {
                const item_Result = await client.query(`select a.item_id,a.itemgroup_id,a.item_name,c.itemgroup_name,a.status_id,b.status_name from tbl_item as a  inner join tbl_def_status as b on a.status_id = b.status_id inner join tbl_itemgroup as c on a.itemgroup_id = c.itemgroup_id where a.item_id = ` + item_id);

                const size_Result = await client.query(`select starting_size,ending_size,total_pieces,item_id,size_id,(select count(1) from tbl_job_details where item_id = tbl_size.item_id and size_id = tbl_size.size_id) as count from tbl_size where item_id = ` + item_id);
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