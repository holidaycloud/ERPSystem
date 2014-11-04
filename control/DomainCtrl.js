/**
 * Created by zzy on 2014/11/3.
 */
var EntDomain = require('./../model/entDomain');
var DomainCtrl = function(){};
DomainCtrl.save = function(ent,domain,address,lat,lon,email,logo,qrCode,title,tel,fn){
    var entDomain = new EntDomain({
        'ent':ent,
        'domain':domain,
        'address':address,
        'gps':{'lat':lat,'lon':lon},
        'email':email,
        'logo':logo,
        'qrCode':qrCode,
        'title':title,
        'tel':tel
    });
    entDomain.save(function(err,res){
        fn(err,res);
    });
};

DomainCtrl.getEnt = function(domain,fn){
    EntDomain.findOne({'domain':domain},function(err,res){
       fn(err,res);
    });
};

module.exports = DomainCtrl;