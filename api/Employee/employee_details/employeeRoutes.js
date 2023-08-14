

const express = require('express');
const router = express.Router();
const employeeController = require('./employeeController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const employeeSchema = require('./employeeSchema.js');

router.post('/savePersonalDetailsjwt',
joiSchemaValidation.validateBody(employeeSchema.savePersonalDetailsjwt),
employeeController.savePersonalDetailsjwt
)
router.post('/savePersonalDetails',
joiSchemaValidation.validateBody(employeeSchema.savePersonalDetails),
employeeController.savePersonalDetails
)
router.post('/saveContactDetailsjwt',
joiSchemaValidation.validateBody(employeeSchema.saveContactDetailsjwt),
employeeController.saveContactDetailsjwt
)
router.post('/saveContactDetails',
joiSchemaValidation.validateBody(employeeSchema.saveContactDetails),
employeeController.saveContactDetails
)

router.post('/SaveBankDetailsjwt',
joiSchemaValidation.validateBody(employeeSchema.SaveBankDetailsjwt), 
employeeController.SaveBankDetailsjwt
)
router.post('/SaveBankDetails',
joiSchemaValidation.validateBody(employeeSchema.SaveBankDetails),
employeeController.SaveBankDetails
)

router.post('/SaveHrDetailsjwt',
joiSchemaValidation.validateBody(employeeSchema.SaveHrDetailsjwt), 
employeeController.SaveHrDetailsjwt
)
router.post('/SaveHrDetails',
joiSchemaValidation.validateBody(employeeSchema.SaveHrDetails),
employeeController.SaveHrDetails
)

router.post('/employeeListjwt',
joiSchemaValidation.validateBody(employeeSchema.employeeListjwt), 
employeeController.employeeListjwt
)
router.post('/employeeList',
joiSchemaValidation.validateBody(employeeSchema.employeeList),
employeeController.employeeList
)

router.post('/editEmployeejwt',
joiSchemaValidation.validateBody(employeeSchema.editEmployeejwt), 
employeeController.editEmployeejwt
)
router.post('/editEmployee',
joiSchemaValidation.validateBody(employeeSchema.editEmployee),
employeeController.editEmployee
)
router.post('/deleteEmployeejwt',
joiSchemaValidation.validateBody(employeeSchema.deleteEmployeejwt), 
employeeController.deleteEmployeejwt
)
router.post('/deleteEmployee',
joiSchemaValidation.validateBody(employeeSchema.deleteEmployee),
employeeController.deleteEmployee
)
module.exports = router;