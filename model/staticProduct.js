/**
 * Created by zzy on 2014/10/24.
 */
var Schema = require('mongoose').Schema;

var productSchema = new Schema({
    'productType':Number,
    'name':String,
    'introduction':String,
    'price':Number,
    'images':[{'url':String,'media_id':String,'title':String}],
    'isHot':Boolean,
    'isRecommend':Boolean
});

var StaticProduct = db.model('StaticProduct', productSchema);
module.exports = StaticProduct;