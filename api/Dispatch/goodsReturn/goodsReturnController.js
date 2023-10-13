const goodsReturnMgmtService = require('../../../service/goodsReturnMgmtService');
const constants = require('../../../constants');


//Create JWt Module
module.exports.getGRCustomerListJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.getGRCustomerListJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  module.exports.getGRCustomerList = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.getGRCustomerList(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  module.exports.getGRItemListJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.getGRItemListJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  module.exports.getGRItemList = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.getGRItemList(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  module.exports.getDispatchListBasedOnItemCustomerJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.getDispatchListBasedOnItemCustomerJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  module.exports.getDispatchListBasedOnItemCustomer = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.getDispatchListBasedOnItemCustomer(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  

  module.exports.saveGoodsReturnJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.saveGoodsReturnJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  module.exports.saveGoodsReturn = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.saveGoodsReturn(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  module.exports.getGRListJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.getGRListJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  module.exports.getGRList = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.getGRList(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  module.exports.getGRFilterListJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.getGRFilterListJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  module.exports.getGRFilterList = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.getGRFilterList(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  
  module.exports.cancelGoodsReturnJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.cancelGoodsReturnJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

  module.exports.cancelGoodsReturn = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await goodsReturnMgmtService.cancelGoodsReturn(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }
  