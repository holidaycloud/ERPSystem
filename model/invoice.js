/**
 * Created by zzy on 2014/11/13.
 */
var Schema = require('mongoose').Schema;

var invoiceSchema = new Schema({
    'order':{type:Schema.Types.ObjectId,ref:'Order'},
    'type': Number, //0个人 1公司
    'title': String, //抬头
    'status': {'type':Number,'default':0}, //0未开票 1已开票
    'invoiceNo':String, //发票号
    'createDate':{'type':Number,'default':Date.now}
});

var Invoice = db.model('Invoice',invoiceSchema);

module.exports = Invoice;