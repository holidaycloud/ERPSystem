class PriceCtrl
  Price = require "./../model/price"
  Product = require "./../model/product"
  Spec = require "./../model/spec"
  async = require "async"
  _ = require "underscore"

  @type0save:(productId,startDate,endDate,price,weekendPrice,basePrice,weekendBasePrice,tradePrice,weekendTradePrice,inventory,weekendinventory,fn) ->
    async.auto {
      getProduct:(cb) ->
        Product.findById productId,(err,res) ->
          if err?
            cb err
          else
            if res?
              cb null,res
            else
              cb new Error("产品不存在")
      removePrice:(cb) ->
        Price.remove {product:productId,date:{$gte:startDate,$lte:endDate}},(err,res) ->
          cb err,res
      saveProductPrice:["getProduct",(cb,results) ->
        priceArr = []
        step = (endDate-startDate)/86400000+1
        for i in [0...step]
          isWeekend = false
          date = new Date(startDate+i*86400000)
          if _.indexOf(results.getProduct.weekend,date.getDay())>=0
            isWeekend = true
          priceArr.push {
            product:results.getProduct._id,
            date: startDate+i*86400000,
            price: if isWeekend then weekendPrice else price,
            basePrice:if isWeekend then weekendBasePrice else basePrice,
            tradePrice:if isWeekend then weekendTradePrice else tradePrice,
            inventory:if isWeekend then weekendinventory else inventory
          }
        Price.create priceArr,(err,res) ->
          cb err,res
      ]
    },(err,results) ->
      fn err,results.saveProductPrice

  @type3save: (product,spec,price,basePrice,tradePrice,inventory,fn) ->
    console.log product,spec,price,basePrice,tradePrice,inventory
    query = {product}
    query.spec = spec if spec?
    Price.update query,{$set:{price:price,basePrice:basePrice,tradePrice:tradePrice,inventory:inventory}},{upsert:true},(err,res) ->
      fn err,res

  type0PriceList = (product,startDate,endDate,fn) ->
    Price.find {product,date:{$gte:startDate,$lte:endDate}},(err,res) ->
      fn err,res

  type3PriceList = (product,fn) ->
    async.auto {
      getSpecs:(cb) ->
        Spec.find {product}
          .lean()
          .exec (err,res) ->
            cb err,res
      getPrices:(cb) ->
        Price.find {product}
          .lean()
          .exec (err,res) ->
            cb err,res
      mergeSpecPrice:["getSpecs","getPrices",(cb,results) ->
        specs = results.getSpecs;
        prices = results.getPrices
        if specs.length is 0
          cb null,prices
        else
          result = for spec in specs
            price = _.filter prices,(p) ->
              p.spec.toString() is spec._id.toString()

            if price[0]?
              price[0].spec = spec
              price[0]
            else
              {spec}
          cb null,result
      ]
    },(err,results) ->
      fn err,results.mergeSpecPrice


  @list:(product,startDate,endDate,fn) ->
    async.auto {
      getProduct:(cb) ->
        Product.findById product,(err,res) ->
          if err
            cb err
          else
            if res? then cb null,res else cb new Error("产品未找到"),null
      getPrice:["getProduct",(cb,results) ->
        if results.getProduct?.productType is 0
          type0PriceList product,startDate,endDate,cb
        else
          type3PriceList product,cb
      ]
    },(err,results) ->
      fn err,results.getPrice

  @update:(id,price,basePrice,tradePrice,inventory,fn) ->
    Price.findByIdAndUpdate id,{$set:{price,basePrice,tradePrice,inventory}},(err,res) ->
      fn err,res

  @getPrice:(id,fn) ->
    Price.findById id,(err,res) ->
      fn err,res

  @getDatePrice:(product,startDate,fn) ->
    query = {product}
    query.date = startDate if startDate?
    Price.findOne query,(err,res) ->
      fn err,res

  @getFirstPrice:(product,fn) ->
    Price.findOne({product,date:{$gte:Date.now()},inventory:{$gt:0}}).sort("date").exec((err,res) ->
      fn err,res
    )

  @deductInventory:(id,quantity,fn) ->
    Price.findByIdAndUpdate id,{$inc:{inventroy:-quantity}},(err,res) ->
      fn err,res

  @returnInventory:(id,quantity,fn) ->
    Price.findByIdAndUpdate id,{$inc:{inventroy:quantity}},(err,res) ->
      fn err,res

module.exports = PriceCtrl