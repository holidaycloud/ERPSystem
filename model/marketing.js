/**
 * Created by zzy on 2014/11/28.
 */
var Schema = require('mongoose').Schema;

var marketingSchema = new Schema({
    'ent':{'type':Schema.Types.ObjectId,'ref':'Ent'},               //企业
    'name':String,                                                      //名称
    'content':String,                                                   //内容
    'startDate':Number,                                                //有效期
    'endDate':Number,                                                  //有效期
    'isEnable':{'type':Boolean,'default':true},                     //状态
    'createTime':{'type':Number,'default':Date.now},                //创建时间
    'channel':String                                                   //渠道
});
marketingSchema.index({'ent':1});
var Marketing = db.model('Marketing',marketingSchema);
module.exports = Marketing;