/**
 * Created by zzy on 2014/11/27.
 */
var Schema = require('mongoose').Schema;

var entAlipaySchema = new Schema({
    'ent':{type:Schema.Types.ObjectId,ref:'Ent'},
    'pid':String,
    'key':String
});
entAlipaySchema.index({'ent':1},{'unique': true});
var EntAlipay = db.model('EntAlipay',entAlipaySchema);
module.exports = EntAlipay;