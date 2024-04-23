<!--
 * @Author: xie_sm
 * @Date: 2022-02-28 16:07:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-16 15:40:47
 * @FilePath: \mobile-template\src\App.vue
 * @Description:
 *
-->
<template>
  <div id="app" ref="app">
    <transition name="fade">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" class="router"></router-view>
      </keep-alive>
    </transition>
    <transition name="fade">
      <router-view v-if="!$route.meta.keepAlive" class="router"></router-view>
    </transition>
  </div>
</template>
<script>
/* eslint-disable no-undef */
// 该组件需要和真机交互，会出现原生 API 未定义的情况，故全局应用屏蔽 no-undef 规则
import { loadLanguageAsync, getLangConfig } from '@/utils/locale' //引入获取系统语言的方法
import { Toast } from 'fawkes-mobile-lib'
import {
  clickOther,
  scroll,
  getScrollTop,
  getScrollHeight,
  getWindowHeight,
} from '@/utils/monitor'
import { LANG_FROM_KEY } from '@/common/constant'
import { SET_STATUS_BAR_HEIGHT } from '@/store/Mutation/mutationTypes'
import { mapGetters } from 'vuex'
import { GET_ENUM } from '@/store/Action/actionTypes'

export default {
  components: {
    [Toast.name]: Toast,
  },
  data() {
    return {
      statusBarHeight: null,
      needUpdate: true,
      toast1: null,
      toast2: null,
    }
  },
  computed: {
    ...mapGetters(['isLogin']),
  },
  watch: {
    $route(to) {
      if (typeof yuanchu != 'undefined') {
        yuanchu?.statusBar?.getStatusBarHeight((res) => {
          this.$store.commit(SET_STATUS_BAR_HEIGHT, res)
          if (to.path == '/index') {
            yuanchu.statusBar.styleLightContent()
          } else {
            yuanchu.statusBar.styleDefault()
            this.$refs.app.style.setProperty('--height', res + 'px')
          }
        })
      }
    },
  },
  async created() {
    this.onLoad()
    // 字典查询
    await this.$store.dispatch(GET_ENUM)
  },
  mounted() {
    window.addEventListener('click', clickOther, true)
    window.addEventListener('scroll', this.triggerScrol, true)
    // 获取手机系统语言，同步切换语言
    const language = getLangConfig()
    // TODO: 考虑是否有必要存储在localstorage，后期优化调整点
    this.$storage.set('i18nLocale', language)
    this.$i18n.locale = language
    LANG_FROM_KEY.map((item) => {
      if (item.key == this.$i18n.locale) {
        this.$i18n.locale = item.key
        // loadLanguageAsync(item.key, item.locale, this)
      }
    })
    // iframe文件下载（downloadUrl = https://xionganwater.cn/api/sys-storage/download?f8s=481c0353dd6e3e7fae4e8a27a5f3c5c2）
    window.outWorkFileDownload = (downloadUrl, fileName) => {
      console.log('-------------------------------------------------------------');
      const fileTransfer = new yuanchu.fileTransfer();
      const downUrl = downloadUrl;
      const fileUrl = yuanchu.fileSystemPaths.file.cacheDirectory + fileName; // 文件存储路径
      console.log('下载地址', downUrl);
      console.log('文件存储路径', fileUrl);
      fileTransfer.download(
        downUrl,
        fileUrl,
        (entry) => {
          console.log('下载成功', entry);
          // this.$toast(entry.toURL());
          // this.fileUri = entry.toURL();
          // this.preview(entry.toURL(), '');
          entry.file((data) => {
            console.log(data);
            // 使用默认应用打开文件
            yuanchu.fileOpener2.open(entry.toURL(), data.type, {
              success: function () {
                return
              },
              error: function (err) {
                console.error(err)
              },
            })
          })
        },
        (err) => {
          console.log('下载失败', err);
        },
        false,
        {
          headers: {
            'Fawkes-Auth': this.$storage.get('access_token'),
          },
        }
      );
    },
    // 设置全局函数监听iframe的postMessage事件
    window.addEventListener('message', (e) => {
        // console.log('接收到iframe的postMessage事件', e)
        // e.data = {
        //   "fileUrl": "https://xionganwater.cn/api/sys-storage/download?f8s=e4c3022686ae7b989be3978e8155fa26",
        //   "uid": "u9rdYLyvQqNbRJVViMRswEkr1XrKduK7",
        //   "url": "https://xionganwater.cn/api/sys-storage/download?f8s=e4c3022686ae7b989be3978e8155fa26",
        //   "name": "测试下载.pdf",
        //   "fileId": "e4c3022686ae7b989be3978e8155fa26",
        //   "fileSize": 728023,
        //   "fileType": "pdf",
        //   "error": false,
        //   "progress": 100
        //   "type": "outWorkFileDownload",
        // }
        if (e.data?.type == 'outWorkFileDownload') {
          window.outWorkFileDownload(e.data.url, e.data.name)
        }
    })
  },
  beforeDestroy() {
    window.removeEventListener('storage', function () {})
  },
  methods: {
    // 页面加载后添加各事件监听
    onLoad() {
      document.addEventListener('deviceready', this.onDeviceReady, false)
    },
    // Cordova加载完毕
    onDeviceReady() {
      if (typeof yuanchu != 'undefined') {
        yuanchu.statusBar.styleDefault()
        yuanchu.statusBar.getStatusBarHeight((res) => {
          this.$storage.set('statusBarHeight', res)
          console.log('statusBarHeight: ', statusBarHeight)
        })
      }
      //极光推送初始化
      // this.initJPush()

      //判断是否需要热更新
      // document.addEventListener(
      //   'chcp_nothingToUpdate',
      //   this.nothingToUpdate,
      //   false
      // )
      //有些项目不需要热更新
      // if (this.needUpdate) {
      //   // this.$loading.show({ title: '检查更新中' })
      //   this.toast1 = Toast.loading({
      //     message: '检查更新中',
      //     duration: 0,
      //     overlay: true,
      //     forbidClick: true,
      //     loadingType: 'spinner',
      //   })
      //   yuanchu.chcp.fetchUpdate(this.fetchUpdateCallback)
      // }
      document.addEventListener('chcp_beforeDownload', this.beforeDownload, false);
      yuanchu.chcp.fetchUpdate(this.fetchUpdateCallback)
      // main.js中定义$back
      document.addEventListener('backbutton', this.$back, false) // 默认返回上一级路由，其他情况自行处理
    },
    initJPush() {
      // console.log('mmmmmmmmmmmmmmmcl:JPush')
      window.JPush.setDebugMode(true)
      window.JPush.init()
      this.getRegistrationID()
      document.addEventListener(
        'jpush.receiveNotification',
        this.onReceiveNotification,
        false
      )
      document.addEventListener(
        'jpush.openNotification',
        this.onOpenNotification,
        false
      )
      document.addEventListener(
        'jpush.receiveMessage',
        this.onReceiveMessage,
        false
      )
    },
    onReceiveNotification(event) {
      try {
        var alertContent
        if (yuanchu.device.platform == 'Android') {
          alertContent = event.alert
        } else {
          alertContent = event.aps.alert
        }
        // alert('接受到消息通知: ' + alertContent)
      } catch (exception) {
        console.log(exception)
      }
    },
    onOpenNotification(event) {
      try {
        var alertContent
        if (yuanchu.device.platform == 'Android') {
          alertContent = event.alert
        } else {
          alertContent = event.aps.alert
        }
        // alert('用户点击消息通知: ' + alertContent)
      } catch (exception) {
        console.log('JPushPlugin:onOpenNotification' + exception)
      }
    },
    onReceiveMessage(event) {
      try {
        var message
        if (yuanchu.device.platform == 'Android') {
          message = event.message
        } else {
          message = event.content
        }
        // alert('接受到消息: ' + message)
      } catch (exception) {
        console.log('JPushPlugin:onReceiveMessage-->' + exception)
      }
    },
    getRegistrationID() {
      window.JPush.getRegistrationID(this.onGetRegistrationID)
    },
    onGetRegistrationID(data) {
      try {
        console.log('JPushPlugin:registrationID is ' + data)
        if (data.length == 0) {
          // 如果获取到为空，重新获取
          var t1 = window.setTimeout(this.getRegistrationID, 1000)
        }
        console.log('registrationID: ' + data)
      } catch (exception) {
        console.log(exception)
      }
    },
    beforeDownload() {
      console.log("即将开始下载热更新！");
      this.toast1 = Toast.loading({
        message: '检查更新中',
        duration: 0,
        overlay: true,
        forbidClick: true,
        loadingType: 'spinner',
      })      
    },
    //无热更新
    nothingToUpdate() {
      this.needUpdate = false
    },
    fetchUpdateCallback(error, data) {
      if (error) {
        //没更新
        // this.$loading.hide()
        this.toast1.clear()
        Toast('当前版本已是最新版本')
        console.log('error', JSON.stringify(error))
        console.log('data', JSON.stringify(data))
        if (error.code == 2) {
        } else if (error.code == -2) {
          Toast('您的App版本过低，请升级')
          //您的App原生框架版本过低，请升级
        } else {
          //根据error.code对获取更新结果做提示用户、重新调用更新检查方法等其他额外处理
        }
      } else {
        this.toast1.clear()
        this.toast2 = Toast.loading({
          message: '更新中',
          duration: 0,
          overlay: true,
          forbidClick: true,
          loadingType: 'spinner',
        })
        //检查更新正常，开始安装更新
        yuanchu.chcp.installUpdate(this.installationCallback)
      }
    },
    installationCallback(error) {
      if (error) {
        // this.$loading.hide()
        this.toast2.clear()
        Toast.error({
          message: '更新失败',
          duration: 2000,
        })
        //根据error.code对安装更新异常做提示用户、重新调用安装更新方法等其他额外处理
      } else {
        this.toast2.clear()
        Toast.success({
          message: '更新完成',
          duration: 2000,
        })
        // this.$loading.hide()
      }
    },
    triggerScrol() {
      if (Math.round(getScrollTop() + getWindowHeight()) == getScrollHeight()) {
        scroll()
      }
    },
  },
}
</script>
<style lang="less" scoped>
#app {
  height: calc(100vh - constant(safe-area-inset-bottom));
  height: calc(100vh - env(safe-area-inset-bottom));
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  //ios底部适配

  padding-bottom: constant(safe-area-inset-bottom); //兼容 IOS<11.2

  padding-bottom: env(safe-area-inset-bottom); //兼容 IOS>11.2
}
/deep/.fm-nav-bar {
  padding-top: var(--height);
}
/deep/.fm-list__finished-text {
  padding-bottom: var(--height);
}
</style>
