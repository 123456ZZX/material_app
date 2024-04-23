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
        <div class="rightSide" v-if="!isView">
          <!-- <img @click="startGalleryInsp" src="@/assets/img/inspection/暂停.png" alt="" /> -->
          <img @click="stopHandler" src="@/assets/img/inspection/结束.png" alt="" />
          <fm-dialog :visible.sync="showStop" title="停止巡检" show-cancel-button @confirm="stopGalleryInsp">
            <fm-field v-model="stopReason" rows="1" autosize label="" type="textarea" placeholder="请输入中止原因" />
          </fm-dialog>
        </div>
        <div class="rightSide" v-else>
          <img src="@/assets/img/inspection/签到成功.png" alt="" />
        </div>
      </div>
      <div class="centerCard">
        <div class="leftSideImg">
          <img src="@/assets/img/inspection/警告.png" alt="" />
          <span class="textStyle1">共上报问题数</span>
          <span class="textStyle2">{{ reportProblemNum }}</span>
        </div>
        <!-- <img class="moreStyle" src="@/assets/img/inspection/查看更多.png" alt="" /> -->
      </div>
      <div class="bottomCard">
        <div class="topTwoTab">
          <div class="buttonStyleTwo" @click="twoBtnClick('未完成')" :class="nowClickDone == '未完成' ? 'chooseStyle' : ''">
            未完成({{ undoneNum }})
          </div>
          <div class="buttonStyleTwo" @click="twoBtnClick('已完成')" :class="nowClickDone == '已完成' ? 'chooseStyle' : ''">
            已完成({{ doneNum }})
          </div>
        </div>
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
            <img @click="goToDetail(item)" class="imgRight" src="@/assets/img/inspection/查看更多蓝.png" alt="" />
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
      disabledStop: true,//刚刚进入时，停止按钮不可用；几秒后可用
      showStop: false, // 弹窗，取消/确认停止巡检
      stopReason: '', // 有对象未完成，停止巡检时填写
      reportProblemNum: 0,
      // 用于给进度条长度赋值
      taskProcess: 0,
      divWidth: 0,
      percentNum: 0,

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
      InspObjectList: [],// 巡检对象
      nowClick: '全部',
      undoneNum: 0,
      doneNum: 0,
      nowClickDone: '未完成',//  查全部--不传objectStatus
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
  async mounted() {
    this.isView = this.$route.query.isView
    this.isView ? this.nowClickDone = '已完成' : this.nowClickDone = '未完成'

    // 根据id查询任务详情，某一个巡检对象完成后返回到该页面需要重新获取任务刷新进度条
    let res = await Api.getDetailDataById({ id: JSON.parse(localStorage.getItem('galleryTaskData')).id })
    console.log('根据id查询任务详情，某一个巡检对象完成后返回到该页面需要重新获取任务刷新进度条', res);
    if (res.status && res.data) {
      // 当前点击的任务，从接口或者本地中获取
      this.taskDetail = res.data || JSON.parse(localStorage.getItem('galleryTaskData'))
    }
    console.log('当前检漏任务', this.taskDetail)

    // 改变任务的状态 taskStatus 状态（0未开始 1执行中 2已完成）
    if (this.taskDetail.taskStatus == 0) {
      this.changeStatus()
    }

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
        console.log('this.formToken: ', this.formToken);
        this.header = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.formToken,
        }
        this.getProblemDataList() // 需要确保拿先到了 header
      }
    })
    this.divWidth = document.querySelector('.textWidth').clientWidth
    console.log('textWidth width: ' + this.divWidth)
    this.styleVar['--barWidth'] = parseInt(this.divWidth * this.percentNum) + 'px'
    this.getInspObjectList()
    //刚刚进入时，停止按钮不可用；几秒后可用
    window.setTimeout(() => {
      this.disabledStop = false
    }, 2000)
  },
  methods: {
    // 改变任务的状态 taskStatus 状态（0未开始 1执行中 2已完成）
    changeStatus() {
      let params = _cloneDeep(this.taskDetail)
      params.taskStatus = 1
      Api.changeTaskStatus(params).then(res => {
        console.log(res);
      })
    },
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
    // 统计该任务 上报的问题工单数
    async getProblemDataList() {
      let params = {
        sysCode: 'outwork',
        // token: this.accessToken,
        smallType: 'abnormal_inform',
        page: {
          current: 1,
          size: 99999, // 查全部
        },
        extParam: {
          task_id: this.taskDetail.id
        }
      }
      await this.getAxiosData(params)
    },
    getAxiosData(params) {
      console.log('params: ', params);
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/outworkapi/ticketStatisticClient/getTicketList',
          // url: '/main/outworkapi/ticketStatisticClient/getTicketList',
          // url: 'http://172.20.79.70/main/outworkapi/ticketStatisticClient/getTicketList',
          method: 'post',
          data: params,
          headers: this.header,
        }).then((res) => {
          console.log('getAxiosData-res: ', res);
          if (res.status && res.data.success && res.data.resultData) {
            this.reportProblemNum = res.data.resultData.total
          }
        })
      })
    },
    // 未完成/已完成
    async getInspObjectList() {
      let res = await Api.inspObject({ taskId: this.taskDetail.id, objectStatus: this.nowClickDone })
      if (res.status) {
        res.data.objectTypeList ? this.InspObjectTypeList = res.data.objectTypeList : ''
        this.InspObjectList = res.data.objects
      }
      let resUnDone = await Api.inspObject({ taskId: this.taskDetail.id, objectStatus: '未完成' })
      if (resUnDone.status) {
        this.undoneNum = resUnDone.data.objects.length
      }
      let resDone = await Api.inspObject({ taskId: this.taskDetail.id, objectStatus: '已完成' })
      if (resDone.status) {
        this.doneNum = resDone.data.objects.length
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
    // 未完成、已完成点击
    twoBtnClick(text) {
      this.nowClickDone = text
      this.btnClick(this.nowClick)
    },
    stopHandler() {
      if (!this.disabledStop) {
        if (this.undoneNum == 0) {
          // 没有未完成的巡检对象，直接停止巡检任务
          this.stopGalleryInsp()
        } else {
          // 有未完成的巡检对象，弹窗中止巡检任务
          this.showStop = true
        }
      }
    },
    // 停止管廊巡检
    async stopGalleryInsp() {
      let inspTask = {
        id: this.taskDetail.id,
        taskStatus: 2,
        remarks: this.undoneNum == 0 ? '完成所有对象巡检' : this.stopReason
      }
      let res = await Api.stopGalleryInsp(inspTask)
      console.log('停止管廊巡检-res: ', res);
      // this.$router.push({
      //   name: 'GalleryInspection',
      // })
      this.$router.go(-1)
    },
    // 进入某一个管廊完成状态详情页面
    goToDetail(item) {
      console.log('当前点击管廊', item)
      if (this.nowClickDone == '已完成') {
        this.$router.push({
          name: 'SingleGalleryDetail',
          query: item,
          params: { taskId: this.taskDetail.id, mode: 'view' }
        })
      }
      else {
        if (this.isView) {
          Toast({
            message: '该巡检任务已结束',
            duration: '1500',
          })
        } else {
          // 如果当前还未获取到工单token，不允许上报漏点
          if (!this.formToken) {
            Toast({
              message: '正在获取工单token，请稍后再试',
              duration: '1500',
            })
            return
          }
          this.$router.push({
            name: 'SingleGalleryDetail',
            query: item,
            params: { taskId: this.taskDetail.id, formToken: this.formToken, mode: 'edit' }
          })
        }
      }
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

    .centerCard {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 690px;
      height: 82px;
      margin: 24px 0;
      background: linear-gradient(270deg,
          rgba(232, 194, 194, 0) 0%,
          rgba(231, 122, 122, 0.05) 51%,
          rgba(240, 83, 83, 0.1) 100%);
      border-radius: 16px;

      img {
        width: 44px;
      }

      .leftSideImg {
        display: flex;
        align-items: center;
        margin-left: 30px;

        .textStyle1 {
          margin-left: 24px;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }

        .textStyle2 {
          margin-left: 24px;
          font-size: 32px;
          font-family: Helvetica-Bold, Helvetica;
          font-weight: bold;
          color: #ff4d4f;
        }
      }

      .moreStyle {
        margin-right: 40px;
      }
    }

    .bottomCard {
      display: flex;
      flex-direction: column;
      width: 690px;
      height: calc(100% - 376px);
      background: #ffffff;
      box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
      border-radius: 16px 16px 0 0;

      .topTwoTab {
        display: flex;
        justify-content: space-around;
        width: 100%;
        height: 110px;

        .buttonStyleTwo {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 250px;
          height: 64px;
          margin-top: 30px;
          transition: all 0.4s;
          font-size: 32px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #191919;
        }

        .chooseStyle {
          position: relative;

          &::after {
            position: absolute;
            content: '';
            display: inline-block;
            width: 140px;
            height: 14px;
            background: linear-gradient(270deg, rgba(58, 160, 238, 0) 0%, #1b67d8 100%);
            border-radius: 7px;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
          }
        }
      }

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
        height: calc(100% - 220px);
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

          .imgRight {
            width: 32px;
            position: absolute;
            top: 50%;
            right: 40px;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
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
