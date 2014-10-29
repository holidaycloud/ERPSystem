/**
 * Created by zzy on 7/28/14.
 */
var Schema = require('mongoose').Schema;

var entSchema = new Schema({
    'name': {type: 'String', unique: true},                       //企业名称
    'contactName': String,                                        //企业联系人
    'contactEmail': String,                                       //企业联系人邮箱
    'contactPhone': String,                                       //企业联系人手机号
    'proCode': String,                                            //企业英文代码
    'remark': String,                                             //企业备注
    'isEnable': Boolean,                                          //企业状态
    'type': Number,                                               //企业类型 1 分销商 2 供应商 0皆是
    'createTime': {type: Number, default: Date.now},              //创建时间
    'isAdmin':{type: Boolean, default: false},
    'bind':{
        'provider':[{'ent':{'type': Schema.Types.ObjectId, 'ref': 'Ent'},'settle':Number}],
        'sell':[{'ent':{'type': Schema.Types.ObjectId, 'ref': 'Ent'},'settle':Number}]
    }
});
var Ent = db.model('Ent',entSchema);
module.exports = Ent;