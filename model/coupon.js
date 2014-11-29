/**
 * Created by zzy on 2014/11/28.
 */
var Schema = require('mongoose').Schema;

var couponSchema = new Schema({
    'code':{'type':String,'unique':true},                             //券号
    'marketing':{'type':Schema.Types.ObjectId,'ref':'Marketing'}, //活动
    'ent':{'type':Schema.Types.ObjectId,'ref':'Ent'},               //企业
    'minValue':{'type':Number,'default':0},                          //最小订单金额
    'type':Number,                                                      //类型 0：金额券 1：折扣券 3：产品固定价格 4：免费券
    'value':Number,                                                     //类型的值
    'name':String,                                                      //名称
    'product':[{'type':Schema.Types.ObjectId,'ref':'Product'}],   //对应产品
    'startDate':Number,                                                //有效期
    'endDate':Number,                                                  //有效期
    'status':{'type':Number,'default':0},                            //状态 1：已使用 0：未使用
    'customer':{'type':Schema.Types.ObjectId,'ref':'Customer'},   //分配到的用户
    'order':{'type':Schema.Types.ObjectId,'ref':'Order'},          //订单号
    'createTime':{'type':Number,'default':Date.now},                //优惠券创建时间
    'useTime':Number                                                   //优惠券使用时间
});
couponSchema.index({'ent':1});
couponSchema.index({'ent':1,'customer':1});
var Coupon = db.model('Coupon',couponSchema);
module.exports = Coupon;