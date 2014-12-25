/**
 * Created by zzy on 7/28/14.
 */
var Schema = require('mongoose').Schema;

var productSchema = new Schema({
    'name': String,
    'introduction': String,
    'gps': {'lat': Number, 'lon': Number},
    'content': String,
    'createTime': {type: Number, default: Date.now},
    'startDate': Number,
    'endDate': Number,
    'ent': {type: Schema.Types.ObjectId, ref: 'Ent'},
    'weekend': [Number],
    'isEnable': {type: Boolean, default: true},
    'images': [{'url':String,'media_id':String,'title':String}],
    'productType':{type: Number, default: 0}, //产品类型 0:普通产品 1;时间段产品 2:资源 3:无时间产品
    'inventoryType':{type: Number, default: 1}, //0:无库存类型 1:普通库存查询inventory表 2:时间段库存查询库存消耗表 3:子产品单独库存查询子产品状态数量
    'subProduct':[{type:Schema.Types.ObjectId,ref:'Product'}], //包含的子产品
    'isHot':Boolean,
    'isRecommend':Boolean,
    'lable':[String],
    'classify':{type: Schema.Types.ObjectId, ref: 'Classify'},
    'spec':[{type: Schema.Types.ObjectId, ref: 'Spec'}]
});
productSchema.index({'ent':1});
productSchema.index({'ent':1,'productType':1});


var Product = db.model('Product', productSchema);
module.exports = Product;