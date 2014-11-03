/**
 * Created by zzy on 2014/11/3.
 */
var Schema = require('mongoose').Schema;

var entDomainSchema = new Schema({
    'ent':{type:Schema.Types.ObjectId,ref:'Ent'},
    'domain':String
});
entDomainSchema.index({'ent':1});
var EntDomain = db.model('EntDomain',entDomainSchema);
module.exports = EntDomain;