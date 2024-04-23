<template>
  <div class="inspection-status-content">
    <div class="inspection-status">
      <div class="inspection-status-item inspection-status-direction">
        <div class="status-item-select">
          <div
            class="status-item-value"
            :style="{ color: getStatusColor(PatrolData && PatrolData.patrolStatus) }"
          >
            {{ getStatusTypeName(PatrolData && PatrolData.patrolStatus) }}
          </div>
          <div class="status-item-label">巡检状态</div>
        </div>
      </div>
      <div class="inspection-status-item">
        <div class="status-item-value">
          <span style="color: #40bb5a">{{ PatrolData && PatrolData.finishPatrolPointNum }}</span
          >/{{ PatrolData && PatrolData.patrolPointNum }}
        </div>
        <div class="status-item-label">已巡检</div>
      </div>
      <div class="inspection-status-item">
        <div class="status-item-value" style="color: #ff4d4f">
          {{ getHiddenDangerNum() }}
        </div>
        <div class="status-item-label">异常上报</div>
      </div>
    </div>

    <div class="status-content-item">
      <img src="@/assets/img/pump/inspection-time.png" class="box-time-img-time" alt="" />
      <span class="item-label">巡检开始时间 ：</span>
      <span>{{ PatrolData && PatrolData.patrolStartTime }}</span>
    </div>
    <div class="status-content-item">
      <img src="@/assets/img/pump/inspection-time.png" class="box-time-img-time" alt="" />
      <span class="item-label">巡检终止时间 ：</span>
      <span>{{ PatrolData && PatrolData.patrolEndTime }}</span>
    </div>
    <div class="status-content-item">
      <img src="@/assets/img/pump/inspection-count-down.png" class="box-time-img-down" alt="" />
      <span class="item-label">剩余时间 ：</span>
      <div class="content-item-time" >
        <span class="time-style">{{ displayTime('day', 1) }}</span>
        <span class="time-span">天</span>
        <span class="time-style">{{ displayTime('hour', 24) }}</span>
        <span class="time-span">时</span>
        <span class="time-style">{{ displayTime('minute', 60) }}</span>
        <span class="time-span">分</span>
      </div>
      <div
        v-if="
          $dayjs(PatrolData && PatrolData.taskEndTime).valueOf() >
          $dayjs(PatrolData && PatrolData.patrolEndTime).valueOf()
        "
        class="icon-normal"
      >
        正常
      </div>
      <div
        v-if="
          $dayjs(PatrolData && PatrolData.taskEndTime).valueOf() <
          $dayjs(PatrolData && PatrolData.patrolEndTime).valueOf()
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
        {{ reason }}
      </span>
    </div>

    <div class="status-content-border"></div>

    <div class="status-content-item">
      <img src="@/assets/img/pump/inspection-personnel.png" class="box-time-img-time" alt="" />
      <span class="item-label">巡检负责人：</span>
      <span
        >{{ PatrolData && PatrolData.principalName }}({{
          PatrolData && PatrolData.principalPhone
        }})</span
      >
    </div>

    <!-- <div class="status-content-item status-content-item-start">
      <img src="@/assets/img/pump/inspection-personnel.png" class="box-time-img-time" alt="" />
      <span class="item-label">实际巡检人：</span>
      <div>
      </div>

    </div> -->
    <div class="status-content-user">
      <select-user
        title="实际巡检人"
        :userFullname.sync="actualPerson"
        :userName.sync="userName"
        :multiple="true"
        :required="true"
      >
      </select-user>
    </div>
  </div>
</template>

<script>
import selectUser from '@/components/select-user'
export default {
  name: 'InspectionSubmitCard',
  components: { selectUser },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    PatrolData: {
      type: Object,
      default: () => {},
    },
    reason: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      actualPerson: this.$store.state.userInfo.userFullname,
      userName: this.$store.state.userInfo.userName,
    }
  },
  watch: {
    actualPerson: {
      handler: function () {
        this.$emit('getActualPerson', this.actualPerson)
      },
      immediate: true,
    },
  },

  created() {},

  methods: {
    //获取所有异常上报工单数量
    getHiddenDangerNum() {
      let sum = 0
      this.PatrolData &&
        this.PatrolData.patrolPointResultList?.forEach((item) => {
          item?.patrolItemsResultList?.forEach((data) => {
            data.workOrderId ? sum++ : null
          })
        })
      return sum
    },

    //计算剩余时间
    displayTime(timeType, type) {
      console.log(this.PatrolData?.taskEndTime);
      let time = this.$dayjs(this.PatrolData?.taskEndTime).diff(
        new Date(),
        timeType
      )
      console.log(time);
      type ? (time = time % type) : null
      console.log(time);
      time < 0 ? (time = 0) : time
      console.log(time);
      return time || '-'
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
  },
}
</script>

<style scoped lang="less">
.inspection-status-content {
  overflow: scroll;
  max-height: 50vh;
}
.box-time-img-time {
  width: 32px;
  height: 32px;
}

.box-time-img-down {
  width: 32px;
  height: 42px;
}

.inspection-status {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 120px;
  background: #f5f7f9;
  margin: 0 0 30px;

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

.inspection-status-content {
  width: calc(100% - 60px);
  padding: 20px 30px;
  font-size: 28px;
  color: #999;
  background-color: #ffffff;

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
      align-items: center;
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

      .item-time-status {
        width: 80px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background: #ff9429;
        border-radius: 38px;
        font-size: 28px;
        color: #fff;
        margin-left: 20px;
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

.status-content-user {
  /deep/ .fm-cell__title {
    font-size: 28px;
    color: #999;
  }
}
</style>
