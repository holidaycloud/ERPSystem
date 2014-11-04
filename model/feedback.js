/**
 * Created by zzy on 2014/11/4.
 */
var Schema = require('mongoose').Schema;

var feedbackSchema = new Schema({
    'name':String,
    'email':String,
    'title':String,
    'msg':String,
    'createDate':{'type':Number,'default':Date.now},
    'status':{'type':Number,'default':0}     //0未处理 1已处理
});

var Feedback = db.model('Feedback',feedbackSchema);

module.exports = Feedback;