/**
 * Created by zzy on 2014/9/28.
 */
var Customer = require('./../model/customer');
var CustomerCard = require('./../model/customerCard');
var async = require('async');
var CardCtrl = require('./cardCtrl');
var CustomerCtrl = function(){};

CustomerCtrl.getCustomerByMobileOrRegister = function(ent,mobile,name,fn){
    async.waterfall([
        function(cb){
            Customer.findOne({'ent':ent,'mobile':mobile},function(err,customer){
                cb(err,customer);
            });
        },
        function(customer,cb){
            if(customer){
                cb(null,customer);
            } else {
                var crypto = require('crypto');
                var passwd = '123456'
                var md5 = crypto.createHash('md5');
                md5.update(passwd);
                var customer = new Customer({
                    'ent':ent,
                    'mobile':mobile,
                    'name':name,
                    'passwd':md5.digest('hex')
                });
                customer.save(function(err,res){
                    cb(err,res);
                });
            }
        }
    ],function(err,res){
        fn(err,res);
    });
};

CustomerCtrl.register=function(ent,mobile,passwd,loginName,email,birthday,name,address,fn){
    async.auto({
        'checkMobile':function(cb){
            Customer.findOne({'ent':ent,'mobile':mobile},function(err,res){
               cb(err,res);
            });
        }
        ,'saveCustomer':['checkMobile',function(cb,results){
            if(results.checkMobile){
                cb(null,results.checkMobile);
            } else {
                var customer = new Customer( {
                    'ent':ent,
                    'loginName':loginName,
                    'mobile':mobile,
                    'email':email,
                    'passwd':passwd,
                    'birthday':birthday,
                    'name':name,
                    'address':address
                });
                customer.save(function(err,res){
                    cb(err,res);
                });
            }
        }]
    },function(err,results){
        fn(err,results.saveCustomer);
    });
};

CustomerCtrl.detailByWeixin = function(openId,fn){
    Customer.findOne({'weixinOpenId':openId},function(err,customer){
        fn(err,customer);
    });
};

CustomerCtrl.detail = function(id,fn){
    Customer.findById(id,function(err,customer){
        fn(err,customer);
    });
};

CustomerCtrl.initCard = function(token,customer,ent,fn){
    async.auto({
        'createCard':function(cb){
            var crypto = require('crypto');
            var shasum = crypto.createHash('sha256');
            shasum.update(customer+Date.now());
            var cardNum = shasum.digest('hex');
            CardCtrl.initCard(token,cardNum,ent,function(err,res){
                cb(err,res);
            });
        },
        'saveCustomerCard':['createCard',function(cb,results){
            var customerCard = new CustomerCard({
                'card':results.createCard._id,
                'customer':customer
            });
            customerCard.save(function(err,res){
               cb(err,res);
            });
        }]
    },function(err,results){
        fn(err,results.saveCustomerCard);
    });
};

CustomerCtrl.login = function(ent,mobile,passwd,fn){
    async.auto({
        'getCustomer':function(cb){
            Customer.findOne({'ent':ent,'mobile':mobile,'passwd':passwd})
                .lean()
                .exec(function(err,customer){
                if(err){
                    cb(err,null);
                } else {
                    if(customer){
                        cb(null,customer);
                    } else {
                        cb(new Error('用户名或密码错误!'),null);
                    }
                }
            });
        }
        ,'getCustomerCard':['getCustomer',function(cb,results){
            CustomerCtrl.getCustomerCard(results.getCustomer._id,function(err,res){
               if(err){
                   cb(err,null);
               } else {
                   cb(null,res);
               }
            });
        }]
        ,'getCard':['getCustomerCard',function(cb,results){
            if(results.getCustomerCard){
                CardCtrl.getCard(results.getCustomerCard.card,function(err,res){
                    cb(err,res);
                });
            } else {
                cb(null,null);
            }

        }]
        ,'getCardBalance':['getCard',function(cb,results){
            if(results.getCard){
                CardCtrl.balance(results.getCard.cardNum,ent,function(err,res){
                    cb(err,res);
                })
            } else {
                cb(null,null);
            }
        }]
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            var customer = results.getCustomer;
            if(results.getCardBalance){
                customer.cardBalance = results.getCardBalance.balance;
            }
            fn(null,customer);
        }
    });
};

CustomerCtrl.weixinLogin = function(ent,openId,fn){
    Customer.findOne({'ent':ent,'weixinOpenId':openId},function(err,customer){
        fn(err,customer);
    });
};

