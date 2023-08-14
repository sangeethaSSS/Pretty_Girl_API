/****************************
 Developed by : Shiva Software Solutions
 File    : connection.js 
 Date    : 11-08-2022
 Purpose : Database connection
 * ********************** */
//PROD Database Connection
const connectionString ={
  user: 'postgres',
  host: '172.16.1.200',
  database: 'db_zityztyle_live',
  password: 'postgres',
  port: 5432,
}
module.exports = connectionString;