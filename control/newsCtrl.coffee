class NewsCtrl
  async = require "async"
  News = require "./../model/news"
  @save = (ent,title,content,fn) ->
    news = new News({
      ent
      title
      content
    })
    news.save((err,res) ->
      fn err,res
    )

  @update = (id,title,content,fn) ->
    News.findByIdAndUpdate(id,{$set:{title,content}},(err,res) ->
      fn err,res
    )

  @list = (page,pageSize,ent,fn) ->
    async.auto({
      totalSize:(cb) ->
        News.count {ent},(err,count) ->
          cb err,count
      ,getNews:(cb) ->
        News.find({ent}).skip(page*pageSize).limit(pageSize).exec((err,res)->
          cb err,res
        )
    },(err,results) ->
        if err
          fn err
        else
          fn null,{totalSize:results.totalSize,news:results.getNews}
    )
module.exports = NewsCtrl