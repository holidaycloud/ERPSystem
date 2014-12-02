/**
 * Created by zzy on 2014/11/28.
 */
var express = require('express');
var router = express.Router();
var CouponCtrl = require('./../control/couponCtrl');
router.post('/generate',function(request,response){
    var ent = request.body.ent;
    var marketing = request.body.marketing;
    var qty = request.body.qty;
    var minValue = request.body.minValue;
    var type = request.body.type;
    var value = request.body.value;
    var name = request.body.name;
    var product = request.body.product;
    var startDate = request.body.startDate;
    var endDate = request.body.endDate;
    CouponCtrl.generate(ent,marketing,qty,minValue,type,value,name,product,startDate,endDate,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/give',function(request,response){
    var ent = request.body.ent;
    var marketing = request.body.marketing;
    var customer = request.body.customer;
    CouponCtrl.give(ent,marketing,customer,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/use',function(request,response){
    var code = request.body.code;
    var customer = request.body.customer;
    var order = request.body.order;
    CouponCtrl.useCoupon(code,customer,order,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/customerCoupons',function(request,response){
    var customer = request.query.customer;
    var ent = request.query.ent;
    var status = request.query.status;
    CouponCtrl.customerCoupons(ent,customer,status,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/canUseList',function(request,response){
    var customer = request.query.customer;
    var ent = request.query.ent;
    var product = request.query.product;
    var totalPrice = request.query.totalPrice;
    CouponCtrl.canUseList(ent,customer,product,totalPrice,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

module.exports = router;