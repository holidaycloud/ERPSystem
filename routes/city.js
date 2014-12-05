/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var AreaCtrl = require('./../control/areaCtrl');

router.get('/list', function(request, response) {
    var pid = request.query.pid;
    AreaCtrl.cityList(pid,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;