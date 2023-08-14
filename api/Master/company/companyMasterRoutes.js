const express = require('express');
const router = express.Router();
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation')
const companyMasterSchema = require('./companyMasterSchema')
const companyMasterController = require('./companyMasterController')

router.post('/companyListJwt',
joiSchemaValidation.validateBody(companyMasterSchema.companyListJwt),
companyMasterController.companyListJwt
)

router.post('/companyList',
joiSchemaValidation.validateBody(companyMasterSchema.companyList),
companyMasterController.companyList
)

router.post('/saveCompanyJwt',
joiSchemaValidation.validateBody(companyMasterSchema.saveCompanyJwt),
companyMasterController.saveCompanyJwt
)

router.post('/saveCompany',
joiSchemaValidation.validateBody(companyMasterSchema.saveCompany),
companyMasterController.saveCompany
)

router.post('/deleteCompanyJwt',
joiSchemaValidation.validateBody(companyMasterSchema.deleteCompanyJwt),
companyMasterController.deleteCompanyJwt
)

router.post('/deleteCompany',
joiSchemaValidation.validateBody(companyMasterSchema.deleteCompany),
companyMasterController.deleteCompany
)

module.exports = router;