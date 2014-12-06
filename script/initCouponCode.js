/**
 * Created by zzy on 2014/12/6.
 */
var numArr = _.range(100000,200000);
numArr = _.shuffle(numArr);
var objs = [];
for(var i in numArr){
    objs.push({'code':numArr[i].toString(),'isUsed':false,'__v':0});
}
db.couponcodes.insert(objs);