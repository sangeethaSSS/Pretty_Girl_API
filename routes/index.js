// ./routes/index.js
/****************************
 Developed by : Shiva Software Solutions
 File    : index.js
 Author  : Prabhavathy
 Date    : 11-08-2022
 Purpose : Routing
 * ********************** */
var express = require('express');
const bodyParser = require('body-parser')
const itemgroupMaster = require('../api/Master/itemgroup/itemgroupMasterRoutes');
const login = require('../api/login/loginRoutes')
const common = require('../api/common/commonRoutes')
const company = require('../api/Master/company/companyMasterRoutes')
const item = require('../api/Master/item/itemMasterRoutes')
const color = require('../api/Master/color/colorMasterRoutes')
const agent = require('../api/Master/agent/agentMasterRoutes')
const user = require('../api/Master/user/userMasterRoutes')
const ironmachine = require('../api/Master/ironmachine/ironmachineMasterRoute')
const designation = require('../api/Employee/designation/designationMasterRoutes')
const department = require('../api/Employee/department/departmentMasterRoutes')
const machine = require('../api/Production/machine/machineMasterRoutes')
const employee = require('../api/Employee/employee_details/employeeRoutes')
const design = require('../api/Production/design/designMasterRoutes')
const jobcard = require('../api/Production/jobcard/jobcardRoutes')
const ratecard = require('../api/Production/ratecard/ratecardRoutes')
const salaryprocess = require('../api/Payroll/process/processRoutes')
const salarypayout = require('../api/Payroll/payout/payoutRoutes')
const report = require('../api/Report/report/reportRoutes')
const order_report = require('../api/Report/orderManagement/orderRoutes')
const sync = require('../api/AppSync/appRoutes')
const ItemManagement = require('../api/OrderManagement/ItemManagement/itemManagementRoutes')
const CustomerManagement = require('../api/OrderManagement/CustomerManagement/customerManagementRoutes')
const OrderTaking = require('../api/OrderManagement/OrderTaking/orderTakingRoutes') 
const Boxing = require('../api/Dispatch/boxing/boxingRoutes')
const Dispatch = require('../api/Dispatch/dispatch/dispatchRoutes')
const GoodsReturn = require('../api/Dispatch/goodsReturn/goodsReturnRoutes')
module.exports = app => {
  app.use('/api/common', common);
  app.use('/api/loginRoutes', login);
  app.use('/api/master/company',company);
  app.use('/api/master/itemgroup', itemgroupMaster);
  app.use('/api/master/item', item);
  app.use('/api/master/color', color);
  app.use('/api/master/agent', agent);
  app.use('/api/master/user', user);
  app.use('/api/master/ironmachine', ironmachine);
  app.use('/api/employee/designation', designation);
  app.use('/api/employee/department', department);
  app.use('/api/employee', employee);
  app.use('/api/production/machine', machine);
  app.use('/api/production/design', design);
  app.use('/api/production/jobcard', jobcard);
  app.use('/api/production/ratecard', ratecard);
  app.use('/api/payroll/process', salaryprocess);
  app.use('/api/payroll/payout',salarypayout);
  app.use('/api/report',report);
  app.use('/api/orderManagement/itemManagement',ItemManagement);
  app.use('/api/orderManagement/orderTaking', OrderTaking);
  app.use('/api/orderreport',order_report);
  app.use('/api/orderManagement/customerManagement',CustomerManagement);
   app.use(express.static('image/design_photography'));
  app.use('/api',sync);
  app.use('/api/dispatch',Boxing);
  app.use('/api/dispatched',Dispatch);
  app.use('/api/goodsReturn',GoodsReturn);
  
  
  // etc..
}

const app = express();
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true,
  limit: '500mb',
parameterLimit: 10000000 }))

// parse application/json
app.use(bodyParser.json({
  limit: '500mb',
  parameterLimit: 10000000
  }));