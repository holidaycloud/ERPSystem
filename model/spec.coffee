Schema = require("mongoose").Schema

specSchema = new Schema(
  name:String
  product:
    type:Schema.Types.ObjectId
    ref:"Product"
)

specSchema.index(
  product:1
)

Spec = db.model "Spec",specSchema

module.exports = Spec;