/**
 * Created by zzy on 2014/11/13.
 */
var async = require('async');
var DeliveryAddress = require('./../model/deliveryAddress');
var AreaCtrl = require('./areaCtrl');
var AddressCtrl = function(){};
AddressCtrl.save = function(province,city,district,address,name,phone,customer,isDefault,fn){
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
        'setDefault':function(cb){
            if(isDefault=='true'){
                DeliveryAddress.update({'customer':customer},{'$set':{'isDefault':false}},{ multi: true },function(err,res){
                    cb(err,res);
                });
            } else {
                cb(null,null);
            }
        },
        'saveAddress':['getProvince','getCity','getDistrict','setDefault',function(cb,results){
            var showtext = results.getProvince.provinceName+" "+results.getCity.cityName+" "+results.getDistrict.districtName+" "+address;
            var deliveryAddress = new DeliveryAddress({
                'province':province,
                'city':city,
                'district':district,
                'address':address,
                'customer':customer,
                'showtext':showtext,
                'name':name,
                'phone':phone,
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
}

AddressCtrl.getOrSaveAddress = function(customer,prov,city,area,address,name,phone,fn){
    async.auto({
        'getProvince':function(cb){
            AreaCtrl.getProvinceByName(prov,function(err,res){
                cb(err,res);
            })
        },
        'getCity':['getProvince',function(cb,results){
            AreaCtrl.getCityByName(city,results.getProvince.pid,function(err,res){
                cb(err,res);
            });
        }],
        'getDistrict':['getCity',function(cb,results){
            AreaCtrl.getDistrictByName(area,results.getCity.cid,function(err,res){
               cb(err,res);
            });
        }],
        'getCustomerAddress':['getProvince','getCity','getDistrict',function(cb,results){
            DeliveryAddress.findOne({
                'customer':customer,
                'province':results.getProvince.pid,
                'city':results.getCity.cid,
                'district':results.getDistrict.did,
                'address':address
            }).exec(function(err,res){
                cb(err,res);
            });
        }],
        'saveAddress':['getProvince','getCity','getDistrict','getCustomerAddress',function(cb,results){
            if(results.getCustomerAddress){
                cb(null,results.getCustomerAddress);
            } else {
                var showtext = results.getProvince.provinceName+" "+results.getCity.cityName+" "+results.getDistrict.districtName+" "+address;
                var deliveryAddress = new DeliveryAddress({
                    'province':results.getProvince.pid,
                    'city':results.getCity.cid,
                    'district':results.getDistrict.did,
                    'address':address,
                    'customer':customer,
                    'showtext':showtext,
                    'name':name,
                    'phone':phone
                });
                deliveryAddress.save(function(err,res){
                    cb(err,res);
                });
            }
        }]
    },function(err,results){
        fn(err,results.saveAddress);
    })
};

module.exports = AddressCtrl;