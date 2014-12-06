/**
 * Created by zzy on 2014/12/5.
 */
var Schema = require('mongoose').Schema;
var weixinCodeSchema = new Schema({
    'code':Number
});
var WeixinCode = db.model('WeixinCode',weixinCodeSchema);
module.exports = WeixinCode;