<template>
  <div class="DispatchCenter">
    <!-- <fm-nav-bar title="调度中心" left-arrow @click-left="$router.go(-1)"></fm-nav-bar> -->
    <fm-nav-bar left-arrow @click-left="$router.go(-1)">
      <template #title>
        <div class="top">
          <div class="top-title">
            <span :class="selectedTab == '调度中心' ? 'active' : ''" @click="changeType('调度中心')"
              >调度中心</span
            >
            <span :class="selectedTab == '调度地图' ? 'active' : ''" @click="changeType('调度地图')"
              >调度地图</span
            >
          </div>
        </div>
      </template>
      <template #right>
        <template v-if="selectedTab == '调度中心'">
          <i class="fm-icon fm-icon-plus" @click="addInstructions"></i>
        </template>
        <img
          v-if="selectedTab == '调度地图'"
          @click="showMapLegend"
          style="height: 24px; position: absolute; right: 20px"
          :src="require('@/assets/img/map/right.png')"
        />
      </template>
    </fm-nav-bar>
    <fm-search v-model="imputValue" placeholder="搜索" />
    <!-- scrollBar -->
    <div class="scroll">
      <div class="scrollBar">
        <div class="itemCard" @click="goToDetail('指令')">
          <img src="@assets/img/dispatchCenter/指令.png" alt="" />
          <span class="littleText">指令</span>
          <!-- <div class="redPoint"></div> -->
        </div>
        <!-- <div class="itemCard" @click="goToDetail('报警')">
          <img src="@assets/img/dispatchCenter/报警.png" alt="" />
          <span class="littleText">报警</span>
          <div class="redPoint"></div>
        </div> -->
        <div class="itemCard" @click="goToDetail('事件')">
          <img src="@assets/img/dispatchCenter/事件.png" alt="" />
          <span class="littleText">事件</span>
          <!-- <div class="redPoint"></div> -->
        </div>
        <div class="itemCard" @click="goToDetail('排班')">
          <img src="@assets/img/dispatchCenter/排班.png" alt="" />
          <span class="littleText">排班</span>
          <!-- <div class="redPoint"></div> -->
        </div>
        <div class="itemCard" @click="goToDetail('日志')">
          <img src="@assets/img/dispatchCenter/日志.png" alt="" />
          <span class="littleText">日志</span>
          <!-- <div class="redPoint"></div> -->
        </div>
        <div class="itemCard" @click="goToDetail('压力')">
          <img src="@assets/img/dispatchCenter/压力.png" alt="" />
          <span class="littleText">压力</span>
          <!-- <div class="redPoint"></div> -->
        </div>
      </div>
      <on-duty v-if="showDuty" />
    </div>
    <!-- 调度中心页面 -->
    <DispatchCenterPage v-show="selectedTab == '调度中心'"></DispatchCenterPage>
    <!-- 地图 -->
    <div class="mapContainer" v-if="selectedTab == '调度地图'">
      <xa-map :create="initScene"></xa-map>
    </div>
    <MapLegend
      ref="mapLegendRef"
      :popupShow="popupShow"
      shape="rectangle"
      :data-source="legendList"
      :click-func="legendClick"
      @closePop="closePop"
      @legendTitleNameClick="legendTitleNameClick"
      @eventPopupClick="eventPopupClick"
      @monitorPopupClick="monitorPopupClick"
    ></MapLegend>
    <PressureMonitorDetail
      v-if="pressureMonitorShow && selectedTab == '调度地图'"
      :pressureDataDetail="pressureDataDetail"
      @closePopup_pressure="closePopup_pressure"
    >
    </PressureMonitorDetail>

    <!-- 查看预案 -->
    <fm-action-sheet :visible.sync="prePlanShow" title="查看预案" :round="false">
      <fm-loading size="48px" v-if="loadingIsShow == true"> </fm-loading>
      <div v-show="loadingIsShow == false" class="planContent">
        <div class="littlePlan" v-for="(item, index) in fileList" :key="index">
          <div class="topSide">
            <img class="imgPosition" src="@/assets/img/dispatchCenter/矩形.png" alt="" />
            <!-- 方案标题 -->
            <span>{{ item.projectTitle }}</span>
          </div>
          <div class="centerSide">
            <!-- 方案内容 -->
            <span>{{ item.planContent }}</span>
          </div>
          <div class="bottomSide">
            <div class="innerDiv">
              <div
                class="fileCard"
                v-for="(item7, index) in item.fileList"
                :key="index * 1000"
                @click="goToViewFile(item7.fileToken)"
              >
                <img src="@/assets/img/dispatchCenter/文件链接.png" alt="" />
                <span>点击预览</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </fm-action-sheet>
    <fm-dialog
      :visible.sync="planFileDialogShow"
      title="附件预览"
      :showConfirmButton="false"
      show-cancel-button
    >
      <div style="height: 500px; overflow: hidden">
        <PreView :fileToken="fileTokenValue" key=""></PreView>
      </div>
    </fm-dialog>
  </div>
</template>

<script>
import {
  NavBar,
  Search,
  Toast,
  Cell,
  CellGroup,
  PullRefresh,
  List,
  Sidebar,
  SidebarItem,
  SwipeCell,
  Button,
  NoticeBar,
  Icon,
  Dialog,
  ActionSheet,
  Uploader,
  Loading,
  Notify,
} from 'fawkes-mobile-lib'
import * as api from './api'
import Bus from '@/utils/bus'
import { addIconToMap } from '@/utils/mapUtils'
import { bbox, center as getCenter } from '@turf/turf'
import _cloneDeep from 'lodash/cloneDeep'
// 压力监测点击弹窗
import PressureMonitorDetail from '@/views/OneMap/components/PressureMonitorDetail.vue'
// 自定义图例
import { legendListSelf } from './legendList.js'
import { ENUM } from '@/store/State/stateTypes'
import axios from 'axios'
// 地图
import Vue from 'vue'
import mapboxgl from 'mapbox-gl'
import infoPopup from '@/views/DispatchCenter/components/popup.vue' // 事件弹窗
import PopupHover from '@/views/DispatchCenter/components/PopupHover.vue' // 监测点弹窗
import MapLegend from '@/views/OneMap/components/mapLegend.vue'
import onDuty from './components/onDuty.vue'
// 水厂数据
import { modifyWaterWork, newWaterWork } from '@/views/DispatchCenter/supplyWaterWork.js'
import PreView from '@/components/PreView/index.vue'
// 调度中心页面（概化图），该页面太大，写在外部
import DispatchCenterPage from '@/views/DispatchCenter/components/DispatchCenterPage/index.vue'

