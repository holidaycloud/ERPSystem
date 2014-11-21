/**
 * Created by zzy on 2014/11/21.
 */
var express = require('express');
var router = express.Router();
var InvoiceCtrl = require('./../control/invoiceCtrl');

//Invoice
router.post('/save',function(request,response){
    var order = request.body.order;
    var type = request.body.type;
    var title = request.body.title;
    InvoiceCtrl.save(order,type,title,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;