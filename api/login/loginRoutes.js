const express = require('express');
const router = express.Router();
const joiSchemaValidation = require('../../middleware/joiSchemaValidation')
const loginSchema = require('./loginSchema')
const loginController = require('./loginController')

router.post('/loginJwt',
joiSchemaValidation.validateBody(loginSchema.loginJwt),
loginController.loginJwt
)

router.post('/login',
joiSchemaValidation.validateBody(loginSchema.login),
loginController.login
)

module.exports = router;