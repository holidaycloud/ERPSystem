/**
 * Created by cloudbian on 2015/1/19.
 */
var Notice = require('./../model/notice');
var TokenCtrl = require('./tokenCtrl');
var MemberCtrl = require('./MemberCtrl');
var async = require('async');
var NoticeCtrl = function () {
};

NoticeCtrl.list = function (token, page, pageSize, fn) {
    async.auto({
            'getMemberID': function (cb) {
                TokenCtrl.findToken(token, function (err, result) {
                    cb(err, result);
                });
            }
            , 'getNotices': ['getMemberID', function (cb, result) {
                var query = Notice.find();
                query.or([{receiver: result.getMemberID.member._id},{receiver:null}]);
                query.sort({'createDate': -1});
                query.skip(page * pageSize);
                query.limit(pageSize);
                query.exec(function (err, notices) {
                    cb(err, notices);
                });
            }]
            ,'getNoticesCount':['getMemberID', function(cb,result){
                Notice.count({$or:[{receiver: result.getMemberID.member._id},{receiver: null}]},function(err,res){
                    cb(err,res);
                });
            }]
        }
        , function (err, result) {
            fn(err, result);
        });
};

NoticeCtrl.count = function(token,fn){
    async.auto({
            'getMemberID': function (cb) {
                TokenCtrl.findToken(token, function (err, result) {
                    cb(err, result);
                });
            }
            ,'getNoticesCount':['getMemberID', function(cb,result){
                Notice.count({$or:[{receiver: result.getMemberID.member._id},{receiver: null}]},function(err,res){
                    cb(err,res);
                });
            }]
        }
        , function (err, result) {
            fn(err, result);
        });
};

NoticeCtrl.send = function (person, content, token, fn) {
    async.auto({
            'checkReceiver': function (cb) {
                if ("all" === person) {
                    cb(null, null);
                } else {
                    MemberCtrl.detail(person, function (err, person) {
                        if (err) {
                            cb(err, null);
                        } else {
                            if(person){
                                cb(err, person);
                            }else{
                                cb(new Error('未找到发送对象'), null);
                            }
                        }
                    });
                }
            }
            ,'getSenderID': function(cb){
                TokenCtrl.findToken(token,function(err,sender){
                    cb(err,sender);
                });
            }
            ,'getReceiverTokenID':function(cb){
                if("all" === person){
                    cb(null,null);
                }else{
                    TokenCtrl.findTokenByMemberId(person,function(err,res){
                        cb(err,res);
                    });
                }

            }
            ,'saveNotice':['checkReceiver','getSenderID',function(cb,result){
                var notice = new Notice({
                    'content':content,
                    'receiver':result.checkReceiver?result.checkReceiver._id:null,
                    'sender':result.getSenderID.member._id
                });
                notice.save(function(err,res){
                    cb(err,res);
                });
            }]
        }
        , function (err, result) {
            fn(err,result);
        });
};

module.exports = NoticeCtrl;
