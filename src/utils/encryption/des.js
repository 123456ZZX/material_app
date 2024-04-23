/*
 * @Author: your name
 * @Date: 2021-05-12 11:28:01
 * @LastEditTime: 2021-05-12 11:43:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \central-system\src\utils\des.js
 */
//DES 加密

// key为加密的秘钥。message 为需要加密的信息

const CryptoJS = require("crypto-js");
let key = "I1DWp8FYaPHDXDI6";
export function encryptDes(message) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

//DES 解密
export function decryptDes(ciphertext) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  // direct decrypt ciphertext
  var decrypted = CryptoJS.DES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
    },
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}
