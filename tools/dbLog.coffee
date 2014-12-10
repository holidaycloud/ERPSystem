class DBLog
  DBLog.saveLog = (req,res,next) ->
    _ = require 'underscore'
    obj = _.extend req.query,req.body
    console.log obj
    next()

module.exports = DBLog
