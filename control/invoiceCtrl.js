/**
 * Created by zzy on 2014/11/13.
 */
var Invoice = require('./../model/invoice');
var InvoiceCtrl = function(){};

InvoiceCtrl.save = function(order,type,title,fn){
    var invoice = new Invoice({
        'order':order,
        'type':type,
        'title':title
    });
    invoice.save(function(err,res){
        fn(err,res);
    });
};

module.exports = InvoiceCtrl;