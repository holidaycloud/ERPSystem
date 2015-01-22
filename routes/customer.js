/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var CustomerCtrl = require('./../control/customerCtrl');
var WeixinCustomerCtrl = require("./../control/weixinCustomerCtrl")

//会员接口
router.post("/saveWeixinCustomer",function(request,response){
    var ent = request.body.ent;
    var subscribe = request.body.subscribe;
    var openid = request.body.openid;
    var nickname = request.body.nickname;
    var sex = request.body.sex;
    var city = request.body.city;
    var country = request.body.country;
    var province = request.body.province;
    var language = request.body.language;
    var headimgurl = request.body.headimgurl;
    var subscribe_time = request.body.subscribe_time;
    var unionid = request.body.unionid;

    WeixinCustomerCtrl.save(ent,subscribe,openid,nickname,sex,city,country,province,language,headimgurl,subscribe_time,unionid,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/verifyCode', function(request, response) {
    var mobile = request.query.mobile;
    CustomerCtrl.verifyCode(mobile,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/webRegister', function(request, response) {
    var ent = request.body.ent;
    var mobile = request.body.mobile;
    var passwd = request.body.passwd;
    var code = request.body.code;
    CustomerCtrl.webRegister(ent,mobile,passwd,code,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/register', function(request, response) {
    var ent = request.body.ent;
    var mobile = request.body.mobile;
    var passwd = request.body.passwd;
    var loginName = request.body.loginName;
    var email = request.body.email;
    var birthday = request.body.birthday;
    var name = request.body.name;
    var address = request.body.address;
    CustomerCtrl.register(ent,mobile,passwd,loginName,email,birthday,name,address,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/initCard', function(request, response) {
    var ent = request.body.ent;
    var token = request.body.token;
    var customer = request.body.customer;
    CustomerCtrl.initCard(token,customer,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/update', function(request, response) {
    var id = request.body.id;
    var loginName = request.body.loginName;
    var email = request.body.email;
    var birthday = request.body.birthday;
    var name = request.body.name;
    var address = request.body.address;
    var isEnable = request.body.loginName;
    var obj ={
        'isEnable':isEnable
    };
    if(loginName){
        obj.loginName=loginName;
    }
    if(email){
        obj.email=email;
    }
    if(birthday){
        obj.birthday=birthday;
    }
    if(name){
        obj.name=name;
    }
    if(address){
        obj.address=address;
    }
    CustomerCtrl.update(id,obj,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/changePasswd', function(request, response) {
    var id = request.body.id;
    var oldPasswd = request.body.oldPasswd;
    var newPasswd = request.body.newPasswd;
    CustomerCtrl.changePasswd(id,oldPasswd,newPasswd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/weixinBind', function(request, response) {
    var ent = request.body.ent;
    var mobile = request.body.mobile;
    var passwd = request.body.passwd;
    var openId = request.body.openId;

    CustomerCtrl.weixinBind(ent,mobile,passwd,openId,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/detail', function(request, response) {
    var id = request.query.id;
    CustomerCtrl.detail(id,function(err,res){
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
    var ent = request.query.ent;
    var mobile = request.query.mobile;
    CustomerCtrl.list(page,pageSize,ent,mobile,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/weixinLogin', function(request, response) {
    var ent = request.query.ent;
    var openId = request.query.openId;
    CustomerCtrl.weixinLogin(ent,openId,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/getOrRegister', function(request, response) {
    var ent = request.query.ent;
    var mobile = request.query.mobile;
    var name = request.query.name;
    CustomerCtrl.getCustomerByMobileOrRegister(ent,mobile,name,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/loginOrRegister', function(request, response) {
    var ent = request.body.ent;
    var mobile = request.body.mobile;
    var passwd = request.body.passwd;
    CustomerCtrl.loginOrRegister(ent,mobile,passwd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/login', function(request, response) {
    var ent = request.query.ent;
    var mobile = request.query.mobile;
    var passwd = request.query.passwd;
    CustomerCtrl.login(ent,mobile,passwd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

module.exports = router;