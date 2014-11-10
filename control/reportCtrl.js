/**
 * Created by zzy on 2014/11/10.
 */

var Order = require('./../model/order');
var ReportCtrl = function(){};
ReportCtrl.saleReport = function(ent,startDate,endDate,fn){
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
    Order.mapReduce(o,function(err, results){
        fn(err,results);
    });
};
module.exports = ReportCtrl;