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

module.exports = router;