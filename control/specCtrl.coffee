class SpecCtrl
  Spec = require "./../model/spec"
  Price = require "./../model/price"
  _ = require "underscore"
  async = require "async"

  #私有方法，创建保存spec的方法
  saveSpec = (spec) ->
    (cb) ->
      if spec._id?
        Spec.findByIdAndUpdate spec._id,{$set:{name:spec.name,product:spec.product}},(err,res) ->
          cb err,res
      else
        s = new Spec spec
        s.save (err,res) ->
          cb err,res

  #specs保存
  @save:(productId,specs,fn) ->
    idList = _.filter specs,(spec)->
      spec._id?
    ids = _.pluck idList,"_id"
    async.auto({
      #删除_id不在specs里的spec
      deleteSpecs:(cb) ->
        Spec.remove {product:productId,_id:{$nin:ids}},(err,res) ->
          cb err,res
      #删除_id不在specs里的Price
      deletePrice:(cb) ->
        Price.remove {product:productId,spec:{$nin:ids}},(err,res) ->
          cb err,res
      saveSpecs:["deleteSpecs","deletePrice",(cb) ->
        #这个是最终要修改或者保存的东东
        funcArr = for spec in specs
          spec.product = productId
          saveSpec spec
        async.parallel funcArr,(err,results) ->
          cb err,results
      ]
    },(err,results) ->
      fn err,results.saveSpecs
    )


  #specs列表
  @list:(productId,fn) ->
    Spec.find {product:productId},(err,results) ->
      fn err,results

module.exports = SpecCtrl