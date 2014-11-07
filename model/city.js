/**
 * Created by zzy on 2014/11/3.
 */
var Schema = require('mongoose').Schema;

var citySchema = new Schema({
    'cid':String,
    'cityName':String,
    'pid':String,
    'zipcode':String
});
citySchema.index({'pid':1});
var City = db.model('City',citySchema);
module.exports = City;