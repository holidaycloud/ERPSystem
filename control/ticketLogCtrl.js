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

TicketLogCtrl.dayCount = function(openid,day,fn){
    var now = new Date();
    var today = new Date(now.getFullYear(),now.getMonth(),now.getDate());
    TicketLog.count({openid:openid,createDate:{"$gte":today.getTime()-(86400000*day)}},function(err,res){
       fn(err,res);
    });
};

TicketLogCtrl.ticketCount = function(fn){
    var o = {};
    o.map = function(){
        emit(this.ticket,1);
    };
    o.reduce = function(key,values){
        totalCount =0;
        for(var i in values){
            totalCount++;
        }
        return totalCount
    };
    TicketLog.mapReduce(o,function(err, res){
        fn(err,res);
    });
};

module.exports = TicketLogCtrl;