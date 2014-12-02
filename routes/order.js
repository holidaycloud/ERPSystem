/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var OrderCtrl = require('./../control/orderCtrl');
/**
 Order接口
 */
router.post('/save', function(request, response) {
    var token = request.body.token;
    var startDate = request.body.startDate;
    var quantity = request.body.quantity;
    var remark = request.body.remark;
    var product = request.body.product;
    var liveName = request.body.liveName;
    var contactPhone = request.body.contactPhone;
    var customer = request.body.customer;
    var openId = request.body.openId;
    var price = request.body.price;
    var payway = request.body.payway||1;
    var invoiceTitle = request.body.invoiceTitle;
    var coupon = request.body.coupon;
    var deliveryAddress = request.body.deliveryAddress;

    OrderCtrl.save(token,startDate,quantity,remark,product,liveName,contactPhone,price,openId,customer,payway,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    },invoiceTitle,coupon,deliveryAddress);
});

router.post('/cardPay', function(request, response) {
    var id = request.body.id;
    var token = request.body.token;
    var customer = request.body.customer;
    var ent = request.body.ent;

    OrderCtrl.cusCardPay(id,customer,token,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/traderOrder', function(request, response) {

    var trader = request.body.trader;
    var token = request.body.token;
    var startDate = request.body.startDate;
    var quantity = request.body.quantity;
    var remark = request.body.remark;
    var traderProduct = request.body.traderProduct;
    var liveName = request.body.liveName;
    var contactPhone = request.body.contactPhone;

    OrderCtrl.traderOrder(trader,token,startDate,quantity,remark,traderProduct,liveName,contactPhone,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/pay', function(request, response) {
    var orderID = request.body.orderID;
    OrderCtrl.pay(orderID,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/confirm', function(request, response) {
    var orderID = request.body.orderID;
    OrderCtrl.confirm(orderID,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/changeStatus', function(request, response) {
    var orderID = request.body.orderID;
    var status = request.body.status;
    OrderCtrl.changeStatus(orderID,status,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/cusList', function(request, response) {
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var customer = request.query.customer;

    OrderCtrl.cusList(page,pageSize,customer,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/openIdList', function(request, response) {
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var openId = request.query.openId;
    OrderCtrl.cusListByOpenId(page,pageSize,openId,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/list', function(request, response) {
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var ent = request.query.ent;
    var product = request.query.product;
    var startDate = request.query.startDate;
    var endDate = request.query.endDate;
    OrderCtrl.list(page,pageSize,ent,product,startDate,endDate,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/detail', function(request, response) {
    var id = request.query.id;
    OrderCtrl.detail(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/cusCancel', function(request, response) {
    var id = request.body.id;
    var customer = request.body.customer;
    OrderCtrl.cusCancel(id,customer,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/cusDetail', function(request, response) {
    var id = request.query.id;
    var customer = request.query.customer;
    OrderCtrl.cusDetail(id,customer,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/verifyCode', function(request, response) {
    var code = request.query.code;
    OrderCtrl.verifyCode(code,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;