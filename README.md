<h1 align="center"> GLOCASH PAY </h1>
<p align="center"> glocash payment SDK for NODEJS</p>
<h3 align="center"> <a target="_blank" href="https://docs.glocash.com">文档地址</a> </h3>

## 安装
```
$ npm install
```

## 配置
配置信息(config.js)
``` javascript
module.exports = {
    sandbox:false, //sandbox模式
    mchEmail:'商户邮箱', 
    apiKey:'商户秘钥',
    appid:'应用ID',
}
```

## 发起交易
``` javascript
    // 设置商户邮箱 KEY 渠道
    gc.setMchEamil(conf.mchEmail).setApiKey(conf.apiKey).setChannel('C01');
    // 支付参数
    var initData = {
        REQ_INVOICE:'TEST'+parseInt(Math.random()*1000000), //订单号
        REQ_APPID: 380, //应用ID
        BIL_GOODSNAME:'#gold#Runescape/OSRS Old School/ 10M Gold', // 商户名称 请如实填写 否则银行结算会盘查
        CUS_EMAIL:'rongjiang.chen@witsion.com', //客户邮箱
        BIL_PRICE:'9.9', //价格
        BIL_CURRENCY:'USD', //币种
        BIL_CC3DS:1, //是否开启3ds 1 开启 0 不开启
        BIL_IPADDR:'116.230.37.10', //客户ip地址
        URL_SUCCESS:'http://www.crjblog.cn/return.php?status=success', //成功通知地址
        URL_FAILED:'http://www.crjblog.cn/return.php?status=error', //失败通知地址
        URL_NOTIFY:'http://www.crjblog.cn/notify.php', //异步通知地址
    };
   // 支付接口参数
   var data = gc.create(initData);
   var signString = gc.makeSign(data,gc.signType.TYPE_CREATE);
   data.REQ_SIGN = crypto.createHash('SHA256').update(signString).digest('hex');
  
   //支付接口地址 
   var url = gc.getURl(gc.PAYMENT_URL);

```

## 发起退款
```javascript
    //设置商户邮箱 KEY 渠道
    gc.setMchEamil(conf.mchEmail).setApiKey(conf.apiKey);
    // 退款接口参数
    var data = {
        REQ_EMAIL:'商户邮箱',
        PGW_PRICE:9.9,
        TNS_GCID:'C01*****WFKL4W',
        REQ_TIMES:Date.parse(new Date())/1000,
    };
    var signString = gc.makeSign(data, gc.signType.TYPE_REFUND);
    data.REQ_SIGN = crypto.createHash('SHA256').update(signString).digest('hex');
    //退款接口地址
    var url = gc.getURl(gc.REFUND_URL);
```

## 交易查询
```javascript
    //设置商户邮箱 KEY 渠道
    gc.setMchEamil(conf.mchEmail).setApiKey(conf.apiKey);
    // 查询接口参数
    var data = {
        REQ_EMAIL:'商户邮箱',
        TNS_GCID:'C01*****WFKL4W',
        REQ_TIMES:Date.parse(new Date())/1000,
    };
    var signString = gc.makeSign(data, gc.signType.TYPE_QUERY);
    data.REQ_SIGN = crypto.createHash('SHA256').update(signString).digest('hex');
    // 查询接口地址
    var url = gc.getURl(gc.QUERY_URL);

```

## 异步通知
```javascript
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
```

## 直连模式

通过接入GLOCASHPAYMENT支付网关系统（下称GC网关），使商户系统获得覆盖全球的多样化收款渠道。在直连模式中，不需要跳转到信用卡支付页，直接完成支付。可快速完成接入，并实现最佳的付款体验。

```javascript
    //设置商户邮箱 KEY 渠道
    gc.setMchEamil(conf.mchEmail).setApiKey(conf.apiKey).setChannel('C01');

    //支付参数
    var initData = {
        REQ_INVOICE:'TEST'+parseInt(Math.random()*1000000), //订单号
        REQ_APPID: 380, //应用ID
        BIL_GOODSNAME:'#gold#Runescape/OSRS Old School/ 10M Gold', // 商户名称 请如实填写 否则银行结算会盘查
        BIL_GOODS_URL:'https://www.merchant.com/goods/30', //商品url
        CUS_EMAIL:'rongjiang.chen@witsion.com', //客户邮箱
        BIL_PRICE:'9.9', //价格
        BIL_CURRENCY:'USD', //币种
        BIL_CC3DS:1, //是否开启3ds 1 开启 0 不开启
        BIL_IPADDR:'116.230.37.10', //客户ip地址
        URL_SUCCESS:'http://www.crjblog.cn/return.php?status=success', //成功通知地址
        URL_FAILED:'http://www.crjblog.cn/return.php?status=error', //失败通知地址
        URL_NOTIFY:'http://www.crjblog.cn/notify.php', //异步通知地址
        BIL_CCNUMBER:'2223000000000007',
        BIL_CCHOLDER:'john smith',
        BIL_CCEXPM:'09',
        BIL_CCEXPY:'2024',
        BIL_CCCVV2:'365',
    };
   var data = gc.create(initData);
   var signString = gc.makeSign(data,gc.signType.TYPE_CREATE);
   data.REQ_SIGN = crypto.createHash('SHA256').update(signString).digest('hex');
   var url = gc.getURl(gc.DIRECT_URL);
```

## 内嵌模式

