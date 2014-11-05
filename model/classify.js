/**
 * Created by zzy on 2014/11/5.
 */
var Schema = require('mongoose').Schema;

var classifySchema = new Schema({
    'ent':{type: Schema.Types.ObjectId, ref: 'Ent'},
    'name': String,
    'isEnable': {'type':Boolean,'default':true}
});
classifySchema.index({'ent':1});

var Classify = db.model('Classify', classifySchema);
module.exports = Classify;