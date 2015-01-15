Schema = require("mongoose").Schema

verificationCodeSchema = new Schema({
  code:String
  mobile:String
  expire:Number
})

verificationCodeSchema.index({mobile:1})
VerificationCode = db.model("VerificationCode",verificationCodeSchema)
module.exports = VerificationCode