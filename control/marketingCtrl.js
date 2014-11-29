/**
 * Created by zzy on 2014/11/29.
 */
var Marketing = require('./../model/marketing');
var MarketingCtrl = function(){};
MarketingCtrl.save = function(ent,name,content,startDate,endDate,channel,fn){
    var marketing = new Marketing({
        'ent':ent,
        'name':name,
        'content':content,
        'startDate':startDate,
        'endDate':endDate,
        'channel':channel
    });
    marketing.save(function(err,res){
       fn(err,res);
    });
};
module.exports = MarketingCtrl;