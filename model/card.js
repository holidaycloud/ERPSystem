/**
 * Created by zzy on 2014/11/11.
 */
var Schema = require('mongoose').Schema;

var cardSchema = new Schema({
    'ent':{type:Schema.Types.ObjectId,ref:'Ent'},
    'cardNum':{'type':'String','unique': true},
    'createDate':{'type': 'Number', 'default': Date.now},
    'member':{type:Schema.Types.ObjectId,ref:'Member'},
    'qrCode':String
});

cardSchema.index({'ent':1});
var Card = db.model('Card',cardSchema);
module.exports = Card;