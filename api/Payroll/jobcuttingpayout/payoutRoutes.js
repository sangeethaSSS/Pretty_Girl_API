const express = require('express');
const router = express.Router();
const payoutContoller = require('./payoutContoller');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const payoutSchema = require('./payoutSchema');

router.post('/employeeProcessListjwt',
joiSchemaValidation.validateBody(payoutSchema.employeeProcessListjwt),
payoutContoller.employeeProcessListjwt
)
router.post('/employeeProcessList',
joiSchemaValidation.validateBody(payoutSchema.employeeProcessListjwt),
payoutContoller.employeeProcessList
)

router.post('/savePayoutjwt',
joiSchemaValidation.validateBody(payoutSchema.savePayoutjwt),
payoutContoller.savePayoutjwt
)
router.post('/savePayout',
joiSchemaValidation.validateBody(payoutSchema.savePayoutjwt),
payoutContoller.savePayout
)

router.post('/jobCuttingPayoutListjwt',
joiSchemaValidation.validateBody(payoutSchema.jobCuttingPayoutListjwt),
payoutContoller.jobCuttingPayoutListjwt
)
router.post('/jobCuttingPayoutList',
joiSchemaValidation.validateBody(payoutSchema.jobCuttingPayoutListjwt),
payoutContoller.jobCuttingPayoutList
)

router.post('/editPayoutjwt',
joiSchemaValidation.validateBody(payoutSchema.editPayoutjwt),
payoutContoller.editPayoutjwt
)
router.post('/editPayout',
joiSchemaValidation.validateBody(payoutSchema.editPayoutjwt),
payoutContoller.editPayout
)
router.post('/payoutslipListjwt',
joiSchemaValidation.validateBody(payoutSchema.payoutslipListjwt),
payoutContoller.payoutslipListjwt
)
router.post('/payoutslipList',
joiSchemaValidation.validateBody(payoutSchema.payoutslipList),
payoutContoller.payoutslipList
)
module.exports = router;