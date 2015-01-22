/**
 * Created by zzy on 7/31/14.
 */
var Member = require('./../model/member');
var MemberCtrl = function(){};
var TokenCtrl = require('./tokenCtrl');
var async = require('async');
MemberCtrl.login = function(name,passwd,fn){
    async.waterfall([
        function(cb){
            Member.findOne()
                .or([{'loginName':name,'passwd':passwd,'isEnable':true},{'mobile':name,'passwd':passwd,'isEnable':true},{'email':name,'passwd':passwd,'isEnable':true}])
                .exec(function(err,res){
                    cb(err,res);
                });
        },
        function(member,cb){
            if(member){
                TokenCtrl.generate(member._id,function(e,r){
                    if(e){
                        fn(e,null);
                    } else {
                        fn(null,r);
                    }
                });
            } else {
                cb(new Error('未找到用户'),null);

            }
        }
    ],function(err,res){
        fn(err,res);
    });
};
MemberCtrl.weixinLogin = function(openid,fn){
    async.waterfall([
        function(cb){
            Member.findOne({'weixinOpenId':openid})
                .exec(function(err,res){
                    cb(err,res);
                });
        },
        function(member,cb){
            if(member){
                TokenCtrl.generate(member._id,function(e,r){
                    if(e){
                        fn(e,null);
                    } else {
                        fn(null,r);
                    }
                });
            } else {
                cb(new Error('未找到用户'),null);

            }
        }
    ],function(err,res){
        fn(err,res);
    });
};

MemberCtrl.detail = function(id,fn){
    Member.findById(id)
    .populate({'path':'ent','select':'name'})
    .exec(function(err,member){
        fn(err,member);
    });
};

MemberCtrl.update = function(id,obj,fn){
    Member.findByIdAndUpdate(id,{'$set':obj})
        .exec(function(err,member){
            fn(err,member);
        });
};

MemberCtrl.list = function(page,pageSize,mobile,ent,fn){
    async.parallel([
        function(cb){
            var query = Member.find();
            if(mobile){
                query.where({'mobile':mobile});
            }
            if(ent){
                query.where({'ent':ent});
            }
            query.limit(pageSize).skip(page*pageSize);
            query.populate({'path':'ent','select':'name'});
            query.exec(function(err,members){
                cb(err,members);
            });
        },
        function(cb){
            var query = Member.count();
            if(mobile){
                query.where({'mobile':mobile});
            }
            if(ent){
                query.where({'ent':ent});
            }
            query.exec(function(err,count){
                cb(err,count);
            });
        }
    ],function(err,res){
        if(err){
            fn(err,null);
        } else {
            fn(null,{
                'totalSize':res[1],
                'members':res[0]
            });
        }
    });
}

MemberCtrl.nameList = function(fn){
    var query = Member.find({'isEnable':true});
    query.select('_id loginName mobile email');
    query.exec(function(err,members){
        fn(err,members);
    });
}

MemberCtrl.token = function(token,fn){
    TokenCtrl.findToken(token,fn);
};

MemberCtrl.register = function(ent,loginName,mobile,email,passwd,fn){
    async.series([
        function(cb){
            Member.findOne()
                .or([{'loginName':loginName},{'mobile':mobile},{'email':email}])
                .exec(function(err,res){
                    if(err){
                        cb(err,null);
                    } else {
                        if(res){
                            if(res.loginName&&loginName&&res.loginName==loginName){
                                cb(new Error('登录名已存在'),null);
                            } else if(res.mobile&&mobile&&res.mobile == mobile){
                                cb(new Error('手机号已存在'),null);
                            } else if(res.email&&email&&res.email == email){
                                cb(new Error('邮件地址已存在'),null);
                            } else {
                                cb(null,null);
                            }
                        } else {
                            cb(null,null);
                        }
                    }
                });
        },function(cb){
            var member = new Member({
                'ent':ent,
                'loginName': loginName,
                'mobile': mobile,
                'email':email,
                'passwd':passwd,
                'isEnable': true
            });
            member.save(function(err,res){
                cb(err,res);
            });
        }
    ],function(err,res){
        fn(err,res[1]);
    });

};

MemberCtrl.weixinMemberList = function(ent,fn){
    Member.find({'ent':ent,'weixinOpenId':{'$exists':true}},function(err,res){
       fn(err,res);
    });
};

MemberCtrl.weixinBind = function(mobile,passwd,openID,fn){
    Member.findOneAndUpdate({'mobile':mobile,'passwd':passwd},{'$set':{'weixinOpenId':openID}},function(err,res){
        if(err){
            fn(err,null);
        } else {
            if(res){
                fn(null,res);
            } else {
                fn(new Error('用户名或密码错误'),null);
            }
        }
    });
};

MemberCtrl.changePasswd = function(token,oldPasswd,newPasswd,fn){
    async.waterfall([
        function(cb){
            TokenCtrl.findToken(token,function(err,res){
                cb(err,res);
            });
        },
        function(tokenObj,cb){
            Member.findOneAndUpdate({'_id':tokenObj.member._id,'passwd':oldPasswd},{'$set':{'passwd':newPasswd}},function(err,res){
                cb(err,res);
            });
        }
    ],function(err,res){
        fn(err,res);
    });


};
module.exports = MemberCtrl;