/**
 * Created by zzy on 2014/11/10.
 */

var Order = require('./../model/order');
var ProductCtrl = require('./productCtrl');
var EntCtrl = require('./entCtrl');
var OrderCtrl = require('./orderCtrl');
var async = require('async');
var ReportCtrl = function(){};

ReportCtrl.entSalesSummary = function(startDate,endDate,fn){
    var o = {};
    o.map = function(){
        emit(this.ent,{
            totalPrice:this.totalPrice,
            quantity:this.quantity,
            price:this.price.price,
            cost:this.price.basePrice*this.quantity,
            profit:this.totalPrice-this.price.basePrice*this.quantity,
            profitRate:(this.totalPrice-this.price.basePrice*this.quantity)/this.totalPrice
        });
    };
    o.reduce = function(product,values){
        var totalPrice = 0;
        var cost = 0;
        var quantity = 0;
        var price = 0;
        for(var i in values){
            totalPrice+=values[i].totalPrice;
            quantity+=values[i].quantity;
            cost+=values[i].cost;
            price += values[i].price*values[i].quantity;
        }
        var profit=totalPrice-cost;
        var profitRate = profit/totalPrice;
        price = price/quantity;
        return {
            'totalPrice':totalPrice,
            'quantity':quantity,
            'price':price,
            'cost':cost,
            'profit':profit,
            'profitRate':profitRate
        };
    };
    o.query={'ent':ent,'orderDate':{'$gte':startDate,"$lt":endDate}};
    Order.mapReduce(o,function(err, res){
        cb(err,res);
    });
    //async.auto({
    //    'getEnts':function(cb){
    //        EntCtrl.nameList(function(err,res){
    //           cb(err,res);
    //        });
    //    },
    //    'getOrders':function(cb){
    //        Order.find({orderDate:{"$gte":startDate,"$lt":endDate}},function(err,res){
    //            cb(err,res);
    //        });
    //    }
    //},function(err,results){
    //    var ents = results.getEnts;
    //    var orders = results.getOrders;
    //    var categories=[],series=[];
    //    for(var i in ents){
    //        categories.push(ents[i].name);
    //    }
    //
    //    //fn(err,results.createReport);
    //});
};

ReportCtrl.saleReport = function(ent,startDate,endDate,fn){
    async.auto({
        'getProducts':function(cb){
            ProductCtrl.nameList(ent,false,function(err,res){
               cb(err,res);
            });
        }
        ,'getData':function(cb){
            var o = {};
            o.map = function(){
                emit(this.product,{
                    totalPrice:this.totalPrice,
                    quantity:this.quantity,
                    price:this.price.price,
                    cost:this.price.basePrice*this.quantity,
                    profit:this.totalPrice-this.price.basePrice*this.quantity,
                    profitRate:(this.totalPrice-this.price.basePrice*this.quantity)/this.totalPrice
                });
            };
            o.reduce = function(product,values){
                var totalPrice = 0;
                var cost = 0;
                var quantity = 0;
                var price = 0;
                for(var i in values){
                    totalPrice+=values[i].totalPrice;
                    quantity+=values[i].quantity;
                    cost+=values[i].cost;
                    price += values[i].price*values[i].quantity;
                }
                var profit=totalPrice-cost;
                var profitRate = profit/totalPrice;
                price = price/quantity;
                return {
                    'totalPrice':totalPrice,
                    'quantity':quantity,
                    'price':price,
                    'cost':cost,
                    'profit':profit,
                    'profitRate':profitRate
                };
            };
            o.query={'ent':ent,'orderDate':{'$gte':startDate,"$lt":endDate},'status':{'$nin':[0,3]}};
            Order.mapReduce(o,function(err, res){
                cb(err,res);
            });
        }
        ,'createReport':['getProducts','getData',function(cb,results){
            var products = results.getProducts;
            var data = results.getData;
            console.log(data);
            var res = [];
            data.forEach(function(d){
                var obj = {};
                obj.cost = d.value.cost;
                obj.price = d.value.price;
                obj.quantity = d.value.quantity;
                obj.total = d.value.totalPrice;
                obj.profit = d.value.profit;
                obj.profitRate = d.value.profitRate;
                for(var i in products){
                    if(products[i]._id.toString()== d._id.toString()){
                        obj.name = products[i].name;
                    }

                }
                res.push(obj);
            });
            cb(null,res);
        }]
    },function(err,results){
        fn(err,results.createReport);
    });

};

ReportCtrl.saleDetail = function(page,pageSize,start,end,ent,fn){
    async.auto({
        'getOrder':function(cb){
            OrderCtrl.list(page,pageSize,ent,null,start,end,function(err,res){
                cb(err,res);
            });
        }
        ,'createReport':['getOrder',function(cb,results){
            var orders = results.getOrder.orders;
            var res = {};
            res.totalSize = results.getOrder.totalSize;
            res.orders=[];
            orders.forEach(function(order){
                res.orders.push({
                    'createTime':order.orderDate,
                    'cusName':order.liveName,
                    'cusType':'',
                    'contact':order.contactPhone,
                    'pdtName':order.product.name,
                    'quantity':order.quantity,
                    'total':order.totalPrice,
                    'payWay':order.payWay,
                    'remark':order.remark
                });
            });
            cb(null,res);
        }]
    },function(err,results){
        fn(err,results.createReport);
    });
};

ReportCtrl.entOrders = function(startDate,endDate,fn){
    var returnValue = {};
    returnValue.funcQueue = [];
    async.auto({
        'getAllEnts': function(cb){
            EntCtrl.nameList(function(err,res){
                returnValue.ents = res;
                cb(err,res);
            });
        }
        ,'getOrdersNum': ['getAllEnts',function(cb,result){
            returnValue.ents.forEach(function(e){
                returnValue[e._id] = {};
                //all orders count
                returnValue.funcQueue.push(getEntOrdersNumber(startDate,endDate,e._id,returnValue[e._id]));
                //pay orders count
                returnValue.funcQueue.push(getEntOrdersNumber(startDate,endDate,e._id,returnValue[e._id],1));
                //fin orders count
                returnValue.funcQueue.push(getEntOrdersNumber(startDate,endDate,e._id,returnValue[e._id],2));
            });
            //run all
            async.series(returnValue.funcQueue,function(err,res){
                delete returnValue.funcQueue;
                cb(err,res);
            });
        }]
    },function(err,results){
        fn(err,returnValue);
    });
};

var getEntOrdersNumber = function(sd,ed,entId,object,status){
  return function(cb){
      var cond = {};
      cond.ent = entId;
      cond.orderDate = {'$gte':sd,"$lt":ed};
      if(status){
          cond.status = status;
      }
      Order.count(cond,function(err,res){
          if(cond.status&&cond.status == 1){
              object.pay = res;
          }else if(cond.status&&cond.status == 2){
              object.fin = res;
          }else{
              object.all = res;
          }
          cb(err,object);
      });
  }
};
module.exports = ReportCtrl;