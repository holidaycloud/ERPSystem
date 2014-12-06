/**
 * Created by zzy on 2014/12/5.
 */
var Schema = require('mongoose').Schema;
var webCodeSchema = new Schema({
    'code':Number
});
var WebCode = db.model('WebCode',webCodeSchema);
module.exports = WebCode;