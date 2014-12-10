/**
 * Created by zzy on 7/31/14.
 */
var Token = require('./../model/token');
var Ent = require('./../model/ent');
var ctypto = require('crypto');
var async = require('async');
var WeixinCode = require('./../model/weixinCode');
var Member = require('./../model/member');
var TokenCtrl = function(){};

TokenCtrl.generate = function(member,fn){
    var shasum = ctypto.createHash('sha1');
    shasum.update(member+Date.now());
    var token = shasum.digest('hex');
    Token.findOneAndUpdate(
        {'member':member},
        {'member':member,'expireDate':Date.now()+60*60*24*7*1000,'token':token},
        {'upsert':true}
    )
    .populate('member')
    .lean()
    .exec(function(err,res){
            if(res){
                Ent.findById(res.member.ent,function(e,r){
                    res.member.ent = r;
                    fn(err,res);
                });
            } else {
                fn(err,null)
            }
    });
};

TokenCtrl.createWeixinToken = function(ent,fn){
    async.auto({
        'findCode':function(cb){
            WeixinCode.findOneAndUpdate({},{'$inc':{'code':1}},function(err,res){
                if(err){
                    cb(err,null);
                } else {
                    cb(null,res.code);
                }
            });
        },
        'saveWeixinMember':['findCode',function(cb,results){
            if(results.findCode){
                var member = new Member({
                    'ent':ent,
                    'loginName': '微信专用',
                    'mobile': results.findCode,
                    'email':'',
                    'passwd':''
                });
                member.save(function(err,res){
                    cb(err,res);
                });
            } else {
                cb(null,null);
            }
        }],
        'generateToken':['saveWeixinMember',function(cb,results){
            console.log(results);
            if(results.saveWeixinMember){
                TokenCtrl.generateNoExpire(results.saveWeixinMember._id,function(err,res){
                    cb(err,res);
                });
            } else {
                cb(null,null);
            }
        }]
    },function(err,results){
        fn(err,results.generateToken);
    });
};

TokenCtrl.generateNoExpire = function(member,fn){
    var shasum = ctypto.createHash('sha1');
    shasum.update(member+Date.now());
    var token = shasum.digest('hex');
    Token.findOneAndUpdate(
        {'member':member},
        {'member':member,'expireDate':new Date('2099-12-31').getTime(),'token':token},
        {'upsert':true},function(err,res){
            console.log(err,res);
            fn(err,res.token);
        }
    )
};


TokenCtrl.findToken = function(token,fn){
    Token.findOne({'token':token,'expireDate':{'$gt':Date.now()}})
        .populate('member')
        .lean()
        .exec(function(err,res){
            if(res){
                Ent.findById(res.member.ent,function(e,r){
                    res.member.ent = r;
                    fn(err,res);
                });
            } else {
                fn(err,null)
            }
        });
};

module.exports = TokenCtrl;