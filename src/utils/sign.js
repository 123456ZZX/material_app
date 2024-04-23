/*
 * @Author: xie_sm
 * @Date: 2022-03-16 08:57:40
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-03-16 11:31:33
 * @FilePath: \mobile-template\src\utils\sign.js
 * @Description:
 *
 */
import HmacSHA1 from "crypto-js/hmac-sha1";
import Base64 from "crypto-js/enc-base64";
import dayjs from "dayjs";
import { isEmpty } from "./util";
import { CLIENT, CLIENT_SECRET, TTL } from "@/settings";
import storage from "./storage";

const Dvalue = () =>
  `${storage.get("ts-D-value")}` === "null" ? 0 : Number(`${storage.get("ts-D-value")}`);

const objTransUrlParams = (obj) => {
  const params = [];
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    if (typeof value === "undefined") {
      value = "";
    }
    params.push([key, value].join("="));
  });
  return params.join("&");
};

const sortUrlParams = (str) => {
  if (typeof str !== "string") {
    return {};
  }
  const paramObj = {};
  const paramArr = decodeURI(str).split("&");
  // let paramArr = str.split('&');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < paramArr.length; i++) {
    const tmp = paramArr[i].split("=");
    const key = tmp[0];
    const value = tmp[1] || "";
    // if (typeof value === 'string' && isNaN(Number(value)) === false && value !== "") {
    //  value = Number(value);
    // }
    if (typeof paramObj[key] === "undefined") {
      paramObj[key] = value;
    } else {
      const newValue = Array.isArray(paramObj[key]) ? paramObj[key] : [paramObj[key]];
      newValue.push(value);
      paramObj[key] = newValue;
    }
  }
  return paramObj;
};

const objKeySort = (obj) => {
  const newkey = Object.keys(obj).sort();
  const newObj = {};
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]];
  }
  return newObj;
};

// 获取加密后的参数对象
/**
 * @param {object} 对象中的属性为需要加密的属性
 * @example getSign({ f8s: fileToken })
 * @return
 * {
    f8s: "c15cf2e99c9b46cfc4ced4d2301b6aef"
    sign: "AuBRUDz6qzBXW4B+sg1GiptuIys="
    ts: "1602499441622"
    ttl: "30"
    uid: "fawkes"}
 */
export const getSign = (rest) => {
  let param = "";
  const ts = dayjs().unix() + Dvalue();
  const ttl = TTL;
  const obj = rest;
  param += `ts=${ts}&ttl=${ttl}&uid=${CLIENT}${isEmpty(obj) ? "" : `&${objTransUrlParams(obj)}`}`;
  let paramArr = sortUrlParams(param);
  paramArr = objKeySort(paramArr);
  let paramStr = [];
  Object.keys(paramArr).forEach((key) => paramStr.push(`${key}=${paramArr[key]}`));
  paramStr = paramStr.join("&");
  const signWordArray = HmacSHA1(paramStr, CLIENT_SECRET);
  const sign = Base64.stringify(signWordArray);
  return {
    sign,
    ts,
    ttl,
    uid: CLIENT,
    ...paramArr,
  };
};

export default {
  getSign,
};
