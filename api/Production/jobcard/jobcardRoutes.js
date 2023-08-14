const express = require('express');
const router = express.Router();
const jobcardController = require('./jobcardController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const jobcardSchema = require('./jobcardSchema');

router.post('/jobcardListjwt',
joiSchemaValidation.validateBody(jobcardSchema.jobcardListjwt),
jobcardController.jobcardListjwt
)
router.post('/jobcardList',
joiSchemaValidation.validateBody(jobcardSchema.jobcardList),
jobcardController.jobcardList
)
router.post('/saveJobcardjwt',
joiSchemaValidation.validateBody(jobcardSchema.saveJobcardjwt),
jobcardController.saveJobcardjwt
)
router.post('/saveJobcard',
joiSchemaValidation.validateBody(jobcardSchema.saveJobcard),
jobcardController.saveJobcard
)

router.post('/deleteJobcardjwt',
joiSchemaValidation.validateBody(jobcardSchema.deleteJobcardjwt), 
jobcardController.deleteJobcardjwt
)
router.post('/deleteJobcard',
joiSchemaValidation.validateBody(jobcardSchema.deleteJobcard),
jobcardController.deleteJobcard
)

router.post('/editJobcardjwt',
joiSchemaValidation.validateBody(jobcardSchema.editJobcardjwt), 
jobcardController.editJobcardjwt
)
router.post('/editJobcard',
joiSchemaValidation.validateBody(jobcardSchema.editJobcard),
jobcardController.editJobcard
)

router.post('/generateJobnojwt',
joiSchemaValidation.validateBody(jobcardSchema.generateJobnojwt), 
jobcardController.generateJobnojwt
)
router.post('/generateJobno',
joiSchemaValidation.validateBody(jobcardSchema.generateJobno),
jobcardController.generateJobno
)

router.post('/saveTransferJobJwt',
joiSchemaValidation.validateBody(jobcardSchema.saveTransferJobJwt), 
jobcardController.saveTransferJobJwt
)
router.post('/saveTransferJob',
joiSchemaValidation.validateBody(jobcardSchema.saveTransferJob),
jobcardController.saveTransferJob
)

router.post('/viewTransferJobcardjwt',
joiSchemaValidation.validateBody(jobcardSchema.viewTransferJobcardjwt), 
jobcardController.viewTransferJobcardjwt
)
router.post('/viewTransferJobcard',
joiSchemaValidation.validateBody(jobcardSchema.viewTransferJobcard),
jobcardController.viewTransferJobcard
)

router.post('/updateRateJobcardjwt',
joiSchemaValidation.validateBody(jobcardSchema.updateRateJobcardjwt), 
jobcardController.updateRateJobcardjwt
)
router.post('/updateRateJobcard',
joiSchemaValidation.validateBody(jobcardSchema.updateRateJobcard),
jobcardController.updateRateJobcard
)
module.exports = router;