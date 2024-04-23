<template>
  <div class="task-map full-width">
    <!-- 导航栏 -->
    <div class="navbar-box">
      <fm-nav-bar :title="navbarTitle" left-arrow @click-left="clickBack" @click-right="openPopup">
        <template #right>
          <fm-popover :visible.sync="showPopover" trigger="click" :actions="actions" @select="onSelect"
            placement="bottom-end">
            <template #reference>
              <img style="width: 34px" v-if="!isView" :src="require('@/assets/img/inspection/增加.png')" />
            </template>
          </fm-popover>
        </template>
      </fm-nav-bar>
    </div>
    <!-- 地图 -->
    <MapComp ref="mymap" :ifInspection="true" @mapLoaded="mapLoaded" :legendConfig="legendConfig"></MapComp>
    <!-- <fm-popup
      :visible.sync="pointListShow"
      close-on-click-modal
      :close-on-popstate="true"
      position="bottom"
      safe-area-inset-bottom
    >
      <fm-tabs type="card" style="padding-top: 20px">
        <fm-tab label="未上报关键点">
          <fm-empty v-if="keyDetailList.length <= 0" description="暂无数据" mode="list"></fm-empty>
        </fm-tab>
        <fm-tab label="已上报关键点">
          <fm-empty v-if="keyDetailList.length <= 0" description="暂无数据" mode="list"></fm-empty>
        </fm-tab>
      </fm-tabs>
    </fm-popup> -->
    <!-- 开始记录与结束记录 -->
    <div class="start-record" v-show="!isView">
      <img v-if="!ifRecording" :src="require('@/assets/img/inspection/暂停.png')" @click="startInspRecord" />
      <img v-else :src="require('@/assets/img/inspection/开始.png')" @click="endRecord('pause')" />
    </div>
    <!-- 数据面板 -->
    <div class="controlCard" v-show="!isView">
      <div class="controlContent">
        <div class="infoContent">
          <div class="endControl">
            <div class="leftText">
              <img :src="require('@/assets/img/inspection/剩余时间.png')" />
              <fm-count-down style="margin: auto" :time="getRestTime(taskDetail.taskEndTime)" format="DD天HH小时" />
            </div>
            <div class="rightButton">
              <fm-button v-show="ifRecording" class="endBtn" round @click="endTask">结束</fm-button>
            </div>
          </div>

          <div class="bottomSide">
            <div class="block">
              <div class="rate" style="font-size: 18px">
                <div class="centerStyle">
                  {{ changeToRate(taskDetail.coverage) }}
                </div>
              </div>
              <div class="name" style="font-size: 14px">覆盖率</div>
            </div>

            <div class="block" @click="openKeyPointList" style="cursor: pointer;">
              <div class="rate">
                <div class="centerStyle">
                  <div class="inspKp" style="font-size: 19px">
                    {{ changeToInspCount(taskDetail.reportRate) }}
                  </div>
                  <div class="uninspKp" style="font-size: 14px">
                    /{{ changeToAllInspCount(taskDetail.reportRate) }}
                  </div>
                </div>
              </div>
              <div class="name" style="font-size: 14px">关键点</div>
            </div>

            <div class="block" @click="reportClick" style="cursor: pointer;">
              <div class="rate" style="font-size: 18px">
                <div class="centerStyle">
                  {{ problemDataList1.length + problemDataList2.length }}
                </div>
              </div>
              <div class="name" style="font-size: 14px">上报</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="viewCard" v-show="isView">
      <div class="controlContent">
        <div class="infoContent">
          <div class="bottomSide">
            <div class="block">
              <div class="rate" style="font-size: 18px">
                <div class="centerStyle">
                  {{ changeToRate(taskDetail.coverage) }}
                </div>
              </div>
              <div class="name" style="font-size: 14px">覆盖率</div>
            </div>

            <div class="block" @click="openKeyPointList" style="cursor: pointer;">
              <div class="rate">
                <div class="centerStyle">
                  <div class="inspKp" style="font-size: 19px">
                    {{ changeToInspCount(taskDetail.reportRate) }}
                  </div>
                  <div class="uninspKp" style="font-size: 14px">
                    /{{ changeToAllInspCount(taskDetail.reportRate) }}
                  </div>
                </div>
              </div>
              <div class="name" style="font-size: 14px">关键点</div>
            </div>

            <div class="block" @click="reportClick" style="cursor: pointer;">
              <div class="rate" style="font-size: 18px">
                <div class="centerStyle">
                  {{ problemDataList1.length + problemDataList2.length }}
                </div>
              </div>
              <div class="name" style="font-size: 14px">上报</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 轨迹显示与定位功能 -->
    <div class="tool-box">
      <div class="location" @click="startLocation">
        <fm-image class="location-image" :src="require('@/assets/img/inspection/location.png')"></fm-image>
      </div>
    </div>
    <!-- 签到框 -->
    <fm-popup :visible.sync="signShow" :modal="false" round position="bottom"
      :style="{ height: signForm.deviceStatus == '1' ? '60%' : '50%' }">
      <div class="popup-view">
        <fm-form ref="signForm">
          <div class="title">
            <img :src="require('@/assets/img/inspection/sideIcon.png')" />
            <div class="deviceId">{{ deviceName }}</div>
          </div>
          <fm-field :name="signForm.deviceStatus" error label="运行情况" required>
            <template #input>
              <fm-radio-group v-model="signForm.deviceStatus" :disabled="hasSignIn" direction="horizontal">
                <fm-radio name="0">正常</fm-radio>
                <fm-radio name="1">异常</fm-radio>
              </fm-radio-group>
            </template>
          </fm-field>
          <fm-field v-if="signForm.deviceStatus == '1'" :disabled="hasSignIn" label="是否上报" required>
          </fm-field>
          <fm-field :name="signForm.isReport" v-if="signForm.deviceStatus == '1'">
            <template #input>
              <fm-radio-group v-model="signForm.isReport" :disabled="hasSignIn" direction="horizontal">
                <fm-radio v-for="(item, index) in reportChose" :key="index" :name="item.value">{{ item.name }}
                </fm-radio>
              </fm-radio-group>
            </template>
          </fm-field>

          <!--
            { value: "正常/异常", label: "正常/异常" },
            { value: "开启/关闭", label: "开启/关闭" },
            { value: "是/否", label: "是/否" },
            { value: "数值", label: "数值" },
          -->
          <!-- 巡检要点list，已巡检和未巡检要点从不同接口中获取 -->
          <fm-field v-for="(item, index) in keyPointsInspectionList" :key="item.id" :label="item.mainPoint" required>
            <template #input>
              <fm-radio-group v-if="item.inputType == '正常/异常' || item.ext1 == '正常/异常'" v-model="item.mainValue" :disabled="hasSignIn">
                <fm-radio name="正常">正常</fm-radio>
                <fm-radio name="异常">异常</fm-radio>
              </fm-radio-group>
              <fm-radio-group v-if="item.inputType == '开启/关闭' || item.ext1 == '开启/关闭'" v-model="item.mainValue" :disabled="hasSignIn">
                <fm-radio name="开启">开启</fm-radio>
                <fm-radio name="关闭">关闭</fm-radio>
              </fm-radio-group>
              <fm-radio-group v-if="item.inputType == '是/否' || item.ext1 == '是/否'" v-model="item.mainValue" :disabled="hasSignIn">
                <fm-radio name="是">是</fm-radio>
                <fm-radio name="否">否</fm-radio>
              </fm-radio-group>
              <fm-field v-if="item.inputType == '数值' || item.ext1 == '数值'" type="number" v-model="item.mainValue" :disabled="hasSignIn" />
            </template>
          </fm-field>

          <uploader v-model="attachment" @fileChange="fileChange" multiple :maxImagesCount="2" :deletable="!hasSignIn" :disabled="hasSignIn"
            type="image" />
          <fm-field v-if="waterLevelShow" label="液位（米）" type="number" required name="liquidLevel" placehold="请输入液位" :disabled="hasSignIn"
            v-model="signForm.liquidLevel">
          </fm-field>
          <fm-field label="备注" name="remark" type="textarea" placehold="请输入" :disabled="hasSignIn"
            v-model="signForm.remark">
          </fm-field>
        </fm-form>
      </div>
      <div class="btnArea" v-show="!hasSignIn">
        <fm-button class="btn1" @click="onCancel" round type="default">取消</fm-button>
        <fm-button class="btn2" @click="onConfirm" round type="primary">提交</fm-button>
      </div>
      <div class="btnArea" v-show="hasSignIn">
        <fm-button class="btn" @click="onCancel" round type="default">关闭</fm-button>
      </div>
    </fm-popup>
    <fm-popup :visible.sync="reportShow" @close="handleClose" round position="bottom"
      :overlay-style="{ background: 'rgba(0, 0, 0, 0.1)' }" :style="{ height: '50%' }">
      <fm-tabs v-model="active" swipeable style="height: 100%">
        <fm-tab label="问题上报">
          <div v-for="(item, index) in problemDataList1" :key="index">
            <problemCardInfo type="001" :cardInfo="item" @toDetailPanel="toDetailPanel" @flyToPoint="flyToPoint">
            </problemCardInfo>
          </div>
        </fm-tab>
        <fm-tab label="设施缺陷">
          <div v-for="(item, index) in problemDataList2" :key="index">
            <problemCardInfo type="002" :cardInfo="item" @toDetailPanel="toDetailPanel" @flyToPoint="flyToPoint">
            </problemCardInfo>
          </div>
        </fm-tab>
      </fm-tabs>
    </fm-popup>

    <!-- 提示层 -->
    <div v-show="ifTips" class="tip-tools">
      <img :src="require('@/assets/img/tips.png')" class="tipImg" />
      <div class="context">请在地图上选择设施或者点位</div>
    </div>
    <fm-overlay :show="ifEndTask" z-index="10">
      <div class="confirm-tip">
        <div class="contentSelf">
          <div class="icon">
            <img :src="require('@/assets/img/inspection/终止.png')" width="60" style="margin: auto" />
          </div>
          <div class="info">
            <span>{{ `您还有${changeToAllInspCount(taskDetail.reportRate) - changeToInspCount(taskDetail.reportRate)}个关键点未打卡，确定提前中止巡检任务？` }}</span>
          </div>
          <div class="input">
            <fm-field v-model="stopReason" placeholder="请输入终止原因" rows="3" autosize type="textarea" maxlength="200" show-word-limit></fm-field>
          </div>
        </div>
        <div class="confirm_btn">
          <div class="btn1 btn2" @click="continueTask">继续任务</div>
          <div class="btn1" @click="stopTask">中止任务</div>
        </div>
      </div>
    </fm-overlay>
    <fm-overlay :show="ifLeaveTask" z-index="10">
      <div class="confirm-tip">
        <div class="contentSelf">
          <div class="icon">
            <img :src="require('@/assets/img/inspection/终止.png')" width="60" style="margin: auto" />
          </div>
          <div class="info">
            <span>{{ '当前为巡检状态，继续退出会暂停巡检，请确定是否退出?' }}</span>
          </div>
        </div>
        <div class="confirm_btn">
          <div class="btn1 btn2" @click="cancelLeave">取消</div>
          <div class="btn1" @click="confirmLeave">退出</div>
        </div>
      </div>
    </fm-overlay>
    <!-- 关键点列表 -->
    <div class="content" :class="showKeyList ? '' : 'inactive'">
      <div class="contentArea">
        <div style="overflow-x: scroll; height: 74px;">
          <div class="buttonArea" :style="buttonAreaStyle">
            <fm-button
              round
              v-for="it of buttonList"
              :key="it"
              class="button"
              :style="currentSelect == it ? { 'color': '#1B67D8', 'background': '#DDE8F9' } : {}"
              @click="changeBizType(it)"
            >{{ it }}</fm-button>
          </div>
        </div>
        <div class="listArea">
          <fm-list
            v-model="loading"
            :finished="finished"
            finished-text="到底了"
          >
            <div v-for="(it, idx) of unInspKeyDetailList" :key="it.id" class="list">
              <div class="list_num">{{ idx + 1 }}</div>
              <div class="list_type">{{ it.deviceType || '' }}</div>
              <div class="list_id">{{ it.deviceId || '' }}</div>
              <div class="list_deal" @click="goToDeal(it)">
                定位
                <img
                  width="24"
                  height="24"
                  style="margin: auto 0 auto 4px;"
                  :src="require('@/assets/img/maintenance/deal.png')"
                />
              </div>
            </div>
          </fm-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import bus from '../../views/inspectMap/utils/Bus.js'
