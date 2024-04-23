<template>
  <div class="map">
    <div class="contorl">
      <div class="item" @click="show = true">
        <img src="@/assets/img/map/layer.png" alt="" />
        <div>图层</div>
      </div>
      <div class="item" v-if="!toolOpen" @click="toolOpen = true">
        <img src="@/assets/img/map/工具.png" alt="" />
        <div>工具</div>
      </div>
      <div class="itemOpen" v-if="toolOpen">
        <div class="item-open-div" @click="toolOpen = false">
          <img src="@/assets/img/map/工具-点击.png" alt="" />
          <div style="color: #1b67d8" class="font-m">工具</div>
        </div>
        <div class="item-open-div" @click="mapToolEmit('measureDistance')">
          <img v-if="!distanceClickFlag" src="@/assets/img/map/measure.png" alt="" />
          <img v-else src="@/assets/img/map/measure_click.png" alt="" />
          <div class="font-m">测量</div>
        </div>
        <div class="item-open-div" @click="mapToolEmit('measureSquare')">
          <img v-if="!areaClickFlag" src="@/assets/img/map/area.png" alt="" />
          <img v-else src="@/assets/img/map/area_click.png" alt="" />
          <div class="font-m">面积</div>
        </div>
        <div class="item-open-div">
          <img v-if="!locationClickFlag" src="@/assets/img/map/location.png" alt="" />
          <img v-else src="@/assets/img/map/location_click.png" alt="" />
          <div>定位</div>
        </div>
      </div>
      <div class="item" @click="flagBtnClick">
        <img v-if="!btnFlag" src="@/assets/img/map/浮窗关.png" alt="" />
        <img v-if="btnFlag" src="@/assets/img/map/浮窗开.png" alt="" />
        <div>浮窗</div>
      </div>
    </div>
    <fm-popup
      :visible.sync="show"
      position="bottom"
      :style="{ height: '45%' }"
      class="popup"
    >
      <div class="head">
        <div>图层</div>
        <i class="fm-icon fm-icon-cross" @click="show = false"></i>
      </div>
      <!-- 底图切换部分 -->
      <div class="item-box">
        <div
          v-if="mapShow === '默认底图'"
          style="margin-left: 15px; display: flex; flex-direction: row"
        >
          <div class="pic">
            <img
              @click="mapChange('默认底图')"
              src="@/assets/img/map/标准地图选中.png"
              alt=""
            />
            <div class="pic-f m">标准地图</div>
          </div>
          <div class="pic">
            <img
              @click="mapChange('影像图')"
              src="@/assets/img/map/卫星地图未选中.png"
              alt=""
            />
            <div class="pic-f">卫星地图</div>
          </div>
        </div>
        <div
          v-if="mapShow === '影像图'"
          style="margin-left: 15px; display: flex; flex-direction: row"
        >
          <div class="pic">
            <img
              @click="mapChange('默认底图')"
              src="@/assets/img/map/标准地图未选中.png"
              alt=""
            />
            <div class="pic-f">标准地图</div>
          </div>
          <div class="pic">
            <img
              @click="mapChange('影像图')"
              src="@/assets/img/map/卫星地图选中.png"
              alt=""
            />
            <div class="pic-f m">卫星地图</div>
          </div>
        </div>
      </div>

      <!-- 多选按钮，基础图层 -->
      <fm-checkbox-group
        v-model="checkedOwner"
        @change="checkboxChange"
        direction="horizontal"
      >
        <fm-checkbox
          shape="square"
          v-for="(item, index) in panelConfig.select"
          :key="index"
          :name="item.name"
          >{{ item.name }}</fm-checkbox
        >
      </fm-checkbox-group>
      <!-- 单选按钮，区域划分 -->
      <fm-radio-group
        v-model="radioOwner"
        @change="radioChange"
        direction="horizontal"
      >
        <fm-radio
          v-for="(item, index) in panelConfig.radio"
          :key="index"
          :name="item.name"
          >{{ item.name }}</fm-radio
        >
      </fm-radio-group>
    </fm-popup>
  </div>
</template>

