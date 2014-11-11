/**
 * Created by zzy on 2014/11/11.
 */
var Schema = require('mongoose').Schema;

var cardSchema = new Schema({
    'cardNum':{'type':'String','unique': true},
    'createDate':{'type': 'Number', 'default': Date.now},
    'member':{type:Schema.Types.ObjectId,ref:'Member'}
});

cardSchema.index({'cardNum':1});
var Card = db.model('Card',cardSchema);
module.exports = Card;