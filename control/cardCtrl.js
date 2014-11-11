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
        }],
        'initConsume':['getMember','initCard',function(cb,result){
            var cardLog = new CardLog({
                'card':results.initCard._id,
                'consume':0,
                'member':results.getMember._id
            });
            cardLog.save(function(err,res){
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
        'getBalance':function(cb){
            CardCtrl.balance(cardNum,function(err,res){
              cb(err,res);
            });
        },
        'consume':['getMember','getBalance',function(cb,results){
            if(results.getBalance.balance+cardMoney>0){
                var cardLog = new CardLog({
                    'card':results.getBalance._id,
                    'consume':cardMoney,
                    'member':results.getMember._id
                });
                cardLog.save(function(err,res){
                    cb(err,res);
                });
            } else {
                cb(new Error('卡内余额不足,剩余'+results.getBalance.balance),null);
            }
        }]
    },function(err,results){
        fn(err,results.consume);
    });
};

CardCtrl.balance = function(cardNum,fn){
  async.auto({
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
      'getBalance':['getCard',function(cb,results){
          var aggregate = CardLog.aggregate();
          aggregate.match({'card':results.getCard._id});
          aggregate.group({'_id':'$card','balance':{'$sum':'$consume'}});
          aggregate.exec(function(err,res){
              cb(err,res[0]);
          });
      }]
  },function(err,results){
        fn(err,results.getBalance);
  });
};
module.exports = CardCtrl;