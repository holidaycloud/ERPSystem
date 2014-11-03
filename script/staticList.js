/**
 * Created by zzy on 2014/10/24.
 */
db.staticproducts.drop();

db.products.find().forEach(function(product){
    if(product.productType==0){
        var price = db.prices.findOne({"product":product._id,"date":{"$gte":Date.now()}});
        if(price){
            db.staticproducts.save({
                '_id':product._id,
                'productType':product.productType,
                'name':product.name,
                'introduction':product.introduction,
                'price':price.price,
                'images':product.images,
                'isHot':product.isHot,
                'isRecommend':product.isRecommend,
                'ent':product.ent
            });
        }
    } else if(product.productType==3){
        var price = db.prices.findOne({"product":product._id});
        if(price){
            db.staticproducts.save({
                '_id':product._id,
                'productType':product.productType,
                'name':product.name,
                'introduction':product.introduction,
                'price':price.price,
                'images':product.images,
                'isHot':product.isHot,
                'isRecommend':product.isRecommend,
                'ent':product.ent
            });
        }
    }
});