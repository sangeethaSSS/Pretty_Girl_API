/****************************
 File    : itemMasterService.js
 Author  : Prabhavathy
 Date    : 1-09-2022
 Purpose : itemMaster Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('./commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');

//getCustomersJwt 
module.exports.getCustomersJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//getCustomersJwt
module.exports.getCustomers = async (req) => {
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
            const { state, customer_name, user_id, status_id, agent_id, customer_code } = decoded.data;
            let customerName = '1=1', statevalue = `1=1`, status = '1=1', agentid = '1=1',customercode='1=1';
            if (customer_name) {
                customerName = 'Lower("customer_name") like '.concat("'%", customer_name.replace(/'/g, "''").toLowerCase(), "%'");
            }
            if (state) {
                statevalue = 'state = ' + state
            }
            if (status_id) {
                status = 'status_code = ' + status_id
            }
            if(agent_id) {
                agentid =  'agent_code = ' + agent_id
            }
            if(customer_code && customer_code != "0") {
                customercode = 'customer_code =' + '\'' + customer_code + '\''
            }
            const exeQuery = await client.query(`select customer_name, contact_person, mobile_no, alternative_mobile_no,door_no, street, area, city, state, country, pincode, email_id, gstin_no, status_code,customer_code, type, maxrefno, transport_name,agent_code,transport_contact_no, transport_location, user_id,transport_contact_person,(select user_name from tbl_user where user_id = (select user_id from "tbl_userlog" where autonum = a.maker_id limit 1) limit 1) as employeename,  (select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from "tbl_userlog" where autonum = a.maker_id limit 1) as createddate,(select status_name from "tbl_def_status" where "status_id" = "status_code") as status_name,(select state_name from "tbl_def_state" where "state_id" = "state") as "state_name", coalesce((select agent_name from tbl_agent where agent_code = a.agent_code),'') as agent_name from "tbl_customer" as a where ` +customercode+ ` and ` + statevalue + ` and ` + customerName + ` and ` + status + ` and ` + agentid + ` order by created_date desc`);

            const company_Result = await client.query(`SELECT * from tbl_print_setting`);
            let Company_Array = company_Result && company_Result.rows ? company_Result.rows : []; 
            if (client) {
                client.end();
            }

            response = { customerList: exeQuery?.rows ? exeQuery?.rows : [], Company_Array: Company_Array };

            return response;
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
module.exports.saveCustomerManagementjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//create Item service
module.exports.saveCustomerManagement = async (req) => {
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
            const { customer_name, contact_person, mobile_no, alternative_mobile_no,
                door_no, street, area, city, state, country, pincode, email_id, gstin_no, status_code, type,
                transport_name, transport_contact_no, transport_location, user_id, agent_code, transport_contact_person } = decoded.data;
               if (decoded) {
                const exit_count = await client.query(`select count(*) as count FROM tbl_customer where lower(customer_name) = lower('` + customer_name.replace(/'/g, "''") + `') and lower(city) = lower('` + city + `') and lower(customer_code) != lower($1)`, [customer_code])
                var exit_check = exit_count && exit_count.rows[0].count
                if (exit_check > 0) {
                    return response = { "message": constants.userMessage.CUSTOMER_DUPLICATION, "statusFlag": 2 };
                }
                else {
                const id_max = await client.query(`select coalesce (max(maxrefno),0) + 1 as mr FROM tbl_customer where type = 'Portal'`)
                var maxrefno = id_max && id_max.rows[0].mr;
                var makerid = await commonService.insertLogs(user_id, "Insert Customer Management");
                var customer_code = 'P' + maxrefno;
                // if(gstin_no) {
                //     const check_gstin = await client.query(`SELECT count("gstin_no") as count from "tbl_customer" where "gstin_no" = $1`, 
                //     [gstin_no]);                
                //     var gstin_Check = check_gstin && check_gstin.rows[0].count;
                //     if(Number(gstin_Check) > 0) {
                //         return responseData = { "message": constants.userMessage.GSTIN_ALREADY_USED, "statusFlag": 2 };
                //         // throw new Error(constants.userMessage.GSTIN_ALREADY_USED);
                //     }
                // }

                const country_res = await client.query(`select "country_id" from "tbl_def_country" where "country" = 'India'`)
                var country_id = country_res && country_res.rows[0].country_id;


                const exeUserQuerys = await client.query(`INSERT INTO public.tbl_customer(
                    customer_name, contact_person, mobile_no, alternative_mobile_no,
                    door_no, street, area, city, state, country, pincode, email_id, gstin_no, status_code, 
                    customer_code, type, maxrefno, maker_id,transport_name, transport_contact_no, transport_location, user_id,transport_contact_person,agent_code,created_date)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22,$23,$24, CURRENT_TIMESTAMP)
                    RETURNING customer_code`,
                    [customer_name.replace(/'/g, "'"), contact_person.replace(/'/g, "'"), mobile_no, alternative_mobile_no, door_no, street.replace(/'/g, "'"), area.replace(/'/g, "'"), city.replace(/'/g, "'"),
                        state, country_id, pincode, email_id.replace(/'/g, "'"), gstin_no, status_code, customer_code, type, maxrefno,
                        makerid, transport_name.replace(/'/g, "'"), transport_contact_no, transport_location.replace(/'/g, "'"), user_id, transport_contact_person.replace(/'/g, "'"), agent_code]);
                return responseData = { "message": 'Customer ' + constants.userMessage.USER_CREATED, "statusFlag": 1, "customer_id": customer_code, "customer_name" : customer_name };
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
module.exports.updateCustomerJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//create Item service
module.exports.updateCustomer = async (req) => {
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
            const { customer_name, contact_person, mobile_no, alternative_mobile_no,
                door_no, street, area, city, state, country, pincode, email_id, gstin_no, status_code,
                transport_name, transport_contact_no, transport_location, user_id, customer_code, status, transport_contact_person, agent_code } = decoded.data;
            if (decoded) {
                
                const exit_count = await client.query(`select count(*) as count FROM tbl_customer where lower(customer_name) = lower('` + customer_name.replace(/'/g, "''") + `') and lower(customer_code) != lower($1)`, [customer_code])                
                var exit_check = exit_count && exit_count.rows[0].count
                if (exit_check > 0) {
                    return response = { "message": constants.userMessage.CUSTOMER_DUPLICATION, "statusFlag": 2 };
                }
                else {                   
                var makerid = await commonService.insertLogs(user_id, "Update Customer Management");
                const exeUserQuerys = await client.query(`UPDATE public.tbl_customer
                SET customer_name=$1, contact_person=$2, mobile_no=$3, alternative_mobile_no=$4, 
                door_no=$5, street=$6, area=$7, city=$8, state=$9, country=$10, pincode=$11, email_id=$12, gstin_no=$13,
                status_code = $14, updated_date=CURRENT_TIMESTAMP, maker_id=$15,  transport_name=$16, transport_contact_no=$17, 
                transport_location=$18,transport_contact_person=$19,agent_code=$20 WHERE customer_code=$21`, [customer_name.replace(/'/g, "'"), contact_person.replace(/'/g, "'"), mobile_no, alternative_mobile_no,
                    door_no, street.replace(/'/g, "'"), area.replace(/'/g, "'"), city.replace(/'/g, "'"), state, country, pincode, email_id.replace(/'/g, "'"), gstin_no, status_code, makerid,
                    transport_name.replace(/'/g, "'"), transport_contact_no, transport_location.replace(/'/g, "'"), transport_contact_person.replace(/'/g, "'"), agent_code, customer_code]);               
                return responseData = { "message": 'Customer ' + constants.userMessage.USER_UPDATED, "statusFlag": 1 };
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


//Delete deleteCustomerJwt
module.exports.deleteCustomerJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}

//Delete deleteCustomer
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
            var responseData = {}
            const decoded = await commonService.jwtVerify(req.jwtToken);
            const { user_id, customer_code } = decoded.data;
            if (decoded) {
                var makerid = await commonService.insertLogs(user_id, "Delete Customer Management");
                const check = await client.query(`SELECT count("customer_code") as count from "tbl_order_taking" where "customer_code" = $1`,
                    [customer_code]);
                var customer_Check = check && check.rows[0].count;
                if (Number(customer_Check) > 0) {
                    // throw new Error(constants.userMessage.CUSTOMER_ALREADY_USED);
                    return responseData = { "message": constants.userMessage.CUSTOMER_ALREADY_USED, "statusFlag": 2 };
                } else {
                    const delete_customer = await client.query(`UPDATE public.tbl_customer
                    SET status_code = $1, updated_date=CURRENT_TIMESTAMP, maker_id=$2  WHERE customer_code=$3`,
                        [constants.customerStatus.cancel, makerid, customer_code]);
                    return responseData = { "message": 'Customer ' + constants.userMessage.USER_DELETED, "statusFlag": 1 };
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

//getCustomerDetailsjwt 
module.exports.getCustomerDetailsJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//getCustomerDetails
module.exports.getCustomerDetails = async (req) => {
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
            const { user_id, customer_code } = decoded.data;

            const exeQuery = await client.query(`select customer_name, contact_person, mobile_no, alternative_mobile_no,
            door_no, street, area, city, state, country, pincode, email_id, gstin_no, status_code, 
            customer_code, type, maxrefno, transport_name,agent_code,
            transport_contact_no, transport_location,agent_code,transport_contact_person,user_id from "tbl_customer" where customer_code = $1`, [customer_code]);


            if (client) {
                client.end();
            }

            response = { customerDetails: exeQuery?.rows && exeQuery?.rows[0] ? exeQuery?.rows[0] : '' };

            return response;
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