let http = require('http');
let axios = require('axios');
let Qs = require('qs');
let crypto = require('crypto');
var querystring = require('querystring');
let gc = require('glocash');
let conf = require('../config'); // 配置文件

try{
    //检查配置项
    gc.checkMerchantConfig(conf)
    //设置商户邮箱 KEY 渠道
    gc.setMchEamil(conf.mchEmail).setApiKey(conf.apiKey);

    var server = http.createServer();
    server.on('request',function (req,res) {
        if (req.url.indexOf('/notify') === 0 && req.method === 'POST') {
            var postData = '';
            req.on('data',function (chuck) {
                postData += chuck;
            })
            req.on('end', function () {
                var params = querystring.parse(postData);
                if(!params.REQ_SIGN){
                    throw ({'errorCode':gc.STATUS_TYPE.CODE_UNAUTHORIZED, 'errorMessage':gc.CUS_ERROR_TYPE.SIGN_ERROR});
                }
                var signString = gc.makeSign(params, gc.signType.TYPE_NOTIFY);
                var sign = crypto.createHash('SHA256').update(signString).digest('hex');
                if (sign != params['REQ_SIGN']) {
                    throw ({'errorCode':gc.STATUS_TYPE.CODE_UNAUTHORIZED, 'errorMessage':gc.CUS_ERROR_TYPE.SIGN_ERROR});
                }
                if (!params.BIL_STATUS || !params.TNS_GCID) {
                    throw ({'errorCode':gc.STATUS_TYPE.CODE_SERVER_ERRORS, 'errorMessage':gc.CUS_ERROR_TYPE.PARAM_ERROR});
                }
                //业务逻辑查找当前订单交易情况
                if(params.PGW_NOTIFYTYPE == 'transaction'){
                    //订单支付状态通知

                }else if(params.PGW_NOTIFYTYPE == 'refunded'){
                    //处理退款信息通知
                }

            })
        }
    })
    server.listen(3000,function () { console.log('启用成功'); })

}catch (e) {
    gc.log(e);
}



