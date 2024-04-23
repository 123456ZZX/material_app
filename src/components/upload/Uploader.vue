<!--
 * @Author: xie_sm
 * @Date: 2022-02-28 16:07:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-22 08:50:15
 * @FilePath: \mobile-template\src\components\upload\Uploader.vue
 * @Description: 参考凤翎web端form-upload组件，demo可查看src\views\CommonOne\index.vue
 *
-->
<template>
  <div>
    <fm-field
      :name="name"
      :label="label"
      label-class="cus-label"
      :class="[
        'field-attachment',
        type === 'file' && fileList.length == 0 && !disabled
          ? 'no-upload-list'
          : '',
      ]"
    >
      <template #label v-if="type == 'file'">
        <!-- 提供该组件label插槽，其中按照移动端设计规范设置默认样式 -->
        <slot name="uploader-label">
          <div class="cus-label__div">
            <span>{{ previewLabel }}</span>
            <!--  点击文本触发的原生input上传事件 -->
            <div v-if="!disabled" @click="clickUpload">
              <span class="label-action">点击添加</span>
              <i class="fm-icon fm-icon-arrow"></i>
            </div>
          </div>
        </slot>
      </template>
      <template #input>
        <fm-uploader
          :after-read="afterRead"
          :before-read="beforeRead"
          v-model="fileList"
          :multiple="false"
          :accept="accept"
          :before-delete="removeFile"
          :disabled="disabled"
          :deletable="deletable"
          @click-preview="download"
          :show-upload="showUpload"
          :onClickUpload="onClickUpload"
          ref="relUploader"
          class="uploader"
          :preview-full-image="previewFullImage"
        >
          <!-- 提供修改上传区域的插槽 -->
          <slot name="upload-area" v-if="type == 'file'">
            <div></div>
          </slot>
          <span v-if="fileList.length == 0 && type === 'file' && disabled"
            >暂无附件</span
          >
          <!-- 自定义预览列表样式 -->
          <template #preview-list="previewFileList" v-if="type === 'file'">
            <slot name="upload-list" v-bind="fileList">
              <div
                v-for="(file, index) in previewFileList"
                :key="file.fileToken || file.fileId"
                class="preview-list-item"
                @click="download(file)"
              >
                <img :src="file.file.name | getFileIcon" class="file-icon" />
                <div class="file-info">
                  <span>{{ file.file.name }}</span>
                  <span>{{ file.file.size | calculateFileSize }}</span>
                </div>
                <span
                  class="delete-text"
                  @click="deleteFile(index)"
                  v-if="!disabled"
                  >删除</span
                >
              </div>
            </slot>
          </template>
          <template #preview-list v-else-if="fileList.length == 0 && disabled">
            <span>暂无附件</span>
          </template>
        </fm-uploader>
      </template>
    </fm-field>
  </div>
</template>
<script>
/* eslint-disable no-undef */
// 该组件需要和真机交互，会出现原生 API 未定义的情况，故全局应用屏蔽 no-undef 规则

import { Uploader, Toast, Button, Field } from 'fawkes-mobile-lib'
import { changeFileG9s, getFileToken } from '@/api/file'
import { uuid } from '@/utils/param'
import { isImage, downloadFile, calcFileSize } from '@/utils/file'
import request from '@/utils/request'
import axios from 'axios'

const cancelTokenObj = new Map()

