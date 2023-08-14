

const express = require('express');
const router = express.Router();
const colorMasterController = require('./colorMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const colorMasterSchema = require('./colorMasterSchema');

router.post('/colorListjwt',
joiSchemaValidation.validateBody(colorMasterSchema.colorListjwt),
   colorMasterController.colorListjwt
)
router.post('/colorList',
joiSchemaValidation.validateBody(colorMasterSchema.colorList),
colorMasterController.colorList
)
router.post('/saveColorjwt',
joiSchemaValidation.validateBody(colorMasterSchema.saveColorjwt),
colorMasterController.saveColorjwt
)
router.post('/saveColor',
joiSchemaValidation.validateBody(colorMasterSchema.saveColor),
colorMasterController.saveColor
)

router.post('/deleteColorjwt',
joiSchemaValidation.validateBody(colorMasterSchema.deleteColorjwt), 
colorMasterController.deleteColorjwt
)
router.post('/deleteColor',
joiSchemaValidation.validateBody(colorMasterSchema.deleteColor),
colorMasterController.deleteColor
)

module.exports = router;