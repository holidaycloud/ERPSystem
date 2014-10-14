/**
 * Created by zzy on 2014/10/8.
 */
var Schema = require('mongoose').Schema;

var matchSchema = new Schema({
    'ent':{type:Schema.Types.ObjectId,ref:'Ent'},
    'providerProductId':{type:Schema.Types.ObjectId,ref:'Product'},
    'traderProductId':String
});

var ProductMatch = db.model('ProductMatch',matchSchema);
module.exports = ProductMatch;