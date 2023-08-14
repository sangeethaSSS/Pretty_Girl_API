

const express = require('express');
const router = express.Router();
const departmentMasterController = require('./departmentMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const departmentMasterSchema = require('./departmentMasterSchema');

router.post('/departmentListjwt',
joiSchemaValidation.validateBody(departmentMasterSchema.departmentListjwt),
departmentMasterController.departmentListjwt
)
router.post('/departmentList',
joiSchemaValidation.validateBody(departmentMasterSchema.departmentList),
departmentMasterController.departmentList
)
router.post('/saveDepartmentjwt',
joiSchemaValidation.validateBody(departmentMasterSchema.saveDepartmentjwt),
departmentMasterController.saveDepartmentjwt
)
router.post('/saveDepartment',
joiSchemaValidation.validateBody(departmentMasterSchema.saveDepartment),
departmentMasterController.saveDepartment
)

router.post('/deleteDepartmentjwt',
joiSchemaValidation.validateBody(departmentMasterSchema.deleteDepartmentjwt), 
departmentMasterController.deleteDepartmentjwt
)
router.post('/deleteDepartment',
joiSchemaValidation.validateBody(departmentMasterSchema.deleteDepartment),
departmentMasterController.deleteDepartment
)

module.exports = router;