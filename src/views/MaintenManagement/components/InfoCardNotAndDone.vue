<!-- '巡检任务卡片（未巡检、已完成）' -->
<template>
  <div class="InfoCard" :class="cardType === 'not' ? 'moreHeight' : ''"
    @click="cardType === 'done' ? execute(cardInfo) : ''">
    <!-- 巡检标题 -->
    <div class="topSide">
      <div class="topIcon">
        <img :src="imageUrl" alt="" />
      </div>
      <div class="bottomTitle">{{ cardInfo.taskName }}</div>
    </div>
    <!-- 巡检信息 -->
    <div class="bottomSide">
      <!-- <div class="commonStyle">
        <img src="@/assets/img/inspection/管线长度.png" alt="" />
        <div class="titleText">管线长度:</div>
        <div class="bigText">{{ cardInfo.pipeLength / 1000 }}</div>
        <div class="smallText">km</div>
      </div> -->
      <div class="commonStyle">
        <img src="@/assets/img/maintenance/养护对象.png" alt="" />
        <div class="titleText">养护对象:</div>
        <div class="bigText">{{ cardInfo.maintainContent }}</div>
        <!-- <div class="smallText">{{ '个' }}</div> -->
      </div>
      <!-- <div class="commonStyle">
        <img src="@/assets/img/inspection/要求完成时间.png" alt="" />
        <div class="titleText">要求完成时间:</div>
        <div class="bigText">{{ cardInfo.taskEndTime }}</div>
      </div> -->
    </div>
    <div class="twoButton" v-if="cardType === 'not'">
      <div @click="transmitEvent(cardInfo)">转发</div>
      <div class="centerLine"></div>
      <div @click="startEvent(cardInfo)">开始</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 卡片类型，未巡检或者已完成 not done
    cardType: {
      type: String,
      default() {
        return ''
      },
    },
    cardInfo: {
      require: true,
      type: Object,
      default: () => {
        return {
          // 顶部标题
          taskName: '巡检标题',
          // 类型(人巡、车巡、管廊、泵站)
          taskType: '人巡',
          // 结束时间
          taskEndTime: "2022-08-25 12:00:00",
          // 关键点个数与总数
          reportRate: "7/285",
          // 管线长度
          pipeLength: "77",
        }
      }
    },
  },
  computed: {
    // 右上角图片地址
    imageUrl() {
      return require(`@/assets/img/maintenance/${(this.cardInfo.bizType || '污水') + 'tag'}.png`)
    },
    // 关键点个数与总数
    keyPoints() {
      let arr = this.cardInfo.reportRate.split('/')
      return {
        key: arr[0],
        total: arr[1],
      }
    },
  },
  data() {
    return {}
  },
  methods: {
    // 转发
    transmitEvent(item) {
      this.$emit('transmitEvent', item)
    },
    // 开始
    startEvent(item) {
      this.$emit('startEvent', item)
    },
    execute(item) {
      this.$emit('execute', item)
    },
  },
}
</script>

<style lang="less" scoped>
.moreHeight {
  height: 290px !important;
}

.InfoCard {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 690px;
  height: 200px;
  margin: 24px auto;
  border-radius: 16px;
  box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
  background-color: rgb(255, 255, 255);

  .topSide {
    width: 100%;
    height: 102px;
    font-size: 36px;
    font-weight: 600;
    color: #191919;
    border-bottom: 1px solid #ccc;
    // background-color: #ffa0a0;

    .topIcon {
      position: relative;
      width: 100%;
      height: 43px;
      // background-color: red;

      img {
        position: absolute;
        top: 0;
        right: 0;
        width: 141px;
        height: 43px;
      }
    }

    .bottomTitle::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 30px;
      background-color: #2062c4;
      margin-right: 34px;
    }

    .bottomTitle {
      width: 100%;
      height: 71px;
      // background-color: green;
    }
  }

  .bottomSide {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    height: 92px;
    font-size: 28px;
    margin: auto;
    font-family: PingFangSC-Semibold, PingFang SC;
    // background-color: #96ff9b;

    img {
      width: 32px;
      height: 32px;
      margin: 0 10px 0 30px;
    }

    .commonStyle {
      display: flex;
      align-items: center;
      width: 100%;
      height: 30%;
    }

    // 左边标题
    .titleText {
      margin-right: 20px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }

    .bigText {
      font-size: 28px;
      font-weight: 600;
      color: #555555;
    }

    .smallText {
      font-size: 28px;
      margin-left: 6px;
      color: #999999;
    }
  }

  // 转发、开始按钮
  .twoButton {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 72px;
    font-size: 28px;
    color: #1b67d8;
    font-family: PingFangSC-Semibold, PingFang SC;

    .centerLine {
      height: 70%;
      width: 2px;
      background-color: #eee;
    }
  }
}
</style>
