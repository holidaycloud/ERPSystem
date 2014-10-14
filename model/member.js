/**
 * Created by zzy on 7/28/14.
 */
var Schema = require('mongoose').Schema;

var memberSchema = new Schema({
    'ent':{type:Schema.Types.ObjectId,ref:'Ent'},
    'loginName': {'type':'String','unique': true},
    'mobile': {'type':'String','unique': true},
    'email':{'type':'String','unique': true},
    'passwd':String,
    'createDate':{'type': 'Number', 'default': Date.now},
    'isEnable': Boolean
});

var Member = db.model('Member',memberSchema);
module.exports = Member;