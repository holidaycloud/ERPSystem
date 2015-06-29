/**
 * Created by zzy on 2014/11/28.
 */
var async = require('async');
var CouponCode = require('./../model/couponCode');
var Coupon = require('./../model/coupon');
var EntCtrl = require("./entCtrl");
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
    async.auto({
        //查找是否已领过此次活动的优惠券
        couponIsGet:function(cb){
            //Coupon.count({'marketing':marketing,'customer':customer},function(err,res){
            //   if(err){
            //       cb(err);
            //   } else {
            //       if(res>0){
            //           cb(new Error("优惠券已领过"));
            //       } else {
            //           cb(null,res);
            //       }
            //   }
            //});
            cb(null,null);
        },
        //领取优惠券
        getCoupon:["couponIsGet",function(cb,results){
            Coupon.findOneAndUpdate({'marketing':marketing,'customer':{'$exists':false}},{'$set':{'customer':customer}},function(err,res){
                if(err){
                    cb(err,null);
                } else {
                    if(res){
                        cb(null,res);
                    } else {
                        cb(new Error('优惠券已发完'),null);
                    }
                }
            });
        }]
    },function(err,results){
        fn(err,results.getCoupon);
    });
};

CouponCtrl.scanUse = function(id,ent,fn) {
    Coupon.findById(id,function (err, res) {
        if (err) {
            fn(err)
        } else {
            if (res.ent.toString() != ent.toString()) {
                fn(new Error('无权使用该优惠券'));
            } else if (res.status != 0) {
                fn(new Error('优惠券已使用过'));
            } else {
                res.status = 1;
                res.useTime = Date.now();
                res.save(function (e, r) {
                    fn(e, r);
                });
            }
        }
    });
};

CouponCtrl.marketList = function(marketing,fn){
    Coupon.find({"marketing":marketing},function(err,res){
        fn(err,res);
    });
};

CouponCtrl.useCoupon = function(code,customer,order,fn){
    Coupon.findOneAndUpdate({'code':code,'customer':customer,'status':0},{'$set':{'status':1,'order':order,'useTime':Date.now()}},function(err,res){
       if(err){
           fn(err,null);
       } else {
           if(res){
               fn(null,res);
           } else {
               fn(new Error('优惠券已使用过'),null);
           }
       }
    });
};

CouponCtrl.customerCoupons = function(ent,customer,status,fn){
    var query = Coupon.find({'customer':customer});
    if(status){
        query.where({'status':status});
    }
    query.sort("status");
    query.populate({"path":"marketing","select":"name content"});
    query.populate({"path":"ent","select":"name"});
    query.exec(function(err,res){
        fn(err,res);
    });
};

CouponCtrl.detail = function(id,fn){
    Coupon.findById(id)
        .populate({"path":"marketing","select":"name content"})
        .populate({"path":"ent","select":"name"})
        .exec(function(err,res){
            fn(err,res);
        });
};

CouponCtrl.customList = function(ent,start,length,order,dir,search,fn){
    async.auto({
        "getEnt":function(cb){
            EntCtrl.detail(ent,function(err,res){
                cb(err,res);
            });
        },
        'getList':["getEnt",function(cb,results){
            ent = results.getEnt;
            var query = Coupon.find();
            if(ent.marketings){
                query.where({"marketing":{"$in":ent.marketings}});
            } else {
                query.where({"ent":ent});
            }
            query.populate({"path":"marketing","select":"name"});
            query.populate({"path":"ent","select":"name"});
            query.populate({"path":"customer","select":"loginName"})
            if(dir == "asc"){
                query.sort(order);
            } else {
                query.sort("-"+order);
            }

            query.skip(start);
            query.limit(length);
            query.lean();
            query.exec(function(err,marketings){
                    cb(err,marketings);
            });
        }],
        'getTotalSize':["getEnt",function(cb,results){
            ent = results.getEnt;
            if(ent.marketings){
                Coupon.count({"marketing":{"$in":ent.marketings}},function(err,size){
                    cb(err,size);
                });
            }else {
                Coupon.count({"ent":ent},function(err,size){
                    cb(err,size);
                });
            }
        }]
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            fn(null,{
                'totalSize':results.getTotalSize,
                'coupons':results.getList
            });
        }
    });
};

CouponCtrl.fullList = function(ent,fn){
    if(ent == "548123e82321630e394590e5"){
        Coupon.find()
            .populate("marketing")
            .populate("ent")
            .exec(function(err,coupons){
                fn(err,coupons);
            });
    } else {
        Coupon.find({'ent':ent})
            .populate({"path":"marketing","select":"name"})
            .populate({"path":"ent","select":"name"})
            .lean()
            .exec(function(err,coupons){
                fn(err,coupons);
            });
    }
};

CouponCtrl.list = function(page,pageSize,ent,fn){
    async.auto({
        'getList':function(cb){
            Coupon.find({'ent':ent})
                .populate({"path":"marketing","select":"name"})
                .populate({"path":"ent","select":"name"})
                .skip(page*pageSize)
                .limit(pageSize)
                .lean()
                .exec(function(err,marketings){
                    cb(err,marketings);
                });
        },
        'getTotalSize':function(cb){
            Coupon.count({'ent':ent},function(err,size){
                cb(err,size);
            });
        }
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            fn(null,{
                'totalSize':results.getTotalSize,
                'coupons':results.getList
            });
        }
    });
};

CouponCtrl.canUseList = function(ent,customer,product,totalPrice,fn){
    var query = Coupon.find({'ent':ent,'customer':customer,'status':0,'minValue':{'$lte':totalPrice}});
    query.where({'$or':[{'product':product},{'product':{'$exists':false}}]})
    query.exec(function(err,res){
        fn(err,res);
    });
};

CouponCtrl.count = function(ent,type,fn){
    async.auto({
        "getEnt":function(cb){
            EntCtrl.detail(ent,function(err,res){
               cb(err,res);
            });
        },
        "calCount":["getEnt",function(cb,results){
            var query = Coupon.count();
            var ent = results.getEnt;
            if(ent.marketings){
                query.where({"marketing":{"$in":ent.marketings}});
            } else {
                query.where({"ent":ent});
            }
            if(type == "used") {
                query.where({"status":1});
            }
            else if(type == "received"){
                query.where({"customer":{"$exists":true}});
            }
            else if(type == "noreceived"){
                query.where({"customer":{"$exists":false}});
            }
            query.exec(function(err,res){
                cb(err,res);
            });
        }]
    },function(err,results){
        fn(err,results.calCount);
    });
};

module.exports = CouponCtrl;