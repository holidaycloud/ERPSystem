/**
 * Created by zzy on 2014/11/3.
 */
var EntDomain = require('./../model/entDomain');
var EntAlipay = require('./../model/entAlipay');
var Member = require('./../model/member');
var WebCode = require('./../model/webCode');
var TokenCtrl = require('./tokenCtrl');
var config = require('./../config/config.json')
var request = require('request');
var async = require('async');
var DomainCtrl = function(){};
DomainCtrl.save = function(ent,domain,address,lat,lon,email,logo,qrCode,title,tel,isEnable,fn){
    async.auto({
        'findEntDomain':function(cb){
            EntDomain.findOne({'ent':ent})
                .lean()
                .exec(function(err,res){
                    cb(err,res);
                });
        },
        'checkLongToken':['findEntDomain',function(cb,results){
            var entDomain = results.findEntDomain;
            if(entDomain&&entDomain.longToken){
                cb(null,null);
            } else {
                WebCode.findOneAndUpdate({},{'$inc':{'code':1}},function(err,res){
                    if(err){
                        cb(err,null);
                    } else {
                        cb(null,res.code);
                    }
                });
            }
        }],
        'saveWebMember':['checkLongToken',function(cb,results){
            if(results.checkLongToken){
                var member = new Member({
                    'ent':ent,
                    'loginName': '网站专用',
                    'mobile': results.checkLongToken,
                    'email':'',
                    'passwd':''
                });
                member.save(function(err,res){
                    cb(err,res);
                });
            } else {
                cb(null,null);
            }
        }],
        'generateToken':['saveWebMember',function(cb,results){
            if(results.saveWebMember){
                TokenCtrl.generateNoExpire(results.saveWebMember._id,function(err,res){
                   cb(err,res);
                });
            } else {
                cb(null,null);
            }
        }],
        'saveDomain':['generateToken',function(cb,results){
            var obj = {
                'ent':ent,
                'isEnable': isEnable
            };
            if(results.generateToken){
                obj.longToken = results.generateToken;
            }
            if(domain){
                obj.domain=domain;
            }
            if(address){
                obj.address=address;
            }
            if(lat){
                obj.gps={
                    'lat':lat,
                    'lon':lon
                };
            }
            if(email){
                obj.email=email;
            }
            if(logo){
                obj.logo=logo;
            }
            if(qrCode){
                obj.qrCode=qrCode;
            }
            if(title){
                obj.title=title;
            }
            if(tel){
                obj.tel=tel;
            }
            EntDomain.update({'ent':ent},{'$set':obj},{'upsert':true},function(err,res){
                cb(err,res);
            })
        }]
    },function(err,results){
        fn(err,results.saveDomain);
    });
};

DomainCtrl.saveAlipay = function(ent,pid,key,fn){
    var obj = {
        'ent':ent
    };
    if(pid){
        obj.pid = pid;
    }
    if(key){
        obj.key = key;
    }
    EntAlipay.update({'ent':ent},{'$set':obj},{'upsert':true},function(err,res){
        fn(err,res);
    });
};

DomainCtrl.alipayDetail = function(ent,fn){
    EntAlipay.findOne({'ent':ent})
        .lean()
        .exec(function(err,res){
            if(err){
                fn(err,null)
            } else {
                if(res){
                    fn(null,res);
                } else {
                    fn(null,{"ent":ent,"pid":config.alipay.pid,"key":config.alipay.key,'account':config.alipay.account})
                }
            }
        });
};

DomainCtrl.update = function(id,obj,fn){
    entDomain.findByIdAndUpdate(id,{'$set':obj},function(err,res){
        fn(err,res);
    });
};

DomainCtrl.getEnt = function(domain,fn){
    async.auto({
        'getDomain':function(cb){
            EntDomain.findOne({'domain':domain})
                .lean()
                .exec(function(err,res){
                    cb(err,res);
                });
        }
        ,'getAlipay':['getDomain',function(cb,results){
            var ent = results.getDomain?results.getDomain.ent:null;
            if(ent){
                DomainCtrl.alipayDetail(ent,function(err,res){
                   cb(err,res);
                });
            } else {
                cb(null,null);
            }
        }]
        ,'getWeixin':['getDomain',function(cb,results){
            var ent = results.getDomain?results.getDomain.ent:null;
            if(ent){
                var url = config.weixin.host+":"+config.weixin.port+"/weixin/configDetail/"+ent;
                request({
                    url:url,
                    timeout:3000
                },function(err,response,body){
                    var obj = body!=""?JSON.parse(body):null;
                    if(err){
                        cb(err,null);
                    } else {
                        if(obj&&obj.error==0){
                            cb(null,obj.data);
                        } else {
                            cb(new Error(obj.errMsg),null);
                        }
                    }
                });
            }else {
                cb(null,null);
            }

        }]
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            var domain = results.getDomain;
            if(domain){
                domain.alipay = results.getAlipay;
                domain.weixin = results.getWeixin;
                fn(null,domain);
            } else {
                fn(null,null);
            }

        }
    });
};

DomainCtrl.list = function(fn){
    EntDomain.find()
        .lean()
        .exec(function(err,res){
            if(err){
                fn(err,null);
            } else {
                var result={};
                res.forEach(function(domain){
                    result[domain.domain] = domain;
                });
                fn(null,result);
            }
        });
};

DomainCtrl.detail = function(ent,fn){
    EntDomain.findOne({'ent':ent},function(err,res){
        fn(err,res);
    });
};

module.exports = DomainCtrl;