var Product = require('./../model/product');
var async = require('async');
var EntCtrl = require('./../control/entCtrl');
var ProductCtrl = function(){};

ProductCtrl.save = function(name,introduction,gps,content,startDate,endDate,ent,weekend,images,fn){
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
        'images':images
    });

    product.save(function(err,res){
        console.log(err,res);
        fn(err,res);
    });
};

ProductCtrl.update = function(id,obj,fn){
  Product.findByIdAndUpdate(id,{'$set':obj},function(err,res){
      fn(err,res);
  });
};

ProductCtrl.list = function(ent,page,pageSize,fn){
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
            query.skip(page*pageSize).limit(pageSize).exec(function(err,products){
                cb(err,products);
            });
        }],
        'getTotalSize':['getEnt',function(cb,results){
            var query = Product.count();
            if(!results.getEnt.isAdmin){
                query.where({'ent':ent});
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

ProductCtrl.nameList = function(ent,fn){
    var query = Product.find();
    if(ent){
        query.where({'ent':ent})
    }
    query.select('name startDate endDate ent');
    query.exec(function(err,res){
        fn(err,res);
    });
};

module.exports = ProductCtrl;