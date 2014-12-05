/**
 * Created by zzy on 2014/11/11.
 */
var Schema = require('mongoose').Schema;

var cardLogSchema = new Schema({
    'card':{type:Schema.Types.ObjectId,ref:'Card'},
    'consume':Number,
    'member':{type:Schema.Types.ObjectId,ref:'Member'},
    'createDate':{'type': 'Number', 'default': Date.now}
});
cardLogSchema.index({'card':1});
var CardLog = db.model('CardLog',cardLogSchema);
module.exports = CardLog;