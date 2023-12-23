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
  database: 'db_pretty_girl',
  password: 'postgres',
  port: 5432,
  // user: 'postgres',
  // host: 'localhost',
  // database: 'dbprettygirl',
  // password: 'Shiva@88685',
  // port: 5432,
}
module.exports = connectionString;