/*
 * @Author: xie_sm
 * @Date: 2022-03-03 11:47:41
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-03-10 16:21:27
 * @FilePath: \mobile-template\src\components\loading\loading.js
 * @Description:
 *
 */
import Loading from "./Loading.vue";

const loading = {
  install: (Vue) => {
    const LoadingConstructor = Vue.extend(Loading);
    const instance = new LoadingConstructor();

    instance.$mount(document.createElement("div"));
    document.body.appendChild(instance.$el);

    Vue.prototype.$loading = {
      // 设置默认值，图标为环形，颜色为#1989fa,标题为加载中...
      show: (
        { title, type, color } = { title: "加载中...", type: "circular", color: "#1989fa" }
      ) => {
        instance.show = true;
        instance.title = title || instance.title;
        instance.type = type || instance.type;
        instance.color = color || instance.color;
      },
      hide: () => {
        instance.show = false;
      },
    };
  },
};

export default loading;
