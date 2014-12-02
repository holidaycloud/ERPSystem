/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var AddressCtrl = require('./../control/addressCtrl');

//DeliveryAddress
router.post('/save',function(request,response){
    var province = request.body.province;
    var city = request.body.city;
    var district = request.body.district;
    var address = request.body.address;
    var customer = request.body.customer;
    var name = request.body.name;
    var isDefault = request.body.isDefault;
    AddressCtrl.save(province,city,district,address,name,customer,isDefault,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/get',function(request,response){
    var customer = request.query.customer;
    AddressCtrl.getAddress(customer,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;