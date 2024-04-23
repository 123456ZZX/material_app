<template>
  <div class="pump-map">
    <fm-nav-bar title="地图" left-arrow @click-left="$router.replace('/BZList')">
    </fm-nav-bar>
    <!-- 地图 -->
    <MapComp ref="mymap" :ifInspection="true" @mapLoaded="mapLoaded"></MapComp>
    <div class="center" v-if="show">
      <!-- 供水卡片 -->
      <div class="gsCard" v-if="pumpType=='供水'">
        <div class="loading" v-if="!loaded">
          <fm-loading size="15px" type="spinner" color="white" />
        </div>
        <div v-else>
          <div class="cardText">
            {{pumpName}}
          </div>
          <div class="row">
            <img class="cardIcon" src="@/assets/img/pumpmap/GsTag.png">
            <div class="chartHeaderText">{{liveData.pumpState.runNum !=null?liveData.pumpState.runNum: '--'}}</div>
            <img class="cardIcon" src="@/assets/img/pumpmap/iconRed.png">
            <div class="chartHeaderText">{{liveData.pumpState.alarmNum!=null?liveData.pumpState.alarmNum: '--'}}</div>
            <img class="cardIcon" src="@/assets/img/pumpmap/iconGrey.png">
            <div class="chartHeaderText">{{liveData.pumpState.offNum !=null?liveData.pumpState.offNum: '--'}}</div>
          </div>
          <!-- 表头 -->
          <div class="list">
            <div class="chartCell">
              <fm-divider class="divider" />
              <div class="chartHeader">
                <div class="chartHeaderText"></div>
                <div class="chartHeaderText">进水</div>
                <div class="chartHeaderText">出水</div>
              </div>
            </div>
            <div class="chartCell" v-for="(item,index) in  liveData && liveData.waterPressure" :key="index">
              <fm-divider class="divider" />
              <div class="chartHeader">
                <div class="chartTitelText">{{item.monitorItem !=null?item.monitorItem: '--'}}</div>
                <div class="chartHeaderText">{{item.inner !=null?item.inner: '--'}}</div>
                <div class="chartHeaderText">{{item.outer!=null?item.outer: '--'}}</div>
              </div>
            </div>
            <div class="chartCell" v-for="(item,index) in liveData && liveData.waterQuality" :key="index+100">
              <fm-divider class="divider" />
              <div class="chartHeader">
                <div class="chartTitelText">{{item.monitorItem !=null?item.monitorItem: '--'}}</div>
                <div class="chartHeaderText">{{item.inner !=null?item.inner: '--'}}</div>
                <div class="chartHeaderText">{{item.outer!=null?item.outer: '--'}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 雨水卡片 -->
      <div class="rainCard" v-else-if="pumpType=='雨水'">
        <div class="loading" v-if="!loaded">
          <fm-loading size="15px" type="spinner" color="white" />
        </div>
        <div v-else>
          <div class="cardText">
            {{pumpName}}
          </div>
          <div class="row">
            <img class="cardIcon" src="@/assets/img/pumpmap/RnTag.png">
            <div class="chartHeaderText">{{liveData.pumpState.runNumh !=null?liveData.pumpState.runNumh: '--'}}</div>
            <img class="cardIcon" src="@/assets/img/pumpmap/iconRed.png">
            <div class="chartHeaderText">{{liveData.pumpState.alarmNum !=null?liveData.pumpState.alarmNum: '--'}}</div>
            <img class="cardIcon" src="@/assets/img/pumpmap/iconGrey.png">
            <div class="chartHeaderText">{{liveData.pumpState.offNum !=null?liveData.pumpState.offNum: '--'}}</div>
          </div>
          <div class="output">
            出水流量：{{liveData.waterPressure[1].outer}} m³/h
          </div>
        </div>
      </div>
      <!-- 污水卡片 -->
      <div class="rainCard" v-else>
        <div class="loading" v-if="!loaded">
          <fm-loading size="15px" type="spinner" color="white" />
        </div>
        <div v-else>
          <div class="cardText">
            {{pumpName}}
          </div>
          <div class="row">
            <img class="cardIcon" src="@/assets/img/pumpmap/WsTag.png">
            <div class="chartHeaderText">{{liveData.pumpState.runNumh !=null?liveData.pumpState.runNumh: '--'}}</div>
            <img class="cardIcon" src="@/assets/img/pumpmap/iconRed.png">
            <div class="chartHeaderText">{{liveData.pumpState.alarmNum !=null?liveData.pumpState.alarmNum: '--'}}</div>
            <img class="cardIcon" src="@/assets/img/pumpmap/iconGrey.png">
            <div class="chartHeaderText">{{liveData.pumpState.offNum !=null?liveData.pumpState.offNum: '--'}}</div>
          </div>
          <div class="output">
            出水流量：{{liveData.waterPressure[1].outer}} m³/h
          </div>
        </div>
      </div>

    </div>
    <!-- 底部tab -->
    <div>
      <div class="center">
        <div class="card">
          <div>
            <fm-swipe class="my-swipe" ref="swipper" @change="onChange" :show-indicators="false">
              <fm-swipe-item v-for="(item,index) in tableData" :key="index">
                <div class="item">
                  <div class="item-tag" @click="goDetail(AllList[index])">
                    <img class="img" src="@/assets/img/pumpmap/mapTag.png">
                    <img class="imgs" src="@/assets/img/pumpmap/tagIcon.png">
                    <span class="font">{{liveData.alarmNum}}</span>
                  </div>
                  <img class="arrowButton" src="@/assets/img/pumpmap/arrowBack.png" @click="arrowBack">
                  <div class="item-img" @click="goDetail(AllList[index])">
                    <img class="imgList" :src="imgs[index]">
                  </div>
                  <div class="item-content" @click="goDetail(AllList[index])">
                    <div class="item-content-icon">
                      <img class="icon" src="@/assets/img/pumpmap/supercharge-pump@2x.png">
                      <div class="cardTitle">{{item.pumpName}}</div>
                      <fm-tag class="cardTag" round
                        :color="item.pumpType=='供水'?'#2D7EFF':item.pumpType=='污水'?'#91510A':'#40BB5A'">{{item.pumpType}}
                      </fm-tag>
                    </div>
                    <div class="item-content-text">
                      <img class="icon" src="@/assets/img/BZList/location.png">
                      <div class="cardText">{{item.address==''?'未获取到位置':item.address}}</div>
                    </div>
                  </div>
                  <img class="arrowButton" src="@/assets/img/pumpmap/arrow.png" @click="arrow">
                </div>
              </fm-swipe-item>
            </fm-swipe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapComp from '@/views/inspectMap/index.vue'
import request from '@/utils/request'
import mapboxgl from 'mapbox-gl'
import { pumpInfoPage, getLiveData } from './api'

const mapObj = {
  map: null,
  mapInstance: null,
}

export default {
  components: { MapComp, request },
  data() {
    return {
      show: false,
      loaded: false,
      pumpName: '',
      pumpType: '',
      imgUrl: '',
      imgs: [],
      tableData: [],
      liveData: {},
      allData: [],
      index: 0,
      AllList: [],
      GsList: [],
      WsList: [],
      RnList: [],
    }
  },

  created() {
    this.queryInfo()
    this.getData()
  },
  mounted() {
    //当前定位图片
    mapObj.loadImage(
      require('@/assets/img/pumpmap/loc.png'),
      function (error, image) {
        if (error) throw error
        that.map.addImage('mark', image)
      }
    )
  },
  methods: {
    arrow() {
      this.$refs.swipper.next()
    },
    arrowBack() {
      this.$refs.swipper.prev()
    },
    arrowTo(index) {
      this.$refs.swipper.swipeTo(index)
    },
    onChange(index) {
      this.tableData.forEach((item, itemIndex) => {
        if (itemIndex === index && item.lon != null && item.lat != null) {
          this.show = true
          this.getDataByName(item.pumpName)
          mapObj.map.flyTo({ center: [item.lon, item.lat] })
        }
      })
    },
    //泵站分页查询
    async queryInfo() {
      let query = {
        pageIndex: 1,
        pageSize: 15,
      }
      const {
        data: { records },
      } = await pumpInfoPage(query)
      this.tableData = records
      console.log(this.tableData)
      this.tableData.forEach((item) => {
        this.getLiveData(item.id)
        this.getImg(item.imageId)
      });
    },
    //获取图片
    getImg(imgToken) {
      this.imgUrl = imgToken ? '/api/sys-storage/download_image?f8s=' + imgToken : null
      this.imgs.push(this.imgUrl)
    },
    // 获取厂站列表数据
    getData() {
      request({
        url: '/xasw-pump/pump/app/list',
        method: 'get',
        pumpType: '供水',
      }).then((res) => {
        this.AllList = this.AllList.concat(res.data)
        this.AllList.forEach(element => {
          element.pumpType == '供水' ?
            this.GsList = this.GsList.concat(element) :
            element.pumpType == '污水' ?
              this.WsList = this.WsList.concat(element) :
              this.RnList = this.RnList.concat(element)
        });
      }).finally(() => {
      })
    },
    // 跳转详情页
    goDetail(tappedObject) {
      this.AllList != '' ?
        this.$router.push({
          path: '/BZList/BZdetail',
          query: {
            GsData: this.GsList,
            WsData: this.WsData,
            RnData: this.RnData,
            tappedObject: tappedObject,
          }
        }) :
        console.log('列表是空的')
    },
    //获取地图元素中的泵站名称
    getName(e) {
      if (e.originalEvent.srcElement.innerText != '' && e.originalEvent.srcElement.innerText != null) {
        this.show = true
        this.pumpName = e.originalEvent.srcElement.innerText
        this.getDataByName(e.originalEvent.srcElement.innerText)
        this.getIndex(e.originalEvent.srcElement.innerText)
      }
      else if (e.originalEvent.srcElement.id != '' && e.originalEvent.srcElement.id != null) {
        this.show = true
        this.pumpName = e.originalEvent.srcElement.id
        this.getDataByName(e.originalEvent.srcElement.id)
        this.getIndex(e.originalEvent.srcElement.id)
      }
      else {
        this.show = false
      }
    },
    //用泵站名称获取对应id
    getDataByName(name) {
      let temp
      this.pumpName = name
      this.tableData.forEach((item) => {
        if (name == item.pumpName) {
          temp = item.id
          this.pumpType = item.pumpType
        }
      })
      this.getLiveData(temp)
    },
    getIndex(name) {
      this.tableData.forEach((item, index) => {
        if (name == item.pumpName) {
          this.index = index
        }
      })
    },
    //获取实时数据
    getLiveData(id) {
      this.loaded = false
      request({
        url: `/xasw-pump/pump/app/monitoringAlarm`,
        method: "get",
        params: {
          pumpId: id
        },
      }).then((res) => {
        this.liveData = res.data
        this.allData.push(this.liveData)
        this.loaded = true
      })
    },
    //地图初始化
    async mapLoaded(mapInstance) {
      mapObj.mapInstance = mapInstance
      mapObj.map = mapInstance.map

      this.tableData.forEach((item) => {
        if (!item.pumpIcon) return
        let box = document.createElement('div')
        box.className = 'pump-map-item'
        box.style.display = 'flex'
        box.style.flexDirection = 'column'
        box.style.alignItems = 'center'

        let content = document.createElement('div')
        content.className = 'pump-map-text'
        content.innerText = item.pumpName
        // content.click=this.onClick(item.pumpName)
        content.style.backgroundColor = 'none'
        content.style.color = 'none'
        content.style.textAlign = 'center'

        let icon = document.createElement('div')
        icon.className = 'pump-map-icon'
        icon.id = item.pumpName
        icon.style.background = `url(${require(`@/assets/img/pumpmap/loc.png`)}) no-repeat`
        icon.style.backgroundSize = '100%'
        icon.style.height = '15px'
        icon.style.width = '15px'
        icon.style.textAlign = 'center'

        box.appendChild(content)
        box.appendChild(icon)

        let marker = new mapboxgl.Marker(box).setLngLat([item.lon, item.lat]).addTo(mapObj.map)

        marker.getElement().addEventListener('click', () => {
          this.config = true
        })
      })

      mapObj.map.on('click', (e) => {
        console.log(e)
        this.loaded = false
        this.getName(e)
        this.arrowTo(this.index)
        if (!this.config) return
        let { lat, lng } = e.lngLat
        mapObj.map.flyTo({ center: [lng, lat] })
        this.config = false
      })
    },
  },
}
</script>

<style  lang="less" scoped>
.pump-map {
  position: relative;
  height: 100%;
  overflow: hidden;

  .pump-map-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pump-map-icon {
    width: 60px;
    height: 60px;
    text-align: center;
  }

  .pump-map-text {
    height: 40px;
    line-height: 40px;
    text-align: center;
    padding: 0 10px;
  }
}

.cardTitle {
  margin-left: 10px;
  margin-right: 10px;
  max-width: 200px;
  font-size: 25px;
  line-height: 25px;
  height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.my-swipe .fm-swipe-item {
  font-size: 20px;
  line-height: 212px;
  height: 100%;
  text-align: center;
  background-color: none;
}

.card {
  position: absolute;
  bottom: 50px;
  width: 690px;
  height: 212px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0px 8px 20px 0px #B4C5E2;
  overflow: hidden;
  z-index: 99;
}

/deep/ .cell-line-size {
  line-height: 4px;
}

.cardTag {
  justify-content: center;
  border: none;
  color: white;
  height: 30px;
  width: 50px;
  font-size: 15px;
}

.gsCard {
  position: absolute;
  top: 400px;
  width: 300px;
  height: 400px;
  background-color: #000000;
  border-radius: 10px;
  opacity: 0.7;
  overflow: hidden;
  padding: 20px;
  z-index: 399;
}

.rainCard {
  position: absolute;
  top: 600px;
  width: 300px;
  height: 200px;
  background-color: #000000;
  border-radius: 10px;
  opacity: 0.7;
  overflow: hidden;
  padding: 20px;
  z-index: 399;
}

.cardIcon {
  margin-top: 20px;
  height: 40px;
}

.list {
  overflow-x: hidden;
  overflow-y: scroll;
  height: 300px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
}

.cardText {
  display: flex;
  color: #FFFFFF;
  font-size: 30px;
  margin-left: 10px;
  margin-right: 10px;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  align-items: center;
}

.output {
  color: #FFFFFF;
  margin-top: 50px;
  font-size: 20px;
  margin-left: 10px;
  text-overflow: ellipsis;
}

.divider {
  margin-top: 10px;
  margin-bottom: 10px;
}

.tag {
  background-color: black;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 10%;
}

.img {
  position: absolute;
  height: 30px;
  right: 0;
  top: 0;
}

.icon {
  height: 30px;
}

.iconText {
  position: absolute;
  color: black;
  height: 20px;
  right: 10px;
  top: 0px;
}

.chartCell {
  background-color: #000000;
  opacity: 0.7;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40%;
}

.chartHeader {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.chartHeaderText {
  color: white;
  width: 100%;
  font-size: 14px;
  text-align: center;
}

.arrowButton {
  height: 22px;
}

.group {
  background-color: #000000;
  opacity: 0.7;
}

.chartTitelText {
  color: white;
  width: 100%;
  font-size: 14px;
  text-align: left;
}

.text {
  z-index: 1;
}

.imgList {
  width: 232px;
  height: 132px;
  border-radius: 18px;
}

.item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  height: 212px;
  box-shadow: 0px 8px 20px 0px rgba(180, 197, 226, 1);
  border-radius: 16px;
  padding: 0 34px 0 24px;

  .item-tag {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
    height: 40px;
    background-color: #fff;

    .img {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .imgs {
      width: 20px;
      height: 20px;
      z-index: 1;
    }

    .font {
      font-size: 14px;
      z-index: 1;
      color: white;
    }
  }

  .lableText {
    color: #2D7EFF;
    font-weight: 400;
    font-size: 14pt;
  }

  .item-img {
    width: 232px;
    height: 132px;
  }

  .item-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 380px;
    height: 132px;
    background-color: #eee;

    .item-content-icon {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      height: 65px;
      background-color: #fff;
    }

    .item-content-text {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      height: 70px;
      line-height: 30px;
      overflow: hidden;
      background-color: #fff;
    }
  }
}
</style>
