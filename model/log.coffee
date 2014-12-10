Schema = require('mongoose').Schema

logSchema = new Schema(
  createDate:
    type:Number
    default:Date.now()
  method:String
  params:{}
  member:
    type:Schema.Types.ObjectId
    ref:"Member"
)

Log = db.model 'Log',logSchema
module.exports = Log;