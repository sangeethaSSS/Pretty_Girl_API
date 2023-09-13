
const orderTakingMgmtService = require('../../../service/orderTakingMgmtService');
const constants = require('../../../constants');

//Change Auto Company Name JWt Module
module.exports.ChangeAutoCompanyNamejwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.ChangeAutoCompanyNamejwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Change Auto Company Name Module
module.exports.ChangeAutoCompanyName = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.ChangeAutoCompanyName(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Change Auto Design Name JWt Module
module.exports.ChangeAutoItemCodejwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.ChangeAutoItemCodejwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Change Auto Design Name Module
module.exports.ChangeAutoItemCode = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.ChangeAutoItemCode(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

module.exports.getCurrentOrderStockJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.getCurrentOrderStockJwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Change Auto Design Name Module
module.exports.getCurrentOrderStock = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.getCurrentOrderStock(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Change Auto Design Name JWt Module
module.exports.ChangeAutoItemNamejwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.ChangeAutoItemNamejwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Change Auto Design Name Module
module.exports.ChangeAutoItemName = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.ChangeAutoItemName(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Save Order Taking JWt Module
module.exports.saveOrderTakingjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.saveOrderTakingjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Order Taking Module
module.exports.saveOrderTaking = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.saveOrderTaking(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create Order Taking JWt Module
module.exports.orderTakingListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.orderTakingListjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Order Taking List Module
module.exports.orderTakingList = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.orderTakingList(req.body);
    if (!responseFromService.token) {
      response.status = 200;
      response.message = constants.success_message.LISTED_SUCCESS;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Order Taking Jwt Module
module.exports.deleteOrderTakingjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.deleteOrderTakingjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Delete Order Taking Module
module.exports.deleteOrderTaking = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.deleteOrderTaking(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create Customer List JWt Module
module.exports.customerListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.customerListjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Order Taking List Module
module.exports.customerList = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.customerList(req.body);
    if (!responseFromService.token) {
      response.status = 200;
      response.message = constants.success_message.LISTED_SUCCESS;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}


//Edit Order Taking Jwt Module
module.exports.editOrderTakingjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.editOrderTakingjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Edit Order Taking List Module
module.exports.editOrderTaking = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.editOrderTaking(req.body);
    if (!responseFromService.token) {
      response.status = 200;
      response.message = constants.success_message.LISTED_SUCCESS;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}


//Print Order Slip Jwt Module
module.exports.printOrderSlipjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.printOrderSlipjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Print Order Slip List Module
module.exports.printOrderSlip = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.printOrderSlip(req.body);
    if (!responseFromService.token) {
      response.status = 200;
      response.message = constants.success_message.LISTED_SUCCESS;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Change Auto Design Name JWt Module
module.exports.ChangeAutoDesignNamejwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.ChangeAutoDesignNamejwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Change Auto Design Name Module
module.exports.ChangeAutoDesignName = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.ChangeAutoDesignName(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}


//Change Auto Qty JWt Module
module.exports.onChangeQtyjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.onChangeQtyjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Change Auto Qty Module
module.exports.onChangeQty = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.onChangeQty(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create Order Taking JWt Module
module.exports.orderToWhatsappListjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.orderToWhatsappListjwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Order Taking List Module
module.exports.orderToWhatsappList = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.orderToWhatsappList(req.body);
    if (!responseFromService.token) {
      response.status = 200;
      response.message = constants.success_message.LISTED_SUCCESS;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}
//Create Order Taking JWt Module
module.exports.sendOrderToWhatsappJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.sendOrderToWhatsappJwt(req.body);
    if (!responseFromService.token) {
      response.status = 200;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Order Taking List Module
module.exports.sendOrderToWhatsapp = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await orderTakingMgmtService.sendOrderToWhatsapp(req.body);
    if (!responseFromService.token) {
      response.status = 200;
      response.message = constants.success_message.LISTED_SUCCESS;
    }
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}
