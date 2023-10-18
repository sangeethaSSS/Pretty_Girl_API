

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

router.post('/ShowCustomerOrdersjwt',
joiSchemaValidation.validateBody(orderTakingSchema.ShowCustomerOrdersjwt),
orderTakingController.ShowCustomerOrdersjwt
)
router.post('/ShowCustomerOrders',
joiSchemaValidation.validateBody(orderTakingSchema.ShowCustomerOrders),
orderTakingController.ShowCustomerOrders
)

router.post('/ChangeAutoItemCodejwt',
joiSchemaValidation.validateBody(orderTakingSchema.ChangeAutoItemCodejwt),
orderTakingController.ChangeAutoItemCodejwt
)
router.post('/ChangeAutoItemCode',
joiSchemaValidation.validateBody(orderTakingSchema.ChangeAutoItemCode),
orderTakingController.ChangeAutoItemCode
)
router.post('/getCurrentOrderStockJwt',
joiSchemaValidation.validateBody(orderTakingSchema.getCurrentOrderStockJwt),
orderTakingController.getCurrentOrderStockJwt
)
router.post('/getCurrentOrderStock',
joiSchemaValidation.validateBody(orderTakingSchema.getCurrentOrderStock),
orderTakingController.getCurrentOrderStock
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

router.post('/orderToWhatsappListjwt',
joiSchemaValidation.validateBody(orderTakingSchema.orderToWhatsappListjwt),
orderTakingController.orderToWhatsappListjwt
)
router.post('/orderToWhatsappList',
joiSchemaValidation.validateBody(orderTakingSchema.orderToWhatsappList),
orderTakingController.orderToWhatsappList
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
router.post('/sendOrderToWhatsappJwt',
joiSchemaValidation.validateBody(orderTakingSchema.sendOrderToWhatsappJwt),
orderTakingController.sendOrderToWhatsappJwt
)
router.post('/sendOrderToWhatsapp',
joiSchemaValidation.validateBody(orderTakingSchema.sendOrderToWhatsapp),
orderTakingController.sendOrderToWhatsapp
)


router.post('/holdOrderTakingJwt',
joiSchemaValidation.validateBody(orderTakingSchema.holdOrderTakingJwt),
orderTakingController.holdOrderTakingJwt
)
router.post('/holdOrderTaking',
joiSchemaValidation.validateBody(orderTakingSchema.holdOrderTakingJwt),
orderTakingController.holdOrderTaking
)

router.post('/updateBlockCustomerJwt',
joiSchemaValidation.validateBody(orderTakingSchema.updateBlockCustomerJwt),
orderTakingController.updateBlockCustomerJwt
)
router.post('/updateBlockCustomer',
joiSchemaValidation.validateBody(orderTakingSchema.updateBlockCustomerJwt),
orderTakingController.updateBlockCustomer
)

module.exports = router;