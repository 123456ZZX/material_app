<template>
  <div class="GalleryInspectionStyle">
    <fm-nav-bar left-arrow :title="taskDetail.taskName" @click-left="goBackToTask">
    </fm-nav-bar>
    <div class="mapContainer">
      <div class="topCard">
        <div class="leftSide">
          <div class="littleLine1">
            <div class="textWidth">
              <span>任务进度</span>
              <span>{{ taskProcess }}</span>
            </div>
          </div>
          <div v-if="true" class="littleLine2">
            <!--  第一层，固定进度条宽度 -->
            <div :style="styleVar" class="progressWidth">
              <!-- 第二层，计算得到的实际比率宽度 -->
              <div :style="styleVar" class="colorWidth">
                <!-- 第三层，动画 -->
                <div :style="styleVar" class="progressAnimate"></div>
              </div>
            </div>
          </div>
          <div class="littleLine3">
            <img src="../../assets/img/inspection/剩余时间.png" alt="" />
            <div class="titleText">剩余时间：</div>
            <fm-count-down :time="timeRest">
              <template #default="timeData">
                <span class="block">{{ timeData.days }}</span>
                <span class="colon">天</span>
                <span class="block">{{ timeData.hours }}</span>
                <span class="colon"> : </span>
                <span class="block">{{ timeData.minutes }}</span>
              </template>
            </fm-count-down>
          </div>
        </div>
        <div class="rightSide">
          <img @click="startGalleryInsp" src="@/assets/img/inspection/暂停.png" alt="" />
          <!-- <img src="@/assets/img/inspection/开始.png" alt=""> -->
        </div>
      </div>
      <div class="bottomCard">
        <div class="topThreeBtn">
          <div class="buttonStyle" @click="btnClick('全部')" :class="nowClick == '全部' ? 'chooseStyle' : ''">
            全部
          </div>
          <div class="buttonStyle" v-for="(item, index) in InspObjectTypeList" :key="index" @click="btnClick(item)"
            :class="nowClick == item ? 'chooseStyle' : ''">
            {{ item }}
          </div>
        </div>
        <div class="bottomList">
          <div class="lineStyle" v-for="(item, index) in InspObjectList" :key="index">
            <span class="numStyle">{{ index + 1 }}</span>
            <span class="textStyle">{{ item.objectName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import * as Api from './api'
import bus from '@/utils/bus'
import { ENUM } from '@/store/State/stateTypes'
import * as turf from '@turf/turf'
import { bbox, center as getCenter } from '@turf/turf'
import _cloneDeep from 'lodash/cloneDeep'
import { addIconToMap } from '@/utils/mapUtils'
import mapboxgl from 'mapbox-gl'
import { Toast, Dialog, Notify } from 'fawkes-mobile-lib'
import mixins from '@/views/inspectMap/mixins/mixins.js'
import dayjs from 'dayjs'
import request from '@/utils/request'

export default {
  name: '',
  // mixins: [mixins],
  components: {},
  data() {
    return {
      // 用于给进度条长度赋值
      taskProcess: 100,
      divWidth: 0,
      percentNum: 1,

      // 当前点击的任务
      taskDetail: {},
      // 巡检员信息
      userInfo: {},
      // 是否开始记录
      ifRecording: false,
      // 是否为查看状态
      isView: false,
      // 是否为巡检员登陆，false为巡检员登录
      isFlag: false,

      accessToken: this.$storage.get('access_token'),
      formToken: '',
      header: {},

      InspObjectTypeList: [],
      InspObjectList: [],
      nowClick: '全部',
    }
  },
  computed: {
    // 倒计时
    timeRest() {
      // return new Date('2023-07-01 00:00:00').getTime() - new Date().getTime()
      return new Date(this.taskDetail.taskEndTime).getTime() - new Date().getTime()
    },
    styleVar() {
      return {
        // 进度条全长
        '--totalWidth': this.divWidth + 'px',
        '--barWidth': '100px',
        '--colorBlue': 'blue',
      }
    },
  },
  created() {
    console.log('存储在本地的检漏任务', JSON.parse(localStorage.getItem('galleryTaskData')))

    // 当前点击的任务，从本地中获取
    this.taskDetail = JSON.parse(localStorage.getItem('galleryTaskData'))
    this.taskProcess = this.changeToRate(this.taskDetail.reportRate) // 任务进度
    this.userInfo = this.$store.state.userInfo
    console.log('this.userInfo', this.userInfo)
    console.log('当前点击的任务', this.taskDetail)
    console.log(
      this.userInfo.userName,
      this.taskDetail.inspector,
      '------巡检人员与当前登陆账号------',
      this.userInfo.userFullname,
      this.taskDetail.inspectorFullName
    )

    // 当巡检人员与当前登陆账号一致时才能检漏
    if (
      this.userInfo.userName != this.taskDetail.inspector &&
      this.userInfo.userFullname != this.taskDetail.inspectorFullName
    ) {
      console.log('人员不一致')
      // true为巡检员未登录，为查看状态
      // this.isFlag = true
    }
    // inspector: "chen_bolin"
    // inspectorFullName: "陈博林"

    // userFullname: "宋凯龙"
    // userName: "song_kl"

    // 获取header，查询工单用
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
        this.header = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.formToken,
        }
      }
    })
  },
  mounted() {
    this.divWidth = document.querySelector('.textWidth').clientWidth
    console.log('textWidth width: ' + this.divWidth)
    this.styleVar['--barWidth'] = parseInt(this.divWidth * this.percentNum) + 'px'
    this.getInspObjectList()
  },
  methods: {
    changeToRate(coverage) {
      if (coverage.includes('/')) {
        let insp = Number(coverage.split('/')[0])
        let uninsp = Number(coverage.split('/')[1])
        if (uninsp) {
          this.percentNum = insp / uninsp || 0
          return ((insp / uninsp) * 100).toFixed(2) + '%'
        } else {
          return '0%'
        }
      } else {
        return '0%'
      }
    },
    // 返回任务页
    goBackToTask() {
      if (this.ifRecording) {
        // 当前正在巡检中时，返回任务页时提示是否离开该任务
        this.ifLeaveTask = true
      } else {
        this.$router.go(-1)
      }
    },
    async getInspObjectList() {
      let res = await Api.inspObject({ taskId: this.taskDetail.id })
      if (res.status) {
        res.data.objectTypeList ? this.InspObjectTypeList = res.data.objectTypeList : ''
        this.InspObjectList = res.data.objects
      }
    },
    // 全部、支廊、水信舱点击
    async btnClick(text) {
      this.nowClick = text
      let res = {}
      if (text == '全部') {
        this.getInspObjectList()
      } else {
        res = await Api.inspObject({ taskId: this.taskDetail.id, objectStatus: this.nowClickDone, objectType: text })
        if (res.status) {
          this.InspObjectList = res.data.objects
        }
      }
    },
    // 开始管廊巡检
    startGalleryInsp() {
      // this.taskDetail 为当前任务详情，可通过 JSON.parse(localStorage.getItem('galleryTaskData')) 获取
      this.$router.push({
        name: 'StartGalleryInspection',
      })
    },
  },
}
</script>

