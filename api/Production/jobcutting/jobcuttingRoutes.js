const express = require('express');
const router = express.Router();
const jobcuttingController = require('./jobcuttingController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const jobcuttingSchema = require('./jobcuttingSchema');

router.post('/generateJobCuttingNoJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.generateJobCuttingNoJwt),
jobcuttingController.generateJobCuttingNoJwt
)
router.post('/generateJobCuttingNo',
joiSchemaValidation.validateBody(jobcuttingSchema.generateJobCuttingNoJwt),
jobcuttingController.generateJobCuttingNo
)

router.post('/onchangeJobCuttingJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.onchangeJobCuttingJwt),
jobcuttingController.onchangeJobCuttingJwt
)
router.post('/onchangeJobCutting',
joiSchemaValidation.validateBody(jobcuttingSchema.onchangeJobCuttingJwt),
jobcuttingController.onchangeJobCutting
)

router.post('/getSizeForJobCuttingJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.getSizeForJobCuttingJwt),
jobcuttingController.getSizeForJobCuttingJwt
)
router.post('/getSizeForJobCutting',
joiSchemaValidation.validateBody(jobcuttingSchema.getSizeForJobCuttingJwt),
jobcuttingController.getSizeForJobCutting
)

router.post('/getItemsForJobCuttingJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.getItemsForJobCuttingJwt),
jobcuttingController.getItemsForJobCuttingJwt
)
router.post('/getItemsForJobCutting',
joiSchemaValidation.validateBody(jobcuttingSchema.getItemsForJobCuttingJwt),
jobcuttingController.getItemsForJobCutting
)

router.post('/getColorsForJobCuttingJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.getColorsForJobCuttingJwt),
jobcuttingController.getColorsForJobCuttingJwt
)
router.post('/getColorsForJobCutting',
joiSchemaValidation.validateBody(jobcuttingSchema.getColorsForJobCuttingJwt),
jobcuttingController.getColorsForJobCutting
)


router.post('/saveJobCuttingJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.saveJobCuttingJwt),
jobcuttingController.saveJobCuttingJwt
)
router.post('/saveJobCutting',
joiSchemaValidation.validateBody(jobcuttingSchema.saveJobCuttingJwt),
jobcuttingController.saveJobCutting
)


router.post('/jobcuttingListJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.jobcuttingListJwt),
jobcuttingController.jobcuttingListJwt
)
router.post('/jobcuttingList',
joiSchemaValidation.validateBody(jobcuttingSchema.jobcuttingListJwt),
jobcuttingController.jobcuttingList
)

router.post('/editJobCuttingJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.editJobCuttingJwt),
jobcuttingController.editJobCuttingJwt
)
router.post('/editJobCutting',
joiSchemaValidation.validateBody(jobcuttingSchema.editJobCuttingJwt),
jobcuttingController.editJobCutting
)

router.post('/deleteJobCuttingJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.deleteJobCuttingJwt),
jobcuttingController.deleteJobCuttingJwt
)
router.post('/deleteJobCutting',
joiSchemaValidation.validateBody(jobcuttingSchema.deleteJobCuttingJwt),
jobcuttingController.deleteJobCutting
)

router.post('/printJobCuttingJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.printJobCuttingJwt),
jobcuttingController.printJobCuttingJwt
)
router.post('/printJobCutting',
joiSchemaValidation.validateBody(jobcuttingSchema.printJobCuttingJwt),
jobcuttingController.printJobCutting
)

router.post('/fetchFilterDataJwt',
joiSchemaValidation.validateBody(jobcuttingSchema.fetchFilterDataJwt),
jobcuttingController.fetchFilterDataJwt
)
router.post('/fetchFilterData',
joiSchemaValidation.validateBody(jobcuttingSchema.fetchFilterDataJwt),
jobcuttingController.fetchFilterData
)






module.exports = router;