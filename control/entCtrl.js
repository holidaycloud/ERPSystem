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
        .select("sell")
        .populate({"path":"sell","select":"name contactName contactPhone"})
        .exec(function(err,res){
           fn(err,res.sell?res.sell:[]);
        });
};

EntCtrl.agentBind = function(ent,agent,fn){
    async.auto({
        bindSell:function(cb){
            Ent.findByIdAndUpdate(ent,{"$addToSet":{"sell":agent}},function(err,res){
                cb(err,res);
            });
        },
        bindProvider:function(cb){
            Ent.findByIdAndUpdate(agent,{"$addToSet":{"provider":ent}},function(err,res){
                cb(err,res);
            });
        }
    },function(err,results){
        fn(err,results);
    });
};

EntCtrl.agentUnbind = function(ent,agent,fn){
    async.auto({
        unBindSell:function(cb){
            Ent.findByIdAndUpdate(ent,{"$pull":{"sell":agent}},function(err,res){
                cb(err,res);
            });
        },
        unBindProvider:function(cb){
            Ent.findByIdAndUpdate(agent,{"$pull":{"provider":ent}},function(err,res){
                cb(err,res);
            });
        }
    },function(err,results){
        fn(err,results);
    });

};

module.exports = EntCtrl;