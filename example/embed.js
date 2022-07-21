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
    gc.setMchEamil(conf.mchEmail).setApiKey(conf.apiKey).setChannel('C01');

    //支付参数
    var initData = {
        REQ_INVOICE:'TEST'+parseInt(Math.random()*1000000), //订单号
        REQ_APPID: 380, //应用ID
        REQ_TYPE: 'website', //请求类型
        BIL_GOODSNAME:'#gold#Runescape/OSRS Old School/ 10M Gold', // 商户名称 请如实填写 否则银行结算会盘查
        CUS_EMAIL:'rongjiang.chen@witsion.com', //客户邮箱
        BIL_PRICE:'9.9', //价格
        BIL_CURRENCY:'USD', //币种
        BIL_CC3DS:1, //是否开启3ds 1 开启 0 不开启
        BIL_IPADDR:'116.230.37.10', //客户ip地址
        URL_SUCCESS:'http://www.crjblog.cn/return.php?status=success', //成功通知地址
        URL_FAILED:'http://www.crjblog.cn/return.php?status=error', //失败通知地址
        URL_NOTIFY:'http://www.crjblog.cn/notify.php', //异步通知地址
        BIL_TEMP_TOKEN:'ee96c2e83fd4cbbc0f79376bcce7b6e6fc7c04e673752667035c78550f0fb842',

    };
   var data = gc.create(initData);
   var signString = gc.makeSign(data,gc.signType.TYPE_CREATE);
   data.REQ_SIGN = crypto.createHash('SHA256').update(signString).digest('hex');
   var url = gc.getURl(gc.EMBED_URL);
   var server = http.createServer();
    server.on('request',function (req,res) {
        if (req.url.indexOf('/embed') === 0 && req.method === 'POST') {
            var postData = '';
            req.on('data',function (chuck) {
                postData += chuck;
            })
            req.on('end', function () {
                var params = querystring.parse(postData);
                if(params.BIL_TEMP_TOKEN){
                    data.BIL_TEMP_TOKEN = params.BIL_TEMP_TOKEN;
                }
                if(params.BIL_TOKEN){
                    data.BIL_TOKEN = params.BIL_TOKEN;
                }
                axios({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    method: 'post',
                    url: url,
                    data: Qs.stringify(data)
                }).then((r) => {
                    console.log(r.data);
                }).catch((err) => {
                    console.error(err);
                });
            })
        }
    })
    server.listen(3000,function () { console.log('启用成功'); })

}catch (e) {
    gc.log(e);
}



