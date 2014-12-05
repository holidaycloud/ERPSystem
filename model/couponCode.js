/**
 * Created by zzy on 2014/11/28.
 */
var Schema = require('mongoose').Schema;

var couponCodeSchema = new Schema({
    code: {'type':String,'unique':true},
    isUsed:{'type':Boolean,'default':false}
});
couponCodeSchema.index({'isUsed':1});
var CouponCode = db.model('CouponCode',couponCodeSchema);
module.exports = CouponCode;