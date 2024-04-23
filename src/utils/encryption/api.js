/*
 * @Author: your name
 * @Date: 2021-08-24 10:36:25
 * @LastEditTime: 2021-09-10 09:52:46
 * @LastEditors: wei_jt@ecidi.com
 * @Description: In User Settings Edit
 * @FilePath: \central-system\src\utils\fullEncrypt.js
 */
import { interfaceEncryptType } from "@/settings";
import { encrypt_SM4, encrypt_SM2, decrypt_SM4, decrypt_SM2 } from "./sm4";
import { ignore } from "../../api/ignore.js";
import { Encrypt, Decrypt } from "./aes";
import { rsaEncrypt, rsaDecrypt } from "./rsa";
import { encryptDes, decryptDes } from "./des";

export function verifyRequest(config) {
  let flag = true;
  ignore.forEach((item) => {
    if (item.url == config.url) {
      if (item.httpMethod == "all" || item.httpMethod === config.method) {
        switch (item.reqOrRes) {
          case "res": {
            break;
          }
          case "req": {
            flag = false;
            break;
          }
          case "all": {
            flag = false;
            break;
          }
        }
      }
    }
  });
  return flag;
}

export function verifyResponse(response) {
  let flag = true;
  ignore.forEach((item) => {
    if (item.url == response.config.url) {
      if (item.httpMethod == "all" || item.httpMethod === response.config.method) {
        switch (item.reqOrRes) {
          case "res": {
            flag = false;
            break;
          }
          case "req": {
            break;
          }
          case "all": {
            flag = false;
            break;
          }
        }
      }
    }
  });
  return flag;
}

export function fullEncrypt(config) {
  if (config.data) {
    switch (interfaceEncryptType) {
      case "SM4": {
        config.data = encrypt_SM4(config.data);
        break;
      }
      case "SM2": {
        config.data = encrypt_SM2(config.data);
        break;
      }
      case "RSA": {
        config.data = rsaEncrypt(config.data);
        break;
      }
      case "AES": {
        config.data = Encrypt(config.data);
        break;
      }
      case "DES": {
        config.data = encryptDes(config.data);
        break;
      }
      default:
        break;
    }
  }
  if (config.params) {
    switch (interfaceEncryptType) {
      case "SM4": {
        let params = encrypt_SM4(config.params);
        config.params = { data: params };
        break;
      }
      case "SM2": {
        let params = encrypt_SM2(JSON.stringify(config.params));
        config.params = { data: params };
        break;
      }
      case "RSA": {
        config.data = rsaEncrypt(config.data);
        break;
      }
      case "AES": {
        config.data = Encrypt(config.data);
        break;
      }
      case "DES": {
        config.data = encryptDes(config.data);
        break;
      }
      default:
        break;
    }
  }
  if (config.method != "get" && config.method != "GET") {
    config.headers["Content-Type"] = "application/json;charset=UTF-8";
  }
  return config;
}
export function fullDecrypt(response) {
  if (response.data) {
    switch (interfaceEncryptType) {
      case "SM4": {
        response.data = decrypt_SM4(response.data);
        break;
      }
      case "SM2": {
        response.data = decrypt_SM2(response.data);
        break;
      }
      case "RSA": {
        response.data = rsaDecrypt(response.data);
        break;
      }
      case "AES": {
        response.data = Decrypt(response.data);
        break;
      }
      case "DES": {
        response.data = decryptDes(response.data);
        break;
      }
    }
  }
  return response;
}
