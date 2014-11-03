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
AreaCtrl.cityList = function(pid,fn){
    City.find({'pid':pid})
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

module.exports = AreaCtrl;