CustomerCtrl.weixinBind = function(ent,mobile,passwd,openId,headimgurl,loginName,sex,fn){
    async.auto({
        'getCustomer':function(cb){
            Customer.findOne({'ent':ent,'mobile':mobile},function(err,customer){
                if(customer){
                    if(customer.passwd==passwd){
                        cb(null,customer);
                    } else {
                        cb(new Error('用户名或密码错误！'),null);
                    }
                } else {
                    cb(null,null);
                }
            });
        }
        ,'registerCustomer':['getCustomer',function(cb,results){
            if(results.getCustomer){
                Customer.findOneAndUpdate({'ent':ent,'mobile':mobile,'passwd':passwd},{'$set':{'weixinOpenId':openId,'headimgurl':headimgurl,'loginName':loginName,'sex':parseInt(sex)}},function(err,customer){
                    cb(err,customer);
                });
            } else {
                var customer = new Customer({
                    'ent':ent,
                    'mobile':mobile,
                    'passwd':passwd,
                    'weixinOpenId':openId,
                    'headimgurl':headimgurl,
                    'loginName':loginName,
                    'sex':parseInt(sex)
                });
                customer.save(function(err,res){
                    fn(err,res);
                });
            }
        }]
        ,'getCustomerCard':['registerCustomer',function(cb,results){
        CustomerCtrl.getCustomerCard(results.registerCustomer._id,function(err,res){
            if(err){
                cb(err,null);
            } else {
                cb(null,res);
            }
        });
    }]
        ,'getCard':['getCustomerCard',function(cb,results){
        if(results.getCustomerCard){
            CardCtrl.getCard(results.getCustomerCard.card,function(err,res){
                cb(err,res);
            });
        } else {
            cb(null,null);
        }

    }]
        ,'getCardBalance':['getCard',function(cb,results){
        if(results.getCard){
            CardCtrl.balance(results.getCard.cardNum,ent,function(err,res){
                cb(err,res);
            })
        } else {
            cb(null,null);
        }
    }]
    },function(err,results){});
    async.waterfall([
        function(cb){

        },
        function(customer,cb){

        }
    ],function(err,res){
        fn(err,res);
    });

};

CustomerCtrl.changePasswd = function(id,oldPasswd,newPasswd,fn){
    Customer.findOneAndUpdate({'_id':id,'passwd':oldPasswd},{'$set':{'passwd':newPasswd}},function(err,res){
       if(err){
           fn(err,null);
       } else {
           if(res){
               fn(null,res);
           } else {
               fn(new Error('密码错误'),null);
           }
       }
    });
};

CustomerCtrl.getCustomerCard = function(customer,fn){
    CustomerCard.findOne({'customer':customer},function(err,res){
       fn(err,res);
    });
}

CustomerCtrl.update = function(id,obj,fn){
    async.auto({
        'getCustomer':function(cb){
            Customer.findByIdAndUpdate(id,{'$set':obj})
                .lean()
                .exec(function(err,customer){
                    if(err){
                        cb(err,null);
                    } else {
                        cb(null,customer);
                    }
                });
        }
        ,'getCustomerCard':['getCustomer',function(cb,results){
            CustomerCtrl.getCustomerCard(results.getCustomer._id,function(err,res){
                if(err){
                    cb(err,null);
                } else {
                    cb(null,res);
                }
            });
        }]
        ,'getCard':['getCustomerCard',function(cb,results){
            if(results.getCustomerCard){
                CardCtrl.getCard(results.getCustomerCard.card,function(err,res){
                    cb(err,res);
                });
            } else {
                cb(null,null);
            }

        }]
        ,'getCardBalance':['getCustomer','getCard',function(cb,results){
            if(results.getCard){
                CardCtrl.balance(results.getCard.cardNum,results.getCustomer.ent,function(err,res){
                    cb(err,res);
                })
            } else {
                cb(null,null);
            }
        }]
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            var customer = results.getCustomer;
            if(results.getCardBalance){
                customer.cardBalance = results.getCardBalance.balance;
            }
            fn(null,customer);
        }
    });
};

CustomerCtrl.list = function(page,pageSize,ent,mobile,fn){
    async.parallel([
        function (cb) {
            var query = Customer.find({'ent': ent});
            if(mobile){
                query.where({'mobile':mobile});
            }
            query.skip(page * pageSize);
            query.limit(pageSize);
            query.exec(function (err, customers) {
                cb(err, customers);
            });
        },
        function (cb) {
            var query = Customer.count({'ent': ent});
            if(mobile){
                query.where({'mobile':mobile});
            }
            query.exec(function (err, totalsize) {
                cb(err, totalsize);
            });
        }
    ], function (err, res) {
        if (err) {
            fn(err, null);
        } else {
            fn(null, {
                'totalSize': res[1],
                'customers': res[0]
            });
        }
    });
};
module.exports = CustomerCtrl;