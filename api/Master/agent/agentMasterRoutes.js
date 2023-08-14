

const express = require('express');
const router = express.Router();
const agentMasterController = require('./agentMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const agentMasterSchema = require('./agentMasterSchema');


router.post('/saveAgentjwt',
joiSchemaValidation.validateBody(agentMasterSchema.saveAgentjwt),
agentMasterController.saveAgentjwt
)
router.post('/saveAgent',
joiSchemaValidation.validateBody(agentMasterSchema.saveAgent),
agentMasterController.saveAgent
)
router.post('/listAgentjwt',
joiSchemaValidation.validateBody(agentMasterSchema.listAgentjwt),
agentMasterController.listAgentjwt
)
router.post('/listAgent',
joiSchemaValidation.validateBody(agentMasterSchema.listAgent),
agentMasterController.listAgent
)

router.post('/deleteAgentjwt',
joiSchemaValidation.validateBody(agentMasterSchema.deleteAgentjwt),
agentMasterController.deleteAgentjwt
)
router.post('/deleteAgent',
joiSchemaValidation.validateBody(agentMasterSchema.deleteAgent),
agentMasterController.deleteAgent
)

module.exports = router;