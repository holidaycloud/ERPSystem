/**
 * Created by zzy on 2014/11/10.
 */

var Order = require('./../model/order');
var ProductCtrl = require('./productCtrl');
var async = require('async');
var ReportCtrl = function(){};
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
                emit(this.product,{totalPrice:this.totalPrice,qty:this.quantity,price:this.price});
            };
            o.reduce = function(product,values){
                var totalPrice = 0;
                var cost = 0;
                var quantity = 0;
                var price = 0;
                for(var i in values){
                    totalPrice+=values[i].totalPrice;
                    quantity+=values[i].qty;
                    cost+=(values[i].price.basePrice*values[i].qty);
                    price += values[i].price.price*values[i].qty;
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
        }
        ,'createReport':['getProducts','getData',function(cb,results){
            var products = results.getProducts;
            var data = results.getData;
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
module.exports = ReportCtrl;