/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var ClassifyCtrl = require('./../control/classifyCtrl');

//产品分类
router.post("/save",function(request, response){
    var ent = request.body.ent;
    var name = request.body.name;
    ClassifyCtrl.save(ent,name,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post("/update",function(request, response){
    var id = request.body.id;
    var name = request.body.name;
    var isEnable = request.body.isEnable;
    ClassifyCtrl.update(id,name,isEnable,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get("/list",function(request, response){
    var ent = request.query.ent;
    ClassifyCtrl.list(ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get("/detail",function(request, response){
    var id = request.query.id;
    ClassifyCtrl.detail(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;