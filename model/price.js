/**
 * Created by zzy on 7/28/14.
 */
var Schema = require('mongoose').Schema;

var priceSchema = new Schema({
    'product':{type:Schema.Types.ObjectId,ref:'Product'},
    'spec':{type:Schema.Types.ObjectId,ref:'Spec'},
    'date': Number,
    'price':Number,
    'basePrice':Number,
    'tradePrice':Number,
    'createTime': { type: Number, default: Date.now },
    'inventory':Number
});
priceSchema.index({'product':1});
priceSchema.index({'product':1,'spec':1});
priceSchema.index({'product':1,'date':1});
priceSchema.index({'product':1,'date':1,'inventory':1});
var Price = db.model('Price',priceSchema);
module.exports = Price;