import axios from 'axios'
import dayjs from 'dayjs'
import MapComp from '../../views/inspectMap/index.vue'
import request from '@/utils/request'
import * as api from './api'
import { Toast, Dialog, Notify } from 'fawkes-mobile-lib'
import * as turf from '@turf/turf'
import Uploader from '@/components/upload/Uploader.vue'
import problemCardInfo from './problemCardInfo';
import API from "@/common/config.js";
import _cloneDeep from 'lodash/cloneDeep'
const mapObj = {
  map: null,
  mapInstance: null,
}
let pauseStateTrackPoints = []
let pauseStatePipeIdList = []
export default {
  name: 'daily-task',
  components: {
    MapComp,
    Uploader,
    problemCardInfo
  },
  data() {
    return {
      showKeyList: false,
      buttonList: [],
      unInspKeyDetailList: [],
      loading: false,
      finished: true,
      currentSelect: '全部',
      isResume: true,
      ifLeaveTask: false,
      stopReason: '',
      ifEndTask: false,
      legendConfig: [],
      ifTips: false,
      reportDataIsLoaded: false,
      // 巡检任务下所有巡检管线
      allTaskLines: [],
      isView: true,
      active: 0,
      deviceName: '',
      hasSignIn: false,
      showPopover: false,
      actions: [
        {
          text: '问题上报',
        },
        {
          text: '设施缺陷',
        },
      ],
      currentRate: 0,
      // 控制关键点列表显隐
      pointListShow: false,
      // 全局发声函数
      // 记录开始巡检的时间，用于判断是否在开始巡检的10s内
      startRecordTimer: '',
      navbarTitle: '日常任务',
      // 上报失败的巡检轨迹点位数组
      reportFailTrackPoints: [],
      isShowRoute: true,
      inspBusinessType: '',
      recordData: [],
      // 当前巡检员所处位置
      currentPosition: null,
      lines: [],
      // 巡检员信息
      userInfo: {},
      ifRecording: false,
      selectEventType: false,
      eventTypeList: [],
      signShow: false,
      attachment: '',
      signForm: {
        deviceStatus: '1',
        inspImagesList: [],
        remark: '',
        isReport: '',
        taskId: '',
        pointId: '',
        liquidLevel: '',
      },
      taskDetail: {
        coverage: '0/0',
        reportRate: '0/0',
        planEndTime: '',
      },
      engInfoDTO: {},
      taskRestTime: 0,
      reportFooterShow: false,
      feature: {},
      planDetail: {},
      // 用于地图中显示范围和关键点
      inspRangeList: [],
      rangeList: [],
      keyDetailList: [],
      isRunList: [
        {
          name: '正常',
          value: '1',
        },
        {
          name: '异常',
          value: '0',
        },
      ],
      reportChose: [
        {
          name: '问题上报',
          value: '问题上报',
        },
        {
          name: '新增缺陷',
          value: '新增缺陷',
        },
        {
          name: '无需上报',
          value: '无需上报',
        },
      ],
      rules: {
      },
      previewURL: '/sys-storage/download_image?f8s=',
      upimgPreview: [],
      headers: {},
      url: {
        // 本页面使用到的url
        uploadFile: 'sys-storage/upload',
        findFile: 'ecidi-cmp/file/cmpFileGroup/findFilesByGroupId',
      },
      pollingFlag: false,
      pollingGapTime: 3,
      trackPointList: [],
      trackPointTimeList: [],
      overSpeedTrackLineList: [],
      trackLocation_start: '',
      trackLocation_end: '',
      showVisible: false,
      reportShow: false, // 问题上报面板显示
      accessToken: this.$storage.get('access_token'),
      header: {},
      formToken: '',
      // 问题上报list
      problemDataList1: [],
      // 设施缺陷list
      problemDataList2: [],
      // 液位输入框是否显示
      waterLevelShow: false,
      // 巡检要点list数据
      keyPointsInspectionList: [],
    }
  },
  computed: {
    buttonAreaStyle() {
      return {
        '--width': this.buttonList.length * (80 + 10) + 'px',
      }
    },
  },
  created() {
    // 获取问题上报和设施缺陷数据
    this.getCardListData()
  },
  mounted() {
    document.addEventListener("pause", this.pause, false)
    document.addEventListener("resume", this.resume, false)
    this.userInfo = this.$store.state.userInfo
    console.log('this.userInfo: ', this.userInfo);
    this.isStart = false
    localStorage.setItem('startRecordLines', 'end')
    this.navbarTitle = '日常任务'
    let that = this
    bus.$off('startSignIn').$on('startSignIn', (feature) => {
      that.startSignIn(feature)
    })
    this.isView = this.$route.query.isView
    const id = this.$route.query.taskId
    this.getTaskById(id)
    this.getTrackRecordsById(id)
  },
  methods: {
    openKeyPointList() {
      this.showKeyList = true
    },
    goToDeal(obj) {
      if (obj.startLongitude && obj.startLatitude) {
        this.flyToPoint([obj.startLongitude, obj.startLatitude])
      } else {
        Toast.warning({
          message: '当前设施无地理坐标信息',
          duration: 2000
        })
        return
      }
    },
    changeBizType(type) {
      this.currentSelect = type
      this.unInspKeyDetailList = []
      if (type == '全部') {
        this.unInspKeyDetailList = this.keyDetailList.filter(it => !it.deviceStatus)
      } else {
        this.unInspKeyDetailList = this.keyDetailList.filter(it => !it.deviceStatus && it.bizType == type)
      }
    },
    // 获取问题上报和设施缺陷数据
    getCardListData() {
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
    async getProblemDataList(params) {
      this.problemDataList1 = []
      this.problemDataList2 = []

      let commonParams = Object.assign({
        sysCode: 'outwork',
        // token: this.accessToken,
        page: {
          current: 1,
          size: 99999, // 查全部
        }
      }, params)
      // 问题上报
      let params1 = {
        ...commonParams,
        smallType: 'abnormal_inform'
      }
      // 设施缺陷
      let params2 = {
        ...commonParams,
        smallType: 'defect'
      }
      let problemPointFeatures = []
      // 问题上报
      await this.getAxiosData(params1, this.problemDataList1)
      // 设施缺陷
      await this.getAxiosData(params2, this.problemDataList2)
      let allProblem = this.problemDataList1.concat(this.problemDataList2)
      allProblem.forEach(it => {
        problemPointFeatures.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: it.lnglat
          },
          properties: {
            id: it.id,
            title: it.title
          }
        })
      })
      this.$refs.mymap.addInspEventLayer(problemPointFeatures)
      this.reportDataIsLoaded = true
    },
    getAxiosData(params, problemDataList) {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/outworkapi/ticketStatisticClient/getTicketList',
          method: 'post',
          data: params,
          headers: this.header,
        }).then((res) => {
          if (res.status == 200) {
            res.data.resultData.records.forEach((item) => {
              console.log('item: ', item);
              problemDataList.push({
                id: item.id, // 工单ID
                title: item.title, // 工单标题
                ticketStatusName: item.ticketStatusName,
                handleType: item.formValue.handleType, // 描述
                createByName: item.createByName, // 创建人
                createTime: item.createTime.substring(0, 10), // 创建时间
                defectFrom: item.formValue.defectFrom,
                faultTypes: item.formValue.detail?.defectType || item.formValue.faultTypes,
                // fileUrl: item.formValue?.handleImgs?.[0]?.fileUrl,
                // 图片地址
                url: item.formValue?.files?.[0]?.url,
                // 发生经纬度
                lnglat: [item.appealLng, item.appealLat] || [item.formValue.deviceDetail.longitude, item.formValue.deviceDetail.latitude],
                // deviceType: item.formValue?.deviceType || [],
                deviceType: item.formValue?.deviceType || item.formValue?.device_type || [],
                questionDescribe: item.formValue.questionDescribe,
              })
            })
            resolve()
          }
          // problemDataList.forEach((item) => {
          //   // console.log('图片地址', item.url)
          // })
        })
      })
    },
    // 问题上报点击标题、设施缺陷点击卡片进入详情页  
    toDetailPanel(cardDetail) {
      this.$router.push({
        name: 'detailProblemOrder',
        query: { id: cardDetail.id }
      })
    },
    // 卡片定位
    flyToPoint(lnglat) {
      mapObj.map.flyTo({ center: lnglat, zoom: 17.5 })
    },
    // 上报
    reportClick() {
      if (this.reportDataIsLoaded) {
        this.reportShow = true
        mapObj.map.setLayoutProperty('eventPointsLayer', 'visibility', 'visible')
      } else {
        Toast.loading({
          message: '上报数据加载中。。。',
          loadingType: 'spinner',
          duration: 1500
        })
        return
      }
    },
    handleClose() {
      mapObj.map.setLayoutProperty('eventPointsLayer', 'visibility', 'none')
    },
    fileChange(file) {
      this.signForm.inspImagesList = []
      if (file.fileList.length == 0) {
        this.attachment = ''
      }
      file.fileList.forEach(it => {
        this.signForm.inspImagesList.push(
          {
            fileId: it.response.groupToken,
            imagesName: it.url
          }
        )
      })
      console.log(this.signForm)
    },
    continueTask() {
      this.stopReason = ''
      this.ifEndTask = false
    },
    stopTask() {
      if (this.stopReason == '') {
        Toast.warning({
          message: '请输入终止原因',
          duration: 1500
        })
        return
      }
      this.ifEndTask = false
      this.endRecordConfirm('end')
    },
    async endTask() {
      if (this.isView) {
        Toast({
          message: '该巡检任务已结束',
          duration: 1500
        })
        return
      }
      // bus.$off('updateData')
      await this.getTaskById(this.$route.query.taskId)
      let hasInspKp = this.changeToInspCount(this.taskDetail.reportRate)
      let allInspKp = this.changeToAllInspCount(this.taskDetail.reportRate)
      if ((allInspKp - hasInspKp == 0) && this.changeToRate(this.taskDetail.coverage) == '100%') {
        this.endRecordConfirm('end')
      } else {
        this.ifEndTask = true
      }
    },
    openPopup() {
      if (this.isView) {
        return
      }
      this.showPopover = true
    },
    onSelect(val) {
      if (this.isView) {
        Toast({
          message: '该巡检任务已结束',
          duration: '1500'
        })
        return
      }
      this.ifTips = true
      mapObj.map.off('click', 'keypointsLayer', this.$refs.mymap.signInBuffer)
      val.text == '问题上报' ? mapObj.map.on('click', this.selectReportPoint) : mapObj.map.on('click', this.selectFlawPoint)
    },
    selectReportPoint(e) {
      let features = mapObj.map.queryRenderedFeatures(e.point)
      if (this.ifTips) {
        this.ifTips = false
      }
      if (features.length > 0) {
        if (
          features[0].source != "inspUser"
          // && features[0].source != "initInspLineSource" 
          && features[0].source != "keypoints"
          && (features[0].geometry.type === "Point")
        ) {
          this.$refs.mymap.addEventObjMarker(features[0], 'device', 'event', { gridId: this.planDetail.gridId, gridName: this.planDetail.gridName, gridManager: { fullName: this.planDetail.gridManager, username: this.planDetail.userName, userId: this.planDetail.userId } });
        } else if (features.length > 1
          && features[1].source != "eventPoints"
          && features[1].source != "inspUser"
          && features[1].source != "keypoints"
          && (features[1].geometry.type === "Point")
        ) {
          this.$refs.mymap.addEventObjMarker(features[1], 'device', 'event', { gridId: this.planDetail.gridId, gridName: this.planDetail.gridName, gridManager: { fullName: this.planDetail.gridManager, username: this.planDetail.userName, userId: this.planDetail.userId } });
        }
      } else {
        this.$refs.mymap.addEventObjMarker(e.lngLat, 'lnglat', 'event', { gridId: this.planDetail.gridId, gridName: this.planDetail.gridName, gridManager: { fullName: this.planDetail.gridManager, username: this.planDetail.userName, userId: this.planDetail.userId } });
      }
      mapObj.map.on('click', 'keypointsLayer', this.$refs.mymap.signInBuffer)
      mapObj.map.off('click', this.selectReportPoint)
    },
    selectFlawPoint(e) {
      let features = mapObj.map.queryRenderedFeatures(e.point)
      if (this.ifTips) {
        this.ifTips = false
      }
      if (features.length > 0) {
        if (
          features[0].source != "eventPoints"
          && features[0].source != "inspUser"
          // && features[0].source != "initInspLineSource" 
          && features[0].source != "keypoints"
          && (features[0].geometry.type === "Point")
        ) {
          this.$refs.mymap.addEventObjMarker(features[0], 'device', 'flaw', { gridId: this.planDetail.gridId, gridName: this.planDetail.gridName });
        } else if (features.length > 1
          && features[1].source != "eventPoints"
          && features[1].source != "inspUser"
          && features[1].source != "keypoints"
          && (features[1].geometry.type === "Point")
        ) {
          this.$refs.mymap.addEventObjMarker(features[1], 'device', 'flaw', { gridId: this.planDetail.gridId, gridName: this.planDetail.gridName });
        }
      } else {
        this.$refs.mymap.addEventObjMarker(e.lngLat, 'lnglat', 'flaw', { gridId: this.planDetail.gridId, gridName: this.planDetail.gridName });
      }
      mapObj.map.on('click', 'keypointsLayer', this.$refs.mymap.signInBuffer)
      mapObj.map.off('click', this.selectFlawPoint)
    },
    getRestTime(time) {
      return time ? new Date(time).getTime() - new Date().getTime() : 0
    },
    changeToInspCount(reportRate) {
      if (reportRate.includes('/')) {
        return Number(reportRate.split('/')[0])
      } else {
        return 0
      }
    },
    changeToAllInspCount(reportRate) {
      if (reportRate.includes('/')) {
        return Number(reportRate.split('/')[1])
      } else {
        return 0
      }
    },
    changeToRate(coverage) {
      if (coverage.includes('/')) {
        let insp = Number(coverage.split('/')[0])
        let uninsp = Number(coverage.split('/')[1])
        if (uninsp) {
          return ((insp / uninsp) * 100).toFixed(2) + '%'
        } else {
          return '0%'
        }
      } else {
        return '0%'
      }
    },
    mapLoaded(mapInstance) {
      console.log('mapLoadedddddddd')
      let that = this
      mapObj.mapInstance = mapInstance
      mapObj.map = mapInstance.map
      // 巡检模拟
      // mapObj.map.on('click', e => {
      //   if (that.trackPointList.length == 0) {
      //     that.trackPointList.push([e.lngLat.lng, e.lngLat.lat])
      //   } else {
      //     that.drawInspLine({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, locTime: that.$dayjs().format('YYYY-MM-DD HH:mm:ss'), locType: 'GPS' })
      //   }
      // })
      mapObj.map.on('click', () => {
        this.showKeyList = false
      })
      this.addMapImg()
      if (typeof yuanchu != 'undefined') {
        yuanchu.locationAMap.requestSingleLocation(
          ['1'],
          (res) => {
            that.currentPosition = JSON.parse(JSON.stringify(res))
            const param = {
              ...that.currentPosition,
            }
            this.$refs.mymap.setInspUserPosition(param)
          },
          (err) => {
            console.log('err=', err)
          }
        )
      }
      // // 巡检模拟
      // mapObj.map.on('click', e => {
      //   that.currentPosition = {
      //     longitude: e.lngLat.lng,
      //     latitude: e.lngLat.lat,
      //     locTime: that.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
      //     locType: 'GPS',
      //   }
      //   const param = {
      //     ...that.currentPosition,
      //   }
      //   this.$refs.mymap.setInspUserPosition(param)
      //   // if (that.trackPointList.length == 0) {
      //   //   that.trackPointList.push([e.lngLat.lng, e.lngLat.lat])
      //   // } else {
      //   //   that.drawInspLine({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, locTime: that.$dayjs().format('YYYY-MM-DD HH:mm:ss'), locType: 'GPS' })
      //   // }
      // })
    },
    // 刷新任务
    refreshTask() {
      const id = this.$route.query.taskId
      this.getTaskById(id, 'refresh')
    },
    async getTrackRecordsById(id) {
      const res = await request({
        url: '/xasw-pipe-operation/inspTask/track',
        method: 'get',
        params: { id, pageNum: 1, pageSize: 9999 },
      })
      if (res && res.status) {
        console.log(res)
      }
    },
    // 根据任务id获取巡检状况
    async getTaskById(id, type = null) {
      let toast = Toast.loading({
        message: '地图加载中...',
        loadingType: 'spinner',
        duration: 0,
        forbidClick: true
      })
      // 处理已巡检管线的接口
      const recordLines = await api.recordedPipeLine({
        taskId: id,
        page: 1,
        size: 9999
      })
      this.lines = []
      if (recordLines.status) {
        this.lines = recordLines.data.records.map((item) => item.pipeId)
      }
      const res = await request({
        url: '/xasw-pipe-operation/inspTask/getById',
        method: 'get',
        params: { id, bizScope: this.$route.query.taskType }
      })
      if (res && res.status) {
        this.taskDetail = res.data.inspTask
        this.planDetail = res.data.inspPlan
        this.buttonList = ['全部'].concat(this.planDetail.bizType.split(','))
        this.inspRangeList = res.data.detailList.map((range) => {
          return {
            taskId: id,
            ...range,
          }
        })
        setTimeout(() => {
          this.legendConfig = [
            {
              label: '污水',
              clickFlag: this.planDetail.bizType.includes('污水') ? true : false
            },
            {
              label: '雨水',
              clickFlag: this.planDetail.bizType.includes('雨水') ? true : false
            },
            {
              label: '供水',
              clickFlag: this.planDetail.bizType.includes('供水') ? true : false
            },
            {
              label: '再生水',
              clickFlag: this.planDetail.bizType.includes('再生水') ? true : false
            }
          ];
        }, 5000)
        // 修改未巡检(0)任务状态至巡检中(1)
        if (this.$route.query.isNew && this.taskDetail.taskStatus != 1) {
          this.startOrEndTaskRecord(1)
        }
        if (type != 'refresh') {
          const allTaskLines = await api.getAllTaskLines({
            devType: '管线',
            gridId: this.planDetail.gridId,
            pageNum: 1,
            pageSize: 999999,
            bizScope: this.$route.query.taskType,
            bizType: this.planDetail.bizType
          })
          if (allTaskLines.status) {
            this.allTaskLines = []
            allTaskLines.data.list.forEach(item => {
              this.allTaskLines.push({
                type: 'Feature',
                id: item.id,
                geometry: JSON.parse(item.geom),
                properties: {
                  id: item.id,
                  length: item['length'],
                  bizType: item.bizType
                }
              })
            })
            this.$refs.mymap.setAllInspLineSource(this.allTaskLines)
          }
        }
        const kpRes = await request({
          url: '/xasw-pipe-operation/inspTask/point',
          method: 'get',
          params: { id, gridId: this.planDetail.gridId, pageNum: 1, pageSize: 9999, bizScope: this.$route.query.taskType, bizType: this.planDetail.bizType },
        })
        this.keyDetailList = []
        if (kpRes && kpRes.status) {
          let keys = Object.keys(kpRes.data)
          keys.forEach((item) => {
            this.keyDetailList.push(...kpRes.data[item].list)
          })
          this.unInspKeyDetailList = this.keyDetailList.filter(it => !it.deviceStatus)
        }
        let completion = this.changeToRate(this.taskDetail.coverage)
        this.navbarTitle = this.taskDetail.taskName
        try {
          const that = this
          let timer = setInterval(function () {
            // 30s后取消
            setTimeout(() => {
              clearInterval(timer)
            }, 30000)
            if (that.$refs.mymap && that.$refs.mymap.isOnLoaded()) {
              clearInterval(timer)
              that.$refs.mymap.addKeyPoints(that.keyDetailList)
              if (type != 'refresh') {
                that.$refs.mymap.addRangeList(that.inspRangeList)
              }
              const params = {
                extParam: {
                  task_id: that.$route.query.taskId
                }
              }
              // 问题上报、设施缺陷接口
              that.getProblemDataList(params)
              that.$refs.mymap.addInspRecordTileLineSource(that.lines, completion)
              toast.clear()
              if (!that.currentPosition) return
              const param = {
                ...that.currentPosition,
              }
              that.$refs.mymap.setInspUserPosition(param)
            }
          }, 500)
        } catch (e) {
          console.log(e)
        }
      } else {
        Toast({
          message: '网络状态较差，加载任务失败',
          icon: 'warn',
          duration: 3000
        })
      }
    },
    pause() {
      console.log('进入后台')
      if (this.ifRecording && this.isResume) {
        this.isResume = false
      }
    },
    resume() {
      console.log('进入前台')
      if (this.ifRecording) {
        this.isResume = true
        pauseStateTrackPoints.length > 0 && this.upLoadPauseStateTrackPoints(this.deepClone(pauseStateTrackPoints))
        pauseStatePipeIdList.length > 0 && this.upLoadPauseStatePipeIdList(this.deepClone(pauseStatePipeIdList))
      }
    },
    upLoadPauseStatePipeIdList(data) {
      let that = this
      api.recordInspLine(data).then(async res => {
        if (res.status) {
          console.log('后台巡检管线补充数据上传成功')
          pauseStatePipeIdList.splice(0, data.length) // 移除上传成功的数据。避免重复上传
          const res = await request({
            url: '/xasw-pipe-operation/inspTask/getById',
            method: 'get',
            params: { id: that.$route.query.taskId, bizScope: that.$route.query.taskType }
          })
          if (res.status) {
            that.taskDetail = res.data.inspTask
          }
        } else {
          that.$refs.mymap.uploadFiledPipeIdList.push(...data)
        }
      }).catch(err => {
        setTimeout(() => {
          this.upLoadPauseStatePipeIdList(data)
        }, 5 * 1000)
      })
    },
    upLoadPauseStateTrackPoints(data) {
      api.inspectionTrack(data).then((res) => {
        if (res && res.status) {
          console.log('后台巡检轨迹补充点位上传成功')
          pauseStateTrackPoints.splice(0, data.length) // 移除上传成功的点位。避免重复上传
        } else {
          console.log('后台巡检轨迹补充点位上传异常')
          this.reportFailTrackPoints.push(...data)
        }
      })
      .catch((err) => {
        setTimeout(() => {
          this.upLoadPauseStateTrackPoints(data)
        }, 5 * 1000)
      })
    },
    // 轮询 currentPosition，绘制轨迹线
    polling() {
      let that = this
      if (that.pollingFlag) {
        if (typeof yuanchu != 'undefined') {
          yuanchu.locationAMap.requestLocations(
            [that.$route.query.taskType == '人巡' ? '4' : '2', '1', '20', '100', '0', true],
            (res) => {
              console.log(res)
              that.drawInspLine(res)
            },
            (err) => {
              // Toast.error({
              //   message: 'err' + err,
              //   duration: 2000,
              // })
            }
          )
        }
      }
    },
    drawInspLine(position) {
      const that = this
      that.currentPosition = JSON.parse(JSON.stringify(position))
      that.currentPosition = Object.assign(that.currentPosition, {
        direction: 0
      })
      if (that.currentPosition.locType != 'SAME_REQ' && that.currentPosition.locType != 'FIX_CACHE') { // 过滤缓存定位数据
        let lastPoint = that.trackPointList[that.trackPointList.length - 1]
        let distance = that.GetDistance(lastPoint, [that.currentPosition.longitude, that.currentPosition.latitude]) * 1000
        // 记录过程点
        that.postTrackData_Point(
          that.trackPointList[that.trackPointList.length - 1],
          that.trackPointTimeList[that.trackPointTimeList.length - 1],
          distance
        ).then(res => {
          if (res) {
            // 改变巡检轨迹缓冲区范围内的管线颜色
            let geom = {
              type: 'LineString',
              coordinates: [
                [lastPoint[0], lastPoint[1]],
                [that.currentPosition.longitude, that.currentPosition.latitude],
              ]
            }
            let promise = new Promise((resolve, reject) => {
              that.changeInspLineSourceBySpeed(geom, resolve)
            })
            promise.then(r => {
              if (r) {
                that.trackPointList.push([
                  that.currentPosition.longitude,
                  that.currentPosition.latitude
                ])
                that.trackPointTimeList.push(that.currentPosition.locTime)
                // 构造临时线对象
                let jsonLine = {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: that.trackPointList,
                  },
                }
                const coord = [parseFloat(that.currentPosition.longitude), parseFloat(that.currentPosition.latitude)];
                const point = turf.point(coord);
                mapObj.mapInstance.setSourceData("inspUser", {
                  type: "FeatureCollection",
                  features: [point]
                })
                let jsonLineFeatureCollection = {
                  type: 'FeatureCollection',
                  features: [jsonLine],
                }
                if (mapObj.map.getSource('trackLineSource_now')) {
                  mapObj.map.getSource('trackLineSource_now').setData(jsonLineFeatureCollection)
                } else {
                  mapObj.map.addSource('trackLineSource_now', {
                    type: 'geojson',
                    data: jsonLineFeatureCollection,
                  })
                }
                if (mapObj.map.getLayer('trackLineLayer_now')) {
                } else {
                  mapObj.map.addLayer({
                    id: 'trackLineLayer_now',
                    type: 'line',
                    source: 'trackLineSource_now',
                    layout: {
                      'line-cap': 'round',
                      'line-join': 'round',
                      'line-sort-key': 1,
                      visibility: 'visible',
                      // visibility: "none"
                    },
                    paint: {
                      'line-color': '#addd52',
                      'line-width': 5,
                      'line-opacity': 0.8
                    },
                  }, 'inspUserLayer')
                }
                if (mapObj.map.getLayer('trackLineLayer_arrow')) {
                } else {
                  mapObj.map.addLayer({
                    id: 'trackLineLayer_arrow',
                    type: 'symbol',
                    source: 'trackLineSource_now',
                    layout: {
                      'symbol-placement': 'line',
                      'symbol-spacing': 20,
                      'icon-image': 'arrowIcon',
                      'icon-size': 0.5,
                      'icon-allow-overlap': true,
                      'symbol-sort-key': 3,
                      visibility: 'visible'
                    },
                  }, 'inspUserLayer')
                }
              }
            })
          }
        })
      }
    },
    // 根据速度改变巡检管线颜色
    changeInspLineSourceBySpeed(position, resolve) {
      // const coord = [parseFloat(position.longitude), parseFloat(position.latitude)];
      // const point = turf.point(coord);
      const that = this
      try {
        // 改变周围要素的状态
        let buffered = turf.buffer(position, that.$route.query.taskType == '人巡' ? 0.025 : 0.045, { unit: 'kilometers' });
        that.changeInspLineState(buffered, resolve);
      } catch (e) {
        console.log(e);
      }
    },
    // 设置巡检管线为已巡检
    changeInspLineState(geometry, resolve) {
      let that = this
      // 将地理坐标系转化为屏幕坐标系
      function geoTransToPixel(geom) {
        const polygonBox = turf.bbox(geom);
        const southWest = [polygonBox[0], polygonBox[1]];
        const northEast = [polygonBox[2], polygonBox[3]];
        let southWestPointPixel = mapObj.map.project(southWest);
        let northEastPointPixel = mapObj.map.project(northEast);
        // 增大bbox的查询范围
        southWestPointPixel = [
          southWestPointPixel.x - 50,
          southWestPointPixel.y + 50
        ]
        northEastPointPixel = [
          northEastPointPixel.x + 50,
          northEastPointPixel.y - 50
        ]
        return [southWestPointPixel, northEastPointPixel];
      }
      // 对每个划分出来的bbox进行处理
      function chunk(geom, resolve) {
        const boxFeatures = mapObj.map.queryRenderedFeatures(geoTransToPixel(geom), {
          layers: ["initInspLineLayer"]
        });
        console.log(boxFeatures, 'boxFeatures')
        let tempPipeList = []
        boxFeatures.forEach(feat => {
          try {
            const result = turf.booleanDisjoint(feat.geometry, geometry)
            // 如果查出的要素与真实的范围相交且没有被巡检过，则改变其状态,并记录其关键字
            if (!result && !feat.state.isInsp) {
              mapObj.map.setFeatureState({
                source: feat.source,
                id: feat.id
              }, { isInsp: true })
              if (!tempPipeList.map(it => it.pipeId).includes(feat.id)) {
                let date = that.$dayjs().format('YYYY-MM-DD HH:mm:ss')
                tempPipeList.push({
                  inspDate: date,
                  pipeId: feat.id,
                  ext3: feat.properties.bizType,
                  pipeLength: feat.properties['length'] || 0,
                  taskId: that.$route.query.taskId
                })
              }
            }
          } catch (error) {
            console.log(error)
          }
        })
        if (that.isResume) {
          tempPipeList.length > 0 && api.recordInspLine(tempPipeList).then(async res => {
            if (res.status) {
              const res = await request({
                url: '/xasw-pipe-operation/inspTask/getById',
                method: 'get',
                params: { id: that.$route.query.taskId, bizScope: that.$route.query.taskType }
              })
              if (res.status) {
                that.taskDetail = res.data.inspTask
              }
            } else {
              console.log('上传失败的tempPipeList: ', tempPipeList);
              that.$refs.mymap.uploadFiledPipeIdList.push(...tempPipeList)
            }
          })
        } else {
          tempPipeList.length > 0 && pauseStatePipeIdList.push(...tempPipeList)
        }
        resolve(true)
      }
      // function cb(features) {
      //   if (features.length > 0) {
      //     setTimeout(() => {
      //       chunk(features.shift());
      //       cb(features);
      //     }, 100);
      //   }
      // }
      chunk(geometry, resolve)
      // cb([geometry]);
    },
    // 绘制起始点
    drawStartPoint() {
      let that = this
      return new Promise(function (resolve, reject) {
        if (typeof yuanchu != 'undefined') {
          yuanchu.locationAMap.requestSingleLocation(
            ['1'],
            (res) => {
              that.currentPosition = JSON.parse(JSON.stringify(res))
              const param = {
                ...that.currentPosition,
              }
              console.log(res)
              that.$refs.mymap.setInspUserPosition(param)
              if (that.currentPosition != null) {
                let recordData = []
                recordData.push({
                  taskId: that.taskDetail.id, // 任务id
                  longitude: that.currentPosition.longitude,
                  latitude: that.currentPosition.latitude,
                  inspTime: that.currentPosition.locTime,
                  distance: 0, // 第一个点距离为0
                  inspDate: that.currentPosition.locTime,
                  inspector: that.userInfo.userFullName,
                })
                api.inspectionTrack(recordData)
                  .then((res) => {
                    if (res && res.status) {
                      // 使用上报点位作为起点
                      console.log('起始点存储成功')
                      that.trackPointList.push([that.currentPosition.longitude, that.currentPosition.latitude])
                      that.trackPointTimeList.push(that.currentPosition.locTime)
                      let jsonPoint = {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                          type: 'Point',
                          coordinates: [that.currentPosition.longitude, that.currentPosition.latitude],
                        },
                      }
                      let jsonPointFeatureCollection = {
                        type: 'FeatureCollection',
                        features: [jsonPoint],
                      }
                      if (mapObj.map.getSource('startPointSource_now')) {
                        mapObj.map.getSource('startPointSource_now').setData(jsonPointFeatureCollection)
                      } else {
                        mapObj.map.addSource('startPointSource_now', {
                          type: 'geojson',
                          data: jsonPointFeatureCollection,
                        })
                      }
                      if (mapObj.map.getLayer('startPointLayer_now')) {
                      } else {
                        mapObj.map.addLayer({
                          id: 'startPointLayer_now',
                          type: 'circle',
                          source: 'startPointSource_now',
                          layout: {
                            'circle-sort-key': 5,
                            visibility: 'visible',
                            // visibility: "none"
                          },
                          paint: {
                            'circle-radius': 3,
                            'circle-stroke-width': 5,
                            'circle-stroke-color': '#2A83E6',
                            'circle-color': 'white',
                          },
                        }, 'inspUserLayer')
                      }
                      // label
                      if (mapObj.map.getLayer('startPoint_label')) {
                      } else {
                        mapObj.map.addLayer({
                          id: 'startPoint_label',
                          type: 'symbol',
                          source: 'startPointSource_now',
                          layout: {
                            'symbol-placement': 'point',
                            'icon-image': 'start_point',
                            'icon-size': 0.6,
                            'icon-offset': [0, -35],
                            'icon-allow-overlap': true,
                            'symbol-sort-key': 2,
                            visibility: 'visible',
                            // visibility: "none"
                          },
                        })
                      }
                      resolve(true)
                    } else {
                      resolve(false)
                    }
                  })
                  .catch((err) => {
                    reject(err)
                  })
              }
            },
            (err) => {
              console.log('err=', err)
            }
          )
        }
      })
    },
    // 绘制终止点
    async drawEndPoint(type) {
      let that = this
      if (that.currentPosition != null) {
        let lastPoint = that.trackPointList[that.trackPointList.length - 1]
        let distance = that.GetDistance(lastPoint, [that.currentPosition.longitude, that.currentPosition.latitude]) * 1000
        let toast = Toast.loading({
          message: '程序关闭中',
          loadingType: 'spinner',
          duration: 0,
          forbidClick: true
        })
        // 记录终止点
        that.postTrackData_Point(
          that.trackPointList[that.trackPointList.length - 1],
          that.trackPointTimeList[that.trackPointTimeList.length - 1],
          distance
        ).then(res => {
          if (res) {
            toast.close()
            Toast.info({
              message: '暂停成功',
              duration: 1000
            })
            if (typeof yuanchu != 'undefined') {
              yuanchu.locationAMap.stopRequestLocations()
            }
            that.trackPointList.push([that.currentPosition.longitude, that.currentPosition.latitude])
            that.trackPointTimeList.push(that.currentPosition.locTime)
            let jsonPoint = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [that.currentPosition.longitude, that.currentPosition.latitude],
              },
            }
            let jsonPointFeatureCollection = {
              type: 'FeatureCollection',
              features: [jsonPoint],
            }
            if (mapObj.map.getSource('endPointSource_now')) {
              mapObj.map.getSource('endPointSource_now').setData(jsonPointFeatureCollection)
            } else {
              mapObj.map.addSource('endPointSource_now', {
                type: 'geojson',
                data: jsonPointFeatureCollection,
              })
            }
            if (mapObj.map.getLayer('endPointLayer_now')) {
            } else {
              mapObj.map.addLayer({
                id: 'endPointLayer_now',
                type: 'circle',
                source: 'endPointSource_now',
                layout: {
                  'circle-sort-key': 5,
                  visibility: 'visible',
                  // visibility: "none"
                },
                paint: {
                  'circle-radius': 3,
                  'circle-stroke-width': 5,
                  'circle-stroke-color': '#addd52',
                  'circle-color': 'white',
                },
              }, 'inspUserLayer')
            }

            // 补充trackline
            let jsonLine = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: that.trackPointList,
              },
            }
            let jsonLineFeatureCollection = {
              type: 'FeatureCollection',
              features: [jsonLine],
            }
            if (mapObj.map.getSource('trackLineSource_now')) {
              mapObj.map.getSource('trackLineSource_now').setData(jsonLineFeatureCollection)
            } else {
              mapObj.map.addSource('trackLineSource_now', {
                type: 'geojson',
                data: jsonLineFeatureCollection,
              })
            }
            if (mapObj.map.getLayer('trackLineLayer_now')) {
            } else {
              mapObj.map.addLayer({
                id: 'trackLineLayer_now',
                type: 'line',
                source: 'trackLineSource_now',
                layout: {
                  'line-cap': 'round',
                  'line-join': 'round',
                  visibility: 'visible',
                  // visibility: "none"
                },
                paint: {
                  'line-color': '#addd52',
                  'line-width': 5,
                  'line-opacity': 0.8,
                },
              }, 'inspUserLayer')
            }
            // label
            if (mapObj.map.getLayer('endPoint_label')) {
            } else {
              mapObj.map.addLayer({
                id: 'endPoint_label',
                type: 'symbol',
                source: 'endPointSource_now',
                layout: {
                  'symbol-placement': 'point',
                  'icon-image': 'end_point',
                  'icon-size': 0.6,
                  'icon-offset': [0, -35],
                  'icon-allow-overlap': true,
                  'symbol-sort-key': 2,
                  visibility: 'visible',
                  // visibility: "none"
                },
              })
            }
            // 上传之前上传失败的点位
            that.reportFailTrackPoints.length > 0 && that.postFailTrackData()
            that.$refs.mymap.uploadFiledPipeIdList.length > 0 && api.recordInspLine(that.$refs.mymap.uploadFiledPipeIdList).then(res => {
              if (res.status) {
                console.log('管线补充上传成功')
                that.$refs.mymap.uploadFiledPipeIdList = []
              }
            })
            if (type == 'end') {
              this.startOrEndTaskRecord(2) // 已巡检状态 '2'
            } else {
              this.pollingFlag = false
              this.ifRecording = false
              localStorage.setItem('startRecordLines', 'end')
              if (type == 'pause') {
                Toast.success({
                  message: '暂停成功',
                  duration: 2000
                })
                this.refreshTask()
              } else if (type == 'leave') {
                this.$router.go(-1)
              }
            }
          } else {
            Toast.error({
              message: type == 'end' ? '结束失败' : '暂停失败'
            })
          }
        })
      } else {
        let type = type
        let timer = setTimeout(() => {
          that.drawEndPoint(type)
        }, 1000)
      }
    },
    async postFailTrackData() {
      let that = this
      await api
        .inspectionTrack(that.reportFailTrackPoints)
        .then((res) => {
          if (res && res.status) {
            console.log('轨迹存储成功')
            that.reportFailTrackPoints = []
          }
        })
        .catch((err) => {
          console.log('巡检轨迹存储失败：' + err)
        })
    },

    // 单点-后端记录轨迹数据
    postTrackData_Point(pointData, timeData, distance) {
      return new Promise(async (resolve, reject) => {
        let that = this
        for (let p = 0; p < pointData.length; p++) {
          pointData[p] = Number(pointData[p])
        }
        let date_now = dayjs().format('YYYY-MM-DD HH:mm:ss')
        let recordData = []
        recordData.push({
          taskId: that.taskDetail.id,
          inspDate: timeData,
          inspTime: date_now,
          distance,
          inspector: that.userInfo.userFullname,
          longitude: pointData[0],
          latitude: pointData[1],
        })
        if (that.isResume) {
          await api
            .inspectionTrack(recordData)
            .then((res) => {
              if (res && res.status) {
                console.log('轨迹存储成功', recordData)
                resolve(true)
              } else {
                // 上传失败的点位，暂时存在app端
                that.reportFailTrackPoints.push(recordData)
                console.log('that.reportFailTrackPoints: ', that.reportFailTrackPoints);
                resolve(true)
              }
            })
        } else {
          pauseStateTrackPoints.push(...recordData)
          resolve(true)
        }
      })
    },
    startOrEndTaskRecord(status) {
      let data = {
        planId: this.planDetail.id,
        taskName: this.taskDetail.taskName,
        taskCode: this.taskDetail.taskCode,
        taskStatus: status,
        id: this.taskDetail.id,
        taskType: this.taskDetail.taskType,
        bizType: this.planDetail.bizType,
        ext1: status == 2 ? this.stopReason : ''
      }
      if (status == 1) {
        data.planStartTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else if (status == 2) {
        data.planEndTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      let that = this
      api.changeTaskStatus(data).then((res) => {
        if (res.status) {
          if (status == 2) {
            Toast.success({
              message: '结束成功',
              duration: 2000,
              onClose: () => {
                that.pollingFlag = false
                that.ifRecording = false
                localStorage.setItem('startRecordLines', 'end')
                that.isView = true
                that.$router.go(-1)
              }
            })
          }
        } else {
          if (status == 2) {
            Toast.error({
              message: '结束失败, 请重试',
              duration: 1500
            })
          }
        }
      })
    },
    // 清除缓存的轨迹数据
    clearBufferTrack() {
      let that = this
      that.isResume = true
      that.ifRecording = false
      that.currentPosition = null
      //数组归零
      that.trackPointList = []
      that.trackPointTimeList = []
      that.overSpeedTrackLineList = []
      pauseStateTrackPoints = []
      pauseStatePipeIdList = []
      //数据源清空
      if (mapObj.map.getSource('trackLineSource_now')) {
        mapObj.map.getSource('trackLineSource_now').setData({
          type: 'FeatureCollection',
          features: [],
        })
      }
      if (mapObj.map.getSource('trackLineSource_overSpeed')) {
        mapObj.map.getSource('trackLineSource_overSpeed').setData({
          type: 'FeatureCollection',
          features: [],
        })
      }
      if (mapObj.map.getSource('startPointSource_now')) {
        mapObj.map.getSource('startPointSource_now').setData({
          type: 'FeatureCollection',
          features: [],
        })
      }

      if (mapObj.map.getSource('endPointSource_now')) {
        mapObj.map.getSource('endPointSource_now').setData({
          type: 'FeatureCollection',
          features: [],
        })
      }
    },
    addMapImg() {
      mapObj.map.loadImage(
        require('@assets/img/inspection/white_arrow_right.png'),
        function (error, image) {
          if (error) throw error
          if (!mapObj.map.hasImage('arrowIcon')) {
            mapObj.map.addImage('arrowIcon', image, {})
          }
        }
      )
      mapObj.map.loadImage(
        require('@assets/img/inspection/icon_starting_point.png'),
        function (error, image) {
          if (error) throw error
          if (!mapObj.map.hasImage('start_point')) {
            mapObj.map.addImage('start_point', image, {})
          }
        }
      )
      mapObj.map.loadImage(
        require('@assets/img/inspection/icon_at_end.png'),
        function (error, image) {
          if (error) throw error
          if (!mapObj.map.hasImage('end_point')) {
            mapObj.map.addImage('end_point', image, {})
          }
        }
      )
    },
    // 开始记录 上传起点成功后才进入巡检过程
    startInspRecord() {
      if (this.isView) {
        Toast({
          message: '该巡检任务已结束',
          duration: 1500
        })
        return
      }
      if (!this.currentPosition || !this.currentPosition.longitude) {
        Toast.warning({
          message: '当前GPS信号弱，请稍后尝试',
          duration: 2000
        })
        return
      }
      this.clearBufferTrack()
      let toast = Toast.loading({
        message: '程序启动中',
        loadingType: 'spinner',
        duration: 0,
        forbidClick: true
      })
      this.drawStartPoint()
        .then((res) => {
          if (res) {
            toast.close()
            Toast.info({
              message: '开始记录',
              duration: 1500
            })
            this.pollingFlag = true
            this.ifRecording = true
            localStorage.setItem('startRecordLines', 'start')
            // 开始轮询
            this.polling()
            // 记录当前时间
            this.startRecordTimer = new Date()
          } else {
            Toast.error({
              message: '接口异常，无法开始任务',
              duration: 2000
            })
          }
        })
        .catch((err) => {
          console.log(err)
          Toast.error({
            message: '网络状态异常，正在重试',
            duration: 2000
          })
          setTimeout(() => {
            this.drawStartPoint()
          }, 5000)
        })
    },
    // 结束记录
    endRecord(type) {
      let diff = Math.floor((new Date() - this.startRecordTimer) / 1000)
      if (diff <= 10) {
        Toast.info({
          message: `结束太快了,请${10 - diff}秒后再试`,
          duration: 1000
        })
        return
      }
      this.endRecordConfirm(type)
    },
    // 结束记录确认
    endRecordConfirm(type) {
      this.drawEndPoint(type)
    },
    // 开始定位
    startLocation() {
      let that = this
      yuanchu.locationAMap.requestSingleLocation(
        ['1'],
        (res) => {
          that.currentPosition = JSON.parse(JSON.stringify(res))
          const param = {
            ...that.currentPosition,
          }
          if (!that.currentPosition || !that.currentPosition.longitude || !that.currentPosition.latitude) {
            Toast.error({
              message: '获取位置失败!',
              duration: 2000
            })
            return
          } else {
            const coord = [parseFloat(that.currentPosition.longitude), parseFloat(that.currentPosition.latitude)]
            that.$refs.mymap.setInspUserPosition(param)
            that.flyToPoint(coord)
          }
        },
        (err) => {
          console.log('err=', err)
        }
      )
    },
    goEventOrFlawDetail(feature, type) {
      let currentPoint = feature
      console.log(feature)
      currentPoint = feature
      currentPoint.bigType = feature.bizType || ''
      currentPoint.gridId = this.planDetail.gridId
      currentPoint.gridName = this.planDetail.gridName
      currentPoint.gridManager = { fullName: this.planDetail.gridManager, username: this.planDetail.userName }
      currentPoint.lng = feature.geom.coordinates[0]
      currentPoint.lat = feature.geom.coordinates[1]
      currentPoint.road_name = feature.road || ''
      currentPoint.smallType = feature.deviceType || ''
      currentPoint.code = feature.deviceId || ''
      currentPoint.taskId = this.taskDetail.id
      if (type == 'event') {
        this.$router.push({
          name: 'addProblemIndex',
          query: { msg: currentPoint, token: this.formToken, taskId: this.$route.query.taskId, from: 'insp' },
          params: { type: 'add' },
        })
      } else {
        this.$router.push({
          name: 'addFlaws',
          query: { msg: currentPoint, token: this.formToken, taskId: this.$route.query.taskId, from: 'insp' },
          params: { type: 'add' }
        })
      }
    },
    // 确认
    onConfirm() {
      if (true) {
        let that = this
        let feature = this.signForm.feature
        let copySignForm = this.deepClone(this.signForm)
        if (that.attachment == '') {
          Notify({ type: 'error', message: '请上传附件' })
          return
        }
        // 液位输入框是否显示（污水检查井必须填写液位字段）
        if (this.waterLevelShow == true) {
          if (copySignForm.liquidLevel == '') {
            Notify({ type: 'error', message: '请输入液位' })
            return
          }
        }
        copySignForm.inspDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
        copySignForm.ext1 = copySignForm.remark // 备注
        copySignForm.ext2 = '1' // 巡检记录的ext2字段，默认为1（待复核），已通过为2，已退回为3
        delete copySignForm.feature

        // resultList通过巡检要点list处理并添加到form中
        let resultList = []
        let textInFlag = false
        // 巡检要点list数据
        if (this.keyPointsInspectionList.length > 0) {
          this.keyPointsInspectionList.forEach(item => {
            resultList.push({
              mainId: item.id, // 巡检要点id
              mainPoint: item.mainPoint, // 巡检要点名称
              mainValue: item.mainValue, // 该要点巡检结果
              ext1: item.inputType, // 巡检要点输入类型，用于查询详情时判断html结构
            })
          })
          for (let i = 0; i < resultList.length; i++) {
            // 不为''或者全空格
            if (resultList[i].mainValue == '' || resultList[i].mainValue.trim() == '') {
              textInFlag = true
            }
          }
        }
        if (textInFlag) {
          Notify({ type: 'error', message: '请将巡检要点补充完整' })
          return
        }
        copySignForm.resultList = resultList
        console.log('提交参数', _cloneDeep(copySignForm));
        
        api.signIn(copySignForm).then((res) => {
          if (res && res.status) {
            Toast.success({
              message: '此关键点签到成功',
              duration: 1000,
              forbidClick: true,
              onClose: () => {
                // 巡检事件上报
                if (copySignForm.isReport == '问题上报') {
                  that.goEventOrFlawDetail(feature, 'event');
                } else if (copySignForm.isReport == '新增缺陷') {
                  that.goEventOrFlawDetail(feature, 'flaw');
                } else {
                  that.refreshTask()
                }
              }
            })
          } else {
            Toast.error({
              message: '此关键点签到失败',
              duration: 2000
            })
          }
          this.signShow = false
          this.signForm.remark = ''
          this.signForm.liquidLevel = ''
          this.signForm.deviceStatus = '0'
          this.signForm.isReport = ''
          this.signForm.inspImagesList = []
          this.attachment = ''
          mapObj.mapInstance.setSourceData('buffered', {
            type: 'FeatureCollection',
            features: [],
          })
        })
        // localStorage.setItem("isReportEvent", false);
      } else {
        console.log('验证失败')
      }
    },
    // 取消
    onCancel() {
      this.signShow = false
      mapObj.mapInstance.setSourceData('buffered', {
        type: 'FeatureCollection',
        features: [],
      })
    },
    cancelLeave() {
      this.ifLeaveTask = false
    },
    confirmLeave() {
      this.ifLeaveTask = false
      this.endRecord('leave')
    },
    clickBack() {
      if (this.ifRecording) {
        this.ifLeaveTask = true
      } else {
        this.$router.go(-1)
      }
    },
    // 签到
    async startSignIn(feature) {
      console.log('--------签到--------', feature);
      if (feature.bizType == '污水' && feature.deviceType == '检查井') {
        // 液位输入框是否显示
        this.waterLevelShow = true
      } else {
        this.waterLevelShow = false
      }
      this.pointListShow = false
      this.attachment = ''
      this.signForm.isReport = ''
      this.deviceName = feature.deviceType + (feature.deviceId || '')
      // -----------------------------------------------------------------------------------------------------
      //  deviceStatus状态（0正常 1异常 2未巡检） 巡检记录的ext2字段，默认为1（待复核），已通过为2，已退回为3
      if (!feature.deviceStatus || feature.deviceStatus == '2' || feature.ext2 == '3') {
        if (this.$route.query.isView) {
          Toast.warning({
            message: '任务已结束，无法继续打卡',
            duration: 2000
          })
          mapObj.map.getSource('buffered') &&
            mapObj.mapInstance.setSourceData('buffered', {
              type: 'FeatureCollection',
              features: [],
            })
          return
        }
        // 利用feature来判断是否处于35m范围内，如果处于，可以进行签到，否则不能进行签到
        const position = this.currentPosition
        if (!position) {
          Toast.warning({
            message: '获取不到巡检人位置',
            duration: 2000
          })
          mapObj.map.getSource('buffered') &&
          mapObj.mapInstance.setSourceData('buffered', {
            type: 'FeatureCollection',
            features: [],
          })
          return
        }
        const coord = [
          parseFloat(position.longitude),
          parseFloat(position.latitude),
        ]
        const point = turf.point(coord)
        const engGeom = feature.geom
        const buffered = turf.buffer(engGeom, 0.020, { unit: 'kilometers' })
        const isInBuffer = turf.inside(point, buffered)
        if (!isInBuffer) {
          Toast.warning({
            message: '未处于该关键点范围内',
            duration: 2000
          })
          return
        }
        console.log('feature数据', feature);
        // 巡检要点list数据
        this.keyPointsInspectionList = []
        let params4 = {
          bizType: feature.bizType, // 业务类型（污水）
          objectType: feature.deviceType, // 巡检对象类型名称（检查井）
        }
        // app端根据类型查询启用的巡检要点列表
        api.inspPointCheckList(params4)
          .then(res => {
            this.keyPointsInspectionList = res?.data?.filter((item) => {
              return item.mainStatus === "启用中"
              // item = {
              //   "id": "1655843007768236033",
              //   "createBy": "fawkes",
              //   "createDate": "2023-05-09 15:51:51",
              //   "updateBy": null,
              //   "updateDate": null,
              //   "deleteFlag": 0,
              //   "mainPoint": "井内是否有大量淤积或杂物影响排水",
              //   "inputType": "是/否",
              //   "unit": "/",
              //   "mainStatus": "启用中",
              //   "bizType": "污水",
              //   "objectType": "检查井",
              //   "remarks": null,
              //   "portalId": null,
              //   "tenantId": 100000
              // }
            }) || []
            // 巡检要点list数据
            if (this.keyPointsInspectionList.length > 0) {
              this.keyPointsInspectionList.forEach((item) => {
                let iT = ['']
                // 如果inputType中存在'/'，则将其转换成数组，巡检要点结果mainValue默认为第一个值（"inputType": "是/否",），否则mainValue为''
                if (item.inputType.indexOf('/') > -1) {
                  iT = item.inputType.split('/')
                }
                this.$set(item, 'mainValue', iT[0]) // 该要点巡检结果
              })
            }
            // this.keyPointsInspectionList = [
            //   {
            //     "id": "1655843007768236033",
            //     "createBy": "fawkes",
            //     "createDate": "2023-05-09 15:51:51",
            //     "updateBy": null,
            //     "updateDate": null,
            //     "deleteFlag": 0,
            //     "mainPoint": "测试正常异常测试正常异常测试正常异常测试正常异常",
            //     "inputType": "正常/异常",
            //     "unit": "/",
            //     "mainStatus": "启用中",
            //     "bizType": "污水",
            //     "objectType": "检查井",
            //     "remarks": null,
            //     "portalId": null,
            //     "tenantId": 100000,
            //     "mainValue": "正常"
            //   },
            //   {
            //     "id": "1655843007768236034",
            //     "createBy": "fawkes",
            //     "createDate": "2023-05-09 15:51:51",
            //     "updateBy": null,
            //     "updateDate": null,
            //     "deleteFlag": 0,
            //     "mainPoint": "测试开启关闭测试开启关闭测试开启关闭测试开启关闭",
            //     "inputType": "开启/关闭",
            //     "unit": "/",
            //     "mainStatus": "启用中",
            //     "bizType": "污水",
            //     "objectType": "检查井",
            //     "remarks": null,
            //     "portalId": null,
            //     "tenantId": 100000,
            //     "mainValue": "关闭"
            //   },
            //   {
            //     "id": "1655843007768236035",
            //     "createBy": "fawkes",
            //     "createDate": "2023-05-09 15:51:51",
            //     "updateBy": null,
            //     "updateDate": null,
            //     "deleteFlag": 0,
            //     "mainPoint": "测试是否测试是否测试是否测试是否",
            //     "inputType": "是/否",
            //     "unit": "/",
            //     "mainStatus": "启用中",
            //     "bizType": "污水",
            //     "objectType": "检查井",
            //     "remarks": null,
            //     "portalId": null,
            //     "tenantId": 100000,
            //     "mainValue": "是"
            //   },
            //   {
            //     "id": "1655843007768236035",
            //     "createBy": "fawkes",
            //     "createDate": "2023-05-09 15:51:51",
            //     "updateBy": null,
            //     "updateDate": null,
            //     "deleteFlag": 0,
            //     "mainPoint": "测试数值测试数值测试数值测试数值",
            //     "inputType": "数值",
            //     "unit": "/",
            //     "mainStatus": "启用中",
            //     "bizType": "污水",
            //     "objectType": "检查井",
            //     "remarks": null,
            //     "portalId": null,
            //     "tenantId": 100000,
            //     "mainValue": ""
            //   }
            // ]
            console.log('当前业务及设施类型下的巡检要点list', _cloneDeep(this.keyPointsInspectionList),);
          })
          .catch(err => { })
          .finally(() => {
            this.signShow = true
            // 未巡检
            this.hasSignIn = false
            this.signForm.remark = ''
            this.signForm.liquidLevel = ''
            this.signForm.ext3 = feature.bizType
            this.signForm.deviceStatus = '0'
            this.signForm.inspImagesList = []
            this.signForm.pointId = feature.id
            this.signForm.taskId = this.$route.query.taskId,
            this.signForm.feature = feature
          })
      } else {
        let toast = Toast.loading({
          message: '正在加载',
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        })
        this.hasSignIn = true
        let params = {
          page: 1,
          size: 999,
          deviceStatus: feature.deviceStatus,
          pointId: feature.id,
          taskId: this.$route.query.taskId,
        }
        const res = await request({
          url: '/xasw-pipe-operation/inspPointRecord/page',
          method: 'get',
          params: params,
        })
        if (res && res.status) {
          let result = res.data.records[0]
          this.signForm.deviceStatus = result.deviceStatus
          this.signForm.remark = result.ext1
          this.signForm.liquidLevel = result.liquidLevel
          this.signForm.isReport = result.isReport
          const att = await request({
            url: '/xasw-pipe-operation/inspPointRecord',
            method: 'get',
            params: { id: result.id }
          })
          if (att && att.status) {
            console.log('已巡检关键点详情数据', _cloneDeep(att));
            this.signForm.inspImagesList = att.data.inspImagesList
            this.attachment = att.data.inspImagesList[0].fileId
            // 巡检要点list
            this.keyPointsInspectionList = att?.data?.resultList || []
          }
          toast.clear()
          this.signShow = true
        }
      }
    },
    // 深拷贝
    deepClone(data) {
      return JSON.parse(JSON.stringify(data))
    },
    reportEvent(feature) {
      this.reportFooterShow = false
      this.$router.push({
        path: '/pages/inspectionManage/add-event',
        query: {
          taskId: this.taskDetail.taskId,
          feature: feature,
          rangeList: this.rangeList,
          taskDetail: this.taskDetail,
        },
      })
    },
    GetDistance(coordArray1, coordArray2) {
      let lng1 = coordArray1[0]
      let lat1 = coordArray1[1]
      let lng2 = coordArray2[0]
      let lat2 = coordArray2[1]
      let radLat1 = (lat1 * Math.PI) / 180.0
      let radLat2 = (lat2 * Math.PI) / 180.0
      let a = radLat1 - radLat2
      let b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
      let s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
          )
        )
      s = s * 6378.137 // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000
      return s
    },
    resetMapView() {
      this.$refs.mymap && mapObj.map.resetNorthPitch()
    }
  },
  beforeDestroy() {
    Toast.clear()
    this.pollingFlag = false
    this.clearBufferTrack()
    document.removeEventListener("pause", this.pause)
    document.removeEventListener("resume", this.resume)
    if (typeof yuanchu != 'undefined') {
      yuanchu.locationAMap.stopRequestLocations()
    }
    localStorage.removeItem('startRecordLines')
    bus.$off('startSignIn')
  }
}
</script>
<style lang="less" scoped>
//隐藏滚动条
&::-webkit-scrollbar {
  display: none; //Chrome | Safari
}
/deep/.mapboxgl-popup-content {
  width: auto;
  min-width: 280px;
  height: 50px;
  padding: 24px 36px;
  border-radius: 18px;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
}

