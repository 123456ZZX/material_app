<template>
  <div class="inspection-status-content" v-if="show">
    <div class="status-content-item">
      <img src="@/assets/img/pump/inspection-time.png" class="box-time-img-time" alt="" />
      <span class="item-label">任务计划开始时间 ：</span>
      <span>{{ PatrolData && PatrolData.taskStartTime }}</span>
    </div>
    <div class="status-content-item">
      <img src="@/assets/img/pump/inspection-time.png" class="box-time-img-time" alt="" />
      <span class="item-label">任务计划结束时间 ：</span>
      <span>{{ PatrolData && PatrolData.taskEndTime }}</span>
    </div>
    <div
      class="status-content-item"
      v-if="PatrolData && PatrolData.patrolStatus === 1 || PatrolData && PatrolData.patrolStatus === 2"
    >
      <img src="@/assets/img/pump/inspection-count-down.png" class="box-time-img-down" alt="" />
      <span class="item-label">剩余时间 ：</span>
      <div class="content-item-time">
        <span class="time-style">{{ displayTime('day', 1) }}</span>
        <span class="time-span">天</span>
        <span class="time-style">{{ displayTime('hour', 24) }}</span>
        <span class="time-span">时</span>
        <span class="time-style">{{ displayTime('minute', 60) }}</span>
        <span class="time-span">分</span>
      </div>
    </div>

    <div
      class="status-content-border"
      v-if="PatrolData && PatrolData.patrolStatus === 3 || PatrolData && PatrolData.patrolStatus === 4"
    ></div>

    <div class="status-content-item" v-if="PatrolData && PatrolData.patrolStatus !== 1">
      <img src="@/assets/img/pump/inspection-time.png" class="box-time-img-time" alt="" />
      <span class="item-label">巡 检 开 始 时 间 ：</span>
      <span>{{ PatrolData && PatrolData.patrolStartTime }}</span>
    </div>

    <div class="status-content-item" v-if="PatrolData && PatrolData.patrolStatus === 4">
      <img src="@/assets/img/pump/inspection-time.png" class="box-time-img-time" alt="" />
      <span class="item-label">巡 检 终 止 时 间 ：</span>
      <span>{{ PatrolData && PatrolData.patrolEndTime }}</span>
      <div
        v-if="
          $dayjs(PatrolData && PatrolData.taskEndTime).valueOf() > $dayjs(PatrolData && PatrolData.patrolEndTime).valueOf()
        "
        class="icon-normal"
      >
        正常
      </div>
      <div
        v-if="
          $dayjs(PatrolData && PatrolData.taskEndTime).valueOf() < $dayjs(PatrolData && PatrolData.patrolEndTime).valueOf()
        "
        class="icon-abnormal"
      >
        超时
      </div>
    </div>

    <div class="status-content-item" v-if="PatrolData && PatrolData.patrolStatus === 3">
      <img src="@/assets/img/pump/inspection-time.png" class="box-time-img-time" alt="" />
      <span class="item-label">巡 检 完 成 时 间 ：</span>
      <span>{{ PatrolData && PatrolData.patrolEndTime }}</span>
      <div
        v-if="
          $dayjs(PatrolData && PatrolData.taskEndTime).valueOf() > $dayjs(PatrolData && PatrolData.patrolEndTime).valueOf()
        "
        class="icon-normal"
      >
        正常
      </div>
      <div
        v-if="
          $dayjs(PatrolData && PatrolData.taskEndTime).valueOf() < $dayjs(PatrolData && PatrolData.patrolEndTime).valueOf()
        "
        class="icon-abnormal"
      >
        超时
      </div>
    </div>

    <div
      class="status-content-item status-content-item-start"
      v-if="PatrolData && PatrolData.patrolStatus === 4"
    >
      <img src="@/assets/img/pump/inspection-time.png" class="box-time-img-time" alt="" />
      <span class="item-label reason">终止原因 ：</span>
      <span class="reason-content">
        {{ PatrolData && PatrolData.endReason }}
      </span>
    </div>

    <div class="status-content-border"></div>

    <div class="status-content-item">
      <img src="@/assets/img/pump/inspection-personnel.png" class="box-time-img-time" alt="" />
      <span class="item-label">巡检负责人：</span>
      <span>{{ PatrolData && PatrolData.principalName }}({{ PatrolData && PatrolData.principalPhone }})</span>
    </div>

    <!-- <div class="status-content-item status-content-item-start">
      <img src="@/assets/img/pump/inspection-personnel.png" class="box-time-img-time" alt="" />
      <span class="item-label">实际巡检人：</span>
      <div>
         {{ PatrolData && PatrolData.actualPerson }}
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name:'StatusContent',
  props: {
    PatrolData: {
      type: Object,
      default: () => {},
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },

  created() {},

  methods: {
    //计算剩余时间
    displayTime(timeType, type) {
      let time = this.$dayjs(this.PatrolData && this.PatrolData.taskEndTime).diff(new Date(), timeType)
      type ? (time = time % type) : null
      console.log(time);
      time < 0 ? (time = 0) : time
      return time
    },
  },
}
</script>

<style scoped lang="less">
.box-time-img-time {
  width: 32px;
  height: 32px;
}

.box-time-img-down {
  width: 32px;
  height: 42px;
}

.inspection-status-content {
  position: absolute;
  top: 210px;
  width: calc(100% - 60px);
  padding: 20px 30px;
  font-size: 28px;
  color: #999;
  background-color: #ffffff;
  z-index: 1;

  .status-content-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .item-label {
      margin: 0 12px;
    }

    .reason {
      width: 160px;
    }

    .reason-content {
      width: calc(100% - 300px);
      color: #ff4d4f;
      word-wrap: break-word;
      word-break: normal;
    }

    .icon-normal,
    .icon-abnormal {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 40px;
      background: #40bb5a;
      border-radius: 38px;
      color: #fff;
      margin-left: 10px;
    }

    .icon-abnormal {
      background: #ff9429;
    }

    .content-item-time {
      display: flex;
      font-size: 24px;
      font-weight: bold;

      .time-span {
        margin: 0 12px;
      }

      .time-style {
        display: block;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #1b67d8;
        padding: 0 5px;
        background-color: rgba(27, 103, 216, 0.08);
      }
    }
  }

  .status-content-item-start {
    align-items: start;
  }

  .status-content-border {
    width: calc(100% - 60px);
    height: 2px;
    background: #eeeeee;
    margin-bottom: 20px;
  }
}
</style>
