

const express = require('express');
const router = express.Router();
const boxingController = require('./boxingController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const boxingSchema = require('./boxingSchema');

router.post('/itemListjwt',
    joiSchemaValidation.validateBody(boxingSchema.itemListjwt),
    boxingController.itemListjwt
)
router.post('/itemList',
    joiSchemaValidation.validateBody(boxingSchema.itemList),
    boxingController.itemList
) 
router.post('/getFGJobIdListjwt',
    joiSchemaValidation.validateBody(boxingSchema.getFGJobIdListjwt),
    boxingController.getFGJobIdListjwt
)
router.post('/getFGJobIdList',
    joiSchemaValidation.validateBody(boxingSchema.getFGJobIdListjwt),
    boxingController.getFGJobIdList
) 
router.post('/getFGListJwt',
    joiSchemaValidation.validateBody(boxingSchema.getFGListJwt),
    boxingController.getFGListJwt
)
router.post('/getFGList',
    joiSchemaValidation.validateBody(boxingSchema.getFGListJwt),
    boxingController.getFGList
) 
router.post('/getCurrentStockJwt',
    joiSchemaValidation.validateBody(boxingSchema.getCurrentStockJwt),
    boxingController.getCurrentStockJwt
)
router.post('/getCurrentStock',
    joiSchemaValidation.validateBody(boxingSchema.getCurrentStockJwt),
    boxingController.getCurrentStock
) 

router.post('/moveToFGjwt',
    joiSchemaValidation.validateBody(boxingSchema.moveToFGjwt),
    boxingController.moveToFGjwt
)
router.post('/moveToFG',
    joiSchemaValidation.validateBody(boxingSchema.moveToFGjwt),
    boxingController.moveToFG
)
module.exports = router;