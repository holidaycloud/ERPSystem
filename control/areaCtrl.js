/**
 * Created by zzy on 2014/11/3.
 */
var Province = require('./../model/province');
var City = require('./../model/city');
var District = require('./../model/district');
var AreaCtrl = function(){};
AreaCtrl.provinceList = function(fn){
    Province.find({'isEnable':true})
        .exec(function(err,res){
           fn(err,res);
        });
};

AreaCtrl.getProvince = function(pid,fn){
    Province.findOne({'pid':pid})
        .exec(function(err,res){
            fn(err,res);
        });
};

AreaCtrl.getProvinceByName = function(name,fn){
    Province.findOne({'provinceName':new RegExp(name)})
        .exec(function(err,res){
            fn(err,res);
        });
};

AreaCtrl.cityList = function(pid,fn){
    City.find({'pid':pid})
        .exec(function(err,res){
            fn(err,res);
        });
};
AreaCtrl.getCity = function(cid,fn){
    City.findOne({'cid':cid})
        .exec(function(err,res){
            fn(err,res);
        });
};

AreaCtrl.getCityByName = function(name,pid,fn){
    City.findOne({'cityName':new RegExp(name),'pid':pid})
        .exec(function(err,res){
            fn(err,res);
        });
};
AreaCtrl.districtList = function(cid,fn){
    District.find({'cid':cid})
        .exec(function(err,res){
            fn(err,res);
        });
};
AreaCtrl.getDistrict = function(did,fn){
    District.findOne({'did':did})
        .exec(function(err,res){
            fn(err,res);
        });
};
AreaCtrl.getDistrictByName = function(name,cid,fn){
    District.findOne({'districtName':new RegExp(name),'cid':cid})
        .exec(function(err,res){
            fn(err,res);
        });
};

module.exports = AreaCtrl;