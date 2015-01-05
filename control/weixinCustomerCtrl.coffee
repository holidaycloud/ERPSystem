class WeixinCustomerCtrl
  WeixinCustomer = require "./../model/weixinCustomer"
  CustomerCtrl = require "./customerCtrl"
  async = require "async"
  @save:(ent,subscribe,openid,nickname,sex,city,country,province,language,headimgurl,subscribe_time,unionid,fn) ->
    async.auto {
      findCustomer:(cb) ->
        WeixinCustomer.findOneAndUpdate {ent,openid},{$set:{subscribe,nickname,sex,city,country,province,language,headimgurl,subscribe_time}},(err,res) ->
          cb err,res
      saveCustomer:["findCustomer",(cb,results) ->
        customer = results.findCustomer
        if customer?
          cb null,customer
        else
          customer = new WeixinCustomer({
            ent
            subscribe
            openid
            nickname
            sex
            city
            country
            province
            language
            headimgurl
            subscribe_time
          })
          customer.save (err,res) ->
            cb err,res
      ]
    },(err,results) ->
      fn err,results.saveCustomer



  @detail:(ent,openid,fn) ->
    WeixinCustomer.findOne {ent,openid}
      .lean()
      .exec (err,res) ->
        if err?
          fn err
        else
          if res?
            obj = {
              _id:res._id
              ent:res.ent
              mobile:""
              isEnable:true
              createDate:res.subscribe_time*1000
              loginName:res.nickname
              email:""
              name:""
              address:""
              birthday:0
              weixinOpenId:res.openid
              headimgurl:res.headimgurl
              sex:res.sex
              isWeixin:true
            }
          fn null,obj

module.exports = WeixinCustomerCtrl