const MapObj = {
  map: null,
  viewer: null,
  popupItem: '', // mapbox气泡框
  marker: '',
  monitorPopups: [],
  monitorPopupContent: [],
  // 事件点popup集合
  eventPopupArray: [],
}
export default {
  name: 'DispatchCenter',
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Toast.name]: Toast,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [NoticeBar.name]: NoticeBar,
    [Icon.name]: Icon,
    [Dialog.name]: Dialog,
    [ActionSheet.name]: ActionSheet,
    [Uploader.name]: Uploader,
    [Loading.name]: Loading,
    [Notify.Component.name]: Notify.Component,

    PressureMonitorDetail,
    MapLegend,
    PreView,
    DispatchCenterPage,
    onDuty,
  },
  data() {
    return {
      showDuty: false,
      selectedTab: '调度中心',
      showMonitorType: false,
      showPopover: false,
      // 通过 actions 属性来定义菜单选项
      actions: [{ text: '选项一' }, { text: '选项二' }, { text: '选项三' }],
      imputValue: '',
      // 添加至地图的图片
      icons: [
        {
          name: '压力监测(供)*',
          url: require('@/assets/img/map/压力监测.png'),
        },
        {
          name: '压力监测离线供',
          url: require('@/assets/img/map/压力离线供地图.png'),
        },
        {
          name: '压力监测报警供',
          url: require('@/assets/img/map/压力报警供地图.png'),
        },
        {
          name: '泵站',
          url: require('@/assets/img/map/pump.png'),
        },
        {
          name: '再生水厂',
          url: require('@/assets/img/map/再生水厂地图.png'),
        },
        {
          name: '供水厂',
          url: require('@/assets/img/map/供水厂地图.png'),
        },
        {
          name: '给水加压泵站',
          url: require('@/assets/img/map/给水加压泵站地图.png'),
        },
        {
          name: '压力监测(再生)*',
          url: require('@/assets/img/map/再生水压力监测.png'),
        },
        {
          name: '压力监测离线再生',
          url: require('@/assets/img/map/压力离线再生地图.png'),
        },
        {
          name: '压力监测报警再生',
          url: require('@/assets/img/map/压力报警再生地图.png'),
        },
        {
          name: '流量计(供)*',
          url: require('@/assets/img/map/流量计地图.png'),
        },
        {
          name: '流量离线供',
          url: require('@/assets/img/map/流量离线供地图.png'),
        },
        {
          name: '流量报警供',
          url: require('@/assets/img/map/流量报警供地图.png'),
        },
        {
          name: '流量计(再生)*',
          url: require('@/assets/img/map/流量计再生地图.png'),
        },
        {
          name: '流量离线再生',
          url: require('@/assets/img/map/流量离线再生地图.png'),
        },
        {
          name: '流量报警再生',
          url: require('@/assets/img/map/流量报警再生地图.png'),
        },
        {
          name: '事件点',
          url: require('@/assets/img/map/dw.png'),
        },
        // {
        // name: "提标改造给水厂",
        // url: require("@/assets/img/map/提标改造给水厂.png"),
        // },
        // {
        // name: "规划新建给水厂",
        // url: require("@/assets/img/map/规划新建给水厂.png"),
        // },
      ],
      // 所有监测点数据
      allPointArray: [],
      // 告警监测点
      dangerPointData: [],
      pressureMonitorShow: false, // 压力监测详情面板显隐
      pipelineShow: false, // 管线详情面板显隐
      pressureDataDetail: {}, // 压力监测详情面板基础信息
      pipelineBaseInfo: {}, // 管线详情面板基础信息
      // 事件
      accessToken: this.$storage.get('access_token'),
      formToken: '',
      header: {},
      tableData: [],

      // 图例是否显示
      popupShow: false,
      legendList: legendListSelf,
      fileList: [], // 事件点匹配的预案附件
      // 某一事件点匹配上的所有预案
      tempFileScheme: [],
      prePlanShow: false,
      fileListArr: [
        // { url: '/static/img/leaf.jpg' },
        // Uploader 根据文件后缀来判断是否为图片文件
        // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
        { url: 'https://cloud-image', isImage: true },
      ],
      // 查看预案loading状态是否展示
      loadingIsShow: false,
      // 存在在地图上的所有监测点数据集合
      monitorDataInMap: [],
      // 文件fileToken值，点击不同文件就随之改变
      fileTokenValue: '',
      // 文件预览弹窗
      planFileDialogShow: false,
      // 工单列表-类 // 旧同问题上报 abnormal_inform
      smallType: 'dispatch_problem',
    }
  },
  created() {},
  mounted() {
    // popup弹框查看预案点击回调
    Bus.$on('goToViewDetail', (objectType, eventType, feature) => {
      console.log('点击某一事件点后存储的参数', objectType, eventType, feature)
      // 打开查看预案面板
      this.prePlanShow = true
      // 查看预案loading状态展示
      this.loadingIsShow = true
      // 匹配预案
      this.toFind(objectType, eventType, feature)
    })
  },
  beforeDestroy() {
    Bus.$off('goToViewDetail')
  },
  methods: {
    // 新增指令
    addInstructions() {
      this.$router.push({
        name: 'addDispatchOrder',
        query: { mode: 'add' }
      })
    },
    // 点击预案某一文件
    goToViewFile(fileToken) {
      // 附件预览弹窗打开
      this.planFileDialogShow = true
      // 附件token赋值
      this.fileTokenValue = fileToken
    },
    // tab切换回调
    changeType(name) {
      this.selectedTab = name

      // 顶部调度中心与调度地图切换时，将mapLegend.vue组件中事件popup、监测点popup开启状态变成关闭
      // 事件弹窗开关
      this.$refs.mapLegendRef.eventPopupChecked = false
      // 监测点弹窗
      this.$refs.mapLegendRef.monitorPopupChecked = false
    },
    // 调度中心右上角加号选中回调
    onSelect(action) {
      Toast(action.text)
    },
    // 点击scrollBar回调
    goToDetail(val) {
      switch (val) {
        case '事件':
          this.$router.push({
            name: 'SchedulingEvents',
            query: {},
            params: {},
          })
          break
        case '日志':
          this.$router.push({
            name: 'SchedulingLog',
            query: {},
            params: {},
          })
          break
        case '指令':
          this.$router.push({
            path: '/DispatchCenter/DispatchOrder',
          })
          break
        case '压力':
          this.$router.push({
            path: '/DispatchCenter/PressureAnalysis',
          })
          break
        case '排班':
          this.showDuty = !this.showDuty
          break
      }
    },
    // 图例部分开始------------------------------------------
    // 打开图例
    showMapLegend() {
      this.popupShow = true
    },
    // 关闭图例
    closePop(val) {
      this.popupShow = val
    },
    // 单个图例点击
    legendClick(e, item, id) {
      console.log('图例点击', item, id)
      if (typeof item.id == 'number') {
        this.$notify({
          type: 'warning',
          message: '当前图层暂无数据！',
        })
        return
      }
      item.clickFlag = !item.clickFlag
      this.legendControlLayer(item)
    },
    // 单个图例点击
    legendControlLayer(item) {
      let map = window.xaMap
      if (map.getLayer(item.id)) {
        if (item.clickFlag) {
          map.setLayoutProperty(item.id, 'visibility', 'none')
          if (item.id == 'rd_map_drainpipe_ys_big') {
            let filter = map.getFilter('rd_map_manhole')
            if (
              filter.toString() == ['all'].toString() ||
              filter.toString() == ['in', 'manhole_type', '雨水'].toString()
            ) {
              if (map.getLayoutProperty('rd_map_drainpipe_ws_big', 'visibility') == 'none') {
                filter = ['in', 'manhole_type', '']
              } else {
                filter = ['in', 'manhole_type', '污水']
              }
            }
            // 雨水管线图层控制雨水井、雨水箭头、雨水较小层级图层显示
            map.setLayoutProperty('rd_map_comb', 'visibility', 'none')

            map.setFilter('rd_map_manhole', filter)
            map.setLayoutProperty('rd_map_drainpipe_ys_big_direction', 'visibility', 'none')
            map.setLayoutProperty('rd_map_drainpipe_ys_small', 'visibility', 'none')
            map.setLayoutProperty('rd_map_drainpipe_ys_small_direction', 'visibility', 'none')
          } else if (item.id == 'map_supply_pipe_circulating') {
            // 循环水（回水）管线控制循环水（回水）节点显示
            map.setLayoutProperty('map_supply_node_circulating', 'visibility', 'none')
          } else if (item.id == 'map_supply_pipe_distribute') {
            // 配水管线控制配水节点显示
            map.setLayoutProperty('map_supply_node_distribute', 'visibility', 'none')
          } else if (item.id == 'map_supply_pipe_delivery') {
            // 输水管线控制输水节点显示
            map.setLayoutProperty('map_supply_node_delivery', 'visibility', 'none')
          } else if (item.id == 'map_recycle_pipe') {
            // 再生水管线控制再生水节点显示
            map.setLayoutProperty('map_recycle_node', 'visibility', 'none')
          } else if (item.id == 'rd_map_drainpipe_ws_big') {
            // 污水管线图层控制污水井、污水箭头、污水较小层级图层显示
            let filter = map.getFilter('rd_map_manhole')
            if (
              filter.toString() == ['all'].toString() ||
              filter.toString() == ['in', 'manhole_type', '污水'].toString()
            ) {
              if (map.getLayoutProperty('rd_map_drainpipe_ys_big', 'visibility') == 'none') {
                filter = ['in', 'manhole_type', '']
              } else {
                filter = ['in', 'manhole_type', '雨水']
              }
            }
            map.setFilter('rd_map_manhole', filter)
            map.setLayoutProperty('rd_map_drainpipe_ws_big_direction', 'visibility', 'none')
            map.setLayoutProperty('rd_map_drainpipe_ws_small', 'visibility', 'none')
            map.setLayoutProperty('rd_map_drainpipe_ws_small_direction', 'visibility', 'none')
          } else if (item.id == '压力监测') {
            // map.setLayoutProperty(
            // "压力监测-报警",
            // "visibility",
            // "none"
            // );
          }
        } else {
          map.setLayoutProperty(item.id, 'visibility', 'visible')
          if (item.id == 'rd_map_drainpipe_ys_big') {
            let filter = map.getFilter('rd_map_manhole')
            if (
              filter.toString() == ['in', 'manhole_type', ''].toString() ||
              filter.toString() == ['in', 'manhole_type', '污水'].toString()
            ) {
              if (map.getLayoutProperty('rd_map_drainpipe_ws_big', 'visibility') != 'none') {
                filter = ['all']
              } else {
                filter = ['in', 'manhole_type', '雨水']
              }
            }
            map.setFilter('rd_map_manhole', filter)
            map.setLayoutProperty('rd_map_comb', 'visibility', 'visible')
            map.setLayoutProperty('rd_map_drainpipe_ys_big_direction', 'visibility', 'visible')
            map.setLayoutProperty('rd_map_drainpipe_ys_small', 'visibility', 'visible')
            map.setLayoutProperty('rd_map_drainpipe_ys_small_direction', 'visibility', 'visible')
          } else if (item.id == 'map_supply_pipe_circulating') {
            map.setLayoutProperty('map_supply_node_circulating', 'visibility', 'visible')
          } else if (item.id == 'map_supply_pipe_distribute') {
            map.setLayoutProperty('map_supply_node_distribute', 'visibility', 'visible')
          } else if (item.id == 'map_supply_pipe_delivery') {
            map.setLayoutProperty('map_supply_node_delivery', 'visibility', 'visible')
          } else if (item.id == 'map_recycle_pipe') {
            map.setLayoutProperty('map_recycle_node', 'visibility', 'visible')
          } else if (item.id == 'rd_map_drainpipe_ws_big') {
            let filter = map.getFilter('rd_map_manhole')
            if (
              filter.toString() == ['in', 'manhole_type', ''].toString() ||
              filter.toString() == ['in', 'manhole_type', '雨水'].toString()
            ) {
              if (map.getLayoutProperty('rd_map_drainpipe_ys_big', 'visibility') != 'none') {
                filter = ['all']
              } else {
                filter = ['in', 'manhole_type', '污水']
              }
            }
            map.setLayoutProperty('rd_map_drainpipe_ws_big_direction', 'visibility', 'visible')
            map.setFilter('rd_map_manhole', filter)
            map.setLayoutProperty('rd_map_manhole', 'visibility', 'visible')
            map.setLayoutProperty('rd_map_drainpipe_ws_small_direction', 'visibility', 'visible')
            map.setLayoutProperty('rd_map_drainpipe_ws_small', 'visibility', 'visible')
          } else if (item.id == '压力监测') {
            // map.setLayoutProperty(
            // "压力监测-报警",
            // "visibility",
            // "visible"
            // );
          }
        }
      }
    },
    // 图例标题点击，控制该标题下所有图层显隐
    legendTitleNameClick(legendTitleName) {
      console.log('图例标题', legendTitleName)
      this.legendList.forEach((item) => {
        if (item.label === legendTitleName) {
          item.titleStatus = !item.titleStatus
          //
          item.options.forEach((smallItem) => {
            // 当该标题下图层内容为显示状态时才进入判断
            if (item.titleStatus === true && typeof smallItem.id == 'number') {
              setTimeout(() => {
                this.$notify({
                  type: 'warning',
                  message: smallItem.label + '图层暂无数据！',
                })
              }, 0)
              return
            }
            if (item.titleStatus === true) {
              // 标题状态点亮时
              smallItem.clickFlag = false // 图层均显示
            } else {
              smallItem.clickFlag = true // 图层均隐藏
            }
            this.legendControlLayer(smallItem)
          })
        }
      })
    },
    // 事件弹窗开关
    eventPopupClick(isShow) {
      console.log('事件', isShow)
      if (isShow) {
        // 事件点popup集合
        MapObj.eventPopupArray = []
        // 如果当前事件点还未加载完毕就退出
        if (this.tableData.length == 0) return
        this.popup1 && this.popup1.remove() // 从地图上移除事件popup
        // 事件弹窗全开
        this.tableData.forEach((item, index) => {
          // console.log(item)
          let popup = new mapboxgl.Popup({
            closeOnClick: false,
            closeButton: false,
            anchor: 'bottom',
            offset: { bottom: [0, -15] },
          })
          popup
            .setLngLat({
              lng: item.appealLng,
              lat: item.appealLat,
            })
            .setHTML('<div id=popup' + item.id + '></div>')
            .addTo(MapObj.map)

          let defectFromDic = this.$store.state[ENUM].defectFrom
          this.$nextTick(() => {
            // 事件悬浮弹窗
            new infoPopup({
              propsData: {
                // 对象类型
                // item无需JSON.parse
                deviceType: item.formValue.deviceType[1],
                // 事件类型
                faultTypes: item.formValue.faultTypes,
                // 当前事件点的properties
                properties: item,
                formToken: this.formToken,
                id: item.id,
                ticketNo: item.ticketNo,
                name: ' ' + item.title + ' ',
                status: item.ticketStatusName,
                info: {
                  事件来源: defectFromDic.find((it) => it.code == item.defectFrom)['zh-CN'],
                  事件位置: item.address,
                  上报人: item.createByName,
                  智能调度推荐: '预案附件',
                },
                fileList: this.fileList,
              },
            }).$mount('#popup' + item.id)
          })
          // 事件点popup集合
          MapObj.eventPopupArray.push(popup)
        })
      } else {
        // 事件点popup隐藏
        MapObj.eventPopupArray.forEach((popup) => {
          popup.remove()
        })
        // 事件点popup集合
        MapObj.eventPopupArray = []
      }
    },
    // 监测点弹窗开关
    monitorPopupClick(isShow) {
      console.log('监测点', isShow)
      if (isShow) {
        // 如果地图上还未存在监测点图层就退出
        if (this.monitorDataInMap.length == 0) return
        // 监测点popup集合
        MapObj.monitorPopups = []
        // 存在在地图上的所有监测点数据集合
        this.monitorDataInMap.forEach((item) => {
          let pop = new mapboxgl.Popup({
            closeOnClick: false,
            closeButton: false,
            anchor: 'bottom',
            offset: { bottom: [0, -22] },
          })
          pop
            .setLngLat({
              lng: item.lon,
              lat: item.lat,
            })
            .setHTML('<div id=popup' + item.deviceId + '></div>')
            .addTo(window.xaMap)
          // 传递给PopupHover组件，遍历展示数据
          let hoverAndClick = []
          // 1.筛选出需要展示的属性
          hoverAndClick = item.realtimeData.filter((item) => {
            return item.isShow == 0
          })
          // 1.2将properties中设备告警状态添加到具体的属性值中，用于是否用红色字体显示，比如压力值
          hoverAndClick.forEach((item1) => {
            if (item?.isWarn && item?.isWarn == '1') {
              item1.isWarn = 1
            } else {
              item1.isWarn = -1
            }
          })
          // 2.不同设备添加不同展示数据
          hoverAndClick.forEach((item) => {
            // 对需要显示的值进行处理并添加单位
            item.myVal = item.val + ' ' + item.desc
          })
          // 3.时间单独添加在最后
          hoverAndClick.push({
            name: '时间',
            myVal: hoverAndClick.length > 0 ? hoverAndClick[0].time.slice(6, 20) : '',
            isWarn: -1,
          })
          this.$nextTick(() => {
            // 压力监测悬浮弹窗
            new PopupHover({
              propsData: {
                name: item.monitorName,
                belongSystem: item.belongSystem,
                realtimeData: item.realtimeData,
                hoverAndClick: hoverAndClick,
              },
            }).$mount('#popup' + item.deviceId)
          })
          MapObj.monitorPopups.push(pop)
        })
      } else {
        // 监测点popup隐藏
        MapObj.monitorPopups.forEach((popup) => {
          popup.remove()
        })
        // 监测点popup集合
        MapObj.monitorPopups = []
      }
    },
    // 图例部分结束------------------------------------------
    // /*初始化地图事件*/
    async initScene() {
      MapObj.map = window.xaMap
      await addIconToMap(MapObj.map, this.icons)
      MapObj.map.resize()
      // 添加水厂
      this.addWaterFactory()
      // 添加压力监测设备点
      this.getPressurePoint()
      // 添加事件图层 => getTableData() + this.getGeoJson() => renderCluster() 渲染图层和弹窗
      this.addEventsLayer()

      //修改供水厂图标
      MapObj.map.setLayoutProperty('map_waterwork', 'icon-image', '供水厂')
      MapObj.map.setLayoutProperty('map_waterwork', 'icon-size', 0.6)
      MapObj.map.setLayoutProperty('map_supply_pump', 'icon-image', '给水加压泵站')
      MapObj.map.setLayoutProperty('map_supply_pump', 'icon-size', 0.6)

      // 隐藏六水合一默认图层
      MapObj.map.setLayoutProperty('rd_map_comb', 'visibility', 'none')
      MapObj.map.setLayoutProperty('rd_map_manhole', 'visibility', 'none')
      // 污水相关
      MapObj.map.setLayoutProperty('rd_map_drainpipe_ws_big', 'visibility', 'none')

      MapObj.map.setLayoutProperty('rd_map_drainpipe_ws_big_direction', 'visibility', 'none')
      MapObj.map.setLayoutProperty('rd_map_drainpipe_ws_small', 'visibility', 'none')
      MapObj.map.setLayoutProperty('rd_map_drainpipe_ws_small_direction', 'visibility', 'none')
      // 雨水相关
      MapObj.map.setLayoutProperty('rd_map_drainpipe_ys_big', 'visibility', 'none')
      MapObj.map.setLayoutProperty('rd_map_drainpipe_ys_big_direction', 'visibility', 'none')
      MapObj.map.setLayoutProperty('rd_map_drainpipe_ys_small', 'visibility', 'none')
      MapObj.map.setLayoutProperty('rd_map_drainpipe_ys_small_direction', 'visibility', 'none')
      // 显示供水管线图层
      MapObj.map.setLayoutProperty('map_supply_pipe_distribute', 'visibility', 'visible')
      MapObj.map.setLayoutProperty('map_supply_pipe_circulating', 'visibility', 'visible')
      MapObj.map.setLayoutProperty('map_supply_pipe_delivery', 'visibility', 'visible')
      // MapObj.map.setLayoutProperty( "1111111111111111111111111", "visibility", "visible" );
      MapObj.map.setLayoutProperty('map_waterwork', 'visibility', 'visible')
      MapObj.map.setLayoutProperty('map_supply_pump', 'visibility', 'visible')
      // MapObj.map.setLayoutProperty( "1111111111111111111111111", "visibility", "visible" );
      MapObj.map.setLayoutProperty('map_supply_valve', 'visibility', 'visible')
      MapObj.map.setLayoutProperty('map_supply_firehydrant', 'visibility', 'visible')
    },
    // 添加水厂
    async addWaterFactory() {
      let map = window.xaMap
      // let modifyWaterWorkSourceData = {
      //   type: "FeatureCollection",
      //   features: modifyWaterWork.map((i) => {
      //     return {
      //       type: "Feature",
      //       geometry: {
      //         type: "Point",
      //         coordinates: [i.lon, i.lat],
      //       },
      //       properties: i,
      //     };
      //   }),
      // };
      // let newWaterWorkSourceData = {
      //   type: "FeatureCollection",
      //   features: newWaterWork.map((i) => {
      //     return {
      //       type: "Feature",
      //       geometry: {
      //         type: "Point",
      //         coordinates: [i.lon, i.lat],
      //       },
      //       properties: i,
      //     };
      //   }),
      // };
      // await map.addLayer({
      //   id: "提标改造给水厂",
      //   type: "symbol",
      //   source: {
      //     type: "geojson",
      //     data: modifyWaterWorkSourceData,
      //   },
      //   layout: {
      //     "icon-image": "提标改造给水厂",
      //     "icon-size": 1,
      //     // 图标强制全部显示
      //     "icon-ignore-placement": true,
      //   },
      // });
      // await map.addLayer({
      //   id: "规划新建给水厂",
      //   type: "symbol",
      //   source: {
      //     type: "geojson",
      //     data: newWaterWorkSourceData,
      //   },
      //   layout: {
      //     "icon-image": "规划新建给水厂",
      //     "icon-size": 1,
      //     // 图标强制全部显示
      //     "icon-ignore-placement": true,
      //   },
      // });
      await map.addLayer({
        id: 'recycleFactory',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [115.948614165383, 39.0726579390552],
                },
              },
            ],
          },
        },
        type: 'symbol',
        layout: {
          'icon-image': '再生水厂',
          visibility: 'none',
          'icon-size': 0.6,
        },
      })

      // 提标改造给水厂
      modifyWaterWork.forEach((item) => {
        let pop = new mapboxgl.Popup({
          closeOnClick: false,
          closeButton: false,
          anchor: 'bottom',
          offset: { bottom: [0, -15] },
        })
        pop
          .setLngLat({
            lng: item.lon,
            lat: item.lat,
          })
          .setText(item.name)
          .addTo(map)
      })

      // 规划新建给水厂
      newWaterWork.forEach((item) => {
        let pop = new mapboxgl.Popup({
          closeOnClick: false,
          closeButton: false,
          anchor: 'bottom',
          offset: { bottom: [0, -15] },
        })
        pop
          .setLngLat({
            lng: item.lon,
            lat: item.lat,
          })
          .setText(item.name)
          .addTo(map)
      })
      // map.on("mouseenter", "提标改造给水厂", (e) => {
      //   let feature = e.features[0];
      //   if (!this.pop) {
      //     this.pop = new mapboxgl.Popup({
      //       closeOnClick: true,
      //       closeButton: false,
      //       anchor: "bottom",
      //       offset: { bottom: [0, -15] },
      //     });
      //   }
      //   this.pop
      //     .setLngLat({
      //       lng: feature.properties.lon,
      //       lat: feature.properties.lat,
      //     })
      //     .setText(feature.properties.name)
      //     .addTo(map);
      // });
      // map.on("mouseenter", "规划新建给水厂", (e) => {
      //   let feature = e.features[0];
      //   if (!this.pop) {
      //     this.pop = new mapboxgl.Popup({
      //       closeOnClick: true,
      //       closeButton: false,
      //       anchor: "bottom",
      //       offset: { bottom: [0, -15] },
      //     });
      //   }
      //   this.pop
      //     .setLngLat({
      //       lng: feature.properties.lon,
      //       lat: feature.properties.lat,
      //     })
      //     .setText(feature.properties.name)
      //     .addTo(map);
      // });
    },
    // 添加压力监测设备
    async getPressurePoint() {
      let params = {
        deviceType: '',
      }
      let arr = []
      let flowArr = [] // 流量计
      let supplyFlowArr = [] // 供水流量计
      let recycleFlowArr = [] // 再生水流量计
      let pressureArr = [] // 压力计
      let supplyPressureArr = [] // 供水压力计
      let recyclePressureArr = [] // 再生水压力

      // 获取所有监测设备基础信息
      await api.getAllEquipmentInformation(params).then((res) => {
        if (res.data && res.data.length > 0) {
          // 所有监测点数据赋值
          this.allPointArray = res.data
          console.log('所有监测点数据', res.data)
          let arr = res.data
          flowArr = arr.filter((item) => {
            return item.deviceType == 'Flowmeter'
          })
          supplyFlowArr = flowArr.filter((item) => {
            return item.belongSystem == '供水'
          })
          recycleFlowArr = flowArr.filter((item) => {
            return item.belongSystem == '再生水'
          })
          pressureArr = arr.filter((item) => {
            return item.deviceType == 'IVTM'
          })
          supplyPressureArr = pressureArr.filter((item) => {
            return item.belongSystem == '供水'
          })
          recyclePressureArr = pressureArr.filter((item) => {
            return item.belongSystem == '再生水'
          })
          console.log(
            '压力流量四个类型',
            supplyFlowArr,
            recycleFlowArr,
            supplyPressureArr,
            recyclePressureArr
          )
          // 存在在地图上的所有监测点数据集合
          this.monitorDataInMap = [...supplyFlowArr, ...recycleFlowArr, ...supplyPressureArr, ...recyclePressureArr]
          // 供水压力监测点告警个数
          supplyPressureArr.forEach((item) => {
            console.log(item.iotOnline + '---' + item.isWarn)
          })
          this.addYourLayer(supplyFlowArr, '流量计(供)*', '流量离线供', '流量报警供')
          this.addYourLayer(recycleFlowArr, "流量计(再生)*", "流量离线再生", "流量报警再生");
          this.addYourLayer(supplyPressureArr, '压力监测(供)*', '压力监测离线供', '压力监测报警供')
          this.addYourLayer(recyclePressureArr, "压力监测(再生)*", "压力监测离线再生", "压力监测报警再生");
        }
      })
    },
    // 在地图上添加图标图层
    addYourLayer(pointList, id, offlineImageId, warnImageId) {
      let visibility = 'visible'
      // if (id == '压力监测(供)*') {
      //   visibility = 'visible'
      // } else {
      //   visibility = 'none'
      // }
      const sourceData = {
        type: 'FeatureCollection',
        features: pointList.map((i) => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [i.lon, i.lat],
            },
            properties: i,
          }
        }),
      }
      if (window.xaMap.getSource(id)) {
        window.xaMap.getSource(id).setData(sourceData)
        return
      }
      window.xaMap.addLayer(
        {
          id: id,
          type: 'symbol',
          source: {
            type: 'geojson',
            data: sourceData,
          },
          layout: {
            'icon-image': [
              'case',
              ['all', ['==', ['get', 'iotOnline'], '0'], ['!=', ['get', 'isWarn'], '1']],
              id,
              ['==', ['get', 'iotOnline'], '1'],
              offlineImageId,
              ['all', ['==', ['get', 'iotOnline'], '0'], ['==', ['get', 'isWarn'], '1']],
              warnImageId,
              id,
            ],
            'icon-size': 0.7,
            // 图标强制全部显示
            'icon-ignore-placement': true,
            visibility: visibility,
          },
          minzoom: 13,
        },
        ''
      )
      let obj = {}
      obj[id] = pointList
      MapObj.monitorPopupContent.push(obj)
      // 鼠标点击
      window.xaMap.on('click', id, this.handleMouseClick)
    },
    // 鼠标点击
    handleMouseClick(e) {
      const feature = e.features[0]
      // window.xaMap.getCanvas().style.cursor = 'pointer'
      // 管线详情面板关闭
      this.pipelineShow = false
      // 赋值传递给详情面板PressureMonitor.vue
      this.pressureDataDetail = _cloneDeep(feature.properties)
      this.pressureDataDetail.realtimeData = JSON.parse(feature.properties.realtimeData)
      // 压力监测详情面板
      this.pressureMonitorShow = true
    },
    // 压力监测详情面板PressureMonitor.vue关闭按钮回调
    closePopup_pressure() {
      // 压力监测详情面板
      this.pressureMonitorShow = false
    },

    // 事件地图部分----------------------------------------
    // 添加事件图层，先获取header，再通过header获取事件，再将事件列表添加至地图
    async addEventsLayer() {
      // 业务类型固定为“供水”
      // let extParam = "{\"sysSource\":\"outwork\",\"createType\":\"PC\"" + ",\"device_type\":" + "[" + "\"" + "supply" + "\"" + "]" + "}";
      let extParam = ''
      let extParamJson = {
        // "sysSource": "outwork",
        createType: 'PC',
        // "device_type": ["supply"] // 要换成 supply、sewage
      }
      extParam = JSON.stringify(extParamJson)
      let params = {
        sysCode: 'outwork',
        smallType: this.smallType,
        extParam: extParam,
        extListParam: [
          { keyList: ['deviceType'], valueList: ['recycle', 'supply', '供水', '再生水'] },
        ], // 同时查再生水和供水
        page: {
          current: 1,
          size: -1,
        },
      }
      // 获取header，查询工单用
      axios({
        // url: 'http://172.20.79.70/main/userCenterApi/sso/tokenByToken',
        url: process.env.VUE_APP_WPG_URL + '/main/userCenterApi/sso/tokenByToken',
        method: 'post',
        params: {
          token: this.accessToken,
        },
        headers: {
          Authorization: 'Basic b3V0d29yazp3cGcyMDIw',
        },
      }).then(async (res) => {
        if (res.status == 200) {
          this.formToken = res.data.resultData.token
          this.header = {
            // 'Content-Type': 'application/json', // 若有 则文件上传 出错
            Authorization: 'Bearer ' + this.formToken,
          }
          console.log('this.header查询工单用:', this.header)
          await this.getTableData(params) // 获取事件列表
          this.getGeoJson()
        }
      })
    },
    // 获取事件列表
    async getTableData(params) {
      this.tableData = []
      console.log('获取事件列表参数', params)
      await axios({
        url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/outworkapi/ticketStatisticClient/getTicketList',
        method: 'post',
        data: params,
        headers: this.header,
      }).then((res) => {
        console.log('获取事件列表结果', res)
        if (res.status == 200 && res.data != null) {
          this.tableData = res.data?.resultData?.records || []
          console.log('事件列表records', this.tableData)
        }
      })
    },
    // 将事件列表添加至地图
    getGeoJson() {
      let features = []
      let withoutPositionCount = 0
      console.log('聚合的tableData', this.tableData)
      if (this.tableData.length == 0) return

      this.tableData.forEach((item) => {
        let feature = {}
        let properties = {}
        let geometry = {}

        properties = item
        properties.defectFrom = item.formValue.defectFrom
        feature.properties = properties
        feature.type = 'Feature'
        geometry.type = 'Point'
        if (item.appealLat && item.appealLng) {
          // geometry.coordinates = [item.appealLat, item.appealLon]
          geometry.coordinates = [item.appealLng, item.appealLat] // wgs84
          feature.geometry = geometry
          features.push(feature)
        } else if (
          item.formValue.deviceDetail?.latitude &&
          item.formValue.deviceDetail?.longitude
        ) {
          geometry.coordinates = [
            item.formValue.deviceDetail.longitude,
            item.formValue.deviceDetail.latitude,
          ]
          feature.geometry = geometry
          features.push(feature)
        } else if (
          item.formValue.ticketAddress?.longitude &&
          item.formValue.ticketAddress?.latitude
        ) {
          geometry.coordinates = [
            item.formValue.ticketAddress.longitude,
            item.formValue.ticketAddress.latitude,
          ]
          feature.geometry = geometry
          features.push(feature)
        } else {
          // geometry.coordinates = [39.06683064435245, 115.9453947097063]
          withoutPositionCount += 1
        }
      })
      console.log('无坐标个数', withoutPositionCount)
      // 聚合数据 构造头部
      let geoJson = {
        type: 'FeatureCollection',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: [],
      }
      geoJson.features = features
      console.log('聚合的geoJson', geoJson)
      this.renderCluster(geoJson)
    },
    // 渲染
    renderCluster(geoJsonSource) {
      ;['clusters', 'cluster-count', 'unclustered-point'].forEach((item) => {
        if (MapObj.map.getLayer(item)) {
          MapObj.map.removeLayer(item)
        }
      })
      if (MapObj.map.getSource('earthquakes')) {
        MapObj.map.removeSource('earthquakes')
      }
      MapObj.map.addSource('earthquakes', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        // data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
        data: geoJsonSource,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      })

      MapObj.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          // * Blue, 20px circles when point count is less than 100
          // * Yellow, 30px circles when point count is between 100 and 750
          // * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 10, '#f1f075', 75, '#f28cb1'],
          'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 75, 40],
        },
      })

      MapObj.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      })

      MapObj.map.addLayer({
        id: 'unclustered-point',
        source: 'earthquakes',
        filter: ['!', ['has', 'point_count']],
        type: 'symbol',
        layout: {
          'icon-image': '事件点', // 点的图标
          visibility: 'visible',
          'icon-size': 0.7,
        },
      })

      let defectFromDic = this.$store.state[ENUM].defectFrom
      let that = this
      MapObj.map.on('click', 'unclustered-point', (e) => {
        // 如果当前事件点所有popup为打开状态，即事件点popup数组长度不为0，退出该次点击事件
        if (MapObj.eventPopupArray.length > 0) return
        // 每次点击新的事件点就清除预案数据
        this.fileList = []
        console.log('e.features: ', e.features)
        // console.log('formValue: ', JSON.parse(e.features[0].properties.formValue))
        MapObj.map.getCanvas().style.cursor = 'pointer'

        let formValue = JSON.parse(e.features[0].properties.formValue)
        console.log('formValue: ', formValue)

        // 对象类型
        let objectType = formValue.deviceType[1]
        // 事件类型
        let eventType = formValue.faultTypes

        var coordinates = e.features[0].geometry.coordinates.slice()
        // console.log('经纬度', coordinates)
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }
        // Create a popup, but don't add it to the map yet.
        this.popup1 = new mapboxgl.Popup({
          closeOnClick: true,
          closeButton: false,
          anchor: 'bottom',
          offset: { bottom: [0, -15] },
        })

        this.popup1
          .setLngLat(coordinates)
          .setHTML('<div id="vue-popup-pressure"></div>')
          .addTo(MapObj.map)
        // .addTo(window.xaMap);
        let formToken = that.formToken
        // 事件悬浮弹窗
        new infoPopup({
          propsData: {
            // 对象类型
            deviceType: formValue.deviceType[1],
            // 事件类型
            faultTypes: formValue.faultTypes,
            // 当前事件点的properties
            properties: e.features[0].properties,
            formToken: formToken,
            id: e.features[0].properties.id,
            ticketNo: e.features[0].properties.ticketNo,
            name: ' ' + e.features[0].properties.title + ' ',
            status: e.features[0].properties.ticketStatusName,
            info: {
              事件来源: defectFromDic.find((it) => it.code == e.features[0].properties.defectFrom)[
                'zh-CN'
              ],
              事件位置: e.features[0].properties.address,
              上报人: e.features[0].properties.createByName,
              智能调度推荐: '预案附件',
            },
            fileList: this.fileList,
          },
        }).$mount('#vue-popup-pressure')
      })

      // inspect a cluster on click
      MapObj.map.on('click', 'clusters', function (e) {
        var features = MapObj.map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        var clusterId = features[0].properties.cluster_id
        MapObj.map
          .getSource('earthquakes')
          .getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err) return
            MapObj.map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            })
          })
      })
      MapObj.map.setMinZoom(0)
      MapObj.map.setMaxZoom(30)
      // console.log('now MapObj.map layers: ', MapObj.map.getStyle().layers)
    },
    // 匹配预案
    async toFind(objectType, eventType, feature) {
      let params = {
        page: 1,
        size: 99,
        objectType: objectType,
        eventType: eventType,
      }
      console.log('匹配预案参数', params)
      // 某一事件点匹配上的所有预案
      this.tempFileScheme = []
      // 匹配调度预案
      await api.getSchema(params).then((res) => {
        console.log('匹配预案结果', res)
        if (res.status && res.data != null) {
          this.tempFileScheme = res.data.records
        }
        console.log('匹配上的预案数组', res.data.records)
        if (this.tempFileScheme.length == 0) {
          console.log('未匹配到预案')
          this.fileList = []
          this.loadingIsShow = false
          Notify({ type: 'warning', message: '暂无匹配预案', duration: 1000 })
          return
        }
        // 根据匹配上的预案获取预案文件？
        this.getFileInfoByToken(this.tempFileScheme, feature)
      })
    },
    // 根据匹配上的预案获取预案文件？
    async getFileInfoByToken(tempFileScheme, feature) {
      for (let i = 0; i < tempFileScheme.length; i++) {
        console.log('每个预案---' + i, tempFileScheme[i])
        if ('fileList' in tempFileScheme[i] && tempFileScheme[i].fileList?.length > 0) {
          for (let j = 0; j < tempFileScheme[i].fileList.length; j++) {
            let parmas = {
              f8s: [tempFileScheme[i].fileList[j].fileToken],
            }
            await api.getFileByToken(parmas).then((res) => {
              console.log('根据文件token获取文件', res)

              tempFileScheme[i].fileList[j].url = res.data[0].link
              // tempFileScheme[i].fileList[j].url =
              //   'https://cn.bing.com/images/search?q=%E5%9B%BE%E7%89%87&FORM=IQFRBA&id=49E031AAC7715C25D8E03215367A7B4A50E14354'
              tempFileScheme[i].fileList[j].uid = tempFileScheme[i].fileList[j].id
              tempFileScheme[i].fileList[j].fileToken = tempFileScheme[i].fileList[j].fileToken
              tempFileScheme[i].fileList[j].name = tempFileScheme[i].fileList[j].fileName
              // console.log('tempFileScheme[i].fileList[j]: ', tempFileScheme[i].fileList[j])
            })
          }
        } else {
        }
      }
      console.log('处理后的文件数据', tempFileScheme)
      // this.fileList = tempFileScheme[0]?.fileList ? tempFileScheme[0].fileList : []
      this.fileList = tempFileScheme
      // 查看预案loading状态消失
      this.loadingIsShow = false

      let defectFromDic = this.$store.state[ENUM].defectFrom
    },
  },
}
</script>

