/*
 * @Author: your name
 * @Date: 2021-07-08 15:11:00
 * @LastEditTime: 2021-07-22 11:06:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \central-system\src\utils\aes.js
 */
const CryptoJS = require("crypto-js"); //引用AES源码js
const key = CryptoJS.enc.Utf8.parse("dRPzT9y0v87FKOqtNEFaSs6d0bYBhwPa"); //十六位十六进制数作为密钥
//解密方法
export function Decrypt(data) {
  const decrypted = CryptoJS.AES.decrypt(data, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypted);
}

//加密方法
export function Encrypt(data) {
  let srcs = CryptoJS.enc.Utf8.parse(data);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
//滑块验证
/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function aesEncrypt(word, keyWord = "XwKsGlMcdPMEhR1B") {
  var key = CryptoJS.enc.Utf8.parse(keyWord);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
