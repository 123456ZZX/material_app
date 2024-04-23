<template>
  <div class="xa-map" id="map"></div>
</template>

<script>
import * as turf from '@turf/turf'
import { Toast, Dialog } from 'fawkes-mobile-lib'
import MapInit from "./mapInit";
import layerControl from "./layerControl.js";
import API from '@/common/config.js';
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { legendListImport } from "./legendList.js";
export default {
  name: 'XaMap',
  props: {
    create: {
      type: Function,
      default() {
        return () => {}
      },
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
    },    
  },
  data() {
    return {
      defaultBaseLayers:[]
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
  async mounted() {
    window.turf = turf
    window.xaMap = ''
    window.xaMapBuilder = ''
    let options = {
      style: {
        version: 8,
        pitch: 0,
        zoom: 13.570532360577655,
        center: [115.92486101369428, 39.06075549589073],
        glyphs:
          API.VUE_APP_MAP_URL + '/mapboxSource/fonts/{fontstack}/{range}.pbf',
        sprite: API.VUE_APP_MAP_URL + '/mapboxSource/sprites/sprite',
        sources: {},
        layers: [{
          id: 'empty',
          type: "background",
          layout: {
            visibility: "none"
          }
        },{
          id: 'empty1',
          type: "background",
          layout: {
            visibility: "none"
          }
        },{
          id: 'empty2',
          type: "background",
          layout: {
            visibility: "none"
          }
        }],
      },
    }
    mapboxgl.accessToken =
      'pk.eyJ1IjoiOTM0MDk0Mjg2IiwiYSI6ImNsMnNmdmVrZDBrZGMzZG50cHJudXJkbW8ifQ.C0wKhJgrToFJgL8GH5M8rg'
    const mapBuilder = (window.xaMapBuilder = new MapInit({
      container: 'map',
      options: options,
      center: [115.92486101369428, 39.06075549589073],
    }))
    window.xaMap = mapBuilder.map
    const map = mapBuilder.map

    //去除mapbox的logo
    document.getElementsByClassName('mapboxgl-ctrl-logo')[0].style.display =
      'none'

    map.on('load', async () => {
      /**添加所有底图，不影响mapbox初始化时间 */
      await this.addAllBaseMap()

      /**添加所有图层 */
      await this.addLayers();

      /**用户自定义事件 */
      this.create()
    })
  },
  methods: {
    // 该方法用于控制图例对应图层的显示隐藏，只在地图初始化时调用一次，因为 legendConfig 是在地图初始化时传入的
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
                  setTimeout(() => {
                    Toast.info({
                      message: smallItem.label + "图层暂无数据！",
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
      let map = window.xaMap
      // if (item.clickFlag) {
      //   if(item.id == "压力监测(供)*"){
      //     let domList = document.getElementsByClassName("pressure-supply")
      //     Array.prototype.forEach.call(domList, (dom) => {
      //       dom.style.display = "none"
      //     })
      //   }else if(item.id == "压力监测(再生)*") {
      //     let domList = document.getElementsByClassName("pressure-recycle")
      //     Array.prototype.forEach.call(domList, (dom) => {
      //       dom.style.display = "none"
      //     })
      //   }else if(item.id == "流量计(供)*") {
      //     let domList = document.getElementsByClassName("flow-supply")
      //     Array.prototype.forEach.call(domList, (dom) => {
      //       dom.style.display = "none"
      //     })
      //   }else if(item.id == "流量计(再生)*") {
      //     let domList = document.getElementsByClassName("flow-recycle")
      //     Array.prototype.forEach.call(domList, (dom) => {
      //       dom.style.display = "none"
      //     })
      //   }
      // }else {
      //   if(item.id == "压力监测(供)*"){
      //     let domList = document.getElementsByClassName("pressure-supply")
      //     Array.prototype.forEach.call(domList, (dom) => {
      //       dom.style.display = "block"
      //     })
      //   }else if(item.id == "压力监测(再生)*") {
      //     let domList = document.getElementsByClassName("pressure-recycle")
      //     Array.prototype.forEach.call(domList, (dom) => {
      //       dom.style.display = "block"
      //     })
      //   }else if(item.id == "流量计(供)*") {
      //     let domList = document.getElementsByClassName("flow-supply")
      //     Array.prototype.forEach.call(domList, (dom) => {
      //       dom.style.display = "block"
      //     })
      //   }else if(item.id == "流量计(再生)*") {
      //     let domList = document.getElementsByClassName("flow-recycle")
      //     Array.prototype.forEach.call(domList, (dom) => {
      //       dom.style.display = "block"
      //     })
      //   }
      // }
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
    },
    async addLayers() {
      let map = window.xaMap;
      let env = process.env.NODE_ENV;
      //底图
      await axios
        .get(
          API.VUE_APP_MAP_REQUEST_URL +
            "/api/swan/mapWorkshopSource/detail?id=1557650273895288834"
        )
        .then((res) => {
          let layers = JSON.parse(res.data.data.combineJsonData);

          Object.keys(layers.sources).forEach((key) => {
            // if (env == "production") {
              let temp = layers.sources[key].tiles[0];
              // temp = temp.replaceAll("172.23.0.123:8008", "xasw.hdec.com");
              temp = temp.replaceAll("http://10.24.1.15:8008", "https://xionganwater.cn"); // 超算云青石
              layers.sources[key].tiles[0] = temp;
            // }
            map.addSource(key, layers.sources[key]);
          });
          layers.layers.forEach((layer) => {
            if (!layer.layout || layer.layout.visibility == "visible") {
              this.defaultBaseLayers.push(layer); //控制地图显隐
            }
            map.addLayer(layer, 'empty1');
          });
          this.$emit("getDefaultBaseLayers", this.defaultBaseLayers);
        })
        .catch((e) => {})
        .finally(() => {});
      //管线
      await axios
        .get(
          API.VUE_APP_MAP_REQUEST_URL +
            "/api/swan/mapWorkshopSource/detail?id=1548573412963749889"
        )
        .then((res) => {
          let layers = JSON.parse(res.data.data.jsonData);

          Object.keys(layers.sources).forEach((key) => {
            // if (env == "production") {
              let temp = layers.sources[key].tiles[0];
              // temp = temp.replaceAll("172.23.0.123:8008", "xasw.hdec.com");
              temp = temp.replaceAll("http://10.24.1.15:8008", "https://xionganwater.cn"); // 超算云青石
              layers.sources[key].tiles[0] = temp;
            // }
            map.addSource(key, layers.sources[key]);
          });
          layers.layers.forEach((layer) => {
            map.addLayer(layer, 'empty1');
            //图层移入移除以及点击事件
            map.on("mouseenter", layer.id, this.handleLayerEnter);
            map.on("mouseout", layer.id, this.handleLayerLeave);
            map.on("click", layer.id, this.handleLayerClick); 
          });
        })
        .catch((e) => {})
        .finally(() => {});
    },
    handleLayerEnter(e) {
      this.$emit("handleLayerEnter", e);
    },
    handleLayerLeave(e) {
      this.$emit("handleLayerLeave", e);
    },
    handleLayerClick(e) {
      this.$emit("handleLayerClick", e);
    },
    /**添加所有的底图 */
    addAllBaseMap() {
      let map = window.xaMap;
      let sources = layerControl.defaultSource;
      let layers = layerControl.defaultLayers;
      this.$emit("getBaseLayerObject", layers);
      Object.keys(sources).forEach((key) => {
        map.addSource(key, sources[key]);
      });
      layers.forEach((layer) => {
        map.addLayer(layer, 'empty');
      });
    },     
  }
}
</script>

<style lang="scss" scoped>
.xa-map {
  width: 100%;
  height: 100%;
}
</style>