var Product = require('./../model/product');
var async = require('async');
var EntCtrl = require('./../control/entCtrl');
var timeZone = ' 00:00:00 +08:00';
var ProductCtrl = function(){};

ProductCtrl.save = function(name,introduction,gps,content,startDate,endDate,ent,weekend,imageUrl,imagesMediaId,imagesTitle,productType,subProduct,isHot,isRecommend,lable,classify,fn){
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
    var product = new Product({
        'name':name,
        'introduction':introduction,
        'gps':gps,
        'content': content,
        'startDate':startDate,
        'endDate':endDate,
        'ent':ent,
        'weekend':weekend,
        'images':images,
        'productType':productType,
        'subProduct':subProduct,
        'isHot':isHot,
        'isRecommend':isRecommend,
        'lable':lable,
        'classify':classify
    });

    product.save(function(err,res){
        fn(err,res);
    });
};

ProductCtrl.update = function(id,obj,fn){
  Product.findByIdAndUpdate(id,{'$set':obj},function(err,res){
      fn(err,res);
  });
};

ProductCtrl.list = function(ent,isRes,page,pageSize,fn,isAll){
    var now = new Date();
    var today = new Date(now.Format("yyyy-MM-dd")+timeZone);
    today.setDate(today.getDate()+1);
    async.auto({
        'getEnt':function(cb){
            EntCtrl.detail(ent,function(err,res){
               cb(err,res);
            });
        },
        'getList':['getEnt',function(cb,results){
            var query = Product.find();
            if(!isAll){
                query.where({"endDate":{"$gte":today.getTime()}});
            }
            if(!results.getEnt.isAdmin){
                query.where({'ent':ent});
            }
            //if(isRes){
            //    query.where({'productType':2});
            //} else {
            //    query.where({'productType':{'$ne':2}});
            //}
            query.select('name introduction startDate endDate weekend isEnable createTime')
                .skip(page*pageSize)
                .limit(pageSize)
                .exec(function(err,products){
                cb(err,products);
            });
        }],
        'getTotalSize':['getEnt',function(cb,results){
            var query = Product.count();
            if(!isAll){
                query.where({"endDate":{"$gte":today.getTime()}});
            }
            if(!results.getEnt.isAdmin){
                query.where({'ent':ent});
            }
            //if(isRes){
            //    query.where({'productType':2});
            //} else {
            //    query.where({'productType':{'$ne':2}});
            //}
            query.exec(function(err,totalSize){
                cb(err,totalSize);
            });
        }]
    },function(err,results){
        if(err){
            fn(err,null);
        } else {
            fn(null,{
                'totalSize':results.getTotalSize,
                'products':results.getList
            });
        }
    });
};

ProductCtrl.detail = function(id,fn){
    Product.findById(id)
        .exec(function(err,product){
            fn(err,product);
        });
};

ProductCtrl.nameList = function(ent,isRes,fn){
    var query = Product.find();
    if(ent){
        query.where({'ent':ent})
    }
    if(isRes){
        query.where({'productType':2});
    } else {
        query.where({'productType':{'$ne':2}});
    }
    query.select('name startDate endDate ent productType');
    query.exec(function(err,res){
        fn(err,res);
    });
};

module.exports = ProductCtrl;