/**
 * Created by zzy on 8/20/14.
 */
var Price = require('./../model/price');
var Product = require('./../model/product');
var async = require('async');
var _ = require('underscore')._;
var PriceCtrl = function(){};

PriceCtrl.save = function(productId,startDate,endDate,price,weekendPrice,basePrice,weekendBasePrice,tradePrice,weekendTradePrice,inventory,weekendinventory,fn){
    async.auto({
        'getProduct':function(cb){
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
        'removePrice':['getProduct',function(cb,results){
            if(results.getProduct.productType===3){
                Price.remove({'product':results.getProduct._id},function(err,res){
                    cb(err,res);
                });
            } else if(results.getProduct.productType===0){
                Price.remove({'product':results.getProduct._id,'date':{'$gte':startDate,'$lte':endDate}},function(err,res){
                    cb(err,res);
                });
            }
        }],
        'saveProductPrice':['getProduct',function(cb,results){
            if(results.getProduct.productType===3){
                var priceObj = new Price({
                    'product':results.getProduct._id,
                    'price':price,
                    'basePrice':basePrice,
                    'tradePrice':tradePrice,
                    'inventory':inventory
                });
                priceObj.save(function(err,res){
                   cb(err,res);
                });
            } else if(results.getProduct.productType===0){
                var priceArr = [];
                var step = (endDate-startDate)/86400000+1;
                for(var i=0;i<step;i++){
                    var isWeekend = false;
                    var date = new Date(startDate+i*86400000);
                    if(_.indexOf(results.getProduct.weekend,date.getDay())>=0){
                        isWeekend=true;
                    }
                    priceArr.push({
                        'product':results.getProduct._id,
                        'date': startDate+i*86400000,
                        'price':isWeekend?weekendPrice:price,
                        'basePrice':isWeekend?weekendBasePrice:basePrice,
                        'tradePrice':isWeekend?weekendTradePrice:tradePrice,
                        'inventory':isWeekend?weekendinventory:inventory
                    });
                }
                Price.create(priceArr,function(err,res){
                    cb(err,res);
                });
            }
        }]
    },function(err,results){
        fn(err,results.saveProductPrice);
    });
};

PriceCtrl.list = function(product,startDate,endDate,fn){
    var query = Price.find();
    query.where({'product':product});
    if(startDate){
        query .where({'date':{'$gte':startDate,'$lte':endDate}});
    }
    query.exec(function(err,res){
        fn(err,res);
    });
};

PriceCtrl.update = function(id,price,basePrice,tradePrice,inventory,fn){
    Price.findByIdAndUpdate(id,{'$set':{'price':price,'basePrice':basePrice,'tradePrice':tradePrice,'inventory':inventory}},function(err,res){
        fn(err,res);
    });
};

PriceCtrl.getPrice = function(id,fn){
    Price.findById(id,function(err,res){
        fn(err,res);
    });
};

PriceCtrl.getDatePrice = function(product,startDate,fn){
    if(startDate){
        Price.findOne({'product':product,'date':startDate},function(err,res){
            fn(err,res);
        });
    } else {
        Price.findOne({'product':product},function(err,res){
            fn(err,res);
        });
    }
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

PriceCtrl.returnInventory = function(id,quantity,fn){
    Price.findByIdAndUpdate(id,{'$inc':{'inventory':quantity}},function(err,res){
        fn(err,res);
    })
};

module.exports = PriceCtrl;