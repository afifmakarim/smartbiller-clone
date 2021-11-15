const CryptoJS = require("crypto-js");

const headerAuth = "Basic dGVzdGluZzEyMzp0ZXN0aW5nYWph".substring(6);
const decodeBasicAuth = CryptoJS.enc.Base64.parse(headerAuth);
console.log(decodeBasicAuth.toString(CryptoJS.enc.Utf8));
//const decode = decodeBasicAuth.Split(":");
