/****************************
 File    : EmployeeService.js
 Author  : Prabhavathy
 Date    : 5-09-2022
 Purpose : Employee Master Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');

//create Personal jwt 
module.exports.savePersonalDetailsjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//create Personal service
module.exports.savePersonalDetails = async (req) => {
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
            const { employee_id, employee_name, employee_code, user_id, marital_id, spouse_name, gender_id, group_id, father_name, mother_name, dob, status_id } = decoded.data;
            if (decoded) {
                const exit_count = await client.query(`select count(*) as count FROM tbl_employee_details where lower(employee_name) = lower('` + employee_name + `') and employee_id != ` + employee_id)
                var exit_check = exit_count && exit_count.rows[0].count
                if (exit_check > 0) {
                    return response = { "message": constants.userMessage.EMPLOYEE_EXISTS, "employee_id": 0, "errorstatus": 2 };
                }
                else {
                    const employee_count = await client.query(`select count(*) as count FROM tbl_employee_details where employee_code = ` + employee_code + ` and employee_id != ` + employee_id)
                    var employee_check = employee_count && employee_count.rows[0].count
                    if (employee_check > 0) {
                        return response = { "message": constants.userMessage.EMPLOYEECODE_EXISTS, "employee_id": 0, "errorstatus": 2 };
                    }
                    else {
                        if (employee_id == 0) {
                            var makerid = await commonService.insertLogs(user_id, "Insert Employee");
                            const max = await client.query(`select coalesce(max(employee_id),0) + 1 as mr FROM tbl_employee_details`)
                            var maxemployee = max && max.rows[0].mr;
                            const result = await client.query(`INSERT INTO tbl_employee_details (employee_id,employee_name,employee_code,marital_id,dob,mother_name,father_name,group_id,gender_id,spouse_name,user_id,maker_id,status_id,created_date) values ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,CURRENT_TIMESTAMP) `, [maxemployee, employee_name, employee_code, marital_id, dob, mother_name, father_name, group_id, gender_id, spouse_name, user_id, makerid, status_id]);
                            if (client) {
                                client.end();
                            }
                            let create_code = result && result.rowCount ? result.rowCount : 0;
                            if (create_code == 1) {
                                return response = { "message": constants.userMessage.USER_CREATED, "employee_id": maxemployee, "errorstatus": 1 };
                            }
                            else { return '' }
                        }
                        else {
                            var makerid = await commonService.insertLogs(user_id, "Update Employee");
                            const count = await client.query(`select count(*) as count FROM tbl_employee_details where employee_id =` + employee_id)
                            var count_Check = count && count.rows[0].count
                            var status_check = 0
                            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                                if (status_id === 2) {
                                    const status_count = await client.query(`select count(*) as count FROM tbl_job_details where  employee_id = ` + employee_id + ` and salary_status_id = 0 `)
                                     status_check = status_count && status_count.rows[0].count
                                }

                                if (status_check > 0) {
                                    return response = { "message": constants.userMessage.EMPLOYEE_DELETE, "employee_id": 0, "errorstatus": 2 };
                                }
                                else {
                                    const update_result = await client.query(`UPDATE "tbl_employee_details" set employee_name=$1,employee_code=$2,marital_id=$3,dob=$4,mother_name=$5,father_name=$6,group_id=$7,gender_id=$8,spouse_name=$9,user_id=$10,maker_id=$11,status_id=$12,updated_date=CURRENT_TIMESTAMP where employee_id = $13 `, [employee_name, employee_code, marital_id, dob, mother_name, father_name, group_id, gender_id, spouse_name, user_id, makerid, status_id, employee_id]);
    
                                    if (client) {
                                        client.end();
                                    }
                                    let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                                    if (update_code == 1) {
                                        return response = { "message": constants.userMessage.USER_UPDATED, "employee_id": employee_id, "errorstatus": 1 };
                                    }
                                    else { return '' }
                                }
                            }
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


//create Contact jwt 
module.exports.saveContactDetailsjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//create Contact service
module.exports.saveContactDetails = async (req) => {
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
            const { employee_id, contact_person_name, contact_number, addressline1, addressline2, state_id, email_id, city, mobile_number, pincode, user_id } = decoded.data;
            if (decoded) {
                const count = await client.query(`select count(*) as count FROM tbl_contact_details where employee_id =` + employee_id)
                var count_Check = count && count.rows[0].count
                if (count_Check == 0) {
                    const result = await client.query(`INSERT INTO tbl_contact_details (employee_id,contact_person_name,contact_number,addressline1,addressline2,state_id,email_id,city,mobile_number,pincode,user_id,created_date) values ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP) `, [employee_id, contact_person_name, contact_number, addressline1, addressline2, state_id, email_id, city, mobile_number, pincode, user_id]);
                    if (client) {
                        client.end();
                    }
                    let create_code = result && result.rowCount ? result.rowCount : 0;
                    if (create_code == 1) {
                        return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1 };
                    }
                    else { return '' }
                }
                else {
                    const update_result = await client.query(`UPDATE "tbl_contact_details" set user_id=$1,contact_person_name=$2,contact_number=$3,addressline1=$4,addressline2=$5,state_id=$6,email_id=$7,city=$8,mobile_number=$9,pincode=$10,updated_date=CURRENT_TIMESTAMP where employee_id = $11 `, [user_id, contact_person_name, contact_number, addressline1, addressline2, state_id, email_id, city, mobile_number, pincode, employee_id]);

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


//create Bank jwt 
module.exports.SaveBankDetailsjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}

//create Bank service
module.exports.SaveBankDetails = async (req) => {
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
            const { employee_id, pan_number, aadhar_number, ifsc_number, name_bank_account, bank_name, branch_name, account_number, user_id } = decoded.data;
            if (decoded) {
                const count = await client.query(`select count(*) as count FROM tbl_bank_details where employee_id =` + employee_id)
                var count_Check = count && count.rows[0].count
                if (count_Check == 0) {
                    const result = await client.query(`INSERT INTO tbl_bank_details (employee_id,pan_number,aadhar_number,ifsc_number,name_bank_account,bank_name,branch_name,account_number,user_id,created_date) values ($1, $2, $3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP) `, [employee_id, pan_number, aadhar_number, ifsc_number, name_bank_account, bank_name, branch_name, account_number, user_id]);
                    if (client) {
                        client.end();
                    }
                    let create_code = result && result.rowCount ? result.rowCount : 0;
                    if (create_code == 1) {
                        return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1 };
                    }
                    else { return '' }
                }
                else {
                    const update_result = await client.query(`UPDATE "tbl_bank_details" set pan_number=$1,aadhar_number=$2,ifsc_number=$3,name_bank_account=$4,bank_name=$5,branch_name=$6,account_number=$7,user_id=$8,updated_date=CURRENT_TIMESTAMP where employee_id = $9 `, [pan_number, aadhar_number, ifsc_number, name_bank_account, bank_name, branch_name, account_number, user_id, employee_id]);

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

//create HR jwt 
module.exports.SaveHrDetailsjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}

//create HR service
module.exports.SaveHrDetails = async (req) => {
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
            const { employee_id, category_id, designation_id, department_id, joining_date, user_id } = decoded.data;
            if (decoded) {
                const count = await client.query(`select count(*) as count FROM tbl_hr_details where employee_id =` + employee_id)
                var count_Check = count && count.rows[0].count
                if (count_Check == 0) {
                    const result = await client.query(`INSERT INTO tbl_hr_details (employee_id,category_id,designation_id,department_id,joining_date,user_id,created_date) values ($1, $2, $3,$4,$5,$6,CURRENT_TIMESTAMP) `, [employee_id, category_id, designation_id, department_id, joining_date, user_id]);
                    if (client) {
                        client.end();
                    }
                    let create_code = result && result.rowCount ? result.rowCount : 0;
                    if (create_code == 1) {
                        return response = { "message": constants.userMessage.USER_CREATED, "finalFlag": 1 };
                    }
                    else { return '' }
                }
                else {
                    const update_result = await client.query(`UPDATE "tbl_hr_details" set category_id=$1,designation_id=$2,department_id=$3,joining_date=$4,user_id=$5,updated_date=CURRENT_TIMESTAMP where employee_id = $6 `, [category_id, designation_id, department_id, joining_date, user_id, employee_id]);

                    if (client) {
                        client.end();
                    }
                    let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                    if (update_code == 1) {
                        return response = { "message": constants.userMessage.USER_UPDATED, "finalFlag": 1 };
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

//create jwt 
module.exports.employeeListjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}

//create Employee LIST
module.exports.employeeList = async (req) => {
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
            const { status_id, category_id, designation_id, department_id } = decoded.data;
            var status = '', category = '', designation = '', department = '';
            if (decoded) {
                if (status_id == 0) {
                    status = ' 1=1'
                }
                else {
                    status = ` a.status_id = ` + status_id
                }
                if (category_id == 0) {
                    category = ' 1=1'
                }
                else {
                    category = ` c.category_id = ` + category_id
                }
                if (designation_id == 0) {
                    designation = ' 1=1'
                }
                else {
                    designation = ` c.designation_id = ` + designation_id
                }
                if (department_id == 0) {
                    department = ' 1=1'
                }
                else {
                    department = ` c.department_id = ` + department_id
                }
                const employee_Result = await client.query(`select a.employee_id,a.employee_code,a.employee_name,b.email_id,b.mobile_number,c.designation_id,c.department_id,d.designation_name,e.department_name,a.status_id,f.status_name,k.machine_no from tbl_employee_details as a left join  tbl_contact_details as b on a.employee_id = b.employee_id left join tbl_hr_details as c on a.employee_id = c.employee_id  left join tbl_designation as d on c.designation_id = d.designation_id left join tbl_department as e on c.department_id = e.department_id inner join tbl_def_status as f on a.status_id = f.status_id left join tbl_machine as k on a.employee_id = k.employee_id   where ` + status + ` and ` + category + ` and ` + designation + ` and ` + department + ` order by a.employee_id desc`);
                if (client) {
                    client.end();
                }
                let Employee_Array = employee_Result && employee_Result.rows ? employee_Result.rows : [];
                responseData = { "EmployeeArray": Employee_Array }
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



//Edit jwt 
module.exports.editEmployeejwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}

//Edit Employee LIST
module.exports.editEmployee = async (req) => {
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
            const { employee_id } = decoded.data;
            if (decoded) {
                const personal_Result = await client.query(`
                select a.employee_id,a.employee_name,a.employee_code,a.spouse_name,a.mother_name,a.father_name,a.dob,
                a.marital_id,c.marital_name,a.user_id,a.gender_id ,b.gender_name,a.group_id,d.group_name,a.status_id,e.status_name
                from tbl_employee_details as a  inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_marital_status as c on a.marital_id = c.marital_id inner join tbl_def_blood_group as d on a.group_id = d.group_id inner join tbl_def_status  as e on a.status_id = e.status_id where a.employee_id = ` + employee_id);

                const contact_Result = await client.query(`select a.contact_person_name,a.contact_number,a.addressline1,a.addressline2,a.state_id,b.state_name,a.email_id,a.city,a.mobile_number,a.pincode,a.user_id from tbl_contact_details as a inner join tbl_def_state as b on a.state_id = b.state_id where a.employee_id =` + employee_id)

                const bank_Result = await client.query(`select a.pan_number,a.ifsc_number,a.name_bank_account,a.bank_name,a.branch_name,a.aadhar_number,a.account_number from tbl_bank_details as a where a.employee_id =` + employee_id)

                const hr_Result = await client.query(`select a.category_id,d.category_name,a.designation_id,a.department_id,b.designation_name,c.department_name,a.joining_date from tbl_hr_details as a inner join tbl_designation as b on a.designation_id = b.designation_id inner join tbl_department as c on a.department_id = c.department_id inner  join tbl_def_employee_category as d on a.category_id = d.category_id where a.employee_id =` + employee_id)

                if (client) {
                    client.end();
                }

                let Personal_Array = personal_Result && personal_Result.rows ? personal_Result.rows : [];
                let Contact_Array = contact_Result && contact_Result.rows ? contact_Result.rows : [];
                let Bank_Array = bank_Result && bank_Result.rows ? bank_Result.rows : [];
                let Hr_Array = hr_Result && hr_Result.rows ? hr_Result.rows : [];

                responseData = { "PersonalArray": Personal_Array, "ContactArray": Contact_Array, "BankArray": Bank_Array, "HrArray": Hr_Array }
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

//Delete Employee jwt 
module.exports.deleteEmployeejwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}

//Delete Employee service
module.exports.deleteEmployee = async (req) => {
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
            const { user_id, employee_id } = decoded.data;
            if (decoded) {
                const employee_Count = await client.query(`select count(*) as count FROM tbl_job_details where employee_id =` + employee_id)
                var employee_Check = employee_Count && employee_Count.rows[0].count;
                if (employee_Check == 0 || employee_Check == '0') {
                    await commonService.insertLogs(user_id, "Delete Employee");
                    const delete_result = await client.query(`DELETE FROM tbl_employee_details where employee_id = $1 `, [employee_id]);
                    const bank_result = await client.query(`DELETE FROM tbl_bank_details where employee_id = $1 `, [employee_id]);
                    const contact_result = await client.query(`DELETE FROM tbl_contact_details where employee_id = $1 `, [employee_id]);
                    const hr_result = await client.query(`DELETE FROM tbl_hr_details where employee_id = $1 `, [employee_id]);
                    if (client) {
                        client.end();
                    }
                    let deletecode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
                    let bankcode = bank_result && bank_result.rowCount ? bank_result.rowCount : 0;
                    let contactcode = contact_result && contact_result.rowCount ? contact_result.rowCount : 0;
                    let hrcode = hr_result && hr_result.rowCount ? hr_result.rowCount : 0;
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
                else {
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