<script>
import { Toast } from 'fawkes-mobile-lib'
import swanDistance from '@/components/map/utils/distance/distance'
import swanArea from '@/components/map/utils/area/area'
export default {
  name: 'OneMap',
  props: ['fmSearchHeight'],
  computed: {},
  data() {
    return {
      show: false,
      toolOpen: false,
      mapShow: '默认底图',
      // 多选框选中值
      checkedOwner: ['小区', '道路', '河流', '建筑'],
      // 单选框选中值
      radioOwner: '街道分区',
      defaultBaseLayers: [],
      baseLayerObject: {},
      activeTool: '',
      group: {
        影像图: ['layertdt_img'],
      },
      panelConfig: {
        select: [
          { name: '小区', type: '小区' },
          { name: '道路', type: '道路' },
          { name: '河流', type: '河流' },
          { name: '管廊', type: '管廊' },
          { name: '建筑', type: '建筑' },
        ],
        radio: [
          { name: '雨水分区', type: '雨水分区' },
          { name: '污水分区', type: '污水分区' },
          { name: '供水分区', type: '供水分区' },
          { name: '街道分区', type: '街道分区' },
          { name: '社区分区', type: '社区分区' },
        ],
      },
      distanceClickFlag: false,
      areaClickFlag: false,
      locationClickFlag: false,
      swanTools: {},
      lastTool: '',
      btnFlag: false, // 浮窗按钮点击标志
    }
  },
  mounted() {
    // let height = this.fmSearchHeight
    // console.log(height, '这是height')
    // document.querySelectorAll('.item')[0].style.top = height + 15 + 'px'
    // document.querySelectorAll('.item')[1].style.top = height + 25 + 'px'
  },
  methods: {
    // 浮窗按钮点击
    flagBtnClick() {
      this.btnFlag = !this.btnFlag
      this.$emit('flagBtnClick', this.btnFlag)
    },
    getDefaultBaseLayers(layers) {
      this.defaultBaseLayers = layers
    },
    getBaseLayerObject(layers) {
      let arr = []
      layers.forEach((layer) => {
        arr.push(layer.id)
      })
      arr.pop()
      this.group['默认底图'] = arr
      this.baseLayerObject = this.group
    },
    // 地图点击切换
    mapChange(value) {
      // 如果点击的图片已经是选中状态就退出
      if (value === this.mapShow) return
      // this.$emit("changeBaseLayer", this.mapShow);
      let map = window.xaMap
      if (value != '默认底图') {
        this.defaultBaseLayers.forEach((layer) => {
          map.setLayoutProperty(layer.id, 'visibility', 'none')
        })
      } else {
        this.defaultBaseLayers.forEach((layer) => {
          map.setLayoutProperty(layer.id, 'visibility', 'visible')
        })
      }
      if (this.mapShow) {
        this.baseLayerObject[this.mapShow].forEach((layerID) => {
          map.setLayoutProperty(layerID, 'visibility', 'none')
        })
      }
      this.baseLayerObject[value].forEach((layerID) => {
        map.setLayoutProperty(layerID, 'visibility', 'visible')
      })
      this.mapShow = value
    },
    // 多选框选中回调
    checkboxChange(checkedOwner) {
      let mapInstance = window.xaMap
      console.log('存在的图层', mapInstance.getStyle())
      console.log('多选', checkedOwner)
      checkedOwner.forEach((item) => {
        mapInstance.getLayer(item) &&
          mapInstance.setLayoutProperty(item, 'visibility', 'visible')
      })
      let unCheckedList = this.getUnCheckedList(checkedOwner)
      console.log('未选', unCheckedList)
      unCheckedList.forEach((item) => {
        mapInstance.getLayer(item) &&
          mapInstance.setLayoutProperty(item, 'visibility', 'none')
      })
    },
    getUnCheckedList(checkedOwner) {
      let arr = []
      let allSelect = this.panelConfig.select
      allSelect.forEach((i) => {
        let j =
          (checkedOwner && checkedOwner.filter((item) => item == i.name)) || []
        j.length == 0 && arr.push(i.name)
      })
      return arr
    },
    // 单选框选中回调
    radioChange(radioOwner) {
      let mapInstance = window.xaMap
      console.log('存在的图层', mapInstance.getStyle())
      console.log('单选', radioOwner)
      if (radioOwner == '雨水分区') {
        mapInstance.setLayoutProperty('map_rain_area', 'visibility', 'visible')
        mapInstance.setLayoutProperty('map_supply_area', 'visibility', 'none')
        mapInstance.setLayoutProperty('map_society_area', 'visibility', 'none')
      } else if (radioOwner == '供水分区') {
        mapInstance.setLayoutProperty('map_rain_area', 'visibility', 'none')
        mapInstance.setLayoutProperty(
          'map_supply_area',
          'visibility',
          'visible'
        )
        mapInstance.setLayoutProperty('map_society_area', 'visibility', 'none')
      } else if (radioOwner == '社区分区') {
        mapInstance.setLayoutProperty('map_rain_area', 'visibility', 'none')
        mapInstance.setLayoutProperty('map_supply_area', 'visibility', 'none')
        mapInstance.setLayoutProperty(
          'map_society_area',
          'visibility',
          'visible'
        )
      } else {
        mapInstance.setLayoutProperty('map_rain_area', 'visibility', 'none')
        mapInstance.setLayoutProperty('map_supply_area', 'visibility', 'none')
        mapInstance.setLayoutProperty('map_society_area', 'visibility', 'none')
      }
    },
    mapToolEmit(type) {
      let map = window.xaMap
      if (this.lastTool != '' && this.swanTools[this.lastTool]) {
        this.swanTools[this.lastTool].onCancel()
        this.swanTools[this.lastTool] = null
      }
      this.lastTool = type
      switch (type) {
        case 'measureDistance':
          this.distanceClickFlag = !this.distanceClickFlag
          this.areaClickFlag = false
          this.locationClickFlag = false
          this.swanTools[type] = new swanDistance(map)
          break
        case 'measureSquare':
          this.distanceClickFlag = false
          this.areaClickFlag = !this.areaClickFlag
          this.locationClickFlag = false
          this.swanTools[type] = new swanArea(map, this)
          break
        default:
          return false
      }
      this.swanTools[type].onAdd()
    },
  },
}
</script>

