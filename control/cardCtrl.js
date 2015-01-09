/**
 * Created by zzy on 2014/11/11.
 */
var async = require('async');
var _ = require('underscore');
var TokenCtrl = require('./tokenCtrl');
var Card = require('./../model/card');
var CardLog = require('./../model/cardLog');
var QRcodeCtrl = require('./qrcodeCtrl');
var CardCtrl = function(){};
CardCtrl.initCard = function(token,cardNum,ent,fn){
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
        //'getQrCode':function(cb){
        //  CardCtrl.getQRCode(cardNum,null,null,function(err,res){
        //      cb(err,res);
        //  });
        //},
        'initCard':['getMember',,function(cb,results){
            var card = new Card({
                'cardNum':cardNum,
                'member':results.getMember._id,
                'ent':ent
                //'qrCode':results.getQrCode
            });
            card.save(function(err,res){
                if(err){
                    if(err.code==11000){
                        cb(new Error('卡号已存在'),null);
                    } else {
                        cb(err,null);
                    }
                } else {
                    cb(null,res);
                }
            });
        }],
        'initConsume':['getMember','initCard',function(cb,results){
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

CardCtrl.getQRCode = function(cardNum,logo,width,fn){
    QRcodeCtrl.generateCode(cardNum,width,logo,function(err,res){
       fn(err,res);
    });
};

CardCtrl.detail = function(cardNum,ent,fn){
    async.auto({
        'getBalance':function(cb){
            CardCtrl.balance(cardNum,ent,function(err,res){
                cb(err,res);
            });
        },
        'getConsumeList':['getBalance',function(cb,results){
            CardLog.find({'card':results.getBalance._id})
                .populate({'path':'member','select':'loginName'})
                .exec(function(err,res){
                    cb(err,res);
                });
        }]
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            fn(null,{'balance':results.getBalance.balance,'list':results.getConsumeList})
        }
    });
};

CardCtrl.consume = function(token,cardNum,cardMoney,ent,fn){
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
            CardCtrl.balance(cardNum,ent,function(err,res){
              cb(err,res);
            });
        },
        'consume':['getMember','getBalance',function(cb,results){
            if(results.getBalance.balance+cardMoney>=0){
                var cardLog = new CardLog({
                    'card':results.getBalance._id,
                    'consume':cardMoney,
                    'member':results.getMember._id
                });
                cardLog.save(function(err,res){
                    cb(err,res);
                });
            } else {
                cb(new Error('余额不足,剩余'+results.getBalance.balance),null);
            }
        }]
    },function(err,results){
        fn(err,results.consume);
    });
};

CardCtrl.list = function(page,pageSize,ent,fn){
    async.auto({
        'totalSize':function(cb){
            Card.count({'ent':ent},function(err,res){
               cb(err,res);
            });
        },
        'getCards':function(cb){
            Card.find({'ent':ent})
                .skip(pageSize*page)
                .limit(pageSize)
                .populate({'path':'member','select':'loginName'})
                .lean()
                .exec(function(err,res){
                    cb(err,res);
                });
        },
        'getBalance':['getCards',function(cb,results){
            var cards = results.getCards;
            var ids =_.pluck(cards,"_id");
            var aggregate = CardLog.aggregate();
            aggregate.match({'card':{'$in':ids}});
            aggregate.group({'_id':'$card','balance':{'$sum':'$consume'}});
            aggregate.exec(function(err,res){
                cb(err,res);
            });
        }],
        'createResult':['getCards','getBalance',function(cb,results){
            var cards = results.getCards;
            var cardBlance = results.getBalance;
            var result = [];
            cardBlance.forEach(function(b){
                var card = getCard(cards,b._id);
                var obj = {
                    'createDate':card.createDate,
                    'cardNo':card.cardNum,
                    'member':card.member.loginName,
                    'balance': b.balance
                }
                result.push(obj);
            });
            cb(null,result);
        }]
    },function(err,results){
        fn(err,{'totalSize':results.totalSize,'cards':results.createResult});
    });

    var getCard = function(cards,id){
        var result;
        cards.forEach(function(c){
            if(c._id.toString()==id.toString()){
                result = c;
            }
        });
        return result;
    }
};

CardCtrl.getCard = function(id,fn){
    Card.findById(id,function(err,res){
        fn(err,res);
    });
};

CardCtrl.balance = function(cardNum,ent,fn){
  async.auto({
      'getCard':function(cb){
          Card.findOne({'cardNum':cardNum,'ent':ent},function(err,res){
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