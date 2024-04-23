<!--
 * @Author: gao_m3
 * @Date: 2022-04-25 10:57:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-13 09:07:34
 * @Descripttion: 
-->
<template>
  <div class="mapbox-container">
    <div id="map" :prop="isResetCompass" :change:prop="mResetCompass"></div>
    <div class="pos" @click.prevent="resetLocations" v-if="check">
      <!-- <img src="@/assets/img/currentPosi.png" alt="" /> -->
    </div>
  </div>
</template>

<script src="https://cdn.bootcdn.net/ajax/libs/Turf.js/6.5.0/turf.min.js"></script>
<script>
import * as turf from '@turf/turf'
import '@/components/map/css/mapbox-gl-enhance.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import RightTool from '@/components/map/rightTool'
import BottomTool from '@/components/map/bottomTool'
import Dimension from '@/components/map/dimension'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
const mapboxgl = require('!mapbox-gl/dist/mapbox-gl.js')
// import { SELF_POSITION_DATA } from '@/store/State/stateTypes'
export default {
  name: 'Map',
  components: {
    RightTool,
    BottomTool,
    Dimension,
  },
  props: {
    center: {
      type: Array,
      default: [119.976365, 30.276953],
    },
    range: {
      type: Number,
      default: 0.05,
    },
    check: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      map: {},
      visible1: {
        // 工具栏是否显示
        home: true,
        dimension: false,
        layer: false,
      },
      angle: -45, // 指南针图标旋转的角度，地图旋转/重置朝向时改变angle的值，将值传递给逻辑层
      isResetCompass: false, // 重置地图朝向，用于向renderjs传递消息
      mapStyle: 'vec', // 底图类型，用于向renderjs传递消息
      showAnnotation: true, // 是否显示注记，用于向renderjs传递消息
      resetView: false, // 视角复原，用于向renderjs传递消息
      zoom: 16, // 当前缩放层级
      maxZoom: 18, // 最大层级
      minZoom: 10, // 最小层级
    }
  },
  created() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiZW1yeXMyMSIsImEiOiJja2k1Yjk1aWgxOGtsMnFsbGEyZ3B4NXJjIn0.5oHeel53Kfek_7c5rZP2KA'
  },
  mounted() {
    //地图渲染
    this.map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {
          tiandituVecW: {
            type: 'raster',
            tiles: [
              'http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=f399e2a5999d31203920006238a1a264',
            ],
            tileSize: 256,
            maxzoom: 18,
          },
          tiandituCvaW: {
            type: 'raster',
            tiles: [
              'http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=f399e2a5999d31203920006238a1a264',
            ],
            tileSize: 256,
            maxzoom: 18,
          },
        },
        layers: [
          {
            id: 'tiandituVecW',
            type: 'raster',
            source: 'tiandituVecW',
            layout: {
              visibility: 'visible',
            },
          },
          {
            id: 'tiandituCvaW',
            type: 'raster',
            source: 'tiandituCvaW',
            layout: {
              visibility: 'visible',
            },
          },
        ],
      },
      zoom: this.zoom,
      minZoom: 10,
      maxZoom: 22,
      center: this.center,
    })
    console.log(this.map._controls)
    // 绘制多边形
    let draw = new MapboxDraw()
    this.map.addControl(draw, 'top-left')
    // 移除mapbox的logo
    this.map._logoControl && this.map.removeControl(this.map._logoControl)
    // 监听地图旋转事件
    this.map.on('rotate', this.onRotate)

    let that = this
    this.map.on('load', (e) => {
      this.map.flyTo({
        center: that.center,
        essential: true, // 取消慢速动画
        zoom: this.zoom,
      })
      //添加图片
      //当前定位图片
      // that.map.loadImage(
      //   require('@/assets/img/position.png'),
      //   function (error, image) {
      //     if (error) throw error
      //     that.map.addImage('mark', image)
      //   }
      // )
      // //标记图片
      // that.map.loadImage(
      //   require('@/assets/img/point.png'),
      //   function (error, image) {
      //     if (error) throw error
      //     that.map.addImage('point', image)
      //   }
      // )
      //获取当前位置并标记
      if (this.check) {
        this.resetLocations()
      }

      //设置目标位置的数据源
      that.map.addSource('point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: that.center,
              },
            },
          ],
        },
      })
      // 标记目标位置图片
      that.map.addLayer({
        id: 'point',
        type: 'symbol',
        source: 'point',
        layout: {
          'icon-image': 'point',
        },
      })
      //以目标位置为中心点画圆
      //半径50m
      that.map.addSource(
        'polygon',
        that.createGeoJSONCircle(that.center, that.range)
      )
      that.map.addLayer({
        id: 'polygon',
        type: 'fill',
        source: 'polygon',
        paint: {
          'fill-color': '#2988FE',
          'fill-opacity': 0.1,
        },
      })
    })
  },
  methods: {
    //获取定位
    resetLocations() {
      let that = this
      if (typeof yuanchu != 'undefined') {
        yuanchu.locationAMap.requestSingleLocation(['1'], (res) => {
          let geojson = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [res.longitude, res.latitude],
                },
              },
            ],
          }
          that.map.flyTo({
            essential: true, // 取消慢速动画
            zoom: that.zoom,
            center: [res.longitude, res.latitude],
          })
          if (that.check) {
            let temp = this.getDistance(
              [res.longitude, res.latitude],
              that.center
            )

            this.$emit('judge', temp > this.range)
          }

          // 点击重置定位
          if (this.map.getSource('center') == undefined) {
            that.map.addSource('center', { type: 'geojson', data: geojson })
            that.map.addLayer({
              id: 'center',
              type: 'symbol',
              source: 'center',
              layout: {
                'icon-image': 'mark',
              },
            })
          } else {
            that.map.getSource('center').setData(geojson)
          }
        })
      }
    },
    //测距
    getDistance(loc0, loc1) {
      var from = turf.point(loc0)
      var to = turf.point(loc1)
      var options = { units: 'kilometers' }

      return turf.distance(from, to, options)
    },
    //画圆 配合缩放 单位km
    createGeoJSONCircle(center, radiusInKm, points) {
      if (!points) points = 64
      var coords = {
        latitude: center[1],
        longitude: center[0],
      }
      var km = radiusInKm
      var ret = []
      var distanceX =
        km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180))
      var distanceY = km / 110.574
      var theta, x, y
      for (var i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI)
        x = distanceX * Math.cos(theta)
        y = distanceY * Math.sin(theta)
        ret.push([coords.longitude + x, coords.latitude + y])
      }
      ret.push(ret[0])
      return {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [ret],
              },
            },
          ],
        },
      }
    },
    /* 改变指南针图标旋转角度，供renderjs调用 */
    receiveAngle(angle) {
      this.angle = angle
    },
    /* 重置地图朝向 */
    resetCompass() {
      // 点击指南针图标时将该值取反，renderjs监听到变化重置地图朝向
      this.isResetCompass = !this.isResetCompass
    },
    /* 监听子组件底图切换事件 */
    changeMap(style) {
      this.mapStyle = style
    },
    /* */
    changeAnnotation(showAnnotation) {
      this.showAnnotation = showAnnotation
    },
    /*
     * 右侧工具栏点击事件
     * 改变工具栏状态，显示不同面板
     */
    changeStatus(toolId) {
      let that = this
      let keys = Object.keys(that.visible1)
      keys.forEach((key) => {
        if (key == toolId) {
          that.visible1[key] = true
        } else {
          that.visible1[key] = false
        }
      })
      // 复位
      if (toolId == 'home') {
        that.resetView = !that.resetView
      }
    },
    /* 地图缩放 */
    changeZoom(isEnlarge) {
      if (this.maxZoom === this.zoom && isEnlarge) {
        return
      }
      if (this.minZoom === this.zoom && !isEnlarge) {
        return
      }
      isEnlarge ? this.zoom++ : this.zoom--
    },
    goBack() {
      uni.navigateBack()
    },
    /* 底图切换 */
    mChangeMap(newValue, oldValue, ownerInstance, instance) {
      this.mapStyle = newValue
      switch (newValue) {
        case 'vec':
          this.map.setLayoutProperty('tiandituVecW', 'visibility', 'visible')
          if (this.showAnnotation) {
            this.map.setLayoutProperty('tiandituCvaW', 'visibility', 'visible')
          }
          break
        case 'img':
          this.map.setLayoutProperty('tiandituImgW', 'visibility', 'visible')
          if (this.showAnnotation) {
            this.map.setLayoutProperty('tiandituCiaW', 'visibility', 'visible')
          }
          break
        case 'ter':
          this.map.setLayoutProperty('tiandituTerW', 'visibility', 'visible')
          if (this.showAnnotation) {
            this.map.setLayoutProperty('tiandituCtaW', 'visibility', 'visible')
          }
          break
      }
      switch (oldValue) {
        case 'vec':
          this.map.setLayoutProperty('tiandituVecW', 'visibility', 'none')
          this.map.setLayoutProperty('tiandituCvaW', 'visibility', 'none')
          break
        case 'img':
          this.map.setLayoutProperty('tiandituImgW', 'visibility', 'none')
          this.map.setLayoutProperty('tiandituCiaW', 'visibility', 'none')
          break
        case 'ter':
          this.map.setLayoutProperty('tiandituTerW', 'visibility', 'none')
          this.map.setLayoutProperty('tiandituCtaW', 'visibility', 'none')
          break
      }
    },
    /* 是否开启注记 */
    mChangeAnnotation(newValue, oldValue, ownerInstance, instance) {
      let layer = ''
      let visibility = 'visible'
      if (this.mapStyle == 'vec') {
        layer = 'tiandituCvaW'
      } else if (this.mapStyle == 'img') {
        layer = 'tiandituCiaW'
      } else if (this.mapStyle == 'ter') {
        layer = 'tiandituCtaW'
      }
      if (!newValue) {
        visibility = 'none'
      }
      this.map.setLayoutProperty(layer, 'visibility', visibility)
    },
    /* 地图旋转事件处理：获取旋转角度，传递给逻辑层，从而控制指南针图标旋转角度 */
    onRotate() {
      let tempAngle = this.map.getBearing() * -1
      let angle = tempAngle - 45
      this.$ownerInstance.callMethod('receiveAngle', angle)
    },
    /* 重置地图朝向 */
    mResetCompass() {
      this.map.easeTo({ bearing: 0, pitch: 0 })
    },
    /* 视角复原 */
    mResetView() {
      this.map.easeTo({ center: this.center, zoom: 14, bearing: 0, pitch: 0 })
    },
    mChangeZoom(newValue, oldValue, ownerInstance, instance) {
      if (newValue > oldValue) {
        this.map.zoomIn()
      } else if (newValue < oldValue) {
        this.map.zoomOut()
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../components/map/css/mapbox-gl-enhance.css';
/deep/.mapboxgl-ctrl-top-left div {
  display: none !important;
}
/* 地图容器 */
.mapbox-container {
  position: relative;
  width: 100%;
  height: 100%;
}
/* 状态栏 */
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #ffffff;
}
/* 设置地图全屏显示，否则默认300px*162px */
#map {
  height: calc(100% - var(--status-bar-height));
  width: 100%;
  height: 100%;
}
/* 返回按钮 */
.back-btn {
  position: fixed;
  top: calc(16rpx + var(--status-bar-height));
  left: 14rpx;
  width: 112rpx;
  height: 112rpx;

  background-size: 112rpx 112rpx;
  background-repeat: no-repeat;
  text-align: center;
}
.back-img {
  width: 18rpx;
  height: 30rpx;
  padding-top: 38rpx;
  padding-right: 4rpx;
}
.pos {
  position: absolute;
  z-index: 1000;
  bottom: 60px;
  right: 30px;
  img {
    width: 49px;
    height: 49px;
  }
}
</style>
