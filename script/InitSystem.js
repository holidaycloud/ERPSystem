/**
 * Created by zzy on 14-9-12.
 */
var mongoose = require('mongoose');
var app = require('../app');
var Member = require('./../model/member');
var Ent = require('./../model/ent');
var ent = new Ent({
    'name': '苏州联云旅游科技有限公司',
    'contactName': '朱子云',
    'contactEmail': 'zzy@holidaycloud.cn',
    'contactPhone': '13901785293',
    'proCode': 'SZLY',
    'remark': '',
    'isEnable': true,
    'type': 0
});
ent.save(function(err,entObj){
    console.log(err,entObj);
    if(!err){
        var member = new Member({
            'ent':entObj._id,
            'loginName': 'zzy',
            'mobile': '13901785293',
            'email':'zzy@holidaycloud.cn',
            'passwd':'123456',
            'isEnable': true
        });
        member.save(function(err,res){
            console.log(err,res);
            db.connection.close();
        });
    }
})
