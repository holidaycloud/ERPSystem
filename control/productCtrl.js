var Product = require('./../model/product');
var async = require('async');
var EntCtrl = require('./../control/entCtrl');
var ProductCtrl = function(){};

ProductCtrl.save = function(name,introduction,gps,content,startDate,endDate,ent,weekend,images,productType,subProduct,fn){
    if(!images){
        images=[];
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
        'subProduct':subProduct
    });

    product.save(function(err,res){
        console.log(err,res);
        fn(err,res);
    });
};

ProductCtrl.update = function(id,obj,fn){
    console.log(id,obj);
  Product.findByIdAndUpdate(id,{'$set':obj},function(err,res){
      console.log(err,res);
      fn(err,res);
  });
};

ProductCtrl.list = function(ent,isRes,page,pageSize,fn){
    async.auto({
        'getEnt':function(cb){
            EntCtrl.detail(ent,function(err,res){
               cb(err,res);
            });
        },
        'getList':['getEnt',function(cb,results){
            var query = Product.find();
            if(!results.getEnt.isAdmin){
                query.where({'ent':ent});
            }
            if(isRes){
                query.where({'productType':2});
            } else {
                query.where({'productType':{'$ne':2}});
            }
            query.skip(page*pageSize).limit(pageSize).exec(function(err,products){
                cb(err,products);
            });
        }],
        'getTotalSize':['getEnt',function(cb,results){
            var query = Product.count();
            if(!results.getEnt.isAdmin){
                query.where({'ent':ent});
            }
            if(isRes){
                query.where({'productType':2});
            } else {
                query.where({'productType':{'$ne':2}});
            }
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
    query.select('name startDate endDate ent');
    query.exec(function(err,res){
        fn(err,res);
    });
};

module.exports = ProductCtrl;