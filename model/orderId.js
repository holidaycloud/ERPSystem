/**
 * Created by zzy on 4/11/14.
 */
var Schema = require('mongoose').Schema;

var orderIdSchema = new Schema({
    orderID: String,                                            //订单号
    isUsed:{'type':Boolean,'default':false}                     //是否使用
});
var OrderId = db.model('OrderId', orderIdSchema);
module.exports = OrderId;