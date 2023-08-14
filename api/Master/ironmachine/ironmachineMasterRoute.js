

const express = require('express');
const router = express.Router();
const ironmachineMasterController = require('./ironMachineMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const ironmachineMasterSchema = require('./ironmachineMasterSchema');

router.post('/ironmachineListJwt',
joiSchemaValidation.validateBody(ironmachineMasterSchema.ironmachineListJwt),
   ironmachineMasterController.ironmachineListJwt
)
router.post('/ironmachineList',
joiSchemaValidation.validateBody(ironmachineMasterSchema.ironmachineList),
ironmachineMasterController.ironmachineList
)
router.post('/saveIronmachineJwt',
joiSchemaValidation.validateBody(ironmachineMasterSchema.saveIronmachineJwt),
ironmachineMasterController.saveIronmachineJwt
)
router.post('/saveIronmachine',
joiSchemaValidation.validateBody(ironmachineMasterSchema.saveIronmachine),
ironmachineMasterController.saveIronmachine
)

router.post('/deleteIronmachineJwt',
joiSchemaValidation.validateBody(ironmachineMasterSchema.deleteIronmachineJwt), 
ironmachineMasterController.deleteIronmachineJwt
)
router.post('/deleteIronmachine',
joiSchemaValidation.validateBody(ironmachineMasterSchema.deleteIronmachine),
ironmachineMasterController.deleteIronmachine
)

module.exports = router;