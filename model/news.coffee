Schema = require("mongoose").Schema;
newsSchema = new Schema(
  ent:
    type:Schema.Types.ObjectId
    ref:"Ent"
  title:String
  type:
    type:Number
    default:0
  content:String,
  createDate:
    type:Number
    default:Date.now
)
newsSchema.index(
  ent:1
)

News = db.model "News",newsSchema

module.exports = News