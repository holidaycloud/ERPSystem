/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var ProductCtrl = require('./../control/productCtrl');
var StaticProductCtrl = require('./../control/staticProductCtrl');
/**
 Product接口
 */
router.post('/save', function(request, response) {
    var name = request.body.name;
    var introduction = request.body.introduction;
    var gps = {'lat':request.body.lat,'lon':request.body.lon};
    var content = request.body.content;
    var startDate = request.body.startDate;
    var endDate = request.body.endDate;
    var ent = request.body.ent;
    var weekend = request.body.weekend;
    var imageUrl = request.body.imageUrl;
    var imagesMediaId = request.body.imagesMediaId;
    var imagesTitle = request.body.imagesTitle;
    var type = request.body.type;
    var subProduct = request.body.subProduct;
    var isHot = request.body.isHot;
    var isRecommend = request.body.isRecommend;
    var lable = request.body.lable;
    var classify = request.body.classify;
    ProductCtrl.save(name,introduction,gps,content,startDate,endDate,ent,weekend,imageUrl,imagesMediaId,imagesTitle,type,subProduct,isHot,isRecommend,lable,classify,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/update', function(request, response) {
    var id = request.body.id;
    var imageUrl = request.body.imageUrl;
    var imagesMediaId = request.body.imagesMediaId;
    var imagesTitle = request.body.imagesTitle;
    var images = [];
    for(var i in imageUrl){
        var obj = {
            'url':imageUrl[i]
        };
        if(imagesMediaId[i]){
            obj.media_id = imagesMediaId[i];
        }
        if(imagesTitle[i]){
            obj.title = imagesTitle[i];
        }
        images.push(obj);
    }
    var obj = {
        'ent':request.body.ent,
        'images':images,
        'productType':request.body.type,
        'subProduct':request.body.subProduct?request.body.subProduct:[],
        'isHot':request.body.isHot,
        'isRecommend':request.body.isRecommend,
        'lable':request.body.lable?request.body.lable:[],
        'classify':request.body.classify?request.body.classify:null
    };
    if(request.body.lat&&request.body.lon){
        obj.gps = {'lat':request.body.lat,'lon':request.body.lon};
    }
    if(request.body.name){
        obj.name = request.body.name;
    }
    if(request.body.introduction){
        obj.introduction = request.body.introduction;
    }
    if(request.body.content){
        obj.content = request.body.content;
    }
    if(request.body.startDate){
        obj.startDate = request.body.startDate;
    }
    if(request.body.endDate){
        obj.endDate = request.body.endDate;
    }
    if(request.body.isEnable){
        obj.isEnable = request.body.isEnable;
    }
    if(request.body.weekend){
        obj.weekend = request.body.weekend;
    }
    ProductCtrl.update(id,obj,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/fulllist',function(request,response){
    var ent = request.query.ent;
    ProductCtrl.fulllist(ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
router.get('/list', function(request, response) {
    var ent = request.query.ent;
    var isRes = request.query.isRes=='true'?true:false;
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var isAll = request.query.isAll=='true'?true:false;
    ProductCtrl.list(ent,isRes,page,pageSize,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    },isAll);
});

router.get('/detail', function(request, response) {
    var id = request.query.id;
    ProductCtrl.detail(id,function(err,res){
        response.json({'error':0,'data':res});
    });
});

router.get('/nameList', function(request, response) {
    var ent = request.query.ent;
    var isRes = request.query.isRes;
    ProductCtrl.nameList(ent,isRes,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/staitcList', function(request, response) {
    var ent = request.query.ent;
    StaticProductCtrl.list(ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/classifyList', function(request, response) {
    var ent = request.query.ent;
    var classify = request.query.classify;
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    StaticProductCtrl.classifyList(page,pageSize,ent,classify,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/hotList', function(request, response) {
    var ent = request.query.ent;
    StaticProductCtrl.hotList(ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/recommendList', function(request, response) {
    var ent = request.query.ent;
    StaticProductCtrl.recommendList(ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;