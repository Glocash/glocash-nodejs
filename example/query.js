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

    var data = {
        REQ_EMAIL:gc.mchEmail,
        TNS_GCID:'C01AM14YHLWFKL4W',
        REQ_TIMES:Date.parse(new Date())/1000,
    };
    var signString = gc.makeSign(data, gc.signType.TYPE_QUERY);
    data.REQ_SIGN = crypto.createHash('SHA256').update(signString).digest('hex');
    var url = gc.getURl(gc.QUERY_URL);
    http.createServer(function(req, res){
        axios({
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'post',
            url: url,
            data: Qs.stringify(data)
        }).then((r) => {
            console.log(r.data)
        }).catch((err) => {
            console.error(err);
        });

    }).listen(3000);

}catch (e) {
    gc.log(e);
}



