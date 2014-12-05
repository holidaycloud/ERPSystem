/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var EntCtrl = require('./../control/entCtrl');
/**
 Ent接口
 */
router.post('/register', function(request, response) {
    var name = request.body.name;
    var contactName = request.body.contactName;
    var contactEmail = request.body.contactEmail;
    var contactPhone = request.body.contactPhone;
    var proCode = request.body.proCode;
    var remark = request.body.remark;
    var type = request.body.type;
    EntCtrl.register(name,contactName,contactEmail,contactPhone,proCode,remark,type,function(err,res){
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
    EntCtrl.list(page,pageSize,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/nameList', function(request, response) {
    EntCtrl.nameList(function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/detail', function(request, response) {
    var id = request.query.id;
    EntCtrl.detail(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/update', function(request, response) {
    var id = request.body.id;
    var name = request.body.name;
    var contactName = request.body.contactName;
    var contactEmail = request.body.contactEmail;
    var contactPhone = request.body.contactPhone;
    var proCode = request.body.proCode;
    var remark = request.body.remark;
    var type = request.body.type;
    EntCtrl.update(id,{
        'name':name,
        'contactName':contactName,
        'contactEmail':contactEmail,
        'contactPhone':contactPhone,
        'proCode':proCode,
        'remark':remark,
        'type':type
    },function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;