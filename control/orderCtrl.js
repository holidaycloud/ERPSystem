/**
 * Created by zzy on 8/26/14.
 */
var Order = require('./../model/order');
var OrderId = require('./../model/orderId');
var PriceCtrl = require('./priceCtrl');
var TokenCtrl = require('./tokenCtrl');
var ProductCtrl = require('./productCtrl');
var CustomerCtrl = require('./customerCtrl');
var CardCtrl = require('./cardCtrl');
var ProductMatchCtrl = require('./productMatchCtrl');
var async = require('async');
var FMB = require('fumubang');
var OrderCtrl = function () {
};

OrderCtrl.traderOrder = function(trader,token,startDate,quantity,remark,traderProduct,liveName, contactPhone,fn){
    async.auto({
        'getProduct':function(cb){
            ProductMatchCtrl.getProduct(trader,traderProduct,function(err,res){
                cb(err,res);
            });
        }
        ,'getPrice':['getProduct',function(cb,results){
            PriceCtrl.getDatePrice(results.getProduct.providerProductId,startDate,function(err,res){
                cb(err,res);
            });
        }]
        ,'saveOrder':['getProduct','getPrice',function(cb,results){
            OrderCtrl.save(token,startDate,quantity,remark,results.getProduct.providerProductId,liveName,contactPhone,results.getPrice._id,null,null,function(err,res){
                cb(err,res);
            });
        }]
    },function(err,results){
        fn(err,results.saveOrder);
    });
};

OrderCtrl.save = function (token, startDate, quantity, remark, product, liveName, contactPhone, priceId, openId,customer,payway,fn) {
    async.auto({
        getProduct: function (cb) {
            ProductCtrl.detail(product, function (err, product) {
                cb(err, product);
            });
        }
        ,getMember: function (cb) {
            TokenCtrl.findToken(token, function (err, token) {
                if (err) {
                    cb(err, null);
                } else {
                    if (token) {
                        cb(null, token.member);
                    } else {
                        cb(new Error('未找到用户'), null);
                    }
                }
            });
        }
        ,getCustomer: ['getMember',function (cb, results) {
            if(openId){
                CustomerCtrl.detailByWeixin(openId,function(err,res){
                    cb(err,res);
                });
            } else if(customer){
                cb(null,null);
            }else {
                CustomerCtrl.register(results.getMember.ent,contactPhone,'',null,null,null,liveName,null,function(err,res){
                    cb(err,res);
                })
            }
        }]
        ,getPrice: function (cb) {
            PriceCtrl.getPrice(priceId, function (err, price) {
                if (err) {
                    cb(err, null);
                } else {
                    if (price) {
                        if (price.inventory < quantity) {
                            cb(new Error('库存不足'), null);
                        } else {
                            cb(null, price);
                        }
                    } else {
                        cb(new Error('未找到价格'), null);
                    }
                }
            });
        }
        ,getOrderID: function (cb) {
            OrderId.findOneAndUpdate({'isUsed': false}, {'$set': {'isUsed': true}}, function (err, orderId) {
                if (err) {
                    cb(err, null);
                } else {
                    if (orderId) {
                        cb(null, orderId.orderID);
                    } else {
                        cb(new Error('订单号用完'), null);
                    }
                }
            });
        }
        ,saveOrder: ['getMember', 'getPrice', 'getOrderID', 'getProduct','getCustomer', function (cb, results) {
            var obj = {
                'orderID': results.getOrderID,
                'member': results.getMember,
                'startDate': startDate,
                'payWay': payway,
                'quantity': quantity,
                'remark': remark,
                'product': product,
                'totalPrice': results.getPrice.price * quantity,
                'status': 0,
                'ent': results.getProduct.ent,
                'liveName': liveName,
                'contactPhone': contactPhone,
                'price': results.getPrice
            };
            if( customer){
                obj.customer =customer;
            } else{
                if(results.getCustomer){
                    obj.customer =results.getCustomer._id;
                }
            }
            var order = new Order(obj);
            order.save(function (err, res) {
                cb(err, res);
            });
        }]
//        ,pushOrderMsg: ['saveOrder', function (cb, order) {
//            var BCMS = require('baiduBCMS');
//            var bcms = new BCMS('568isAhOLjeTtHSAjTF3iY8F', 'Ddt7Xp4K3ShmYB5engGGq3iKyuG1VjXl');
//            bcms.publish('9aac5616828fc961070c26be06cd388f', {
//                "message": order
//            }, function (err, res) {
//                cb(err, res);
//            });
//        }]
        ,deductInventory: ['saveOrder', function (cb) {
            PriceCtrl.deductInventory(priceId, quantity, function (err, price) {
                cb(err, price);
            });
        }]
    }, function (err, results) {
//        console.log(err,results);
        fn(err, results.saveOrder);
    });
};

OrderCtrl.changeStatus = function(id,status,fn){
    if(status==1){
        Order.findOneAndUpdate({'_id': id, 'status': 0}, {'$set': {'status': 1}}, function (err, res) {
            fn(err, res);
        });
    } else if(status==2){
        Order.findOneAndUpdate({'_id': id, 'status': 1}, {'$set': {'status': 2}}, function (err, res) {
            fn(err, res);
        });
    } else if(status==3){
        Order.findOneAndUpdate({'_id': id, 'status': 0}, {'$set': {'status': 3}}, function (err, res) {
            fn(err, res);
        });
    }
};

