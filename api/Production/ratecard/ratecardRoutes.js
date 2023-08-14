const express = require('express');
const router = express.Router();
const ratecardController = require('./ratecardController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const ratecardSchema = require('./ratecardSchema');

router.post('/ratecardListjwt',
joiSchemaValidation.validateBody(ratecardSchema.ratecardListjwt),
ratecardController.ratecardListjwt
)
router.post('/ratecardList',
joiSchemaValidation.validateBody(ratecardSchema.ratecardList),
ratecardController.ratecardList
)
router.post('/saveRatecardjwt',
joiSchemaValidation.validateBody(ratecardSchema.saveRatecardjwt),
ratecardController.saveRatecardjwt
)
router.post('/saveRatecard',
joiSchemaValidation.validateBody(ratecardSchema.saveRatecard),
ratecardController.saveRatecard
)

router.post('/deleteRatecardjwt',
joiSchemaValidation.validateBody(ratecardSchema.deleteRatecardjwt), 
ratecardController.deleteRatecardjwt
)
router.post('/deleteRatecard',
joiSchemaValidation.validateBody(ratecardSchema.deleteRatecard),
ratecardController.deleteRatecard
)

module.exports = router;