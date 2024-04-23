<template>
  <div class="MapPage">
    <fm-nav-bar
      left-arrow
      :title="taskDetail.taskName"
      @click-left="goBackToTask"
      @click-right="onSelect"
    >
      <template #right>
        <template>
          <i
            v-if="!isView && isInspectorLoad"
            class="fm-icon fm-icon-plus"
            style="font-size: 18px"
          ></i>
        </template>
      </template>
    </fm-nav-bar>
    <!-- 地图 -->
    <div class="mapContainer">
      <MapComp ref="mymap" :ifInspection="true" @mapLoaded="mapLoaded"></MapComp>
    </div>
    <!-- 开始记录与结束记录 -->
    <div class="start-record" v-if="!isView && isInspectorLoad">
      <img
        v-if="!ifRecording"
        :src="require('@/assets/img/inspection/暂停.png')"
        @click="startInspRecord"
      />
      <img v-else :src="require('@/assets/img/inspection/开始.png')" @click="endRecord('pause')" />
    </div>
    <!-- 数据面板 -->
    <!-- 非查看状态 -->
    <div class="controlCard" v-if="!isView && isInspectorLoad">
      <div class="controlContent">
        <div class="infoContent">
          <div class="endControl">
            <div class="leftText">
              <img :src="require('@/assets/img/inspection/剩余时间.png')" />
              <fm-count-down
                style="margin: auto"
                :time="getRestTime(taskDetail.taskEndTime)"
                format="DD天HH小时"
              />
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
              <div class="nameStyle" style="font-size: 14px">覆盖率</div>
            </div>
            <div class="block" @click="reportClick" style="cursor: pointer">
              <div class="rate" style="font-size: 18px">
                <div class="centerStyle">
                  {{ problemDataList.length }}
                </div>
              </div>
              <div class="nameStyle" style="font-size: 14px">上报泄漏点</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看状态 -->
    <div class="viewCard" v-if="isView || !isInspectorLoad">
      <div class="controlContent">
        <div class="infoContent">
          <div class="bottomSide">
            <div class="block">
              <div class="rate" style="font-size: 18px">
                <div class="centerStyle">
                  {{ changeToRate(taskDetail.coverage) }}
                </div>
              </div>
              <div class="nameStyle" style="font-size: 14px">覆盖率</div>
            </div>
            <div class="block" @click="reportClick" style="cursor: pointer">
              <div class="rate" style="font-size: 18px">
                <div class="centerStyle">
                  {{ problemDataList.length }}
                </div>
              </div>
              <div class="nameStyle" style="font-size: 14px">上报泄漏点</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 轨迹显示与定位功能 -->
    <div class="tool-box">
      <!-- 地图旋转、俯视角度重置 -->
      <!-- <div class="refresh" @click="resetMapView">
        <fm-image class="refresh-image" :src="require('@/assets/img/inspection/reset.png')"></fm-image>
      </div>
      <div class="route" @click="showRoute">
        <fm-image
          v-if="isShowRoute"
          class="route-image"
          :src="require('@/assets/img/inspection/route2.png')"
        ></fm-image>
        <fm-image v-else class="route-image" :src="require('@/assets/img/inspection/route.png')"></fm-image>
      </div> -->
      <div class="location" @click="startLocation">
        <fm-image
          class="location-image"
          :src="require('@/assets/img/inspection/location.png')"
        ></fm-image>
      </div>
    </div>
    <fm-popup
      :visible.sync="reportShow"
      @close="handleClose"
      round
      position="bottom"
      :overlay-style="{ background: 'rgba(0, 0, 0, 0.1)' }"
      :style="{ height: '50%' }"
    >
      <fm-tabs v-model="active" swipeable style="height: 100%">
        <fm-tab label="">
          <div v-for="(item, index) in problemDataList" :key="index">
            <LeakReportCardInfo
              :cardInfo="item"
              @toDetailPanel="toDetailPanel"
              @flyToPoint="flyToPoint"
            >
            </LeakReportCardInfo>
          </div>
        </fm-tab>
      </fm-tabs>
    </fm-popup>
    <!-- 提示层 -->
    <div v-show="ifTips" class="tip-tools">
      <img :src="require('@/assets/img/tips.png')" class="tipImg" />
      <div class="context">请在地图上选择泄漏管线</div>
    </div>
    <fm-overlay :show="ifEndTask" z-index="4">
      <div class="confirm-tip">
        <div class="content">
          <div class="icon">
            <img
              :src="require('@/assets/img/inspection/终止.png')"
              width="60"
              style="margin: auto"
            />
          </div>
          <!-- 结束任务时判断是否已经完成巡检，如果没完成就提示是否退出 -->
          <div class="info">
            <span>{{ `确定提前中止巡检任务？` }}</span>
          </div>
          <div class="input">
            <fm-field
              v-model="stopReason"
              placeholder="请输入终止原因"
              rows="3"
              autosize
              type="textarea"
              maxlength="200"
              show-word-limit
            ></fm-field>
          </div>
        </div>
        <div class="confirm_btn">
          <div class="btn1 btn2" @click="continueTask">继续任务</div>
          <div class="btn1" @click="stopTask">中止任务</div>
        </div>
      </div>
    </fm-overlay>
    <fm-overlay :show="ifLeaveTask" z-index="4">
      <!-- 当前正在巡检中时，返回任务页时提示是否离开该任务 -->
      <div class="confirm-tip" style="height: 29%">
        <div class="content">
          <div class="icon">
            <img
              :src="require('@/assets/img/inspection/终止.png')"
              width="60"
              style="margin: auto"
            />
          </div>
          <div class="info">
            <span>{{ `当前为测漏状态，继续退出会暂停测漏，请确定是否退出？` }}</span>
          </div>
        </div>
        <div class="confirm_btn">
          <div class="btn1 btn2" @click="cancelLeave">取消</div>
          <div class="btn1" @click="confirmLeave">退出</div>
        </div>
      </div>
    </fm-overlay>
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
import MapComp from '@/views/inspectMap/index.vue'
import mixins from '@/views/inspectMap/mixins/mixins.js'
import dayjs from 'dayjs'
import request from '@/utils/request'
import LeakReportCardInfo from './LeakReportCardInfo'
import Popup from './Popup.vue'
const PopupItem = Vue.extend(Popup)

