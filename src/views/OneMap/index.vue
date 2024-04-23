<template>
  <div class="main">
    <fm-nav-bar class="fm-nav-bar-class">
      <template #title>
        <title-tabs ref="titleTabsRef" leftTitleName="地图" rightTitleName="监测列表" @changeSelectTab="changeSelectTab"></title-tabs>
      </template>
      <template #right>
        <img
          v-if="selectedTab == '地图'"
          style="height: 24px; position: absolute; right: 20px"
          :src="require('@/assets/img/map/right.png')"
          @click="showMapLegend"
        />
        <fm-popover
          v-else
          :visible.sync="showMonitorType"
          trigger="click"
          :actions="monitorTypes"
          @select="onSelect"
          placement="bottom-end"
        >
          <template #reference>
            <img
              style="height: 24px"
              :src="require('@/assets/img/map/right.png')"
            />
          </template>
        </fm-popover>
      </template>
    </fm-nav-bar>
    <xa-map
      class="xa-map-one-map"
      v-if="selectedTab == '地图'"
      :create="initScene"
      :legendConfig="legendConfig"
      @getDefaultBaseLayers="getDefaultBaseLayers"
      @getBaseLayerObject="getBaseLayerObject"
      @handleLayerClick="handleLayerClick"
    ></xa-map>
    <fm-search
      v-if="selectedTab == '地图'"
      class = "fm-search-class"
      v-model="searchValue"
      placeholder="搜索"
      @clear="onClear"
      @search="onSearch"
    />
    <mapTools
     ref="mapTools" 
     @flagBtnClick="flagBtnClick"
     v-if="selectedTab == '地图'
    ">
    </mapTools>
    <monitorList
      ref="monitorList"
      v-if="selectedTab == '监测列表'"
    ></monitorList>
    <PressureMonitorDetail
      v-if="pressureMonitorShow && selectedTab == '地图'"
      :pressureDataDetail="pressureDataDetail"
      @closePopup_pressure="closePopup_pressure"
    >
    </PressureMonitorDetail>
    <LineDetail
      v-if="pipelineShow && selectedTab == '地图'"
      :pipelineBaseInfo="pipelineBaseInfo"
      @closePopup_line="closePopup_line"
    >
    </LineDetail>
    <EquipmentDetail
      v-if="equipmentShow && selectedTab == '地图'"
      :equipmentType="equipmentType"
      :equipmentBaseInfo="equipmentBaseInfo"
      @closePopup_line="closePopup_line"
    />
    <map-legend
      :popupShow="popupShow"
      shape="rectangle"
      :data-source="legendList"
      :click-func="legendClick"
      @closePop="closePop"
      @legendTitleNameClick="legendTitleNameClick"
    ></map-legend>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import mapTools from './mapTools'
