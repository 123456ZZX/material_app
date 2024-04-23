<template>
  <div class="owa_container">
    <div v-if="fileType == PIC_FILE" ref="pic_frame" class="pic_frame">
      <img ref="pic_img" :src="picURL" class="pic_img" AutoSize:true />
    </div>
    <div v-if="fileType == PDF_FILE" class="pdf_frame" style="height: 100%">
      <iframe id="pdf_frame" name="pdf_frame" :src="pdfURL" />
    </div>
    <div v-if="fileType == VIDEO_FILE" class="video_frame" style="height: 100%">
      <div v-if="fileType == VIDEO_FILE" id="videoPlayer" ref="player" />
    </div>
    <!-- <div class="music_frame" v-if="fileType == MUSIC_FILE" style="height: 100%">
      <div id="musicPlayer" v-if="fileType == MUSIC_FILE" ref="player"></div>
    </div> -->
    <div v-if="fileType == ELSE_FILE" class="else_frame" style="height: 100%">
      <svg-icon :icon-class="getFileIconByExtName(extName)" class="else_icon" />
      <section style="text-align: center; min-height: 40px; line-height: 40px">
        {{ this.fileName }}
      </section>
    </div>
  </div>
</template>

<script>
import { getFileIconByExtName } from '@/utils/file'
import { downloadImage, getFile } from '@/api/file'
import { getFileAsPdf } from './api'
import { getUrl } from '@/utils/request/sign.js'
import Player from 'xgplayer'

export default {
  name: 'PreView',
  props: {
    fileToken: String,
  },
  data() {
    return {
      token: '',
      file: {},
      loading: false,
      extName: '',
      pdfSrc: '',
      picSrc: '',
      fileName: '',
      fileType: -1,
      downloadUrl: this.VUE_APP_BASE_API + '/sys-storage/download?',

      musicPlayer: null,
      videoPlayer: null,

      extTypePdf: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
      extTypePic: ['jpg', 'jpeg', 'png'],
      extTypeVideo: ['mp4', 'mkv', 'mp3'],
      // extTypeMusic: ['mp3'],

      NO_FILE: -1,
      PIC_FILE: 0,
      PDF_FILE: 1,
      ELSE_FILE: 2,
      VIDEO_FILE: 3,
      MUSIC_FILE: 4,
    }
  },
  computed: {
    pdfURL() {
      return `./static/pdfjs/viewer.html?file=${encodeURIComponent(this.pdfSrc)}`
    },
    picURL() {
      return this.picSrc
    },
    current_fileType() {
      return this.fileType
    },
  },
  watch: {
    fileToken: {
      deep: true,
      immediate: true,
      handler: function () {
        this.getFileData()
      },
    },
  },
  mounted() {},
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
    getFileIconByExtName(extName) {
      return getFileIconByExtName(extName)
    },
    /**
     * @description: 判断后缀类型
     */
    getFileType() {
      this.extName = ''
      //传入的文件可能没有extName,手动获取后缀
      if (!this.file.extName) {
        this.fileName = this.file.name
        let first = this.file.name.lastIndexOf('.')
        let namelength = this.file.name.length
        this.extName = this.file.name.substring(first + 1, namelength)
      } else {
        this.extName = this.file.extName
        this.fileName = this.file.fileName
      }
      if (this.extTypePdf.indexOf(this.extName) >= 0) {
        return this.PDF_FILE
      }
      if (this.extTypePic.indexOf(this.extName) >= 0) {
        return this.PIC_FILE
      }
      if (this.extTypeVideo.indexOf(this.extName) >= 0) {
        return this.VIDEO_FILE
      }
      // if (this.extTypeMusic.indexOf(this.extName) >= 0) {
      //   return this.MUSIC_FILE
      // }
      return this.ELSE_FILE
    },

    /**
     * @description: 处理pdf/可转化为pdf的文件
     * @param {String}token  文件的token
     */
    getPdfFile(token) {
      this.loading = true
      getFileAsPdf(token)
        .then((res) => {
          this.loading = false
          if (res.status) {
            let objecturl = window.URL.createObjectURL(res.data)
            this.pdfSrc = objecturl
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * @description: 处理图片
     * @param {String}token  图片的token
     */
    getPicFile(token) {
      this.loading = true
      //获得图片的接口,更改picURL
      downloadImage(token)
        .then((res) => {
          if (res.status) {
            let objecturl = window.URL.createObjectURL(res.data)
            this.picSrc = objecturl
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },

    mediaUrl(token) {
      let url = getUrl({ f8s: token })
      return this.downloadUrl + url
    },

    /**
     * @description: 初始化播放器，已存在时改变资源地址
     * @param {*} token
     */
    initVideoPlayer(token) {
      if (this.videoPlayer) {
        this.videoPlayer.src = this.mediaUrl(token)
        return
      }
      this.videoPlayer = new Player({
        id: 'videoPlayer',
        url: this.mediaUrl(token),
        lang: 'zh-cn',
        height: '100%',
        width: '100%',
        playbackRate: [0.5, 0.75, 1, 1.5, 2],
      })
    },

    // initMusicPlayer(token) {
    //   this.videoPlayer = new Music({
    //     id: 'musicPlayer',
    //     url: [{ src: JSON.parse(JSON.stringify(this.mediaUrl(token))) }],
    //     height: '100%',
    //     width: '100%'
    //   })
    // },
    clearPlayer() {
      if (this.videoPlayer) {
        this.videoPlayer.destroy()
        this.videoPlayer = null
      }
    },

    initState() {
      this.fileType = this.NO_FILE
    },

    initData() {
      this.initState()
      if (this.file.fileToken) {
        var token = this.file.fileToken
        this.token = token
        this.fileType = this.getFileType()
        if (this.fileType == this.PIC_FILE) {
          this.getPicFile(token)
        }
        if (this.fileType == this.PDF_FILE) {
          this.getPdfFile(token)
        }
        if (this.fileType == this.VIDEO_FILE) {
          this.$nextTick(() => {
            this.initVideoPlayer(token)
          })
        }
        // if (this.fileType == this.MUSIC_FILE) {
        //   this.$nextTick(() => {
        //     this.initMusicPlayer(token)
        //   })
        // }
        if (this.fileType == this.ELSE_FILE) {
          this.loading = false
          //this.$message.warning('暂不支持该类型文件预览！')
        }
      }
    },
  },
}
</script>

<style scoped>
.owa_container {
  display: block;
  width: 100%;
  margin: 0;
  height: calc(100%);
  border: none;
}
#pdf_frame {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
}
.pic_frame {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  text-align: center;
}
.pic_img {
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}
.else_icon {
  width: 100%;
  height: calc(100% - 40px);
}
</style>
