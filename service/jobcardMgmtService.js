/****************************
 File    : Job Card Service.js
 Author  : Prabhavathy
 Date    : 14-09-2022
 Purpose : JobCard Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');


//create Jobcard List jwt 
module.exports.jobcardListjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create Jobcard LIST
module.exports.jobcardList = async (req) => {
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
            const { status_id, itemgroup_id, design_id, employee_id, color_id, jobtype_id, from_date, to_date } = decoded.data;
            var status = '', itemgroup = '1=1', design = '', employee = '', color = '', jobtype, datediff;
            if (decoded) {
                if (status_id == 0) {
                    status = ' 1=1'
                }
                else {
                    status = ` a.status_id = ` + status_id
                }
                 
                if (design_id == 0) {
                    design = ' 1=1'
                }
                else {
                    design = ` a.design_id = ` + design_id
                }
                if (employee_id == 0) {
                    employee = ' 1=1'
                }
                else {
                    employee = ` a.employee_id = ` + employee_id
                }
                if (color_id == 0) {
                    color = ' 1=1'
                }
                else {
                    color = ` a.color_id = ` + color_id
                }
                if (jobtype_id == 0) {
                    jobtype = ' 1=1'
                }
                else {
                    jobtype = ` a.jobtype_id = ` + jobtype_id
                }
                if (from_date && to_date) {
                    if (status_id == 3 || status_id == '3') {
                        datediff = `to_char(a.completed_date,'YYYY-MM-DD') :: date BETWEEN `
                        .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
                    } else {
                        datediff = `to_char(a.job_date,'YYYY-MM-DD') :: date BETWEEN `
                        .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
                    }
                    
                }
                let responseTotalData = {};
                let jobcard_Result = '';
                if (status_id === 7) {
                    jobcard_Result = await client.query(`SELECT a.job_date,a.job_id,b.employee_name,a.employee_id,a.machine_id,a.design_id,a.completed_date,coalesce(a.total_pieces,0) as total_pieces,coalesce(a.number_set,0) as number_set,a.jobtype_id,extract(day from CURRENT_DATE::timestamp - a.job_date::date ) as noofdays,c.item_name,d.machine_no,f.qr_code as design_no,g.status_name,a.status_id,'' as itemgroup_id,h.color_name,k.jobtype_name,a.salary_status_id,l.salary_status_name, concat_ws(' - ',f.start_size, f.end_size) as size,coalesce(a.rate,0) as rate,coalesce(a.total_amount,0) as total_amount,false as show_rate,(select trans_no from tbl_item_sizes where size_id=a.design_id) as unique_design_no from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
                    left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
                    inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
                    inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id  where   coalesce(a.rate,0) = 0 and  (a.status_id=3 or a.status_id=4 or a.status_id=5) and a.salary_status_id=0 order by a.design_id desc`);
                      responseTotalData = { "TotalJob": 0, "TotalJobSet": 0, "TotalJobPiece": 0, "PendingJob": 0, "PendingJobSet": 0, "PendingJobPiece": 0, "CompletedJob": 0, "CompletedJobSet": 0, "CompletedJobPiece": 0, "TransferJob": 0, "TransferJobSet": 0, "TransferJobPiece": 0 }
                } else {
                    jobcard_Result = await client.query(`SELECT a.job_date,a.job_id,b.employee_name,a.employee_id,a.machine_id,a.design_id,a.completed_date,coalesce(a.total_pieces,0) as total_pieces,coalesce(a.number_set,0) as number_set,a.jobtype_id,extract(day from CURRENT_DATE::timestamp - a.job_date::date ) as noofdays,c.item_name,d.machine_no,f.qr_code as design_no,g.status_name,a.status_id,'' as itemgroup_id,h.color_name,k.jobtype_name,a.salary_status_id,l.salary_status_name, concat_ws(' - ',f.start_size, f.end_size) as size,coalesce(a.rate,0) as rate,coalesce(a.total_amount,0) as total_amount,false as show_rate,(select trans_no from tbl_item_sizes where size_id=a.design_id) as unique_design_no from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
                left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
                inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
                inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id  where ` + datediff + ` and ` + status + ` and ` + itemgroup + ` and ` + design + ` and ` + employee + ` and ` + color + ` and ` + jobtype + ` order by a.job_id desc`);
                

               
                    let tot_status = status;
                    let pend_status = status;
                    let com_status = status;
                    let trans_status = status;
                    if (status_id == 0) {
                        pend_status = ` a.status_id = 4`;
                        tot_status = ` 1 = 1`;
                        com_status = ` a.status_id = 3`;
                        trans_status = ` a.status_id = 5`;
                    }
                    let completed_date = datediff;
                    // if (status_id == 0) {
                    //     completed_date =  `to_char(a.completed_date,'YYYY-MM-DD') :: date BETWEEN `.concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
                    // }
                    //Get Total set and total piece
                    const totalCount = await client.query(`select count(*) as total_job,sum(coalesce(number_set,0)) as total_set,sum(coalesce(total_pieces,0)) as total_piece from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
                left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
                inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
                inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id  where ` + datediff + ` and ` + tot_status + ` and ` + itemgroup + ` and ` + design + ` and ` + employee + ` and ` + color + ` and ` + jobtype + `  `);
               
                    const pendingCount = await client.query(`select count(*) as pending_job,sum(coalesce(number_set,0)) as total_set,sum(coalesce(total_pieces,0)) as total_piece from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
                left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
                inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
                inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id  where ` + datediff + ` and ` + pend_status + ` and ` + itemgroup + ` and ` + design + ` and ` + employee + ` and ` + color + ` and ` + jobtype + ` `);
                
                    const completedCount = await client.query(`select count(*) as completed_job,sum(coalesce(number_set,0)) as total_set,sum(coalesce(total_pieces,0)) as total_piece  from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
                left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
                inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
                inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id  where ` + completed_date + ` and ` + com_status + ` and ` + itemgroup + ` and ` + design + ` and ` + employee + ` and ` + color + ` and ` + jobtype + ` `);

                    const transferCount = await client.query(`select count(*) as transfer_job,sum(coalesce(number_set,0)) as total_set,sum(coalesce(total_pieces,0)) as total_piece  from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
                left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
                inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
                inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id  where ` + datediff + ` and ` + trans_status + ` and ` + itemgroup + ` and ` + design + ` and ` + employee + ` and ` + color + ` and ` + jobtype + ` `);

                    var Total_Job = totalCount && totalCount.rows[0].total_job ? totalCount.rows[0].total_job : 0
                    var Total_Job_Set = totalCount && totalCount.rows[0].total_set ? totalCount.rows[0].total_set : 0
                    var Total_Job_Pieces = totalCount && totalCount.rows[0].total_piece ? totalCount.rows[0].total_piece : 0
                
                    var Pending_Job = pendingCount && pendingCount.rows[0].pending_job ? pendingCount.rows[0].pending_job : 0
                    var Pending_Job_Set = pendingCount && pendingCount.rows[0].total_set ? pendingCount.rows[0].total_set : 0
                    var Pending_Job_Pieces = pendingCount && pendingCount.rows[0].total_piece ? pendingCount.rows[0].total_piece : 0
                
                    var Completed_Job = completedCount && completedCount.rows[0].completed_job ? completedCount.rows[0].completed_job : 0
                    var Completed_Job_Set = completedCount && completedCount.rows[0].total_set ? completedCount.rows[0].total_set : 0
                    var Completed_Job_Pieces = completedCount && completedCount.rows[0].total_piece ? completedCount.rows[0].total_piece : 0
                
                    var Transfer_Job = transferCount && transferCount.rows[0].transfer_job ? transferCount.rows[0].transfer_job : 0
                    var Transfer_Job_Set = transferCount && transferCount.rows[0].total_set ? transferCount.rows[0].total_set : 0
                    var Transfer_Job_Pieces = transferCount && transferCount.rows[0].total_piece ? transferCount.rows[0].total_piece : 0

                      responseTotalData = { "TotalJob": Total_Job, "TotalJobSet": Total_Job_Set, "TotalJobPiece": Total_Job_Pieces, "PendingJob": Pending_Job, "PendingJobSet": Pending_Job_Set, "PendingJobPiece": Pending_Job_Pieces, "CompletedJob": Completed_Job, "CompletedJobSet": Completed_Job_Set, "CompletedJobPiece": Completed_Job_Pieces, "TransferJob": Transfer_Job, "TransferJobSet": Transfer_Job_Set, "TransferJobPiece": Transfer_Job_Pieces }

                }
                const company_Result = await client.query(`SELECT company_name,city from tbl_company`);

                if (client) {
                    client.end();
                }


                let Jobcard_Array = jobcard_Result && jobcard_Result.rows ? jobcard_Result.rows : [];
                let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];

                responseData = { "JobcardArray": Jobcard_Array,"CompanyArray":Company_Array, "TotalData":responseTotalData }
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

//create Jobcard jwt 
module.exports.saveJobcardjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//create Jobcard service
module.exports.saveJobcard = async (req) => {
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
            const { job_id, job_date, employee_id, machine_id, design_id, item_id, color_id, number_set, total_pieces, rate, total_amount, size_id, jobtype_id, completed_date, status_id, job_seq_no, user_id, size_name } = decoded.data;
            if (decoded) {
                if (job_id == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Jobcard");
                    const max = await client.query(`select to_char(to_date(CURRENT_DATE::text, 'YYYY'), 'YY')|| date_part('month', CURRENT_DATE) || (LPAD((SELECT coalesce(max(job_seq_no),0) + 1 from tbl_job_details )::text,4,'0')) as mr`)
                    var maxjobcard = max && max.rows[0].mr;
                    const maxjob_no = await client.query(`select coalesce(max(job_seq_no),0) + 1 as mr FROM tbl_job_details`)
                    var maxjob_seq_no = maxjob_no && maxjob_no.rows[0].mr;
                    const result = await client.query(`INSERT INTO tbl_job_details (job_id,job_date,employee_id,machine_id,design_id,item_id,color_id,number_set,total_pieces,rate,total_amount,size_id,jobtype_id,completed_date,user_id,maker_id,status_id,job_seq_no,salary_status_id,created_date,size_name) values ($1, $2, $3,$4,$5,$6,$7, $8, $9,$10,$11,$12,$13, $14, $15,$16,$17,$18,0,CURRENT_TIMESTAMP,$19) `, [maxjobcard, job_date, employee_id, machine_id, design_id, item_id, color_id, number_set, total_pieces, rate, total_amount, size_id, jobtype_id, completed_date, user_id, makerid, status_id, maxjob_seq_no,size_name]);

                    // if(design_id){
                    //     await client.query(`UPDATE "tbl_design" set piece_rate=$1,updated_date=CURRENT_TIMESTAMP where design_id = $2 `, [rate,design_id]);  
                    // }
                   
                    const jobcard_Result = await client.query(`SELECT a.job_date,a.job_id,b.employee_name,a.employee_id,a.machine_id,a.design_id,a.completed_date,a.total_pieces,a.jobtype_id,extract(day from CURRENT_DATE::timestamp - a.job_date::date ) as noofdays,c.item_name,d.machine_no,f.qr_code as design_no,g.status_name,a.status_id,'' as itemgroup_id,h.color_name,k.jobtype_name,a.salary_status_id,l.salary_status_name, concat_ws(' - ',f.start_size, f.end_size) as size from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
                    left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
                    inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
                    inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id  where  a.job_id =$1`, [maxjobcard]);
                    let Jobcard_json = jobcard_Result && jobcard_Result.rows ? jobcard_Result.rows[0] : {};
                    if (client) {
                        client.end();
                    }
                    let create_code = result && result.rowCount ? result.rowCount : 0;
                    if (create_code == 1) {
                        return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1, "resultData":Jobcard_json };
                    }
                    else { return '' }
                }
                else {
                    var makerid = await commonService.insertLogs(user_id, "Update Jobcard");
                    const count = await client.query(`select count(*) as count FROM tbl_job_details where job_id =` + job_id)
                    var count_Check = count && count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE "tbl_job_details" set job_date=$1,employee_id=$2,machine_id=$3,design_id=$4,item_id=$5,color_id=$6,number_set=$7,total_pieces=$8,rate=$9,total_amount=$10,size_id=$11,jobtype_id=$12,completed_date=$13,user_id=$14,maker_id=$15,status_id=$16,job_seq_no=$17,salary_status_id=0,updated_date=CURRENT_TIMESTAMP,size_name=$19  where job_id = $18 `, [job_date, employee_id, machine_id, design_id, item_id, color_id, number_set, total_pieces, rate, total_amount, size_id, jobtype_id, completed_date, user_id, makerid, status_id, job_seq_no, job_id, size_name]);

                        // if(design_id){
                        //     await client.query(`UPDATE "tbl_design" set piece_rate=$1,updated_date=CURRENT_TIMESTAMP where design_id = $2 `, [rate,design_id]);  
                        // }
                        const jobcard_Result = await client.query(`SELECT a.job_date,a.job_id,b.employee_name,a.employee_id,a.machine_id,a.design_id,a.completed_date,a.total_pieces,a.jobtype_id,extract(day from CURRENT_DATE::timestamp - a.job_date::date ) as noofdays,c.item_name,d.machine_no,f.qr_code as design_no,g.status_name,a.status_id,'' as itemgroup_id,h.color_name,k.jobtype_name,a.salary_status_id,l.salary_status_name, concat_ws(' - ',f.start_size, f.end_size) as size from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
                        left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
                        inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
                        inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id  where  a.job_id =$1`, [job_id]);
                        let Jobcard_json = jobcard_Result && jobcard_Result.rows ? jobcard_Result.rows[0] : {};
                        if (client) {
                            client.end();
                        }
                        let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                        if (update_code == 1) {
                            return response = { "message": constants.userMessage.USER_UPDATED, "statusFlag": 1, "resultData":Jobcard_json  };
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

//Delete Jobcard jwt 
module.exports.deleteJobcardjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}

//Delete Jobcard service
module.exports.deleteJobcard = async (req) => {
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
            const { user_id, job_id } = decoded.data;
            if (decoded) {
                const group_Count = await client.query(`select count(*) as count FROM tbl_job_details where job_id =` + job_id)
                var count_Check = group_Count && group_Count.rows[0].count;
                if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                    await commonService.insertLogs(user_id, "Delete JobCard");
                    const delete_result = await client.query(`DELETE FROM tbl_job_details where job_id = $1 `,
                        [job_id]);
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

//create Jobcard EDit jwt 
module.exports.editJobcardjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create Jobcard EDit
module.exports.editJobcard = async (req) => {
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
            const { job_id } = decoded.data;
            if (decoded) {
                const jobcard_Result = await client.query(`SELECT a.job_date,a.job_id,a.number_set,a.total_pieces,a.rate,a.total_amount,a.job_seq_no,a.employee_id,b.employee_name,a.machine_id,d.machine_no,a.design_id,f.qr_code as design_no,a.item_id,c.item_name,a.color_id,h.color_name,a.size_id,concat_ws(' - ', f.start_size, f.end_size) as size_name,a.status_id,g.status_name,a.jobtype_id,j.jobtype_name,extract(day from CURRENT_DATE::timestamp - a.job_date::date ) as noofdays,a.salary_status_id,coalesce(a.size_name, '') as size_names,a.completed_date from tbl_job_details as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on a.color_id =  h.color_id  inner join tbl_def_jobtype as j on a.jobtype_id = j.jobtype_id where a.job_id = ` + job_id);
                if (client) {
                    client.end();
                }
                let editjobcard_Array = jobcard_Result && jobcard_Result.rows ? jobcard_Result.rows : [];
                responseData = { "EditJobcardArray": editjobcard_Array }
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


//create generate Jobno  jwt 
module.exports.generateJobnojwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}

//create generate Jobno 
module.exports.generateJobno = async (req) => {
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
            const { job_id } = decoded.data;
            if (decoded) {
                const job_no = await client.query(`select to_char(to_date(CURRENT_DATE::text, 'YYYY'), 'YY')|| date_part('month', CURRENT_DATE) || (LPAD((SELECT coalesce(max(job_seq_no),0) + 1 from tbl_job_details )::text,4,'0')) as mr`)
                if (client) {
                    client.end();
                }
                var maxjobcard = job_no && job_no.rows ? job_no.rows[0].mr : ''; 
                responseData = { "JobNo": maxjobcard }
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

//create Jobcard jwt 
module.exports.saveTransferJobJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}


//create Jobcard service
module.exports.saveTransferJob = async (req) => {
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
            const { job_id, job_date, employee_id, machine_id, design_id, item_id, color_id, number_set, total_pieces, rate, total_amount, size_id, jobtype_id, completed_date, status_id, user_id } = decoded.data;
            if (decoded) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Transfer Jobcard");
                    const max = await client.query(`select to_char(to_date(CURRENT_DATE::text, 'YYYY'), 'YY')|| date_part('month', CURRENT_DATE) || (LPAD((SELECT coalesce(max(job_seq_no),0) + 1 from tbl_job_details )::text,4,'0')) as mr`)
                    var maxjobcard = max && max.rows[0].mr;
                    const maxjob_no = await client.query(`select coalesce(max(job_seq_no),0) + 1 as mr FROM tbl_job_details`)
                    var maxjob_seq_no = maxjob_no && maxjob_no.rows[0].mr;
                    const result = await client.query(`INSERT INTO tbl_job_details (job_id,job_date,employee_id,machine_id,design_id,item_id,color_id,number_set,total_pieces,rate,total_amount,size_id,jobtype_id,completed_date,user_id,maker_id,status_id,job_seq_no,old_job_id,salary_status_id,created_date) values ($1, $2, $3,$4,$5,$6,$7, $8, $9,$10,$11,$12,$13, $14, $15,$16,$17,$18,$19,0,CURRENT_TIMESTAMP) `, [maxjobcard, job_date, employee_id, machine_id, design_id, item_id, color_id, number_set, total_pieces, rate, total_amount, size_id, jobtype_id, completed_date, user_id, makerid, status_id, maxjob_seq_no,job_id]);

                    await client.query(`UPDATE "tbl_job_details" set status_id=5,updated_date=CURRENT_TIMESTAMP where job_id = $1 `, [job_id]);

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




//create view Transfer Jobcard jwt 
module.exports.viewTransferJobcardjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create view Transfer Jobcard
module.exports.viewTransferJobcard = async (req) => {
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
            const { job_id } = decoded.data;
            if (decoded) {
                const jobcard_Result = await client.query(`SELECT a.job_date,a.job_id,a.employee_id,b.employee_name,a.machine_id,d.machine_no from tbl_job_details as a inner join tbl_employee_details as b on a.employee_id = b.employee_id  inner join tbl_machine as d on a.machine_id = d.machine_id  where a.old_job_id = ` + job_id);
                if (client) {
                    client.end();
                }
                let viewjobcard_Array = jobcard_Result && jobcard_Result.rows ? jobcard_Result.rows : [];
                responseData = { "ViewJobcardArray": viewjobcard_Array }
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




//create Update rate in  Jobcard jwt 
module.exports.updateRateJobcardjwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//Update rate in  Jobcard
module.exports.updateRateJobcard = async (req) => {
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
            const { job_id,process, total_amount, rate,user_id } = decoded.data;
            if (decoded) {
                var makerid = await commonService.insertLogs(user_id, "Update Rate in  Jobcard");  
                const update_result = await client.query(`UPDATE "tbl_job_details" set  rate=$1,total_amount=($2*coalesce(total_pieces,0)) ,user_id=$3,maker_id=$4,updated_date=CURRENT_TIMESTAMP  where design_id in (select "size_id" from "tbl_item_sizes"  where "trans_no" in (select "trans_no" from "tbl_item_sizes" where "size_id" in (select design_id from "tbl_job_details" where job_id=$5  and (status_id=3 or status_id=4 or status_id=5) and salary_status_id=0 ))) and  (status_id=3 or status_id=4 or status_id=5) and salary_status_id=0`, [rate, rate, user_id, makerid, job_id]);
                if (client) {
                    client.end();
                }
                let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                if (update_code > 0) {
                    return responseData = { "message": constants.userMessage.USER_UPDATED, "statusFlag": 1   };
                } else {
                    return responseData = { "message": 'Something went wrong', "statusFlag": 2   };
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