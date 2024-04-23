/*
 * @Description: SM4 加密/解密
 * @Author: ye_xf
 * @Date: 2021-02-04 10:13:58
 * @LastEditTime: 2021-08-31 14:03:40
 * @LastEditors: Please set LastEditors
 * @Reference:
 */

import { sm2 } from "sm-crypto";
// #SM2后端公钥
let SM2_BACK_PUBLICK_KEY =
  "042035cffeacda14f4a768425070db8fbe136c72b835818c555debe330c1d220da514ca466b6c171cc2445844c70cb0032ee7df0b4a11fd4097a929770fc33c07d";
// #SM2前端端公钥
// let SM2_PUBLICK_KEY = '045aa0015cc1b6bfdefa5afd4046c78b5b090cd658d92a26315bff6c805b1fcfb279b3b5bad168ff1a1fdb7ed91d4101ef34ae629143fdb921c643f73dbb9cd13e'
// #SM2私钥
let SM2_PRIVATE_KEY = "3ef9efeaf054adbfafdf106c9510fcbdfb4cdff2bd52f16de9bbc005a39fe970";
// let SM2_PRIVATE_KEY = 'fadf82c47128710e0e5ccb21c9c5fb86ff5b5f72aa7b17c1f7d779023b004497'
// #SM4密钥
let SM4_KEY = "43869399C1411A3BE71A99B35123AEFC";
//生成SM4密钥
// function getKey(length = 32) {
//   let random = '0123456789ABCDEF'
//   let str = ''

//   for (let i = 0; i < length; i++) {
//     str = str + random.charAt(Math.floor(Math.random() * 16))
//   }

//   return str
// }

//加密
function encrypt(plaintext, key) {
  // eslint-disable-next-line no-undef
  const sm4 = new Sm4utils(key);

  if (plaintext instanceof Object) {
    plaintext = JSON.stringify(plaintext);
  }

  const encryptData = sm4.encryptData_ECB(plaintext);

  if (!encryptData) {
    return false;
  } else {
    return encryptData;
  }
}

//接口数据加密
export function SM4Encrypt (data) {
  // return new Promise((res, rej) => {
  //从浏览器缓存中获取SM4
  // const SM4_KEY = storage.get('sm4_key')

  // if (!SM4_KEY) {
  //     SM4_KEY = getKey() //获取SM4密钥
  //     storage.set('sm4_key', SM4_KEY) //将SM4密钥存储到浏览器缓存中
  // }

  const encryptData = encrypt(data, SM4_KEY)

  if (!encryptData) {
    console.error('数据加密失败')
    // rej(false)
    return
  }

  // const encryptSM4 = '04' + sm2.doEncrypt(SM4_KEY, SM2_PUBLICK_KEY, 0) //将SM4_KEY使用SM2公钥进行加密

  return encryptData
  // })
}

//解密
function decrypt(ciphertext, key) {
  // eslint-disable-next-line no-undef
  const sm4 = new Sm4utils(key);
  let decryptData = sm4.decryptData_ECB(ciphertext);

  if (!decryptData) {
    return false;
  }

  if (decryptData.charAt(0) === "{" || decryptData.charAt(0) === "[") {
    decryptData = JSON.parse(decryptData);
  }

  return decryptData;
}

//接口数据加密
export function encrypt_SM4(data) {
  // return new Promise((res, rej) => {
  //从浏览器缓存中获取SM4
  // const SM4_KEY = storage.get('sm4_key')

  // if (!SM4_KEY) {
  //     SM4_KEY = getKey() //获取SM4密钥
  //     storage.set('sm4_key', SM4_KEY) //将SM4密钥存储到浏览器缓存中
  // }

  const encryptData = encrypt(data, SM4_KEY);

  if (!encryptData) {
    console.warn("数据加密失败");
    // rej(false)
    return;
  }

  // const encryptSM4 = '04' + sm2.doEncrypt(SM4_KEY, SM2_PUBLICK_KEY, 0) //将SM4_KEY使用SM2公钥进行加密

  return encryptData;
  // })
}

//接口数据解密
export function decrypt_SM4(data) {
  // return new Promise((res, rej) => {
  // const SM4_KEY = sm2.doDecrypt(data, SM2_PRIVATE_KEY, 0) //使用SM2私钥解密获取SM4_KEY

  if (!SM4_KEY) {
    console.warn("SM4密钥解密失败");
    // rej(false)
    return;
  }

  const decryptData = decrypt(data, SM4_KEY); //使用SM4_KEY解密
  if (!decryptData) {
    console.warn("数据解密失败");
    // rej(false)
    return;
  }

  return decryptData;
  // })
}
export function encrypt_SM2(data) {
  const encryptSM2 = "04" + sm2.doEncrypt(data, SM2_BACK_PUBLICK_KEY, 0);
  return encryptSM2;
}
export function decrypt_SM2(data) {
  data = data.slice(2);

  const decryptSM2 = sm2.doDecrypt(data, SM2_PRIVATE_KEY, 0);

  return decryptSM2;
}
