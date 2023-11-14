const express = require('express');
const router = express.Router();
const processController = require('./processController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const processSchema = require('./processSchema');

router.post('/ViewjobCuttingsjwt',
joiSchemaValidation.validateBody(processSchema.ViewjobCuttingsjwt),
processController.ViewjobCuttingsjwt
)
router.post('/ViewjobCuttings',
joiSchemaValidation.validateBody(processSchema.ViewjobCuttingsjwt),
processController.ViewjobCuttings
)

router.post('/savejobCuttingProcessjwt',
joiSchemaValidation.validateBody(processSchema.savejobCuttingProcessjwt),
processController.savejobCuttingProcessjwt
)
router.post('/savejobCuttingProcess',
joiSchemaValidation.validateBody(processSchema.savejobCuttingProcessjwt),
processController.savejobCuttingProcess
)

router.post('/jobCuttingProcessListjwt',
joiSchemaValidation.validateBody(processSchema.jobCuttingProcessListjwt),
processController.jobCuttingProcessListjwt
)
router.post('/jobCuttingProcessList',
joiSchemaValidation.validateBody(processSchema.jobCuttingProcessListjwt),
processController.jobCuttingProcessList
)

router.post('/editProcessjwt',
joiSchemaValidation.validateBody(processSchema.editProcessjwt),
processController.editProcessjwt
)
router.post('/editProcess',
joiSchemaValidation.validateBody(processSchema.editProcessjwt),
processController.editProcess
)

router.post('/deleteProcessjwt',
joiSchemaValidation.validateBody(processSchema.deleteProcessjwt),
processController.deleteProcessjwt
)
router.post('/deleteProcess',
joiSchemaValidation.validateBody(processSchema.deleteProcessjwt),
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