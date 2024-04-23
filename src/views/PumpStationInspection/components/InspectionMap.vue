<template>
  <div class="inspection-map">
    <div class="notify-network" v-if="notifyShow">
      <span>网络异常，无法记录巡检轨迹！</span>
      <img
        src="@/assets/img/pump/inspection-cross.png"
        class="cross-icon"
        alt=""
        @click="notifyShow = false"
      />
    </div>
    <!-- 地图 -->
    <MapComp ref="mymap" :ifInspection="true" @mapLoaded="mapLoaded"></MapComp>
    <div class="map-line-remark">
      <div class="remark-text">轨迹记录</div>
    </div>
    <!-- 轨迹显示与定位功能 -->
    <div class="tool-box">
      <div class="location" @click="startLocation">
        <fm-image
          class="location-image"
          :src="require('@/assets/img/inspection/location.png')"
        ></fm-image>
      </div>
    </div>
  </div>
</template>

<script>
import MapComp from '@/views/inspectMap/index.vue'

import { trackList, uploadTrackList } from '../api'

const mapObj = {
  map: null,
  mapInstance: null,
}

export default {
  components: { MapComp },
  props: {
    //巡检状态(1:待巡检，2:巡检中，3:已完成 ，4:已终止)(手机端)
    PatrolData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      statusContentShow: false,
      notifyShow: false,
      inspectionUrl: '/pump/inspection', //巡检列表地址
      hiddenUrl: '/FormBase', //隐患工单界面

      trackList: [],

      currentPosition: null,
    }
  },

  created() {
    // this.setTrackList()
  },

  methods: {
    //跳转至巡检列表页
    // goTo(url) {
    //   this.$router.push(url)
    // },

    //获取巡检点轨迹
    async getTrackList() {
      console.log('获取巡检路径')
      let { taskId } = this.$store.state.pump.urlQuery
      const { data } = await trackList(taskId)

      this.trackList = data?.map((item) => {
        return [item.lon, item.lat]
      })

      console.log(this.trackList[0])

      if (this.trackList.length > 0) {
        this.currentPosition = {
          longitude: this.trackList[0][0],
          latitude: this.trackList[0][1],
        }
      }

      this.addLayer()
    },

    //添加巡检路线
    addLayer() {
      mapObj.map.getLayer('pump-route') && mapObj.map.removeLayer('pump-route')
      mapObj.map.getSource('pump-route') && mapObj.map.removeSource('pump-route')

      mapObj.map.addLayer({
        id: 'pump-route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: this.trackList,
            },
          },
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#2D7EFF',
          'line-width': 2,
        },
      })
    },

    //上传巡检点列表
    // async setTrackList() {
    //   let { taskId } = this.$store.state.pump.urlQuery
    //   let query = {
    //     patrolTaskId: taskId,
    //     trackDTOS: [
    //       {
    //         lat: 39.06075549589073,
    //         lon: 115.92486101369428,
    //       },
    //       {
    //         lat: 39.16075549589073,
    //         lon: 115.92486101369428,
    //       },
    //     ],
    //   }
    //   const res = await uploadTrackList(query)
    // },

    //地图初始化
    async mapLoaded(mapInstance) {
      mapObj.mapInstance = mapInstance
      mapObj.map = mapInstance.map

      this.PatrolData && this.PatrolData.patrolStatus === 2
        ? this.requestSingleLocation()
        : await this.getTrackList()
    },

    //获取定位
    requestSingleLocation() {
      console.log('开启定位')
      if (typeof yuanchu != 'undefined') {
        yuanchu.locationAMap.requestSingleLocation(
          ['1'],
          (res) => {
            let { latitude, longitude } = res

            let path = JSON.parse(JSON.stringify(this.$store.state.pump.pumpPath))

            path.push({
              lat: latitude,
              lon: longitude,
            })

            this.trackList = path?.map((item) => {
              return [item.lon, item.lat]
            })

            this.$store.commit('setPumpPath', path)

            this.addLayer()

            this.currentPosition = JSON.parse(JSON.stringify(res))
            const param = {
              ...this.currentPosition,
            }
            this.$refs.mymap.setInspUserPosition(param)
          },
          (err) => {
            console.log('err=', err)
          }
        )
      }
    },

    // 卡片定位
    flyToPoint(lnglat) {
      mapObj.map.flyTo({ center: lnglat, zoom: 17.5 })
    },
    // 开始定位
    startLocation() {
      if (
        !this.currentPosition ||
        !this.currentPosition.longitude ||
        !this.currentPosition.latitude
      ) {
        this.$toast({
          message: '获取位置失败!',
          duration: 2000,
        })
        return
      } else {
        const coord = [
          parseFloat(this.currentPosition.longitude),
          parseFloat(this.currentPosition.latitude),
        ]
        this.flyToPoint(coord)
      }
    },
  },
}
</script>

<style scoped lang="less">
.inspection-map {
  position: relative;
  height: 100%;
  overflow: hidden;

  .notify-network {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    background: rgba(255, 77, 79, 0.2);
    border-radius: 38px;
    margin: 0 30px;
    font-size: 28px;
    color: #ff4d4f;

    .cross-icon {
      position: absolute;
      right: 20px;
      width: 28px;
      height: 28px;
    }
  }

  .map-line-remark {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 30px;
    right: 30px;
    width: 168px;
    height: 68px;
    font-size: 28px;
    color: #000000;
    background: #ffffff;
    box-shadow: 0px 8px 20px 0px rgba(180, 197, 226, 1);
    border-radius: 34px;
    padding: 0 20px;

    &::after {
      display: inline-block;
      content: '';
      width: 40px;
      height: 4px;
      line-height: 68px;
      background: #2d7eff;
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
}
</style>
