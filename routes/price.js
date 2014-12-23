/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var PriceCtrl = require('./../control/priceCtrl');
/**
 Price接口
 */
router.post('/save', function(request, response) {
    var product = request.body.product;
    var startDate = parseInt(request.body.startDate);
    var endDate = parseInt(request.body.endDate);
    var price = request.body.price;
    var weekendPrice = request.body.weekendPrice;
    var basePrice = request.body.basePrice;
    var weekendBasePrice = request.body.weekendBasePrice;
    var tradePrice = request.body.tradePrice;
    var weekendTradePrice = request.body.weekendTradePrice;
    var inventory = request.body.inventory;
    var weekendinventory = request.body.weekendinventory;
    PriceCtrl.type0save(product,startDate,endDate,price,weekendPrice,basePrice,weekendBasePrice,tradePrice,weekendTradePrice,inventory,weekendinventory,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/type3save', function(request, response) {
    var product = request.body.product;
    var spec = request.body.spec;
    var price = request.body.price;
    var basePrice = request.body.basePrice;
    var tradePrice = request.body.tradePrice;
    var inventory = request.body.inventory;
    PriceCtrl.type3save(product,spec,price,basePrice,tradePrice,inventory,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/list', function(request, response) {
    var product = request.query.product;
    var startDate = parseInt(request.query.startDate);
    var endDate = parseInt(request.query.endDate);
    PriceCtrl.list(product,startDate,endDate,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/update', function(request, response) {
    var id = request.body.id;
    var price = request.body.price;
    var basePrice = request.body.basePrice;
    var tradePrice = request.body.tradePrice;
    var inventory = request.body.inventory;
    PriceCtrl.update(id,price,basePrice,tradePrice,inventory,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/first', function(request, response) {
    var product = request.query.product;
    PriceCtrl.getFirstPrice(product,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/get', function(request, response) {
    var id = request.query.id;
    PriceCtrl.getPrice(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/getDatePrice', function(request, response) {
    var product = request.query.product;
    var startDate = request.query.startDate;
    PriceCtrl.getDatePrice(product,startDate,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;