<template>
  <div id='container' :style="{ marginTop: `${statusBarHeight}px` }">
  </div>
</template>
<script>
import axios from 'axios';
import { getWindowHeight } from "@/utils/monitor.js";
export default {
  data() {
    return {
      accessToken: this.$storage.get('access_token'),
      formToken: '',
      statusBarHeight: 0,
      iframeHeight: 0
    }
  },
  computed: {
    url() {
      if (this.$route.query.id) {
        //查看/处理 工单页
        return  process.env.VUE_APP_WPG_URL + '/outworkApp/#/pages/ticket/detail/index?id=' + this.$route.query.id + '&sysCode=outwork&token=' + this.formToken
      } else {
        return process.env.VUE_APP_WPG_URL + '/outworkApp/#/pages/index/form?templateCode=dispatch_template&sysCode=outwork&token=' + this.formToken
      }
    }
  },
  created() {
    window.addEventListener('message', this.callBack)
    this.getStatusBarHeight()
    this.getFormToken()
  },
mounted(){
 
},
beforeDestroy() {
  window.removeEventListener('message', this.callBack)
},
  methods: {
    callBack(e) {
      if (e.data.data.name == 'navigateBack') {
        this.$router.go(-1);
      }
    },
    getStatusBarHeight() {
        this.statusBarHeight = this.$storage.get('statusBarHeight')
        this.iframeHeight = this.statusBarHeight ? `${getWindowHeight() - this.statusBarHeight}px` : `${getWindowHeight()}px`
    },
    handleMessage() { },
    getFormToken() {
      axios({
        url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/userCenterApi/sso/tokenByToken',
        method: 'post',
        params: {
          token: this.accessToken
        },
        headers: {
          'Authorization': 'Basic b3V0d29yazp3cGcyMDIw'
        }
      }).then(res => {
        if (res.status == 200) {
          this.formToken = res.data.resultData.token
          this.createEle()
        }
      })
    },
    createEle() {
      let ele = document.createElement('iframe')
      ele.src = this.url
      ele.style.height = this.iframeHeight
      ele.style.width = '100%'
      ele.style.border = 'none'
      let node = document.getElementById('container')
      node.appendChild(ele)
    }
  }
}
</script>
<style lang="scss" scoped>
#container {
  height: 100vh;
  width: 100%;
}
</style>