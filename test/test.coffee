#QRcodeCtrl = require './../control/qrcodeCtrl'
#fn=(err,res) ->
#  console.log err,res
#QRcodeCtrl.generateCode fn,123123
_ = require 'underscore'

specs = [{name:123123},{_id:1,name:123123123},{_id:2,name:346456}]

a = _.filter specs,(spec) ->
  spec._id?

b = _.pluck a,"_id"

console.log b