const Joi = require('@hapi/joi');

module.exports.itemsubcategoryFilterListJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    jwtToken: Joi.string().allow(''), 
  });
  module.exports.saveItemSubCategoryJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    item_subcategory_id: Joi.number().required(),
    itemsubcategory_name: Joi.string().allow(''),
    status_id: Joi.number().required(),
    item_group_id:Joi.number().required(),
    short_name: Joi.string().required(),
    price: Joi.string().allow(''),
    jwtToken: Joi.string().allow(''), 
  });
  module.exports.itemGubCategoryListJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    jwtToken: Joi.string().allow(''), 
  });

  module.exports.deleteItemSubgroupJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    sub_category_id: Joi.number().required(),
    jwtToken: Joi.string().allow(''), 
});
  
  