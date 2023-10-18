const Joi = require('@hapi/joi');

module.exports.ChangeAutoCompanyNamejwt = Joi.object().keys({
    user_id: Joi.number().required(),
    searchvalue:Joi.string().required().allow(''),
});

module.exports.ChangeAutoCompanyName = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

module.exports.ShowCustomerOrdersjwt = Joi.object().keys({
  user_id: Joi.number().required(),
  customer_code:Joi.string().required().allow(''),
});

module.exports.ShowCustomerOrders = Joi.object().keys({
  jwtToken: Joi.string().required(), 
});

module.exports.ChangeAutoItemCodejwt = Joi.object().keys({
    user_id: Joi.number().required(),
    itemcode:Joi.number().required(),
});

module.exports.ChangeAutoItemCode = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});
module.exports.getCurrentOrderStockJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  itemcode:Joi.number().required(),
  order_date:Joi.string().required(),
});

module.exports.getCurrentOrderStock = Joi.object().keys({
  jwtToken: Joi.string().required(), 
});

module.exports.ChangeAutoItemNamejwt = Joi.object().keys({
  user_id: Joi.number().required(),
  itemname:Joi.string().required(),
});

module.exports.ChangeAutoItemName = Joi.object().keys({
  jwtToken: Joi.string().required(), 
});

// FOR save Check Order Taking
module.exports.saveOrderTakingjwt = Joi.object().keys({
  order_date: Joi.string().required(),
  ref_no:Joi.number().required(),
  customer_id:Joi.string().required(),
  type:Joi.string().required(),
  user_id: Joi.number().required(),
  order_id : Joi.string().required(),
  status_id : Joi.number().required(),
  item_array:Joi.array().required().allow([]),
  process_flag:Joi.string().required(),
  remarks:Joi.string().allow("")
});

module.exports.saveOrderTaking = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});


module.exports.orderTakingListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    from_date:Joi.string().required(),
    to_date: Joi.string().required(),
    status_id: Joi.number().required(),
  });
  module.exports.orderTakingList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });
  module.exports.orderToWhatsappListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    date:Joi.string().required(),
    ordertype: Joi.string().required().allow(''),
  });
  module.exports.orderToWhatsappList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });
  module.exports.customerListjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    customer_id:Joi.string().required(),
  });
  module.exports.customerList = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });
  
module.exports.deleteOrderTakingjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    order_no:Joi.string().required(),
  });
  module.exports.deleteOrderTaking = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  module.exports.editOrderTakingjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    order_no:Joi.string().required(),
  });
  module.exports.editOrderTaking = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

  
  module.exports.printOrderSlipjwt = Joi.object().keys({
    user_id: Joi.number().required(),
    order_no:Joi.string().required(),
  });
  module.exports.printOrderSlip = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });

module.exports.ChangeAutoDesignNamejwt = Joi.object().keys({
    user_id: Joi.number().required(),
    searchvalue:Joi.string().required().allow(''),
});

module.exports.ChangeAutoDesignName = Joi.object().keys({
    jwtToken: Joi.string().required(), 
});

module.exports.onChangeQtyjwt = Joi.object().keys({
  qty:Joi.number().required(),
  size_id:Joi.number().required(),
});

module.exports.onChangeQty = Joi.object().keys({
  jwtToken: Joi.string().required(), 
});

module.exports.sendOrderToWhatsappJwt = Joi.object().keys({
  user_id: Joi.number().required(),  
  order_details: Joi.array().required().allow([]),   
});
module.exports.sendOrderToWhatsapp = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});
module.exports.holdOrderTakingJwt = Joi.object().keys({
  user_id: Joi.number().required(),
  order_no:Joi.string().required(),
  status_code:Joi.number().required(),
  jwtToken: Joi.string().allow(''), 
});