import monitorList from './monitorList'
import { addIconToMap } from '@/utils/mapUtils'
import { getAllEquipmentInformation } from './api'
import { bbox, center as getCenter } from '@turf/turf'
import _cloneDeep from 'lodash/cloneDeep'
// 图例
import { defaltLegendList } from './defaltLegendList.js'
// 压力监测点击弹窗
import PressureMonitorDetail from './components/PressureMonitorDetail.vue'
import LineDetail from './components/LineDetail.vue'
import EquipmentDetail from './components/equipmentDetail.vue'
import MapLegend from './components/mapLegend.vue'
import { legendListImport } from './legendList'
import TitleTabs from '@/components/TitleTabs'
const MapObj = {
  map: null,
  viewer: null,
  popupItem: '', //mapbox气泡框
  marker: '',
  monitorPopups: [],
  monitorPopupContent: [],
  popupArray: [], //气泡框数组
}
export default {
  name: 'OneMap',
  components: {
    mapTools,
    monitorList,
    PressureMonitorDetail,
    LineDetail,
    MapLegend,
    TitleTabs,
    EquipmentDetail
  },
  data() {
    return {
      searchValue: '',
      selectedTab: '地图',
      equipmentType: 'map_supply_pipe',
      popupShow: false,
      legendList: legendListImport,
      pressureMonitorShow: false, // 压力监测详情面板显隐
      pipelineShow: false, // 管线详情面板显隐
      equipmentShow: false, // 设备详情面板显隐
      equipmentBaseInfo: {},
      pressureDataDetail: {}, // 压力监测详情面板基础信息
      pipelineBaseInfo: {}, // 管线详情面板基础信息
      layerID: '',
      legendConfig: [],
      icons: [
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
        // 监测设备开始-------------------------------------------------------------------------------
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
          name: '液位计(雨)*',
          url: require('@/assets/img/map/液位计(雨)地图.png'),
        },
        {
          name: '液位计离线雨',
          url: require('@/assets/img/map/液位计(雨)离线地图.png'),
        },
        {
          name: '液位计报警雨',
          url: require('@/assets/img/map/液位计(雨)报警地图.png'),
        },
        {
          name: '液位计(污)*',
          url: require('@/assets/img/map/液位计(污)地图.png'),
        },
        {
          name: '液位计离线污',
          url: require('@/assets/img/map/液位计(污)离线地图.png'),
        },
        {
          name: '液位计报警污',
          url: require('@/assets/img/map/液位计(污)报警地图.png'),
        },
        {
          name: '水位计*',
          url: require('@/assets/img/map/水位计地图.png'),
        },
        {
          name: '水位计离线',
          url: require('@/assets/img/map/水位计地图离线.png'),
        },
        {
          name: '水位计报警',
          url: require('@/assets/img/map/水位计地图报警.png'),
        },
        // 监测设备结束-------------------------------------------------------------------------------
        // {
        //   name: "提标改造给水厂",
        //   url: require("@/assets/img/map/提标改造给水厂.png"),
        // },
        // {
        //   name: "规划新建给水厂",
        //   url: require("@/assets/img/map/规划新建给水厂.png"),
        // },
      ],
      showMonitorType: false,
      monitorTypes: [
        {
          text: '压力',
          name: 'IVTM',
        },
        {
          text: '流量',
          name: 'Flowmeter',
        },
        {
          text: '水质',
        },
      ],
      monitorPopupVisible: false, // 气泡框显隐
    }
  },
  created() {
    // 基本信息赋值
    if (this.$route.query.data == '监测列表') {
      this.$nextTick(() => {
        this.selectedTab = '监测列表'
        this.$refs.titleTabsRef.selectedTab = '监测列表'
      })
    }
  },
  watch: {
    selectedTab(newValue, oldValue) {
      if(this.selectedTab == '地图') {
        this.$nextTick(()=> {
          this.showSearchBar()
        })
      }
    }
  },
  methods: {
    onSearch() {},
    onClear() {},
    changeSelectTab(name) {
      this.selectedTab = name
    },
    showSearchBar() {

      let tempLength = 0
      if (typeof yuanchu != 'undefined') {
          yuanchu?.statusBar?.getStatusBarHeight((res) => {
          console.log(11111111111, res);
          tempLength = res
        })
      }

        let fmNavBar = document.querySelector(".fm-nav-bar-class");
        let fmNavBarHeight = fmNavBar.clientHeight
        let paddingTop = parseInt(getComputedStyle(fmNavBar).paddingTop);
        fmNavBarHeight -= paddingTop
        fmNavBarHeight += tempLength
        console.log(fmNavBar.clientHeight, 'fmNavBarHeight');
        this.$nextTick(()=> {
          console.log(fmNavBarHeight, 'fmNavBarHeight');
          if(document.querySelector(".fm-search-class")) {
            document.querySelector(".fm-search-class").style.top = fmNavBarHeight + 48 + 'px'
            console.log(document.querySelector(".fm-search-class").style.top, 'document.querySelector(".fm-search-class").style.top');
          }
        })
    },
    onSelect(action) {
      if (action.text == '水质') {
        return
      }
      this.$refs.monitorList.typeClick(action.name)
    },
    // 图例点击事件
    legendClick(e, item, id) {
      if (typeof item.id == 'number') {
        this.$notify({
          type: 'warning',
          message: '当前图层暂无数据！',
        })
        return
      }
      item.clickFlag = !item.clickFlag
      this.legendControlLayer(item)
      this.flagBtnClick(this.monitorPopupVisible) // 刷新气泡框
    },
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
              if (
                map.getLayoutProperty(
                  'rd_map_drainpipe_ws_big',
                  'visibility'
                ) == 'none'
              ) {
                filter = ['in', 'manhole_type', '']
              } else {
                filter = ['in', 'manhole_type', '污水']
              }
            }
            //雨水管线图层控制雨水井、雨水箭头、雨水较小层级图层显示
            map.setLayoutProperty('rd_map_comb', 'visibility', 'none')

            map.setFilter('rd_map_manhole', filter)
            map.setLayoutProperty(
              'rd_map_drainpipe_ys_big_direction',
              'visibility',
              'none'
            )
            map.setLayoutProperty(
              'rd_map_drainpipe_ys_small',
              'visibility',
              'none'
            )
            map.setLayoutProperty(
              'rd_map_drainpipe_ys_small_direction',
              'visibility',
              'none'
            )
          } else if (item.id == 'map_supply_pipe_circulating') {
            //循环水（回水）管线控制循环水（回水）节点显示
            map.setLayoutProperty(
              'map_supply_node_circulating',
              'visibility',
              'none'
            )
          } else if (item.id == 'map_supply_pipe_distribute') {
            //配水管线控制配水节点显示
            map.setLayoutProperty(
              'map_supply_node_distribute',
              'visibility',
              'none'
            )
          } else if (item.id == 'map_supply_pipe_delivery') {
            //输水管线控制输水节点显示
            map.setLayoutProperty(
              'map_supply_node_delivery',
              'visibility',
              'none'
            )
          } else if (item.id == 'map_recycle_pipe') {
            //再生水管线控制再生水节点显示
            map.setLayoutProperty('map_recycle_node', 'visibility', 'none')
          } else if (item.id == 'rd_map_drainpipe_ws_big') {
            //污水管线图层控制污水井、污水箭头、污水较小层级图层显示
            let filter = map.getFilter('rd_map_manhole')
            if (
              filter.toString() == ['all'].toString() ||
              filter.toString() == ['in', 'manhole_type', '污水'].toString()
            ) {
              if (
                map.getLayoutProperty(
                  'rd_map_drainpipe_ys_big',
                  'visibility'
                ) == 'none'
              ) {
                filter = ['in', 'manhole_type', '']
              } else {
                filter = ['in', 'manhole_type', '雨水']
              }
            }
            map.setFilter('rd_map_manhole', filter)
            map.setLayoutProperty(
              'rd_map_drainpipe_ws_big_direction',
              'visibility',
              'none'
            )
            map.setLayoutProperty(
              'rd_map_drainpipe_ws_small',
              'visibility',
              'none'
            )
            map.setLayoutProperty(
              'rd_map_drainpipe_ws_small_direction',
              'visibility',
              'none'
            )
          } else if (item.id == '压力监测') {
            // map.setLayoutProperty(
            //   "压力监测-报警",
            //   "visibility",
            //   "none"
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
              if (
                map.getLayoutProperty(
                  'rd_map_drainpipe_ws_big',
                  'visibility'
                ) != 'none'
              ) {
                filter = ['all']
              } else {
                filter = ['in', 'manhole_type', '雨水']
              }
            }
            map.setFilter('rd_map_manhole', filter)
            map.setLayoutProperty('rd_map_comb', 'visibility', 'visible')
            map.setLayoutProperty(
              'rd_map_drainpipe_ys_big_direction',
              'visibility',
              'visible'
            )
            map.setLayoutProperty(
              'rd_map_drainpipe_ys_small',
              'visibility',
              'visible'
            )
            map.setLayoutProperty(
              'rd_map_drainpipe_ys_small_direction',
              'visibility',
              'visible'
            )
          } else if (item.id == 'map_supply_pipe_circulating') {
            map.setLayoutProperty(
              'map_supply_node_circulating',
              'visibility',
              'visible'
            )
          } else if (item.id == 'map_supply_pipe_distribute') {
            map.setLayoutProperty(
              'map_supply_node_distribute',
              'visibility',
              'visible'
            )
          } else if (item.id == 'map_supply_pipe_delivery') {
            map.setLayoutProperty(
              'map_supply_node_delivery',
              'visibility',
              'visible'
            )
          } else if (item.id == 'map_recycle_pipe') {
            map.setLayoutProperty('map_recycle_node', 'visibility', 'visible')
          } else if (item.id == 'rd_map_drainpipe_ws_big') {
            let filter = map.getFilter('rd_map_manhole')
            if (
              filter.toString() == ['in', 'manhole_type', ''].toString() ||
              filter.toString() == ['in', 'manhole_type', '雨水'].toString()
            ) {
              if (
                map.getLayoutProperty(
                  'rd_map_drainpipe_ys_big',
                  'visibility'
                ) != 'none'
              ) {
                filter = ['all']
              } else {
                filter = ['in', 'manhole_type', '污水']
              }
            }
            map.setLayoutProperty(
              'rd_map_drainpipe_ws_big_direction',
              'visibility',
              'visible'
            )
            map.setFilter('rd_map_manhole', filter)
            map.setLayoutProperty('rd_map_manhole', 'visibility', 'visible')
            map.setLayoutProperty(
              'rd_map_drainpipe_ws_small_direction',
              'visibility',
              'visible'
            )
            map.setLayoutProperty(
              'rd_map_drainpipe_ws_small',
              'visibility',
              'visible'
            )
          } else if (item.id == '压力监测') {
            // map.setLayoutProperty(
            //   "压力监测-报警",
            //   "visibility",
            //   "visible"
            // );
          }
        }
      }
    },
    // 图例标题点击事件
    legendTitleNameClick(legendTitleName) {
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
      this.flagBtnClick(this.monitorPopupVisible) // 刷新气泡框
    },
    closePop(val) {
      this.popupShow = val
    },
    showMapLegend() {
      this.popupShow = true
    },
    getDefaultBaseLayers(layers) {
      this.$refs.mapTools.getDefaultBaseLayers(layers)
    },
    getBaseLayerObject(layers) {
      this.$refs.mapTools.getBaseLayerObject(layers)
    },
    /**初始化地图事件 */
    async initScene() {
      window.xaMap.resize()
      this.legendConfig = defaltLegendList
      // this.rebuildLegendList = legendList
      MapObj.map = window.xaMap
      await addIconToMap(MapObj.map, this.icons)
      // 添加压力监测设备点
      this.getPressurePoint()
    },
    // 压力监测设备添加图标
    async getPressurePoint() {
      let params = {
        deviceType: '',
      }
      let arr = []

      let flowArr = [] //流量计
      let supplyFlowArr = [] //供水流量计
      let recycleFlowArr = [] //再生水流量计

      let pressureArr = [] //压力计
      let supplyPressureArr = [] //供水压力计
      let recyclePressureArr = [] //再生水压力

      let liquidometArr = []; //液位计
      let rainLiquidometArr = []; //雨水液位计
      let sewageLiquidometArr = []; //污水液位计

      let fluviographArr = []; //电子水尺（水位计）

      // 获取所有监测设备基础信息
      await getAllEquipmentInformation(params).then((res) => {
        if (res.data && res.data.length > 0) {
          arr = res.data
          // 流量计
          flowArr = arr.filter((item) => {
            return item.deviceType == 'Flowmeter'
          })
          supplyFlowArr = flowArr.filter((item) => {
            return item.belongSystem == '供水'
          })
          recycleFlowArr = flowArr.filter((item) => {
            return item.belongSystem == '再生水'
          })
          console.log("供水流量计", supplyFlowArr, "再生水流量计", recycleFlowArr);
          // 压力计
          pressureArr = arr.filter((item) => {
            return item.deviceType == 'IVTM'
          })
          supplyPressureArr = pressureArr.filter((item) => {
            return item.belongSystem == '供水'
          })
          recyclePressureArr = pressureArr.filter((item) => {
            return item.belongSystem == '再生水'
          })
          console.log("供水压力计", supplyPressureArr, "再生水压力计", recyclePressureArr);
          // 液位计
          liquidometArr = arr.filter((item) => {
            return item.deviceType == "Liquidomet"
          })
          rainLiquidometArr = liquidometArr.filter((item) => {
            return item.belongSystem == "雨水";
          });
          sewageLiquidometArr = liquidometArr.filter((item) => {
            return item.belongSystem == "污水";
          });
          console.log("雨水液位计", rainLiquidometArr, "污水液位计", sewageLiquidometArr);
          // 电子水尺（水位计）
          fluviographArr = arr.filter((item) => {
            return item.deviceType == "Fluviograph"
          })
          console.log("电子水尺（水位计）", fluviographArr);
          MapObj.popupArray = [] // 清空弹窗数组
          this.addYourLayer(
            supplyFlowArr,
            '流量计(供)*',
            '流量离线供',
            '流量报警供'
          )
          this.addYourLayer(
            recycleFlowArr,
            '流量计(再生)*',
            '流量离线再生',
            '流量报警再生'
          )
          this.addYourLayer(
            supplyPressureArr,
            '压力监测(供)*',
            '压力监测离线供',
            '压力监测报警供'
          )
          this.addYourLayer(
            recyclePressureArr,
            '压力监测(再生)*',
            '压力监测离线再生',
            '压力监测报警再生'
          )
          this.addYourLayer(
            rainLiquidometArr,
            "液位计(雨)*",
            "液位计离线雨",
            "液位计报警雨"
          )
          this.addYourLayer(
            sewageLiquidometArr,
            "液位计(污)*",
            "液位计离线污",
            "液位计报警污"
          )
          this.addYourLayer(
            fluviographArr,
            "水位计*",
            "水位计离线",
            "水位计报警"
          )
        }
      })
    },
    // 在地图上添加图标图层
    addYourLayer(pointList, id, offlineImageId, warnImageId) {
      let visibility = 'visible'
      if (id == '压力监测(供)*') {
        visibility = 'visible'
      } else {
        visibility = 'none'
      }
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
              [
                'all',
                ['==', ['get', 'iotOnline'], '0'],
                ['!=', ['get', 'isWarn'], '1'],
              ],
              id,
              ['==', ['get', 'iotOnline'], '1'],
              offlineImageId,
              [
                'all',
                ['==', ['get', 'iotOnline'], '0'],
                ['==', ['get', 'isWarn'], '1'],
              ],
              warnImageId,
              id,
            ],
            'icon-size': 0.8,
            // 图标强制全部显示
            'icon-ignore-placement': true,
            visibility: visibility,
          },
          // 这段代码是关于地图标记图层的样式设置，通常在地图应用程序中使用。它控制了标记图标的显示方式，包括图标的图像、大小和可见性等方面。
          // 代码的主要部分是一个`layout`对象，其中包含了一系列属性设置，我会逐一解释：
          // 1. `icon-image`: 这是一个用于设置图标图像的属性。它使用了一种条件语句结构，根据不同的条件选择不同的图标图像。具体来说，它根据以下条件来选择图标图像：
          // - 如果`iotOnline`属性的值等于`0`，并且`isWarn`属性的值不等于`1`，则使用`id`作为图标图像。
          // - 如果`iotOnline`属性的值等于`1`，则使用`offlineImageId`作为图标图像。
          // - 如果`iotOnline`属性的值等于`0`，并且`isWarn`属性的值等于`1`，则使用`warnImageId`作为图标图像。
          // - 如果以上条件都不满足，则使用`id`作为图标图像。
          // 2. `icon-size`: 这是一个用于设置图标大小的属性，值为`0.7`，表示图标大小为原始大小的 70%。
          // 3. `icon-ignore-placement`: 这是一个布尔值属性，设置为`true`。它控制是否忽略图标的放置规则，即不受图标之间的相互遮挡影响，强制全部显示图标。
          // 4. `visibility`: 这是一个用于设置图层可见性的属性，其中`visibility`的值由外部变量确定。这可能是控制图标图层在地图上是否可见的开关。
          minzoom: 13,
        },
        ''
      )

      pointList.forEach((item) => {
        let showText = ''
        let showFunctionPointArr = item.realtimeData.filter((i) => {
          return i.isShow == 0
        })
        if (showFunctionPointArr.length > 0) showText = showFunctionPointArr[0].val + ' ' + showFunctionPointArr[0].desc
        let popup = new mapboxgl.Popup({
          closeButton: false, // 是否显示关闭按钮
          closeOnClick: false, // 是否支持点击关闭按钮
          offset: [0, -10], // 偏移量
        })
          .setLngLat([item.lon, item.lat])
          .setHTML(`<div class="popup-content-monitor ${item.belongSystem}">` + showText + '</div>')
        // .addTo(window.xaMap);
        popup.belongSystem = item.belongSystem
        popup.layerIdName = id
        MapObj.popupArray.push(popup)
      })

      let obj = {}
      obj[id] = pointList
      MapObj.monitorPopupContent.push(obj)
      // window.xaMap.on("mouseenter", id, this.handleMouseEnter);
      // window.xaMap.on("mouseout", id, this.handleMouseOut);
      window.xaMap.on('click', id, this.handleMouseClick)
      // window.xaMap.on("load", () => {
      //   window.xaMap.moveLayer("压力监测", "");
      // });
    },
    flagBtnClick(flag) {
      this.monitorPopupVisible = flag // 控制弹窗显示隐藏
      let monitorLayerIdList = ["流量计(供)*", "流量计(再生)*", "压力监测(供)*", "压力监测(再生)*", "液位计(雨)*", "液位计(污)*", "水位计*"]
      // 找出地图上所有监测设备图层visibility为visible的图层
      let visibleLayerList = monitorLayerIdList.filter((item) => {
        return window.xaMap.getLayoutProperty(item, "visibility") == "visible"
      })
      console.log("visibleLayerList", visibleLayerList);
      MapObj.popupArray.forEach((item) => {
        item.remove()
      })
      if (flag) {
        MapObj.popupArray.forEach((item) => {
          // console.log("mapbox Popup", item);
          if (item.belongSystem == '再生水') {
            document.querySelectorAll('.' + item.belongSystem).forEach((i) => {
              i.parentElement.style.borderTop = '2px solid #00D186'
            })
          } else if (item.belongSystem == '污水') {
            document.querySelectorAll('.' + item.belongSystem).forEach((i) => {
              i.parentElement.style.borderTop = '2px solid #91510A'
            })
          } else {
            document.querySelectorAll('.' + item.belongSystem).forEach((i) => {
              i.parentElement.style.borderTop = '2px solid #1B67D8'
            })
          }
          visibleLayerList.forEach((i) => {
            if (item.layerIdName == i) {
              item.addTo(window.xaMap)
            }
          })
        })
      }
    },
    // 鼠标点击
    handleMouseClick(e) {
      const feature = e.features[0]
      window.xaMap.getCanvas().style.cursor = 'pointer'
      // 管线详情面板关闭
      this.pipelineShow = false
      // 赋值传递给详情面板PressureMonitor.vue
      this.pressureDataDetail = _cloneDeep(feature.properties)
      this.pressureDataDetail.realtimeData = JSON.parse(
        feature.properties.realtimeData
      )
      // 压力监测详情面板
      this.pressureMonitorShow = true
    },
    // 管线...点击
    handleLayerClick(e) {
      window.xaMap.getCanvas().style.cursor = 'pointer'
      const feature = window.xaMap.queryRenderedFeatures(e.point)[0]
      console.log('-----feature-----', JSON.parse(JSON.stringify(feature)));
      this.layerID = feature.layer.id
      // this.rebuildDetailInfo(feature);

      const type = feature.geometry.type
      const sourceData = {
        type: 'FeatureCollection',
        features: [feature],
      }
      let center = getCenter(sourceData).geometry.coordinates
      this.highlightOnMap(type, [feature], this.layerID, center)
      if (
        this.layerID === "rd_map_drainpipe_ys_big" ||
        this.layerID == "rd_map_drainpipe_ys_small" ||
        this.layerID === "rd_map_drainpipe_ws_big" ||
        this.layerID == "rd_map_drainpipe_ws_small"
      ) {
        // 压力监测详情面板关闭
        this.pressureMonitorShow = false
        this.equipmentShow = false
        // 管线弹窗打开
        this.pipelineShow = true
        this.pipelineBaseInfo = feature.properties
        this.equipmentType = "map_drainpipe";
      } else if(
        this.layerID == "map_supply_pipe_distribute" ||
        this.layerID == "map_supply_pipe_circulating" ||
        this.layerID == "map_supply_pipe_delivery" || 
        this.layerID == "map_supply_pipe_origin" ||
        this.layerID == "map_supply_pipe_drink"
      ) {
        this.pressureMonitorShow = false
        this.equipmentShow = false
        this.pipelineShow = true
        this.pipelineBaseInfo = feature.properties
        this.equipmentType = "map_supply_pipe";
      } else if(this.layerID == "map_recycle_pipe") {
        this.pressureMonitorShow = false
        this.equipmentShow = false
        this.pipelineShow = true
        this.pipelineBaseInfo = feature.properties
        this.equipmentType = "map_recycle_pipe";
      } else if (this.layerID == "map_supply_firehydrant") {
        this.equipmentType = "map_supply_firehydrant";
        this.pressureMonitorShow = false
        this.pipelineShow = false
        this.equipmentShow = true
        this.equipmentBaseInfo = feature.properties
      } else if (this.layerID == "map_supply_valve") {
        this.equipmentType = "map_supply_valve";
        this.pressureMonitorShow = false
        this.pipelineShow = false
        this.equipmentShow = true
        this.equipmentBaseInfo = feature.properties
      } else if (this.layerID == "rd_map_manhole") {
        this.equipmentType = "map_manhole";
        this.pressureMonitorShow = false
        this.pipelineShow = false
        this.equipmentShow = true
        this.equipmentBaseInfo = feature.properties
      } else if (this.layerID == "rd_map_outfall") {
        this.equipmentType = "map_outfall";
        this.pressureMonitorShow = false
        this.pipelineShow = false
        this.equipmentShow = true
        this.equipmentBaseInfo = feature.properties
      } else if (this.layerID == "rd_map_comb") {
        // this.equipmentType = "rd_map_comb";
        this.equipmentType = "map_comb";
        this.pressureMonitorShow = false
        this.pipelineShow = false
        this.equipmentShow = true
        this.equipmentBaseInfo = feature.properties
      } else if (this.layerID == "rd_map_gate") {
        // this.equipmentType = "rd_map_gate";
        this.equipmentType = "map_gate";
        this.pressureMonitorShow = false
        this.pipelineShow = false
        this.equipmentShow = true
        this.equipmentBaseInfo = feature.properties
      } else {
        // 管线弹窗关闭
        this.pipelineShow = false
        this.equipmentShow = false
      }
    },
    /**
     * 高亮选中的元素
     */
    highlightOnMap(type, features, layerID, lngLat) {
      if (layerID) this.layerID = layerID
      this.removeAllHighlightLayer()
      const sourceData = {
        type: 'FeatureCollection',
        features: features,
      }
      const bound = bbox(sourceData)
      const center = lngLat
        ? lngLat
        : getCenter(sourceData).geometry.coordinates
      // window.xaMap.fitBounds(bound, { maxZoom: 12, padding: { right: 400 } });
      // this.showPopup(center, features);
      this.$nextTick(() => {
        if (['Point', 'MultiPoint'].includes(type)) {
          // 点
          if (features[0].layer && features[0].layer.layout['icon-image']) {
            const iconName =
              features[0].layer.layout['icon-image']?.name ||
              features[0].layer.layout['icon-image']
            const iconsize = features[0].layer.layout['icon-size'] || 1
            this.removeLayerSource('hightlightPoint')
            // if(this.mouseEnterCallback) this.mouseEnterCallback(e.lngLat, [feature]);
            window.xaMap.addLayer({
              id: 'hightlightPoint',
              type: 'symbol',
              source: {
                type: 'geojson',
                data: features[0],
              },
              layout: {
                'icon-size': iconsize * 1.4,
                'icon-image': iconName,
              },
            })
          } else {
            window.xaMap.addLayer({
              id: `hightlightPoint`,
              type: 'circle',
              source: {
                type: 'geojson',
                data: sourceData,
              },
              paint: {
                'circle-color': 'red',
                'circle-opacity': 0,
                'circle-radius': 6,
                'circle-stroke-color': '#1D75FF',
                'circle-stroke-opacity': 1,
                'circle-stroke-width': 3,
              },
              // layout: {
              //   'icon-image': 'uncured-pulsing-dot',
              //   'icon-ignore-placement': true,
              //   'icon-allow-overlap': true
              // },
            })
          }
          this.$store.commit('SHOW_MAPRESERVOIR', false)
        } else if (['LineString', 'MultiLineString'].includes(type)) {
          let color = '#91510A'
          if (layerID == 'rd_map_drainpipe_ys_small') {
            color = '#399AEA'
          } else if (layerID == 'rd_map_drainpipe_ws_small') {
            color = '#91510A'
          } else {
            defaltLegendList.forEach((legend) => {
              if (legend.id == layerID) {
                color = legend.clickColor
              }
            })
          }
          // 线
          window.xaMap.addLayer({
            id: `hightlightLine`,
            type: 'line',
            source: {
              type: 'geojson',
              data: sourceData,
            },
            paint: {
              'line-color': color,
              'line-width': 8,
            },
            // layout: {
            //   'icon-image': 'uncured-pulsing-dot',
            //   'icon-ignore-placement': true,
            //   'icon-allow-overlap': true
            // },
          })
          // window.xaMap.fitBounds(bound, {maxZoom: 15, padding: {right: 400}});
        } else if (['Polygon', 'MultiPolygon'].includes(type)) {
          // 面
          window.xaMap.addLayer({
            id: `hightlightPolygon`,
            type: 'fill',
            source: {
              type: 'geojson',
              data: sourceData,
            },
            paint: {
              'fill-color': 'rgba(255, 0, 0, 0.6)',
            },
            // layout: {
            //   'icon-image': 'uncured-pulsing-dot',
            //   'icon-ignore-placement': true,
            //   'icon-allow-overlap': true
            // },
          })
          // window.xaMap.fitBounds(bound, {maxZoom: 15, padding: {right: 400}});
        }
      })
    },
    removeAllHighlightLayer(e) {
      this.removeLayerSource('hightlightPoint')
      this.removeLayerSource('hightlightLine')
      this.removeLayerSource('hightlightPolygon')
    },
    /**
     * 清空临时的图层和源
     */
    removeLayerSource(name) {
      if (window.xaMap.getLayer(`${name}`)) window.xaMap.removeLayer(`${name}`)
      if (window.xaMap.getSource(`${name}`))
        window.xaMap.removeSource(`${name}`)
    },
    // 压力监测详情面板PressureMonitor.vue关闭按钮回调
    closePopup_pressure() {
      // 压力监测详情面板
      this.pressureMonitorShow = false
    },
    //关闭管线弹窗
    closePopup_line() {
      this.pipelineShow = false
      this.equipmentShow = false
    },
  },
  mounted () {
    this.showSearchBar()
  },
}
</script>

