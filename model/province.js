/**
 * Created by zzy on 2014/11/3.
 */
var Schema = require('mongoose').Schema;

var provinceSchema = new Schema({
    'pid':String,
    'provinceName':String
});

var Province = db.model('Province',provinceSchema);
module.exports = Province;