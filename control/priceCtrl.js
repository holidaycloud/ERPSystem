// Generated by CoffeeScript 1.8.0
(function() {
  var PriceCtrl;

  PriceCtrl = (function() {
    var Price, Product, Spec, async, type0PriceList, type3PriceList, _;

    function PriceCtrl() {}

    Price = require("./../model/price");

    Product = require("./../model/product");

    Spec = require("./../model/spec");

    async = require("async");

    _ = require("underscore");

    PriceCtrl.type0save = function(productId, startDate, endDate, price, weekendPrice, basePrice, weekendBasePrice, tradePrice, weekendTradePrice, inventory, weekendinventory, fn) {
      return async.auto({
        getProduct: function(cb) {
          return Product.findById(productId, function(err, res) {
            if (err != null) {
              return cb(err);
            } else {
              if (res != null) {
                return cb(null, res);
              } else {
                return cb(new Error("产品不存在"));
              }
            }
          });
        },
        removePrice: function(cb) {
          return Price.remove({
            product: productId,
            date: {
              $gte: startDate,
              $lte: endDate
            }
          }, function(err, res) {
            return cb(err, res);
          });
        },
        saveProductPrice: [
          "getProduct", function(cb, results) {
            var date, i, isWeekend, priceArr, step, _i;
            priceArr = [];
            step = (endDate - startDate) / 86400000 + 1;
            for (i = _i = 0; 0 <= step ? _i < step : _i > step; i = 0 <= step ? ++_i : --_i) {
              isWeekend = false;
              date = new Date(startDate + i * 86400000);
              if (_.indexOf(results.getProduct.weekend, date.getDay()) >= 0) {
                isWeekend = true;
              }
              priceArr.push({
                product: results.getProduct._id,
                date: startDate + i * 86400000,
                price: isWeekend ? weekendPrice : price,
                basePrice: isWeekend ? weekendBasePrice : basePrice,
                tradePrice: isWeekend ? weekendTradePrice : tradePrice,
                inventory: isWeekend ? weekendinventory : inventory
              });
            }
            return Price.create(priceArr, function(err, res) {
              return cb(err, res);
            });
          }
        ]
      }, function(err, results) {
        return fn(err, results.saveProductPrice);
      });
    };

    PriceCtrl.type3save = function(product, spec, price, basePrice, tradePrice, inventory, fn) {
      var query;
      console.log(product, spec, price, basePrice, tradePrice, inventory);
      query = {
        product: product
      };
      if (spec != null) {
        query.spec = spec;
      }
      return Price.update(query, {
        $set: {
          price: price,
          basePrice: basePrice,
          tradePrice: tradePrice,
          inventory: inventory
        }
      }, {
        upsert: true
      }, function(err, res) {
        return fn(err, res);
      });
    };

    type0PriceList = function(product, startDate, endDate, fn) {
      return Price.find({
        product: product,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }, function(err, res) {
        return fn(err, res);
      });
    };

    type3PriceList = function(product, fn) {
      return async.auto({
        getSpecs: function(cb) {
          return Spec.find({
            product: product
          }).lean().exec(function(err, res) {
            return cb(err, res);
          });
        },
        getPrices: function(cb) {
          return Price.find({
            product: product
          }).lean().exec(function(err, res) {
            return cb(err, res);
          });
        },
        mergeSpecPrice: [
          "getSpecs", "getPrices", function(cb, results) {
            var price, prices, result, spec, specs;
            specs = results.getSpecs;
            prices = results.getPrices;
            if (specs.length === 0) {
              return cb(null, prices);
            } else {
              result = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = specs.length; _i < _len; _i++) {
                  spec = specs[_i];
                  price = _.findWhere(prices, {
                    spec: spec._id
                  });
                  if (price != null) {
                    price.spec = spec;
                    _results.push(price);
                  } else {
                    _results.push({
                      spec: spec
                    });
                  }
                }
                return _results;
              })();
              return cb(null, result);
            }
          }
        ]
      }, function(err, results) {
        console.log(err, results);
        return fn(err, results.mergeSpecPrice);
      });
    };

    PriceCtrl.list = function(product, startDate, endDate, fn) {
      return async.auto({
        getProduct: function(cb) {
          return Product.findById(product, function(err, res) {
            if (err) {
              return cb(err);
            } else {
              if (res != null) {
                return cb(null, res);
              } else {
                return cb(new Error("产品未找到"), null);
              }
            }
          });
        },
        getPrice: [
          "getProduct", function(cb, results) {
            var _ref;
            if (((_ref = results.getProduct) != null ? _ref.productType : void 0) === 0) {
              return type0PriceList(product, startDate, endDate, cb);
            } else {
              return type3PriceList(product, cb);
            }
          }
        ]
      }, function(err, results) {
        console.log(err, results);
        return fn(err, results.getPrice);
      });
    };

    PriceCtrl.update = function(id, price, basePrice, tradePrice, inventory, fn) {
      return Price.findByIdAndUpdate(id, {
        $set: {
          price: price,
          basePrice: basePrice,
          tradePrice: tradePrice,
          inventory: inventory
        }
      }, function(err, res) {
        return fn(err, res);
      });
    };

    PriceCtrl.getPrice = function(id, fn) {
      return Price.findById(id, function(err, res) {
        return fn(err, res);
      });
    };

    PriceCtrl.getDatePrice = function(product, startDate, fn) {
      var query;
      query = {
        product: product
      };
      if (startDate != null) {
        query.date = startDate;
      }
      return Price.findOne(query, function(err, res) {
        return fn(err, res);
      });
    };

    PriceCtrl.getFirstPrice = function(product, fn) {
      return Price.findOne({
        product: product,
        date: {
          $gte: Date.now()
        },
        inventory: {
          $gt: 0
        }
      }).sort("date").exec(function(err, res) {
        return fn(err, res);
      });
    };

    PriceCtrl.deductInventory = function(id, quantity, fn) {
      return Price.findByIdAndUpdate(id, {
        $inc: {
          inventroy: -quantity
        }
      }, function(err, res) {
        return fn(err, res);
      });
    };

    PriceCtrl.returnInventory = function(id, quantity, fn) {
      return Price.findByIdAndUpdate(id, {
        $inc: {
          inventroy: quantity
        }
      }, function(err, res) {
        return fn(err, res);
      });
    };

    return PriceCtrl;

  })();

  module.exports = PriceCtrl;

}).call(this);
