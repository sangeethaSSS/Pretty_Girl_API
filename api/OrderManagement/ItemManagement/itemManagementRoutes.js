

const express = require('express');
const router = express.Router();
const itemManagementController = require('./itemManagementController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const itemManagementSchema = require('./itemManagementSchema');

router.post('/itemManagementListjwt',
joiSchemaValidation.validateBody(itemManagementSchema.itemManagementListjwt),
itemManagementController.itemManagementListjwt
)
router.post('/itemManagementList',
joiSchemaValidation.validateBody(itemManagementSchema.itemManagementList),
itemManagementController.itemManagementList
)

router.post('/saveItemManagementjwt',
joiSchemaValidation.validateBody(itemManagementSchema.saveItemManagementjwt),
itemManagementController.saveItemManagementjwt
)
router.post('/saveItemManagement',
joiSchemaValidation.validateBody(itemManagementSchema.saveItemManagement),
itemManagementController.saveItemManagement
)

router.post('/editItemListjwt',
joiSchemaValidation.validateBody(itemManagementSchema.editItemListjwt), 
itemManagementController.editItemListjwt
)
router.post('/editItemList',
joiSchemaValidation.validateBody(itemManagementSchema.editItemList),
itemManagementController.editItemList
)

router.post('/CheckDesignNojwt',
joiSchemaValidation.validateBody(itemManagementSchema.CheckDesignNojwt),
itemManagementController.CheckDesignNojwt
)
router.post('/CheckDesignNo',
joiSchemaValidation.validateBody(itemManagementSchema.CheckDesignNo),
itemManagementController.CheckDesignNo
)

router.post('/deleteItemManagementjwt',
joiSchemaValidation.validateBody(itemManagementSchema.deleteItemManagementjwt),
itemManagementController.deleteItemManagementjwt
)
router.post('/deleteItemManagement',
joiSchemaValidation.validateBody(itemManagementSchema.deleteItemManagement),
itemManagementController.deleteItemManagement
)
router.post('/checkItemExistTransactionjwt',
joiSchemaValidation.validateBody(itemManagementSchema.checkItemExistTransactionjwt),
itemManagementController.checkItemExistTransactionjwt
)
router.post('/checkItemExistTransaction',
joiSchemaValidation.validateBody(itemManagementSchema.checkItemExistTransaction),
itemManagementController.checkItemExistTransaction
)


module.exports = router;