TokenCtrl = require './../control/tokenCtrl'
urlVerfiy = require './../config/urlVerfiy.json'

class VerfiyRequest
  VerfiyRequest.verfiy = (req,res,next) ->
    url = req.url.split(/\?/)[0]
    if url in urlVerfiy
      next()
    else
      token = req.body?.token or req.query?.token
      if token?
        TokenCtrl.findToken(token,(err,result) ->
          if result? then next() else res.json {error:1,errMsg:"verify failed"}
        )
      else
        res.json {error:1,errMsg:"verify failed"}
module.exports = VerfiyRequest