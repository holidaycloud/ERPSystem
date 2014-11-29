/**
 * Created by zzy on 2014/11/28.
 */
var async = require('async');
var CouponCode = require('./../model/couponCode');
var Coupon = require('./../model/coupon');
var CouponCtrl = function(){};
CouponCtrl.generate = function(ent,marketing,qty,minValue,type,value,name,product,startDate,endDate,fn){
    var createFunc = function(){
        return function(callback){
            async.auto({
                'getCode':function(cb){
                    CouponCode.findOneAndUpdate({'isUsed':false},{'$set':{'isUsed':true}})
                        .lean()
                        .exec(function(err,res){
                            cb(err,res);
                        });
                },
                'saveCoupon':['getCode',function(cb,results){
                    var code = results.getCode.code;
                    var coupon = new Coupon({
                        'code':code,
                        'ent':ent,
                        'marketing':marketing,
                        'minValue':minValue,
                        'type':type,
                        'value':value,
                        'name':name,
                        'product':product,
                        'startDate':startDate,
                        'endDate':endDate
                    });
                    coupon.save(function(err,res){
                        cb(err,res);
                    });
                }]
            },function(err,results){
                callback(err,results.saveCoupon);
            })
        }
    };
    var funcArray = [];
    for(var i=0;i<qty;i++){
        funcArray.push(createFunc());
    }
    async.parallel(funcArray,function(err,results){
        fn(err,results);
    });
};

CouponCtrl.give = function(ent,marketing,customer,fn){
    Coupon.findOneAndUpdate({'ent':ent,'marketing':marketing,'customer':{'$exists':false}},{'$set':{'customer':customer}},function(err,res){
        if(err){
            fn(err,null);
        } else {
            if(res){
                cb(null,res);
            } else {
                cb(new Error('优惠券已发完'),null);
            }
        }
    });
};

CouponCtrl.useCoupon = function(code,customer,order,fn){
    Coupon.findOneAndUpdate({'code':code,'customer':customer,'status':0},{'$set':{'status':1,'order':order,'useTime':Date.now()}},function(err,res){
       if(err){
           fn(err,null);
       } else {
           if(res){
               cb(null,res);
           } else {
               cb(new Error('优惠券已使用过'),null);
           }
       }
    });
};
module.exports = CouponCtrl;