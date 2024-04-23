<template>
  <div class="main">
    <fm-nav-bar title="问题上报" left-arrow @click-left="$router.go(-1)" @click-right="add">
      <template #right>
        <i class="fm-icon fm-icon-plus"></i>
      </template>
    </fm-nav-bar>

    <!-- <div class="map-container" id="mapContainer"></div> -->
    <xa-map :create="mapLoaded"></xa-map>
    <!-- <MapComp
      ref="mymap"
      :create="initMap"
      style="position: absolute"
    ></MapComp> -->
    <problemList :tableList="tableList" @flyTo="toTarget" />
    <!-- 增加按钮 -->
    <!-- <div class="bottom" @click="add">
      <i class="fm-icon-plus"></i>
    </div> -->
  </div>
</template>

<script>
import { addIconToMap } from '@/utils/mapUtils'
import MapComp from '@/components/xa-map/index.vue'
import problemList from '@/views/ProblemReport/problemList.vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapStyle from './mapStyle'
import popup from './popup'
const popupItem = Vue.extend(popup)
const MapObj = {
  map: null,
  mapInstance: null,
}
import Vue from 'vue'
import axios from 'axios'
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
} from 'fawkes-mobile-lib'

export default {
  name: 'Inspection',
  components: {
    MapComp,
    problemList,
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
  },
  data() {
    return {
      lnglat: [],
      chosePoint: false,
      objInfo: {},
      accessToken: this.$storage.get('access_token'),
      header: {},
      formToken: '',
      tableList: [],
      inspBusinessType: '',
      tableData: [],
      icons: [
                {
                    name: '事件点',
                    url: require('@/assets/img/map/dw.png'),
                },
            ],
      timer: null,
    }
  },
  computed: {
    eventTypeListNewFiltered() {
      const { dictionary, eventTypeList, taskDetail } = this
      let temp = eventTypeList.find((item) => {
        return item.label === dictionary[taskDetail.inspBusinessType]
      })
      if (temp) {
        return temp.children
      } else {
        return null
      }
    },
  },
  created() {
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
        console.log(' this.header查询工单用 : ', this.header)
        this.getList1() // 获取工单列表,
      }
    })
  },
  mounted() {
    // this.initMap()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    // 地图相关
    toTarget(lnglat) {

      if (lnglat.length == 2) {
        window.xaMap.flyTo({
          center: lnglat,
          zoom: 19,
        })
      } else {
        console.log("无位置信息")
      }
    },
    async mapLoaded() {
      MapObj.map = window.xaMap
      await addIconToMap(MapObj.map, this.icons)
      window.xaMap.on('click', (e) => {
        // 若为functio(e){ this是this.window.xaMap}
        // (e)=>{ this是this}
        console.log('map-click-e', e)
        console.log('e.lngLatn', e.lngLat)
        var bbox = [
          [e.point.x - 1, e.point.y - 1],
          [e.point.x + 1, e.point.y + 1],
        ]
        console.log('bbox:', bbox)
        // mapbox 返回查询要素的图层属性
        let queryfeatures = window.xaMap.queryRenderedFeatures(bbox, {
          layers: [
            'rd_map_drainpipe_ys_big',
            'rd_map_drainpipe_ys_small',
            'rd_map_drainpipe_ws_small',
            'rd_map_drainpipe_ws_big',
            'rd_map_outfall',
            'rd_map_gate',
            'rd_map_manhole',
            'rd_map_comb',
            'map_supply_firehydrant',
            'map_supply_valve',
            'map_supply_pipe_distribute',
            'map_supply_pipe_delivery',
            'map_supply_pipe_circulating',
            'map_supply_node_distribute',
            'map_supply_node_delivery',
            'map_supply_node_circulating',
            'map_recycle_pipe',
            'map_recycle_node',
            'map_waterwork',
          ],
          // layers: layers
        })
        console.log('点选(微矩形)查询到的queryfeatures:', queryfeatures)
        // console.log("点选(微矩形)查询的queryfeatures:", queryfeatures.properties)
        // this.hightLight(queryfeatures)// 高亮表格记录，并高亮地图要素
        this.objInfo = {} //先置空再赋值
        // 点击位置的经纬度
        this.objInfo.lng = e.lngLat.lng
        this.objInfo.lat = e.lngLat.lat
        if (queryfeatures.length > 0) {
          // queryfeatures.forEach(f => {
          let f = queryfeatures[0]
          console.log('ffff: ', f)
          // 点击要素的经纬度，有的话覆盖掉点击位置经纬度
          // this.objInfo.lng = f.properties.longitude || this.objInfo.lng
          // this.objInfo.lat = f.properties.latitude || this.objInfo.lat
          // 要素所在图层ID和属性信息
          this.objInfo.layerID = f.layer.id
          this.objInfo.layerType = f.layer.type
          this.objInfo.properties = f.properties
          // 底图要素name_local或设施要素road_name,id
          this.objInfo.name_local = f.properties.name_local
          this.objInfo.road_name = f.properties.road_name
          this.objInfo.id = f.properties.id
          // 要素对象类型（业务类型/设施类型）
          this.objInfo.bigType = ''
          this.objInfo.smallType = ''
          switch (f.layer.id) {
            // 雨水
            case "rd_map_comb"://comb一定是雨水口
              this.objInfo.bigType = '雨水'
              this.objInfo.smallType = '雨水口'
              break
            case "rd_map_outfall"://排放口 1-雨水； 2-污水； 3-合流； 4-其他
              this.objInfo.bigType = f.properties.pipe_type
              this.objInfo.smallType = '排放口'
              break
            case "rd_map_manhole"://检查井  1-雨水；2-污水
              this.objInfo.bigType = f.properties.manhole_type
              this.objInfo.smallType = f.properties.manhole_type == "雨水" ? '雨水检查井' : '污水检查井'
              break
            case "rd_map_gate"://闸门 1-雨水； 2-污水； 3-合流； 4-其他
              this.objInfo.bigType = f.properties.pipe_type
              // objInfo.smallType = '闸门'
              this.objInfo.smallType = f.properties.pipe_type == "雨水" ? '其他（雨）' : '其他（污）'
              break
            case "rd_map_drainpipe_ys_big":
              this.objInfo.bigType = '雨水'
              this.objInfo.smallType = '雨水管渠'
              break
            case "rd_map_drainpipe_ys_small":
              this.objInfo.bigType = '雨水'
              this.objInfo.smallType = '雨水管渠'
              break
            // 污水
            case "rd_map_drainpipe_ws_big":
              this.objInfo.bigType = '污水'
              this.objInfo.smallType = '污水管道'
              break
            case "rd_map_drainpipe_ws_small":
              this.objInfo.bigType = '污水'
              this.objInfo.smallType = '污水管道'
              break
            // 供水
            case "map_supply_firehydrant"://消火栓一定是供水
              this.objInfo.bigType = '供水'
              this.objInfo.smallType = '消防栓'
              break
            case "map_supply_valve"://阀门valve一定是供水
              this.objInfo.bigType = '供水'
              this.objInfo.smallType = '阀门'
              break
            case "map_supply_pipe_distribute"://配水管线
              this.objInfo.bigType = '供水'
              this.objInfo.smallType = '供水管道'
              break
            case "map_supply_pipe_delivery"://输水管线
              this.objInfo.bigType = 'supply'
              this.objInfo.smallType = '供水管道'
              break
            case "map_supply_pipe_circulating"://回水管线
              this.objInfo.bigType = '供水'
              this.objInfo.smallType = '供水管道'
              break

            case "map_supply_node_delivery":
              this.objInfo.bigType = '供水'
              this.objInfo.smallType = f.properties.appurtenance == "消防井" ? "消防栓" : f.properties.appurtenance == "排气阀" ? "阀门" : '其他（供）'
              break

            case "map_waterwork"://供水厂
              this.objInfo.bigType = '供水'
              this.objInfo.smallType = '其他（供）'
              break
            // 再生水
            case "map_recycle_pipe"://再生水管线
              this.objInfo.bigType = '再生水'
              this.objInfo.smallType = '再生水管道'
              break
            case "map_waterwork"://再生水厂
              this.objInfo.bigType = '再生水'
              this.objInfo.smallType = '其他（再）'
              break
          }
          // 设施编号
          this.objInfo.code = f.properties.start_code && f.properties.end_code ? (f.properties.start_code + ',' + f.properties.end_code) : ''
            || f.properties.manhole_code || f.properties.gate_code || f.properties.outlet_code
            || f.properties.comb_code || f.properties.valve_code || f.properties.pump_station_code
            || f.properties.plant_code || f.properties.pump_code || f.properties.fire_cock_code
            || f.properties.point_code || ''
        }
        console.log('this.objInfo: ', this.objInfo)
        // popup
        if (this.chosePoint) {
          let popupHtml = '<div id="base-detail"></div>'
          new mapboxgl.Popup()
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .setHTML(popupHtml)
            .addTo(window.xaMap)
          new popupItem({
            propsData: {
              detailId: 99999,
              lng: e.lngLat.lng.toFixed(3),
              lat: e.lngLat.lat.toFixed(3),
              bigType: this.objInfo.bigType,
              smallType: this.objInfo.smallType,
              deviceCode: this.objInfo.code,
              fun: this.editForm,
            },
          }).$mount('#base-detail')
        }
      })
    },
    initMap() {
      mapboxgl.accessToken =
        'pk.eyJ1IjoiOTM0MDk0Mjg2IiwiYSI6ImNsMnNmdmVrZDBrZGMzZG50cHJudXJkbW8ifQ.C0wKhJgrToFJgL8GH5M8rg'
      window.xaMap = new mapboxgl.Map({
        container: 'mapContainer', // 容器DOM id
        style: mapStyle,
        center: [115.92486101369428, 39.06075549589073],
        zoom: 13,
        minZoom: 10,
        pitch: 0,
      })
      // let needLayers=[]
      // 加图层 http://172.20.79.65/api/swan/mapWorkshopSource/detail?id=1544640278559821826
      axios
        .get('http://172.20.79.65/api/swan/mapWorkshopSource/detail?id=1548573412963749889')
        .then((res) => {
          console.log('res: ', res)
          let layers = JSON.parse(res.data.data.jsonData)
          console.log('layers: ', layers)
          Object.keys(layers.sources).forEach((key) => {
            window.xaMap.addSource(key, layers.sources[key])
          })
          // needLayers=layers.layers
          layers.layers.forEach((layer) => {
            window.xaMap.addLayer(layer)
            window.xaMap.setLayoutProperty(layer.id, 'visibility', 'visible')
          })
        })
        .catch((e) => { })
        .finally(() => { })
      // 监听地图点击
      // window.xaMap.on("click", function(e)  {})
      // window.xaMap.on("click", layer.id,function(e)  {})//才能选到features???,就拿到过一次

      window.xaMap.on('click', (e) => {
        // 若为functio(e){ this是this.window.xaMap}
        // (e)=>{ this是this}
        console.log('map-click-e', e)
        console.log('e.lngLatn', e.lngLat)
        var bbox = [
          [e.point.x - 1, e.point.y - 1],
          [e.point.x + 1, e.point.y + 1],
        ]
        console.log('bbox:', bbox)
        // mapbox 返回查询要素的图层属性
        let queryfeatures = window.xaMap.queryRenderedFeatures(bbox, {
          layers: [
            'rd_map_drainpipe_ys_big',
            'rd_map_drainpipe_ys_small',
            'rd_map_drainpipe_ws_small',
            'rd_map_drainpipe_ws_big',
            'rd_map_outfall',
            'rd_map_gate',
            'rd_map_manhole',
            'rd_map_comb',
            'map_supply_firehydrant',
            'map_supply_valve',
            'map_supply_pipe_distribute',
            'map_supply_pipe_delivery',
            'map_supply_pipe_circulating',
            'map_supply_node_distribute',
            'map_supply_node_delivery',
            'map_supply_node_circulating',
            'map_recycle_pipe',
            'map_recycle_node',
            'map_waterwork',
          ],
          // layers: layers
        })
        console.log('点选(微矩形)查询到的queryfeatures:', queryfeatures)
        // console.log("点选(微矩形)查询的queryfeatures:", queryfeatures.properties)
        // this.hightLight(queryfeatures)// 高亮表格记录，并高亮地图要素
        this.objInfo = {} //先置空再赋值
        // 点击位置的经纬度
        this.objInfo.lng = e.lngLat.lng
        this.objInfo.lat = e.lngLat.lat
        if (queryfeatures.length > 0) {
          // queryfeatures.forEach(f => {
          let f = queryfeatures[0]
          console.log('ffff: ', f)
          // 点击要素的经纬度，有的话覆盖掉点击位置经纬度
          this.objInfo.lng = f.properties.longitude || this.objInfo.lng
          this.objInfo.lat = f.properties.latitude || this.objInfo.lat
          // 要素所在图层ID和属性信息
          this.objInfo.layerID = f.layer.id
          this.objInfo.layerType = f.layer.type
          this.objInfo.properties = f.properties
          // 底图要素name_local或设施要素road_name,id
          this.objInfo.name_local = f.properties.name_local
          this.objInfo.road_name = f.properties.road_name
          this.objInfo.id = f.properties.id
          // 要素对象类型（业务类型/设施类型）
          switch (f.layer.id) {
            // 雨水
            case 'rd_map_comb': //comb一定是雨水口
              this.objInfo.bigType = '雨水'
              this.objInfo.smallType = '雨水口'
              break
            case 'rd_map_outfall': //排放口 1-雨水； 2-污水； 3-合流； 4-其他
              this.objInfo.bigType = f.properties.pipe_type
              this.objInfo.smallType = '排放口'
              break
            case 'rd_map_manhole': //检查井  1-雨水；2-污水
              this.objInfo.bigType = f.properties.manhole_type
              this.objInfo.smallType = '检查井'
              break
            case 'rd_map_gate': //闸门 1-雨水； 2-污水； 3-合流； 4-其他
              this.objInfo.bigType = f.properties.pipe_type
              this.objInfo.smallType = '闸门'
              break
            case 'rd_map_drainpipe_ys_big':
              this.objInfo.bigType = '雨水'
              this.objInfo.smallType = '雨水管线'
              break
            case 'rd_map_drainpipe_ys_small':
              this.objInfo.bigType = '雨水'
              this.objInfo.smallType = '雨水管线'
              break
            // 污水
            case 'rd_map_drainpipe_ws_big':
              this.objInfo.bigType = '污水'
              this.objInfo.smallType = '污水管线'
              break
            case 'rd_map_drainpipe_ws_small':
              this.objInfo.bigType = '污水'
              this.objInfo.smallType = '污水管线'
              break
            // 给水
            case 'map_supply_firehydrant': //消火栓一定是给水
              this.objInfo.bigType = '给水'
              this.objInfo.smallType = '消火栓'
              break
            case 'map_supply_valve': //阀门valve一定是给水
              this.objInfo.bigType = '给水'
              this.objInfo.smallType = '阀门'
              break
            case 'map_supply_pipe_distribute': //配水管线
              this.objInfo.bigType = '给水'
              this.objInfo.smallType = '配水管线'
              break
            case 'map_supply_pipe_delivery': //输水管线
              this.objInfo.bigType = 'supply'
              this.objInfo.smallType = '输水管线'
              break
            case 'map_supply_pipe_circulating': //回水管线
              this.objInfo.bigType = '给水'
              this.objInfo.smallType = '回水管线'
              break
            case 'map_waterwork': //供水厂
              this.objInfo.bigType = '给水'
              this.objInfo.smallType = '供水厂'
              break
            // 再生水
            case 'map_recycle_pipe': //再生水管线
              this.objInfo.bigType = '再生水'
              this.objInfo.smallType = 'pipeline'
              break
            case 'map_waterwork': //再生水厂
              this.objInfo.bigType = '再生水'
              this.objInfo.smallType = '再生水厂'
              break
          }
          // 设施编号
          this.objInfo.code =
            f.properties.manhole_code ||
            f.properties.gate_code ||
            f.properties.outlet_code ||
            f.properties.comb_code ||
            f.properties.valve_code ||
            f.properties.pump_station_code ||
            f.properties.plant_code ||
            f.properties.pump_code ||
            f.properties.fire_cock_code ||
            f.properties.start_code + ',' + f.properties.end_code ||
            ''
          // })
        }
        console.log('this.objInfo: ', this.objInfo)
        // popup
        if (this.chosePoint) {
          let popupHtml = '<div id="base-detail"></div>'
          new mapboxgl.Popup()
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .setHTML(popupHtml)
            .addTo(window.xaMap)
          new popupItem({
            propsData: {
              detailId: 99999,
              lng: e.lngLat.lng.toFixed(3),
              lat: e.lngLat.lat.toFixed(3),
              bigType: this.objInfo.bigType,
              smallType: this.objInfo.smallType,
              deviceCode: this.objInfo.code,
              fun: this.editForm,
            },
          }).$mount('#base-detail')
        }
      })
      // window.xaMap.on('click',e=>{})结束
    },
    editForm() {
      this.$router.push({
        name: 'addProblemIndex',
        query: { msg: this.objInfo, token: this.formToken },
        params: { type: 'add' },
      })
    },
    async getList1() {
      let params = {
        sysCode: 'outwork',
        smallType: 'abnormal_inform',
        // token: this.accessToken,
        "page": {
          "current": 1,
          "size": -1,//-1查全部
        }
      }
      axios({
        url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/outworkapi/ticketStatisticClient/getTicketList',
        method: 'post',
        data: params,
        headers: this.header,
      }).then((res) => {
        console.log('getTableData-res: ', res)
        if (res.status == 200) {
          console.log(res.data.resultData.records, '========================')
          this.tableData = res.data.resultData.records
          this.getGeoJson()
          res.data.resultData.records.forEach((item) => {
            this.tableList.push({
              faultTypes: item.formValue.faultTypes,
              ticketStatusName: item.ticketStatusName,
              questionDescribe: item.formValue.questionDescribe,
              createByName: item.createByName,
              createTime: item.createTime.substring(0, 10),
              defectFrom: item.formValue.defectFrom,
              id: item.id,
              lnglat: [item.appealLng, item.appealLat],
            })
          })
          // this.$emit(this.tableList,'tableList')
        }
      })
    },
    // 将事件列表添加至地图
    getGeoJson() {
      let features = []
      let withoutPositionCount = 0
      console.log('要聚合展示的tableData', this.tableData)
      if (this.tableData.length == 0) {
        this.removeSomeLayer()
        return
      }
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
      this.timer = setInterval(() => {
        if (MapObj.map) {
          clearInterval(this.timer)
          this.renderCluster(geoJson)
        }
      }, 100)
    },
    removeSomeLayer() {
      ['clusters', 'cluster-count', 'unclustered-point'].forEach((item) => {
        if (MapObj.map?.getLayer(item)) {
          MapObj.map.removeLayer(item)
        }
      })
      if (MapObj.map?.getSource('earthquakes')) {
        MapObj.map.removeSource('earthquakes')
      }
    },
    // 渲染
    renderCluster(geoJsonSource) {
      this.removeSomeLayer()
      MapObj.map.addSource('earthquakes', {
        type: 'geojson',
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
          'circle-color': ['step', ['get', 'point_count'], "rgba(0, 209, 134, 0.8)", 5, "rgba(255, 148, 41, 0.8)", 15, "rgba(255, 74, 65, 0.8)"],
          'circle-radius': ['step', ['get', 'point_count'], 20, 5, 25, 15, 30],
          // 这个是外边框的颜色 circle-stroke-color这个对应了上面circle-color
          "circle-stroke-color": [
            "step",
            ["get", "point_count"],
            "rgba(0, 209, 134, 0.3)",
            5,
            "rgba(255, 148, 41, 0.3)",
            15,
            "rgba(255, 74, 65, 0.3)"
          ],
          // 这个是外边框晕染的范围
          "circle-stroke-width": [
            "step",
            ["get", "point_count"],
            8, //蓝色晕染长度，当点数小于100时为5px晕染
            5, //对应上面circle-color 数字，意思为100以内
            12, //点计数在100到750之间时为黄色，6px晕染
            15, //对应上面circle-color 数字，意思为750以内
            15 //点计数大于或等于750时为7px像素的粉红色晕染
          ]
        },
      })

      MapObj.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          // 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
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

      MapObj.map.on('click', 'unclustered-point', (e) => {
        // 如果当前事件点所有popup为打开状态，即事件点popup数组长度不为0，退出该次点击事件
        // if (MapObj.eventPopupArray.length > 0) return
        // 每次点击新的事件点就清除预案数据
        // this.fileList = []
        console.log('e.features: ', e.features)
        // console.log('formValue: ', JSON.parse(e.features[0].properties.formValue))
        MapObj.map.getCanvas().style.cursor = 'pointer'

        let formValue = JSON.parse(e.features[0].properties.formValue)
        console.log('formValue: ', formValue)

        var coordinates = e.features[0].geometry.coordinates.slice()
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }
        // Create a popup, but don't add it to the map yet.
        // this.popup1 = new mapboxgl.Popup({
        //   closeOnClick: true,
        //   closeButton: false,
        //   anchor: 'bottom',
        //   offset: { bottom: [0, -15] },
        // })
        // let text = formValue.detail ? formValue.detail.defectType : '其他'
        // console.log('text: ', text);
        // this.popup1
        //   .setLngLat(coordinates)
        //   .setHTML('<div id="vue-popup-custom" class="vue-popup-custom"><h3>'
        //     + text
        //     + '</h3></div>')
        //   .addTo(MapObj.map)
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
    },
    add() {
      this.objInfo = {}
      Toast({
        message: '地图点选',
        position: 'top',
      })
      this.chosePoint = true
    },
  },
}
</script>
<style lang="less">
#base-detail {
  width: auto;
  height: auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 20px;
  border: 1px saddlebrown solid;
}
</style>
<style lang="less" scoped>
.main {
  background-color: #f2f3f4 !important;
  height: 1334px;
  width: 750px;

  .map-container {
    height: 680px;
    width: 750px;
  }
}

/deep/.mapboxgl-popup-content {
  width: auto;
  min-width: 280px;
  height: 50px;
  padding: 24px 36px;
  border-radius: 18px;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
}
</style>
