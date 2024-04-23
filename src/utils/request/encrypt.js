/*
 * @Author: your name
 * @Date: 2021-08-24 10:36:25
 * @LastEditTime: 2021-12-29 09:09:24
 * @LastEditors: wei_jt@ecidi.com
 * @Description: In User Settings Edit
 * @FilePath: 接口加密
 */
import { interfaceEncryptType } from '@/config'
import { SM4Encrypt, SM2Encrypt, SM4Decrypt, SM2Decrypt } from '../encryption/sm4'
import { AESEncrypt, AESDecrypt } from '../encryption/aes'
import { RSAEncrypt, RSADecrypt } from '../encryption/rsa'
import { DESEncrypt, DESDecrypt } from '../encryption/des'

export function encrypt (config) {
  if (config.data) {
    switch (interfaceEncryptType) {
      case 'SM4': {
        config.data = SM4Encrypt((config.data))
        break
      }
      case 'SM2': {
        config.data = SM2Encrypt(config.data)
        break
      }
      case 'RSA': {
        config.data = RSAEncrypt(config.data)
        break
      }
      case 'AES': {
        config.data = AESEncrypt(config.data)
        break
      }
      case 'DES': {
        config.data = DESEncrypt(config.data)
        break
      }
      default: break
    }
  }
  if (config.params) {
    switch (interfaceEncryptType) {
      case 'SM4': {
        let params = SM4Encrypt(config.params)
        config.params = { data: params }
        break
      }
      case 'SM2': {
        let params = SM2Encrypt(JSON.stringify(config.params))
        config.params = { data: params }
        break
      }
      case 'RSA': {
        config.data = RSAEncrypt(config.data)
        break
      }
      case 'AES': {
        config.data = AESEncrypt(config.data)
        break
      }
      case 'DES': {
        config.data = DESEncrypt(config.data)
        break
      }
      default: break
    }
  }
  if (config.method != 'get' && config.method != 'GET') {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
  }
  return config
}
export function decrypt (response) {
  if (response.data) {
    switch (interfaceEncryptType) {
      case 'SM4': {
        response.data = SM4Decrypt(response.data)
        break
      }
      case 'SM2': {
        response.data = SM2Decrypt(response.data)
        break
      }
      case 'RSA': {
        response.data = RSADecrypt(response.data)
        break
      }
      case 'AES': {
        response.data = AESDecrypt(response.data)
        break
      }
      case 'DES': {
        response.data = DESDecrypt(response.data)
        break
      }
    }
  }
  return response
}