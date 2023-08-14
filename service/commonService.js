/****************************
 Developed by : Shiva Software Solutions
 File    : commonService.js
 Date    : 11.08.2022
 Purpose : commonService 
 * ********************** */

const constants = require('../constants');
const jwt = require('jsonwebtoken');
const connectionString = require('../database/connection');
var AWS = require('aws-sdk');
const crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var algorithm_sha = 'sha256';
var password = 'd6F3Efeq';
//Connect Postgres
const { Client } = require('pg');
//Verify JWT Token
module.exports.jwtVerify = async function (jwtToken) {
  try {
    const token = jwtToken.trim();
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'my-secret-key');
    return decoded;
  } catch (error) {
    throw new Error(error);
  }
}

//Create JWT Token 
module.exports.jwtCreate = async function (data) {
  try {
    const token = jwt.sign({ data }, process.env.SECRET_KEY || 'my-secret-key', { expiresIn: '3h' });
    return token;
  } catch (error) {
    throw new Error(error);
  }
}

//Check UserID  
module.exports.checkUserId = async function (req) {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port
  })
  await client.connect()
  try {
    const { userCode } = req;
    const result = await client.query('select count(*) from  "tbl_user" where "user_id"=$1', [userCode])
    let count = result && result.rows[0] && result.rows[0].count ? Number(result.rows[0].count) : 0;
    return count;
  } catch (error) {
    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}
//Decrypt password
module.exports.decryptpassword = async function ({ pwd }) {
  try {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(pwd, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  } catch (error) {
    throw new Error(error);
  }
}


//Encrypt password
module.exports.encryptpassword = async function ({ pwd }) {
  try {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(pwd, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  } catch (error) {
    throw new Error(error);
  }
}

//Encrypt password
module.exports.appencryptpassword = async function ({ pwd }) {
  try {
    var hash = crypto.createHash("sha256");
    hash.update(pwd);
    hash = hash.digest("hex")
    return hash;
  } catch (error) {
    throw new Error(error);
  }
}


//insert userlog 
module.exports.insertLogs = async function (user_id, originator) {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port
  })
  await client.connect()
  try {
    const result = await client.query(`INSERT INTO "tbl_userlog" ("user_id","log_date","originator") VALUES($1, CURRENT_TIMESTAMP, $2) RETURNING autonum`, [user_id, originator]);
    return result.rows[0].autonum;
  } catch (error) {
    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}

//get fnyearcode  
module.exports.fnyearcode = async function (req) {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port
  })
  await client.connect()
  try {
    const checkdate = req.date;
    const fn_result = await client.query(`SELECT financialyearcode as fnyearcode, financialyear FROM tblfinancialyear
    WHERE '` + checkdate + `' >= TO_DATE(to_char(fromdate,'YYYY-MM-DD'),'YYYY-MM-DD')  and 
    '` + checkdate + `' >= TO_DATE(to_char(fromdate,'YYYY-MM-DD'),'YYYY-MM-DD')`)
    let fn_year_code = fn_result && fn_result.rows[0] && fn_result.rows[0].fnyearcode ? Number(fn_result.rows[0].fnyearcode) : 0;
    return fn_year_code;
  } catch (error) {
    throw new Error(error);
  } finally {
    if (client) { client.end(); }
  }
}