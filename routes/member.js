/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var MemberCtrl = require('./../control/memberCtrl');
var TokenCtrl = require('./../control/tokenCtrl');
/**
 Member接口
 */
router.post('/register', function(request, response) {
    var ent = request.body.ent;
    var loginName = request.body.loginName;
    var mobile = request.body.mobile;
    var email = request.body.email;
    var passwd = request.body.passwd;
    MemberCtrl.register(ent,loginName,mobile,email,passwd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/update', function(request, response) {
    var id = request.body.id;
    var obj ={};
    if(request.body.ent){
        obj.ent = request.body.ent
    }
    if(request.body.loginName){
        obj.loginName = request.body.loginName
    }
    if(request.body.mobile){
        obj.mobile = request.body.mobile
    }
    if(request.body.email){
        obj.email = request.body.email
    }
    MemberCtrl.update(id,obj,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/weixinLogin', function(request, response) {
    var openid = request.query.openid;

    MemberCtrl.weixinLogin(openid,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/login', function(request, response) {
    var loginName = request.query.mobile||request.query.email||request.query.username;
    var passwd = request.query.passwd;
    MemberCtrl.login(loginName,passwd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/token', function(request, response) {
    var token = request.query.token;
    MemberCtrl.token(token,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/noExpireToken', function(request, response) {
    var member = request.query.member;
    TokenCtrl.generateNoExpire(member,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/createWeixinToken', function(request, response) {
    var ent = request.body.ent;
    TokenCtrl.createWeixinToken(ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/changePasswd', function(request, response) {
    var token = request.body.token;
    var oldPasswd = request.body.oldPasswd;
    var newPasswd = request.body.newPasswd;
    MemberCtrl.changePasswd(token,oldPasswd,newPasswd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/list', function(request, response) {
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var mobile = request.query.mobile;
    var ent = request.query.ent;
    MemberCtrl.list(page,pageSize,mobile,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/detail', function(request, response) {
    var id = request.query.id;
    MemberCtrl.detail(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/weixinBind', function(request, response) {
    var mobile = request.body.loginName;
    var passwd = request.body.pwd;
    var openID = request.body.openid;
    MemberCtrl.weixinBind(mobile,passwd,openID,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;