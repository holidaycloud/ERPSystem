/**
 * Created by zzy on 2014/9/28.
 */
var Customer = require('./../model/customer');
var CustomerCard = require('./../model/customerCard');
var config = require("./../config/config.json")
var async = require('async');
var request = require("request");
var CardCtrl = require('./cardCtrl');
var VerifyCodeCtrl = require("./../control/verifyCodeCtrl")
var CustomerCtrl = function(){};

CustomerCtrl.loginOrRegister = function(ent,mobile,passwd,fn){
  async.auto({
      'login':function(cb){
          Customer.findOne({'ent':ent,'mobile':mobile},function(err,customer){
              if(err){
                  cb(err,null);
              } else {
                  if(customer){
                      if(customer.passwd == passwd){
                          cb(null,customer);
                      } else {
                          cb(new Error('用户名或密码错误'),null);
                      }
                  } else {
                      cb(null,true);
                  }
              }
          });
      },
      'register':['login',function(cb,results){
          var r = results.login;
          if(r===true){
              var customer = new Customer({
                  'ent':ent,
                  'mobile':mobile,
                  'passwd':passwd
              });
              customer.save(function(err,res){
                  cb(err,res);
              })
          } else if(r!=null){
              cb(null,r);
          } else {
              cb(null,null);
          }
      }]
  },function(err,results){
      fn(err,results.register);
  });
};

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

CustomerCtrl.verifyCode = function(mobile,fn){
    VerifyCodeCtrl.create(mobile,function(err,res){
        fn(err,res);
    })
};

CustomerCtrl.webRegister = function(ent,mobile,password,code,fn){
    async.auto({
        checkCode:function(cb){
            VerifyCodeCtrl.checkCode(mobile,code,function(err,res){
               if(err){
                   cb(err);
               } else {
                   if(res){
                       cb(null,res);
                   } else {
                       cb(new Error('验证码错误'))
                   }
               }
            });
        },
        checkMobile:["checkCode",function(cb,results){
            Customer.findOne({'ent':ent,'mobile':mobile},function(err,res){
                cb(err,res);
            });
        }],
        saveCustomer:["checkMobile",function(cb,results){
            if(results.checkMobile){
                cb(new Error('用户已存在'),null);
            } else {
                var customer = new Customer( {
                    'ent':ent,
                    'mobile':mobile,
                    'passwd':password
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

CustomerCtrl.register=function(ent,mobile,passwd,loginName,email,birthday,name,address,fn){
    async.auto({
        'checkMobile':function(cb){
            Customer.findOne({'ent':ent,'mobile':mobile},function(err,res){
               cb(err,res);
            });
        }
        ,'saveCustomer':['checkMobile',function(cb,results){
            if(results.checkMobile){
                //cb(null,results.checkMobile);
                cb(new Error('用户已存在'),null);
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

CustomerCtrl.weixinSubscribe = function(ent,openid,fn){
    async.auto({
        'getCustomer':function(cb){
            Customer.findOne({'ent':ent,'weixinOpenId':openid})
                .lean()
                .exec(function(err,customer){
                    cb(err,customer);
                });
        },
        'getUserInfo':function(cb){
            var url = config.weixin.host+':'+config.weixin.port+'/weixin/userInfo/'+ent+'?openid='+openid;
            request({
                url:url,
                timeout:3000
            },function(err,response,body){
                if(err){
                    cb(err,null);
                } else {
                    var res = body?JSON.parse(body):{};
                    if(res.error==0&&res.data){
                        cb(null,res.data);
                    } else {
                        cb(new Error(res.errMsg),null);
                    }
                }
            });
        },
        'registerCustomer':['getCustomer','getUserInfo',function(cb,results){
            var userinfo = results.getUserInfo;
            var customer = results.getCustomer;
            if(customer){
                var setObj = {};
                if(userinfo.headimgurl){
                    setObj.headimgurl = userinfo.headimgurl;
                }
                if(userinfo.nickname){
                    setObj.loginName = userinfo.nickname;
                }
                if(userinfo.sex){
                    setObj.sex = parseInt(userinfo.sex);
                }
                Customer.findOneAndUpdate({'ent':ent,'mobile':mobile,'passwd':passwd},{'$set':setObj})
                    .lean()
                    .exec(function(err,customer){
                        cb(err,customer);
                    });
            } else {
                var customer = new Customer({
                    'ent':ent,
                    'weixinOpenId':openid,
                    'headimgurl':userinfo.headimgurl?userinfo.headimgurl:"",
                    'loginName':userinfo.nickname?userinfo.nickname:"",
                    'sex':userinfo.sex?parseInt(userinfo.sex):2
                });
                customer.save(function(err,res){
                    cb(err,res);
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
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            var customer = results.registerCustomer;
            if(results.getCardBalance){
                customer.cardBalance = results.getCardBalance.balance;
            }
            fn(null,customer);
        }
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
    Customer.findOne({'ent':ent,'weixinOpenId':openId})
        .lean()
        .exec(function(err,customer){
            if(err){
                fn(err,null);
            } else {
                if(customer){
                    fn(null,customer);
                } else {
                    fn(null,null);
                }
            }
        });
};

CustomerCtrl.weixinBind = function(ent,mobile,passwd,openId,fn){
    async.auto({
        'getCustomer':function(cb){
            Customer.findOne({'ent':ent,'mobile':mobile})
                .lean()
                .exec(function(err,customer){
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
        ,'getUserInfo':function(cb){
            var url = config.weixin.host+':'+config.weixin.port+'/weixin/userInfo/'+ent+'?openid='+openId;
            request({
                url:url,
                timeout:3000
            },function(err,response,body){
                if(err){
                    cb(err,null);
                } else {
                    var res = body?JSON.parse(body):{};
                    if(res.error==0&&res.data){
                        cb(null,res.data);
                    } else {
                        cb(new Error(res.errMsg),null);
                    }
                }
            });
        }
        ,'registerCustomer':['getCustomer','getUserInfo',function(cb,results){
            var userinfo = results.getUserInfo;
            if(results.getCustomer){
                var setObj = {
                    'weixinOpenId':openId
                };
                if(userinfo.headimgurl){
                    setObj.headimgurl = userinfo.headimgurl;
                }
                if(userinfo.nickname){
                    setObj.loginName = userinfo.nickname;
                }
                if(userinfo.sex){
                    setObj.sex = parseInt(userinfo.sex);
                }
                Customer.findOneAndUpdate({'ent':ent,'mobile':mobile,'passwd':passwd},{'$set':setObj})
                    .lean()
                    .exec(function(err,customer){
                        cb(err,customer);
                    });
            } else {
                var customer = new Customer({
                    'ent':ent,
                    'mobile':mobile,
                    'passwd':passwd,
                    'weixinOpenId':openId,
                    'headimgurl':userinfo.headimgurl?userinfo.headimgurl:"",
                    'loginName':userinfo.nickname?userinfo.nickname:"",
                    'sex':userinfo.sex?parseInt(userinfo.sex):2
                });
                customer.save(function(err,res){
                    cb(err,res);
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
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            var customer = results.registerCustomer;
            if(results.getCardBalance){
                customer.cardBalance = results.getCardBalance.balance;
            }
            fn(null,customer);
        }
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

CustomerCtrl.fulllist = function(ent,fn){
    var query = Customer.find({'ent': ent});
    query.exec(function (err, customers) {
        fn(err, customers);
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