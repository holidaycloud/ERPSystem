/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var FeedbackCtrl = require('./../control/feedbackCtrl');

//用户反馈
router.post("/save",function(request, response){
    var ent = request.body.ent;
    var name = request.body.name;
    var email = request.body.email;
    var title = request.body.title;
    var msg = request.body.msg;

    FeedbackCtrl.save(name,email,title,msg,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;