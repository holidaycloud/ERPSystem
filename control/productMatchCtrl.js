/**
 * Created by zzy on 2014/10/8.
 */
var ProductMatch = require('./../model/productMatch');
var async = require('async');
var ProductMatchCtrl = function(){};

ProductMatchCtrl.getProduct = function(trader,traderProduct,fn){
    ProductMatch.findOne({'traderProductId':traderProduct,'ent':trader},function(err,res){
        fn(err,res);
    });
};

module.exports = ProductMatchCtrl;