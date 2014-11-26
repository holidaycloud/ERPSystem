/**
 * Created by zzy on 2014/11/23.
 */
var QRCodeCtrl = function(){};
var request = require('request');
QRCodeCtrl.generateCode = function(code,width,logo,fn){
    var form = {
        'string':code
    };
    if(width){
        form.width=width;
    } else {
        form.width=200;
    }
    if(logo){
        form.logo = logo;
    }
    request.post({url:'http://api.uihoo.com/qrcode/qrcode.http.php', form: form}, function(err,httpResponse,body){
        if(err){
            fn(err,null);
        } else {
            var res = JSON.parse(body);
            var data = res.base64;
            data = data.replace('\r\n','');
            fn(null,data);
        }
        //var base64Data = data.replace(/^data:image\/png;base64,/,"");
        //require("fs").writeFile(id+'-'+name+".png", base64Data, 'base64',function(err){
        //    fn(err,null);
        //});
    });
};
module.exports = QRCodeCtrl;

