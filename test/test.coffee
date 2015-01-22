#QRcodeCtrl = require './../control/qrcodeCtrl'
#fn=(err,res) ->
#  console.log err,res
#QRcodeCtrl.generateCode fn,123123
#sms = require "./../tools/sms"
#sms.send("18918130030","您的验证码是：1234【联云科技】",(err,res) ->
#  console.log err,res
#)
mongoose = require "mongoose"
config = require "./../config/config.json"

uri = "mongodb://#{config.db.host}:#{config.db.port}/#{config.db.database}"
global.db = mongoose.createConnection uri

VerifyCodeCtrl = require "./../control/verifyCodeCtrl"

VerifyCodeCtrl.create("13901785293",(err,res) ->
  console.log err,res
)