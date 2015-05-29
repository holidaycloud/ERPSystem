/**
 * Created by zzy on 2015/5/29.
 */
var Schema = require('mongoose').Schema;

var ticketLogSchema = new Schema({
    ticket: String,
    createDate: {'type':Number, 'default':Date.now},
    openid: String
});

var TicketLogo = db.model('TicketLog', ticketLogSchema);
module.exports = TicketLogo;