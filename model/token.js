/**
 * Created by zzy on 7/28/14.
 */
var Schema = require('mongoose').Schema;

var tokenSchema = new Schema({
    'member':{type:Schema.Types.ObjectId,ref:'Member','unique': true},
    'token': String,
    'expireDate': Number
});
tokenSchema.index({'member':1});
tokenSchema.index({'token':1,'expireDate':1});
var Token = db.model('Token',tokenSchema);
module.exports = Token;