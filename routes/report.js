/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var ReportCtrl = require('./../control/reportCtrl');

//Report
router.get('/revenue',function(request,response){
    var ent = request.query.ent;
    var start = request.query.start;
    var end = request.query.end;
    ReportCtrl.saleReport(ent,start,end,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/revenueDetail',function(request,response){
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var ent = request.query.ent;
    var start = request.query.start;
    var end = request.query.end;

    ReportCtrl.saleDetail(page,pageSize,start,end,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/entOrders',function(request,response){
    var startDate = request.query.startDate;
    var endDate = request.query.endDate;

    ReportCtrl.entOrders(startDate,endDate,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;