<style scoped lang="less">
::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}

// loading加载状态
/deep/.fm-loading {
  margin-top: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/deep/.mapboxgl-popup-content {
  display: flex;
  justify-content: center;
  box-shadow: 0 0 transparent;
  background: transparent;
  padding: 0;

  height: 186px;
}

// 去除mapbox弹窗下的三角形
/deep/.mapboxgl-popup-tip {
  display: none;
}

// 查看预案开始----------------------
/deep/.fm-popup--bottom {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background-color: #ffffff;
}

/deep/.fm-action-sheet__close {
  display: none;
}

.planContent {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 97%;
  overflow-y: scroll;
  padding: 16px 16px 0; // 适应卡片margin-bottom布局
  background-color: #f5f7f9;

  .littlePlan {
    width: 690px;
    height: 304px;
    min-height: 340px;
    background: #ffffff;
    border-radius: 16px;
    margin-bottom: 16px;

    .topSide {
      position: relative;
      display: flex;
      align-items: center;
      // padding-left: 30px;
      width: 100%;
      height: 20%;
      font-size: 36px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;
      // background-color: rgb(83, 255, 103);

      .imgPosition {
        position: absolute;
        width: 6px;
        top: 14px;
        left: 0;
      }

      span {
        padding-left: 30px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .centerSide {
      display: flex;
      align-items: center;
      // padding-left: 30px;
      width: 100%;
      height: 25%;
      font-size: 32px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      // background-color: rgb(255, 83, 186);

      span {
        padding-left: 30px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .bottomSide {
      display: flex;
      align-items: center;
      // padding-left: 30px;
      width: 100%;
      height: 55%;
      // background-color: rgb(48, 230, 208);

      .innerDiv {
        display: flex;
        align-items: center;
        margin: 0 30px;
        width: calc(100% - 60px);
        height: 100%;
        white-space: nowrap;
        overflow-x: overlay;

        // background-color: rgb(238, 97, 97);
        .fileCard {
          width: 120px;
          height: 180px;
          // background-color: rgb(53, 165, 43);
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          font-size: 26px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          border-radius: 12px;

          img {
            width: 120px;
          }
        }
      }
    }
  }
}

// 查看预案结束----------------------
.DispatchCenter {
  width: 100%;
  height: 100%;

  /deep/ .fm-hairline--bottom::after {
    display: none;
  }

  // background-color: rgb(255, 150, 150);
  .top {
    width: 100%;
    height: 70px;
    padding: 12px 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .top-title {
      width: 400px;
      height: 64px;
      background: #f5f5f5;
      border-radius: 36px;
      display: flex;
      align-items: center;
      padding: 4px;

      span {
        width: 50%;
        height: 100%;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
        line-height: 40px;
        border-radius: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .active {
        background: #1b67d8;
        box-shadow: 0px 8px 16px 0px rgba(104, 115, 127, 0.06);
        font-weight: 500;
        color: #ffffff;
      }
    }
  }

  .scroll {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 88px;
    overflow-x: visible;

    .scrollBar {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      height: 88px;
      overflow-x: overlay;
      box-shadow: 0px 2px 20px 0px rgba(104, 115, 127, 0.07);
      background-color: rgb(255, 255, 255);
      display: flex;
      flex-direction: row;

      .itemCard {
        position: relative;
        width: 150px;
        min-width: 150px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        // background-color: rgb(136, 236, 141);
        img {
          width: 32px;
        }

        .littleText {
          padding-left: 8px;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
        }

        .redPoint {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 12px;
          height: 12px;
          background: #ff4b4b;
          border-radius: 16px;
          border: 1px solid #f7f7f7;
        }
      }
    }
  }

  .mapContainer {
    height: calc(100% - 295px);
    width: 100%;
    // background-color: rgb(97, 40, 255);
  }

  /deep/.fm-search {
    width: 100%;
    padding: 20px 36px;
    background-color: #ffffff;
  }

  /deep/.fm-search__content {
    background-color: #f7f6f9;
    box-shadow: 0 0.10667rem 0.26667rem 0 rgb(104 115 127 / 20%);
    border-radius: 0.21333rem;
    height: 72px;
  }
}
</style>
