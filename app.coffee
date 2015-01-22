express = require "express"
path = require "path"
favicon = require "static-favicon"
cookieParser = require "cookie-parser"
bodyParser = require "body-parser"
mongoose = require "mongoose"
config = require "./config/config.json"

uri = "mongodb://#{config.db.host}:#{config.db.port}/#{config.db.database}"
global.db = mongoose.createConnection uri

log4js = require "log4js"
log4js.configure appenders:[type:"console"],replaceConsole:true
logger = log4js.getLogger "normal"

#verfiyRequest = require './tools/verfiyRequest'

member = require "./routes/member"
ent = require "./routes/ent"
product = require "./routes/product"
price = require "./routes/price"
order = require "./routes/order"
customer = require "./routes/customer"
province = require "./routes/province"
city = require "./routes/city"
district = require "./routes/district"
domain = require "./routes/domain"
feedback = require "./routes/feedback"
classify = require "./routes/classify"
report = require "./routes/report"
card = require "./routes/card"
address = require "./routes/deliveryAddress"
invoice = require "./routes/invoice"
payLog = require "./routes/payLog"
coupon = require "./routes/coupon"
marketing = require "./routes/marketing"
news = require "./routes/news"
spec = require "./routes/spec"
notice = require "./routes/notice"
index = require "./routes/index"
app = express()

app.set "views",path.join __dirname,"views"
app.set "view engine","ejs"

app.use favicon()
app.use bodyParser.json()
app.use bodyParser.urlencoded()
app.use cookieParser()
app.use express.static path.join __dirname,"public"
app.use log4js.connectLogger logger,level:log4js.levels.INFO
app.use (req,res,next) ->
  res.set "X-Powered-By","Server"
  next()

#app.use verfiyRequest.verfiy
app.use "/",index
app.use "/api/member",member
app.use "/api/ent", ent
app.use "/api/product", product
app.use "/api/price", price
app.use "/api/order", order
app.use "/api/customer", customer
app.use "/api/province", province
app.use "/api/city", city
app.use "/api/district", district
app.use "/api/domain", domain
app.use "/api/feedback", feedback
app.use "/api/classify", classify
app.use "/api/report", report
app.use "/api/card", card
app.use "/api/address", address
app.use "/api/invoice", invoice
app.use "/api/payLog", payLog
app.use "/api/coupon", coupon
app.use "/api/marketing", marketing
app.use "/api/news", news
app.use "/api/product/spec", spec
app.use "/api/notice", notice
app.use (req,res,next) ->
  res.status(404).end()

if (app.get "env") is "development"
  app.use (err,req,res,next) ->
    console.log err
    res.status(err.status or 500).end()

app.use (err,req,res,next) ->
  console.log err
  res.status(err.status or 500).end()

#app.set "port",process.env.PORT or 3456
app.set "port",process.env.PORT or 3000

server = app.listen (app.get "port"),() ->
  console.log "Express server listening on port #{server.address().port}"

module.exports = app

Date::Format = (fmt) ->
  getWeek = (w) ->
    switch w
      when 0 then x="周日"
      when 1 then x="周一"
      when 2 then x="周二"
      when 3 then x="周三"
      when 4 then x="周四"
      when 5 then x="周五"
      when 6 then x="周六"

  o =
    "M+" : @getMonth()+1
    "d+" : @getDate()
    "h+" : @getHours()
    "m+" : @getMinutes()
    "s+" : @getSeconds()
    "q+" : Math.floor (@.getMonth()+3)/3
    "S"  : @getMilliseconds()
    "W"  : getWeek @getDay()

  fmt = fmt.replace RegExp.$1,"#{@getFullYear()}".substr 4-RegExp.$1.length if /(y+)/.test fmt
  for key,value of o
    if new RegExp("(#{key})").test fmt
      fmt = fmt.replace RegExp.$1,(if RegExp.$1.length is 1 then value else "00#{value}".substr "#{value}".length)
  fmt

