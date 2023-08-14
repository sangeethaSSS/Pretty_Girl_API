const Joi = require('@hapi/joi');

module.exports.itemListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    status_id:Joi.number().required(),
  });
  module.exports.itemList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

// FOR save Item
module.exports.saveItemjwt = Joi.object().keys({
    item_id: Joi.number().required(),
    user_id: Joi.number().required(),
    item_name : Joi.string().required(),
    status_id : Joi.number().required(),
    itemgroup_id :Joi.number().required(),
    size_array:Joi.array().required().allow([]),
});

module.exports.saveItem = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR Edit Item
module.exports.editItemjwt = Joi.object().keys({
    item_id: Joi.number().required(),
});

module.exports.editItem = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

//FOR delete Item
module.exports.deleteItemjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    item_id: Joi.number().required(),
});

module.exports.deleteItem = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});


//FOR Size List
module.exports.sizeListjwt = Joi.object().keys({
    item_id: Joi.number().required(),
});

module.exports.sizeList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});