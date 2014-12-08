request = require 'request'
class QRcodeCtrl
  QRcodeCtrl.generateCode = (fn,code,width=200,logo) ->
    form =
      string : code
      width : width
      logo : logo
    request.post url:"http://api.uihoo.com/qrcode/qrcode.http.php",form:form,(err,httpResponse,body) ->
      if err
        fn err,null
      else
        res = JSON.parse body if body isnt ""
        data = res?.base64
        data = data?.replace /\r\n/g,""
        fn null,data
module.exports = QRcodeCtrl