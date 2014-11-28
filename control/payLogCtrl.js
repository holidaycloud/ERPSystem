/**
 * Created by zzy on 2014/11/27.
 */
var PayLog = require('./../model/payLog');
var PayLogCtrl = function(){};
PayLogCtrl.save = function(type,data,fn){
    var payLog = new PayLog({
        'type': type,
        'data':data
    });
    payLog.save(function(err,res){
        fn(err,res);
    })
};
module.exports = PayLogCtrl;