/**
 * Created by cloudbian on 2015/1/19.
 */
var Schema = require('mongoose').Schema;

var noticeSchema = new Schema({
    type: {'type':Number, 'default':0},        //通知类型 0 默认（系统公告）
    content: String,                            //通知内容
    createDate: {'type':Number, 'default':Date.now},     //创建时间
    receiver: {'type':Schema.Types.ObjectId, 'ref': 'Member'},   //收到消息的对象   null 全部对象
    sender: {'type':Schema.Types.ObjectId, 'ref': 'Member'}   //发送消息的对象
});

var Notice = db.model('Notice', noticeSchema);

module.exports = Notice;