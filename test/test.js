const assert = require('assert');
const defaultConfig = require('./config.json');
const VNPay = require('../index');
let vnpay = new VNPay({
    secretKey: defaultConfig.secretKey,
    returnUrl: defaultConfig.returnUrl,
    merchantCode: defaultConfig.merchantCode,
    ipAddr: '192.168.6.52'
})
describe('Generate VNPAY URL for API pay', () => {
    let payURL = vnpay.pay({
        transactionRef: 'PT20200520103101_004',
        orderInfo: 'Thanh toan hoa don dich vu',
        orderType: '250006',
        amount: 100000,
        bankCode: 'NCB'
    })
    console.log('payURL', payURL)
})
console.log('    ')

describe('Generate VNPAY URL for API refund', () => {
    let refundURL = vnpay.refund({
        transactionType: '02',
        transactionRef: 'PT20200520103101_005',
        transDate: 20200520114301,
        orderInfo: 'Tra lai tien KH (kh tra lai hang)',
        amount: 100000
    })
    console.log('refundURL', refundURL);
})
console.log('    ')
describe('Generate VNPAY URL for API truy van giao dich', () => {
    let queryURL = vnpay.queryDr({
        transactionRef: 'PT20200520103101_AAA',
        orderType: '250006',
        transDate: 20200520104301,
        orderInfo: 'Kiem tra ket qua giao dich',
    })
    console.log('queryURL', queryURL);
})