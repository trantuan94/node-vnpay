'use strict'
const SimpleSchema = require('simpl-schema');

class PayRequest {
    static fieldSchema = new SimpleSchema({
        createdDate 		 : { type: SimpleSchema.Integer, optional: true, max: 99999999999999, min: 20150101000000 },
        amount               : { type: SimpleSchema.Integer, max: 9999999999 },
        clientIp             : { type: String, max: 45, min: 7 },
        bankCode             : { type: String, optional: true, max: 20, min: 3 },
        locale               : { type: String, allowedValues: ['vn', 'en'] },
        orderId              : { type: String, max: 34 },
        orderInfo            : { type: String, max: 255 },
        orderType            : { type: String, max: 100 },
        returnUrl            : { type: String, max: 255, min: 10 },
        transactionRef       : { type: String, max: 100 }
    });

    static validate (inputs) {
        return this.fieldSchema.validate(inputs)
    }
}
module.exports = PayRequest;