<style scoped lang="less">
/deep/ .mapboxgl-popup {
}
/deep/ .mapboxgl-popup-content {
}
.main {
  width: 100%;
  height: calc(100% - 98px - env(safe-area-inset-bottom));
  height: calc(100% - 98px - constant(safe-area-inset-bottom));
  position: relative;
  /deep/ .fm-hairline--bottom::after{
    display: none;
  }
  .xa-map-one-map {
    height: calc(100% - 98px - env(safe-area-inset-bottom));
    height: calc(100% - 98px - constant(safe-area-inset-bottom));
  }
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
        color: #FFFFFF;        
      }
    }
  }
}
// /deep/.fm-search {
  // position: absolute;
  // width: 100%;
  // // top: 1.60rem;
  // padding: 0 36px;
  // background-color: transparent;
// }
/deep/.fm-search__content {
  background-color: #ffffff;
  box-shadow: 0px 8px 20px 0px rgba(104, 115, 127, 0.2);
  border-radius: 16px;
  height: 80px;
}
/deep/.fm-search-class {
  // background-color: #ffffff;
  // box-shadow: 0px 8px 20px 0px rgba(104, 115, 127, 0.2);
  // border-radius: 16px;
  // height: 80px;
  position: absolute;
  width: 100%;
  // top: 1.60rem;
  padding: 0 36px;
  background-color: transparent;
}
</style>