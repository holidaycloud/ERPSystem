// Generated by CoffeeScript 1.8.0
(function() {
  var SMS;

  SMS = (function() {
    var config, request;

    function SMS() {}

    config = require("./../config/config.json");

    request = require("request");

    SMS.send = function(mobile, content, fn) {
      var url;
      if (config.sms.dev === true) {
        return fn(null, null);
      } else {
        url = "" + config.sms.host + ":" + config.sms.port + "/sms.aspx";
        return request({
          url: url,
          method: 'POST',
          form: {
            userid: config.sms.userid,
            account: config.sms.account,
            password: config.sms.password,
            mobile: mobile,
            content: content,
            action: "send"
          },
          timeout: 3000
        }, function(err, response, body) {
          return fn(err, body);
        });
      }
    };

    return SMS;

  })();

  module.exports = SMS;

}).call(this);