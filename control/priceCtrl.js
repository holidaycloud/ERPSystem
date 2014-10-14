/**
 * Created by zzy on 8/20/14.
 */
var Price = require('./../model/price');
var Product = require('./../model/product');
var async = require('async');
var _ = require('underscore')._;
var PriceCtrl = function(){};

PriceCtrl.save = function(productId,startDate,endDate,price,weekendPrice,inventory,weekendinventory,fn){
    async.waterfall([
        function(cb){
            Product.findById(productId,function(err,res){
               if(err){
                   cb(err,null);
               } else {
                   if(res){
                       cb(null,res);
                   } else {
                       cb(new Error('产品不存在'),null);
                   }
               }
            });
        },
        function(product,cb){
            Price.remove({'product':product,'date':{'$gte':startDate,'$lte':endDate}},function(err,res){
                cb(err,product);
            })
        },
        function(product,cb){
            var priceArr = [];
            var step = (endDate-startDate)/86400000+1;
            for(var i=0;i<step;i++){
                var isWeekend = false;
                var date = new Date(startDate+i*86400000);
                if(_.indexOf(product.weekend,date.getDay())>=0){
                    isWeekend=true;
                }
                priceArr.push({
                    'product':product,
                    'date': startDate+i*86400000,
                    'price':isWeekend?weekendPrice:price,
                    'inventory':isWeekend?weekendinventory:inventory
                });
            }
            Price.create(priceArr,function(err,res){
                cb(err,res);
            });
        }
    ],function(err,res){
        fn(err,res);
    });
};

PriceCtrl.list = function(product,startDate,endDate,fn){
    Price.find()
        .where({'product':product})
        .where({'date':{'$gte':startDate,'$lte':endDate}})
        .exec(function(err,res){
            fn(err,res);
        });
};

PriceCtrl.update = function(id,price,inventory,fn){
    Price.findByIdAndUpdate(id,{'$set':{'price':price,'inventory':inventory}},function(err,res){
        fn(err,res);
    });
};

PriceCtrl.getPrice = function(id,fn){
    Price.findById(id,function(err,res){
        fn(err,res);
    });
};

PriceCtrl.getDatePrice = function(product,startDate,fn){
    Price.findOne({'product':product,'date':startDate},function(err,res){
        fn(err,res);
    });
};

PriceCtrl.getFirstPrice = function(product,fn){
    Price.findOne({'product':product,'date':{'$gte':Date.now()},'inventory':{"$gt":0}})
        .sort('data')
        .exec(function(err,res){
            fn(err,res);
        });
};

PriceCtrl.deductInventory = function(id,quantity,fn){
    Price.findByIdAndUpdate(id,{'$inc':{'inventory':-quantity}},function(err,res){
        fn(err,res);
    })
};

module.exports = PriceCtrl;