<style scoped lang="less">
.map {
}
.contorl {
  position: absolute;
  right: 36px;
  // top: 250px;
  top: 337.5px;
  width: 84px;
  .item {
    width: 84px;
    height: 84px;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(25, 25, 25, 0.15);
    border-radius: 16px;
    margin-bottom: 16px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      height: 48px;
      display: inline-block;
    }
  }
  .itemOpen {
    width: 84px;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(25, 25, 25, 0.15);
    border-radius: 16px;
    padding: 5px 0;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 16px;
    .item-open-div {
      display: flex;
      flex-direction: column;
      align-items: center;
      .font-m {
        margin-bottom: 17px;
      }
      img {
        height: 48px;
        display: inline-block;
      }
    }
  }
}
.popup {
  font-size: 32px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  background: #f5f7f9;
  padding: 30px;
  box-shadow: 0px -6px 12px 0px rgba(104, 115, 127, 0.1);
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 60px);
    height: 50px;
    margin-bottom: 25px;
    font-size: 36px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #191919;
  }
}
.item-box {
  display: flex;
  align-items: center;
  width: calc(100% - 60px);
  margin-bottom: 14px;
  height: 163px;
  background: #ffffff;
  box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
  border-radius: 16px;
  .pic {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    .pic-f {
      margin-top: 8px;
    }
    .m {
      color: #1b67d8;
    }
  }
  img {
    width: 168px;
    user-select: none;
    margin-right: 20px;
    cursor: pointer;
  }
}
/deep/.fm-checkbox-group {
  width: calc(100% - 60px);
  margin-bottom: 14px;
  height: 173px;
  background: #ffffff;
  box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
  border-radius: 16px;
}
/deep/.fm-checkbox--horizontal {
  margin-left: 30px;
  width: 25%;
}
/deep/.fm-radio-group {
  width: calc(100% - 60px);
  margin-bottom: 14px;
  height: 173px;
  background: #ffffff;
  box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
  border-radius: 16px;
}
/deep/.fm-radio--horizontal {
  margin-left: 20px;
}
</style>