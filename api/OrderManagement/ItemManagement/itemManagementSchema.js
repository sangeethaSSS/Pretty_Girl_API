const Joi = require('@hapi/joi');

module.exports.itemManagementListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
  });
  module.exports.itemManagementList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Item Management
module.exports.saveItemManagementjwt = Joi.object().keys({
    item_id: Joi.number().required(),
    trans_no:Joi.number().required(),
    user_id: Joi.number().required(),
    status_id : Joi.number().required(),
    design_id: Joi.string().required(),
    size_array:Joi.array().required().allow([]),
});

module.exports.saveItemManagement = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

module.exports.CheckDesignNojwt = Joi.object().keys({
    design_id: Joi.string().required(),
});

module.exports.CheckDesignNo = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR Edit Item Management
module.exports.editItemListjwt = Joi.object().keys({
    trans_no: Joi.number().required(),
});

module.exports.editItemList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});


//FOR delete Item  Management
module.exports.deleteItemManagementjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    trans_no: Joi.number().required(),
});

module.exports.deleteItemManagement = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});
//FOR delete Item  Management
module.exports.checkItemExistTransactionjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    size_id: Joi.number().required(),
});

module.exports.checkItemExistTransaction = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});
