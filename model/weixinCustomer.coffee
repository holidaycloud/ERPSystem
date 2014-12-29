Schema = require('mongoose').Schema
customerSchema = new Schema(
  ent:
    type:Schema.Types.ObjectId
    ref:"Ent"
  subscribe:Number        #用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息。
  openid:String
  nickname:String
  sex:Number               #值为1时是男性，值为2时是女性，值为0时是未知
  city:String
  country:String
  province:String
  language:String
  headimgurl:String
  subscribe_time:Number
  unionid:String
)
customerSchema.index
WeixinCustomer = db.model('WeixinCustomer',customerSchema);

module.exports = WeixinCustomer