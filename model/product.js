/**
 * Created by zzy on 7/28/14.
 */
var Schema = require('mongoose').Schema;

var productSchema = new Schema({
    'name': String,
    'introduction': String,
    'gps': {'lat': Number, 'lon': Number},
    'content': String,
    'createTime': {type: Number, default: Date.now},
    'startDate': Number,
    'endDate': Number,
    'ent': {type: Schema.Types.ObjectId, ref: 'Ent'},
    'weekend': [Number],
    'isEnable': {type: Boolean, default: true},
    'images': [String]
});

var Product = db.model('Product', productSchema);
module.exports = Product;