<!--
 * @Description: 
 * @Author: ye_xf
 * @Date: 2022-05-25 09:33:30
 * @LastEditTime: 2022-06-22 08:51:43
 * @LastEditors: Please set LastEditors
 * @Reference: 
-->

<!--
 * @Author: gao_m3
 * @Date: 2022-05-06 10:21:21
 * @LastEditors: ye_xf
 * @LastEditTime: 2022-05-24 16:49:08
 * @Descripttion: 
-->

<template>
  <div class="file-preview-box">
    <!-- 文件列表 -->
    <div v-if="fileList.length" class="file-list">
      <div v-for="(item, index) in fileList" :key="item.fileToken" class="item">
        <!-- 图片 -->
        <template v-if="getFileType(item) === 'image'">
          <img :src="item.src" @click="preview(index)" />
        </template>
        <!-- 视频 -->
        <template v-else-if="getFileType(item) === 'video'">
          <div class="icon-box" @click="preview(index)">
            <i class="fm-icon fm-icon-play-circle-o"></i>
          </div>
        </template>
        <!-- 其它 -->
        <template v-else></template>
      </div>
    </div>
    <!-- 预览 -->
    <fm-overlay
      v-if="fileList.length && isPreview"
      :show="true"
      class="overlay"
      @click="isPreview = false"
    >
      <img
        v-if="fileList[activeIndex].type === 'image'"
        :src="fileList[activeIndex].src"
        @click.stop="() => {}"
      />
      <video
        v-else-if="fileList[activeIndex].type === 'video'"
        :src="fileList[activeIndex].src"
        controls
        @click.stop="() => {}"
      ></video>
    </fm-overlay>
  </div>
</template>

<script>
import { getUrl } from '@/utils/sign'

import { getFileList } from './api'

export default {
  name: 'filePreview',
  components: {},
  props: {
    //文件组 token
    groupToken: {
      type: String,
      default: '',
    },
    //文件token数组
    tokenList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      fileList: [],
      imageTypeList: ['jpg', 'jpeg', 'png'],
      videoTypeList: ['mp4', 'avi', ''],
      isPreview: false,
      activeIndex: 0,
    }
  },
  computed: {},
  watch: {},
  methods: {
    getImageSrc(fileToken) {
      let downloadUrl =
        process.env.VUE_APP_BASE_URL + '/sys-storage/download_image'
      return downloadUrl + `?f8s=${fileToken}`
    },
    getFileSrc(fileToken) {
      if (!fileToken) {
        return ''
      }

      let URL = process.env.VUE_APP_BASE_URL + '/sys-storage/download'

      return URL + '?' + getUrl({ f8s: fileToken })
    },
    //根据文件后缀，返回文件类型
    getFileType(data) {
      const suffix = data.extName.toLowerCase() //统一转换为小写

      if (this.imageTypeList.includes(suffix)) {
        data.type = 'image'
        data.src = this.getImageSrc(data.fileToken)
        return 'image'
      } else if (this.videoTypeList.includes(suffix)) {
        data.type = 'video'
        data.src = this.getFileSrc(data.fileToken)
        return 'video'
      } else {
        return 'file'
      }
    },
    init() {
      if (this.groupToken && this.tokenList.length) {
        return
      }

      if (this.groupToken) {
        const data = {
          g9s: [this.groupToken],
        }

        getFileList(data).then((res) => {
          if (res.status) {
            this.fileList = res.data
          }
        })

        return
      }

      if (this.tokenList.length) {
        getFileList({ f8s: this.tokenList }).then((res) => {
          if (res.status) {
            this.fileList = res.data
          }
        })

        return
      }
    },
    preview(index) {
      this.activeIndex = index
      this.isPreview = true
    },
  },
  created() {
    this.init()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
.file-preview-box {
  //文件列表
  .file-list {
    display: flex;
    flex-wrap: wrap;

    .item {
      width: 148px;
      height: 148px;
      margin: 16px;
      border-radius: 3px;
      overflow: hidden;

      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .icon-box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  //预览
  .overlay {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: auto;
      max-height: 80%;
      object-fit: contain;
    }

    video {
      width: 100%;
      height: auto;
      max-height: 80%;
    }

    // .swipe-box {
    //   width: 100%;
    //   height: 600px;

    //   .swipe-item {
    //     width: 100%;
    //     height: 100%;

    //     img {
    //       width: 100%;
    //       height: 100%;
    //       object-fit: contain;
    //     }

    //     video {
    //       width: 100%;
    //       height: 100%;
    //     }
    //   }
    // }
  }
}
</style>