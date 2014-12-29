class WeixinCustomerCtrl
  WeixinCustomer = require "./../model/weixinCustomer"
  CustomerCtrl = require "./customerCtrl"
  async = require "async"
  @save:(ent,subscribe,openid,nickname,sex,city,country,province,language,headimgurl,subscribe_time,unionid,fn) ->
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
      unionid
    })
    customer.save (err,res) ->
      fn err,res

  @detail:(ent,openid,fn) ->
    WeixinCustomer.findOne {ent,openid},(err,res) ->
      fn err,res

module.exports = WeixinCustomerCtrl