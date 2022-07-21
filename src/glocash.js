var gc = {
    debug:true,
    sandbox: false,
    mchEmail:'',
    apiKey :'',
    channel :'C01',
    signType :{
        TYPE_CREATE:1,
        TYPE_QUERY :2,
        TYPE_REFUND:3,
        TYPE_NOTIFY:4,
    },
    STATUS_TYPE:{
        CODE_SUCCESS :200,
        CODE_BAD_REQUEST :400,
        CODE_UNAUTHORIZED  :401,
        CODE_REQUEST_FAILED  :402,
        CODE_FORBIDDEN  :403,
        CODE_NOT_FOUND  :404,
        CODE_SERVER_ERRORS  :500,
    },
    CUS_ERROR_TYPE:{
        SIGN_NULL : 'merchant email or apiKey is null',
        EMAIL_MUST : 'email is  must',
        BIL_GOODSNAME_MUST : 'bil_goodsname is must',
        BIL_PRICE_MUST : 'bil_price is must',
        BIL_CURRENCY_MUST : 'bil_currency is must',
        GCID_MUST : 'gcid is  must',
        AMOUNT_GT0 : 'amount must greater than 0',
        SIGN_ERROR : 'sign is failed',
        PARAM_ERROR : 'param is failed',
    },
    LIVE_URL:'https://pay.glocashpayment.com',
    SANDBOX_URL:'https://sandbox.glocashpayment.com',
    PAYMENT_URL : '/gateway/payment/index',
    QUERY_URL : '/gateway/transaction/index',
    REFUND_URL : '/gateway/transaction/refund',
    DIRECT_URL : '/gateway/payment/ccdirect',
    EMBED_URL : '/gateway/payment/ccdirect',
    CHECKOUT_URL : '/gateway/paymentv2/checkout',
    base_url:'',
    setBaseUrl:function (baseUrl) {
        this.base_url = baseUrl;
        return this;
    },
    isDebug:function () {
        return this.debug;
    },
    setDebug:function (debug) {
        this.debug = debug;
        return this;
    },
    setMchEamil:function(email){
        this.mchEmail = email;
        return this;
    },
    setApiKey:function (apiKey) {
        this.apiKey = apiKey;
        return this;
    },
    setSandbox:function (sandbox) {
        this.sandbox = sandbox;
        return this;
    },
    setChannel:function (channel) {
        this.channel = channel;
        return this;
    },
    getURl:function (url) {
        var baseUrl = this.sandbox ? this.SANDBOX_URL : this.LIVE_URL;
        baseUrl = this.base_url ? this.base_url : baseUrl;
        return baseUrl + url;
    },
    checkMerchantConfig:function (conf) {
        if(!conf.mchEmail || !conf.apiKey){
            throw ({'errorCode':this.STATUS_TYPE.CODE_UNAUTHORIZED, 'errorMessage':this.CUS_ERROR_TYPE.SIGN_NULL});
        }
    },
    create(data){
        data['REQ_SANDBOX'] = this.sandbox?1:0;
        data['REQ_EMAIL'] = this.mchEmail;
        data['BIL_METHOD'] = this.channel;
        data['REQ_TIMES'] = Date.parse(new Date())/1000;
        if(!data['CUS_EMAIL']){
            throw ({'errorCode':this.STATUS_TYPE.CODE_BAD_REQUEST, 'errorMessage':this.CUS_ERROR_TYPE.EMAIL_MUST});
        }
        if(!data['BIL_GOODSNAME']){
            throw ({'errorCode':this.STATUS_TYPE.CODE_BAD_REQUEST, 'errorMessage':this.CUS_ERROR_TYPE.BIL_GOODSNAME_MUST});
        }
        if(!data['BIL_PRICE']){
            throw ({'errorCode':this.STATUS_TYPE.CODE_BAD_REQUEST, 'errorMessage':this.CUS_ERROR_TYPE.BIL_PRICE_MUST});
        }
        if(!data['BIL_CURRENCY']){
            throw ({'errorCode':this.STATUS_TYPE.CODE_BAD_REQUEST, 'errorMessage':this.CUS_ERROR_TYPE.BIL_CURRENCY_MUST});
        }
        return data;
    },
    makeSign(data,type){
        var signString = "";
        switch (type) {
            case this.signType.TYPE_CREATE:
                signString = this.apiKey + data['REQ_TIMES'] + this.mchEmail + data['REQ_INVOICE'] + data['CUS_EMAIL'] + this.channel + data['BIL_PRICE'] + data['BIL_CURRENCY'];
                break;
            case this.signType.TYPE_QUERY:
                signString = this.apiKey + data['REQ_TIMES'] + this.mchEmail + data['TNS_GCID'];
                break;
            case this.signType.TYPE_REFUND:
                signString = this.apiKey + data['REQ_TIMES'] + this.mchEmail + data['TNS_GCID'] + data['PGW_PRICE'];
                break;
            case this.signType.TYPE_NOTIFY:
                signString = this.apiKey + data['REQ_TIMES'] + data['REQ_EMAIL'] + data['CUS_EMAIL'] + data['TNS_GCID'] + data['BIL_STATUS'] + data['BIL_METHOD'] + data['PGW_PRICE'] + data['PGW_CURRENCY'];
                break;
        }
        return signString;
    },
    log:function (e) {
        throw new Error(e.errorCode+' '+e.errorMessage);
    }
}
module.exports = gc