.task-map {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .content {
    width: 100%;
    height: 40%;
    background: #ffffff;
    box-shadow: 0px -6px 12px 0px rgba(104, 115, 127, 0.1);
    border-radius: 30px 30px 0 0;
    position: absolute;
    bottom: 0;
    z-index: 4;
    transition: all 0.5s;
    .contentArea {
      width: 100%;
      height: 100%;
      background: #f5f7f9;
      display: flex;
      flex-direction: column;
      .buttonArea {
        width: var(--width);
        padding: 30px 20px;
        display: flex;
        .button {
          min-width: 160px;
          margin: 0 10px;
          border: none;
          box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
        }
      }
      .listArea {
        margin: 0 4%;
        background: #ffffff;
        height: calc(100% - 148px);
        padding: 20px 36px 0;
        border-radius: 16px 16px 0 0;
        overflow-y: scroll;
        .list {
          height: 45px;
          display: flex;
          padding: 40px 0;
          border-bottom: 1px solid #eeeeee;
          .list_num {
            min-width: 60px;
            margin-right: 30px;
            margin-left: 10px;
            height: 43px;
            font-size: 36px;
            font-family: Helvetica-Bold, Helvetica;
            font-weight: bold;
            color: #1b67d8;
            line-height: 43px;
          }
          .list_type {
            min-width: 160px;
            height: 45px;
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 45px;
          }
          .list_id {
            min-width: 200px;
            height: 45px;
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 45px;
          }
          .list_deal {
            height: 45px;
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1b67d8;
            line-height: 45px;
            display: flex;
          }
        }
      }
    }
  }
  .inactive {
    height: 0;
  }

  .tip-tools {
    position: fixed;
    display: flex;
    top: 15%;
    left: 200px;
    border-radius: 16px;
    padding: 24px;
    background: #FFFFFF;
    box-shadow: 0px 10px 18px 0px rgba(0, 0, 0, 0.06);
    border: 2px solid rgba(23, 144, 254, 0.6);

    .tipImg {
      width: 32px;
      height: 32px;
      margin-right: 16px;
    }

    .context {
      font-size: 24px;
      font-family: MicrosoftYaHei;
      color: #1B67D8;
      line-height: 31px;
    }
  }

  .confirm-tip {
    width: 80%;
    height: 44%;
    margin: auto;
    background: #FFFFFF;
    border-radius: 16px;
    margin: 50% auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    /deep/.contentSelf {
      height: calc(100% - 164px);
      padding: 32px;
      display: flex;
      flex-direction: column;
      .icon {
        width: 100%;
        height: 100px;
        display: flex;
        margin: 24px 0 28px;
      }
      .info {
        height: auto;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
        line-height: 40px;
        text-align: center;
      }
    }
    /deep/.confirm_btn {
      width: 100%;
      height: 100px;
      display: flex;
      .btn1 {
        width: 50%;
        height: 100%;
        border-top: 1px solid #DCDEE3;
        font-size: 32px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 100px;
        text-align: center;
      }
      .btn2 {
        border-right: 1px solid #DCDEE3;
      }
    }
  }

  .alert {
    top: 2.22rem;
    position: fixed;
    width: 100%;
    z-index: 4;
    background-color: #62707c;
    opacity: 0.5;
    font-size: 1rem;

    .u-alert-content {
      width: 100%;
    }
  }

  .progress {
    width: 80%;
    height: 1rem;
    background-color: #fff;
    box-shadow: 0 0.4rem 0.6rem 0 rgba(0, 0, 0, 0.2);
    border-radius: 0.1rem;
    margin: 0 0.3rem;
    padding: 0.1rem 0.15rem;
    position: fixed;
    top: 2.5rem;

    &-box {
      width: 100%;
      margin: 0.3rem 0;
      display: flex;

      .pro-dot {
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        float: left;
        margin: auto 0.3rem;
      }

      .pro-text {
        line-height: 0.5rem;
        display: flex;
        font-size: 12px;
        float: left;
      }
    }
  }

  .pro-circle {
    position: fixed;
    width: 1rem;
    height: 1rem;
    right: 0.1rem;
    padding: 0.1rem;
    top: 2.5rem;
    // margin: 0.27rem 0rem;
    background-color: #fff;
    z-index: 3;
    box-shadow: 0rem 0.22rem 0.61rem 0rem rgba(0, 0, 0, 0.2);
    border-radius: 0.1rem;

    .progress-text-view {
      font-size: 0.4rem;
      z-index: 4;

      .progress-text-up {
        color: #306cc8;
      }

      .progress-text-down {
        border-top: 0.05rem solid #555555;
      }
    }
  }

  .point-list {
    position: fixed;
    width: 1.2rem;
    height: 1.2rem;
    left: 0.3rem;
    bottom: 2rem;
    background-color: #fff;
    z-index: 3;
    box-shadow: 0rem 0.22rem 0.61rem 0rem rgba(0, 0, 0, 0.2);
    border-radius: 0.27rem;

    .list-image {
      margin: 0.18rem;
      width: 0.82rem;
      height: 0.82rem;
    }
  }

  .footer {
    width: inherit;
    padding: 1.11rem 0.83rem;
    color: #333333;
    background-color: #ffffff;
    height: 3.55rem;
    z-index: 4;
    position: fixed;
    bottom: 0rem;

    &-content {
      float: left;
    }

    &-btn {
      float: right;
      width: 4.44rem;
      height: 1.77rem;
      line-height: 1.77rem;
      border-radius: 0.88rem;
    }
  }

  .start-record {
    position: absolute;
    z-index: 3;
    left: 50%;
    bottom: 235px;
    transform: translate(-50%, 0);

    img {
      width: 140px;
      height: 140px;
    }
  }

  .controlCard {
    width: 100%;
    height: 328px;
    position: absolute;
    bottom: 0;
    background-image: url('~@/assets/img/inspection/controlBg.png');
    background-repeat: no-repeat;
    background-size: 100%;

    .controlContent {
      margin: 60px 30px 0;
      display: flex;
      flex-direction: column;

      .infoContent {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-bottom: 24px;

        .block {
          text-align: center;
          width: 210px;
          height: 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(27, 103, 216, 0.05);
          border-radius: 16px;
          // margin: 0 20px;

          .rate {
            width: 100%;
            height: 50%;
            display: flex;
            align-items: center;
            margin: auto;
            font-size: 48px;
            font-family: Helvetica-Bold, Helvetica;
            font-weight: bold;
            color: #306cc8;

            .centerStyle {
              margin: auto;
              display: flex;
              align-items: center;
              font-size: 38px;
              font-family: Helvetica-Bold, Helvetica;
              font-weight: bold;

              .inspKp {
                padding-bottom: 3px;
                padding-right: 3px;
                color: #306cc8;
              }

              .uninspKp {
                color: #191919;
                letter-spacing: 3px;
              }
            }
          }

          .name {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            width: 100%;
            height: 33%;
          }
        }
      }

      .bottomSide {
        width: 100%;
        display: flex;
        margin-top: 24px;
        justify-content: space-around;
      }

      .endControl {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .leftText {
          width: 27%;
          display: flex;
          justify-content: space-around;
          align-items: center;

          img {
            width: 32px;
            height: 32px;
            margin: auto;
          }

          /deep/.fm-count-down {
            font-size: 24px;
            color: #306cc8;
          }
        }

        .rightButton {
          display: flex;

          .endBtn {
            font-size: 24px;
            width: 120px;
            height: 60px;
            background: #ffffff;
            color: #306cc8;
          }
        }
      }
    }
  }

  .viewCard {
    width: 100%;
    height: 260px;
    position: absolute;
    bottom: 0;
    background: #FFFFFF;
    box-shadow: 0px 0px 18px 0px rgba(104, 115, 127, 0.18);
    // background-image: url('~@/assets/img/inspection/controlBg.png');
    // background-repeat: no-repeat;
    // background-size: 100%;

    .controlContent {
      margin: 32px 30px 0;
      display: flex;
      flex-direction: column;

      .infoContent {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-bottom: 24px;

        .block {
          text-align: center;
          width: 210px;
          height: 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(27, 103, 216, 0.05);
          border-radius: 16px;
          // margin: 0 20px;

          .rate {
            width: 100%;
            height: 50%;
            display: flex;
            align-items: center;
            margin: auto;
            font-size: 48px;
            font-family: Helvetica-Bold, Helvetica;
            font-weight: bold;
            color: #306cc8;

            .centerStyle {
              margin: auto;
              display: flex;
              align-items: center;
              font-size: 38px;
              font-family: Helvetica-Bold, Helvetica;
              font-weight: bold;

              .inspKp {
                padding-bottom: 3px;
                padding-right: 3px;
                color: #306cc8;
              }

              .uninspKp {
                color: #191919;
                letter-spacing: 3px;
              }
            }
          }

          .name {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            width: 100%;
            height: 33%;
          }
        }
      }

      .bottomSide {
        width: 100%;
        display: flex;
        margin-top: 24px;
        justify-content: space-around;
      }

      .endControl {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .leftText {
          width: 27%;
          display: flex;
          justify-content: space-around;
          align-items: center;

          img {
            width: 32px;
            height: 32px;
            margin: auto;
          }

          /deep/.fm-count-down {
            font-size: 24px;
            color: #306cc8;
          }
        }

        .rightButton {
          display: flex;

          .endBtn {
            font-size: 24px;
            width: 120px;
            height: 60px;
            background: #ffffff;
            color: #306cc8;
          }
        }
      }
    }
  }

  .tool-box {
    position: fixed;
    width: 1.2rem;
    height: auto;
    right: 0.3rem;
    bottom: 350px;

    .refresh {
      width: 1.2rem;
      height: 1.2rem;
      margin-bottom: 0.55rem;
      background-color: #fff;
      z-index: 3;
      box-shadow: 0rem 0.22rem 0.61rem 0rem rgba(0, 0, 0, 0.2);
      border-radius: 0.27rem;

      &-image {
        margin: 0.18rem;
        width: 0.82rem;
        height: 0.82rem;
      }
    }

    .route {
      width: 1.2rem;
      height: 1.2rem;
      margin-bottom: 0.55rem;
      background-color: #fff;
      z-index: 3;
      box-shadow: 0rem 0.22rem 0.61rem 0rem rgba(0, 0, 0, 0.2);
      border-radius: 0.27rem;

      &-image {
        margin: 0.18rem;
        width: 0.82rem;
        height: 0.82rem;
      }
    }

    .location {
      width: 1.2rem;
      height: 1.2rem;
      background-color: #fff;
      z-index: 3;
      box-shadow: 0rem 0.22rem 0.61rem 0rem rgba(0, 0, 0, 0.2);
      border-radius: 60px;

      &-image {
        margin: 0.18rem;
        width: 0.82rem;
        height: 0.82rem;
      }
    }
  }

  /deep/.fm-popup {
    background: #f5f7f9;
  }

  .popup-view {
    height: auto;
    width: auto;
    margin: 32px;
    overflow: scroll;
    border-radius: 32px;
    background-color: #fff;

    /deep/.fm-radio--horizontal {
      margin-right: 20px;
    }

    .title {
      display: flex;
      margin-top: 32px;
      padding-bottom: 32px;
      border-bottom: 1px #f5f5f5 solid;

      img {
        width: 6px;
        height: 40px;
      }

      .deviceId {
        margin-left: 32px;
        font-size: 36px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #191919;
        line-height: 50px;
      }
    }

    /deep/.fm-uploader__wrapper {
      margin-left: 16px;
    }

    .preview-cover {
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
      width: 100%;
      padding: 4px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
    }
  }

  .btnArea {
    display: flex;

    .btn {
      width: 94%;
      margin: 0 auto;
    }

    .btn1 {
      width: 44%;
      margin: 0 12px 0 30px;
    }

    .btn2 {
      width: 44%;
      margin: 0 30px 0 12px;
    }
  }

  .confirm-pop {
    .title {
      border-left: 0.22rem solid #306cc8;
      margin: 0.27rem;
      padding-left: 0.55rem;
    }

    .content {
      border-top: 0.027rem solid rgba(128, 128, 128, 0.322);
      width: 11.66rem;
      padding: 1.33rem;
      text-align: center;
      background-color: #fff;

      &-view {
        font-size: 0.88rem;
      }

      .confirm-btn {
        margin-top: 2.22rem;
        justify-items: center;

        .popup-btn {
          float: left;
          width: 3.33rem;
          height: 1.77rem;
          border-radius: 0.27rem;

          &-l {
            margin-left: 0.55rem;
            margin-right: 0.55rem;
          }

          &-r {
            margin-left: 0.55rem;
            margin-right: 0.55rem;
          }
        }
      }
    }
  }
}
</style>
