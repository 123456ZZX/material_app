<template>
  <div class="mymap" id="mymap" ref="mymap"></div>
</template>
<script>
import mapInit from "./index.js";
import addImgToMap from "./utils/setIcon.js";
import mixins from "./mixins/mixins";
import layerControl from "./utils/layerControl.js";
import API from '@/common/config.js';
import * as turf from '@turf/turf';
import { legendListImport } from "@/components/xa-map/legendList.js";
import { Toast } from 'fawkes-mobile-lib'
const mapObj = {
  map: null,
  mapInstance: null
}
export default {
  name:"myMap",
  mixins:[mixins],
  props: {
    ifInspection: {
      type: Boolean,
      default: false
    },
    ifDetail: {
      type: Boolean,
      default: false
    },
    inspBusinessType: {
      type: String,
      default: ""
    },
    currentPosition: {
      type: Object,
      default: () => {}
    },
    taskInspType: {
      type: String,
      default: ""
    },
    tripleVisible: {
      type: Boolean,
      default: false
    },
    toggleNavigator: {
      type: Boolean,
      default: false
    },
    lineNavigator: {
      type: Boolean,
      default: false
    },
    areaNavigator: {
      type: Boolean,
      default: false
    },
    legendConfig: {
      type: Array,
      default() {
        return [];
      },
    },
    legendList: {
      type: Array,
      default() {
        return legendListImport
      }
    }
  },
  watch: {
    legendConfig: {
      handler(newVal) {
        this.changeLegend()
      },
      deep: true
    }
  },  
  data(){
    return {
    }
  },
  methods:{
    initMap(){
      let options = {
        style: {
          version: 8,
          pitch: 0,
          zoom: 13.570532360577655,
          center: [115.92486101369428, 39.06075549589073],
          glyphs:
            API.VUE_APP_MAP_URL + "/mapboxSource/fonts/{fontstack}/{range}.pbf",
          sprite: API.VUE_APP_MAP_URL + "/mapboxSource/sprites/sprite",
          sources: layerControl.defaultSource,
          layers: layerControl.defaultLayers,
        }
      };
      new mapInit({
        container: "mymap",
        options: this.ifInspection ? options : {},
        center: [115.92486101369428, 39.06075549589073],
        bus: this
      },
      async (mapInstance) => {
        mapObj.mapInstance = mapInstance;
        mapObj.map = mapInstance.map;
        window.map = mapInstance.map;
        window.mapInstance = mapInstance
        this.mapLoad(mapInstance)
        addImgToMap(mapObj.map);
        await this.addPipeLayer();
        this.addBufferLayer();
        this.addInspUserLayer();
        this.addUser();
        this.isOnLoad = true;
        this.$emit('mapLoaded', mapInstance)
        // if (!this.ifInspection) {
        //   mapObj.map.on('click', (e)=> {
        //     if(this.toggleNavigator){
        //       this.addNavigatorPoint([e.lngLat.lng,e.lngLat.lat]);
        //     } else if(this.lineNavigator){
        //       this.addNavigatorPointsLine([e.lngLat.lng,e.lngLat.lat]);
        //     }else if(this.areaNavigator){
        //       this.addNavigatorPointsArea([e.lngLat.lng,e.lngLat.lat]);
        //     }
        //   })
          // mapObj.map.on('dblclick', (e)=> {
          //   console.log('e2 :>> ', e);
          // })
          //定位
          // let position = await this.getUserPosition();
          // this.setUserPosition(position || [119.9,30.3]);
          // window.mapInit.flyTo(position || [119.9,30.3],16);
        // }


        // this.addDeviceLayersClickEvent();
        // this.addOrganizerMarker({position:[120,30],distance:"111"});
        
        // 添加地图点击事件监听
        
          // // let that = this;
          // mapInstance.map.on("click", function(e) {
          //   console.log(e)
          //   const features = mapInstance.map.queryRenderedFeatures(e.point);
          //   console.log("features==>", features);
            // // // 将初始图层的feature加入到当前管线图层中
            // // if (features.length > 0 && features[0].source == "initInspLineSource") {
            // //   // console.log("features[0]==>", features[0]);
            // //   that.setLineGeoSource([features[0]], "curInspLineSource");
            // //   // 需要对其添加上报事件的功能
            // // } else if (features.length > 1 && features[1].source == "initInspLineSource") {
            // //   that.setLineGeoSource([features[1]], "curInspLineSource");
            // // } else if (features.length > 0) {
            // //   that.setLineGeoSource([], "curInspLineSource");
            // // }
            // // 对可选中图标的增加marker  || features[1].geometry.type === "LineString"
            // if (features.length > 0 
            //   && features[0].source !="eventPoints" 
            //   && features[0].source != "inspUser" 
            //   && features[0].source != "initInspLineSource" 
            //   && features[0].source != "keypoints" 
            //   &&(features[0].geometry.type === "Point")
            //   ) {
            //   that.addEventObjMarker(features[0]);
            // } else if (features.length > 1 
            //   && features[1].source !="eventPoints" 
            //   && features[1].source != "inspUser" 
            //   && features[1].source != "keypoints" 
            //   && (features[1].geometry.type === "Point")
            //   ) {
            //   that.addEventObjMarker(features[1]);
            // } else {
            //   // 移除全局事件点
            //   that.removeEventObjMarker();
            // }
          // })
      })
    },
    changeLegend() {
      if(this.legendConfig && this.legendConfig.length > 0) {
        this.legendConfig.forEach((item) => {
          this.legendList.forEach((legend) => {
            //控制一级图层
            if (item.label == legend.label) {
              legend.titleStatus = item.clickFlag;
              // 
              legend.options.forEach((smallItem) => {
                // 当该标题下图层内容为显示状态时才进入判断
                if (
                  legend.titleStatus === true &&
                  typeof smallItem.id == "number"
                ) {
                  Toast.allowMultiple();
                  setTimeout(() => {
                    Toast({
                      message: smallItem.label + "图层暂无数据！",
                      position: 'top'
                    });
                  }, 0);
                  return;
                }
                if (legend.titleStatus === true) {
                  // 标题状态点亮时
                  smallItem.clickFlag = false; // 图层均显示
                } else {
                  smallItem.clickFlag = true; // 图层均隐藏
                }
                this.legendControlLayer(smallItem);
              });
            }else {
              legend.options.forEach(smallItem => {
                if(item.label == smallItem.label) {
                  this.$set(smallItem, 'clickFlag', item.clickFlag)
                  this.legendControlLayer(smallItem)
                }
              })
            }
            
          });
        });
      }
    },
    legendControlLayer(item) {
      let timer = setInterval(() => {
        if (this.isOnLoaded && window.map) {
          clearInterval(timer)
          let map = window.map
          if (map.getLayer(item.id)) {
            if (item.clickFlag) {
              map.setLayoutProperty(item.id, "visibility", "none");
              if (item.id == "rd_map_drainpipe_ys_big") {
                let filter = map.getFilter("rd_map_manhole")
                if(filter.toString() == ['all'].toString() || filter.toString() == ['in', 'manhole_type', '雨水'].toString()){
                  if(map.getLayoutProperty('rd_map_drainpipe_ws_big', 'visibility') == 'none'){
                    filter = ['in', 'manhole_type', '']
                  }else {
                    filter = ['in', 'manhole_type', '污水']
                  }
                }
                //雨水管线图层控制雨水井、雨水箭头、雨水较小层级图层显示
                map.setLayoutProperty("rd_map_comb", "visibility", "none");
                
                map.setFilter("rd_map_manhole", filter);
                map.setLayoutProperty(
                  "rd_map_drainpipe_ys_big_direction",
                  "visibility",
                  "none"
                );
                map.setLayoutProperty(
                  "rd_map_drainpipe_ys_small",
                  "visibility",
                  "none"
                );
                map.setLayoutProperty(
                  "rd_map_drainpipe_ys_small_direction",
                  "visibility",
                  "none"
                );
              } else if (item.id == "map_supply_pipe_circulating") {
                //循环水（回水）管线控制循环水（回水）节点显示
                map.setLayoutProperty(
                  "map_supply_node_circulating",
                  "visibility",
                  "none"
                );
              } else if (item.id == "map_supply_pipe_distribute") {
                //配水管线控制配水节点显示
                map.setLayoutProperty(
                  "map_supply_node_distribute",
                  "visibility",
                  "none"
                );
              } else if (item.id == "map_supply_pipe_delivery") {
                //输水管线控制输水节点显示
                map.setLayoutProperty(
                  "map_supply_node_delivery",
                  "visibility",
                  "none"
                );
              } else if (item.id == "map_recycle_pipe") {
                //再生水管线控制再生水节点显示
                map.setLayoutProperty(
                  "map_recycle_node",
                  "visibility",
                  "none"
                );
              } else if (item.id == "rd_map_drainpipe_ws_big") {
                //污水管线图层控制污水井、污水箭头、污水较小层级图层显示
                let filter = map.getFilter("rd_map_manhole")
                if(filter.toString() == ['all'].toString() || filter.toString() == ['in', 'manhole_type', '污水'].toString()){
                  if(map.getLayoutProperty('rd_map_drainpipe_ys_big', 'visibility') == 'none'){
                    filter = ['in', 'manhole_type', '']
                  }else {
                    filter = ['in', 'manhole_type', '雨水']
                  }
                }            
                map.setFilter("rd_map_manhole", filter);
                map.setLayoutProperty(
                  "rd_map_drainpipe_ws_big_direction",
                  "visibility",
                  "none"
                );
                map.setLayoutProperty(
                  "rd_map_drainpipe_ws_small",
                  "visibility",
                  "none"
                );
                map.setLayoutProperty(
                  "rd_map_drainpipe_ws_small_direction",
                  "visibility",
                  "none"
                );
              }
            } else {          
              map.setLayoutProperty(item.id, "visibility", "visible");
              if (item.id == "rd_map_drainpipe_ys_big") {
                let filter = map.getFilter("rd_map_manhole")
                if(filter.toString() == ['in', 'manhole_type', ''].toString() || filter.toString() == ['in', 'manhole_type', '污水'].toString()){
                  if(map.getLayoutProperty('rd_map_drainpipe_ws_big', 'visibility') != 'none'){
                    filter = ['all']
                  }else {
                    filter = ['in', 'manhole_type', '雨水']
                  }
                }
                map.setFilter("rd_map_manhole", filter);
                map.setLayoutProperty(
                  "rd_map_comb",
                  "visibility",
                  "visible"
                );
                map.setLayoutProperty(
                  "rd_map_drainpipe_ys_big_direction",
                  "visibility",
                  "visible"
                );
                map.setLayoutProperty(
                  "rd_map_drainpipe_ys_small",
                  "visibility",
                  "visible"
                );
                map.setLayoutProperty(
                  "rd_map_drainpipe_ys_small_direction",
                  "visibility",
                  "visible"
                );
              } else if (item.id == "map_supply_pipe_circulating") {
                map.setLayoutProperty(
                  "map_supply_node_circulating",
                  "visibility",
                  "visible"
                );
              } else if (item.id == "map_supply_pipe_distribute") {
                map.setLayoutProperty(
                  "map_supply_node_distribute",
                  "visibility",
                  "visible"
                );
              } else if (item.id == "map_supply_pipe_delivery") {
                map.setLayoutProperty(
                  "map_supply_node_delivery",
                  "visibility",
                  "visible"
                );
              } else if (item.id == "map_recycle_pipe") {
                map.setLayoutProperty(
                  "map_recycle_node",
                  "visibility",
                  "visible"
                );
              } else if (item.id == "rd_map_drainpipe_ws_big") {
                let filter = map.getFilter("rd_map_manhole")
                if(filter.toString() == ['in', 'manhole_type', ''].toString() || filter.toString() == ['in', 'manhole_type', '雨水'].toString()){
                  if(map.getLayoutProperty('rd_map_drainpipe_ys_big', 'visibility') != 'none'){
                    filter = ['all']
                  }else {
                    filter = ['in', 'manhole_type', '污水']
                  }
                }            
                map.setLayoutProperty(
                  "rd_map_drainpipe_ws_big_direction",
                  "visibility",
                  "visible"
                );
                map.setFilter("rd_map_manhole", filter);
                map.setLayoutProperty(
                  "rd_map_manhole",
                  "visibility",
                  "visible"
                );
                map.setLayoutProperty(
                  "rd_map_drainpipe_ws_small_direction",
                  "visibility",
                  "visible"
                );
                map.setLayoutProperty(
                  "rd_map_drainpipe_ws_small",
                  "visibility",
                  "visible"
                );
              }
            }
          }
        }
      }, 500)
    },
      // 加载实时图层切片
    loadMapLayer(type) {
      console.log('type :>> ', type);
        this.isOnLoad = true;
        let inspType = '污水';
      // let inspType = type === "POLLUTED_WATER" ? '污水' : type === "RAI_WATER" ? '雨水' : '供水';
      mapObj.mapInstance.addTimerSource();
      this.swLayer[inspType] = mapObj.mapInstance.addTimerLayer(inspType);
        // this.swLayer['污水'] = mapObj.mapInstance.addTimerLayer(inspType);
    },
      // 加载实时图层切片
    loadMapLayerInsp(type) {
      let inspType = type === "POLLUTED_WATER" ? '污水' : type === "RAI_WATER" ? '雨水' : '供水';
      mapObj.mapInstance.addTimerSource();
      this.swLayer[inspType] = mapObj.mapInstance.addTimerLayer(inspType);
    },
    // 添加巡检范围
    addRangeList(rangeList) {
      // ranges为Polygon类型的范围，emeMarkers为应急任务的marker
      let ranges = [];
      rangeList.forEach((range, idx) => {
        if (range.gridGeom) {
          let geom = JSON.parse(range.gridGeom);
          if (geom.type === "Polygon") {
            ranges.push(geom);
            // this.addRangeLayer(geom, idx)
          }
        }
      });
      try {
        if (ranges.length > 0) {
          let feature = ranges[0];
          let polygon = turf.polygon(feature.coordinates)
          let bbox = turf.bbox({
            type:"FeatureCollection",
            features: [polygon]
          });
          mapObj.map.fitBounds(bbox, {
            padding: {top: 10, bottom:25, left: 15, right: 5}
          });
        }

        // const that = this;
        // var timer = setInterval(function() {
        //   if (that.isOnLoaded() && that.map.getSource("rangeSource")) {
        //     clearInterval(timer);
        //     that.setRangeLayer(ranges, ifEmergency);
        //   }
        // }, 500);
      } catch (e) {
        console.log(e);
      }

      // if (ifEmergency) {
      //   emeMarkers.forEach(eme => {
      //     this.addInspEmeMarker(eme, ifDetail);
      //     // this.addInspEventMarker(eme);
      //   })
      // }
    },
    // 添加关键点marker
    addKeyPoints(keyPointList) {
      // 清空上次的数据
      this.setKeyPointLayer([]);
      const features = keyPointList.map(keyPoint => {
        // if (keyPoint.deviceType != '管线') {
          let point = JSON.parse(JSON.stringify(keyPoint));
          point.geom = JSON.parse(point.geom);
          /*
            加载关键点的时候，如果已经上报关键点的巡检结果并签到，且正常，显示为绿色，异常显示为红色，未巡检显示为正常icon，已退回显示为橙色
          */
          let isGreen = false;
          let isRed = false
          let isBlue = false
          let isOrange = false // 已退回
          if (point.ext2 == "3") { // 巡检记录的ext2字段，默认为1（待复核），已通过为2，已退回为3
            isOrange = true
          } else if (point.deviceStatus == '0') { // 关键点巡检正常
            isGreen = true;
          } else if (point.deviceStatus == '1') {
            isRed = true
          } else {
            isBlue = true
          }
          return {
            type: 'Feature',
            id: point.id,
            geometry: point.geom,
            properties: {
              id: point.id,
              feature: point,
              isOrange: isOrange,// 已退回
              isGreen: isGreen,
              isRed: isRed,
              isBlue: isBlue
            }
          }
        // }
      });
      // 设置关键点数据
      this.setKeyPointLayer(features);
    },
    // 多任务添加关键点marker
    addKeyPointsInMulTask(keyPointList) {
      // 对重复关键点进行过滤
      let keyPointData = [];
      for (let i = 0; i < keyPointList.length; i++) {
        let element =JSON.parse(JSON.stringify(keyPointList[i]));
        let filterData = keyPointList.filter(x => x.engInfoDTO.engId === element.engInfoDTO.engId);
        keyPointList = keyPointList.filter(x => filterData.every( y=> x.engInfoDTO.engId !== y.engInfoDTO.engId));
        // element.eventType = '';
        // filterData.forEach(it => {
        //   element.eventType += it.eventType + ' '
        // })
        keyPointData.push(element);
      }
      keyPointData.forEach(keyPoint => {
        if (keyPoint.engInfoDTO && keyPoint.engInfoDTO.engGeom) {
          let point = JSON.parse(JSON.stringify(keyPoint.engInfoDTO));
          point.engGeom = JSON.parse(point.engGeom);
          this.addKeyPointMarker(point, ifDetail);
          let taskDetail = keyPoint.inspectionTaskDetailDTO.inspectionTaskDetail;
          /*
            加载关键点的时候，如果已经上报关键点的巡检结果并签到，且未被退回（待复核），显示为绿色
          */
          if (taskDetail.inspItemResult && taskDetail.isComplete == 1 && taskDetail.inspItemReview != 3) {
            this.changeKeyPointMarker(point.engId, true);
          }
        }
      })
    },
    // 移除应急巡检marker
    removeInspEmeMarkers(rangeList) {
      let emeMarkers = [];
      rangeList.forEach(range => {
        if (range.taskRangerGeom) {
          let geom = JSON.parse(range.taskRangerGeom);
          // 如果是应急任务，则需要添加marker
          emeMarkers.push(geom.id);
        }
      });
      if (emeMarkers.length > 0) {
        this.removeInspEmeMarker(emeMarkers)
      }
    }
  },
  mounted() {
    this.initMap();
  },
  // activated() {
  //     this.initMap();
  // },
  // deactivated() {
  //     mapObj.mapInstance.destoryMap();
  //     mapObj.mapInstance = null;
  // },
  beforeDestroy() {
    mapObj.mapInstance && mapObj.mapInstance.destoryMap();
    mapObj.mapInstance = null;
    this.hasListen = false
    window.removeEventListener('deviceorientationabsolute', this.setRotate)
  },
};
</script>
<style lang="less" scoped>
@import url('~@/components/map/css/mapbox-gl-enhance.css');
#mymap {
  width: 100%;
  min-height: 100%;
}
</style>