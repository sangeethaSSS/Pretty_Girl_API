const express = require('express');
const router = express.Router();
const joiSchemaValidation = require('../../middleware/joiSchemaValidation')
const commonSchema = require('./commonSchema')
const commonController = require('./commonController')

router.post('/fetchcommonDataJwt',
joiSchemaValidation.validateBody(commonSchema.fetchcommonDataJwt),
commonController.fetchcommonDataJwt
)

router.post('/fetchcommonData',
joiSchemaValidation.validateBody(commonSchema.fetchcommonData),
commonController.fetchcommonData
)

router.post('/onchangeitemDataJwt',
joiSchemaValidation.validateBody(commonSchema.onchangeitemDataJwt),
commonController.onchangeitemDataJwt
)

router.post('/onchangeitemData',
joiSchemaValidation.validateBody(commonSchema.onchangeitemData),
commonController.onchangeitemData
)

router.post('/onchangeMachineDataJwt',
joiSchemaValidation.validateBody(commonSchema.onchangeMachineDataJwt),
commonController.onchangeMachineDataJwt
)

router.post('/onchangeMachineData',
joiSchemaValidation.validateBody(commonSchema.onchangeMachineData),
commonController.onchangeMachineData
)

router.post('/onchangeDesignDataJwt',
joiSchemaValidation.validateBody(commonSchema.onchangeDesignDataJwt),
commonController.onchangeDesignDataJwt
)

router.post('/onchangeDesignData',
joiSchemaValidation.validateBody(commonSchema.onchangeDesignData),
commonController.onchangeDesignData
)

router.post('/onchangeSizeDataJwt',
joiSchemaValidation.validateBody(commonSchema.onchangeSizeDataJwt),
commonController.onchangeSizeDataJwt
)

router.post('/onchangeSizeData',
joiSchemaValidation.validateBody(commonSchema.onchangeSizeData),
commonController.onchangeSizeData
)

router.post('/onchangeEmployeeDataJwt',
joiSchemaValidation.validateBody(commonSchema.onchangeEmployeeDataJwt),
commonController.onchangeEmployeeDataJwt
)

router.post('/onchangeEmployeeData',
joiSchemaValidation.validateBody(commonSchema.onchangeEmployeeData),
commonController.onchangeEmployeeData
)

router.post('/onchangeMachineEmployeeDataJwt',
joiSchemaValidation.validateBody(commonSchema.onchangeMachineEmployeeDataJwt),
commonController.onchangeMachineEmployeeDataJwt
)

router.post('/onchangeMachineEmployeeData',
joiSchemaValidation.validateBody(commonSchema.onchangeMachineEmployeeData),
commonController.onchangeMachineEmployeeData
)

router.post('/onchangeJobCardJwt',
joiSchemaValidation.validateBody(commonSchema.onchangeJobCardJwt),
commonController.onchangeJobCardJwt
)

router.post('/onchangeJobCard',
joiSchemaValidation.validateBody(commonSchema.onchangeJobCard),
commonController.onchangeJobCard
)

module.exports = router;