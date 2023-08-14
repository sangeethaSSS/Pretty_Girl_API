const express = require('express');
const router = express.Router();
const machineMasterController = require('./machineMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const machineMasterSchema = require('./machineMasterSchema');

router.post('/machineListjwt',
joiSchemaValidation.validateBody(machineMasterSchema.machineListjwt),
machineMasterController.machineListjwt
)
router.post('/machineList',
joiSchemaValidation.validateBody(machineMasterSchema.machineList),
machineMasterController.machineList
)
router.post('/saveMachinejwt',
joiSchemaValidation.validateBody(machineMasterSchema.saveMachinejwt),
machineMasterController.saveMachinejwt
)
router.post('/saveMachine',
joiSchemaValidation.validateBody(machineMasterSchema.saveMachine),
machineMasterController.saveMachine
)

router.post('/deleteMachinejwt',
joiSchemaValidation.validateBody(machineMasterSchema.deleteMachinejwt), 
machineMasterController.deleteMachinejwt
)
router.post('/deleteMachine',
joiSchemaValidation.validateBody(machineMasterSchema.deleteMachine),
machineMasterController.deleteMachine
)

module.exports = router;