/**
 * Created by zzy on 2014/11/29.
 */
var express = require('express');
var router = express.Router();
var MarketingCtrl = require('./../control/marketingCtrl');
router.post('/save',function(request,response){
    var ent = request.body.ent;
    var name = request.body.name;
    var content = request.body.content;
    var startDate = request.body.startDate;
    var endDate = request.body.endDate;
    var channel = request.body.channel;
    MarketingCtrl.save(ent,name,content,startDate,endDate,channel,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/list',function(request,response){
    var ent = request.query.ent;
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    MarketingCtrl.list(page,pageSize,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/detail',function(request,response){
    var id = request.query.id;
    MarketingCtrl.detail(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/update',function(request,response){
    var id = request.body.id;
    var name = request.body.name;
    var content = request.body.content;
    var startDate = request.body.startDate;
    var endDate = request.body.endDate;
    var channel = request.body.channel;
    MarketingCtrl.update(id,name,content,startDate,endDate,channel,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

module.exports = router;