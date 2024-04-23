<!-- '监测点悬浮popup' -->
<template>
  <div class="PressurePopup" :class="belongSystem == '再生水' ? 'greenBorder' : ''">
    <div class="topSide">
      <!-- <div class="blueBar"></div> -->
      <div class="content">
        <div class="topCenterTitle" :title="name">{{ name }}</div>
        <!-- <div class="topRight">
          <img src="@/assets/img/Map/dataSourcePanel/置顶.png" alt="" />
        </div> -->
      </div>
    </div>
    <div class="bottomSide">
      <div class="bottomCommon" v-for="(item, index) in hoverAndClick" :key="index">
        <div class="titleLeft">{{ item.name }}：</div>
        <div class="titleRight">
          <div class="blackText" :class="item.isWarn == 1 ? 'redNumber' : ''">
            {{ item.myVal }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    // 基础信息
    name: {
      // required: true,
      type: String,
      default: '',
    },
    // 设备数据
    realtimeData: {
      type: Array,
      default: [],
    },
    // 动态显示内容
    hoverAndClick: {
      type: Array,
      default: [],
    },
    belongSystem: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
})
</script>

<style lang="less" scoped>
.PressurePopup {
  width: 320px;
  // height: 139px;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #399aea;
  border-radius: 16px;
  user-select: none;
  z-index: 1000;
  &::before {
    content: '';
    border-top: 18px solid #399aea;
    border-bottom: 18px solid transparent;
    border-right: 18px solid transparent;
    border-left: 18px solid transparent;
    position: absolute;
    top: 99%;
    left: 142px;
  }
  &::after {
    content: '';
    border-top: 14px solid #fff;
    border-bottom: 14px solid transparent;
    border-right: 14px solid transparent;
    border-left: 14px solid transparent;
    position: absolute;
    top: 99%;
    left: 146px;
  }

  .topSide {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 5px 5px 0px 0px;
    padding: 14px 16px 3px 16px;

    .blueBar {
      width: 100%;
      height: 4px;
      border-radius: 5px 5px 0 0;
      background-color: #1b67d8;
    }

    .content {
      width: 100%;
      display: flex;

      .topCenterTitle {
        width: 90%;
        font-weight: 600;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        // background-color: rgb(247, 141, 141);
      }
    }
  }
  .bottomSide {
    width: 100%;
    // height: 87px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 7px 0;

    .bottomCommon {
      width: 100%;
      // height: 40px;
      display: flex;
      // background-color: rgb(122, 255, 118);
      // 压力、流量
      .titleLeft {
        font-size: 12px;
        padding-left: 15px;
        color: #555555;
      }
      .titleRight {
        margin-left: 8px;
        .blackText {
          font-size: 12px;
          font-weight: 600;
          color: #555555;
        }
        .redNumber {
          color: #f46263;
        }
      }
    }
  }
}
.greenBorder {
  border: 1px solid #00d186;
  &::before {
    content: '';
    border-top: 18px solid #00d186;
    border-bottom: 18px solid transparent;
    border-right: 18px solid transparent;
    border-left: 18px solid transparent;
    position: absolute;
    top: 99%;
    left: 142px;
  }
  &::after {
    content: '';
    border-top: 14px solid #fff;
    border-bottom: 14px solid transparent;
    border-right: 14px solid transparent;
    border-left: 14px solid transparent;
    position: absolute;
    top: 99%;
    left: 146px;
  }
}
</style>
