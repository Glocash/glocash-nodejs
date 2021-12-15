/**
 * 经典模式
 * 技术联系人 陈荣江 17602115638 微信同号
 * 文档地址 https://portal.glocashpayment.com/#/integration/document
 * 商户后台 https://portal.glocashpayment.com/#/login
 *
 */

/**
 * 测试卡
 *   Visa | 4907639999990022 | 12/2020 | 029 paid
 *   MC   | 5546989999990033 | 12/2020 | 464 paid
 *   Visa | 4000000000000002 | 01/2022 | 237 | 14  3ds paid
 *   Visa | 4000000000000028 | 03/2022 | 999 | 54  3ds paid
 *   Visa | 4000000000000051 | 07/2022 | 745 | 94  3ds paid
 *   MC   | 5200000000000007 | 01/2022 | 356 | 34  3ds paid
 *   MC   | 5200000000000023 | 03/2022 | 431 | 74  3ds paid
 *   MC   | 5200000000000106 | 04/2022 | 578 | 104 3ds paid
 *
 */

let http = require('http');
let axios = require('axios');
let Qs = require('qs');
const crypto = require('crypto');

//TODO 请仔细查看TODO的注释 请仔细查看TODO的注释 请仔细查看TODO的注释
let sandbox_url = 'https://sandbox.glocashpayment.com/gateway/payment/index'; //测试地址
let live_url = 'https://pay.glocashpayment.com/gateway/payment/index'; //正式地址

//秘钥 测试地址请用测试秘钥 正式地址用正式秘钥 请登录商户后台查看
let sandbox_key = '9dc6a0682d7cb718fa140d0b8017a01c4e9a9820beeb45da020601a2e0a63514'; //TODO 测试秘钥 商户后台查看
let live_key = 'c2e38e7d93dbdd3efaa61028c3d27a1a2577df84fa62ae752df587b4f90b8ef7'; //TODO 正式秘钥 商户后台查看(必须材料通过以后才能使用)

//支付参数
var data = {
    REQ_SANDBOX:1,
    REQ_EMAIL:'2101653220@qq.com',
    REQ_TIMES:Date.parse(new Date())/1000,
    REQ_INVOICE:'TEST'+parseInt(Math.random()*1000000),
    REQ_APPID: 380,
    BIL_METHOD:'C01',
    REQ_MERCHANT:'Merchant Name',
    BIL_GOODSNAME:'#gold#Runescape/OSRS Old School/ 10M Gold',
    CUS_EMAIL:'rongjiang.chen@witsion.com',
    BIL_PRICE:'15',
    BIL_CURRENCY:'USD',
    BIL_CC3DS:1,
    URL_SUCCESS:'http://example.v2gc.test/success.php',
    URL_FAILED:'http://example.v2gc.test/failed.php',
    URL_NOTIFY:'http://example.v2gc.test/notify.php',
    MCH_DOMAIN_KEY:'',
};
let request_url = data.REQ_SANDBOX ? sandbox_url : live_url;//根据REQ_SANDBOX调整地址
let key = data.REQ_SANDBOX ?sandbox_key: live_key;//根据REQ_SANDBOX调整秘钥
let sign_string = key+data.REQ_TIMES+data.REQ_EMAIL+data.REQ_INVOICE+data.CUS_EMAIL+data.BIL_METHOD+data.BIL_PRICE+data.BIL_CURRENCY;
data.REQ_SIGN = crypto.createHash('SHA256').update(sign_string).digest('hex');

http.createServer(function(req, res){
//    res.writeHead(200, {'Content-Type': 'text/plain'});
    const postData = data;
    console.log('------------------------------------------------------------');
    console.log(postData);
    axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        url: request_url,
        data: Qs.stringify(postData)
    }).then((res2) => {
        console.log(`Status: ${res2.status}`);
        console.log('Body: ', res2.data);
        console.log(res2.data.URL_PAYMENT);
        res.writeHead(301, {'Location': res2.data.URL_PAYMENT});
        res.end();
    }).catch((err) => {
        console.error(err);
    });

}).listen(3000);
