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

StaticProductCtrl.classifyList = function(ent,classify,fn){
    var query = StaticProduct.find({'ent':ent});
    if(classify){
        query.where({'classify':classify});
    }
   query.exec(function(err,res){
        fn(err,res);
    });
};

module.exports = StaticProductCtrl;