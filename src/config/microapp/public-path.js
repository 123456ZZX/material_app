/*
 * @Description: webpack动态加载，需要在main.js最顶端引入
 * @Version: 1.0
 * @Autor: chen_yt
 * @Date: 2021-12-09 08:33:31
 * @LastEditors: chen_yt
 * @LastEditTime: 2022-01-24 14:19:46
 */
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
