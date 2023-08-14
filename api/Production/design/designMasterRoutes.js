const express = require('express');
const router = express.Router();
const designMasterController = require('./designMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const designMasterSchema = require('./designMasterSchema');

router.post('/designListjwt',
joiSchemaValidation.validateBody(designMasterSchema.designListjwt),
designMasterController.designListjwt
)
router.post('/designList',
joiSchemaValidation.validateBody(designMasterSchema.designList),
designMasterController.designList
)
router.post('/saveDesignjwt',
joiSchemaValidation.validateBody(designMasterSchema.saveDesignjwt),
designMasterController.saveDesignjwt
)
router.post('/saveDesign',
joiSchemaValidation.validateBody(designMasterSchema.saveDesign),
designMasterController.saveDesign
)

router.post('/deleteDesignjwt',
joiSchemaValidation.validateBody(designMasterSchema.deleteDesignjwt), 
designMasterController.deleteDesignjwt
)
router.post('/deleteDesign',
joiSchemaValidation.validateBody(designMasterSchema.deleteDesign),
designMasterController.deleteDesign
)
router.post('/designPhotography',
joiSchemaValidation.validateBody(designMasterSchema.designPhotography),
designMasterController.designPhotography
)

router.post('/editdesignjwt',
joiSchemaValidation.validateBody(designMasterSchema.editdesignjwt), 
designMasterController.editdesignjwt
)
router.post('/editdesign',
joiSchemaValidation.validateBody(designMasterSchema.editdesign),
designMasterController.editdesign
)
module.exports = router;