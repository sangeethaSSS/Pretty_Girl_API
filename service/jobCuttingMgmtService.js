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

//create generate Jobno  jwt 
module.exports.generateJobCuttingNoJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

//create generate Jobno 
module.exports.generateJobCuttingNo = async (req) => {
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
        const job_no = await client.query(`SELECT to_char(to_date(CURRENT_DATE::text, 'YYYY'), 'YY')|| date_part('month', CURRENT_DATE) || (LPAD((SELECT coalesce(max(job_cutting_seq_no),0) + 1 FROM tbl_job_cutting )::text,4,'0')) AS mr`)
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

//On Change job card
module.exports.onchangeJobCuttingJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.onchangeJobCutting = async (req) => {
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
        const { item_id } = decoded.data
        const design_list = await client.query(` SELECT * FROM (
                SELECT DISTINCT design_id AS label, design_id AS value FROM tbl_item_management 
                WHERE item_code = $1 AND status_id = 1) AS DERV ORDER BY label`, [item_id])

        const sub_category_list = await client.query(` SELECT sub_category_id AS value,short_name AS label,sub_category_name,item_group_id FROM tbl_item_sub_category WHERE item_group_id = $1`, [item_id])

        if (client) { client.end(); }
        let List_Array = design_list && design_list.rows ? design_list.rows : [];
        let Sub_Category_Array = sub_category_list && sub_category_list.rows ? sub_category_list.rows : [];

        var response = {}
        response = { "DesignList": List_Array, "SubCategoryList": Sub_Category_Array }
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
module.exports.getSizeForJobCuttingJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.getSizeForJobCutting = async (req) => {
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
        const { item_id, design_id } = decoded.data
        const design_list = await client.query(` SELECT DISTINCT COALESCE(start_size,'')||'-'||COALESCE(end_size,'') AS label,COALESCE(start_size,'')||'-'||COALESCE(end_size,'') AS value,start_size,end_size FROM tbl_item_management AS a INNER JOIN tbl_item_sizes AS b ON a.trans_no = b.trans_no 
            WHERE a.item_code = ${item_id}  and design_id='` + design_id + `'`)

        if (client) { client.end(); }
        let List_Array = design_list && design_list.rows ? design_list.rows : [];

        var response = {}
        response = { "SizeList": List_Array }
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
module.exports.getColorsForJobCuttingJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.getColorsForJobCutting = async (req) => {
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
        const { item_id, design_id, end_size, start_size } = decoded.data

        const Item_list = await client.query(`SELECT a.color_id AS value, color_name AS label FROM  tbl_item_sizes AS a INNER JOIN tbl_item_management as b ON a.trans_no = b. trans_no LEFT JOIN tbl_color AS c ON a.color_id = c.color_id WHERE item_code = ${item_id} AND design_id='` + design_id + `' and end_size = '` + end_size + `' AND start_size='` + start_size + `' ORDER BY color_name`)

        if (client) { client.end(); }
        let List_Array = Item_list && Item_list.rows ? Item_list.rows : [];

        var response = {}
        response = { "ColorList": List_Array }
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

module.exports.getItemsForJobCuttingJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}

module.exports.getItemsForJobCutting = async (req) => {
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
        const { sub_category_id, item_id, design_id, end_size, start_size, color_code } = decoded.data

        let colorid_val = '1=1';
        if (color_code && color_code != "" && color_code != "0") {
          const color_id_val = color_code ? '\'' + color_code.split(',').join('\',\'') + '\'' : ''
          colorid_val = ` a.color_id in (${color_id_val})`
        }

        const Item_list = await client.query(`   SELECT item_code,${sub_category_id} as sub_category_id,design_id,size_id,start_size,end_size,qr_code,total_set as no_of_piece, 0 as qty,  (SELECT price FROM tbl_item_sub_category WHERE sub_category_id = ${sub_category_id}) AS price,a.color_id FROM  tbl_item_sizes AS a INNER JOIN tbl_item_management as b ON a.trans_no = b. trans_no WHERE item_code = ${item_id} AND design_id='` + design_id + `' and end_size = '` + end_size + `' AND start_size='` + start_size + `' and ${colorid_val}`)

        if (client) { client.end(); }
        let List_Array = Item_list && Item_list.rows ? Item_list.rows : [];

        var response = {}
        response = { "ItemList": List_Array }
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


module.exports.saveJobCuttingJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}


//create Jobcard service
module.exports.saveJobCutting = async (req) => {
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
      const { job_cutting_id, job_cutting_date, item_array, employee_id, machine_id, completed_date, status_id, job_cutting_seq_no, user_id } = decoded.data;
      if (decoded) {
        if (job_cutting_id == 0) {
          var makerid = await commonService.insertLogs(user_id, "Insert JobCutting");
          const max = await client.query(`select to_char(to_date(CURRENT_DATE::text, 'YYYY'), 'YY')|| date_part('month', CURRENT_DATE) || (LPAD((SELECT coalesce(max(job_cutting_seq_no),0) + 1 from tbl_job_cutting )::text,4,'0')) as mr`)
          var maxjobcard = max && max.rows[0].mr;
          const maxjob_no = await client.query(`select coalesce(max(job_cutting_seq_no),0) + 1 as mr FROM tbl_job_cutting`)
          var maxjob_cutting_seq_no = maxjob_no && maxjob_no.rows[0].mr;
          const result = await client.query(` INSERT INTO tbl_job_cutting(
                        job_cutting_id, job_cutting_date, employee_id, machine_id, user_id, maker_id, status_id, created_date, salary_status_id, job_cutting_seq_no,completed_date)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, 0, $8, $9) `, [maxjobcard, job_cutting_date, employee_id, machine_id, user_id, makerid, status_id, maxjob_cutting_seq_no, completed_date]);

          if (item_array && item_array.length > 0) {
            for (let i = 0; i < item_array.length; i++) {
              const Item_list = await client.query(`INSERT INTO tbl_job_cutting_item_details(
                                job_cutting_id, job_cutting_seq_no, size_id, item_id, design_id, color_id, item_sub_category_id, job_cutting_set, job_cutting_pieces, total_amount, user_id, maker_id, created_date)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP) `, [maxjobcard, maxjob_cutting_seq_no, item_array[i].size_id, item_array[i].item_code, item_array[i].design_id, item_array[i].color_id, item_array[i].sub_category_id, item_array[i].qty, item_array[i].no_of_piece, item_array[i].price, user_id, makerid]);
              let normal_code = Item_list && Item_list.rowCount ? Item_list.rowCount : 0;
              console.log(normal_code)
            }
          }

          // if(design_id){
          //     await client.query(`UPDATE "tbl_design" set piece_rate=$1,updated_date=CURRENT_TIMESTAMP where design_id = $2 `, [rate,design_id]);  
          // }

          // const jobcard_Result = await client.query(`SELECT a.job_date,a.job_id,b.employee_name,a.employee_id,a.machine_id,a.design_id,a.completed_date,a.total_pieces,a.jobtype_id,extract(day from CURRENT_DATE::timestamp - a.job_date::date ) as noofdays,c.item_name,d.machine_no,f.qr_code as design_no,g.status_name,a.status_id,'' as itemgroup_id,h.color_name,k.jobtype_name,a.salary_status_id,l.salary_status_name, concat_ws(' - ',f.start_size, f.end_size) as size from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
          // left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
          // inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
          // inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id  where  a.job_id =$1`, [maxjobcard]);
          // let Jobcard_json = jobcard_Result && jobcard_Result.rows ? jobcard_Result.rows[0] : {};
          let Jobcard_json = {};

          if (client) {
            client.end();
          }
          let create_code = result && result.rowCount ? result.rowCount : 0;
          if (create_code == 1) {
            return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1, "resultData": Jobcard_json };
          }
          else { return '' }
        }
        else {
          var makerid = await commonService.insertLogs(user_id, "Update Jobcard");
          const count = await client.query(`select count(*) as count FROM tbl_job_cutting where job_cutting_id =` + job_cutting_id)
          var count_Check = count && count.rows[0].count
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            const update_result = await client.query(`UPDATE "tbl_job_cutting" set job_cutting_date=$1,employee_id=$2,machine_id=$3,completed_date=$4,user_id=$5,maker_id=$6,status_id=$7,job_cutting_seq_no=$8,salary_status_id=0,updated_date=CURRENT_TIMESTAMP where job_cutting_id = $9 `, [job_cutting_date, employee_id, machine_id, completed_date, user_id, makerid, status_id, job_cutting_seq_no, job_cutting_id]);

            const delete_result = await client.query(`DELETE FROM tbl_job_cutting_item_details where job_cutting_id = $1`, [job_cutting_id])


            var deleteresult = delete_result && delete_result.rowCount;
            if (item_array && item_array.length > 0) {
              for (let i = 0; i < item_array.length; i++) {
                if (deleteresult > 0) {
                  const Item_list = await client.query(`INSERT INTO tbl_job_cutting_item_details(
                                    job_cutting_id, job_cutting_seq_no, size_id, item_id, design_id, color_id, item_sub_category_id, job_cutting_set, job_cutting_pieces, total_amount, user_id, maker_id, created_date)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP) `, [job_cutting_id, job_cutting_seq_no, item_array[i].size_id, item_array[i].item_code, item_array[i].design_id, item_array[i].color_id, item_array[i].sub_category_id, item_array[i].qty, item_array[i].no_of_piece, item_array[i].price, user_id, makerid]);
                  let normal_code = Item_list && Item_list.rowCount ? Item_list.rowCount : 0;
                  console.log(normal_code)
                }
              }
            }

            // const jobcard_Result = await client.query(`SELECT a.job_date,a.job_id,b.employee_name,a.employee_id,a.machine_id,a.design_id,a.completed_date,a.total_pieces,a.jobtype_id,extract(day from CURRENT_DATE::timestamp - a.job_date::date ) as noofdays,c.item_name,d.machine_no,f.qr_code as design_no,g.status_name,a.status_id,'' as itemgroup_id,h.color_name,k.jobtype_name,a.salary_status_id,l.salary_status_name, concat_ws(' - ',f.start_size, f.end_size) as size from tbl_job_details  as a inner join tbl_employee_details as b on a.employee_id = b.employee_id inner join tbl_def_item as c on a.item_id = c.item_id inner join tbl_machine as d on a.machine_id = d.machine_id 
            // left join tbl_item_sizes as f on f.size_id = a.design_id inner join tbl_def_status as g on g.status_id =  a.status_id left join tbl_color as h on h.color_id = a.color_id   
            // inner join tbl_def_jobtype as k on a.jobtype_id = k.jobtype_id 
            // inner join tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id  where  a.job_id =$1`, [job_id]);
            // let Jobcard_json = jobcard_Result && jobcard_Result.rows ? jobcard_Result.rows[0] : {};
            let Jobcard_json = {};
            if (client) {
              client.end();
            }
            let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
            if (update_code == 1) {
              return response = { "message": constants.userMessage.USER_UPDATED, "statusFlag": 1, "resultData": Jobcard_json };
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

//create Jobcard List jwt 
module.exports.jobcuttingListJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Jobcard LIST
module.exports.jobcuttingList = async (req) => {
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
      const { status_id, itemgroup_id, size_id, employee_id, color_id, from_date, to_date, offset, limit } = decoded.data;
      var status = '', itemgroup = '1=1',item_group = '1=1', sizeid = '', employee = '', color = '', datediff;
      if (decoded) {
        if (itemgroup_id == 0) {
          itemgroup = ' 1=1'
          item_group = ' 1=1'
        }
        else {
          itemgroup = ` c.item_id = ` + itemgroup_id
          item_group = ` d.item_id = ` + itemgroup_id
        }
        if (status_id == 0) {
          status = ' 1=1'
        }
        else {
          status = ` a.status_id = ` + status_id
        }

        if (size_id == 0) {
          sizeid = ' 1=1'
        }
        else {
          sizeid = ` b.size_id = ` + size_id
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
          color = ` b.color_id = ` + color_id
        }       
        if (from_date && to_date) {
          if (status_id == 3 || status_id == '3') {
            datediff = `to_char(a.completed_date,'YYYY-MM-DD') :: date BETWEEN `
              .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
          } else {
            datediff = `to_char(a.job_cutting_date,'YYYY-MM-DD') :: date BETWEEN `
              .concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
          }

        }
        let responseTotalData = {};
        let jobCutting_Result = '';
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
          const total_jobCutting_Result = await client.query(`SELECT a.job_cutting_id,a.job_cutting_seq_no,a.job_cutting_date,a.employee_id,c.employee_name,a.machine_id, a.completed_date,a.status_id,a.salary_status_id, e.machine_no,g.status_name,l.salary_status_name,sum(b.total_amount) as rate,sum(b.total_amount * b.job_cutting_set * job_cutting_pieces) as price,sum(job_cutting_set) as job_cutting_set,sum(job_cutting_pieces * job_cutting_set) as job_cutting_pieces FROM tbl_job_cutting as a INNER JOIN 
          tbl_job_cutting_item_details AS b on a.job_cutting_id = b.job_cutting_id
          INNER JOIN tbl_employee_details as c on a.employee_id = c.employee_id
          INNER JOIN tbl_def_item as d on b.item_id = d.item_id INNER JOIN 
          tbl_machine as e on a.machine_id = e.machine_id 
          LEFT JOIN tbl_item_sizes as f on f.size_id = b.size_id 
          INNER JOIN tbl_def_status as g on g.status_id = a.status_id 
          LEFT JOIN tbl_color as h on h.color_id = b.color_id
          INNER JOIN tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id 
          WHERE ` + datediff + ` AND ` + tot_status + ` AND ` + item_group + ` AND ` + sizeid + ` AND ` + employee + ` AND ` + color + `
          GROUP BY a.job_cutting_id,a.job_cutting_seq_no,a.job_cutting_date,a.employee_id,c.employee_name,a.machine_id,a.completed_date,a.status_id,a.salary_status_id,
          e.machine_no,g.status_name,l.salary_status_name ORDER BY a.job_cutting_date desc`);
          
          jobCutting_Result = await client.query(`SELECT a.job_cutting_id,a.job_cutting_seq_no,a.job_cutting_date,a.employee_id,c.employee_name,a.machine_id, a.completed_date,a.status_id,a.salary_status_id, e.machine_no,g.status_name,l.salary_status_name,sum(b.total_amount) as rate,sum(b.total_amount * b.job_cutting_set * job_cutting_pieces) as price,sum(job_cutting_set) as job_cutting_set,sum(job_cutting_pieces * job_cutting_set) as job_cutting_pieces FROM tbl_job_cutting as a INNER JOIN 
          tbl_job_cutting_item_details AS b on a.job_cutting_id = b.job_cutting_id
          INNER JOIN tbl_employee_details as c on a.employee_id = c.employee_id
          INNER JOIN tbl_def_item as d on b.item_id = d.item_id INNER JOIN 
          tbl_machine as e on a.machine_id = e.machine_id 
          LEFT JOIN tbl_item_sizes as f on f.size_id = b.size_id 
          INNER JOIN tbl_def_status as g on g.status_id = a.status_id 
          LEFT JOIN tbl_color as h on h.color_id = b.color_id
          INNER JOIN tbl_def_salary_status as l on a.salary_status_id = l.salary_status_id 
          WHERE ` + datediff + ` AND ` + tot_status + ` AND ` + item_group + ` AND ` + sizeid + ` AND ` + employee + ` AND ` + color + `
          GROUP BY a.job_cutting_id,a.job_cutting_seq_no,a.job_cutting_date,a.employee_id,c.employee_name,a.machine_id,a.completed_date,a.status_id,a.salary_status_id,
          e.machine_no,g.status_name,l.salary_status_name ORDER BY a.job_cutting_date desc LIMIT ${limit} OFFSET ${offset}`)



          
          // if (status_id == 0) {
          //     completed_date =  `to_char(a.completed_date,'YYYY-MM-DD') :: date BETWEEN `.concat(`to_date('` + from_date + `','YYYY-MM-DD') AND to_date('` + to_date + `','YYYY-MM-DD')`);
          // }
          //Get Total set and total piece
        
          const totalCount = await client.query(`SELECT SUM(coalesce(job_cutting_set,0)) AS total_set,SUM(coalesce(job_cutting_set * job_cutting_pieces,0)) AS total_piece FROM tbl_job_cutting AS a INNER JOIN 
          tbl_job_cutting_item_details AS b ON a.job_cutting_id = b.job_cutting_id
          INNER JOIN tbl_employee_details AS c ON a.employee_id = c.employee_id
          INNER JOIN tbl_def_item AS d ON b.item_id = d.item_id INNER JOIN 
          tbl_machine AS e ON a.machine_id = e.machine_id 
          LEFT JOIN tbl_item_sizes AS f ON f.size_id = b.size_id 
          INNER JOIN tbl_def_status AS g ON g.status_id = a.status_id 
          LEFT JOIN tbl_color AS h ON h.color_id = b.color_id
          INNER JOIN tbl_def_salary_status AS l ON a.salary_status_id = l.salary_status_id   WHERE ` + datediff + ` AND ` + tot_status + ` AND ` + item_group + ` AND ` + sizeid + ` AND ` + employee + ` AND ` + color + ``);
          const total_Count = await client.query(`SELECT COUNT(job_cutting_id) as total_job FROM (SELECT DISTINCT a.job_cutting_id FROM tbl_job_cutting AS a INNER JOIN                tbl_job_cutting_item_details AS b ON a.job_cutting_id = b.job_cutting_id INNER JOIN tbl_employee_details AS c ON a.employee_id = c.employee_id
          INNER JOIN tbl_def_item AS d ON b.item_id = d.item_id INNER JOIN 
          tbl_machine AS e ON a.machine_id = e.machine_id 
          LEFT JOIN tbl_item_sizes AS f ON f.size_id = b.size_id 
          INNER JOIN tbl_def_status AS g ON g.status_id = a.status_id 
          LEFT JOIN tbl_color AS h ON h.color_id = b.color_id
          INNER JOIN tbl_def_salary_status AS l ON a.salary_status_id = l.salary_status_id  
          WHERE ` + datediff + ` AND ` + tot_status + ` AND ` + item_group + ` AND ` + sizeid + ` AND ` +employee + ` AND ` + color + `) AS DERV`)
     

          const pendingCount = await client.query(`SELECT SUM(coalesce(job_cutting_set,0)) AS total_set,SUM(coalesce(job_cutting_set * job_cutting_pieces,0)) AS total_piece FROM tbl_job_cutting AS a INNER JOIN tbl_job_cutting_item_details AS b ON a.job_cutting_id = b.job_cutting_id
          INNER JOIN tbl_employee_details AS c ON a.employee_id = c.employee_id
          INNER JOIN tbl_def_item AS d ON b.item_id = d.item_id INNER JOIN 
          tbl_machine AS e ON a.machine_id = e.machine_id 
          LEFT JOIN tbl_item_sizes AS f ON f.size_id = b.size_id 
          INNER JOIN tbl_def_status AS g ON g.status_id = a.status_id 
          LEFT JOIN tbl_color AS h ON h.color_id = b.color_id
          INNER JOIN tbl_def_salary_status AS l ON a.salary_status_id = l.salary_status_id   WHERE ` + datediff + ` AND ` + pend_status + ` AND ` + item_group + ` AND ` + sizeid + ` AND ` + employee + ` AND ` + color + ``);

          const pending_Count = await client.query(`SELECT COUNT(job_cutting_id) as pending_job FROM (SELECT DISTINCT a.job_cutting_id FROM tbl_job_cutting AS a INNER JOIN tbl_job_cutting_item_details AS b ON a.job_cutting_id = b.job_cutting_id
          INNER JOIN tbl_employee_details AS c ON a.employee_id = c.employee_id
          INNER JOIN tbl_def_item AS d ON b.item_id = d.item_id INNER JOIN 
          tbl_machine AS e ON a.machine_id = e.machine_id 
          LEFT JOIN tbl_item_sizes AS f ON f.size_id = b.size_id 
          INNER JOIN tbl_def_status AS g ON g.status_id = a.status_id 
          LEFT JOIN tbl_color AS h ON h.color_id = b.color_id
          INNER JOIN tbl_def_salary_status AS l ON a.salary_status_id = l.salary_status_id   WHERE ` + datediff + ` AND ` + pend_status + ` AND ` + item_group + ` AND ` + sizeid + ` AND ` + employee + ` AND ` + color + `) AS DERV`);

          const completedCount = await client.query(`SELECT SUM(coalesce(job_cutting_set,0)) AS total_set,SUM(coalesce(job_cutting_set * job_cutting_pieces,0)) AS total_piece FROM tbl_job_cutting AS a INNER JOIN tbl_job_cutting_item_details AS b ON a.job_cutting_id = b.job_cutting_id
          INNER JOIN tbl_employee_details AS c ON a.employee_id = c.employee_id
          INNER JOIN tbl_def_item AS d ON b.item_id = d.item_id INNER JOIN 
          tbl_machine AS e ON a.machine_id = e.machine_id 
          LEFT JOIN tbl_item_sizes AS f ON f.size_id = b.size_id 
          INNER JOIN tbl_def_status AS g ON g.status_id = a.status_id 
          LEFT JOIN tbl_color AS h ON h.color_id = b.color_id
          INNER JOIN tbl_def_salary_status AS l ON a.salary_status_id = l.salary_status_id   WHERE ` + completed_date + ` AND ` + com_status + ` AND ` + item_group + ` AND ` + sizeid + ` AND ` + employee + ` AND ` + color + ``);

          const completed_Count = await client.query(`SELECT COUNT(job_cutting_id) as completed_job FROM (SELECT DISTINCT a.job_cutting_id FROM tbl_job_cutting AS a INNER JOIN tbl_job_cutting_item_details AS b ON a.job_cutting_id = b.job_cutting_id
          INNER JOIN tbl_employee_details AS c ON a.employee_id = c.employee_id
          INNER JOIN tbl_def_item AS d ON b.item_id = d.item_id INNER JOIN 
          tbl_machine AS e ON a.machine_id = e.machine_id 
          LEFT JOIN tbl_item_sizes AS f ON f.size_id = b.size_id 
          INNER JOIN tbl_def_status AS g ON g.status_id = a.status_id 
          LEFT JOIN tbl_color AS h ON h.color_id = b.color_id
          INNER JOIN tbl_def_salary_status AS l ON a.salary_status_id = l.salary_status_id   WHERE ` + completed_date + ` AND ` + com_status + ` AND ` + item_group + ` AND ` + sizeid + ` AND ` + employee + ` AND ` + color + `) AS DERV`);

         

          var Total_Job = total_Count && total_Count.rows[0].total_job ? total_Count.rows[0].total_job : 0
          var Total_Job_Set = totalCount && totalCount.rows[0].total_set ? totalCount.rows[0].total_set : 0
          var Total_Job_Pieces = totalCount && totalCount.rows[0].total_piece ? totalCount.rows[0].total_piece : 0

          var Pending_Job = pending_Count && pending_Count.rows[0].pending_job ? pending_Count.rows[0].pending_job : 0
          var Pending_Job_Set = pendingCount && pendingCount.rows[0].total_set ? pendingCount.rows[0].total_set : 0
          var Pending_Job_Pieces = pendingCount && pendingCount.rows[0].total_piece ? pendingCount.rows[0].total_piece : 0

          var Completed_Job = completed_Count && completed_Count.rows[0].completed_job ? completed_Count.rows[0].completed_job : 0
          var Completed_Job_Set = completedCount && completedCount.rows[0].total_set ? completedCount.rows[0].total_set : 0
          var Completed_Job_Pieces = completedCount && completedCount.rows[0].total_piece ? completedCount.rows[0].total_piece : 0          

          responseTotalData = { "TotalJob": Total_Job, "TotalJobSet": Total_Job_Set, "TotalJobPiece": Total_Job_Pieces, "PendingJob": Pending_Job, "PendingJobSet": Pending_Job_Set, "PendingJobPiece": Pending_Job_Pieces, "CompletedJob": Completed_Job, "CompletedJobSet": Completed_Job_Set, "CompletedJobPiece": Completed_Job_Pieces }

        
        const company_Result = await client.query(`SELECT company_name,city from tbl_company`);

        if (client) {
          client.end();
        }


        let JobCutting_Array = jobCutting_Result && jobCutting_Result.rows ? jobCutting_Result.rows : [];
        let Total_JobCutting_Array = total_jobCutting_Result && total_jobCutting_Result.rows ? total_jobCutting_Result.rows : []; 
        let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];

        responseData = { "JobCuttingArray": JobCutting_Array,"TotalJobCutting": Total_JobCutting_Array, "CompanyArray": Company_Array, "TotalData": responseTotalData }
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

//create Jobcutting EDit jwt 
module.exports.editJobCuttingJwt = async (req) => {
  try {
      const token = await commonService.jwtCreate(req);
      return { token };

  } catch (error) {
      throw new Error(error);
  }
}
//create Jobcutting EDit
module.exports.editJobCutting = async (req) => {
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
          const { job_cutting_id } = decoded.data;
          if (decoded) {
              const jobcard_Result = await client.query(`SELECT a.job_cutting_date,a.job_cutting_id,b.job_cutting_set,b.job_cutting_pieces,b.total_amount,a.job_cutting_seq_no,a.employee_id,
              c.employee_name,a.machine_id,e.machine_no,b.design_id,f.qr_code as design_no,b.item_id,d.item_name,b.color_id,h.color_name,b.size_id,concat_ws(' - ', f.start_size, f.end_size) as size_name,a.status_id,g.status_name, extract(day from CURRENT_DATE::timestamp - a.job_cutting_date::date ) as noofdays,a.salary_status_id,a.completed_date from tbl_job_cutting AS a INNER JOIN tbl_job_cutting_item_details AS b ON a.job_cutting_id = b.job_cutting_id             INNER JOIN tbl_employee_details AS c ON a.employee_id = c.employee_id                            INNER JOIN tbl_def_item AS d ON b.item_id = d.item_id INNER JOIN                               tbl_machine AS e ON a.machine_id = e.machine_id INNER JOIN tbl_item_sizes AS f ON f.size_id = b.size_id INNER JOIN tbl_def_status AS g ON g.status_id = a.status_id LEFT JOIN tbl_color AS h ON h.color_id = b.color_id WHERE a.job_cutting_id = ` + job_cutting_id);

              const jobcutting_itemArray = await client.query(`SELECT b.item_id AS item_code, b.item_sub_category_id AS sub_category_id,b.design_id,b.size_id,d.start_size,d.end_size,d.qr_code,b.job_cutting_pieces as no_of_piece,b.job_cutting_set as qty, 
              CASE WHEN a.salary_status_id = 0 THEN (SELECT price FROM tbl_item_sub_category WHERE sub_category_id = b.item_sub_category_id) ELSE b.total_amount END AS price
              ,b.color_id from tbl_job_cutting AS a INNER JOIN tbl_job_cutting_item_details AS b ON a.job_cutting_id = b.job_cutting_id  INNER JOIN tbl_def_item AS c ON b.item_id = c.item_id 
               INNER JOIN tbl_item_sizes AS d ON d.size_id = b.size_id LEFT JOIN tbl_color AS e ON e.color_id = b.color_id WHERE a.job_cutting_id = ` + job_cutting_id)

               let jobcutting_item_Array = jobcutting_itemArray && jobcutting_itemArray.rows ? jobcutting_itemArray.rows : [];

              if (client) {
                  client.end();
              }
              let editjobcard_Array = jobcard_Result && jobcard_Result.rows ? jobcard_Result.rows : [];
              editjobcard_Array[0]['ItemArray'] = jobcutting_item_Array
              responseData = { "editJobCuttingArray": editjobcard_Array }
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


//Delete Jobcard jwt 
module.exports.deleteJobCuttingJwt = async (req) => {
  try {
      const token = await commonService.jwtCreate(req);
      return { token };
  } catch (error) {
      throw new Error(error);
  }
}

//Delete Jobcard service
module.exports.deleteJobCutting = async (req) => {
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
          const { user_id, job_cutting_id } = decoded.data;
          if (decoded) {
              const group_Count = await client.query(`select count(*) as count FROM tbl_job_cutting where job_cutting_id =` + job_cutting_id)
              var count_Check = group_Count && group_Count.rows[0].count;
              if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                  await commonService.insertLogs(user_id, "Delete JobCutting");
                  const delete_item_result = await client.query(`DELETE FROM tbl_job_cutting_item_details where job_cutting_id = $1 `,
                  [job_cutting_id]);
                  const delete_result = await client.query(`DELETE FROM tbl_job_cutting where job_cutting_id = $1 `,
                      [job_cutting_id]);

                     
                  if (client) {
                      client.end();
                  }
                  let deletecode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
                  let delete_item_code = delete_item_result && delete_item_result.rowCount ? delete_item_result.rowCount : 0
                  if (deletecode > 0 && delete_item_code > 0) {
                      responseData = { "message": constants.userMessage.USER_DELETED, "statusFlag": 1 }     
                  }
                  else { 
                    responseData = "" 
                   }
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


//create Jobcutting Print jwt 
module.exports.printJobCuttingJwt = async (req) => {
  try {
      const token = await commonService.jwtCreate(req);
      return { token };

  } catch (error) {
      throw new Error(error);
  }
}
//create Jobcutting Print
module.exports.printJobCutting = async (req) => {
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
          const { job_cutting_id } = decoded.data;
          if (decoded) {
              const jobCutting_Result = await client.query(`SELECT DISTINCT a.job_cutting_date,a.job_cutting_id,b.job_cutting_set,b.job_cutting_pieces,b.total_amount,a.job_cutting_seq_no,a.employee_id,
              c.employee_name,a.machine_id,e.machine_no,a.status_id,g.status_name, extract(day from CURRENT_DATE::timestamp - a.job_cutting_date::date ) as noofdays,a.salary_status_id,a.completed_date from tbl_job_cutting AS a INNER JOIN tbl_job_cutting_item_details AS b 
              ON a.job_cutting_id = b.job_cutting_id INNER JOIN tbl_employee_details AS c ON 
              a.employee_id = c.employee_id INNER JOIN tbl_def_item AS d ON b.item_id = d.item_id 
              INNER JOIN  tbl_machine AS e ON a.machine_id = e.machine_id INNER JOIN tbl_item_sizes 
              AS f ON f.size_id = b.size_id INNER JOIN tbl_def_status AS g ON g.status_id = a.status_id LEFT JOIN tbl_color AS h ON h.color_id = b.color_id WHERE a.job_cutting_id =` + job_cutting_id);

              const jobcutting_itemArray = await client.query(`SELECT c.item_name,b.item_id AS item_code, f.short_name,b.item_sub_category_id AS sub_category_id,b.design_id,b.size_id,d.start_size,
              d.end_size,d.qr_code,(b.job_cutting_set * b.job_cutting_pieces) as no_of_piece,b.job_cutting_set as qty,CASE WHEN a.salary_status_id = 0 THEN (SELECT price FROM tbl_item_sub_category 
              WHERE sub_category_id = b.item_sub_category_id) ELSE b.total_amount END AS price                 ,b.color_id,e.color_name,concat_ws(' - ', d.start_size, d.end_size) as size_name from tbl_job_cutting AS a INNER JOIN tbl_job_cutting_item_details AS b ON a.job_cutting_id = b.job_cutting_id  INNER JOIN tbl_def_item AS c ON b.item_id = c.item_id                          INNER JOIN tbl_item_sizes AS d ON d.size_id = b.size_id LEFT JOIN tbl_color AS 
              e ON e.color_id = b.color_id INNER JOIN tbl_item_sub_category as f on f.sub_category_id = 
              b.item_sub_category_id  WHERE a.job_cutting_id = ` + job_cutting_id)

              const company_Result = await client.query(`SELECT company_name,city from tbl_company`);
              let Company_Array = company_Result && company_Result.rows ? company_Result.rows : [];


               let jobcutting_item_Array = jobcutting_itemArray && jobcutting_itemArray.rows ? jobcutting_itemArray.rows : [];

              if (client) {
                  client.end();
              }
              let print_jobcutting_Array = jobCutting_Result && jobCutting_Result.rows ? jobCutting_Result.rows : [];
              print_jobcutting_Array[0]['ItemArray'] = jobcutting_item_Array
              responseData = { "PrintJobCuttingArray": print_jobcutting_Array, "PrintCompanyArray": Company_Array}
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
module.exports.fetchFilterDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Fetch Commonlist
module.exports.fetchFilterData = async (req) => {
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


        const item_Result = await client.query(`select item_id as value,item_name as label from tbl_def_item `);

       
        const allcolor_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_color 
        UNION ALL SELECT distinct a.color_id as value,color_name as label from tbl_color as a
        INNER JOIN tbl_job_cutting_item_details AS b on a.color_id = b.color_id 
        INNER JOIN tbl_job_cutting AS c on b.job_cutting_id = c.job_cutting_id order by value,label `);

        const employee_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_employee_details 
        UNION ALL  select  distinct a.employee_id as value,coalesce(b.machine_no,'')||' - '|| coalesce(a.employee_name,'')  
        as label from tbl_employee_details as a inner join tbl_machine as b on a.employee_id=b.employee_id 
        INNER JOIN tbl_job_cutting as c on a.employee_id=c.employee_id  and c.machine_id = b.machine_id
        where a.status_id = 1 `);

        

        const allitemgroup_Result = await client.query(`SELECT distinct 0 as value ,'All' as label 
        UNION ALL SELECT distinct a.item_id as value,item_name as label from tbl_def_item as
        a INNER JOIN tbl_job_cutting_item_details AS b on a.item_id = b.item_id 
        INNER JOIN tbl_job_cutting AS c on b.job_cutting_id = c.job_cutting_id `);


        const alldesign_Result = await client.query(`SELECT distinct 0 as value ,'All' as label FROM tbl_design UNION ALL 
        select distinct a.size_id as value,qr_code as label from 
        tbl_item_sizes as
        a INNER JOIN tbl_job_cutting_item_details AS b on a.size_id = b.size_id 
        INNER JOIN tbl_job_cutting AS c on b.job_cutting_id = c.job_cutting_id order by value,label`);


       
        if (client) {
          client.end();
        }
              
        let Employee_Array = employee_Result && employee_Result.rows ? employee_Result.rows : [];
        let Item_Array = item_Result && item_Result.rows ? item_Result.rows : [];
        let allcolor_Array = allcolor_Result && allcolor_Result.rows ? allcolor_Result.rows : [];
        let allitemgroup_Array = allitemgroup_Result && allitemgroup_Result.rows ? allitemgroup_Result.rows : [];
        const alldesign_Array = alldesign_Result && alldesign_Result.rows ? alldesign_Result.rows : [];
      
        responseData = {"EmployeeArray":Employee_Array,"ItemArray":Item_Array,"allcolorArray":allcolor_Array,"allitemgroupArray":allitemgroup_Array,"alldesignArray":alldesign_Array}

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