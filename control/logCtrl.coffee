async = require 'async'
TokenCtrl = require './tokenCtrl'
class LogCtrl
  LogCtrl.save = (method,params,token,fn) ->
    async.auto {
      GetMember:(cb) ->
        TokenCtrl.findToken token,(err,res) ->
          cb err,res
      SaveLog:(cb,results) ->
        if results.GetMember?
          log = new Log(
            method:method
            params:params
            member:results.GetMember.member._id
          )
          log.save (err,res) ->
            cb err,res
        else
          cb null,null
    },(err,results) ->
      fn err,results.SaveLog