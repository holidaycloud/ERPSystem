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
memberSchema.index({'loginName':1,'passwd':1,'isEnable':1});
memberSchema.index({'mobile':1,'passwd':1,'isEnable':1});
memberSchema.index({'email':1,'passwd':1,'isEnable':1});
memberSchema.index({'mobile':1,'ent':1});
var Member = db.model('Member',memberSchema);
module.exports = Member;