<style lang="less" scoped>
.GalleryInspectionStyle {
  background-color: #ffffff !important;
  height: 100%;

  // 顶部标题背景色
  /deep/.fm-nav-bar__content {
    background-color: #ffffff;
  }

  /deep/.fm-nav-bar__title {
    color: #191919 !important;
  }

  /deep/ .fm-nav-bar .fm-icon {
    color: #191919 !important;
  }

  .mapContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: calc(100% - 92px);
    width: 100%;
    background: linear-gradient(0deg,
        rgba(211, 231, 254, 0) 0%,
        rgba(211, 231, 254, 0.05) 50%,
        rgba(211, 231, 254, 0.4) 100%);

    .topCard {
      display: flex;
      justify-content: space-between;
      width: 690px;
      min-height: 175px;
      margin-top: 48px;
      background: #ffffff;
      box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
      border-radius: 16px;

      .leftSide {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: 70%;
        height: 100%;

        // background-color: rgb(255, 196, 196);
        .littleLine1 {
          display: flex;
          align-items: center;
          min-height: 85px;
          padding: 0 32px;
          font-size: 36px;
          font-family: Helvetica-Bold, Helvetica;
          font-weight: bold;
          color: #191919;

          .textWidth {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 90%;
            min-height: 85px;
          }
        }

        .littleLine2 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 24px;
          padding-left: 32px;

          // 第一层，固定进度条宽度
          .progressWidth {
            width: var(--totalWidth);
            height: 16px;
            border-radius: 8px;
            background: rgba(27, 103, 216, 0.08);
            box-shadow: inset 0px 0px 5px 0px rgba(39, 123, 214, 0.15);

            // 第二层，计算得到的实际比率宽度
            .colorWidth {
              width: var(--barWidth);
              height: 16px;
              border-radius: 8px;
              box-shadow: 0px 4px 8px 0px rgba(50, 127, 211, 0.24);
              border-radius: 8px;
              background: linear-gradient(-45deg, #1b67d8 0%, rgba(58, 160, 238, 0.42) 100%);

              // 第三层，动画
              .progressAnimate {
                width: 0;
                height: 16px;
                border-radius: 8px;
                background: linear-gradient(270deg, #1b67d8 0%, rgba(58, 160, 238, 0.42) 100%);
                // background: linear-gradient(to top right, #CDDC39, #8BC34A, #FFEB3B);
                animation: w 3s linear infinite;

                @keyframes w {
                  0% {
                    width: 0;
                  }

                  100% {
                    width: var(--barWidth);
                  }
                }
              }
            }
          }
        }

        // 剩余时间
        .littleLine3 {
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 85px;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;

          img {
            width: 32px;
            height: 32px;
            margin: 0 10px 0 32px;
          }

          // background-color: rgb(255, 129, 245);
          .colon {
            display: inline-block;
            margin: 0 20px;
            font-size: 24px;
            font-weight: 400;
            color: #2062c4;
            line-height: 33px;
          }

          .block {
            display: inline-block;
            width: 38px;
            font-size: 24px;
            text-align: center;
            color: #2062c4;
            background: rgba(27, 103, 216, 0.1);
            border-radius: 8px;
          }
        }
      }

      .rightSide {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30%;
        height: 100%;

        // background-color: rgb(196, 255, 196);
        img {
          width: 140px;
          height: 140px;
        }
      }
    }

    .bottomCard {
      display: flex;
      flex-direction: column;
      width: 690px;
      height: calc(100% - 278px);
      margin-top: 32px;
      background: #FFFFFF;
      box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
      border-radius: 16px 16px 0 0;

      .topThreeBtn {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        height: 110px;

        .buttonStyle {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 196px;
          height: 64px;
          margin-top: 30px;
          background: #f5f5f5;
          border-radius: 36px;
          transition: all 0.4s;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
        }

        .chooseStyle {
          color: #1b67d8;
          background: #dde8f9;
        }
      }

      .bottomList {
        width: 100%;
        height: calc(100% - 110px);
        overflow-y: scroll;

        // background-color: rgb(130, 247, 139);
        .lineStyle {
          position: relative;
          display: flex;
          align-items: center;
          // width: 100%;
          height: 96px;
          line-height: 96px;
          padding-left: 8px;

          .numStyle {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            font-size: 36px;
            font-family: Helvetica-Bold, Helvetica;
            font-weight: bold;
            color: #1b67d8;
          }

          .textStyle {
            display: flex;
            align-items: center;
            padding-left: 24px;
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }

          &::after {
            content: '';
            position: absolute;
            display: block;
            width: 89%;
            height: 1px;
            background-color: #eeeeee;
            bottom: 0;
          }
        }
      }
    }
  }
}
</style>
