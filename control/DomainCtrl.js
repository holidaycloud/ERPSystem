/**
 * Created by zzy on 2014/11/3.
 */
var EntDomain = require('./../model/entDomain');
var async = require('async');
var DomainCtrl = function(){};
DomainCtrl.save = function(ent,domain,fn){
    var entDomain = new EntDomain({
        'ent':ent,
        'domain':domain
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