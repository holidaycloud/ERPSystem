/**
 * Created by zzy on 2014/11/19.
 */
var Schema = require('mongoose').Schema;

var customerCardSchema = new Schema({
    'card':{type:Schema.Types.ObjectId,ref:'Card'},
    'customer':{type:Schema.Types.ObjectId,ref:'Customer'},
    'bindDate':{type:Number,default:Date.now}
});

customerCardSchema.index({'customer':1});

var CustomerCard = db.model('CustomerCard',customerCardSchema);
module.exports = CustomerCard;