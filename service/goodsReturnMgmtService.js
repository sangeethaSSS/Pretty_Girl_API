
/****************************
 File    : goodsReturnService.js
 Author  : Krishnaveni S
 Date    : 09-10-2023
 Purpose : Goods Return Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');

//create Agent jwt 
module.exports.getGRCustomerListJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
module.exports.getGRCustomerList = async (req) => {
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
            const { user_id } = decoded.data;
            if (decoded) {
                const dispatchedCustomerResult = await client.query(`SELECT DISTINCT COALESCE(b.customer_name,'') ||' - '||  COALESCE(b.mobile_no,'') AS label,b.customer_code AS value FROM tbl_dispatch_details AS a INNER JOIN tbl_customer AS b ON a.customer_code = b.customer_code WHERE status_flag = 1`);
                if (client) {
                    client.end();
                }

                let dispatchedCustomerList = dispatchedCustomerResult && dispatchedCustomerResult.rows ? dispatchedCustomerResult.rows : [];

                responseData = { "dispatchedCustomerList": dispatchedCustomerList, "Message": "" }
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

module.exports.getGRItemListJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
module.exports.getGRItemList = async (req) => {
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
            const { user_id, customer_code } = decoded.data;
            if (decoded) {
                let customercode_val = '0';
                if (customer_code && customer_code != "" && customer_code != "0") {
                    customercode_val = customer_code ? '\'' + customer_code.split(',').join('\',\'') + '\'' : ''
                    // customercode_val = `  lower(a.customer_code) = lower(${customer_code_val})`
                    // customercode_val = `  a.customer_code in (${customer_code_val})`
                }
                const dispatchedItemResult = await client.query(`SELECT DISTINCT b.size_id AS value,b.qr_code AS label,total_set FROM tbl_dispatch_details AS a INNER JOIN tbl_item_sizes AS b ON a.size_id = b.size_id WHERE status_flag = 1 AND a.customer_code = ${customercode_val}`);
                if (client) {
                    client.end();
                }

                let dispatchedItemList = dispatchedItemResult && dispatchedItemResult.rows ? dispatchedItemResult.rows : [];

                responseData = { "dispatchedItemList": dispatchedItemList, "Message": "" }
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


module.exports.getDispatchListBasedOnItemCustomerJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
module.exports.getDispatchListBasedOnItemCustomer = async (req) => {
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
            // const { user_id, customer_code, item_array } = decoded.data;
            const { user_id, customer_code, size_id, goods_return_set, goods_return_pieces } = decoded.data;

            if (decoded) {
                let customercode_val = '0';
                if (customer_code && customer_code != "" && customer_code != "0") {
                    customercode_val = customer_code ? '\'' + customer_code.split(',').join('\',\'') + '\'' : ''
                }
                const final_array = []
                // ||' - '||  COALESCE(b.mobile_no,'')
                // for (let k = 0; k < item_array.length; k++) {
                // const dispatchedList = await client.query(`SELECT to_char(dispatch_date, 'DD-MM-YYYY') AS dispatch_date,dispatch_no,a.customer_code,COALESCE(b.customer_name,'') 
                // AS customer_name,a.size_id,c.qr_code,a.dispatch_set, a.dispatch_pieces
                //  FROM tbl_dispatch_details AS a INNER JOIN  tbl_customer AS b ON a.customer_code = b.customer_code INNER JOIN tbl_item_sizes AS c ON a.size_id = c.size_id  WHERE a.size_id = ${item_array[k].size_id} AND a.customer_code = ${customercode_val}  order by a.created_at desc limit 25`);                   
                // const dispatchedList = await client.query(`SELECT to_char(dispatch_date, 'DD-MM-YYYY') AS dispatch_date,dispatch_no,a.customer_code,COALESCE(b.customer_name,'') 
                // AS customer_name,a.size_id,c.qr_code,a.dispatch_set, a.dispatch_pieces,'no' AS checked
                //  FROM tbl_dispatch_details AS a INNER JOIN  tbl_customer AS b ON a.customer_code = b.customer_code INNER JOIN tbl_item_sizes AS c ON a.size_id = c.size_id  WHERE a.size_id = ${size_id} AND a.customer_code = ${customercode_val}  order by a.created_at desc limit 25`);
               
                const dispatchedList = await client.query(`SELECT DISTINCT * FROM (SELECT to_char(dispatch_date, 'DD-MM-YYYY') AS dispatch_date,dispatch_no,a.customer_code,COALESCE(b.customer_name,'') AS customer_name,a.size_id,c.qr_code,a.dispatch_set, a.dispatch_pieces,'no' AS checked,a.autonum FROM tbl_dispatch_details AS a INNER JOIN  tbl_customer AS b ON a.customer_code = b.customer_code INNER JOIN tbl_item_sizes AS c ON a.size_id = c.size_id WHERE a.status_flag = 1   AND a.size_id = ${size_id} AND a.customer_code =  ${customercode_val} AND dispatch_no NOT IN (SELECT dispatch_no FROM tbl_goods_return_dispatch  WHERE status_flag = 1 AND size_id = ${size_id} AND customer_code =  ${customercode_val}) ORDER BY a.created_at DESC LIMIT 25) AS DERV2 
                UNION ALL
                SELECT DISTINCT * FROM (SELECT to_char(dispatch_date, 'DD-MM-YYYY') AS dispatch_date,a.dispatch_no,     a.customer_code,COALESCE(b.customer_name,'') AS customer_name,a.size_id,c.qr_code,(SELECT      COALESCE(dispatch_set,0) - COALESCE(goods_return_set,0) AS dispatch_set FROM                  tbl_goods_return_dispatch WHERE status_flag = 1 AND size_id = ${size_id} AND customer_code = ${customercode_val} AND dispatch_no = a.dispatch_no ORDER BY autonum DESC LIMIT 1) AS dispatch_set,( SELECT COALESCE(dispatch_pieces,0) - COALESCE(goods_return_pieces,0) AS dispatch_set FROM tbl_goods_return_dispatch WHERE status_flag = 1 AND size_id = ${size_id} AND customer_code = ${customercode_val} AND dispatch_no = a.dispatch_no ORDER BY autonum DESC LIMIT 1) AS dispatch_pieces,'no' AS checked,a.autonum FROM tbl_dispatch_details AS a INNER JOIN  tbl_customer AS b ON a.customer_code = b.customer_code INNER JOIN tbl_item_sizes AS c ON a.size_id = c.size_id INNER JOIN tbl_goods_return_dispatch AS d on a.dispatch_no = d.dispatch_no WHERE a.status_flag = 1 AND d.status_flag = 1 AND a.size_id = ${size_id} AND a.customer_code = ${customercode_val} ORDER BY a.created_at DESC LIMIT 25) AS DERV  WHERE dispatch_set > 0 ORDER BY autonum DESC`);
                //AND status_flag = 1                   
                if (client) {
                    client.end();
                }
                let dispatchedArray = dispatchedList && dispatchedList.rows ? dispatchedList.rows : [];
                if (dispatchedArray.length > 0) {
                    // let set = Number(item_array[k].goods_return_set)
                    // let pieces = Number(item_array[k].goods_return_pieces)
                    let set = Number(goods_return_set)
                    let pieces = Number(goods_return_pieces)
                    let dispatch_set = 0;
                    //  let dispatch_no = ''      
                    let count = 0;               
                    for (let i = 0; i < dispatchedArray.length; i++) {
                        count = count + 1
                        dispatch_set = dispatch_set + Number(dispatchedArray[i].dispatch_set)
                        set = set - Number(dispatchedArray[i].dispatch_set)
                        pieces = pieces - Number(dispatchedArray[i].dispatch_pieces)

                        dispatchedArray[i].checked = 'yes'
                        dispatchedArray[i].goods_return_set = set >= 0 ? dispatchedArray[i].dispatch_set : dispatchedArray[i].dispatch_set - Math.abs(set)
                        dispatchedArray[i].goods_return_pieces = pieces >= 0 ? dispatchedArray[i].dispatch_pieces : dispatchedArray[i].dispatch_pieces - Math.abs(pieces)
                        dispatch_no = dispatchedArray[i].dispatch_no
                        final_array.push(dispatchedArray[i])
                        if ((set <= 0 && Number(dispatch_set) < Number(goods_return_set)) || (dispatchedArray.length == count && Number(dispatch_set) < Number(goods_return_set))) {
                            responseData = { "dispatchedArray": [], "Message": "Goods return sets should be less than or equal to " + dispatch_set }
                            return responseData;
                        }
                        if (set <= 0) {
                            break
                        }
                    }
                    dispatchedArray.forEach(function (item, index) {
                        if (item.dispatch_no === dispatch_no) {
                            if (index < dispatchedArray.length - 1) {
                                dispatchedArray[index + 1].checked = 'no'
                                final_array.push(dispatchedArray[index + 1])
                                if (dispatchedArray[index + 2]) {
                                    dispatchedArray[index + 2].checked = 'no'
                                    final_array.push(dispatchedArray[index + 2])
                                }
                            }
                        }
                    })
                    responseData = { "dispatchedArray": final_array, "Message": "" }
                } else {
                    responseData = { "dispatchedArray": [], "Message": "Dispatch not available for this item" }
                }

                // }
                
               
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

module.exports.saveGoodsReturnJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
module.exports.saveGoodsReturn = async (req) => {
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
            const { user_id, customer_code, item_details, dispatch_details, goodsreturn_date } = decoded.data;
            if (decoded) {
                if (item_details && item_details.length > 0) {
                    const id_max = await client.query(`select coalesce (max(goods_return_id),0) + 1 AS goods_return_id FROM tbl_goods_return`)
                    var goods_return_id = id_max && id_max.rows[0].goods_return_id;
                    const goods_return_number = await client.query(`select   'G'||case when ` + user_id + ` <= 99 then  (select LPAD(` + user_id + `::text,2,'0'))    else (` + user_id + ` ::text) end  || '-' || case when coalesce(max(goods_return_id),0) + 1 <= 9999 then  (select LPAD((SELECT coalesce(max(goods_return_id),0) + 1 from tbl_goods_return)::text,4,'0')) else (select (SELECT coalesce(max(goods_return_id),0) + 1 from tbl_goods_return  )::text)
                    end AS goods_return_id from tbl_goods_return `)
                    var goods_return_no = goods_return_number && goods_return_number.rows[0].goods_return_id;

                    for (let i = 0; i < item_details.length; i++) {
                        // let total_set =  await client.query(`SELECT total_set::INTEGER FROM tbl_item_sizes where size_id = `+dispatch_details[j].size_id+``)
                        // var total_pieces = total_set && total_set.rows[0].total_set;
                        // total_pieces = total_pieces * Number(dispatch_details[j].dispatch_qty)
                        var makerid = await commonService.insertLogs(user_id, "Insert Goods return");
                        await client.query(`INSERT INTO tbl_goods_return(
                                goods_return_id, goods_return_no, customer_code, size_id, user_id,
                               created_at, goods_return_date, status_flag, goods_return_set, goods_return_pieces,maker_id)
                               VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7, $8, $9,$10) `, [goods_return_id, goods_return_no, customer_code, item_details[i].size_id, user_id, goodsreturn_date, 1, item_details[i].goods_return_set, item_details[i].goods_return_pieces, makerid]);
                        for (let j = 0; j < item_details[i].dispatchedArray.length; j++) {
                            if (item_details[i].size_id == item_details[i].dispatchedArray[j].size_id) {
                                if (item_details[i].dispatchedArray[j].checked == 'yes') {
                                    await client.query(`INSERT INTO tbl_goods_return_dispatch(
                                    goods_return_id, goods_return_no, size_id, 
                                    goods_return_set, goods_return_pieces, dispatch_set, dispatch_pieces, created_at, goods_return_date,dispatch_no,customer_code, status_flag, maker_id)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8,$9,$10, 1, $11) `, [goods_return_id, goods_return_no, item_details[i].dispatchedArray[j].size_id, item_details[i].dispatchedArray[j].goods_return_set, item_details[i].dispatchedArray[j].goods_return_pieces, item_details[i].dispatchedArray[j].dispatch_set, item_details[i].dispatchedArray[j].dispatch_pieces, goodsreturn_date, item_details[i].dispatchedArray[j].dispatch_no, customer_code, makerid]);
                                }
                            }
                        }

                    }
                }

                if (client) {
                    client.end();
                }
                responseData = { "message": "Goods returned successfully", "statusFlag": 1 };
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

module.exports.getGRListJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
module.exports.getGRList = async (req) => {
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
            const { user_id, goods_return_from_date, goods_return_to_date, limit, offset, process, customer_code, size_id } = decoded.data;
            let goods_return_date = '1=1';
            let item_code = '1=1';
            let customercode = '1=1';
            let get_limit = '';
            if (decoded) {
                if (goods_return_from_date && goods_return_to_date) {
                    goods_return_date = `goods_return_date between '` + goods_return_from_date + `' and '` + goods_return_to_date + `' `;
                }
                if (size_id && size_id != "" && size_id != "0") {
                    const item_code_val = size_id ? '\'' + size_id.split(',').join('\',\'') + '\'' : ''
                    item_code = `a.size_id in (` + item_code_val + `) `
                }
                if (customer_code && customer_code != "" && customer_code != "0") {
                    const customer_code_val = customer_code ? '\'' + customer_code.split(',').join('\',\'') + '\'' : ''
                    customercode = `a.customer_code in (` + customer_code_val + `) `
                }
                const overallTotal = await client.query(`SELECT sum(a.goods_return_set) AS goods_return_set,sum(a.goods_return_pieces) AS goods_return_pieces FROM tbl_goods_return AS a where status_flag = 1 AND ${goods_return_date} AND ${item_code} AND ${customercode}`);
                var overallTotal_sets = overallTotal && overallTotal.rows[0].goods_return_set ? overallTotal.rows[0].goods_return_set : 0
                var overallTotal_Pieces = overallTotal && overallTotal.rows[0].goods_return_pieces ? overallTotal.rows[0].goods_return_pieces : 0

                const goods_return_Widget = await client.query(`SELECT item_name, item_id, sum(a.goods_return_set) AS goods_return_set,sum(a.goods_return_pieces) AS goods_return_pieces
                FROM tbl_goods_return AS a INNER JOIN tbl_item_sizes AS b on b.size_id=a.size_id 
                INNER JOIN tbl_item_management AS c ON b.trans_no=c.trans_no INNER JOIN tbl_def_item AS d ON c.item_code = d.item_id  WHERE a.status_flag = 1 AND ${goods_return_date} AND ${item_code} AND ${customercode} AND status_flag = 1 GROUP BY item_name, item_id`)

                var goodsReturnWidget = goods_return_Widget && goods_return_Widget.rows ? goods_return_Widget.rows : []

                if (process != 'excel') {
                    get_limit = `LIMIT ${limit} OFFSET ${offset}`;
                }
                if (process == 'excel') {
                    const goodsReturnResult = await client.query(`SELECT a.goods_return_id,a.goods_return_no,a.customer_code,a.goods_return_date,sum(a.goods_return_set) AS goods_return_set,sum(a.goods_return_pieces) AS goods_return_pieces,c.city,c.customer_name,c.mobile_no,string_agg(b.qr_code, ',') AS qr_code FROM tbl_goods_return AS a INNER JOIN tbl_item_sizes AS b on a.size_id = b.size_id INNER JOIN tbl_customer AS c ON a.customer_code = c.customer_code WHERE ${goods_return_date} AND ${item_code} AND ${customercode} AND a.status_flag = 1  GROUP BY a.goods_return_id,a.goods_return_no,a.customer_code,a.goods_return_date,c.city,c.customer_name,c.mobile_no ORDER BY goods_return_id DESC`);
                    let goods_Return_Array = goodsReturnResult && goodsReturnResult.rows ? goodsReturnResult.rows : [];
                    const company_Result = await client.query(`SELECT * from tbl_print_setting`);
                    let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];
                    responseData = { "goods_return_array": goods_Return_Array, "Company_Array": Company_Array, "overallTotal_sets": overallTotal_sets, "overallTotal_Pieces": overallTotal_Pieces, "goodsReturnWidget": goodsReturnWidget, Message: '' }
                } else {
                    const goodsReturnTotalResult = await client.query(`SELECT a.goods_return_id,a.goods_return_no,a.customer_code,a.goods_return_date,sum(a.goods_return_set) AS goods_return_set,sum(a.goods_return_pieces) AS goods_return_pieces,c.city,c.customer_name,c.mobile_no FROM tbl_goods_return AS a INNER JOIN tbl_customer AS c ON a.customer_code = c.customer_code WHERE ${goods_return_date} AND ${item_code} AND ${customercode} AND a.status_flag = 1  GROUP BY  a.goods_return_id,a.goods_return_no,a.customer_code,a.goods_return_date,c.city,c.customer_name,c.mobile_no ORDER BY goods_return_id DESC`);
                    let goods_Return_total = goodsReturnTotalResult && goodsReturnTotalResult.rowCount ? goodsReturnTotalResult.rowCount : 0;
                    const goodsReturnResult = await client.query(`SELECT a.goods_return_id,a.goods_return_no,a.customer_code,a.goods_return_date,sum(a.goods_return_set) AS goods_return_set,sum(a.goods_return_pieces) AS goods_return_pieces,c.city,c.customer_name,c.mobile_no FROM tbl_goods_return AS a INNER JOIN tbl_customer AS c ON a.customer_code = c.customer_code WHERE ${goods_return_date} AND ${item_code} AND ${customercode} AND a.status_flag = 1  GROUP BY a.goods_return_id,a.goods_return_no,a.customer_code,a.goods_return_date,c.city,c.customer_name,c.mobile_no ORDER BY goods_return_id DESC ${get_limit}`);

                    let goods_Return_Array = goodsReturnResult && goodsReturnResult.rows ? goodsReturnResult.rows : [];
                    let result = [];
                    if (goods_Return_Array.length > 0) {
                        for (let i = 0; i < goods_Return_Array.length; i++) {
                            const item_Result = await client.query(`SELECT a.goods_return_id,a.goods_return_no,a.customer_code,a.goods_return_date,sum(a.goods_return_set) AS goods_return_set,sum(a.goods_return_pieces) AS goods_return_pieces,c.qr_code FROM tbl_goods_return_dispatch AS a INNER JOIN tbl_item_sizes AS c ON 
                            a.size_id = c.size_id WHERE a.status_flag = 1 AND ${item_code} AND a.goods_return_id = $1 AND a.customer_code = $2  GROUP BY  a.goods_return_id,a.goods_return_no,a.customer_code,a.goods_return_date,c.qr_code,a.size_id`, [goods_Return_Array[i].goods_return_id, goods_Return_Array[i].customer_code]);
                            let item_Array = item_Result && item_Result.rows ? item_Result.rows : [];
                            let obj = goods_Return_Array[i]
                            obj['ItemArray'] = item_Array
                            result.push(obj)
                        }
                    }
                    responseData = { "goods_return_array": result, "goods_return_total": goods_Return_total, "overallTotal_sets": overallTotal_sets, "overallTotal_Pieces": overallTotal_Pieces, "goodsReturnWidget": goodsReturnWidget, Message: '' }
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


module.exports.getGRFilterListJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
module.exports.getGRFilterList = async (req) => {
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
            const { user_id } = decoded.data;
            if (decoded) {
                const CustomerResult = await client.query(`SELECT 'All' AS label, '0' AS value
                union all
                SELECT DISTINCT COALESCE(b.customer_name,'') ||' - '||  COALESCE(b.mobile_no,'') AS label,b.customer_code AS value FROM tbl_goods_return AS a INNER JOIN tbl_customer AS b ON a.customer_code = b.customer_code WHERE status_flag = 1`);
                const ItemResult = await client.query(`SELECT 0 AS value, 'All' AS label
                union all 
                SELECT DISTINCT b.size_id AS value,b.qr_code AS label FROM tbl_goods_return AS a INNER JOIN tbl_item_sizes AS b ON a.size_id = b.size_id WHERE status_flag = 1`);

                if (client) {
                    client.end();
                }

                let CustomerList = CustomerResult && CustomerResult.rows ? CustomerResult.rows : [];
                let ItemList = ItemResult && ItemResult.rows ? ItemResult.rows : [];
                responseData = { "CustomerList": CustomerList, "ItemList": ItemList, "Message": "" }
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
module.exports.cancelGoodsReturnJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//cancel dispatch
module.exports.cancelGoodsReturn = async (req) => {
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
            const { user_id, goods_return_id } = decoded.data;
            if (decoded) {
                const taking_Count = await client.query(`select count(*) as count FROM tbl_goods_return where goods_return_id = $1`, [goods_return_id])
                var count_Check = taking_Count && taking_Count.rows[0].count;
                if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                    var maker_id = await commonService.insertLogs(user_id, "Cancel Goods Return");

                    await client.query(`UPDATE tbl_goods_return_dispatch SET status_flag=$1 ,maker_id = $2 WHERE goods_return_id = $3 `, [2, maker_id, goods_return_id]);
                    const delete_result = await client.query(`UPDATE tbl_goods_return SET status_flag=$1 ,maker_id = $2 WHERE goods_return_id = $3  `, [2, maker_id, goods_return_id]);

                    if (client) {
                        client.end();
                    }
                    let deletecode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
                    if (deletecode > 0) {
                        responseData = { "message": constants.userMessage.CANCEL_SUCCESS, "statusFlag": 1 }
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