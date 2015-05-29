/**
 * Created by zzy on 2015/5/29.
 */
/**
 * Created by zzy on 2015/5/29.
 */
var express = require('express');
var router = express.Router();
var TicketLogCtrl = require('./../control/ticketLogCtrl');
router.post('/save', function(request, response) {
    var ticket = request.body.ticket;
    var openid = request.body.openid;

    TicketLogCtrl.save(ticket,openid,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;