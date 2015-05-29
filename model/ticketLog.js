/**
 * Created by zzy on 2015/5/29.
 */
var Schema = require('mongoose').Schema;

var ticketLogSchema = new Schema({
    ticket: String,
    createDate: {'type':Number, 'default':Date.now},
    openid: String
});
ticketLogSchema.index({'ticket':1});
ticketLogSchema.index({'openid':1});
var TicketLogo = db.model('TicketLog', ticketLogSchema);
module.exports = TicketLogo;