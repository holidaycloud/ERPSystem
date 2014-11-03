/**
 * Created by zzy on 2014/11/3.
 */
var Schema = require('mongoose').Schema;

var districtSchema = new Schema({
    'did':String,
    'cid':String,
    'districtName':String
});
districtSchema.index({'cid':1});
var District = db.model('District',districtSchema);
module.exports = District;