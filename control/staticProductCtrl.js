/**
 * Created by zzy on 2014/10/24.
 */
var StaticProduct = require('./../model/staticProduct');
var StaticProductCtrl = function(){};

StaticProductCtrl.list = function(ent,fn){
    StaticProduct.find({'ent':ent},function(err,res){
        fn(err,res);
    });
};

StaticProductCtrl.hotList = function(ent,fn){
    StaticProduct.find({'ent':ent,'isHot':true},function(err,res){
        fn(err,res);
    });
};

StaticProductCtrl.recommendList = function(ent,fn){
    StaticProduct.find({'ent':ent,'isRecommend':true},function(err,res){
        fn(err,res);
    });
};

StaticProductCtrl.classifyList = function(page,pageSize,ent,classify,fn){
    async.auto({
        'getTotal':function(cb){
            var query = StaticProduct.count({'ent':ent});
            if(classify){
                query.where({'classify':classify});
            }
            query.exec(function(err,res){
                fn(err,res);
            });
        },
        'getProduct':function(cb){
            var query = StaticProduct.find({'ent':ent});
            query.skip(page*pageSize);
            query.limit(pageSize);
            if(classify){
                query.where({'classify':classify});
            }
            query.exec(function(err,res){
                fn(err,res);
            });
        }
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            fn(null,{
                'totalSize':results.getTotal,
                'products':results.getProduct
            });
        }
    });
};

module.exports = StaticProductCtrl;