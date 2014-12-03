/**
 * Created by zzy on 2014/11/29.
 */
var Marketing = require('./../model/marketing');
var async = require();
var MarketingCtrl = function(){};
MarketingCtrl.save = function(ent,name,content,startDate,endDate,channel,fn){
    var marketing = new Marketing({
        'ent':ent,
        'name':name,
        'content':content,
        'startDate':startDate,
        'endDate':endDate,
        'channel':channel
    });
    marketing.save(function(err,res){
       fn(err,res);
    });
};

MarketingCtrl.list = function(page,pageSize,ent,fn){
    async.auto({
        'getList':function(cb){
            Marketing.find({'ent':ent})
                .skip(page*pageSize)
                .limit(pageSize)
                .exec(function(err,marketings){
                    cb(err,marketings);
                });
        },
        'getTotalSize':function(cb,results){
            Marketing.count({'ent':ent},function(err,size){
                cb(err,size);
            });
        }
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            fn(null,{
                'totalSize':results.getTotalSize,
                'markets':results.getList
            });
        }
    });
};

MarketingCtrl.detail = function(id,fn){
    Marketing.findById(id,function(err,res){
        fn(err,res);
    });
};

MarketingCtrl.update = function(id,name,content,startDate,endDate,channel,fn){
    var obj = {};
    if(name){
        obj.name=name;
    }
    if(content){
        obj.content=content;
    }
    if(startDate){
        obj.startDate=startDate;
    }
    if(endDate){
        obj.endDate=endDate;
    }
    if(channel){
        obj.channel=channel;
    }
    Marketing.findByIdAndUpdate(id,{'$set':obj},function(err,res){
       fn(err,res);
    });
};

module.exports = MarketingCtrl;