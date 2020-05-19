'use strict'
/**
 * VNPay Class implement refer from the VNPAY API v2.0 documentation.
 */
const PayRequestValidator = require('./src/validators/requests/PayRequest');
const QueryRequestValidator = require('./src/validators/requests/QueryRequest');
const RefundRequestValidator = require('./src/validators/requests/RefundRequest');
const moment = require('moment');
const Utils = require('./src/utils');

class VNPay {
    constructor (config = {}) {
        this.setConfig(config);
        this.reqDataDefault = {
            vnp_Version: this.config.vnpVersion,
            vnp_CurrCode: 'VND',
            vnp_TmnCode: this.config.merchantCode,
            vnp_Locale: this.config.locale
        }
    }

    setConfig (config = {}) {
        this.config = {};
        const { secretKey, merchantCode, returnUrl, locale = 'vn', vnpVersion = '2.0.0', hashAlgorithm = 'SHA256'} = config;
        this.config.vnpVersion = vnpVersion;
        if (!secretKey) {
            throw new Error('Please provide secret key to create URL of VNPay API');
        }
        this.config.secretKey = secretKey;
        if (!merchantCode) {
            throw new Error('Please provide merchant code to create URL parameter of VNPay API');
        }
        this.config.merchantCode = merchantCode;
        if (typeof hashAlgorithm !== 'string' || !['md5', 'sha256'].includes(hashAlgorithm.toLowerCase())) {
            this.config.hashAlgorithm = 'sha256';
        } else {
            this.config.hashAlgorithm = hashAlgorithm.toLowerCase();
        }
        if (typeof locale !== 'string' || !['vn', 'en'].includes(locale)) {
            this.config.locale = 'vn';
        } else {
            this.config.locale = locale;
        }
    }

    pay (payload) {
        PayRequestValidator.validate(payload);
        let vnpParams = {
            ...this.reqDataDefault,
            vnp_Command: 'pay',
            vnp_TxnRef: payload.transactionRef,
            vnp_OrderInfo: payload.orderInfo,
            vnp_OrderType: payload.orderType,
            vnp_Amount: payload.amount * 100,
            vnp_ReturnUrl: payload.returnUrl,
            vnp_IpAddr: payload.clientIp,
            vnp_CreateDate: this.genCreateDate()
        };
        vnpParams = Utils.genChecksumForParams(vnpParams, this.config.secretKey, this.config.hashAlgorithm);
        return 
    }

    refund (payload) {
        RefundRequestValidator.validate(payload)
        let vnpParams = {
            ...this.reqDataDefault,
            vnp_Command: 'refund',
            vnp_TransactionType: payload.transactionType,
            vnp_TxnRef: payload.transactionRef,
            vnp_Amount: payload.amount,
            vnp_OrderInfo: payload.orderInfo,
            vnp_TransDate: this.genCreateDate(),
            vnp_CreateDate: this.genCreateDate(),
            vnp_IpAddr: payload.ipAddr
        }

        vnpParams = Utils.genChecksumForParams(vnpParams, this.config.secretKey, this.config.hashAlgorithm);

        return
    }

    queryDr (payload) {
        QueryRequestValidator.validate(payload);
        let vnpParams = {
            ...this.reqDataDefault,
            vnp_Command: 'querydr',
            vnp_TxnRef: payload.transactionRef,
            vnp_IpAddr: payload.ipAddr,
            vnp_OrderInfo: payload.orderInfo,
            vnp_TransDate: payload.transactionDate,
            vnp_CreateDate: this.genCreateDate()
        }
        vnpParams = Utils.genChecksumForParams(vnpParams, this.config.secretKey, this.config.hashAlgorithm);

        return
    }

    genCreateDate () {
        return parseInt(moment().format('YYYYMMDDHHmmss'));
    }

}
module.exports = VNPay
