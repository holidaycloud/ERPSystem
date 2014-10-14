/**
 * Created by zzy on 2014/9/28.
 */
var Customer = require('./../model/customer');
var async = require('async');
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

CustomerCtrl.register=function(ent,mobile,passwd,fn){
    var customer = new Customer({
        'ent':ent,
        'mobile':mobile,
        'passwd':passwd
    });
    customer.save(function(err,res){
        fn(err,res);
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

CustomerCtrl.login = function(ent,mobile,passwd,fn){
    Customer.findOne({'ent':ent,'mobile':mobile,'passwd':passwd},function(err,customer){
        fn(err,customer);
    });
};

CustomerCtrl.weixinLogin = function(ent,openId,fn){
    Customer.findOne({'ent':ent,'weixinOpenId':openId},function(err,customer){
        fn(err,customer);
    });
};

CustomerCtrl.weixinBind = function(ent,mobile,passwd,openId,fn){
    async.waterfall([
        function(cb){
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
        },
        function(customer,cb){
            if(customer){
                Customer.findOneAndUpdate({'ent':ent,'mobile':mobile,'passwd':passwd},{'$set':{'weixinOpenId':openId}},function(err,customer){
                    cb(err,customer);
                });
            } else {
                var customer = new Customer({
                    'ent':ent,
                    'mobile':mobile,
                    'passwd':passwd,
                    'weixinOpenId':openId
                });
                customer.save(function(err,res){
                    fn(err,res);
                });
            }
        }
    ],function(err,res){
        fn(err,res);
    });

};

CustomerCtrl.update = function(id,obj,fn){
    Customer.findByIdAndUpdate(id,{'$set':obj},function(err,res){
        fn(err,res);
    });
};

CustomerCtrl.list = function(page,pageSize,ent,fn){
    async.parallel([
        function (cb) {
            var query = Customer.find({'ent': ent});
            query.skip(page * pageSize);
            query.limit(pageSize);
            query.exec(function (err, customers) {
                cb(err, customers);
            });
        },
        function (cb) {
            var query = Customer.count({'ent': ent});
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
                'orders': res[0]
            });
        }
    });
};
module.exports = CustomerCtrl;