const mapObj = {
  map: null,
  mapInstance: null,
}
let pauseStateTrackPoints = []
let pauseStatePipeIdList = []
export default {
  name: '',
  mixins: [mixins],
  components: {
    MapComp,
    LeakReportCardInfo,
  },
  data() {
    return {
      isResume: true,
      // 添加至地图的图片
      icons: [
        {
          name: '泄漏点',
          url: require('@/assets/img/map/泄漏点.png'),
        },
      ],
      // 当前点击的任务
      taskDetail: {},
      // 巡检员信息
      userInfo: {},
      // 巡检任务下所有巡检管线
      allTaskLines: [],
      // 当前巡检员所处位置
      currentPosition: null,
      // 是否开始记录
      ifRecording: false,
      // 轮询状态
      pollingFlag: false,
      // 是否为查看状态
      isView: false,
      // 是否为巡检员登陆，true为巡检员登录
      isInspectorLoad: true,
      isOnLoad: false,
      // 轨迹点
      trackPointList: [],
      // 轨迹时间
      trackPointTimeList: [],
      // 超速线段
      overSpeedTrackLineList: [],
      // 记录开始巡检的时间，用于判断是否在开始巡检的10s内
      startRecordTimer: '',
      // 上报失败的巡检轨迹点位数组
      reportFailTrackPoints: [],
      // 右上角加号弹框
      showPopover: false,
      ifTips: false,
      actions: [
        {
          text: '上报漏点',
        },
      ],
      accessToken: this.$storage.get('access_token'),
      formToken: '',
      header: {},
      // 用于判断是否加载完上报漏点数据
      reportDataIsLoaded: false,
      // 存储漏点工单
      problemDataList: [],
      // 上报是否显示
      reportShow: false,
      active: 0,
      ifEndTask: false,
      // 结束原因
      stopReason: '',
      ifLeaveTask: false,
    }
  },
  created() {
    console.log('存储在本地的检漏任务', JSON.parse(localStorage.getItem('leakDetectionData')))

    // 当前点击的任务，从本地中获取
    this.taskDetail = JSON.parse(localStorage.getItem('leakDetectionData')).nowClickTask
    // 是否是查看状态
    this.isView = JSON.parse(localStorage.getItem('leakDetectionData')).isView
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
      // 是否为巡检员登陆，true为巡检员登录
      // this.isInspectorLoad = false
    }
    // inspector: "chen_bolin"
    // inspectorFullName: "陈博林"

    // userFullname: "宋凯龙"
    // userName: "song_kl"
  },
  mounted() {
    document.addEventListener('pause', this.pause, false)
    document.addEventListener('resume', this.resume, false)
    localStorage.setItem('startRecordLines', 'end')
    // const id = JSON.parse(localStorage.getItem('leakDetectionData')).taskId
    // console.log('----------------------', id)
    // this.getTaskById(id)
    // this.getTrackRecordsById(id)
    // this.getAppInspData(id)
    // !(function computedPosition() {
    //   let gapTimer = 10
    //   if (that.currentPosition) {
    //     // 计算当前时间与当前插件返回的时间的间隔
    //     let gap = (new Date().getTime() - new Date(that.currentPosition.locTime).getTime()) / 1000
    //     // 如果间隔时间大于某一值，则说明在gapTimer时间内没有收到来自插件的新点位
    //     if (gap > gapTimer) {
    //       // 开启提示
    //       // Notify.warning({ message: '当前GPS信号较弱,位置和轨迹更新可能缓慢', duration: 5000 })
    //       let t = setTimeout(() => {
    //         // 提示结束，并开始下次调用
    //         computedPosition()
    //       }, 15000)
    //     } else {
    //       // 开始下次调用
    //       let t = setTimeout(() => {
    //         computedPosition()
    //       }, 10000)
    //     }
    //   } else {
    //     // Notify.warning({ message: '当前GPS无信', duration: 5000 })
    //     let t = setTimeout(() => {
    //       computedPosition()
    //     }, 10000)
    //   }
    // })()
  },
  methods: {
    // 深拷贝
    deepClone(data) {
      return JSON.parse(JSON.stringify(data))
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
        pauseStateTrackPoints.length > 0 &&
          this.upLoadPauseStateTrackPoints(this.deepClone(pauseStateTrackPoints))
        pauseStatePipeIdList.length > 0 &&
          this.upLoadPauseStatePipeIdList(this.deepClone(pauseStatePipeIdList))
      }
    },
    upLoadPauseStateTrackPoints(data) {
      // app添加上传失败点的管网检漏轨迹
      Api.inspectionTrack(data)
        .then((res) => {
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
    upLoadPauseStatePipeIdList(data) {
      let that = this
      // app添加管网检漏记录
      Api.recordInspLine(data)
        .then(async (res) => {
          if (res.status) {
            console.log('后台巡检管线补充数据上传成功')
            pauseStatePipeIdList.splice(0, data.length) // 移除上传成功的数据。避免重复上传
            // 根据ID查询当前检漏任务
            const res = await Api.getInspLeakTaskDetail({
              id: JSON.parse(localStorage.getItem('leakDetectionData')).taskId,
            })
            console.log('根据ID查询当前检漏任务', res)
            if (res.status) {
              that.taskDetail = res.data
            }
          } else {
            that.$refs.mymap.uploadFiledPipeIdList.push(...data)
          }
        })
        .catch((err) => {
          setTimeout(() => {
            this.upLoadPauseStatePipeIdList(data)
          }, 5 * 1000)
        })
    },
    // 剩余时间
    getRestTime(time) {
      return time ? new Date(time).getTime() - new Date().getTime() : 0
    },
    // 覆盖率计算
    changeToRate(coverage) {
      if (coverage != null && typeof (coverage * 1) == 'number') {
        return coverage + '%'
      } else {
        return '0%'
      }
    },
    // 地图初始化
    async mapLoaded(mapInstance) {
      mapObj.mapInstance = mapInstance
      mapObj.map = mapInstance.map
      // 添加起点终点图片
      this.addMapImg()
      await addIconToMap(mapObj.map, this.icons)
      // 添加任务范围、管线图层source、layer
      this.addSourceLayer()

      //修改供水厂图标
      mapObj.map.setLayoutProperty('map_waterwork', 'icon-image', '供水厂')
      mapObj.map.setLayoutProperty('map_waterwork', 'icon-size', 0.6)
      mapObj.map.setLayoutProperty('map_supply_pump', 'icon-image', '给水加压泵站')
      mapObj.map.setLayoutProperty('map_supply_pump', 'icon-size', 0.6)
      // 隐藏六水合一默认图层
      mapObj.map.setLayoutProperty('rd_map_comb', 'visibility', 'none')
      mapObj.map.setLayoutProperty('rd_map_manhole', 'visibility', 'none')
      // 污水相关
      mapObj.map.setLayoutProperty('rd_map_drainpipe_ws_big', 'visibility', 'none')
      mapObj.map.setLayoutProperty('rd_map_drainpipe_ws_big_direction', 'visibility', 'none')
      mapObj.map.setLayoutProperty('rd_map_drainpipe_ws_small', 'visibility', 'none')
      mapObj.map.setLayoutProperty('rd_map_drainpipe_ws_small_direction', 'visibility', 'none')
      // 雨水相关
      mapObj.map.setLayoutProperty('rd_map_drainpipe_ys_big', 'visibility', 'none')
      mapObj.map.setLayoutProperty('rd_map_drainpipe_ys_big_direction', 'visibility', 'none')
      mapObj.map.setLayoutProperty('rd_map_drainpipe_ys_small', 'visibility', 'none')
      mapObj.map.setLayoutProperty('rd_map_drainpipe_ys_small_direction', 'visibility', 'none')
      // 显示供水管线图层
      mapObj.map.setLayoutProperty('map_supply_pipe_distribute', 'visibility', 'visible')
      mapObj.map.setLayoutProperty('map_supply_pipe_circulating', 'visibility', 'visible')
      mapObj.map.setLayoutProperty('map_supply_pipe_delivery', 'visibility', 'visible')
      // mapObj.map.setLayoutProperty( "1111111111111111111111111", "visibility", "visible" );
      mapObj.map.setLayoutProperty('map_waterwork', 'visibility', 'visible')
      mapObj.map.setLayoutProperty('map_supply_pump', 'visibility', 'visible')
      // mapObj.map.setLayoutProperty( "1111111111111111111111111", "visibility", "visible" );
      mapObj.map.setLayoutProperty('map_supply_valve', 'visibility', 'visible')
      mapObj.map.setLayoutProperty('map_supply_firehydrant', 'visibility', 'visible')

      // 添加任务范围、管线图层
      await this.addTaskRangeAndLines()
      // 问题上报接口
      await this.getProblemDataList()
      // this.getTaskById(id)

      // 巡检人员source已添加

      // 设置巡检员位置
      // this.$refs.mymap.setInspUserPosition({
      //   longitude: 115.92987078013635,
      //   latitude: 39.062062836990066,
      // })
      // 巡检模拟，点击地图模拟走动
      // mapObj.map.on('click', (e) => {
      //   console.log('点击地图', e.lngLat)
      //   this.currentPosition = {
      //     longitude: Number(e.lngLat.lng),
      //     latitude: Number(e.lngLat.lat),
      //   }
      //   // {
      //   //   lng: 115.92101866271503,
      //   //   lat: 39.06137929912413,
      //   // }

      //   // // 组件和mixin同时定义相同方法，组件方法会覆盖mixin.
      //   // this.changeInspLineSourceBySpeed({
      //   //   longitude: e.lngLat.lng,
      //   //   latitude: e.lngLat.lat,
      //   // })
      // })
      this.currentPosition = {
        longitude: '115.90457697779209',
        latitude: '39.045671883888986',
      }
      // 人员定位
      // if (typeof yuanchu != 'undefined') {
      //   yuanchu.locationAMap.requestSingleLocation(
      //     ['1'],
      //     (res) => {
      // this.currentPosition = JSON.parse(JSON.stringify(res))
      const param = {
        ...this.currentPosition,
      }
      this.$refs.mymap.setInspUserPosition(param)
      //     },
      //     (err) => {
      //       console.log('err', err)
      //     }
      //   )
      // }
      console.log('this.currentPosition', this.currentPosition)
    },
    // 根据速度改变巡检管线颜色
    async changeInspLineSourceBySpeed(position) {
      const coord = [parseFloat(position.longitude), parseFloat(position.latitude)]
      const point = turf.point(coord)
      try {
        const that = this
        let timer = setInterval(function () {
          if (mapObj.map.getSource('inspUser') && mapObj.map.isSourceLoaded('inspUser')) {
            clearInterval(timer)
            if (true) {
              // 改变周围要素的状态
              let buffered = turf.buffer(point, 0.015, { unit: 'kilometers' })
              that.changeInspLineState(buffered)
            }
          }
        }, 100)
      } catch (e) {
        console.log(e)
      }
    },
    // 设置巡检管线为已巡检
    changeInspLineState(geometry) {
      let that = this
      // 将地理坐标系转化为屏幕坐标系
      function geoTransToPixel(geom) {
        const polygonBox = turf.bbox(geom)
        const southWest = [polygonBox[0], polygonBox[1]]
        const northEast = [polygonBox[2], polygonBox[3]]
        let southWestPointPixel = mapObj.map.project(southWest)
        let northEastPointPixel = mapObj.map.project(northEast)
        // 增大bbox的查询范围
        southWestPointPixel = [southWestPointPixel.x - 50, southWestPointPixel.y + 50]
        northEastPointPixel = [northEastPointPixel.x + 50, northEastPointPixel.y - 50]
        return [southWestPointPixel, northEastPointPixel]
      }
      // 对每个划分出来的bbox进行处理
      async function chunk(geom) {
        // let wasLoaded = false;
        // if (wasLoaded) return;
        console.log('geoTransToPixel(geom)', geoTransToPixel(geom))
        // 查询屏幕范围内中任务范围内的管线图层（红色或者绿色）
        const boxFeatures = mapObj.map.queryRenderedFeatures(geoTransToPixel(geom), {
          layers: ['detectionPipeLayer'],
        })
        console.log(boxFeatures, 'boxFeatures')

        // 存储管线与真实的范围相交且没有被巡检过的管线
        let tempPipeList = []
        boxFeatures.forEach((feat) => {
          try {
            // const result = turf.intersect(feat.geometry, geometry);
            // 如果两个几何图形的交点为空集，则返回(TRUE)。
            const result = turf.booleanDisjoint(feat.geometry, geometry)
            // console.log(
            //   '点与范围是否相交------------------------------------',
            //   !result,
            //   feat.geometry,
            //   geometry
            // )
            // 如果查出的要素与真实的范围相交且没有被巡检过，则改变其状态，并记录其关键字
            if (!result && !feat.state.isInsp) {
              mapObj.map.setFeatureState(
                {
                  source: feat.source,
                  id: feat.id,
                },
                { isInsp: true }
              )

              if (!tempPipeList.map((it) => it.pipeId).includes(feat.id)) {
                let date = that.$dayjs().format('YYYY-MM-DD HH:mm:ss')
                tempPipeList.push({
                  portalId: that.taskDetail.portalId,
                  inspDate: date, // 巡检日期
                  pipeId: feat.id, // 管线id
                  ext3: '供水',
                  pipeLength: feat.properties['length'] || 0, // 管线长度
                  taskId: JSON.parse(localStorage.getItem('leakDetectionData')).taskId, // 任务id
                })
              }
            }
          } catch (error) {
            console.log(error)
          }
        })
        if (that.isResume) {
          tempPipeList.length > 0 &&
            // app添加管网检漏记录
            Api.recordInspLine(tempPipeList).then(async (res) => {
              if (res.status) {
                console.log('管线上传成功')
                // 根据ID查询当前检漏任务
                const res = await Api.getInspLeakTaskDetail({
                  id: JSON.parse(localStorage.getItem('leakDetectionData')).taskId,
                })
                console.log('根据ID查询当前检漏任务', res)
                if (res.status) {
                  that.taskDetail = res.data
                }
                // bus.$emit('updateData')
              } else {
                console.log('上传失败的tempPipeList: ', tempPipeList)
                // 上传失败的已巡检管线id
                that.$refs.mymap.uploadFiledPipeIdList.push(...tempPipeList)
              }
            })
        } else {
          tempPipeList.length > 0 && pauseStatePipeIdList.push(...tempPipeList)
        }
      }
      function cb(features) {
        if (features.length > 0) {
          setTimeout(() => {
            chunk(features.shift())
            cb(features)
          }, 100)
        }
      }
      cb([geometry])
    },
    // 添加任务范围、管线图层
    async addTaskRangeAndLines() {
      // 根据ID查询当前检漏任务
      const resData1 = await Api.getInspLeakTaskDetail({ id: this.taskDetail.id })
      // 当前点击的任务，从接口中获取
      this.taskDetail = resData1?.data || {}
      this.taskDetail.taskType = '人巡'
      console.log('根据ID查询当前检漏任务', this.taskDetail)
      // ---------------------------------------------------------------------------------------
      // 添加范围图层并定位
      this.setDetectionRangeData(JSON.parse(this.taskDetail.geom))

      // 分页查询管网已检漏记录
      const resData2 = await Api.getHasInspLeakPipe({
        taskId: this.taskDetail.id,
        page: 1,
        size: 99999,
      })
      let hasInspPipe = []
      if (resData2.status) {
        hasInspPipe = resData2.data.records.map((item) => item.pipeId)
        console.log('分页查询管网已检漏记录', resData2.data.records)
      }

      // 根据任务范围查询管线数据
      let params = {
        bizType: '供水',
        devType: '管线',
        geomStr: this.taskDetail.geom,
        pageNum: 1,
        pageSize: 99999,
      }
      await Api.getAllLeakLines(params).then((res) => {
        console.log('巡检任务下所有巡检管线', res)
        if (res.status && res.data.list.length > 0) {
          // 巡检任务下所有巡检管线
          this.allTaskLines = []
          res.data.list.forEach((item) => {
            if (hasInspPipe.includes(item.id)) {
              // 巡检任务下所有巡检管线-已巡检
              this.allTaskLines.push({
                type: 'Feature',
                id: item.id,
                geometry: JSON.parse(item.geom),
                properties: {
                  isInsp: true,
                  ...item,
                },
              })
              mapObj.map.setFeatureState(
                {
                  source: 'detectionPipe',
                  id: item.id,
                },
                {
                  // 已巡检，绿色
                  isInsp: true,
                }
              )
            } else {
              // 巡检任务下所有巡检管线-未巡检
              this.allTaskLines.push({
                type: 'Feature',
                id: item.id,
                geometry: JSON.parse(item.geom),
                properties: {
                  isInsp: false,
                  ...item,
                },
              })
              mapObj.map.setFeatureState(
                {
                  source: 'detectionPipe',
                  id: item.id,
                },
                // 未巡检，红色
                {
                  isInsp: false,
                }
              )
            }
          })
          // 添加范围内管线图层
          mapObj.map.getSource('detectionPipe').setData({
            type: 'FeatureCollection',
            features: this.allTaskLines,
          })
        }
      })
    },
    // 添加任务范围、管线图层source、layer
    addSourceLayer() {
      // 范围面及边框
      mapObj.map.addSource('detectionRange', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
      mapObj.map.addLayer({
        id: 'detectionRangeLayer_fill',
        source: 'detectionRange',
        type: 'fill',
        paint: {
          'fill-color': '#32C5FF',
          'fill-opacity': 0.1,
        },
      })
      mapObj.map.addLayer({
        id: 'detectionRangeLayer_line',
        source: 'detectionRange',
        type: 'line',
        paint: {
          'line-color': '#32C5FF',
          'line-width': 2,
          'line-dasharray': [4, 4],
        },
      })

      // 范围内管线
      mapObj.map.addSource('detectionPipe', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
      mapObj.map.addLayer(
        {
          id: 'detectionPipeLayer',
          source: 'detectionPipe',
          type: 'line',
          paint: {
            'line-color': [
              'case',
              ['boolean', ['feature-state', 'isInsp'], false],
              '#44BA5A',
              '#FF0000',
            ],
            'line-width': 3,
          },
        },
        'rd_map_outfall'
      )
    },
    // 添加范围图层并定位
    setDetectionRangeData(range) {
      let bbox = turf.bbox({
        type: 'FeatureCollection',
        features: [turf.polygon(range.coordinates)],
      })
      if (mapObj.map && mapObj.map.getSource('detectionRange')) {
        mapObj.map.getSource('detectionRange').setData(range)
        mapObj.map.fitBounds(bbox, {
          padding: { top: 10, bottom: 25, left: 15, right: 5 },
        })
      }
    },
    // 取消离开
    cancelLeave() {
      this.ifLeaveTask = false
    },
    // 确认离开
    confirmLeave() {
      this.ifLeaveTask = false
      this.endRecord('leave')
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
    // 问题上报
    async getProblemDataList() {
      // 获取header，查询工单用
      await axios({
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
      // 存储漏点工单
      this.problemDataList = []
      let params = {
        sysCode: 'outwork',
        // formValue: "{\"taskId\":\"1611029758697541634\"}"1611029758697541634
        // 只显示任务关联的上报漏点
        extParam: {
          taskId: this.taskDetail.id, // 任务id
        },
        page: {
          current: 1,
          size: 10000,
        },
        typeList: ['jlgd'],
      }
      await axios({
        url:
          process.env.VUE_APP_THIRD_REQUEST_URL +
          '/main/outworkapi/ticketStatisticClient/getTicketList', // 所有的
        method: 'post',
        data: params,
        headers: this.header,
      }).then((res) => {
        if (res.status == 200 && res.data != null) {
          this.problemDataList = res.data?.resultData?.records || []
          console.log('检漏工单records', this.problemDataList)
          this.addYourLayer(this.problemDataList, '泄漏点')
          // 用于判断是否加载完上报漏点数据
          this.reportDataIsLoaded = true
        }
      })
    },
    // 在地图上添加泄漏点
    addYourLayer(pointList, id) {
      const sourceData = {
        type: 'FeatureCollection',
        features: pointList.map((i) => {
          let ll = null
          if (typeof i.formValue.ticketAddress == 'string') {
            ll = JSON.parse(JSON.parse(i.formValue.ticketAddress).point)
          } else {
            ll = i.formValue.ticketAddress.point
          }

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [ll.lng, ll.lat],
            },
            properties: i,
          }
        }),
      }
      if (mapObj.map.getSource(id)) {
        mapObj.map.getSource(id).setData(sourceData)
        return
      }
      mapObj.map.addLayer(
        {
          id: id,
          type: 'symbol',
          source: {
            type: 'geojson',
            data: sourceData,
          },
          layout: {
            'icon-image': id,
            'icon-size': 0.7,
            // 图标强制全部显示
            'icon-ignore-placement': true,
            visibility: 'visible',
          },
          // minzoom: 13,
        },
        ''
      )
      // 鼠标点击
      // mapObj.map.on('click', id, this.handleMouseClick)
    },
    // 上报泄漏点
    reportClick() {
      // 用于判断是否加载完上报漏点数据
      if (this.reportDataIsLoaded) {
        this.reportShow = true
        // mapObj.map.setLayoutProperty('eventPointsLayer', 'visibility', 'visible')
      } else {
        Toast.loading({
          message: '上报数据加载中。。。',
          loadingType: 'spinner',
          duration: 1500,
        })
        return
      }
    },
    handleClose() {
      // mapObj.map.setLayoutProperty('eventPointsLayer', 'visibility', 'none')
    },
    // 点击上报漏点加号
    onSelect(val) {
      if (this.isView) {
        Toast({
          message: '该巡检任务已结束',
          duration: '1500',
        })
        return
      }
      this.ifTips = true
      // 隐藏掉范围图层
      mapObj.map.setLayoutProperty('detectionRangeLayer_fill', 'visibility', 'none')
      mapObj.map.on('click', this.selectReportPoint)
    },
    // 上报漏点
    async selectReportPoint(e) {
      let features = mapObj.map.queryRenderedFeatures(e.point)
      console.log('查询到的图层数据', features)
      let propertiesArr = []
      propertiesArr = features.filter((item) => {
        // 筛选出供水的图层
        return item.layer.id == 'map_supply_pipe_distribute'
      })
      // console.log('上报漏点点击地图', features, propertiesArr)

      // 筛选出匹配的第一个管线元素
      let oneProperties = null
      let pop
      let marker

      const src = require(`@/assets/img/legend/事件上报.png`)
      // 如果存在id为eventObj_one的元素，则删除此元素重新创建，保持全局只有一个此元素
      let currentEle = document.getElementById('eventObj_one')
      if (currentEle) {
        currentEle.parentNode.removeChild(currentEle)
      }
      let ele = document.createElement('div')
      ele.innerHTML = `
            <img id="eventObj_one" src="${src}" width="40" height="40">
          `
      marker = mapObj.mapInstance.newMarker({
        element: ele,
      })
      marker
        .setLngLat(e.lngLat)
        .setPopup(
          mapObj.mapInstance
            .newPopup({ offset: [0, -7], closeButton: false })
            .setHTML(`<div id="deviceDetail"></div>`)
        )
        .addTo(mapObj.map)

      if (this.ifTips) {
        this.ifTips = false
      }

      if (propertiesArr.length > 0) {
        oneProperties = propertiesArr[0]
        console.log('筛选出匹配的第一个管线元素', oneProperties, e.lngLat)

        pop = new PopupItem({
          propsData: {
            deviceCode: oneProperties.properties.start_code,
            fun: goToDetail,
            isDevice: true,
            // type: type,
          },
        })
        this.$nextTick(() => {
          pop.$mount('#deviceDetail')
        })
        marker.togglePopup()

        let that_ = this
        // 进入工单详情页
        function goToDetail() {
          that_.$router.push({
            name: 'LeakDetectionForm',
            query: {
              taskId: that_.taskDetail.id, // 任务id
              properties: oneProperties.properties,
              lngLat: e.lngLat,
              id: false,
            },
          })
        }
      } else {
        pop = new PopupItem({
          propsData: {
            deviceCode: '',
            fun: goToDetailLngLat,
            isDevice: false,
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
          },
        })
        this.$nextTick(() => {
          pop.$mount('#deviceDetail')
        })
        marker.togglePopup()

        let that_ = this
        // 进入工单详情页
        function goToDetailLngLat() {
          that_.$router.push({
            name: 'LeakDetectionForm',
            query: {
              taskId: that_.taskDetail.id, // 任务id
              properties: {},
              lngLat: e.lngLat,
              id: false,
            },
          })
        }
      }
    },
    // 开始记录 上传起点成功后才进入巡检过程
    startInspRecord() {
      if (this.isView) {
        Toast({
          message: '该巡检任务已结束',
          duration: 1500,
        })
        return
      }
      // 测试
      // this.changeInspLineSourceBySpeed({
      //   longitude: 115.9118701885,
      //   latitude: 39.0556468180
      // })
      if (!this.currentPosition || !this.currentPosition.longitude) {
        Toast.warning({
          message: '当前GPS信号弱，请稍后尝试',
          duration: 2000,
        })
        return
      }
      // 修改未巡检(0)任务状态至巡检中(1)
      if (
        JSON.parse(localStorage.getItem('leakDetectionData')).isNew &&
        this.taskDetail.taskStatus == 0
      ) {
        this.startOrEndTaskRecord(1)
      }
      // 清除缓存的轨迹数据
      this.clearBufferTrack()
      let toast = Toast.loading({
        message: '程序启动中',
        loadingType: 'spinner',
        duration: 0,
        forbidClick: true,
      })
      // 绘制起始点
      this.drawStartPoint()
        .then((res) => {
          if (res) {
            toast.close()
            Toast.info({
              message: '开始记录',
              duration: 1500,
            })
            // 轮询状态
            this.pollingFlag = true
            // 是否开始记录
            this.ifRecording = true
            // this.startLocation()
            localStorage.setItem('startRecordLines', 'start')
            // 开始轮询
            this.polling()
            // 记录开始巡检的时间，用于判断是否在开始巡检的10s内
            this.startRecordTimer = new Date()
          } else {
            Toast.error({
              message: '接口异常，无法开始任务',
              duration: 2000,
            })
          }
        })
        .catch((err) => {
          console.log(err)
          Toast.error({
            message: '网络状态异常，正在重试',
            duration: 2000,
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
          duration: 1000,
        })
        return
      }
      this.endRecordConfirm(type)
    },
    // 结束记录确认
    endRecordConfirm(type) {
      this.drawEndPoint(type)
    },
    // 绘制终止点
    async drawEndPoint(type) {
      let that = this
      if (that.currentPosition != null) {
        let lastPoint = that.trackPointList[that.trackPointList.length - 1]
        let currentPoint = [that.currentPosition.longitude, that.currentPosition.latitude]
        let distance = Number(that.GetDistance(lastPoint, currentPoint)) * 1000
        let toast = Toast.loading({
          message: '程序关闭中',
          loadingType: 'spinner',
          duration: 0,
          forbidClick: true,
        })
        // 记录终止点
        that
          .postTrackData_Point(
            that.trackPointList[that.trackPointList.length - 1],
            that.trackPointTimeList[that.trackPointTimeList.length - 1],
            distance
          )
          .then((res) => {
            if (res) {
              toast.close()
              Toast.info({
                message: '暂停成功',
                duration: 1000,
              })
              if (typeof yuanchu != 'undefined') {
                yuanchu.locationAMap.stopRequestLocations()
              }
              that.trackPointList.push([
                that.currentPosition.longitude,
                that.currentPosition.latitude,
              ])
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
                mapObj.map.addLayer(
                  {
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
                  },
                  'inspUserLayer'
                )
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
                mapObj.map.addLayer(
                  {
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
                  },
                  'inspUserLayer'
                )
              }
              // 添加终点图片
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
              that.$refs.mymap.uploadFiledPipeIdList.length > 0 &&
                // app添加管网检漏记录
                Api.recordInspLine(that.$refs.mymap.uploadFiledPipeIdList).then((res) => {
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
                    duration: 2000,
                  })
                  // 刷新任务
                  this.refreshTask()
                } else if (type == 'leave') {
                  this.$router.go(-1)
                }
              }
            } else {
              Toast.error({
                message: type == 'end' ? '结束失败' : '暂停失败',
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
    // 刷新任务
    refreshTask() {
      // let ids = []
      // this.keyDetailList.forEach((item) => {
      //   if (item.engInfoDTO) {
      //     ids.push(item.engInfoDTO.engId)
      //   }
      // })
      // mapObj.mapInstance && this.$refs.mymap.removeKeyPointMarker(ids)
      const id = JSON.parse(localStorage.getItem('leakDetectionData')).taskId
      // 添加任务范围、管线图层
      this.addTaskRangeAndLines()
      // await this.getAppInspData(id)
    },
    // ------------------------------------------------------------------------------------------------------------
    // 状态（0未开始 1执行中 2已完成）
    startOrEndTaskRecord(status) {
      let data = {
        planId: this.taskDetail.planId, // 计划id
        taskName: this.taskDetail.taskName, // 任务名
        taskStatus: status, // 状态（0未开始 1执行中 2已完成）
        id: this.taskDetail.id, // 任务id
        ext1: status == 2 ? this.stopReason : '', // 结束原因
      }
      if (status == 1) {
        // 任务开始时间
        data.taskStartTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else if (status == 2) {
        // 任务结束时间
        data.taskEndTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      let that = this
      Api.changeTaskStatus(data).then((res) => {
        if (res.status) {
          if (status == 2) {
            Toast.success({
              message: '结束成功',
              duration: 2000,
              onClose: () => {
                that.pollingFlag = false
                that.ifRecording = false
                // bus.$off('updateData')
                localStorage.setItem('startRecordLines', 'end')
                that.isView = true
                that.$router.go(-1)
              },
            })
          }
        } else {
          if (status == 2) {
            Toast.error({
              message: '结束失败, 正在重试',
              duration: 1500,
            })
          }
        }
      })
    },
    async postFailTrackData() {
      let that = this
      // app添加上传失败点的管网检漏轨迹
      await Api.inspectionTrack(that.reportFailTrackPoints)
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
    // 清除缓存的轨迹数据
    clearBufferTrack() {
      let that = this
      that.isResume = true
      // 是否开始记录
      that.ifRecording = false
      // 当前巡检员所处位置
      // that.currentPosition = null
      // 数组归零
      // 轨迹点
      that.trackPointList = []
      // 轨迹时间
      that.trackPointTimeList = []
      // 超速线段
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
    // 添加起点终点图片
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
    // 绘制起始点
    drawStartPoint() {
      let that = this
      return new Promise(function (resolve, reject) {
        // if (typeof yuanchu != 'undefined') {
        //   yuanchu.locationAMap.requestSingleLocation(
        //     ['1'],
        //     (res) => {
        //       that.currentPosition = JSON.parse(JSON.stringify(res))
        // res
        // {
        //   accuracy: '',//定位精度（Android返回）
        //   address: '浙江省杭州市余杭区智溢路靠近中国(杭州)人工智能小镇',//（若请求回逆地理位置信息则返回）
        //   latitude: '30.2706469726562517',//（必返回）
        //   longitude: '119.9658680555555605',//（必返回）
        //   locTime: '2022-03-09 09:45:19',//（必返回）
        //   locType: '',//定位模式（Android返回）
        // }
        const param = {
          ...that.currentPosition,
        }
        // 设置巡检人员位置并监听设备旋转事件，给人员图标旋转角度赋值
        that.$refs.mymap.setInspUserPosition(param)
        if (that.currentPosition != null) {
          let recordData = []
          recordData.push({
            taskId: that.taskDetail.id, // 任务id
            longitude: that.currentPosition.longitude,
            latitude: that.currentPosition.latitude,
            inspTime: that.currentPosition.locTime, // 具体巡检时间
            distance: 0, // 轨迹长度 第一个点距离为0
            inspDate: that.currentPosition.locTime, // 巡检日期
            inspector: that.userInfo.userFullName,
          })
          // app添加管网检漏轨迹
          Api.inspectionTrack(recordData).then(
            (res) => {
              if (res && res.status) {
                // 使用上报点位作为起点
                console.log('起始点存储成功')
                that.trackPointList.push([
                  that.currentPosition.longitude,
                  that.currentPosition.latitude,
                ])
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
                  mapObj.map.addLayer(
                    {
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
                    },
                    'inspUserLayer'
                  )
                }
                // 添加起点图片
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
              // })
              // .catch((err) => {
              //   reject(err)
              // })
              // }
            },
            (err) => {
              console.log('err', err)
            }
          )
        }
      })
    },
    // 轮询 currentPosition，绘制轨迹线
    polling() {
      let that = this
      // 轮询状态
      if (that.pollingFlag) {
        // if (typeof yuanchu != 'undefined') {
        //   yuanchu.locationAMap.requestLocations(
        //     // 巡检定时间隔：单位秒 3~60 （必填参数）
        //     ['3', '1', '20', '100', '0', true],
        //     (res) => {
        //       // res
        //       // {
        //       //   accuracy: '',//定位精度（Android返回）
        //       //   address: '浙江省杭州市余杭区智溢路靠近中国(杭州)人工智能小镇',//（若请求回逆地理位置信息则返回）
        //       //   latitude: '30.2706469726562517',//（必返回）
        //       //   longitude: '119.9658680555555605',//（必返回）
        //       //   locTime: '2022-03-09 09:45:19',//（必返回）
        //       //   locType: '',//定位模式（Android返回）
        //       // }
        //       that.currentPosition = JSON.parse(JSON.stringify(res))
        setInterval(() => {
          that.currentPosition = Object.assign(that.currentPosition, {
            direction: 0,
          })
          // 过滤缓存定位数据
          if (
            that.currentPosition.locType != 'SAME_REQ' &&
            that.currentPosition.locType != 'FIX_CACHE'
          ) {
            let lastPoint = that.trackPointList[that.trackPointList.length - 1]
            let currentPoint = [that.currentPosition.longitude, that.currentPosition.latitude]
            // 计算起点终点距离
            let distance = Number(that.GetDistance(lastPoint, currentPoint)) * 1000

            // 记录过程点
            that
              .postTrackData_Point(
                // 最后一个点，最后一个点对应的时间，最后两点之间的距离
                that.trackPointList[that.trackPointList.length - 1],
                that.trackPointTimeList[that.trackPointTimeList.length - 1],
                distance
              )
              .then((res) => {
                if (res) {
                  // 轨迹点数组存储当前定位点
                  that.trackPointList.push([
                    that.currentPosition.longitude,
                    that.currentPosition.latitude,
                  ])
                  // 轨迹点对应时间数组存储当前定位点时间
                  that.trackPointTimeList.push(that.currentPosition.locTime)

                  // 巡检人员图标位置更新
                  const coord = [
                    parseFloat(that.currentPosition.longitude),
                    parseFloat(that.currentPosition.latitude),
                  ]
                  const point = turf.point(coord)
                  mapObj.mapInstance.setSourceData('inspUser', {
                    type: 'FeatureCollection',
                    features: [point],
                  })

                  // 轨迹点数组构造临时线图层
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
                    mapObj.map.addLayer(
                      {
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
                          'line-opacity': 0.8,
                        },
                      },
                      'inspUserLayer'
                    )
                  }
                  // 右箭头图标
                  if (mapObj.map.getLayer('trackLineLayer_arrow')) {
                  } else {
                    mapObj.map.addLayer(
                      {
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
                          visibility: 'visible',
                        },
                      },
                      'inspUserLayer'
                    )
                  }
                  // 改变管线颜色
                  that.changeInspLineSourceBySpeed(that.currentPosition)
                  const param = {
                    ...that.currentPosition,
                  }
                  that.$refs.mymap.setInspUserPosition(param)
                }
              })
          }
        }, 3000)
        // },
        // (err) => {
        //   console.log('定位失败，错误原因', err)
        //   // Toast.error({
        //   //   message: 'err' + err,
        //   //   duration: 2000,
        //   // })
        // }
        //   )
        // }
        // this.uploadInspRoute()
      }
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
          inspDate: timeData, // 巡检日期
          inspTime: date_now, // 具体巡检时间
          distance, // 轨迹长度
          inspector: that.userInfo.userFullname, // 巡检员
          longitude: pointData[0],
          latitude: pointData[1],
        })
        if (that.isResume) {
          // app添加管网检漏轨迹
          await Api.inspectionTrack(recordData).then((res) => {
            if (res && res.status) {
              console.log('轨迹存储成功', recordData)
              resolve(true)
            } else {
              // 上传失败的点位，暂时存在app端
              that.reportFailTrackPoints.push(recordData)
              console.log('that.reportFailTrackPoints: ', that.reportFailTrackPoints)
              resolve(false)
            }
          })
        } else {
          pauseStateTrackPoints.push(...recordData)
          resolve(true)
        }
      })
    },
    // 开始定位
    startLocation() {
      let that = this
      // yuanchu.locationAMap.requestSingleLocation(
      //   ['1'],
      //   (res) => {
      //     that.currentPosition = JSON.parse(JSON.stringify(res))
      const param = {
        ...that.currentPosition,
      }
      that.$refs.mymap.setInspUserPosition(param)
      if (
        !that.currentPosition ||
        !that.currentPosition.longitude ||
        !that.currentPosition.latitude
      ) {
        Toast.error({
          message: '获取位置失败!',
          duration: 2000,
        })
        return
      } else {
        const coord = [
          parseFloat(that.currentPosition.longitude),
          parseFloat(that.currentPosition.latitude),
        ]
        that.flyToPoint(coord)
      }
      // },
      // (err) => {
      //   console.log('err', err)
      // }
      // )
    },
    // 巡检人员定位
    flyToPoint(lnglat) {
      mapObj.map.flyTo({ center: lnglat, zoom: 17.5 })
    },
    // 结束任务
    async endTask() {
      if (this.isView) {
        Toast({
          message: '该巡检任务已结束',
          duration: 1500,
        })
        return
      }
      // bus.$off('updateData')
      // 添加任务范围、管线图层
      await this.addTaskRangeAndLines()
      setTimeout(() => {
        let hasInspKp = this.taskDetail?.completion.split('|')[0] || 0
        let allInspKp = this.taskDetail?.completion.split('|')[1] || 0
        if (allInspKp - hasInspKp == 0 && this.taskDetail.coverage.includes('100')) {
          this.endRecordConfirm('end')
        } else {
          // 结束任务时判断是否已经完成巡检，如果没完成就提示是否退出
          this.ifEndTask = true
        }
      }, 100)
    },
    // 继续任务
    continueTask() {
      this.stopReason = ''
      this.ifEndTask = false
    },
    // 中止任务
    stopTask() {
      if (this.stopReason == '') {
        Toast.warning({
          message: '请输入终止原因',
          duration: 1500,
        })
        return
      }
      this.ifEndTask = false
      this.endRecordConfirm('end')
    },
    // 检漏工单进入详情页
    toDetailPanel(cardDetail) {
      this.$router.push({
        name: 'LeakDetectionForm',
        query: {
          id: cardDetail.id,
        },
      })
    },
  },

  beforeDestroy() {
    Toast.clear()
    this.pollingFlag = false
    this.clearBufferTrack()
    document.removeEventListener('pause', this.pause)
    document.removeEventListener('resume', this.resume)
    if (typeof yuanchu != 'undefined') {
      yuanchu.locationAMap.stopRequestLocations()
    }
    localStorage.removeItem('startRecordLines')
  },
}
</script>

<style lang="less" scoped>
.MapPage {
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
    height: calc(100%);
    width: 100%;
    // background-color: rgb(97, 40, 255);
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
      margin: 50px 30px 0;
      display: flex;
      flex-direction: column;

      .infoContent {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-bottom: 24px;

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

        .bottomSide {
          width: 100%;
          display: flex;
          margin-top: 24px;
          justify-content: space-between;

          .block {
            text-align: center;
            width: 330px;
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
              }
            }

            .nameStyle {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #555555;
              width: 100%;
              height: 33%;
            }
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
    background: #ffffff;
    box-shadow: 0px 0px 18px 0px rgba(104, 115, 127, 0.18);

    .controlContent {
      margin: 32px 30px 0;
      display: flex;
      flex-direction: column;

      .infoContent {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-bottom: 24px;

        .bottomSide {
          width: 100%;
          display: flex;
          margin-top: 24px;
          justify-content: space-around;

          .block {
            text-align: center;
            width: 330px;
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
              }
            }

            .nameStyle {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #555555;
              width: 100%;
              height: 33%;
            }
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

  .confirm-tip {
    width: 80%;
    height: 44%;
    margin: auto;
    background: #ffffff;
    border-radius: 16px;
    margin: 50% auto;

    /deep/.content {
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
        border-top: 1px solid #dcdee3;
        font-size: 32px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 100px;
        text-align: center;
      }

      .btn2 {
        border-right: 1px solid #dcdee3;
      }
    }
  }

  .tip-tools {
    position: fixed;
    display: flex;
    top: 15%;
    left: 200px;
    border-radius: 16px;
    padding: 24px;
    background: #ffffff;
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
      color: #1b67d8;
      line-height: 31px;
    }
  }
}
</style>
