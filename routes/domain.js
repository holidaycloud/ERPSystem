/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var DomainCtrl = require('./../control/DomainCtrl');

//Domain接口
router.post("/save",function(request, response){
    var ent = request.body.ent;
    var domain = request.body.domain;
    var address = request.body.address;
    var lat = request.body.lat;
    var lon = request.body.lon;
    var email = request.body.email;
    var logo = request.body.logo;
    var qrCode = request.body.qrCode;
    var title = request.body.title;
    var tel = request.body.tel;
    var isEnable = request.body.isEnable;
    DomainCtrl.save(ent,domain,address,lat,lon,email,logo,qrCode,title,tel,isEnable,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post("/saveAlipay",function(request, response){
    var ent = request.body.ent;
    var pid = request.body.pid;
    var key = request.body.key;

    DomainCtrl.saveAlipay(ent,pid,key,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post("/update",function(request, response){
    var id = request.body.id;
    var obj ={
        'isEnable':request.body.isEnable
    };
    if(request.body.domain){
        obj.domain = request.body.domain;
    }
    if(request.body.address){
        obj.address = request.body.address;
    }
    if(request.body.lat){
        obj.gps = {
            'lat':request.body.lat,
            'lon':request.body.lon
        };
    }
    if(request.body.email){
        obj.email = request.body.email;
    }
    if(request.body.logo){
        obj.logo = request.body.logo;
    }
    if(request.body.qrCode){
        obj.qrCode = request.body.qrCode;
    }
    if(request.body.title){
        obj.title = request.body.title;
    }
    if(request.body.tel){
        obj.tel = request.body.tel;
    }
    DomainCtrl.update(id,obj,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get("/detail",function(request, response){
    var ent = request.query.ent;
    DomainCtrl.detail(ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get("/list",function(request, response){
    DomainCtrl.list(function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get("/get",function(request, response){
    var domain = request.query.domain;
    DomainCtrl.getEnt(domain,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

module.exports = router;