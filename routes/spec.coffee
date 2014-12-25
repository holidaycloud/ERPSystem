express = require "express"
router = express.Router()
SpecCtrl = require "./../control/specCtrl"

router.post "/save",(request,response) ->
  productId = request.body.id
  specs = if request.body.spec? then JSON.parse(request.body.spec) else []
  SpecCtrl.save productId,specs,(err,res) ->
    if err
      response.json {error:1,errMsg:err.message}
    else
      response.json {error:0,data:res}

router.get "/list",(request,response) ->
  productId = request.query.id
  SpecCtrl.list productId,(err,res) ->
    if err
      response.json {error:1,errMsg:err.message}
    else
      response.json {error:0,data:res}

module.exports = router