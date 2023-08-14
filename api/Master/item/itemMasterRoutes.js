

const express = require('express');
const router = express.Router();
const itemMasterController = require('./itemMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const itemMasterSchema = require('./itemMasterSchema');

router.post('/itemListjwt',
joiSchemaValidation.validateBody(itemMasterSchema.itemListjwt),
itemMasterController.itemListjwt
)
router.post('/itemList',
joiSchemaValidation.validateBody(itemMasterSchema.itemList),
itemMasterController.itemList
)
router.post('/saveItemjwt',
joiSchemaValidation.validateBody(itemMasterSchema.saveItemjwt),
itemMasterController.saveItemjwt
)
router.post('/saveItem',
joiSchemaValidation.validateBody(itemMasterSchema.saveItem),
itemMasterController.saveItem
)

router.post('/editItemjwt',
joiSchemaValidation.validateBody(itemMasterSchema.editItemjwt), 
itemMasterController.editItemjwt
)
router.post('/editItem',
joiSchemaValidation.validateBody(itemMasterSchema.editItem),
itemMasterController.editItem
)

router.post('/deleteItemjwt',
joiSchemaValidation.validateBody(itemMasterSchema.deleteItemjwt), 
itemMasterController.deleteItemjwt
)
router.post('/deleteItem',
joiSchemaValidation.validateBody(itemMasterSchema.deleteItem),
itemMasterController.deleteItem
)

router.post('/sizeListjwt',
joiSchemaValidation.validateBody(itemMasterSchema.sizeListjwt), 
itemMasterController.sizeListjwt
)
router.post('/sizeList',
joiSchemaValidation.validateBody(itemMasterSchema.sizeList),
itemMasterController.sizeList
)
module.exports = router;