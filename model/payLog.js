/**
 * Created by zzy on 2014/11/27.
 */
var Schema = require('mongoose').Schema;
var payLogSchema = new Schema({
    'type': Number,                                                           //0 支付宝 1 微信
    createDate:{'type':Number,'default':Date.now},                      //创建日期
    'data':{}
});
var PayLog = db.model('PayLog', payLogSchema);
module.exports = PayLog;