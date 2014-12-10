#QRcodeCtrl = require './../control/qrcodeCtrl'
#fn=(err,res) ->
#  console.log err,res
#QRcodeCtrl.generateCode fn,123123
_ = require 'underscore'

a =
  a:1
  b:2
b=
  c:3
  d:4

aaa=_.extend a,b
console.log aaa