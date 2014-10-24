/**
 * Created by zzy on 2014/10/24.
 */
var StaticProduct = require('./../model/staticProduct');
var StaticProductCtrl = function(){};

StaticProductCtrl.list = function(type,fn){
    StaticProduct.find({'productType':type},function(err,res){
        fn(err,res);
    });
};

StaticProductCtrl.hotList = function(fn){
    StaticProduct.find({'isHot':true},function(err,res){
        fn(err,res);
    });
};

StaticProductCtrl.recommendList = function(fn){
    StaticProduct.find({'isRecommend':true},function(err,res){
        fn(err,res);
    });
};

module.exports = StaticProductCtrl;