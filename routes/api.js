/**
 * Created by zzy on 7/31/14.
 */
var express = require('express');
var router = express.Router();
var MemberCtrl = require('./../control/memberCtrl');
var EntCtrl = require('./../control/entCtrl');
var ProductCtrl = require('./../control/productCtrl');
var PriceCtrl = require('./../control/priceCtrl');
var OrderCtrl = require('./../control/orderCtrl');
var TokenCtrl = require('./../control/tokenCtrl');
var CustomerCtrl = require('./../control/customerCtrl');
var StaticProductCtrl = require('./../control/staticProductCtrl');
var DomainCtrl = require('./../control/DomainCtrl');
var AreaCtrl = require('./../control/areaCtrl');
var FeedbackCtrl = require('./../control/feedbackCtrl');
/**
 Member接口
 */
router.post('/member/register', function(request, response) {
    var ent = request.body.ent;
    var loginName = request.body.loginName;
    var mobile = request.body.mobile;
    var email = request.body.email;
    var passwd = request.body.passwd;
    MemberCtrl.register(ent,loginName,mobile,email,passwd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/member/update', function(request, response) {
    var id = request.body.id;
    var obj ={};
    if(request.body.ent){
        obj.ent = request.body.ent
    }
    if(request.body.loginName){
        obj.loginName = request.body.loginName
    }
    if(request.body.mobile){
        obj.mobile = request.body.mobile
    }
    if(request.body.email){
        obj.email = request.body.email
    }
    MemberCtrl.update(id,obj,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/member/login', function(request, response) {
    var loginName = request.query.mobile||request.query.email||request.query.username;
    var passwd = request.query.passwd;
    MemberCtrl.login(loginName,passwd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/member/token', function(request, response) {
    var token = request.query.token;
    MemberCtrl.token(token,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/member/noExpireToken', function(request, response) {
    var member = request.query.member;
    TokenCtrl.generateNoExpire(member,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/member/changePasswd', function(request, response) {
    var token = request.body.token;
    var oldPasswd = request.body.oldPasswd;
    var newPasswd = request.body.newPasswd;
    MemberCtrl.changePasswd(token,oldPasswd,newPasswd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/member/list', function(request, response) {
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var mobile = request.query.mobile;
    var ent = request.query.ent;
    MemberCtrl.list(page,pageSize,mobile,ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/member/detail', function(request, response) {
    var id = request.query.id;
    MemberCtrl.detail(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

/**
 Ent接口
 */
router.post('/ent/register', function(request, response) {
    var name = request.body.name;
    var contactName = request.body.contactName;
    var contactEmail = request.body.contactEmail;
    var contactPhone = request.body.contactPhone;
    var proCode = request.body.proCode;
    var remark = request.body.remark;
    var type = request.body.type;
    EntCtrl.register(name,contactName,contactEmail,contactPhone,proCode,remark,type,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/ent/list', function(request, response) {
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    EntCtrl.list(page,pageSize,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/ent/nameList', function(request, response) {
    EntCtrl.nameList(function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/ent/detail', function(request, response) {
    var id = request.query.id;
    EntCtrl.detail(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/ent/update', function(request, response) {
    var id = request.body.id;
    var name = request.body.name;
    var contactName = request.body.contactName;
    var contactEmail = request.body.contactEmail;
    var contactPhone = request.body.contactPhone;
    var proCode = request.body.proCode;
    var remark = request.body.remark;
    var type = request.body.type;
    EntCtrl.update(id,{
        'name':name,
        'contactName':contactName,
        'contactEmail':contactEmail,
        'contactPhone':contactPhone,
        'proCode':proCode,
        'remark':remark,
        'type':type
    },function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

/**
 Product接口
 */
router.post('/product/save', function(request, response) {
    var name = request.body.name;
    var introduction = request.body.introduction;
    var gps = {'lat':request.body.lat,'lon':request.body.lon};
    var content = request.body.content;
    var startDate = request.body.startDate;
    var endDate = request.body.endDate;
    var ent = request.body.ent;
    var weekend = request.body.weekend;
    var imageUrl = request.body.imageUrl;
    var imagesMediaId = request.body.imagesMediaId;
    var imagesTitle = request.body.imagesTitle;
    var type = request.body.type;
    var subProduct = request.body.subProduct;
    var isHot = request.body.isHot;
    var isRecommend = request.body.isRecommend;
    var lable = request.body.lable;
    var classify = request.body.classify;

    ProductCtrl.save(name,introduction,gps,content,startDate,endDate,ent,weekend,imageUrl,imagesMediaId,imagesTitle,type,subProduct,isHot,isRecommend,lable,classify,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/product/update', function(request, response) {
    var id = request.body.id;
    var imageUrl = request.body.imageUrl;
    var imagesMediaId = request.body.imagesMediaId;
    var imagesTitle = request.body.imagesTitle;
    var images = [];
    for(var i in imageUrl){
        var obj = {
            'url':imageUrl[i]
        };
        if(imagesMediaId[i]){
            obj.media_id = imagesMediaId[i];
        }
        if(imagesTitle[i]){
            obj.title = imagesTitle[i];
        }
        images.push(obj);
    }
    var obj = {
        'ent':request.body.ent,
        'images':images,
        'productType':request.body.type,
        'subProduct':request.body.subProduct?request.body.subProduct:[],
        'isHot':request.body.isHot,
        'isRecommend':request.body.isRecommend,
        'lable':request.body.lable,
        'classify':request.body.classify
    };
    if(request.body.lat&&request.body.lon){
        obj.gps = {'lat':request.body.lat,'lon':request.body.lon};
    }
    if(request.body.name){
        obj.name = request.body.name;
    }
    if(request.body.introduction){
        obj.introduction = request.body.introduction;
    }
    if(request.body.content){
        obj.content = request.body.content;
    }
    if(request.body.startDate){
        obj.startDate = request.body.startDate;
    }
    if(request.body.endDate){
        obj.endDate = request.body.endDate;
    }
    if(request.body.isEnable){
        obj.isEnable = request.body.isEnable;
    }
    if(request.body.weekend){
        obj.weekend = request.body.weekend;
    }
    ProductCtrl.update(id,obj,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/product/list', function(request, response) {
    var ent = request.query.ent;
    var isRes = request.query.isRes=='true'?true:false;
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    ProductCtrl.list(ent,isRes,page,pageSize,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/product/detail', function(request, response) {
    var id = request.query.id;
    ProductCtrl.detail(id,function(err,res){
        response.json({'error':0,'data':res});
    });
});

router.get('/product/nameList', function(request, response) {
    var ent = request.query.ent;
    var isRes = request.query.isRes;
    ProductCtrl.nameList(ent,isRes,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/product/staitcList', function(request, response) {
    var ent = request.query.ent;
    StaticProductCtrl.list(ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/product/hotList', function(request, response) {
    var ent = request.query.ent;
    StaticProductCtrl.hotList(ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/product/recommendList', function(request, response) {
    var ent = request.query.ent;
    StaticProductCtrl.recommendList(ent,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

/**
 Price接口
 */
router.post('/price/save', function(request, response) {
    var product = request.body.product;
    var startDate = parseInt(request.body.startDate);
    var endDate = parseInt(request.body.endDate);
    var price = request.body.price;
    var weekendPrice = request.body.weekendPrice;
    var basePrice = request.body.basePrice;
    var weekendBasePrice = request.body.weekendBasePrice;
    var tradePrice = request.body.tradePrice;
    var weekendTradePrice = request.body.weekendTradePrice;
    var inventory = request.body.inventory;
    var weekendinventory = request.body.weekendinventory;
    PriceCtrl.save(product,startDate,endDate,price,weekendPrice,basePrice,weekendBasePrice,tradePrice,weekendTradePrice,inventory,weekendinventory,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/price/list', function(request, response) {
    var product = request.query.product;
    var startDate = parseInt(request.query.startDate);
    var endDate = parseInt(request.query.endDate);
    PriceCtrl.list(product,startDate,endDate,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/price/update', function(request, response) {
    var id = request.body.id;
    var price = request.body.price;
    var basePrice = request.body.basePrice;
    var tradePrice = request.body.tradePrice;
    var inventory = request.body.inventory;
    PriceCtrl.update(id,price,basePrice,tradePrice,inventory,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/price/first', function(request, response) {
    var product = request.query.product;
    PriceCtrl.getFirstPrice(product,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/price/get', function(request, response) {
    var id = request.query.id;
    PriceCtrl.getPrice(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

/**
Order接口
*/
router.post('/order/save', function(request, response) {
    var token = request.body.token;
    var startDate = request.body.startDate;
    var quantity = request.body.quantity;
    var remark = request.body.remark;
    var product = request.body.product;
    var liveName = request.body.liveName;
    var contactPhone = request.body.contactPhone;
    var customer = request.body.customer;
    var openId = request.body.openId;
    var price = request.body.price;
    OrderCtrl.save(token,startDate,quantity,remark,product,liveName,contactPhone,price,openId,customer,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/order/traderOrder', function(request, response) {

    var trader = request.body.trader;
    var token = request.body.token;
    var startDate = request.body.startDate;
    var quantity = request.body.quantity;
    var remark = request.body.remark;
    var traderProduct = request.body.traderProduct;
    var liveName = request.body.liveName;
    var contactPhone = request.body.contactPhone;

    OrderCtrl.traderOrder(trader,token,startDate,quantity,remark,traderProduct,liveName,contactPhone,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/order/confirm', function(request, response) {
    var orderID = request.body.orderID;
    OrderCtrl.confirm(orderID,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/order/changeStatus', function(request, response) {
    var orderID = request.body.orderID;
    var status = request.body.status;
    OrderCtrl.changeStatus(orderID,status,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/order/cusList', function(request, response) {
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var customer = request.query.customer;

    OrderCtrl.cusList(page,pageSize,customer,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/order/openIdList', function(request, response) {
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var openId = request.query.openId;
    OrderCtrl.cusListByOpenId(page,pageSize,openId,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/order/list', function(request, response) {
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var ent = request.query.ent;
    var product = request.query.product;
    var startDate = request.query.startDate;
    var endDate = request.query.endDate;
    OrderCtrl.list(page,pageSize,ent,product,startDate,endDate,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/order/detail', function(request, response) {
    var id = request.query.id;
    OrderCtrl.detail(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/order/verifyCode', function(request, response) {
    var code = request.query.code;
    OrderCtrl.verifyCode(code,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

//会员接口
router.post('/customer/register', function(request, response) {
    var ent = request.body.ent;
    var mobile = request.body.mobile;
    var passwd = request.body.passwd;
    var loginName = request.body.loginName;
    var email = request.body.email;
    var birthday = request.body.birthday;
    var name = request.body.name;
    var address = request.body.address;
    CustomerCtrl.register(ent,mobile,passwd,loginName,email,birthday,name,address,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/customer/update', function(request, response) {
    var id = request.body.id;
    var loginName = request.body.loginName;
    var email = request.body.email;
    var birthday = request.body.birthday;
    var name = request.body.name;
    var address = request.body.address;
    var isEnable = request.body.loginName;
    var obj ={
        'isEnable':isEnable
    };
    if(loginName){
        obj.loginName=loginName;
    }
    if(email){
        obj.email=email;
    }
    if(birthday){
        obj.birthday=birthday;
    }
    if(name){
        obj.name=name;
    }
    if(address){
        obj.address=address;
    }
    CustomerCtrl.update(id,obj,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

//router.post('/customer/registerAndBind', function(request, response) {
//    var ent = request.body.ent;
//    var mobile = request.body.mobile;
//    var passwd = request.body.passwd;
//    var loginName = request.body.loginName;
//    var email = request.body.email;
//    var birthday = request.body.birthday;
//    var name = request.body.name;
//    var address = request.body.address;
//    CustomerCtrl.registerAndBind(ent,mobile,passwd,loginName,email,birthday,name,address,function(err,res){
//        if(err){
//            response.json({'error':1, 'errMsg':err.message});
//        } else {
//            response.json({'error':0, 'data':res});
//        }
//    });
//});

router.post('/customer/changePasswd', function(request, response) {
    var id = request.body.id;
    var oldPasswd = request.body.oldPasswd;
    var newPasswd = request.body.newPasswd;
    CustomerCtrl.changePasswd(id,oldPasswd,newPasswd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/customer/weixinBind', function(request, response) {
    var ent = request.body.ent;
    var mobile = request.body.mobile;
    var passwd = request.body.passwd;
    var openId = request.body.openId;

    CustomerCtrl.weixinBind(ent,mobile,passwd,openId,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/customer/detail', function(request, response) {
    var id = request.query.id;
    CustomerCtrl.detail(id,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/customer/list', function(request, response) {
    var page = request.query.page||0;
    var pageSize = request.query.pageSize||25;
    var ent = request.query.ent;
    var mobile = request.query.mobile;
    CustomerCtrl.list(page,pageSize,ent,mobile,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/customer/weixinLogin', function(request, response) {
    var ent = request.query.ent;
    var openId = request.query.openId;
    CustomerCtrl.weixinLogin(ent,openId,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/customer/login', function(request, response) {
    var ent = request.query.ent;
    var mobile = request.query.mobile;
    var passwd = request.query.passwd;
    CustomerCtrl.login(ent,mobile,passwd,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

//省份城市地区
router.get('/province/list', function(request, response) {
    AreaCtrl.provinceList(function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/city/list', function(request, response) {
    var pid = request.query.pid;
    AreaCtrl.cityList(pid,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get('/district/list', function(request, response) {
    var cid = request.query.cid;
    AreaCtrl.districtList(cid,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

//Domain接口
router.post("/domain/save",function(request, response){
    var ent = request.body.ent;
    var domain = request.body.domain;
    var address = request.body.address;
    var lat = request.body.lat;
    var lon = request.body.lon;
    var email = request.body.email;
    var logo = request.body.logo;
    var qrCode = request.body.qrCode;
    var title = request.body.title;
    var tel = request.body.tel;
    DomainCtrl.save(ent,domain,address,lat,lon,email,logo,qrCode,title,tel,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.get("/domain/get",function(request, response){
    var domain = request.query.domain;
    DomainCtrl.getEnt(domain,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

//用户反馈
router.post("/feedback/save",function(request, response){
    var ent = request.body.ent;
    var name = request.body.name;
    var email = request.body.email;
    var title = request.body.title;
    var msg = request.body.msg;

    FeedbackCtrl.save(name,email,title,msg,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});
module.exports = router;