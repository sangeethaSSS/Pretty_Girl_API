

const express = require('express');
const router = express.Router();
const orderTakingController = require('./orderTakingController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const orderTakingSchema = require('./orderTakingSchema');


router.post('/ChangeAutoCompanyNamejwt',
joiSchemaValidation.validateBody(orderTakingSchema.ChangeAutoCompanyNamejwt),
orderTakingController.ChangeAutoCompanyNamejwt
)
router.post('/ChangeAutoCompanyName',
joiSchemaValidation.validateBody(orderTakingSchema.ChangeAutoCompanyName),
orderTakingController.ChangeAutoCompanyName
)

router.post('/ChangeAutoItemCodejwt',
joiSchemaValidation.validateBody(orderTakingSchema.ChangeAutoItemCodejwt),
orderTakingController.ChangeAutoItemCodejwt
)
router.post('/ChangeAutoItemCode',
joiSchemaValidation.validateBody(orderTakingSchema.ChangeAutoItemCode),
orderTakingController.ChangeAutoItemCode
)
router.post('/ChangeAutoItemNamejwt',
joiSchemaValidation.validateBody(orderTakingSchema.ChangeAutoItemNamejwt),
orderTakingController.ChangeAutoItemNamejwt
)
router.post('/ChangeAutoItemName',
joiSchemaValidation.validateBody(orderTakingSchema.ChangeAutoItemName),
orderTakingController.ChangeAutoItemName
)
router.post('/saveOrderTakingjwt',
joiSchemaValidation.validateBody(orderTakingSchema.saveOrderTakingjwt),
orderTakingController.saveOrderTakingjwt
)
router.post('/saveOrderTaking',
joiSchemaValidation.validateBody(orderTakingSchema.saveOrderTaking),
orderTakingController.saveOrderTaking
)

router.post('/orderTakingListjwt',
joiSchemaValidation.validateBody(orderTakingSchema.orderTakingListjwt),
orderTakingController.orderTakingListjwt
)
router.post('/orderTakingList',
joiSchemaValidation.validateBody(orderTakingSchema.orderTakingList),
orderTakingController.orderTakingList
)

router.post('/deleteOrderTakingjwt',
joiSchemaValidation.validateBody(orderTakingSchema.deleteOrderTakingjwt),
orderTakingController.deleteOrderTakingjwt
)
router.post('/deleteOrderTaking',
joiSchemaValidation.validateBody(orderTakingSchema.deleteOrderTaking),
orderTakingController.deleteOrderTaking
)

router.post('/customerListjwt',
joiSchemaValidation.validateBody(orderTakingSchema.customerListjwt),
orderTakingController.customerListjwt
)
router.post('/customerList',
joiSchemaValidation.validateBody(orderTakingSchema.customerList),
orderTakingController.customerList
)

router.post('/editOrderTakingjwt',
joiSchemaValidation.validateBody(orderTakingSchema.editOrderTakingjwt),
orderTakingController.editOrderTakingjwt
)
router.post('/editOrderTaking',
joiSchemaValidation.validateBody(orderTakingSchema.editOrderTaking),
orderTakingController.editOrderTaking
)

router.post('/printOrderSlipjwt',
joiSchemaValidation.validateBody(orderTakingSchema.printOrderSlipjwt),
orderTakingController.printOrderSlipjwt
)
router.post('/printOrderSlip',
joiSchemaValidation.validateBody(orderTakingSchema.printOrderSlip),
orderTakingController.printOrderSlip
)

router.post('/ChangeAutoDesignNamejwt',
joiSchemaValidation.validateBody(orderTakingSchema.ChangeAutoDesignNamejwt),
orderTakingController.ChangeAutoDesignNamejwt
)
router.post('/ChangeAutoDesignName',
joiSchemaValidation.validateBody(orderTakingSchema.ChangeAutoDesignName),
orderTakingController.ChangeAutoDesignName
)

router.post('/onChangeQtyjwt',
joiSchemaValidation.validateBody(orderTakingSchema.onChangeQtyjwt),
orderTakingController.onChangeQtyjwt
)
router.post('/onChangeQty',
joiSchemaValidation.validateBody(orderTakingSchema.onChangeQty),
orderTakingController.onChangeQty
)

module.exports = router;