OrderCtrl.cusCardPay = function(id,customer,token,ent,fn){
    async.auto({
        'getOrder':function(cb){
            OrderCtrl.cusDetail(id,customer,function(err,res){
                cb(err,res);
            });
        },
        'getCustomerCard':function(cb){
            CustomerCtrl.getCustomerCard(customer,function(err,res){
               cb(err,res);
            });
        },
        'getCardInfo':['getCustomerCard',function(cb,results){
            CardCtrl.getCard(results.getCustomerCard._id,function(err,res){
                cb(err,res);
            });
        }]
        ,'cardConsume':['getCardInfo','getOrder',function(cb,results){
            CardCtrl.consume(token,results.getCardInfo.cardNum,results.getOrder.totalPrice,ent,function(err,res){
                cb(err,res);
            });
        }]
        ,'changeOrderStatus':['getOrder','cardConsume',function(cb,results){
            if(results,cardConsume){
                OrderCtrl.changeStatus(results.getOrder._id,1,function(err,res){
                   cb(err,res);
                });
            } else {
                cb(new Error('支付失败'),null)
            }
        }]
    },function(err,results){
        fn(err,results.changeOrderStatus);
    });
};

OrderCtrl.cusCancel = function(id,customer,fn){
    console.log(id,customer);
    Order.findOneAndUpdate({'_id': id,'customer':customer, 'status': 0}, {'$set': {'status': 3}}, function (err, res) {
        fn(err, res);
    });
};

OrderCtrl.confirm = function (id, fn) {
    Order.findOneAndUpdate({'_id': id, 'status': 1}, {'$set': {'status': 2}}, function (err, res) {
        fn(err, res);
    });
};

OrderCtrl.cancel = function (id, fn) {
    Order.findOneAndUpdate({'_id': id, 'status': 0}, {'$set': {'status': 3}}, function (err, res) {
        fn(err, res);
    });
};

OrderCtrl.cusList = function (page, pageSize, customer, fn) {
    async.parallel([
        function (cb) {
            var query = Order.find({'customer': customer});
            query.sort({'orderDate': -1});
            query.skip(page * pageSize);
            query.limit(pageSize);
            query.populate({'path': 'product', 'select': 'name'});
            query.exec(function (err, orders) {
                cb(err, orders);
            });
        },
        function (cb) {
            var query = Order.count({'customer': customer});
            query.exec(function (err, orders) {
                cb(err, orders);
            });
        }
    ], function (err, res) {
        if (err) {
            fn(err, null);
        } else {
            fn(null, {
                'totalSize': res[1],
                'orders': res[0]
            });
        }
    });
};

OrderCtrl.cusListByOpenId = function (page, pageSize,openId, fn) {
    async.auto({
        'getCustomer':function(cb){
            CustomerCtrl.detailByWeixin(openId,function(err,res){
                if(err){
                    cb(err,null);
                } else {
                    if(res){
                        cb(null,res._id);
                    } else {
                        cb(new Error('未找到用户！'),null);
                    }
                }
            });
        },
        'getOrderList':['getCustomer',function(cb,results){
            OrderCtrl.cusList(page,pageSize,results.getCustomer,function(err,res){
                cb(err,res);
            });
        }]
    },function(err,results){
        fn(err,results.getOrderList);
    });
};

OrderCtrl.list = function (page, pageSize, ent, product, startDate, endDate, fn) {
    async.parallel([
        function (cb) {
            var query = Order.find({'ent': ent});
            if (product) {
                query.where({'product': product});
            }
            if (startDate) {
                query.where({'orderDate': {'$gte': startDate, '$lte': endDate}});
            }
            query.sort({'orderDate': -1});
            query.skip(page * pageSize);
            query.limit(pageSize);
            query.populate({'path': 'product', 'select': 'name'});
            query.populate({'path': 'member', 'select': 'loginName'});
            query.exec(function (err, orders) {
                cb(err, orders);
            });
        },
        function (cb) {
            var query = Order.count({'ent': ent});
            if (product) {
                query.where({'product': product});
            }
            if (startDate) {
                query.where({'orderDate': {'$gte': startDate, '$lte': endDate}});
            }
            query.exec(function (err, orders) {
                cb(err, orders);
            });
        }
    ], function (err, res) {
        if (err) {
            fn(err, null);
        } else {
            fn(null, {
                'totalSize': res[1],
                'orders': res[0]
            });
        }
    });
};

OrderCtrl.detail = function (id, fn) {
    Order.findById(id)
        .populate({'path': 'product', 'select': 'name'})
        .populate({'path': 'member', 'select': 'loginName'})
        .populate({'path': 'customer','select':'name mobile'})
        .exec(function (err, order) {
            fn(err, order);
        });
};

OrderCtrl.cusDetail = function (id,customer,fn) {
    Order.findOne({'_id':id,'customer':customer})
        .populate({'path': 'product', 'select': 'name'})
        .populate({'path': 'member', 'select': 'loginName'})
        .populate({'path': 'customer','select':'name mobile'})
        .exec(function (err, order) {
            fn(err, order);
        });
};

OrderCtrl.verifyCode = function(code,fn){
    var fmb = new FMB('太仓盛兴','sty841');
    fmb.verifyCode('123456',function(err,res){
        fn(err,res);
    });
};
module.exports = OrderCtrl;