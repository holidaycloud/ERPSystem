/**
 * Created by zzy on 7/28/14.
 */
var Schema = require('mongoose').Schema;

var priceSchema = new Schema({
    'product':{type:Schema.Types.ObjectId,ref:'Product'},
    'date': Number,
    'price':Number,
    'createTime': { type: Number, default: Date.now },
    'inventory':Number
});

var Price = db.model('Price',priceSchema);
module.exports = Price;