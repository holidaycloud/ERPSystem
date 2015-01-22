class VerifyCodeCtrl
  VerificationCode = require "./../model/verificationCode"
  SMS = require "./../tools/sms"
  _ = require "underscore"
  async = require "async"
  @create:(mobile,fn) ->
    code = (_.random(9) for i in [0...4]).join('')
    async.auto({
      saveCode:(cb) ->
        verifiCode = new VerificationCode({
          code,
          mobile
          expire:Date.now()+60*30*1000
        })
        verifiCode.save (err,res) ->
          cb err,res
      sendSms:["saveCode",(cb,results) ->
        verifiCode = results.saveCode
        if verifiCode?
          SMS.send mobile,"您的验证码是：#{verifiCode.code}【联云科技】",(err,res) ->
            cb err,res
        else
          cb new Error("验证码发送错误")
      ]
    },(err,results) ->
      console.log err,results
      fn err,results.sendSms
    )

  @checkCode:(mobile,code,fn) ->
    VerificationCode.findOne {mobile:mobile,code:code,expire:{$gt:Date.now()}},(err,res) ->
      fn err,res

module.exports = VerifyCodeCtrl