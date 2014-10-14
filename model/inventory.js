/**
 * Created by zzy on 7/28/14.
 */
var Schema = require('mongoose').Schema;

var inventorySchema = new Schema({
    'inventory': Number,          //库存
    'startDate': Number,          //库存开始时间
    'endDate': Number             //库存结束时间
});

var Inventory = db.model('Inventory',inventorySchema);

module.exports = Inventory;