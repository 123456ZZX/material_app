<!--
 * @Author: your name
 * @Date: 2021-08-19 15:22:48
 * @LastEditTime: 2022-03-31 11:40:30
 * @LastEditors: wei_jt@ecidi.com
 * @Description: In User Settings Edit
 * @FilePath: \central-system\src\components\PreView\index.vue
-->
<template>
  <div v-loading="loading" class="owa_container">
    <iframe
      id="pdf_frame"
      ref="preview"
      allowfullscreen="true"
      allowtransparency="true"
      name="pdf_frame"
      class="pdf_frame"
      :src="PreViewURL"
    ></iframe>
  </div>
</template>

<script>
import { getFile } from '@/api/file'
import { getSign } from '@/utils/request/sign.js'
import { getAbsoluteUrl } from '@/utils/util.js'

import { CLIENT, TTL } from '@/config'
import dayjs from 'dayjs'

export default {
  name: 'KKPreview',
  props: {
    fileToken: String
  },
  computed: {},
  data() {
    return {
      loading: false,
      PreViewURL: '',
      file: {},
      iframeStyle: {}
    }
  },
  methods: {
    getFileData() {
      this.loading = true
      getFile({ f8s: [this.fileToken] })
        .then((res) => {
          if (res.data[0]) {
            this.file = res.data[0]
            this.initData()
          }
        })
        .catch((error) => {
          this.loading = false
        })
    },
    initData() {
      this.PreViewURL = ''
      let Base64 = require('js-base64').Base64
      if (this.file.fileToken && this.file.fileName) {
        let sign = getSign({
          f8s: this.file.fileToken,
          fullfilename: this.file.fileName
        }).sign
        const Dvalue = () => {
          return `${this.$storage.get('ts-D-value')}` == 'null'
            ? 0
            : new Number(`${this.$storage.get('ts-D-value')}`)
        }
        let previewDowloadUrl = getAbsoluteUrl(this.VUE_APP_DOWNLOAD_API)
        let url = `${previewDowloadUrl}?f8s=${
          this.file.fileToken
        }&fullfilename=${
          this.file.fileName
        }&sign=${sign}&ttl=${TTL}&uid=${CLIENT}&ts=${dayjs().unix() + Dvalue()}`
        let encodeURL = encodeURIComponent(Base64.encode(url))
        this.PreViewURL = getAbsoluteUrl(this.VUE_APP_PREVIEW_API) + encodeURL
        this.previewloading()
      }
    },
    previewloading() {
      let previews = this.$refs.preview
      const that = this
      if (previews.attachEvent) {
        // 兼容浏览器判断
        previews.attachEvent('onload', function () {
          that.loading = false
        })
      } else {
        previews.onload = function () {
          that.loading = false
        }
      }
    }
  },
  watch: {
    fileToken: {
      deep: true,
      immediate: true,
      handler: function () {
        this.getFileData()
      }
    }
  },
  mounted() {}
}
</script>

<style scoped>
.owa_container {
  width: 100%;
  height: 100%;
  border: none;
}

#pdf_frame {
  display: flex;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
