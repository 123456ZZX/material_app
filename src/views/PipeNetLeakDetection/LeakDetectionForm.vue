<template>
  <div id="LeakDetectionForm" :style="{ marginTop: `${statusBarHeight}px` }">
    <!-- <fm-nav-bar v-if="$route.query.id" left-arrow @click-left="$router.go(-1)"> </fm-nav-bar> -->
  </div>
</template>
<script>
import axios from 'axios'
import API from '@/common/config.js'
import { getWindowHeight } from '@/utils/monitor.js'
export default {
  name: 'LeakDetectionForm',
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
      if (this.$route.query.id) {
        // 查看工单页
        return (
          process.env.VUE_APP_WPG_URL +
          '/outworkApp/#/pages/ticket/detail/index?id=' +
          this.$route.query.id +
          '&sysCode=outwork' +
          '&token=' +
          this.formToken
        )
      } else {
        // 创建工单页（网页端）
        // return 'http://172.20.79.70/outwork/iframe.html#/creator?templateCode=pipe_leak_template&sysCode=outwork&hideMenu=1&hideMultiTab=1&token=0359f6a1-515a-4393-ba81-829f90fdbce7&formValue=%7B%22title%22%3A%22%E5%B7%A5%E5%8D%95%E6%A0%87%E9%A2%98%22,%22priority%22%3A%221%22,%22deviceType%22%3A%5B%220%22,%221%22%5D,%22deviceCode%22%3A%22001%22,%22ticketAddress%22%3A%7B%22address%22%3A%22%E4%B8%8A%E6%B5%B7%22,%22point%22%3A%7B%22lat%22%3A%220%22,%22lng%22%3A%220%22%7D%7D%7D'
        // 创建工单页（移动端）
        // http://172.20.79.70/outworkApp/#/pages/index/form?templateCode=pipe_leak_template&sysCode=outwork&token=28c912ea-0220-4ce3-8c99-3749cd39c95d&formValue=%7B%22title%22%3A%22%E5%B7%A5%E5%8D%95%E6%A0%87%E9%A2%98%22%2C%22priority%22%3A%221%22%2C%22deviceType%22%3A%5B%220%22%2C%221%22%5D%2C%22deviceCode%22%3A%22001%22%2C%22ticketAddress%22%3A%7B%22address%22%3A%22%E4%B8%8A%E6%B5%B7%22%2C%22point%22%3A%7B%22lat%22%3A%220%22%2C%22lng%22%3A%220%22%7D%7D%7D
        let deviceCodeZ = (this.$route.query.properties?.start_code || '') + '~' + (this.$route.query.properties?.end_code || '')
        let depthZ = (this.$route.query.properties?.start_depth || '') + '~' + (this.$route.query.properties?.end_depth || '')
        let params = {
          title: '', // 工单标题
          priority: '', // 优先级 0紧急 1优先 2一般
          deviceName: '', // 操作对象名称
          deviceType: '', // 业务类型
          deviceCode: deviceCodeZ == '~' ? '' : deviceCodeZ,

          caliberSectionSize:
            this.$route.query.properties?.caliber_section_size ||
            this.$route.query.properties?.section_data1 ||
            '', // 管径
          material: this.$route.query.properties?.material || '', // 管材

          depth: depthZ == '~' ? '' : depthZ,
          ticketAddress: {
            address:
              this.$route.query.properties?.road_name ||
              this.$route.query.properties?.plant_address ||
              '', // 地点
            point: this.$route.query.lngLat, // 经纬度
          },
          taskId: this.$route.query.taskId,
        }
        // let encodeURIFormValue = encodeURIComponent(JSON.stringify(formValue))
        return (
          process.env.VUE_APP_WPG_URL +
          '/outworkApp/#/pages/index/form?templateCode=pipe_leak_template&sysCode=outwork&token=' +
          this.formToken +
          '&formValue=' +
          encodeURIComponent(JSON.stringify(params))
        )
      }
    },
  },
  beforeDestroy() {
    // 移除返回上一级的监听
    window.removeEventListener('message', this.goToMapPage)
  },
  mounted() {
    this.statusBarHeight = this.$storage.get('statusBarHeight')
    this.iframeHeight = this.statusBarHeight
      ? `${getWindowHeight() - this.statusBarHeight}px`
      : `${getWindowHeight()}px`
    // 返回上一级监听
    window.addEventListener('message', this.goToMapPage)
    console.log(this.$route.query.properties)
    console.log(this.$route.query.lngLat)
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
  methods: {
    goToMapPage(e) {
      if ((e.data.name = 'navigateBack')) {
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      }
      console.log('提交工单返回信息', e.data)
    },
    createEle() {
      let ele = document.createElement('iframe')
      console.log('this.formToken: ', this.formToken)
      console.log('this.url: ', this.url)
      ele.src = this.url
      ele.style.height = this.iframeHeight
      ele.style.width = '100%'
      ele.style.border = 'none'
      let node = document.getElementById('LeakDetectionForm')
      node.appendChild(ele)
    },
  },
}
</script>
<style lang="scss" scoped>
#LeakDetectionForm {
  height: 100vh;
  width: 100%;
}
</style>
