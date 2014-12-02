/**
 * Created by zzy on 2014/11/13.
 */
var async = require('async');
var DeliveryAddress = require('./../model/deliveryAddress');
var AreaCtrl = require('./areaCtrl');
var AddressCtrl = function(){};
AddressCtrl.save = function(province,city,district,address,name,customer,isDefault,fn){
    async.auto({
        'getProvince':function(cb){
            AreaCtrl.getProvince(province,function(err,res){
                cb(err,res);
            });
        },
        'getCity':function(cb){
            AreaCtrl.getCity(city,function(err,res){
                cb(err,res);
            });
        },
        'getDistrict':function(cb){
            AreaCtrl.getDistrict(district,function(err,res){
                cb(err,res);
            });
        },
        'saveAddress':['getProvince','getCity','getDistrict',function(cb,results){
            var showtext = results.getProvince.provinceName+" "+results.getCity.cityName+" "+results.getDistrict.districtName+" "+address;
            var deliveryAddress = new DeliveryAddress({
                'province':province,
                'city':city,
                'district':district,
                'address':address,
                'customer':customer,
                'showtext':showtext,
                'name':name,
                'isDefault':isDefault
            });
            deliveryAddress.save(function(err,res){
                fn(err,res);
            });
        }]
    },function(err,results){
        fn(err,results.saveAddress);
    });
};

AddressCtrl.getAddress = function(customer,fn){
    DeliveryAddress.find({'customer':customer},function(err,res){
        fn(err,res);
    })
};

module.exports = AddressCtrl;