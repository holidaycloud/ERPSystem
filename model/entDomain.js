/**
 * Created by zzy on 2014/11/3.
 */
var Schema = require('mongoose').Schema;

var entDomainSchema = new Schema({
    'ent':{type:Schema.Types.ObjectId,ref:'Ent','unique': true},
    'domain':String,
    'address':String,
    'gps':{'lat':Number,'lon':Number},
    'email':String,
    'logo':String,
    'qrCode':String,
    'title':String,
    'tel':String,
    'isEnable':Boolean,
    'longToken':String
});
entDomainSchema.index({'domain':1});
var EntDomain = db.model('EntDomain',entDomainSchema);
module.exports = EntDomain;