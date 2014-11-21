/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var CardCtrl = require('./../control/cardCtrl');

//Card
router.post('/init',function(request,response){
    var cardNo = request.body.cardNo;
    var token = request.body.token;
    var ent = request.body.ent;
    CardCtrl.initCard(token,cardNo,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/list',function(request,response){
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var ent = request.query.ent;
    CardCtrl.list(page,pageSize,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/consume',function(request,response){
    var cardNo = request.body.cardNo;
    var cardMoney = parseFloat(request.body.cardMoney);
    var token = request.body.token;
    var ent = request.body.ent;
    CardCtrl.consume(token,cardNo,cardMoney,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/balance',function(request,response){
    var cardNo = request.query.cardNo;
    var ent = request.query.ent;
    CardCtrl.balance(cardNo,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/detail',function(request,response){
    var cardNo = request.query.cardNo;
    var ent = request.query.ent;
    CardCtrl.detail(cardNo,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;