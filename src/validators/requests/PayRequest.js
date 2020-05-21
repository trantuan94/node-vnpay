'use strict'
const SimpleSchema = require('simpl-schema');

class PayRequest {
    static fieldSchema = new SimpleSchema({
        amount               : { type: SimpleSchema.Integer, max: 9999999999 },
        orderInfo            : { type: String, max: 255 },
        orderType            : { type: String, max: 100, allowedValues: [
            '100000', '100001', '100003', '100004', '100005', '110000', '110001',
            '110002', '110003', '110004', '110005', '120000', '120001', '120002',
            '120003', '130000', '130001', '130002', '130003', '130004', '130005',
            '130006', '130007', '130008', '140000', '140001', '140002', '140003',
            '140004', '140005', '150000', '150001', '150002', '150003', '160000',
            '160001', '160002', '160003', '160004', '170000', '170001', '170002',
            '170003', '180000', '190000', '190001', '190002', '190003', '190004',
            '200000', '200001', '200002', '200003', '200004', '210000', '210001',
            '210002', '210003', '210004', '220000', '220001', '220002', '220003',
            '220004', '230000', '240000', '240001', '240002', '240003', '240004',
            '250000', '250001', '250002', '250003', '250004', '250005', '250006',
            '250007', '260000', '260001', '260002', '270000', '270001', 'topup'
        ] },
        transactionRef       : { type: String, max: 100 },
        bankCode             : { type: String, optional: true, max: 20, min: 3 }
    });

    static validate (inputs) {
        return this.fieldSchema.validate(inputs)
    }
}
module.exports = PayRequest;

