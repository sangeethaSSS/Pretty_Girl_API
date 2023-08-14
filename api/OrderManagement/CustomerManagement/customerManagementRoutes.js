

const express = require('express');
const router = express.Router();
const customerManagementController = require('./customerManagementController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const customerManagementSchema = require('./customerManagementSchema');


router.post('/saveCustomerJwt',
joiSchemaValidation.validateBody(customerManagementSchema.saveCustomerManagementjwt),
customerManagementController.saveCustomerManagementjwt
)
router.post('/saveCustomer',
joiSchemaValidation.validateBody(customerManagementSchema.saveCustomerManagement),
customerManagementController.saveCustomerManagement
)

router.post('/getCustomersJwt',
joiSchemaValidation.validateBody(customerManagementSchema.getCustomersJwt), 
customerManagementController.getCustomersJwt
)
router.post('/getCustomers',
joiSchemaValidation.validateBody(customerManagementSchema.getCustomers),
customerManagementController.getCustomers
)

router.post('/updateCustomerJwt',
joiSchemaValidation.validateBody(customerManagementSchema.updateCustomerJwt), 
customerManagementController.updateCustomerJwt
)
router.post('/updateCustomer',
joiSchemaValidation.validateBody(customerManagementSchema.updateCustomer),
customerManagementController.updateCustomer
)

router.post('/deleteCustomerJwt',
joiSchemaValidation.validateBody(customerManagementSchema.deleteCustomerJwt), 
customerManagementController.deleteCustomerJwt
)
router.post('/deleteCustomer',
joiSchemaValidation.validateBody(customerManagementSchema.deleteCustomer),
customerManagementController.deleteCustomer
)

router.post('/getCustomerDetailsJwt',
joiSchemaValidation.validateBody(customerManagementSchema.getCustomerDetailsJwt), 
customerManagementController.getCustomerDetailsJwt
)
router.post('/getCustomerDetails',
joiSchemaValidation.validateBody(customerManagementSchema.getCustomerDetails),
customerManagementController.getCustomerDetails
)


module.exports = router;