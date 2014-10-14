#!/usr/bin/env node
var mongoose = require('mongoose');
var app = require('../app');
var OrderId = require('./../model/orderId');
var _ = require('underscore')._;

console.log('init number start',new Date());
var numArr = _.range(100000,200000);
numArr = _.shuffle(numArr);
console.log('init number end',new Date());
var objArr=[];
console.log('init object start',new Date());
numArr.forEach(function(num){
    objArr.push(new OrderId({'orderID': num.toString()}));
});
console.log('init object end',new Date());
console.log('save start',new Date());
OrderId.create(objArr,function(){
    db.connection.close();
    console.log('save end',new Date());
})