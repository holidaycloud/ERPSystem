/**
 * Created by zzy on 2014/11/3.
 */
var EntDomain = require('./../model/entDomain');
var DomainCtrl = function(){};
DomainCtrl.save = function(ent,domain,address,lat,lon,email,logo,qrCode,title,tel,isEnable,fn){
    var obj = {
        'ent': ent,
        'domain': domain,
        'address': address,
        'gps': {'lat': lat, 'lon': lon},
        'email': email,
        'logo': logo,
        'qrCode': qrCode,
        'title': title,
        'tel': tel,
        'isEnable': isEnable
    };
    entDomain.update({'ent':id},{'$set':obj},{'upsert':true},function(err,res){
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