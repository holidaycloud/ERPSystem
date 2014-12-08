QRcodeCtrl = require './../control/qrcodeCtrl'
fn=(err,res) ->
  console.log err,res
QRcodeCtrl.generateCode fn,123123

