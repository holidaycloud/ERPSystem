/**
 * Created by zzy on 2014/11/13.
 */
var Schema = require('mongoose').Schema;

var deliveryAddressSchema = new Schema({
    'province':String,
    'city':String,
    'district':String,
    'address':String,
    'showtext':String,
    'customer':{type:Schema.Types.ObjectId,ref:'Customer'},
    'isEnable':{type:Boolean,default:true}
});
deliveryAddressSchema.index({'customer':1});

var DeliveryAddress = db.model('DeliveryAddress',deliveryAddressSchema);
module.exports = DeliveryAddress;