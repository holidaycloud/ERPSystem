/**
 * Created by zzy on 2015/5/29.
 */
var TicketLog = require('./../model/ticketLog');
var TicketLogCtrl = function(){};

TicketLogCtrl.save = function(ticket,openid,fn){
    var ticketLog = new TicketLog({
        ticket:ticket,
        openid:openid
    });
    ticketLog.save(fn);
};

module.exports = TicketLogCtrl;