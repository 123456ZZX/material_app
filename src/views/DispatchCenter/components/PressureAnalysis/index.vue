<template>
  <div class="main">
    <fm-nav-bar title="压力分析" left-arrow @click-left="$router.go(-1)">
      <template #right>
        <fm-switch v-model="openPopup" @change="changePopup" size="24px" :disabled="isDataLoaded" />
      </template>
    </fm-nav-bar>
    <div class="mapContainer">
      <xa-map :create="mapLoaded" :legendConfig="legendConfig" />
      <div class="mapLegend">
        <div class="legendItem">
          <div class="colorItem" style="background: #F97777;"></div>
          <div class="pressureSpan">>0.35MPa</div>
        </div>
        <div class="legendItem">
          <div class="colorItem" style="background: #FFAF60;"></div>
          <div class="pressureSpan">0.25 ~ 0.35MPa</div>
        </div>
        <div class="legendItem">
          <div class="colorItem" style="background: #FFE36A;"></div>
          <div class="pressureSpan">0.20 ~ 0.25MPa</div>
        </div>
        <div class="legendItem">
          <div class="colorItem" style="background: #B7E89E;"></div>
          <div class="pressureSpan">0.15 ~ 0.20MPa</div>
        </div>
        <div class="legendItem">
          <div class="colorItem" style="background: #95BDFF;"></div>
          <div class="pressureSpan">0.00 ~ 0.15MPa</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defaltLegendList } from './defaultLegendList.js'
import * as apis from './api';
import { addIconToMap } from '@/utils/mapUtils';
import mapboxgl from 'mapbox-gl';
const mapObj = {
  mapInstance: null,
  map: null,
  popupList: []
}
export default {
  name: 'pressureAnalysis',
  data() {
    return {
      openPopup: true,
      isDataLoaded: true,
      legendConfig: [],
      supplyPressure: [],
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
        }
      ]
    }
  },
  mounted() {
    
  },
  methods: {
    changePopup(val) {
      if (val) {
        let features = this.supplyPressure.map(it => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [Number(it.lon), Number(it.lat)],
            },
            properties: {
              value: isNaN(Number(it.realtimeData.filter(it => it.isShow == 0)[0].val)) ? 0 : Number(it.realtimeData.filter(it => it.isShow == 0)[0].val),
              ...it
            }
          }
        })
        features.forEach(it => {
          this.addTitleMarker(it.properties.value, it.geometry.coordinates)
        })
      } else {
        mapObj.popupList.length > 0 && mapObj.popupList.forEach(it => it.remove())
        mapObj.popupList = []
      }
    },
    addTitleMarker(name, points) {
      let pop = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -15]
      });
      mapObj.popupList.push(pop)
      let timer = setInterval(() => {
        if (mapObj.map.getSource('supplyPressMonitor')) {
          clearInterval(timer)
          pop
            .setLngLat(points)
            .setText(name + 'Mpa')
            .addTo(mapObj.map);
        }
      }, 500)
    },
    async mapLoaded() {
      mapObj.mapInstance = window.xaMapBuilder
      mapObj.map = window.xaMap
      mapObj.map.setZoom(12)
      this.legendConfig = defaltLegendList
      await addIconToMap(mapObj.map, this.icons)
      mapObj.map.addSource('supplyPressMonitor', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
      })
      mapObj.map.addLayer({
        id: 'supplyPressMonitorLayer-heat',
        type: 'heatmap',
        source: 'supplyPressMonitor',
        maxzoom: 14.6,
        paint: {
            'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'value'],
                0,
                0,
                1,
                1
            ],
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10,
                1,
                13,
                12
            ],
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(149, 189, 255, 0.1)',
                0.2,
                'rgb(183, 232, 158)',
                0.4,
                'rgb(255, 227, 106)',
                0.6,
                'rgb(255, 175, 96)',
                0.8,
                'rgba(249, 119, 119, 0.9)',
                1,
                'rgb(249, 119, 119)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10,
                40,
                12,
                30,
                14,
                20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10,
                1,
                12,
                0.8,
                13.5,
                0.5,
                14.5,
                0.1
            ]
        }
      })
      mapObj.map.addLayer({
        id: 'supplyPressMonitorLayer',
        source: 'supplyPressMonitor',
        type: 'symbol',
        minzoom: 14.5,
        layout: {
          'icon-image': [
            'case',
            [
              'all',
              ['==', ['get', 'iotOnline'], '0'],
              ['!=', ['get', 'isWarn'], '1'],
            ],
            '压力监测(供)*',
            ['==', ['get', 'iotOnline'], '1'],
            '压力监测离线供',
            [
              'all',
              ['==', ['get', 'iotOnline'], '0'],
              ['==', ['get', 'isWarn'], '1'],
            ],
            '压力监测报警供',
            '压力监测(供)*'
          ]
        },
        'icon-size': 0.7,
        // 图标强制全部显示
        'icon-ignore-placement': true,
      })
      this.getAllSupplyWaterPress()
      mapObj.map.on('click', 'supplyPressMonitorLayer', this.pressureDetail)
    },
    pressureDetail(e) {
      let feature = mapObj.map.queryRenderedFeatures(e.point)[0]
      if (feature.layer.id == 'supplyPressMonitorLayer') {
        this.$router.push({
          path: '/DispatchCenter/PressureDetail',
          query: { deviceInfo: feature.properties, pressureStation: this.supplyPressure }
        })
      }
    },
    getAllSupplyWaterPress() {
      let params = {
        deviceType: 'IVTM',
      }
      apis.getAllEquipmentInformation(params).then((res) => {
        if (res.status) {
          this.supplyPressure = res.data.filter(
            (item) => item.belongSystem == '供水' || item.belongSystem == '再生水'
          )
          this.isDataLoaded = false
          let features = this.supplyPressure.map(it => {
            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [Number(it.lon), Number(it.lat)],
                },
                properties: {
                    value: isNaN(Number(it.realtimeData.filter(it => it.isShow == 0)[0].val)) ? 0 : Number(it.realtimeData.filter(it => it.isShow == 0)[0].val),
                    ...it
                }
            }
          })
          if (mapObj.map.getSource('supplyPressMonitor')) {
            mapObj.map.getSource('supplyPressMonitor').setData({
                type: 'FeatureCollection',
                features: features
            })
          }
          this.openPopup && features.forEach(it => {
            this.addTitleMarker(it.properties.value, it.geometry.coordinates)
          })
        }
      })
    }
  },
}
</script>

<style scoped lang="less">
.main {
  width: 100%;
  height: 100%;
  .mapContainer {
    height: calc(100% - 46px);
    width: 100%;
    background: linear-gradient(180deg, #e5f2ff 0%, #f6f8fa 25%, #f5f7f9 100%);
    .mapLegend {
      width: auto;
      min-width: 310px;
      height: 320px;
      background: #ffffff;
      position: absolute;
      bottom: 30px;
      left: 30px;
      padding: 20px 30px;
      display: flex;
      flex-direction: column;
      .legendItem {
        width: 100%;
        height: 45px;
        margin: 10px 0;
        display: flex;
        .colorItem {
          width: 16px;
          height: 16px;
          margin: auto;
          border-radius: 50%;
        }
        .pressureSpan {
          margin-left: 20px;
          height: 45px;
          font-size: 32px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 45px;
          width: 240px;
        }
      }
    }
  }
}
</style>