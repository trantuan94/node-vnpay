'use strict'
/**
 * VNPay Class implement refer from the VNPAY API v2.0 documentation.
 */
const moment = require('moment');
const Utils = require('./src/utils');
const SimpleSchema = require('simpl-schema');
const PayRequestValidator = require('./src/validators/requests/PayRequest');
const QueryRequestValidator = require('./src/validators/requests/QueryRequest');
const RefundRequestValidator = require('./src/validators/requests/RefundRequest');
const VNP_VERSION_DEFAULT = '2';
const CURRENCY_VND_CODE = 'VND';
const LOCALE_EN = 'en';
const LOCALE_VN = 'vn';
const VNP_URL = 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

class VNPay {
    constructor (config = {}) {
        this.config = {};
        this.configSchema = new SimpleSchema({
            secretKey: { type: String },
            merchantCode: { type: String, max: 8 },
            returnUrl: { type: String, min: 10, max: 255 },
            ipAddr: { type: String, min: 7, max: 45 },
            locale: { type: String, optional: true, allowedValues: [LOCALE_EN, LOCALE_VN] },
            vnpVersion: { type: String, optional: true, allowedValues: ['1', VNP_VERSION_DEFAULT] },
            hashAlgorithm: { type: String, optional: true, allowedValues: ['sha256', 'md5'] }
        });
        this.setConfig(config);
        this.vnpDefaultParams = {
            vnp_Version: this.config.vnpVersion,
            vnp_CurrCode: CURRENCY_VND_CODE,
            vnp_TmnCode: this.config.merchantCode,
            vnp_Locale: this.config.locale,
            vnp_IpAddr: this.config.ipAddr
        }
    }

    setConfig (config = {}) {
        this.configSchema.validate(config)
        this.config = {
            vnpVersion: config.vnpVersion || VNP_VERSION_DEFAULT,
            locale: config.locale || LOCALE_VN,
            secretKey: config.secretKey,
            merchantCode: config.merchantCode,
            returnUrl: config.returnUrl,
            ipAddr: config.ipAddr,
            hashAlgorithm: config.hashAlgorithm ? config.hashAlgorithm.toLowerCase() : 'sha256'
        };
    }

    pay (payload) {
        PayRequestValidator.validate(payload);
        let vnpParams = {
            ...this.vnpDefaultParams,
            vnp_Command: 'pay',
            vnp_ReturnUrl: this.config.returnUrl,
            vnp_TxnRef: payload.transactionRef,
            vnp_OrderInfo: payload.orderInfo,
            vnp_OrderType: payload.orderType,
            vnp_Amount: payload.amount * 100,
            vnp_CreateDate: this.genCreateDate()
        };
        if (payload.bankCode && payload.bankCode !== '') {
            vnpParams.vnp_BankCode = payload.bankCode;
        }
        vnpParams = Utils.genChecksumForParams(vnpParams, this.config.secretKey, 
            this.config.hashAlgorithm);
        // console.log('vnpParams', vnpParams)
        // return vnpParams;
        let urlParams = Utils.makeUrlParams(vnpParams);

        return `${VNP_URL}?${urlParams}`;
    }

    refund (payload) {
        RefundRequestValidator.validate(payload)
        let vnpParams = {
            ...this.vnpDefaultParams,
            vnp_Command: 'refund',
            vnp_TransactionType: payload.transactionType,
            vnp_TxnRef: payload.transactionRef,
            vnp_Amount: payload.amount * 100,
            vnp_TransDate: payload.transDate,
            vnp_CreateDate: this.genCreateDate()
        }
        if (payload.orderInfo && payload.orderInfo !== '') {
            vnpParams.vnp_OrderInfo = payload.orderInfo;
        }

        vnpParams = Utils.genChecksumForParams(vnpParams, this.config.secretKey, 
            this.config.hashAlgorithm);

        let urlParams = Utils.makeUrlParams(vnpParams);

        return `${VNP_URL}?${urlParams}`;
    }

    queryDr (payload) {
        QueryRequestValidator.validate(payload);
        let vnpParams = {
            ...this.vnpDefaultParams,
            vnp_Command: 'querydr',
            vnp_TxnRef: payload.transactionRef,
            vnp_OrderInfo: payload.orderInfo,
            vnp_TransDate: payload.transDate,
            vnp_OrderType: payload.orderType,
            vnp_CreateDate: this.genCreateDate()
        }
        if (payload.transactionNo) {
            vnpParams.vnp_TransactionNo = payload.transactionNo;
        }

        vnpParams = Utils.genChecksumForParams(vnpParams, this.config.secretKey, 
            this.config.hashAlgorithm);
        let urlParams = Utils.makeUrlParams(vnpParams);

        return `${VNP_URL}?${urlParams}`;
    }

    genCreateDate () {
        return parseInt(moment().format('YYYYMMDDHHmmss'));
    }
}
module.exports = VNPay
