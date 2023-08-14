/****************************
 File    : designMasterService.js
 Author  : Prabhavathy
 Date    : 7-09-2022
 Purpose : Design Master Service 
 * ********************** */
const connectionString = require('../database/connection');
const commonService = require('../service/commonService');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
//Connect Postgres
const { Client } = require('pg');
const fs = require('fs');


//create Design List jwt 
module.exports.designListjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Design LIST
module.exports.designList = async (req) => {
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
      const {status_id} = decoded.data;
      var status = '';
      if (decoded) {
          if(status_id == 0)
          {
              status = ' 1=1'
          }
          else{
              status = ` a.status_id = ` + status_id
          }
        const design_Result = await client.query(`select a.design_id,a.piece_rate,a.design_no,a.status_id,b.status_name,(select user_name from tbl_user where user_id = (select user_id from tbl_userlog  where autonum = a.maker_id limit 1)) as employeename,(select coalesce(to_char(log_date,'DD-MM-YYYY HH12:MI PM'),'') from tbl_userlog where autonum = a.maker_id limit 1) as createddate from tbl_design as a  inner join tbl_def_status as b on a.status_id = b.status_id where `+ status +` order by created_date desc` );
        if (client) {
          client.end();
        }

        let Design_Array = design_Result && design_Result.rows ? design_Result.rows : [];

        responseData = { "DesignArray": Design_Array }
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

//create Design jwt 
module.exports.saveDesignjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}


//create Design service
module.exports.saveDesign = async (req) => {
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
      const { design_id, design_no, status_id, user_id,piece_rate} = decoded.data;
      if (decoded) {
        const exit_count = await client.query(`select count(*) as count FROM tbl_design where lower(design_no) = lower('` + design_no + `') and design_id != ` + design_id)
        var exit_check = exit_count && exit_count.rows[0].count
        if (exit_check > 0) {
          return response = { "message": constants.userMessage.DESIGN_DUPLICATION, "statusFlag": 2, "design_id":0};
        }
        else{
          if (design_id == 0) {
            var makerid = await commonService.insertLogs(user_id, "Insert Design");
            const max = await client.query(`select coalesce(max(design_id),0) + 1 as mr FROM tbl_design`)
            var maxdesign = max && max.rows[0].mr;
            const result = await client.query(`INSERT INTO tbl_design (design_id,design_no,status_id,user_id,maker_id,piece_rate,created_date) values ($1, $2, $3,$4,$5,$6,CURRENT_TIMESTAMP) `, [maxdesign, design_no, status_id, user_id, makerid,piece_rate]);
            if (client) {
              client.end();
            }
            let create_code = result && result.rowCount ? result.rowCount : 0;
            if (create_code == 1) {
              return response = { "message": constants.userMessage.USER_CREATED, "statusFlag": 1, "design_id":maxdesign };
            }
            else { return '' }
          }
          else {
            var makerid = await commonService.insertLogs(user_id, "Update Design");
            const count = await client.query(`select count(*) as count FROM tbl_design where design_id =` + design_id)
            var count_Check = count && count.rows[0].count
            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
              const update_result = await client.query(`UPDATE "tbl_design" set design_no=$1,status_id=$2,user_id=$3,maker_id=$4,piece_rate=$5,updated_date=CURRENT_TIMESTAMP where design_id = $6 `, [design_no, status_id, user_id, makerid,piece_rate, design_id]);

              if (client) {
                client.end();
              }
              let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
              if (update_code == 1) {
                return response = { "message": constants.userMessage.USER_UPDATED, "statusFlag": 1, "design_id":design_id };
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

//Delete Design jwt 
module.exports.deleteDesignjwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    throw new Error(error);
  }
}

//Delete Design service
module.exports.deleteDesign = async (req) => {
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
      const { user_id, design_id } = decoded.data;
      if (decoded) {
        var fs = require('fs');
        var direction = './image/design_photography/' + design_id;

        const design_Count = await client.query(`select count(*) as count FROM tbl_job_details where design_id =` + design_id)
        var design_Check = design_Count && design_Count.rows[0].count;
        if (design_Check == 0 || design_Check == '0') {
          const group_Count = await client.query(`select count(*) as count FROM tbl_design where design_id =` + design_id)
          var count_Check = group_Count && group_Count.rows[0].count;
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            await commonService.insertLogs(user_id, "Delete Design");
            const image_result = await client.query(`DELETE FROM tbl_design_photography where design_id = $1 `,[design_id]);
            const delete_result = await client.query(`DELETE FROM tbl_design where design_id = $1 `,
              [design_id]);
              if (fs.existsSync(direction)) {
                  fs.rmdir(direction, { recursive: true }, err => {
                    if (err) {
                      throw err
                    }
                    console.log("Folder Deleted!");
                  })
              }
              else {
                console.log("DOES NOT exist:");
            }
            if (client) {
              client.end();
            }
            let deletecode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
             let code = image_result && image_result.rowCount ? image_result.rowCount : 0;
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


module.exports.designPhotography = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        const { image_array, design_id,user_id,delete_array} = req;
        var fs = require('fs');
        // var path = require('path');
        var direction = './image/design_photography/' + design_id;
        if (!fs.existsSync(direction)) {
            fs.mkdirSync(direction);
        }
        else {
            if (delete_array && delete_array.length > 0) {
                for (let i = 0; i < delete_array.length; i++) {
                     await this.remove_file(direction, design_id, delete_array[i]);
                }
            }
        }
        if (image_array && image_array.length > 0) {
            var imagearray = image_array
            for (let i = 0; i < imagearray.length; i++) {
                await this.insert_image(direction, i, imagearray[i], design_id,user_id)
            }
        }
        if (client) {
            client.end();
        }
        responseData = { "message": constants.userMessage.UPLOAD_IMAGE, "uploadstatus":true}
        return responseData
    }
    catch (error) {
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

module.exports.insert_image = async function (direction, i, imageArray, design_id,user_id) {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        var fs = require('fs');
        var makerid = await commonService.insertLogs(user_id, "Insert DesignPhotography");
        var time_stemp = new Date().getTime();
        var dataString = imageArray.fileArray;
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        await fs.writeFile(direction + '/' + design_id + '_' + time_stemp + '_' + [i + 1] + '_' + imageArray.fileName, response.data, function (err) {
            console.log("The file was saved!");
        })
        const image_max = await client.query(`select coalesce (max(image_id),0) + 1 as mr FROM tbl_design_photography`)
        var imageid = image_max && image_max.rows[0].mr;
        await client.query(`INSERT INTO "tbl_design_photography"(image_id,design_id,file_type,image_name,user_id,maker_id,created_date) values ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP) `, [imageid,design_id,imageArray.fileType,design_id + '_' + time_stemp + '_' + [i + 1] + '_' + imageArray.fileName, user_id, makerid]);
    } catch (error) {
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}


module.exports.remove_file = async function (direction, design_id, deleteArray) {
  const client = new Client({
      user: connectionString.user,
      host: connectionString.host,
      database: connectionString.database,
      password: connectionString.password,
      port: connectionString.port,
  });
  await client.connect();
  try {
      var fs = require('fs');
      if (fs.existsSync(direction + '/' + deleteArray.name)) {
        fs.unlink(direction + '/' + deleteArray.name, async (err) => {
          if (err) throw err;
          // if no error, file has been deleted successfully
          else {
            console.log('File deleted!');
            await client.query(`DELETE FROM tbl_design_photography where image_name = $1 and design_id = $2`, [deleteArray.name, design_id])
        }
        });
      }
      else {
        console.log("DOES NOT exist:");
    }
    return;
  } catch (error) {
      if (client) { client.end(); }
      throw new Error(error);
  }
  finally {
      // if (client) { client.end(); }// always close the resource
  }
}

//create Design EDit jwt 
module.exports.editdesignjwt = async (req) => {
    try {
      const token = await commonService.jwtCreate(req);
      return { token };
  
    } catch (error) {
      throw new Error(error);
    }
  }
  //create Design EDit
  module.exports.editdesign = async (req) => {
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
        const {design_id} = decoded.data;
        if (decoded) {
          const image_Result = await client.query(`select a.image_id,a.design_id,a.image_name as name,a.file_type as type from tbl_design_photography as a where a.design_id = ` + design_id);
          if (client) {
            client.end();
          }
          let Image_Array = image_Result && image_Result.rows ? image_Result.rows : [];
          responseData = { "ImageArray": Image_Array }
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