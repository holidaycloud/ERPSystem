/**
 * Created by zzy on 7/28/14.
 */
var Schema = require('mongoose').Schema;

var orderSchema = new Schema({
    orderID: String,
    member: {'type': Schema.Types.ObjectId, 'ref': 'Member'}, //分销商ent
    orderDate: {'type':Number,'default':Date.now},            //下单日期
    startDate: Number,                                          //出发日期
    payWay: Number,                                             //0 单结 1 月结 2 账户支付 3 支付宝 4 微信 5 银联
    quantity: Number,                                           //产品数量
    remark: String,                                             //订单备注
    product: {'type': Schema.Types.ObjectId, 'ref': 'Product'},    //产品ID
    totalPrice: Number,                                         //产品总金额
    newOrder:{'type':Boolean,'default':true},
    liveName: String,                                          //联系人
    contactPhone: String,                                     //联系电话
    customer:{'type': Schema.Types.ObjectId, 'ref': 'Customer'},
    status: {'type': Number, 'default': 0},                   //状态 0 未支付 1 已支付 2 已确认 3 已取消 （只能在未支付状态下跳转到已取消) 4 退款中 5 已退款
    ent:{'type': Schema.Types.ObjectId, 'ref': 'Ent'},       //供应商ent
    price:{},
    refOrderId:String                                            //渠道方orderId
});
orderSchema.index({'_id':1,'status':1});
orderSchema.index({'customer':1});
orderSchema.index({'ent':1});
orderSchema.index({'ent':1,'product':1});
orderSchema.index({'ent':1,'startDate':1});
orderSchema.index({'ent':1,'product':1,'startDate':1});
var Order = db.model('Order', orderSchema);

module.exports = Order;