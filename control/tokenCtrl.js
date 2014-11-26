/**
 * Created by zzy on 7/31/14.
 */
var Token = require('./../model/token');
var Ent = require('./../model/ent');
var ctypto = require('crypto');
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

TokenCtrl.generateNoExpire = function(member,fn){
    console.log('member:',member);
    var shasum = ctypto.createHash('sha1');
    shasum.update(member+Date.now());
    var token = shasum.digest('hex');
    Token.findOneAndUpdate(
        {'member':member},
        {'member':member,'expireDate':new Date('2099-12-31').getTime(),'token':token},
        {'upsert':true},function(err,res){
            console.log(member);
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