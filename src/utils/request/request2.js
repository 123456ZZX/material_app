/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-01 11:53:07
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2022-05-10 17:45:37
 * @Description: 封装axios
 */
import axios from "axios";
import { resetMessage, confirmHandler } from "../message";
// import Qs from 'qs' //qs一般装了axios就自带不用再装，如果没有，自己安装下
import router from "../../permission";
import store from "@/store";
import { REMOVE_PERMISSION_QUEUE } from "@/store/Mutation/mutationTypes.js";
import {
  PERMISSION_QUEUE,
  PORTAL,
  DATA_SAFE,
} from "@/store/State/stateTypes.js";
import * as types from "@/store/Getter/getterTypes.js";
import { getUTCStr, matchTimeToUTC, matchUTCToTime } from "../timezone";
import { getSign } from "@/utils/request/sign";
import API from "@/config/api";
import { encrypt, decrypt } from "./encrypt";
import { verifyRequest, verifyResponse, verifyUrl } from "./verify";
import storage from "@/utils/storage";
import { SM4Encrypt } from "@/utils/encryption/sm4";
import Vue from "vue";

// 是否解密响应
const responseEncryptMap = new Map();

// create an axios instance
const request = axios.create({
  baseURL: "/xaiot", // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  // transformRequest: [function (data) {
  //   data = Qs.stringify(data) //序列化参数
  //   return data
  // }],
  timeout: 50000, // request timeout,
});

// request interceptor
request.interceptors.request.use(
  (config) => {
    let portalId = store.state.portal.id;
    config.headers["PortalId"] = portalId;
    let FawkesBiz = {};
    // 通过请求头传递时区
    if (store.getters[types.TIMEZONE]) {
      let UTC = getUTCStr(store.getters[types.TIMEZONE]);
      FawkesBiz.timeZone = UTC;
      FawkesBiz.timeFormat = "yyyy-MM-dd HH:mm:ss";
      // 将数据中HH:mm这类时区转为UTC存储
      if (UTC !== "UTC+08:00") {
        if (config.data && !(config.data instanceof FormData)) {
          config.data = JSON.parse(matchTimeToUTC(JSON.stringify(config.data)));
        }
        if (config.params) {
          config.params = JSON.parse(
            matchTimeToUTC(JSON.stringify(config.params))
          );
        }
      }
    }

    if (store.getters[types.MULTI_PORTAL] && store.state[PORTAL]) {
      FawkesBiz.portalId = store.state[PORTAL].id;
    }

    //子应用适配
    let currentStore = Vue.prototype.$InQianKun
      ? Vue.prototype.$fksMainStore
      : store;
    //请求头定位权限
    if (currentStore) {
      const arr = Array.from(currentStore.state[PERMISSION_QUEUE]);
      const currentButton = arr.find((permission) => {
        return permission.url == config.url;
      });

      if (currentButton) {
        currentStore.commit(REMOVE_PERMISSION_QUEUE, currentButton);
        FawkesBiz.buttonId = currentButton.id;
      }
    }
    const len = config.url.indexOf("?");
    const subUrl =
      (len > -1
        ? config.url.substring(config.url.indexOf("/", 1), len)
        : config.url.substring(config.url.indexOf("/", 1))) || config.url;
    const requestEncrypt =
      verifyRequest(config) && store.state[DATA_SAFE].requestEncrypt;
    const responseEncrypt =
      verifyResponse({ config }) && store.state[DATA_SAFE].responseEncrypt;
    const apiCrypto = {
      requestEncrypt: {
        encrypt: requestEncrypt,
        ignoreUrl: requestEncrypt ? "" : subUrl,
      },
      responseEncrypt: {
        encrypt: responseEncrypt,
        ignoreUrl: responseEncrypt ? "" : subUrl,
      },
    };
    FawkesBiz = { ...FawkesBiz, apiCrypto };
    responseEncryptMap.set(config.url, apiCrypto.responseEncrypt.encrypt);
    config.headers["Fawkes-Biz"] = SM4Encrypt(JSON.stringify(FawkesBiz));
    verifyUrl(config, "sign")
      ? (config.params = getSign(config.params))
      : (config.headers["Fawkes-Auth"] = `${storage.get("access_token")}`);

    apiCrypto.requestEncrypt.encrypt &&
      !apiCrypto.requestEncrypt.ignoreUrl &&
      (config = encrypt(config));

    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

// response interceptor
request.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    responseEncryptMap.get(response.config.url) &&
      (response = decrypt(response));

    if (response.config.responseType == "blob") {
      return response;
    }

    let res = response.data;

    if (verifyUrl(response.config, "cMsg")) {
      return res;
    }
    if (!res.code) {
      return res;
    }
    if (200 !== res.code) {
      res.message && resetMessage.warning(res.message);
      return Promise.reject(response);
    }

    // 将数据中HH:mm这类UTC-8时区转为当前时区
    if (res.data && getUTCStr(store.getters[types.TIMEZONE]) !== "UTC+08:00") {
      res.data = JSON.parse(matchUTCToTime(JSON.stringify(res.data)));
    }

    // if the custom code is not 20000, it is judged as an error.
    return res;
  },

  (error) => {
    let message = "";
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = "错误请求";
          break;
        case 401:
          switch (error.response.data.code) {
            case -8000160:
              {
                confirmHandler(
                  "无证书提示",
                  error.response.data.message,
                  (action) => {
                    router.push({
                      path: "/activate",
                      query: { keepOrigin: true },
                    });
                  }
                );
              }
              break;
            case -8000150:
              {
                message = error.response.data.message;
              }
              break;
            default: {
              storage.remove("access_token");
              message = error.response.data.message;
              storage.set("redirect", 1);
              router.push({ path: "/login", query: { keepOrigin: true } });
            }
          }
          break;
        case 403:
          message = "拒绝访问";
          break;
        case 404:
          message = "请求错误,未找到该资源";
          break;
        case 405:
          message = "请求方法未允许";
          break;
        case 408:
          message = "请求超时";
          break;
        case 500:
          message = "服务器端出错";
          break;
        case 501:
          message = "网络未实现";
          break;
        case 502:
          message = "网络错误";
          break;
        case 503:
          message = "服务不可用";
          break;
        case 504:
          message = "网络超时";
          break;
        case 505:
          message = "http版本不支持该请求";
          break;
        default:
          message = `连接错误${error.response.status}`;
      }
      if (error.response.config && verifyUrl(error.response.config, "cMsg")) {
        message = null;
      }
    }
    message && resetMessage.error(message);
    return Promise.reject(error);
  }
);

export default request;