export default {
  name: 'Uploader',
  components: {
    [Uploader.name]: Uploader,
    [Toast.name]: Toast,
    [Button.name]: Button,
    [Field.name]: Field,
  },
  filters: {
    calculateFileSize: function (val) {
      return calcFileSize(val)
    },
  },
  props: {
    // 文件groupToken
    value: {
      type: String,
      required: true,
      default: '',
    },
    // TODO: 文件上传数量限制，暂未使用
    limit: {
      type: Number,
      default: 1,
    },
    // 图片上传时的标签名称
    label: {
      type: String,
      default: '附件',
    },
    // 名称，提交表单的标识符
    name: {
      type: String,
      default: 'uploader',
    },
    // 开启自动上传
    autoUpload: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否展示删除按钮
    deletable: {
      type: Boolean,
      default: true,
    },
    // 是否显示上传区域
    showUpload: {
      type: Boolean,
      default: true,
    },
    // 上传类型，image或file
    type: {
      type: String,
      default: 'image',
    },
    // 图片多选限制数量，默认为9
    maxImagesCount: {
      type: Number,
      default: 9,
    },
    // 上传前的校验方法
    beforeRead: {
      type: Function,
      default: function () {
        return true
      },
    },
    // 允许预览，默认为true
    previewFullImage: {
      type: Boolean,
      default: true,
    },
    // 文件上传时标签名称
    previewLabel: {
      type: String,
      default: '附件',
    },
  },
  data: () => ({
    fileList: [],
    fileTokenList: [],
    // 是否需要请求文件资源
    needToGetFile: true,
    percent: 0,
  }),
  computed: {
    // 允许上传的文件类型
    accept() {
      return this.type == 'image' ? 'image/*' : '*'
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (!newVal) {
          this.fileTokenList = []
          this.fileList = []
          return
        } else if (this.needToGetFile) {
          let postData = {
            g9s: [newVal],
          }
          getFileToken(postData).then((res) => {
            if (res.status) {
              let fileTokenList = res.data
              const fileList = []
              fileTokenList.forEach((item) => {
                let isImageType = isImage(item.fileName)
                let fileItem = {
                  file: {
                    name: item.fileName,
                    size: item.size,
                  },
                  response: item,
                  isImage: isImageType,
                  fileToken: item.fileToken,
                }
                // 展示图片
                if (isImageType) {
                  fileItem.url = `${process.env.VUE_APP_BASE_URL}/sys-storage/download_image?f8s=${item.fileToken}`
                } else {
                  // 展示文件
                  fileItem.url = item.fileToken
                }

                fileList.push(fileItem)
                this.fileTokenList.push(item.fileToken)
              })
              this.fileList = fileList
              this.$emit('fileChange', {
                file: null,
                fileList,
                length: fileList.length,
              })
            }
          })
        }
      },
    },
  },
  methods: {
    setG9s() {
      if (this.fileTokenList.length) {
        const g9s = uuid()
        //将各文件的filetoken合并成grouptoken
        changeFileG9s(g9s, this.fileTokenList).then(() => {
          this.$emit('input', g9s)
        })
      } else {
        this.$emit('input', '')
      }
    },
    async afterRead(file) { // 文件上传完毕后会触发 after-read 回调函数，获取到对应的 file 对象。
      console.log('文件上传完毕', file);
      // 多选的情况下
      if (Array.isArray(file)) {
        console.log("多选的情况下", file);
        file.forEach((el) => this.afterRead(el))
        return;
      } else {
        console.log("单选的情况下", file);
        await compressImg(file.file, 0.2).then((res) => {
          console.log("压缩后的file", res);
          file.file = res.file; // 替换原来的file
        });
      }
      function compressImg(file, quality) {
        if (file[0]) {
          return Promise.all(Array.from(file).map(async (e) => await compressImg(e, quality))); // 如果是 file 数组返回 Promise 数组
        } else {
          return new Promise((resolve) => {
            const reader = new FileReader(); // 创建 FileReader
            reader.onload = ({ target: { result: src } }) => {
              const image = new Image(); // 创建 img 元素
              image.onload = async () => {
                const canvas = document.createElement("canvas"); // 创建 canvas 元素
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height); // 绘制 canvas
                const canvasURL = canvas.toDataURL("image/jpeg", quality);
                const buffer = atob(canvasURL.split(",")[1]);
                let length = buffer.length;
                const bufferArray = new Uint8Array(new ArrayBuffer(length));
                while (length--) {
                  bufferArray[length] = buffer.charCodeAt(length);
                }
                const miniFile = new File([bufferArray], file.name, {
                  type: "image/jpeg",
                });
                resolve({
                  file: miniFile,
                  origin: file,
                  beforeSrc: src,
                  afterSrc: canvasURL,
                  beforeKB: Number((file.size / 1024).toFixed(2)),
                  afterKB: Number((miniFile.size / 1024).toFixed(2)),
                });
              };
              image.src = src;
            };
            reader.readAsDataURL(file);
          });
        }
      }
      console.log('-----------------------------------------------------------------------------------');
      if (this.autoUpload) { // 如果是自动上传的情况下
        // 多选的情况下
        if (Array.isArray(file)) {
          file.forEach((el) => this.uploadFile(el))
        } else {
          this.uploadFile(file)
        }
      }
    },
    uploadFile(file) {
      console.log('进入上传文件函数');
      //文件读取完成后的回调函数
      file.status = 'uploading'
      let formData = new FormData()

      formData.append('file', file.file)

      // fileId用于标记文件，方便后续删除定位文件
      const fileId = uuid()
      file.fileId = fileId

      //生成取消请求的token,方便在handleRemove取消上传时结束请求
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      cancelTokenObj.set(fileId, source)
      request({
        url: '/sys-storage/upload',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
        timeout: 0,
        cancelToken: source.token,
        onUploadProgress: (progressEvent) => {
          let percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0
          //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          // file.onProgress({ percent: percent });
          file.message = `上传中 ${percent}%`
        },
      })
        .then((res) => {
          // console.log('/sys-storage/upload---res: ', res);
          if (res.status) {
            file.status = 'success'
            file.fileToken = res?.data?.fileToken
            this.fileTokenList.push(res?.data?.fileToken)
            this.setG9s()
            // 解决上传结束后进度仍然显示问题
            this.$refs.relUploader.$forceUpdate()
            // fileChangeGallery事件在管廊巡检模块生效
            this.$emit('fileChangeGallery', {
              file: res.data,
              fileList: this.fileList,
              length: this.fileList.length,
            })
          } else {
            Toast(res.message)
            // 删除上传失败的文件
            this.fileList.splice(
              this.fileList.findIndex((el) => el.fileId === fileId),
              1
            )
          }
          // file.onSuccess(res.data);
        })
        .catch((err) => {
          console.error(err)
          Toast('上传失败')
          // 删除上传失败的文件
          this.fileList.splice(
            this.fileList.findIndex((el) => el.fileId === fileId),
            1
          )
        })
    },
    removeFile(file) {
      const fileId = file.fileId
      //如果文件在上传中的话，则取消上传请求
      const source = cancelTokenObj.get(fileId)
      source && source.cancel()
      // 没有上传成功，或非查看页面预览时，直接return
      if (file.status !== 'success' && !file.response) {
        return
      }
      this.fileTokenList = this.fileTokenList.filter((item) => {
        return item !== file.fileToken
      })

      if (fileId) {
        this.fileList.splice(
          this.fileList.findIndex((el) => el.fileId === fileId),
          1
        )
        // 从后台获取附件后没有filedId时，利用token定位文件做删除
      } else {
        this.fileList.splice(
          this.fileList.findIndex((el) => el.fileToken === file.fileToken),
          1
        )
      }

      //派发文件列表状态变化事件
      this.$emit('fileChange', {
        file,
        fileList: this.fileList,
        length: this.fileList.length,
      })
    },
    // 移动端设备下载文件
    download(file) {
      if ((file.isImage && this.type == 'image') || !this.disabled) {
        return
      } else if (typeof yuanchu != 'undefined') {
        let accessToken = this.$storage.get('access_token')
        let url =
          process.env.VUE_APP_BASE_URL +
          '/sys-storage/download?f8s=' +
          file.fileToken
        let name = file.file.name
        this.$loading.show({ title: '' })

        // 从设备应用缓存目录下获取文件系统路径
        let fileUrl = yuanchu.fileSystemPaths.file.cacheDirectory + name

        // 调用原生框架附件下载插件暴露的接口
        let fileTransfer = new yuanchu.fileTransfer()
        let that = this
        that.fileTransfer = fileTransfer
        fileTransfer.onprogress = (progressEvent) => {
          if (progressEvent) {
            if (file?.response?.size != progressEvent.total) {
              that.percent = Math.round(
                (progressEvent.loaded * 100) / file?.response?.size
              )
            }
          }
        }

        fileTransfer.download(
          url,
          fileUrl,
          (entry) => {
            entry.file((data) => {
              yuanchu.fileOpener2.open(entry.toURL(), data.type, {
                success: function () {
                  return
                },
                error: function (err) {
                  console.error(err)
                  this.$loading.hide()
                },
              })
            })
            this.$loading.hide()
          },
          () => {
            that.percent = 0
            this.$loading.hide()
          },
          false,
          {
            headers: {
              'Fawkes-Auth': accessToken,
            },
          }
        )
      } else {
        downloadFile(file.fileToken)
      }
    },
    deleteFile(index) {
      this.$refs.relUploader.onDelete(this.fileList[index], index)
    },
    onClickUpload(event) {
      if (this.type == 'image') {
        // 解决浏览器调试时控制报错问题
        if (typeof yuanchu != 'undefined') {
          this.takePicture()
          event.preventDefault()
        }
      } else {
        this.$refs.relUploader.$emit('click-upload', event)
      }
    },
    takePicture() {
      // 调用原生插件拍照或从相册选取
      yuanchu.imagePicker.getPictures(this.onSuccess, this.onFail, {
        quality: 50,
        maximumImagesCount: this.maxImagesCount,
        width: 1920,
        height: 1440,
      })
    },
    onFail(error) {
      console.error(error)
    },
    // 拍照或从相册选取图片成功后回调
    onSuccess(obj) {
      obj?.images.forEach((val) => {
        resolveLocalFileSystemURL(
          val.uri,
          (fileEntry) => {
            //获取file对象，和js原生的file不一样，需要插件处理
            fileEntry.file(
              (file) => {
                //读取文件对象
                const reader = new yuanchu.fileReader()
                reader.onloadend = (event) => {
                  const result = {}
                  const thisFile = new File(
                    [new Blob([event.target.result], { type: file.type })],
                    file.name
                  )
                  result.url = window.URL.createObjectURL(
                    new Blob([event.target.result])
                  )
                  result.isImage = true
                  result.file = thisFile
                  // 插入到fileList中并调用上传方法
                  this.fileList.push(result)
                  this.afterRead(result)
                }
                reader.readAsArrayBuffer(file)
              },
              function (error) {
                console.error('error', error)
              }
            )
          },
          function (error) {
            console.error('error resolve', error)
          }
        )
      })
    },
    clickUpload() {
      this.$refs?.relUploader?.$refs?.input.click()
    },
  },
}
</script>
<style lang="less" scoped>
// 自定义文件列表预览
.custom-preview-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}
// 自定义文件项
.preview-list-item {
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
  padding-top: 16px;

  .file-info {
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    height: 3em;
    justify-content: space-between;
    flex: 1;
    min-width: 0;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: left;
    }

    span + span {
      font-size: 28px;
      color: #999999;
    }
  }

  .file-icon {
    height: 53px;
    width: 44px;
    margin-top: 24px;
  }

  .delete-text {
    color: #999999;
  }
}
.field-attachment {
  height: 100%;
  flex-direction: column;
  /deep/ .fm-field__control--right {
    justify-content: flex-start;
  }
}
/deep/ .cus-label {
  width: 100%;
}
.cus-label__div {
  display: flex;
  justify-content: space-between;
  .label-action {
    color: #027aff;
  }
}
.uploder-attachment {
  width: 100%;
}

.no-upload-list {
  /deep/ .fm-field__control {
    display: none;
  }
}
</style>
