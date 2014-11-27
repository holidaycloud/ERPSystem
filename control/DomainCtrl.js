/**
 * Created by zzy on 2014/11/3.
 */
var EntDomain = require('./../model/entDomain');
var EntAlipay = require('./../model/entAlipay');
var async = require('async');
var DomainCtrl = function(){};
DomainCtrl.save = function(ent,domain,address,lat,lon,email,logo,qrCode,title,tel,isEnable,fn){
    var obj = {
        'ent':ent,
        'isEnable': isEnable
    };
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
        fn(err,res);
    })
};

DomainCtrl.saveAlipay = function(ent,pid,key,fn){
    var entAlipay = new EntAlipay({
        'ent':ent,
        'pid':pid,
        'key':key
    });
    entAlipay.save(function(err,res){
        fn(err,res);
    });
};

DomainCtrl.alipayDetail = function(ent,fn){
    EntAlipay.findOne({'ent':ent})
        .lean()
        .exec(function(err,res){
            fn(err,res);
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
            }
        }]
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            var domain = results.getDomain;
            if(domain){
                domain.alipay = results.getAlipay;
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