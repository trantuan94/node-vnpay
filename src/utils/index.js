'use strict'
const querystring = require('qs');

class Utils {
    static  hash (data, algorithm = 'sha256') {
        let encryptor = require(algorithm);
        return encryptor(data);
    }

    static sortObject (obj) {
        let sorted = {};
        let keys = [];

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        keys.sort();
        let keysLength = keys.length;
        for (let i = 0; i < keysLength; i++) {
            sorted[keys[i]] = obj[keys[i]];
        }
        
        return sorted;
    }
    
    static genChecksumForParams (params, secretKey, algorithm = 'sha256') {
        params = this.sortObject(params);
        let signData = secretKey + querystring.stringify(params, { encode: false });
        let secureHash = this.hash(signData, algorithm)
        params.vnp_SecureHash = secureHash;
        params.vnp_SecureHashType = algorithm.toUpperCase();

        return params;
    }

    static getMerchantIpAddr (request) {
        let ipAddr = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;

        return ipAddr;
    }

    static makeUrlParams (params) {
        return querystring.stringify(params, { encode: true });
    }
}
module.exports = Utils;
