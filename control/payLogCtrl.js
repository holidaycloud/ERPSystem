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
};
module.exports = PayLogCtrl;