

const express = require('express');
const router = express.Router();
const designationMasterController = require('./designationMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const designationMasterSchema = require('./designationMasterSchema');

router.post('/designationListjwt',
joiSchemaValidation.validateBody(designationMasterSchema.designationListjwt),
designationMasterController.designationListjwt
)
router.post('/designationList',
joiSchemaValidation.validateBody(designationMasterSchema.designationList),
designationMasterController.designationList
)
router.post('/saveDesignationjwt',
joiSchemaValidation.validateBody(designationMasterSchema.saveDesignationjwt),
designationMasterController.saveDesignationjwt
)
router.post('/saveDesignation',
joiSchemaValidation.validateBody(designationMasterSchema.saveDesignation),
designationMasterController.saveDesignation
)

router.post('/deleteDesignationjwt',
joiSchemaValidation.validateBody(designationMasterSchema.deleteDesignationjwt), 
designationMasterController.deleteDesignationjwt
)
router.post('/deleteDesignation',
joiSchemaValidation.validateBody(designationMasterSchema.deleteDesignation),
designationMasterController.deleteDesignation
)

module.exports = router;