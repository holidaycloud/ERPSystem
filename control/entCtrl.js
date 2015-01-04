/**
 * Created by zzy on 7/31/14.
 */
var Ent = require('./../model/ent');
var async = require('async')
var EntCtrl = function(){};
EntCtrl.register = function(name,contactName,contactEmail,contactPhone,proCode,remark,type,fn){
    var ent = new Ent({
        'name': name,
        'contactName': contactName,
        'contactEmail': contactEmail,
        'contactPhone': contactPhone,
        'proCode': proCode,
        'remark': remark,
        'isEnable': true,
        'type': type
    });
    ent.save(fn);
};

EntCtrl.update = function(id,obj,fn){
    Ent.findByIdAndUpdate(id,{'$set':obj},function(err,res){
        fn(err,res);
    });
};

EntCtrl.nameList = function(fn){
    Ent.find({},'name',function(err,res){
        fn(err,res);
    });
};

EntCtrl.list = function(page,pageSize,fn){
    async.parallel([
        function(cb){
            Ent.find().limit(pageSize).skip(page*pageSize).exec(function(err,ents){
                cb(err,ents);
            })
        },
        function(cb){
            Ent.count(function(err,totalSize){
                cb(err,totalSize);
            });
        }
    ],function(err,res){
        if(err){
            fn(err,null);
        } else {
            fn(null,{
                'totalSize':res[1],
                'ents':res[0]
            });
        }
    });
};

EntCtrl.detail = function(id,fn){
    Ent.findById(id,function(err,res){
        fn(err,res);
    });
};

EntCtrl.agentList = function(ent,fn){
    Ent.findById(ent)
        .lean()
        .select("bind")
        .populate({"path":"bind.sell.ent","select":"name contactName contactPhone"})
        .exec(function(err,res){
           fn(err,res.bind?res.bind.sell:[]);
        });
};

EntCtrl.agentBind = function(ent,agent,fn){
    Ent.findByIdAndUpdate(ent,{"$push":{"bind.sell":{"ent":agent,"settle":0}}},function(err,res){
        fn(err,res);
    });
};

EntCtrl.agentUnbind = function(ent,agent,fn){
    Ent.findByIdAndUpdate(ent,{"$pull":{"bind.sell":{"ent":agent}}},function(err,res){
        fn(err,res);
    });
};

module.exports = EntCtrl;