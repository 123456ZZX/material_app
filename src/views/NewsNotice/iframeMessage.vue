<template>
  <div id="iframeBoxStyle" :style="{ marginTop: `${statusBarHeight}px` }"></div>
</template>
<script>
import axios from 'axios'
import { getWindowHeight } from '@/utils/monitor.js'
export default {
  name: 'iframeBoxStyle',
  data() {
    return {
      accessToken: this.$storage.get('access_token'),
      formToken: '',
      statusBarHeight: 0,
      iframeHeight: 0,
    }
  },
  computed: {
    url() {
      if (this.$route.query?.src) {
        // 查看工单页
        return this.$route.query.src + '&sysCode=outwork' + '&token=' + this.formToken
      }
    },
  },
  mounted() {
    this.statusBarHeight = this.$storage.get('statusBarHeight')
    this.iframeHeight = this.statusBarHeight
      ? `${getWindowHeight() - this.statusBarHeight}px`
      : `${getWindowHeight()}px`
    // 返回上一级监听
    window.addEventListener('message', this.goBackPage)
    axios({
      url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/userCenterApi/sso/tokenByToken',
      method: 'post',
      params: {
        token: this.accessToken,
      },
      headers: {
        Authorization: 'Basic b3V0d29yazp3cGcyMDIw',
      },
    }).then((res) => {
      if (res.status == 200) {
        this.formToken = res.data.resultData.token
        this.createEle()
      }
    })
  },
  beforeDestroy() {
    // 移除返回上一级的监听
    window.removeEventListener('message', this.goBackPage)
  },
  methods: {
    goBackPage(e) {
      if ((e.data.name = 'navigateBack')) {
        setTimeout(() => {
          this.$router.go(-1)
        }, 100)
      }
    },
    createEle() {
      let ele = document.createElement('iframe')
      console.log('this.formToken: ', this.formToken)
      console.log('this.url: ', this.url)
      ele.src = this.url
      ele.style.height = this.iframeHeight
      ele.style.width = '100%'
      ele.style.border = 'none'
      let node = document.getElementById('iframeBoxStyle')
      node.appendChild(ele)
    },
  },
}
</script>
<style lang="scss" scoped>
#iframeBoxStyle {
  height: 100vh;
  width: 100%;
}
</style>
