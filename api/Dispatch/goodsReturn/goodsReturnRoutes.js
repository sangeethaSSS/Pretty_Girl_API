const express = require('express');
const router = express.Router();
const goodsReturnController = require('./goodsReturnController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const goodsReturnSchema = require('./goodsReturnSchema');

router.post('/getGRCustomerListJwt',
    joiSchemaValidation.validateBody(goodsReturnSchema.getGRCustomerListJwt),
    goodsReturnController.getGRCustomerListJwt
)

router.post('/getGRCustomerList',
    joiSchemaValidation.validateBody(goodsReturnSchema.getGRCustomerListJwt),
    goodsReturnController.getGRCustomerList
) 

router.post('/getGRItemListJwt',
    joiSchemaValidation.validateBody(goodsReturnSchema.getGRItemListJwt),
    goodsReturnController.getGRItemListJwt
)

router.post('/getGRItemList',
    joiSchemaValidation.validateBody(goodsReturnSchema.getGRItemListJwt),
    goodsReturnController.getGRItemList
) 

router.post('/getDispatchListBasedOnItemCustomerJwt',
    joiSchemaValidation.validateBody(goodsReturnSchema.getDispatchListBasedOnItemCustomerJwt),
    goodsReturnController.getDispatchListBasedOnItemCustomerJwt
)

router.post('/getDispatchListBasedOnItemCustomer',
    joiSchemaValidation.validateBody(goodsReturnSchema.getDispatchListBasedOnItemCustomerJwt),
    goodsReturnController.getDispatchListBasedOnItemCustomer
) 
router.post('/saveGoodsReturnJwt',
    joiSchemaValidation.validateBody(goodsReturnSchema.saveGoodsReturnJwt),
    goodsReturnController.saveGoodsReturnJwt
)

router.post('/saveGoodsReturn',
    joiSchemaValidation.validateBody(goodsReturnSchema.saveGoodsReturnJwt),
    goodsReturnController.saveGoodsReturn
) 

router.post('/getGRListJwt',
    joiSchemaValidation.validateBody(goodsReturnSchema.getGRListJwt),
    goodsReturnController.getGRListJwt
)

router.post('/getGRList',
    joiSchemaValidation.validateBody(goodsReturnSchema.getGRListJwt),
    goodsReturnController.getGRList
) 

router.post('/getGRFilterListJwt',
    joiSchemaValidation.validateBody(goodsReturnSchema.getGRFilterListJwt),
    goodsReturnController.getGRFilterListJwt
)

router.post('/getGRFilterList',
    joiSchemaValidation.validateBody(goodsReturnSchema.getGRFilterListJwt),
    goodsReturnController.getGRFilterList
) 

router.post('/cancelGoodsReturnJwt',
    joiSchemaValidation.validateBody(goodsReturnSchema.cancelGoodsReturnJwt),
    goodsReturnController.cancelGoodsReturnJwt
)

router.post('/cancelGoodsReturn',
    joiSchemaValidation.validateBody(goodsReturnSchema.cancelGoodsReturnJwt),
    goodsReturnController.cancelGoodsReturn
) 


module.exports = router;