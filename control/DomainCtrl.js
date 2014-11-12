/**
 * Created by zzy on 2014/11/3.
 */
var EntDomain = require('./../model/entDomain');
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

DomainCtrl.update = function(id,obj,fn){
    entDomain.findByIdAndUpdate(id,{'$set':obj},function(err,res){
        fn(err,res);
    });
};

DomainCtrl.getEnt = function(domain,fn){
    EntDomain.findOne({'domain':domain},function(err,res){
        fn(err,res);
    });
};

DomainCtrl.detail = function(ent,fn){
    EntDomain.findOne({'ent':ent},function(err,res){
        fn(err,res);
    });
};

module.exports = DomainCtrl;