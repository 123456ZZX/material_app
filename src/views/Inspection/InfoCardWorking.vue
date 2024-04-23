<!-- '巡检任务卡片（执行中）' -->
<template>
  <div class="InfoCard" @click="execute(cardInfo)">
    <!-- 巡检标题 -->
    <div class="topSide">
      <div class="topIcon">
        <img :src="imageUrl" alt="" />
      </div>
      <div class="bottomTitle">{{ cardInfo.taskName }}</div>
    </div>
    <!-- 巡检信息 -->
    <div class="bottomSide">
      <div class="commonStyle restTime">
        <img src="../../assets/img/inspection/剩余时间.png" alt="" />
        <div class="titleText">剩余时间:</div>
        <fm-count-down :time="timeRest">
          <template #default="timeData">
            <span class="block">{{ timeData.days }}</span>
            <span class="colon">天</span>
            <span class="block">{{ timeData.hours }}</span>
            <span class="colon"> : </span>
            <span class="block">{{ timeData.minutes }}</span>
          </template>
        </fm-count-down>
      </div>
      <div v-if="cardInfo.taskType == '管廊巡检'" class="commonStyle keyPoint">
        <img src="../../assets/img/inspection/关键点.png" alt="" />
        <div class="titleText">巡检对象:</div>
        <div class="bigNumber">{{ keyPoints.key }}</div>
        <div class="smallText">/</div>
        <div class="smallText">{{ keyPoints.total }}</div>
        <div class="smallText">{{ '个' }}</div>
      </div>
      <div v-if="cardInfo.taskType != '管廊巡检'" class="commonStyle keyPoint">
        <img src="../../assets/img/inspection/关键点.png" alt="" />
        <div class="titleText">关键点:</div>
        <div class="bigNumber">{{ keyPoints.key }}</div>
        <div class="smallText">/</div>
        <div class="smallText">{{ keyPoints.total }}</div>
        <div class="smallText">{{ '个' }}</div>
      </div>
      <div v-if="cardInfo.taskType != '管廊巡检'" class="commonStyle progressBar">
        <img src="../../assets/img/inspection/管线覆盖率.png" alt="" />
        <div class="titleText">管线覆盖率</div>
        <!--  第一层，固定进度条宽度 -->
        <div :style="styleVar" class="progressWidth">
          <!-- 第二层，计算得到的实际比率宽度 -->
          <div :style="styleVar" class="colorWidth">
            <!-- 第三层，动画 -->
            <div :style="styleVar" class="progressAnimate"></div>
          </div>
        </div>
        <div class="bluePercent">{{ Math.round(percentNum * 10000) / 100 + '%' }}</div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  props: {
    cardInfo: {
      require: true,
      type: Object,
      default: () => {
        return {
          // 顶部标题
          taskName: '巡检标题',
          // 类型(人巡、车巡、管廊、泵站)
          taskType: '人巡',
          // 结束时间，用于倒计时
          taskEndTime: "2022-08-25 12:00:00",
          // 关键点个数与总数
          reportRate: "7/77",
          // 管线覆盖率
          coverage: "77.77%",
        }
      }
    },
  },
  computed: {
    // 右上角图片地址
    imageUrl() {
      return require(`../../assets/img/inspection/${this.cardInfo.taskType || '人巡'}.png`)
    },
    // 倒计时
    timeRest() {
      return new Date(this.cardInfo.taskEndTime).getTime() - new Date().getTime()
    },
    // 关键点个数与总数
    keyPoints() {
      let arr = this.cardInfo.reportRate ? this.cardInfo.reportRate.split('/') : [0, 0]
      return {
        key: arr[0],
        total: arr[1],
      }
    },
    // 管线覆盖率
    percentNum() {
      let percent = this.cardInfo.coverage || '0%'
      let pointNum = this.toPoint(percent);
      return pointNum
    },
  },
  data() {
    return {
      styleVar: {
        // 进度条全长168px
        '--totalWidth': '168px',
        '--barWidth': '100px',
        '--colorBlue': 'blue',
      },
    }
  },
  created() {
    this.styleVar['--barWidth'] = parseInt(168 * this.percentNum) + 'px'
  },
  methods: {
    execute(item) {
      this.$emit('execute', item)
    },
    // 百分比转换成小数
    toPoint(percent) {
      var str = percent.replace("%", "");
      str = str / 100;
      return str;
    }
  },
}
</script>

<style lang="less" scoped>
.InfoCard {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 690px;
  height: 334px;
  margin: 24px auto;
  border-radius: 16px;
  box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
  background-color: rgb(255, 255, 255);

  .topSide {
    width: 100%;
    height: 114px;
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
    justify-content: space-evenly;
    width: 100%;
    height: 218px;
    font-size: 28px;
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

    .titleText {
      margin-right: 20px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }

    // 剩余时间
    .restTime {
      // background-color: rgb(255, 129, 245);

      .colon {
        display: inline-block;
        margin: 0 20px;
        font-size: 24px;
        font-weight: 400;
        color: #2062c4;
        line-height: 33px;
      }

      .block {
        display: inline-block;
        width: 38px;
        font-size: 24px;
        text-align: center;
        color: #2062c4;
        background: rgba(27, 103, 216, 0.1);
        border-radius: 6px;
      }
    }

    // 关键点
    .keyPoint {
      // background-color: rgb(126, 255, 216);

      .bigNumber {
        padding-bottom: 6px;
        font-size: 32px;
        font-weight: 600;
        color: #2062c4;
      }

      .smallText {
        margin-left: 6px;
        font-size: 28px;
        font-weight: 400;
        color: #999999;
      }
    }

    // 覆盖率进度条部分
    .progressBar {
      // background-color: rgb(253, 255, 123);

      // 第一层，固定进度条宽度
      .progressWidth {
        width: var(--totalWidth);
        height: 12px;
        border-radius: 6px;
        background: rgba(27, 103, 216, 0.08);
        box-shadow: inset 0px 0px 5px 0px rgba(39, 123, 214, 0.15);
        margin-right: 20px;

        // 第二层，计算得到的实际比率宽度
        .colorWidth {
          width: var(--barWidth);
          height: 12px;
          border-radius: 6px;
          box-shadow: 0px 4px 8px 0px rgba(50, 127, 211, 0.24);
          border-radius: 6px;
          background: linear-gradient(-45deg, #1b67d8 0%, rgba(58, 160, 238, 0.42) 100%);

          // 第三层，动画
          .progressAnimate {
            width: 0;
            height: 12px;
            border-radius: 6px;
            background: linear-gradient(270deg, #1b67d8 0%, rgba(58, 160, 238, 0.42) 100%);
            // background: linear-gradient(to top right, #CDDC39, #8BC34A, #FFEB3B);
            animation: w 3s linear infinite;

            @keyframes w {
              0% {
                width: 0;
              }

              100% {
                width: var(--barWidth);
              }
            }
          }
        }
      }

      .bluePercent {
        color: #2062c4;
      }
    }
  }
}
</style>
