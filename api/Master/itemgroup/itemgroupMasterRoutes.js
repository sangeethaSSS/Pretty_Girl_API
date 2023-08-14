

const express = require('express');
const router = express.Router();
const itemgroupMasterController = require('./itemgroupMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const itemgroupMasterSchema = require('./itemgroupMasterSchema');

router.post('/itemgroupListjwt',
joiSchemaValidation.validateBody(itemgroupMasterSchema.itemgroupListjwt),
   itemgroupMasterController.itemgroupListjwt
)
router.post('/itemgroupList',
joiSchemaValidation.validateBody(itemgroupMasterSchema.itemgroupList),
itemgroupMasterController.itemgroupList
)
router.post('/saveItemgroupjwt',
joiSchemaValidation.validateBody(itemgroupMasterSchema.saveItemgroupjwt),
itemgroupMasterController.saveItemgroupjwt
)
router.post('/saveItemgroup',
joiSchemaValidation.validateBody(itemgroupMasterSchema.saveItemgroup),
itemgroupMasterController.saveItemgroup
)

router.post('/deleteItemgroupjwt',
joiSchemaValidation.validateBody(itemgroupMasterSchema.deleteItemgroupjwt), 
itemgroupMasterController.deleteItemgroupjwt
)
router.post('/deleteItemgroup',
joiSchemaValidation.validateBody(itemgroupMasterSchema.deleteItemgroup),
itemgroupMasterController.deleteItemgroup
)

module.exports = router;