/**
 * Created by zzy on 2014/11/27.
 */
var express = require('express');
var router = express.Router();
var PayLogCtrl = require('./../control/payLogCtrl');

router.post('/save',function(request,response){
    PayLogCtrl.save(request.body.type,request.body,function(err,res){
        CardCtrl.consume(token,cardNo,cardMoney,ent,function(err,res){
            if(err){
                response.json({'error':1, 'errMsg':err.message});
            } else {
                response.json({'error':0, 'data':res});
            }
        });
    });
});

module.exports = router;