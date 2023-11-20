const express = require('express');
const router = express.Router();
const reportController = require('./reportController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const reportSchema = require('./reportSchema');

router.post('/pendingJobReportListjwt',
joiSchemaValidation.validateBody(reportSchema.pendingJobReportListjwt),
reportController.pendingJobReportListjwt
)
router.post('/pendingJobReportList',
joiSchemaValidation.validateBody(reportSchema.pendingJobReportList),
reportController.pendingJobReportList
)
router.post('/employeePerformanceReportListjwt',
joiSchemaValidation.validateBody(reportSchema.employeePerformanceReportListjwt),
reportController.employeePerformanceReportListjwt
)
router.post('/employeePerformanceReportList',
joiSchemaValidation.validateBody(reportSchema.employeePerformanceReportList),
reportController.employeePerformanceReportList
)
router.post('/payoutReportListjwt',
joiSchemaValidation.validateBody(reportSchema.payoutReportListjwt),
reportController.payoutReportListjwt
)
router.post('/payoutReportList',
joiSchemaValidation.validateBody(reportSchema.payoutReportList),
reportController.payoutReportList
)
router.post('/dashboardCountListjwt',
joiSchemaValidation.validateBody(reportSchema.dashboardCountListjwt),
reportController.dashboardCountListjwt
)
router.post('/dashboardCountList',
joiSchemaValidation.validateBody(reportSchema.dashboardCountList),
reportController.dashboardCountList
)
router.post('/specificEmployeeListjwt',
joiSchemaValidation.validateBody(reportSchema.specificEmployeeListjwt),
reportController.specificEmployeeListjwt
)
router.post('/specificEmployeeList',
joiSchemaValidation.validateBody(reportSchema.specificEmployeeList),
reportController.specificEmployeeList
)
router.post('/pendingListjwt',
joiSchemaValidation.validateBody(reportSchema.pendingListjwt),
reportController.pendingListjwt
)
router.post('/pendingList',
joiSchemaValidation.validateBody(reportSchema.pendingList),
reportController.pendingList
)

router.post('/pendingOrderReportListjwt',
joiSchemaValidation.validateBody(reportSchema.pendingOrderReportListjwt),
reportController.pendingOrderReportListjwt
)
router.post('/pendingOrderReportList',
joiSchemaValidation.validateBody(reportSchema.pendingOrderReportList),
reportController.pendingOrderReportList
)
router.post('/pendingOrderDropdownjwt',
joiSchemaValidation.validateBody(reportSchema.pendingOrderDropdownjwt),
reportController.pendingOrderDropdownjwt
)
router.post('/pendingOrderDropdown',
joiSchemaValidation.validateBody(reportSchema.pendingOrderDropdown),
reportController.pendingOrderDropdown
)

router.post('/dashboardListJwt',
joiSchemaValidation.validateBody(reportSchema.dashboardListJwt),
reportController.dashboardListJwt
)
router.post('/dashboardList',
joiSchemaValidation.validateBody(reportSchema.dashboardListJwt),
reportController.dashboardList
)
router.post('/customerRetailReportJwt',
joiSchemaValidation.validateBody(reportSchema.customerRetailReportJwt),
reportController.customerRetailReportJwt
)
router.post('/customerRetailReport',
joiSchemaValidation.validateBody(reportSchema.customerRetailReportJwt),
reportController.customerRetailReport
)
router.post('/GetCustomerDetailsJwt',
joiSchemaValidation.validateBody(reportSchema.GetCustomerDetailsJwt),
reportController.GetCustomerDetailsJwt
)
router.post('/GetCustomerDetails',
joiSchemaValidation.validateBody(reportSchema.GetCustomerDetailsJwt),
reportController.GetCustomerDetails
)
router.post('/GetDetailedOrdersJwt',
joiSchemaValidation.validateBody(reportSchema.GetDetailedOrdersJwt),
reportController.GetDetailedOrdersJwt
)
router.post('/GetDetailedOrders',
joiSchemaValidation.validateBody(reportSchema.GetDetailedOrdersJwt),
reportController.GetDetailedOrders
)
router.post('/employeePerformanceFilterListJwt',
joiSchemaValidation.validateBody(reportSchema.employeePerformanceFilterListJwt),
reportController.employeePerformanceFilterListJwt
)
router.post('/employeePerformanceFilterList',
joiSchemaValidation.validateBody(reportSchema.employeePerformanceFilterListJwt),
reportController.employeePerformanceFilterList
)

/******************* Employee Performance for job cutting *******************/

router.post('/employeeJobCuttingPerformanceFilterListJwt',
joiSchemaValidation.validateBody(reportSchema.employeeJobCuttingPerformanceFilterListJwt),
reportController.employeeJobCuttingPerformanceFilterListJwt
)
router.post('/employeeJobCuttingPerformanceFilterList',
joiSchemaValidation.validateBody(reportSchema.employeeJobCuttingPerformanceFilterListJwt),
reportController.employeeJobCuttingPerformanceFilterList
)

router.post('/employeeJobCuttingPerformanceReportListJwt',
joiSchemaValidation.validateBody(reportSchema.employeeJobCuttingPerformanceReportListJwt),
reportController.employeeJobCuttingPerformanceReportListJwt
)
router.post('/employeeJobCuttingPerformanceReportList',
joiSchemaValidation.validateBody(reportSchema.employeeJobCuttingPerformanceReportListJwt),
reportController.employeeJobCuttingPerformanceReportList
)

router.post('/specificJobCuttingEmployeeListJwt',
joiSchemaValidation.validateBody(reportSchema.specificJobCuttingEmployeeListJwt),
reportController.specificJobCuttingEmployeeListJwt
)
router.post('/specificJobCuttingEmployeeList',
joiSchemaValidation.validateBody(reportSchema.specificJobCuttingEmployeeListJwt),
reportController.specificJobCuttingEmployeeList
)

module.exports = router;