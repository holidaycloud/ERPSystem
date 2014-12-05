/**
 * Created by zzy on 2014/11/22.
 */

var MainCtrl = function(){};
var nodemailer = require('nodemailer');
var ejs = require('ejs');
var transporter = nodemailer.createTransport({
    service: 'QQex',
    auth: {
        user: 'service@holidaycloud.cn',
        pass: 'Lian1234'
    }
});

MainCtrl.sendTemplateMail = function(option,template,data,fn){
    var fs =require('fs');
    var str = fs.readFileSync("./views/"+template+".ejs").toString();
    var html = ejs.render(str,data);
    option.html = html;
    transporter.sendMail(option, function(error, info){
        if(error){
            fn(error,null);
        }else{
            fn(null,null);
        }
    });
};

//var mailOptions = {
//    from: 'Service<service@holidaycloud.cn>', // sender address
//    to: 'zzy@holidaycloud.cn', // list of receivers
//    subject: 'test', // Subject line
//    text: 'test', // plaintext body
//    html: '<b>test</b>' // html body
//};


module.exports=MainCtrl;