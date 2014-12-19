class SpecCtrl
  Spec = require "./../model/spec"
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
    funcArr = for spec in specs
            spec.product = productId
            saveSpec spec
    async.parallel funcArr,(err,results) ->
      fn err,results

  #specs列表
  @list:(productId,fn) ->
    Spec.find {product:productId},(err,results) ->
      fn err,results

module.exports = SpecCtrl