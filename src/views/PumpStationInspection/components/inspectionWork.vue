<template>
  <div class="webView" :style="{ marginTop: `${statusBarHeight}px` }">
    <iframe :src="url" id="webView" width="100%" :height="iframeHeight"></iframe>
  </div>
</template>

<script>
import { getWindowHeight } from '@/utils/monitor'
export default {
  data() {
    return {
      url: '',
      statusBarHeight: 0,
      iframeHeight: 0,
    }
  },

  created() {
    this.url = this.$route.query.url
  },
  mounted() {
    this.getStatusBarHeight()
  },

  methods: {
    getStatusBarHeight() {
      if (typeof yuanchu != 'undefined') {
        yuanchu.statusBar.getStatusBarHeight((res) => {
          console.log('height', res)
          this.statusBarHeight = res

          this.iframeHeight = `${getWindowHeight() - res}px`
        })
      } else {
        this.iframeHeight = `${getWindowHeight()}px`
      }
    },
  },
}
</script>

<style scoped lang="scss">
.webView {
  height: 100%;
}
</style>
