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
    var phone = request.body.phone;
    var isDefault = request.body.isDefault;
    AddressCtrl.save(province,city,district,address,name,phone,customer,isDefault,function(err,res){
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

router.post('/getOrSaveAddress',function(request,response){
    var customer = request.body.customer;
    var prov = request.body.prov;
    var city = request.body.city;
    var area = request.body.area;
    var address = request.body.address;
    var name = request.body.name;
    var phone = request.body.phone;
    AddressCtrl.getOrSaveAddress(customer,prov,city,area,address,name,phone,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;