#QRcodeCtrl = require './../control/qrcodeCtrl'
#fn=(err,res) ->
#  console.log err,res
#QRcodeCtrl.generateCode fn,123123
mongoose = require "mongoose"
config = require "./../config/config.json"
uri = "mongodb://#{config.db.host}:#{config.db.port}/#{config.db.database}"
global.db = mongoose.createConnection uri

PriceCtrl = require "./../control/priceCtrl"
id = "54a36e74d62713a35a8e728c"
PriceCtrl.deductInventory(id,1,(err,res) ->
  console.log err,res
)