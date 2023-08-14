const express = require('express');
const router = express.Router();
const processController = require('./processController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const processSchema = require('./processSchema');

router.post('/employeeListjwt',
joiSchemaValidation.validateBody(processSchema.employeeListjwt),
processController.employeeListjwt
)
router.post('/employeeList',
joiSchemaValidation.validateBody(processSchema.employeeList),
processController.employeeList
)

router.post('/saveProcessjwt',
joiSchemaValidation.validateBody(processSchema.saveProcessjwt),
processController.saveProcessjwt
)
router.post('/saveProcess',
joiSchemaValidation.validateBody(processSchema.saveProcess),
processController.saveProcess
)

router.post('/processListjwt',
joiSchemaValidation.validateBody(processSchema.processListjwt),
processController.processListjwt
)
router.post('/processList',
joiSchemaValidation.validateBody(processSchema.processList),
processController.processList
)

router.post('/editProcessjwt',
joiSchemaValidation.validateBody(processSchema.editProcessjwt),
processController.editProcessjwt
)
router.post('/editProcess',
joiSchemaValidation.validateBody(processSchema.editProcess),
processController.editProcess
)

router.post('/deleteProcessjwt',
joiSchemaValidation.validateBody(processSchema.deleteProcessjwt),
processController.deleteProcessjwt
)
router.post('/deleteProcess',
joiSchemaValidation.validateBody(processSchema.deleteProcess),
processController.deleteProcess
)

router.post('/payslipListjwt',
joiSchemaValidation.validateBody(processSchema.payslipListjwt),
processController.payslipListjwt
)
router.post('/payslipList',
joiSchemaValidation.validateBody(processSchema.payslipList),
processController.payslipList
)


module.exports = router;