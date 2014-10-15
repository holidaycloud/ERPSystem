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
    var images = request.body.images;
    var type = request.body.type;
    var subProduct = request.body.subProduct;

    ProductCtrl.save(name,introduction,gps,content,startDate,endDate,ent,weekend,images,type,subProduct,function(err,res){
        if(err){
            response.json({'error':1, 'errMsg':err.message});
        } else {
            response.json({'error':0, 'data':res});
        }
    });
});

router.post('/product/update', function(request, response) {
    var id = request.body.id;
    var images = request.body.images;
    if(!images){
        images=[];
    }
    var obj = {
        'ent':request.body.ent,
        'images':images,
        'productType':request.body.type,
        'subProduct':request.body.subProduct?request.body.subProduct:[]
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
    var isRes = request.query.isRes;
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

/**
 Price接口
 */
router.post('/price/save', function(request, response) {
    var product = request.body.product;
    var startDate = parseInt(request.body.startDate);
    var endDate = parseInt(request.body.endDate);
    var price = request.body.price;
    var weekendPrice = request.body.weekendPrice;
    var inventory = request.body.inventory;
    var weekendinventory = request.body.weekendinventory;
    PriceCtrl.save(product,startDate,endDate,price,weekendPrice,inventory,weekendinventory,function(err,res){
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
    var inventory = request.body.inventory;
    PriceCtrl.update(id,price,inventory,function(err,res){
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

module.exports = router;