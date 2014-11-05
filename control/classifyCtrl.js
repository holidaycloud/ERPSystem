/**
 * Created by zzy on 2014/11/5.
 */
var Classify = require('./../model/classify');
var ClassifyCtrl = function(){};

ClassifyCtrl.save=function(ent,name,fn){
    var classify = new Classify({
        'ent':ent,
        'name':name
    });
    classify.save(function(err,res){
        fn(err,res);
    });
};

ClassifyCtrl.list = function(ent,fn){
    Classify.find({'ent':ent},function(err,res){
        fn(err,res);
    })
};

ClassifyCtrl.update = function(id,name,isEnable,fn){
    Classify.findByIdAndUpdate(id,{'$set':{'name':name,'isEnable':isEnable}},function(err,res){
        fn(err,res);
    });
};

ClassifyCtrl.detail = function(id,fn){
    Classify.findById(id,function(err,res){
        cb(err,res);
    });
};

module.exports = ClassifyCtrl;