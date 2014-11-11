/**
 * Created by zzy on 2014/11/11.
 */
var async = require('async');
var TokenCtrl = require('./tokenCtrl');
var Card = require('./../model/card');
var CardLog = require('./../model/cardLog');
var CardCtrl = function(){};
CardCtrl.initCard = function(token,cardNum,fn){
    async.auto({
        'getMember':function(cb){
            TokenCtrl.findToken(token, function (err, token) {
                if (err) {
                    cb(err, null);
                } else {
                    if (token) {
                        cb(null, token.member);
                    } else {
                        cb(new Error('未找到用户'), null);
                    }
                }
            });
        },
        'initCard':['getMember',function(cb,results){
            var card = new Card({
                'cardNum':cardNum,
                'member':results.getMember._id
            });
            card.save(function(err,res){
                cb(err,res);
            });
        }]
    },function(err,results){
        fn(err,results.initCard);
    });
};

CardCtrl.consume = function(token,cardNum,cardMoney,fn){
    async.auto({
        'getMember':function(cb){
            TokenCtrl.findToken(token, function (err, token) {
                if (err) {
                    cb(err, null);
                } else {
                    if (token) {
                        cb(null, token.member);
                    } else {
                        cb(new Error('未找到用户'), null);
                    }
                }
            });
        },
        'getCard':function(cb){
            Card.findOne({'cardNum':cardNum},function(err,res){
               if(err){
                   cb(err,null);
               } else {
                   if(res){
                       cb(null,res);
                   } else {
                       cb(new Error('未找到卡片!'),null);
                   }
               }
            });
        },
        'consume':['getMember','getCard',function(cb,results){
            var cardLog = new CardLog({
                'card':results.getCard._id,
                'consume':cardMoney,
                'member':results.getMember._id
            });
            cardLog.save(function(err,res){
                cb(err,res);
            });
        }]
    },function(err,results){
        fn(err,results.consume);
    });
};
module.exports = CardCtrl;