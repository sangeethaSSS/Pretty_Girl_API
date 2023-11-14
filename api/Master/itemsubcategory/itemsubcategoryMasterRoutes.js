
const express = require('express');
const router = express.Router();
const itemsubcategoryMasterController = require('./itemsubcategoryMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const itemsubcategoryMasterSchema = require('./itemsubcategoryMasterSchema');

router.post('/itemsubcategoryFilterListJwt',
joiSchemaValidation.validateBody(itemsubcategoryMasterSchema.itemsubcategoryFilterListJwt),
itemsubcategoryMasterController.itemsubcategoryFilterListJwt
)
router.post('/itemsubcategoryFilterList',
joiSchemaValidation.validateBody(itemsubcategoryMasterSchema.itemsubcategoryFilterListJwt),
itemsubcategoryMasterController.itemsubcategoryFilterList
)

router.post('/saveItemSubCategoryJwt',
joiSchemaValidation.validateBody(itemsubcategoryMasterSchema.saveItemSubCategoryJwt),
itemsubcategoryMasterController.saveItemSubCategoryJwt
)
router.post('/saveItemSubCategory',
joiSchemaValidation.validateBody(itemsubcategoryMasterSchema.saveItemSubCategoryJwt),
itemsubcategoryMasterController.saveItemSubCategory
)

router.post('/itemGubCategoryListJwt',
joiSchemaValidation.validateBody(itemsubcategoryMasterSchema.itemGubCategoryListJwt),
itemsubcategoryMasterController.itemGubCategoryListJwt
)
router.post('/itemGubCategoryList',
joiSchemaValidation.validateBody(itemsubcategoryMasterSchema.itemGubCategoryListJwt),
itemsubcategoryMasterController.itemGubCategoryList
)

router.post('/deleteItemSubgroupJwt',
joiSchemaValidation.validateBody(itemsubcategoryMasterSchema.deleteItemSubgroupJwt),
itemsubcategoryMasterController.deleteItemSubgroupJwt
)
router.post('/deleteItemSubgroup',
joiSchemaValidation.validateBody(itemsubcategoryMasterSchema.deleteItemSubgroupJwt),
itemsubcategoryMasterController.deleteItemSubgroup
)



module.exports = router;