通过接入GLOCASHPAYMENT支付网关系统（下称GC网关），使商户系统获得覆盖全球的多样化收款渠道。在内嵌模式中，不需要跳转到信用卡支付页，可以直接嵌入网站页面中，让用户可以快速付款，从而提高付款率。

#### 前端代码 embed.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>glocash-iframe-test</title>
  <meta name="viewport" content="user-scalable=no, width=device-width initial-scale=1.0， maximum-scale=1.0"/>
</head>
<body>
<form id='place_order' method="post">
  <!--这些参数都是商户自己的提交参数-->
  <div>
    <input type="hidden" name="CUS_EMAIL" value="32892123@qq.com"/>
    <input type="hidden" name="BIL_PRICE" value="16"/>
    <input type="hidden" name="BIL_CC3DS" value="0"/>
    <input type="hidden" name="BIL_CURRENCY" value="EUR"/>
    <input type="hidden" name="BIL_GOODSNAME" value="#gold#Runescape/OSRS Old School/ 10M Gol"/>
    <input type="hidden" name="CUS_COUNTRY" value="CN"/>
  </div>

  <!-- 指定表单要插入的位置 -->
  <div style="max-width:400px;margin :0 auto" id="testFrom"></div>

  <div style="max-width:400px;margin :0 auto;text-align:center">
    <input style="padding: 5px 10px;cursor: pointer;width:100px" id="sub_order" type="button" value="付款" />
  </div>
</form>
</body>
</html>
<!-- 引入 jquery.js和iframe.js初始化 即可生成对应的form -->
<script type="text/javascript" src="https://pay.glocashpayment.com/public/comm/js/jquery112.min.js"></script>
<script type="text/javascript" src="https://pay.glocashpayment.com/public/gateway/js/iframe.v0.1.js"></script>
<script type="text/javascript">
  $(function() {
    //初始化 设置应用id和对应要嵌入的位置
    glocashPay.init(
            {
              appId: 2, //商户ID 必填
              payElement: "testFrom",//需要放入的支付表单的位置
              isToken: true, // token支付 必须是true
              buyerId: "456733211", // 买家ID
              config:{
                "card_iframe":{"style":"border: none; width: 100%;height:300px;display:none"},
              } // 设置iframe样式
            }
    );

    // 付款
    $("#sub_order").click(function () {
      glocashPay.checkout(function ({data}) {
        if (data.error) {
          console.error("创建卡信息失败:" + data.error);
          return false;
        }
        var postData = $("#place_order").serializeArray();
        if (data.token) {
          postData.push({name: 'BIL_TEMP_TOKEN', value: data.token});
        }
        if (data.bilToken) {
          postData.push({name: 'BIL_TOKEN', value: data.bilToken});
        }
        submitData(postData)
      });
    });

    // 提交数据
    function submitData(postData) {
      // 如果当前页面有其他的支付信息也可以一并提交到后台
      $.ajax({
        url: "http://localhost:3000/embed", //对应着你们后台的url
        type: "POST",
        data: postData,
        dataType: 'json',
        success: function (result) {
          console.log("返回参数", result);
          if (result.data.URL_CC3DS && result.data.URL_CC3DS != "") {
            //跳转到3ds页面
            window.location.href = result.data.URL_CC3DS;
          } else {
            if (result.data.BIL_STATUS && result.data.BIL_STATUS == 'paid') {
              //支付成功
              alert('paid success');
            } else {
              //支付失败
              if (result.data.REQ_ERROR) {
                alert('paid error ' + result.data.REQ_ERROR);
              }
              if (result.data.PGW_MESSAGE) {
                alert('paid error ' + result.data.PGW_MESSAGE);
              }
            }
          }
          return true;
        }
      });
    }
  });
</script>

```

#### NODEJS 接口
```javascript
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
```

## 收银台模式

通过接入GLOCASHPAYMENT支付网关系统（下称GC网关），使商户系统获得覆盖全球的多样化收款渠道。在收银台模式中，可以根据国家，展示对应的支付方式，从而提高付款率。

```javascript
    //设置商户邮箱 KEY 渠道
    gc.setMchEamil(conf.mchEmail).setApiKey(conf.apiKey).setChannel('C01');
    //支付参数
    var initData = {
        REQ_INVOICE:'TEST'+parseInt(Math.random()*1000000), //订单号
        REQ_APPID: 380, //应用ID
        BIL_GOODSNAME:'#gold#Runescape/OSRS Old School/ 10M Gold', // 商户名称 请如实填写 否则银行结算会盘查
        CUS_EMAIL:'rongjiang.chen@witsion.com', //客户邮箱
        BIL_PRICE:'9.9', //价格
        BIL_CURRENCY:'USD', //币种
        BIL_CC3DS:1, //是否开启3ds 1 开启 0 不开启
        BIL_IPADDR:'116.230.37.10', //客户ip地址
        URL_SUCCESS:'http://www.crjblog.cn/return.php?status=success', //成功通知地址
        URL_FAILED:'http://www.crjblog.cn/return.php?status=error', //失败通知地址
        URL_NOTIFY:'http://www.crjblog.cn/notify.php', //异步通知地址
    };
   var data = gc.create(initData);
   var signString = gc.makeSign(data,gc.signType.TYPE_CREATE);
   data.REQ_SIGN = crypto.createHash('SHA256').update(signString).digest('hex');
   //支付接口地址
   var url = gc.getURl(gc.CHECKOUT_URL);
```


