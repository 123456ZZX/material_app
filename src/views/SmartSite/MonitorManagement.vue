<template>
  <div class="monitor-container">
    <fm-nav-bar
      title="监控管理"
      background="#2377fc"
      left-text=""
      left-arrow
      @click-left="$router.go(-1)"
    >
    </fm-nav-bar>
    <div class="monitor-box" v-if="monitor">
      <div id="monitorItem">
        <iframe :id="monitor.id" :src="monitor.url" width="100%" height="100%" scrolling="no">
        </iframe>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar } from 'fawkes-mobile-lib'
import { getMonitorData, getMonitorToken, getMonitorLocation } from './api'
export default {
  components: {
    [NavBar.name]: NavBar,
  },
  data() {
    return {
      portalId: '1270634057877864450', //暂时使用默认的
      title: 'All',
      optionsList: [{ key: 'All', value: '全部' }],
      height: 237,
      width: document.body.clientWidth - 30,
      monitorList: [],
      dataList: [],
      src_1: 'https://open.ys7.com/ezopen/h5/iframe_se?',
      src_2: 'url=ezopen://open.ys7.com/',
      src_3: '', //设备号
      src_4: '/',
      src_5: '', //通道号
      src_6: '.hd.live',
      src_7: '&autoplay=1&audio=0',
      src_8: '&accessToken=',
      src_9: 'at.79fg7e4z3ikybk760smcld14cetbeonn-3607s1hwtz-1xunbsp-beqmbs9vy', //access_token
      monitor: {},
      zoom: 17,
      center: [
        parseFloat(this.$route.query.longitudePosition),
        parseFloat(this.$route.query.latitudePosition),
      ],
      // markers: [],
    }
  },
  mounted() {
    this.getToken()
    this.getMonitorLocation()
  },
  watch: {},
  methods: {
    getToken() {
      this.$loading.show()
      getMonitorToken().then((res) => {
        if (res.status) {
          this.src_9 = res.data.accessToken
          this.getMonitorList()
        }
      })
    },
    backhome() {
      this.$router.history.go(-1)
    },
    getMonitorList() {
      getMonitorData({
        page: 1,
        size: 100,
        order: 'create_date desc',
        like: '',
        portalId: this.portalId,
        entityName: 'MonitorManagement',
        searchParamList: ['monitorName', 'monitorCode', 'userFullname'],
      })
        .then((res) => {
          res.data.list.forEach((item) => {
            item.url = this.getUrl(item)
          })

          this.monitorList = res.data.list
          if (this.$route.query.name) {
            this.monitor = this.monitorList.filter(
              (data) => data.monitorName == this.$route.query.name
            )[0]
          } else {
            this.monitor = this.monitorList[0]
          }

          this.dataList = this.monitorList
        })
        .finally(() => {
          this.$loading.hide()
        })
    },
    getUrl(item) {
      const src_3 = item.equipmentNum
      const src_5 = item.equipmentCode
      // const src_9 = item.access_token;
      const src_camera =
        this.src_1 +
        this.src_2 +
        src_3 +
        this.src_4 +
        src_5 +
        this.src_6 +
        this.src_7 +
        this.src_8 +
        this.src_9
      return src_camera
    },
    getMonitorLocation() {
      getMonitorLocation(this.portalId).then((res) => {
        if (res.status) {
          res.data.videoData.forEach(() => {
            // this.markers.push({
            //   position: [data.longitudePosition, data.latitudePosition],
            //   label: { content: data.monitorName, offset: [-30, -25] },
            //   vid: data.monitorName,
            // });
          })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .fm-nav-bar__title {
  color: #f9f9f9;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
}
.background {
  background-color: white;
}
.monitor-container {
  background-color: #f5f6fa;
  height: 100%;
  font-family: PingFang SC Regular;
  font-size: 14px;
  overflow: hidden;
}
.monitor-title {
  height: 36px;
  top: 8px;
  box-sizing: border-box;
}
.monitor-title /deep/ .vux-cell-value {
  text-align: left;
}
.monitor-radio-slot {
  text-align: center;
  padding: 8px 0;
  color: #888;
}
.monitor-content {
  margin: 18px 15px;
  border-radius: 1rem;
}
.monitor-content-img {
  margin-right: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 50%;
}
.monitor-content-title {
  margin-left: 15px;
  font-weight: 800;
  font-size: 16px;
}
.monitor-content-title:before {
  content: '';
  display: block;
  height: 1.4rem;
  width: 4px;
  position: absolute;
  background: linear-gradient(rgba(160, 225, 255, 1), rgba(54, 192, 255, 1));
  top: 7px;
  border-radius: 2px;
}
.weui-cell {
  padding: 0;
}
.mapbox {
  position: relative;
  height: 350px;
  width: 100%;
  text-align: center;
}
.monitor-box {
  height: 100%;
  overflow: hidden;
}

#monitorItem {
  height: 50%;
  overflow: hidden;
}

/deep/.fm-icon {
  color: #fff !important;
}
</style>
