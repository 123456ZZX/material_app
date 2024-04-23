<!-- '事件悬浮popup' -->
<template>
  <div class="popupStyle">
    <div class="innerSide">
      <div class="topText">
        <span>{{ ticketNo }} {{ name }}</span>
      </div>
      <div class="bottomButton">
        <div @click="goToView" class="leftButton">查看预案</div>
        <div @click="goToDeal(id)" class="rightButton">点击处理</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Bus from '@/utils/bus'
import router from '@/router'
export default Vue.extend({
  props: {
    // 对象类型
    deviceType: {
      type: String,
      default: '',
    },
    // 事件类型
    faultTypes: {
      type: String,
      default: '',
    },
    // 当前事件点的properties
    properties: {
      type: Object,
      default: {},
    },
    formToken: {
      // required: true,
      type: String,
      default: '',
    },
    id: {
      // required: true,
      type: String,
      default: '',
    },
    // 基础信息
    name: {
      // required: true,
      type: String,
      default: '',
    },
    ticketNo: {
      // required: true,
      type: String,
      default: '',
    },
    status: {
      // required: true,
      type: String,
      default: '',
    },
    // 设备数据
    info: {
      type: Object,
      default() {
        return {}
      },
    },
    isWarn: {
      type: String,
      default: '',
    },
    fileList: {
      type: Array,
      default() {
        return [
          // { name: '2022国考时政冲刺·金句速读.pdf', uid: "1582925571663933442", fileToken: "aac668485aa3b242268e73a07c3e3639", url: 'http://172.20.79.62:9000/fawkes/2022-10/aac668485aa3b242268e73a07c3e3639.pdf' },
          // { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
        ]
      },
    },
  },
  data() {
    return {
      dialogDetailVisible: false,
      formURL: '',
      url: this.VUE_APP_UPLOAD_API, // 附件上传
      accessToken: this.$storage.get('access_token'),
      // 预览
      file: {}, // 预览文件数据
      dialogVisible: false,
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 查看预案
    goToView() {
      Bus.$emit('goToViewDetail', this.deviceType, this.faultTypes, this.properties)
    },
    // 点击处理
    goToDeal(id) {
      window.location.href =
        'http://172.20.79.70/outworkApp/#/pages/ticket/detail/index?id=' +
        id +
        '&sysCode=outwork' +
        '&token=' +
        this.formToken
    },
  },
})
</script>

<style lang="less" scoped>
.popupStyle {
  display: flex;
  justify-content: center;
  width: 428px;
  height: 200px;
  background: url('~@/assets/img/dispatchCenter/弹窗背景图.png') no-repeat;
  background-size: 428px 200px;
  display: flex;
  justify-content: center;
  .innerSide {
    width: 91%;
    height: 73%;
    margin-top: 10px;
    // background-color: rgb(54, 170, 89);
    .topText {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: 38%;
      border-radius: 14px 14px 0 0;
      background-color: rgb(255, 255, 255);
      span {
        width: 100%;
        padding-left: 18px;
        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #555555;
        /*强制文本在一行内显示*/
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .bottomButton {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 62%;
      border-radius: 0 0 14px 14px;
      background-color: rgb(255, 255, 255);
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      .leftButton {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 168px;
        height: 60px;
        color: #1b67d8;
        border-radius: 30px;
        border: 2px solid #1b67d8;
      }
      .rightButton {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 168px;
        height: 60px;
        color: #ffffff;
        background: #1b67d8;
        border-radius: 30px;
        border: 1px solid #1b67d8;
      }
    }
  }
}
</style>
