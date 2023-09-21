

const express = require('express');
const router = express.Router();
const dispatchController = require('./dispatchController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const dispatchSchema = require('./dispatchSchema');

router.post('/itemCustomerWiseListJwt',
    joiSchemaValidation.validateBody(dispatchSchema.itemCustomerWiseListJwt),
    dispatchController.itemCustomerWiseListJwt
)
router.post('/itemCustomerWiseList',
    joiSchemaValidation.validateBody(dispatchSchema.itemCustomerWiseListJwt),
    dispatchController.itemCustomerWiseList
)   
router.post('/designListJwt',
    joiSchemaValidation.validateBody(dispatchSchema.designListJwt),
    dispatchController.designListJwt
)
router.post('/designList',
    joiSchemaValidation.validateBody(dispatchSchema.designListJwt),
    dispatchController.designList
)  
router.post('/saveItemWiseDispatchJwt',
    joiSchemaValidation.validateBody(dispatchSchema.saveItemWiseDispatchJwt),
    dispatchController.saveItemWiseDispatchJwt
)
router.post('/saveItemWiseDispatch',
    joiSchemaValidation.validateBody(dispatchSchema.saveItemWiseDispatchJwt),
    dispatchController.saveItemWiseDispatch
)  
router.post('/saveCustomerWiseDispatchJwt',
    joiSchemaValidation.validateBody(dispatchSchema.saveCustomerWiseDispatchJwt),
    dispatchController.saveCustomerWiseDispatchJwt
)
router.post('/saveCustomerWiseDispatch',
    joiSchemaValidation.validateBody(dispatchSchema.saveCustomerWiseDispatchJwt),
    dispatchController.saveCustomerWiseDispatch
)  
router.post('/dispatchListJwt',
    joiSchemaValidation.validateBody(dispatchSchema.dispatchJwt),
    dispatchController.dispatchListJwt
)
router.post('/dispatchList',
    joiSchemaValidation.validateBody(dispatchSchema.dispatchJwt),
    dispatchController.dispatchList
)  
router.post('/dispatchDropdownListJwt',
    joiSchemaValidation.validateBody(dispatchSchema.dispatchDropdownListJwt),
    dispatchController.dispatchDropdownListJwt
)
router.post('/dispatchDropdownList',
    joiSchemaValidation.validateBody(dispatchSchema.dispatchDropdownListJwt),
    dispatchController.dispatchDropdownList
)  
router.post('/dispatchDropdownListJwt',
    joiSchemaValidation.validateBody(dispatchSchema.dispatchDropdownListJwt),
    dispatchController.dispatchDropdownListJwt
)
router.post('/dispatchDropdownList',
    joiSchemaValidation.validateBody(dispatchSchema.dispatchDropdownListJwt),
    dispatchController.dispatchDropdownList
)
router.post('/cancelDispatchDataJwt',
    joiSchemaValidation.validateBody(dispatchSchema.cancelDispatchDataJwt),
    dispatchController.cancelDispatchDataJwt
)
router.post('/cancelDispatchData',
    joiSchemaValidation.validateBody(dispatchSchema.cancelDispatchDataJwt),
    dispatchController.cancelDispatchData
)
router.post('/printItemCustomerWiseDispatchJwt',
    joiSchemaValidation.validateBody(dispatchSchema.printItemCustomerWiseDispatchJwt),
    dispatchController.printItemCustomerWiseDispatchJwt
)
router.post('/printItemCustomerWiseDispatch',
    joiSchemaValidation.validateBody(dispatchSchema.printItemCustomerWiseDispatchJwt),
    dispatchController.printItemCustomerWiseDispatch
)

router.post('/editDispatchDataJwt',
    joiSchemaValidation.validateBody(dispatchSchema.editDispatchDataJwt),
    dispatchController.editDispatchDataJwt
)
router.post('/editDispatchData',
    joiSchemaValidation.validateBody(dispatchSchema.editDispatchDataJwt),
    dispatchController.editDispatchData
)

router.post('/deleteDispatchDataJwt',
    joiSchemaValidation.validateBody(dispatchSchema.deleteDispatchDataJwt),
    dispatchController.deleteDispatchDataJwt
)
router.post('/deleteDispatchData',
    joiSchemaValidation.validateBody(dispatchSchema.deleteDispatchDataJwt),
    dispatchController.deleteDispatchData
)

module.exports = router;