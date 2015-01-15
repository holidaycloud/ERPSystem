class SMS
  config = require "./../config/config.json"
  request = require "request"

  @send:(mobile,content,fn) ->
    if config.sms.dev is true
      fn null,null
    else
      url = "#{config.sms.host}:#{config.sms.port}/sms.aspx"
      request({
        url:url,
        method:'POST',
        form: {
          userid:config.sms.userid
          account:config.sms.account
          password:config.sms.password
          mobile,
          content,
          action:"send"
        },
        timeout:3000
      },(err,response,body) ->
        fn err,body
      )
module.exports = SMS