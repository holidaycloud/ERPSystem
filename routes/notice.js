/**
 * Created by cloudbian on 2015/1/19.
 */
var express = require('express');
var httpReq = require('request');
var config = require('./../config/config.json');
var router = express.Router();
var NoticeCtrl = require('./../control/NoticeCtrl');
router.get('/list',function(request,response){
    var token = request.query.token;
    var page = request.query.page?request.query.page:0;
    var pageSize = request.query.pageSize?request.query.pageSize:25;
    NoticeCtrl.list(token,page,pageSize,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            var tmp = {};
            tmp.totalSize = res.getNoticesCount;
            tmp.notices = res.getNotices;
            response.json({'error':0, 'data':tmp});
        }
    });
});

router.get('/count',function(request,response){
    var token = request.query.token;
    NoticeCtrl.count(token,function(err,res){
        if(err){
            response.json({'error':1,'errMsg':err.message});
        }else{
            response.json({'error':0,'data':res.getNoticesCount});
        }
    });
});

router.post('/send',function(request,response){
    var person = request.body.person;
    var content = request.body.content;
    var token = request.body.token;
    NoticeCtrl.send(person,content,token,function(err,res){
        if(err){
            response.json({'error':1,'errMsg':err.message});
        }else{
            var json = {};
            json.type = 0;
            json.msg = content;
            json.receiver = res.getReceiverTokenID?res.getReceiverTokenID.token:"all";
            var option = {};
            option.url = config.http.host +":"+ config.http.port + "/notice/receiveMsg";
            option.timeout = 10000;
            option.form = json;
            httpReq.post(option,function(error,httpRes,body){
                if(!error&&httpRes.statusCode == 200){
                    if(body){
                        var obj = JSON.parse(body);
                        if(obj.error != 0){
                            console.log('---------------------------->send message to front end response errorMsg:',obj.errorMsg);
                        }
                    }else{
                        console.log('---------------------------->send message to front end response error');
                    }
                }else{
                    console.log('---------------------------->send message to front end error');
                }
                //推送请求不管成功与否，都只返回保存的结果
                response.json({'error':0,'data':res});
            });

        }
    });
});
module.exports = router;