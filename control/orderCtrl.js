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
var CouponCtrl = require('./couponCtrl');
var ProductMatchCtrl = require('./productMatchCtrl');
var MemberCtrl = require('./memberCtrl');
var async = require('async');
//var FMB = require('fumubang');
var request = require('request');
var config = require('./../config/config.json');
var OrderCtrl = function () {
};

OrderCtrl.traderOrder = function (trader, token, startDate, quantity, remark, traderProduct, liveName, contactPhone, fn) {
    async.auto({
        'getProduct': function (cb) {
            ProductMatchCtrl.getProduct(trader, traderProduct, function (err, res) {
                cb(err, res);
            });
        }, 'getPrice': ['getProduct', function (cb, results) {
            PriceCtrl.getDatePrice(results.getProduct.providerProductId, startDate, function (err, res) {
                cb(err, res);
            });
        }], 'saveOrder': ['getProduct', 'getPrice', function (cb, results) {
            OrderCtrl.save(token, startDate, quantity, remark, results.getProduct.providerProductId, liveName, contactPhone, results.getPrice._id, null, null, function (err, res) {
                cb(err, res);
            });
        }]
    }, function (err, results) {
        fn(err, results.saveOrder);
    });
};

OrderCtrl.save = function (token, startDate, quantity, remark, product, liveName, contactPhone, priceId, openId, customer, payway, fn, invoiceTitle, coupon, deliveryAddress) {
    async.auto({
        getProduct: function (cb) {
            ProductCtrl.detail(product, function (err, product) {
                cb(err, product);
            });
        }, getMember: function (cb) {
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
        }, getCustomer: ['getMember', function (cb, results) {
            if (openId) {
                CustomerCtrl.detailByWeixin(openId, function (err, res) {
                    cb(err, res);
                });
            } else if (customer) {
                cb(null, null);
            } else {
                CustomerCtrl.getCustomerByMobileOrRegister(results.getMember.ent, contactPhone, liveName, function (err, res) {
                    cb(err, res);
                })
            }
        }], getPrice: function (cb) {
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
        }, getOrderID: function (cb) {
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
        }, 'useCoupon': ['getOrderID', 'getCustomer', function (cb, results) {
            if (coupon) {
                var c;
                if (customer) {
                    c = customer;
                } else {
                    if (results.getCustomer) {
                        c = results.getCustomer._id;
                    }
                }
                var orderID = results.getOrderID;
                CouponCtrl.useCoupon(coupon, c, orderID, function (err, res) {
                    cb(err, res);
                });
            } else {
                cb(null, null);
            }
        }], saveOrder: ['getMember', 'getPrice', 'getOrderID', 'getProduct', 'getCustomer', 'useCoupon', function (cb, results) {
            var obj = {
                'orderID': results.getOrderID,
                'member': results.getMember,
                'startDate': startDate,
                'payWay': payway,
                'quantity': quantity,
                'remark': remark,
                'product': product,
                'status': payway == 1 ? 1 : 0,
                'ent': results.getProduct.ent,
                'liveName': liveName,
                'contactPhone': contactPhone,
                'price': results.getPrice
            };
            if (coupon) {
                var couponObject = results.useCoupon;
                if (couponObject.type == 0) {
                    obj.totalPrice = results.getPrice.price * quantity - couponObject.value;
                } else if (couponObject.type == 1) {
                    obj.totalPrice = results.getPrice.price * quantity - results.getPrice.price * quantity * couponObject.value;
                } else if (couponObject.type == 3) {
                    obj.totalPrice = (results.getPrice.price * (quantity - 1)) + couponObject.value;
                } else if (couponObject.type == 4) {
                    obj.totalPrice = results.getPrice.price * (quantity - 1);
                } else {
                    obj.totalPrice = results.getPrice.price * quantity;
                }
                obj.useCoupon = true;
            } else {
                obj.totalPrice = results.getPrice.price * quantity;
            }
            if (deliveryAddress) {
                obj.address = deliveryAddress;
            }
            if (customer) {
                obj.customer = customer;
            } else {
                if (results.getCustomer) {
                    obj.customer = results.getCustomer._id;
                }
            }
            if (invoiceTitle) {
                obj.invoice = {
                    'title': invoiceTitle,
                    'status': 0
                };
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
        , 'weixinNotify': ['saveOrder', function (cb, results) {
            OrderCtrl.sendWeixinNotify(results.saveOrder._id, function (err, res) {
                cb(null, null);
            });
        }], deductInventory: ['saveOrder', function (cb) {
            PriceCtrl.deductInventory(priceId, quantity, function (err, price) {
                cb(err, price);
            });
        }]
    }, function (err, results) {
        fn(err, results.saveOrder);
    });
};

OrderCtrl.update = function (token, remark, orderID, fn) {
    Order.findOneAndUpdate({'_id': orderID}, {'$set': {'remark': remark}}, function (err, res) {
        fn(err, res);
    });
};

OrderCtrl.changeStatus = function (id, status, fn) {
    if (status == 1) {
        Order.findOneAndUpdate({'_id': id, 'status': 0}, {'$set': {'status': 1}}, function (err, res) {
            fn(err, res);
        });
    } else if (status == 2) {
        Order.findOneAndUpdate({'_id': id, 'status': 1}, {'$set': {'status': 2}}, function (err, res) {
            fn(err, res);
        });
    } else if (status == 3) {
        Order.findOneAndUpdate({'_id': id, 'status': 0}, {'$set': {'status': 3}}, function (err, res) {
            fn(err, res);
        });
    }
};

OrderCtrl.cusCardPay = function (id, customer, token, ent, fn) {
    async.auto({
        'getOrder': function (cb) {
            OrderCtrl.cusDetail(id, customer, function (err, res) {
                cb(err, res);
            });
        },
        'getCustomerCard': function (cb) {
            CustomerCtrl.getCustomerCard(customer, function (err, res) {
                cb(err, res);
            });
        },
        'getCardInfo': ['getCustomerCard', function (cb, results) {
            CardCtrl.getCard(results.getCustomerCard.card, function (err, res) {
                cb(err, res);
            });
        }], 'cardConsume': ['getCardInfo', 'getOrder', function (cb, results) {
            CardCtrl.consume(token, results.getCardInfo.cardNum, -results.getOrder.totalPrice, ent, function (err, res) {
                cb(err, res);
            });
        }], 'changeOrderStatus': ['getOrder', 'cardConsume', function (cb, results) {
            if (results.cardConsume) {
                Order.findOneAndUpdate({'_id': id, 'status': 0}, {'$set': {'status': 1, 'payWay': 2}}, function (err, res) {
                    cb(err, res);
                })
            } else {
                cb(new Error('支付失败'), null)
            }
        }], 'getCardBalance': ['getCardInfo', 'changeOrderStatus', function (cb, results) {
            CardCtrl.balance(results.getCardInfo.cardNum, ent, function (err, res) {
                cb(err, res);
            })
        }]
    }, function (err, results) {
        fn(err, results.getCardBalance);
    });
};

OrderCtrl.cusCancel = function (id, customer, fn) {
    async.auto({
        'updateOrder': function (cb) {
            Order.findOneAndUpdate({'_id': id, 'customer': customer, 'status': 0}, {'$set': {'status': 3}}, function (err, res) {
                cb(err, res);
            });
        },
        'returnInventory': ['updateOrder', function (cb, results) {
            PriceCtrl.returnInventory(results.updateOrder.price._id, results.updateOrder.quantity, function (err, res) {
                cb(err, res);
            });
        }],
        'weixinNotify': ['updateOrder', function (cb, results) {
            OrderCtrl.sendWeixinNotify(results.updateOrder._id, function (err, res) {
                cb(null, null);
            });
        }]
    }, function (err, results) {
        fn(err, results.updateOrder);
    });
};

OrderCtrl.pay = function (id, fn) {
    async.auto({
        'updateOrder': function (cb) {
            if (id.length != 24) {
                Order.findOneAndUpdate({'orderID': id, 'status': 0}, {'$set': {'status': 1}}, function (err, res) {
                    cb(err, res);
                });
            } else {
                Order.findOneAndUpdate({'_id': id, 'status': 0}, {'$set': {'status': 1}}, function (err, res) {
                    cb(err, res);
                });
            }
        },
        'weixinNotify': ['updateOrder', function (cb, results) {
            if (results.updateOrder) {
                OrderCtrl.sendWeixinNotify(results.updateOrder._id, function (err, res) {
                    cb(null, null);
                });
            } else {
                cb(null, null);
            }
        }]
    }, function (err, results) {
        fn(err, results.updateOrder);
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

OrderCtrl.cusListByOpenId = function (page, pageSize, openId, fn) {
    async.auto({
        'getCustomer': function (cb) {
            CustomerCtrl.detailByWeixin(openId, function (err, res) {
                if (err) {
                    cb(err, null);
                } else {
                    if (res) {
                        cb(null, res._id);
                    } else {
                        cb(new Error('未找到用户！'), null);
                    }
                }
            });
        },
        'getOrderList': ['getCustomer', function (cb, results) {
            OrderCtrl.cusList(page, pageSize, results.getCustomer, function (err, res) {
                cb(err, res);
            });
        }]
    }, function (err, results) {
        fn(err, results.getOrderList);
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
    if (id.toString().length != 24) {
        Order.findOne({'orderID': id})
            .populate({'path': 'product', 'select': 'name'})
            .populate({'path': 'member', 'select': 'loginName'})
            .populate({'path': 'customer', 'select': 'name mobile'})
            .populate({'path': 'address', 'select': 'name phone showtext'})
            .exec(function (err, order) {
                fn(err, order);
            });
    } else {
        Order.findById(id)
            .populate({'path': 'product', 'select': 'name'})
            .populate({'path': 'member', 'select': 'loginName'})
            .populate({'path': 'customer', 'select': 'name mobile'})
            .populate({'path': 'address', 'select': 'name phone showtext'})
            .exec(function (err, order) {
                fn(err, order);
            });
    }
};

OrderCtrl.cusDetail = function (id, customer, fn) {
    Order.findOne({'_id': id, 'customer': customer})
        .populate({'path': 'product', 'select': 'name'})
        .populate({'path': 'member', 'select': 'loginName'})
        .populate({'path': 'customer', 'select': 'name mobile'})
        .exec(function (err, order) {
            fn(err, order);
        });
};

OrderCtrl.verifyCode = function (code, fn) {
    var fmb = new FMB('太仓盛兴', 'sty841');
    fmb.verifyCode('123456', function (err, res) {
        fn(err, res);
    });
};

OrderCtrl.sendWeixinNotify = function (oid, fn) {
    var createFunc = function (member, order) {
        return function (cb) {
            var orderStatus = ['未支付', '已支付', '已确认', '已取消', '退款中', '已退款'];
            var status = orderStatus[order.status];
            var remark = order.address ? '配送地址:' + order.address.showtext : '';
            var url = config.weixin.host + ":" + config.weixin.port + "/weixin/sendOrderTemplate/548123e82321630e394590e5";
            request({
                url: url,
                timeout: 3000,
                method: 'POST',
                form: {
                    'tempId': 'OTQM8Ud7KVbhSrZtSSf3aTotnw5lGzgErTbFSMv0XqY',
                    'toUser': member,
                    'customerInfo': order.liveName + " " + order.contactPhone,
                    'orderID': order.orderID,
                    'status': status,
                    'remark': remark,
                    'orderDate': new Date(order.orderDate).Format('yyyy-MM-dd hh:mm:ss')
                }
            }, function (err, response, body) {
                console.log(err, body);
                cb(err, body ? JSON.parse(body) : {});
            });
        };
    };
    async.auto({
        'getOrderDetail': function (cb) {
            OrderCtrl.detail(oid, function (err, res) {
                cb(err, res);
            });
        },
        'getMembers': ['getOrderDetail', function (cb, results) {
            MemberCtrl.weixinMemberList(results.getOrderDetail.ent, function (err, res) {
                cb(err, res);
            });
        }],
        'sendNotify': ['getOrderDetail', 'getMembers', function (cb, results) {
            var members = results.getMembers;
            var order = results.getOrderDetail;
            var funcArr = [];
            members.forEach(function (m) {
                funcArr.push(createFunc(m.weixinOpenId, order));
            });
            async.parallel(funcArr, function (err, res) {
                cb(err, res);
            });
        }]
    }, function (err, res) {
        fn(err, res);
    });

};
module.exports = OrderCtrl;