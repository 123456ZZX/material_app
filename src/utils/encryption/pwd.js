/*
 * @Author: your name
 * @Date: 2021-05-17 11:18:31
 * @LastEditTime: 2021-05-17 11:34:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \central-system\src\utils\pwdEncrypt.js
 */
import { pwdEncrypType } from "@/settings";
import { encrypt_SM2, encrypt_SM4 } from "./sm4";
import md5 from "js-md5";
export function pwdEncrypt(value) {
  if (value) {
    if (pwdEncrypType) {
      switch (pwdEncrypType) {
        case "MD5": {
          return md5(value);
        }
        case "SM4": {
          return encrypt_SM4(value);
        }
        case "SM2": {
          return encrypt_SM2(value);
        }
      }
    } else {
      return encrypt_SM4(value);
    }
  }
}
