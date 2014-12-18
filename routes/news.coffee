express = require "express"
router = express.Router()
NewsCtrl = require "./../control/newsCtrl"

router.post "/save",(request,response) ->
  ent = request.body.ent
  title = request.body.title
  content = request.body.content
  NewsCtrl.save ent,title,content,(err,res) ->
    if err
      response.json {error:1,errMsg:err.message}
    else
      response.json {error:0,data:res}

router.post "/update",(request,response) ->
  id = request.body.id
  title = request.body.title
  content = request.body.content
  NewsCtrl.update id,title,content,(err,res) ->
    if err
      response.json {error:1,errMsg:err.message}
    else
      response.json {error:0,data:res}

router.get "/list",(request,response) ->
  page = request.query.page or 0
  pageSize = request.query.pageSize or 25
  ent = request.query.ent
  NewsCtrl.list page,pageSize,ent,(err,res) ->
    if err
      response.json {error:1,errMsg:err.message}
    else
      response.json {error:0,data:res}

router.get "/detail",(request,response) ->
  id = request.query.id
  NewsCtrl.detail(id,(err,res) ->
    if err
      response.json {error:1,errMsg:err.message}
    else
      response.json {error:0,data:res}
  )

module.exports = router