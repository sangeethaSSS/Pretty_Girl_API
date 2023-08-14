const express = require('express');
const router = express.Router();
const orderController = require('./orderController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const orderSchema = require('./orderSchema'); 
//Order Management Report
router.post('/customerWiseOrderListjwt',
joiSchemaValidation.validateBody(orderSchema.customerwiseOrderListjwt),
orderController.customerwiseOrderListjwt
)
router.post('/customerWiseOrderList',
joiSchemaValidation.validateBody(orderSchema.customerwiseOrderList),
orderController.customerwiseOrderList
)
//Order Management Report
router.post('/itemWiseOrderListjwt',
joiSchemaValidation.validateBody(orderSchema.itemwiseOrderListjwt),
orderController.itemwiseOrderListjwt
)
router.post('/itemWiseOrderList',
joiSchemaValidation.validateBody(orderSchema.itemwiseOrderList),
orderController.itemwiseOrderList
)
//Customer wise Management Report
router.post('/customer_OrderListjwt',
joiSchemaValidation.validateBody(orderSchema.customerOrderListjwt),
orderController.customerOrderListjwt
)
router.post('/customer_OrderList',
joiSchemaValidation.validateBody(orderSchema.customerOrderList),
orderController.customerOrderList
)
//Stock wise report
router.post('/currentStockListjwt',
joiSchemaValidation.validateBody(orderSchema.currentStockListjwt),
orderController.currentStockListjwt
)
router.post('/currentStockList',
joiSchemaValidation.validateBody(orderSchema.currentStockList),
orderController.currentStockList
)
//Master List
router.post('/reportMasterListjwt',
joiSchemaValidation.validateBody(orderSchema.reportMasterListjwt),
orderController.reportMasterListjwt
)
router.post('/reportMasterList',
joiSchemaValidation.validateBody(orderSchema.reportMasterList),
orderController.reportMasterList
)

//Item wise Order Management Report
router.post('/excelItemWiseOrderListjwt',
joiSchemaValidation.validateBody(orderSchema.excelItemWiseOrderListjwt),
orderController.excelItemWiseOrderListjwt
)
router.post('/excelItemWiseOrderList',
joiSchemaValidation.validateBody(orderSchema.excelItemWiseOrderList),
orderController.excelItemWiseOrderList
)
module.exports = router;