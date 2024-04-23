module.exports = {
  plugins: {
    // postcss-pxtorem 插件的版本需要 >= 5.0.0
    autoprefixer: {
      overrideBrowserslist: ["Android >= 4.0", "iOS >= 7"],
    },
    "postcss-pxtorem": {
      // 参考官方设置 https://youzan.github.io/vant/#/zh-CN/advanced-usage
      // 配置根字体大小,fawkes-mobile-lib组件保持原来配置
      // 注意：项目模块路径中不要出现fawkes-mobile-lib,以免配置失效
      rootValue({ file }) {
        return file.indexOf("fawkes-mobile-lib") !== -1 ? 37.5 : 75;
      },
      propList: ["*"],
    },
  },
};
