const express = require('express');
const router = express.Router();
const joiSchemaValidation = require('../../middleware/joiSchemaValidation')
const loginSchema = require('./appSchema')
const appController = require('./appController')

//Get User Master
router.post('/getUserMasterJwt',
joiSchemaValidation.validateBody(loginSchema.userMasterJwt),
appController.createJwtToken
)

router.post('/getUserMaster',
joiSchemaValidation.validateBody(loginSchema.userMasterJwt),
appController.getUserMaster
)

//Insert sync details 
router.post('/insertSyncDetails',
joiSchemaValidation.validateBody(loginSchema.syncDetails),
appController.syncDetails
)

//Insert Customer
router.post('/insertCustomerJwt',
joiSchemaValidation.validateBody(loginSchema.customerSchema),
appController.createJwtToken
)

router.post('/insertCustomer',
joiSchemaValidation.validateBody(loginSchema.customerSchema),
appController.insertCustomer
)


//delete Customer
router.post('/deleteCustomerJwt',
joiSchemaValidation.validateBody(loginSchema.customerSchema),
appController.createJwtToken
)

router.post('/deleteCustomer',
joiSchemaValidation.validateBody(loginSchema.customerSchema),
appController.deleteCustomer
)


//Get Masters
router.post('/getMastersJwt',
joiSchemaValidation.validateBody(loginSchema.masterSchema),
appController.createJwtToken
)

router.post('/getMasters',
joiSchemaValidation.validateBody(loginSchema.masterSchema),
appController.getMaster
)


//Get Items
router.post('/getItemsJwt',
joiSchemaValidation.validateBody(loginSchema.masterSchema),
appController.createJwtToken
)

router.post('/getItems',
joiSchemaValidation.validateBody(loginSchema.masterSchema),
appController.getItemManagement
)



//Sync Customer Data
router.post('/getCustomersJwt',
joiSchemaValidation.validateBody(loginSchema.masterSchema),
appController.createJwtToken
)

router.post('/getCustomers',
joiSchemaValidation.validateBody(loginSchema.masterSchema),
appController.getCustomer
)

//Delete sync details
router.post('/syncDeleteSchemaJwt',
joiSchemaValidation.validateBody(loginSchema.syncDeleteSchema),
appController.createJwtToken
)
router.post('/syncDeleteSchema',
joiSchemaValidation.validateBody(loginSchema.syncDeleteSchema),
appController.syncDeleteSchema
)


//Insert Order Taking
router.post('/insertOrderTakingJwt',
joiSchemaValidation.validateBody(loginSchema.orderSchema),
appController.createJwtToken
)

router.post('/insertOrderTaking',
joiSchemaValidation.validateBody(loginSchema.orderSchema),
appController.insertOrderTaking
)


//Delete Order Taking
router.post('/deleteOrderTakingJwt',
joiSchemaValidation.validateBody(loginSchema.deleteOrderSchema),
appController.createJwtToken
)

router.post('/deleteOrderTaking',
joiSchemaValidation.validateBody(loginSchema.deleteOrderSchema),
appController.deleteOrderTaking
)


//Stock Transaction details
router.post('/stockTransactionJwt',
joiSchemaValidation.validateBody(loginSchema.stockTransaction),
appController.createJwtToken
)

router.post('/stockTransaction',
joiSchemaValidation.validateBody(loginSchema.stockTransaction),
appController.stockTransactionList
)

router.post('/checkStockDetails',
joiSchemaValidation.validateBody(loginSchema.checkStock),
appController.checkStockDetails
)
router.post('/OrderTakingCheck',
joiSchemaValidation.validateBody(loginSchema.OrderTakingCheck),
appController.OrderTakingCheck
)
router.post('/GetCurrentStock',
joiSchemaValidation.validateBody(loginSchema.getCurrentStock),
appController.GetCurrentStock
)
router.post('/GetDispatchReportList',
joiSchemaValidation.validateBody(loginSchema.GetDispatchReportList),
appController.GetDispatchReportList
)


//Hold Order Taking
router.post('/holdOrderTakingJwt',
joiSchemaValidation.validateBody(loginSchema.holdOrderSchema),
appController.createJwtToken
)

router.post('/holdOrderTaking',
joiSchemaValidation.validateBody(loginSchema.holdOrderSchema),
appController.holdOrderTaking
)


module.exports = router;