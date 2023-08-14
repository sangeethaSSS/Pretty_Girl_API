

const express = require('express');
const router = express.Router();
const userMasterController = require('./userMasterController');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const userMasterSchema = require('./userMasterSchema');

router.post('/userListjwt',
joiSchemaValidation.validateBody(userMasterSchema.userListjwt),
userMasterController.userListjwt
)
router.post('/userList',
joiSchemaValidation.validateBody(userMasterSchema.userList),
userMasterController.userList
)
router.post('/saveUserjwt',
joiSchemaValidation.validateBody(userMasterSchema.saveUserjwt),
userMasterController.saveUserjwt
)
router.post('/saveUser',
joiSchemaValidation.validateBody(userMasterSchema.saveUser),
userMasterController.saveUser
)
router.post('/deleteUserjwt',
joiSchemaValidation.validateBody(userMasterSchema.deleteUserjwt), 
userMasterController.deleteUserjwt
)
router.post('/deleteUser',
joiSchemaValidation.validateBody(userMasterSchema.deleteUser),
userMasterController.deleteUser
)

//Reset User Jwt
router.post('/resetPasswordJwt',
joiSchemaValidation.validateBody(userMasterSchema.resetPasswordJwt),
userMasterController.resetPasswordJwt
);

//Reset User
router.post('/resetPassword',
joiSchemaValidation.validateBody(userMasterSchema.resetPassword),
userMasterController.resetPassword
);


//Change Password User Jwt
router.post('/onchangepasswordJwt',
joiSchemaValidation.validateBody(userMasterSchema.onchangepasswordJwt),
userMasterController.onchangepasswordJwt
);

//Change Password User
router.post('/onchangepassword',
joiSchemaValidation.validateBody(userMasterSchema.onchangepassword),
userMasterController.onchangepassword
);


module.exports = router;