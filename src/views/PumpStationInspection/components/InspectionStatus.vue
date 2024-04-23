<template>
  <div class="inspection-status">
    <div class="inspection-status-item inspection-status-direction" @click="handleClick()">
      <div class="status-item-select">
        <div class="status-item-value" :style="{ color: getStatusColor(PatrolData && PatrolData.patrolStatus) }">
          {{ getStatusTypeName(PatrolData && PatrolData.patrolStatus) }}
        </div>
        <div class="status-item-label">巡检状态</div>
      </div>
      <img
        src="@/assets/img/pump/inspection-direction.png"
        class="item-select-img"
        :style="{ transform: statusContentShow === true ? 'rotate(180deg)' : 'rotate(0deg)' }"
        alt=""
      />
    </div>
    <div class="inspection-status-item">
      <div class="status-item-value">
        <span style="color: #40bb5a">{{ PatrolData && PatrolData.finishPatrolPointNum }}</span
        >/{{ PatrolData && PatrolData.patrolPointNum }}
      </div>
      <div class="status-item-label">已巡检</div>
    </div>
    <div class="inspection-status-item" @click="hiddenDangerClick(PatrolData)">
      <div class="status-item-value" style="color: #ff4d4f">{{ getHiddenDangerNum() }}</div>
      <div class="status-item-label">异常上报</div>
    </div>
  </div>
</template>

<script>
export default {
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
    }
  },

  created() {},

  methods: {
    //按钮交互
    handleClick() {
      this.statusContentShow = !this.statusContentShow
      this.$emit('setShowType', this.statusContentShow)
    },

    //获取所有异常上报工单数量
    getHiddenDangerNum() {
      let sum = 0
      this.PatrolData && this.PatrolData.patrolPointResultList?.forEach((item) => {
        item?.patrolItemsResultList?.forEach((data) => {
          data.workOrderId ? sum++ : null
        })
      })
      return sum
    },

    //获取类型名称
    getStatusTypeName(type) {
      switch (type) {
        case 1:
          return '待巡检'
        case 2:
          return '巡检中'
        case 3:
          return '已完成'
        case 4:
          return '已终止'
      }
    },

    //获取状态类型字体颜色
    getStatusColor(type) {
      switch (type) {
        case 3:
          return '#40BB5A'
        case 4:
          return '#FF4D4F '
        default:
          return '#1B67D8 '
      }
    },

    //异常上报被点击
    hiddenDangerClick(data) {
      this.$emit('hiddenDangerClick', data, 'all')
    },
  },
}
</script>

<style scoped lang="less">
.inspection-status {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 120px;
  background-color: #fff;

  .inspection-status-item {
    text-align: center;
    font-weight: bold;
    font-size: 32px;

    .status-item-value {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .status-item-label {
      font-size: 24px;
    }
  }

  .inspection-status-direction {
    display: flex;
    align-items: center;

    .status-item-select {
      margin-right: 20px;
      .item-select-img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
