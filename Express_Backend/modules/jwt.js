
const jwt = require('jsonwebtoken');
const key = require("../src/jwt_config");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    accessSign: async (CUST_LOGIN_ID) => {
        /* 현재는 idx와 email을 payload로 넣었지만 필요한 값을 넣으면 됨! */
        const payload = {
            CUST_LOGIN_ID: CUST_LOGIN_ID,
        };
        
        return jwt.sign(payload,key.ACCESS_TOKEN_SECRET, {expiresIn : "3H"});
    },
    accessVerify: async (token) => {
        let decoded;
        try {
            // verify를 통해 값 decode!
            decoded = jwt.verify(token, key.ACCESS_TOKEN_SECRET);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                // console.log('invalid token');
                return TOKEN_INVALID;
            } else {
                // console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    },
    refreshSign: async (CUST_LOGIN_ID) => {
        /* 현재는 idx와 email을 payload로 넣었지만 필요한 값을 넣으면 됨! */
        const payload = {
            CUST_LOGIN_ID: CUST_LOGIN_ID,
        };
            
        
        return jwt.sign(payload,key.REFRESH_TOKEN_SECRET, {expiresIn : "30D"});
            
    },
    refreshVerify: async (token) => {
        let decoded;
        try {
            // verify를 통해 값 decode!
            decoded = jwt.verify(token, key.REFRESH_TOKEN_SECRET);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}