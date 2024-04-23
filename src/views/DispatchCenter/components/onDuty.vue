<template>
  <div class="overlay">
    <div class="selectArea">
      <div class="calendar">
        <i class="fm-icon fm-icon-calendar-o" @click="calendarShow = true"></i>
      </div>
      <div class="divider" />
      <div class="day" :class="selectDay == 'yest'? 'actve' : ''" @click="changeDate('yest')">
        <div class="week">{{ currentDayList[0].week }}</div>
        <div class="date">{{ currentDayList[0].date }}</div>
      </div>
      <div class="divider" />
      <div class="day" :class="selectDay == 'today'? 'actve' : ''" @click="changeDate('today')">
        <div class="week">{{ currentDayList[1].week }}</div>
        <div class="date">{{ currentDayList[1].date }}</div>
      </div>
      <div class="divider" />
      <div class="day" :class="selectDay == 'tomor'? 'actve' : ''" @click="changeDate('tomor')">
        <div class="week">{{ currentDayList[2].week }}</div>
        <div class="date">{{ currentDayList[2].date }}</div>
      </div>
    </div>
    <div class="dutyArea" v-if="PbList">
      <div class="scrollArea">
        <div class="dutyOrder">
          <div
            class="item2"
            v-for="(it, idx) in BcList"
            :class="idx == 0 ? 'item1' : idx == (BcList.length - 1) ? 'item3' : ''"
            :key="idx"
          >{{ it }}</div>
        </div>
        <div class="divider" :style="dividerStyle"></div>
        <div class="person">
          <div
            class="person-item2"
            :class="idx == 0 ? 'person-item1' : idx == (BcList.length - 1) ? 'person-item3' : ''"
            v-for="(it, idx) in BcList"
            :key="idx"
          >
            <img :src="require('@/assets/img/dispatchCenter/taiyang@2x.png')" width="23" />
            <div class="name">{{ PbList[it][0] || '---' }}</div>
          </div>
        </div>
        <div class="divider" :style="dividerStyle"></div>
        <div class="person">
          <div
            class="person-item2"
            :class="idx == 0 ? 'person-item1' : idx == (BcList.length - 1) ? 'person-item3' : ''"
            v-for="(it, idx) in BcList"
            :key="idx"
          >
            <img :src="require('@/assets/img/dispatchCenter/taiyang@2x.png')" width="23" />
            <div class="name">{{ PbList[it][1] || '---' }}</div>
          </div>
        </div>
        <div class="divider" :style="dividerStyle"></div>
        <div class="person">
          <div
            class="person-item2"
            :class="idx == 0 ? 'person-item1' : idx == (BcList.length - 1) ? 'person-item3' : ''"
            v-for="(it, idx) in BcList"
            :key="idx"
          >
            <img :src="require('@/assets/img/dispatchCenter/taiyang@2x.png')" width="23" />
            <div class="name">{{ PbList[it][2] || '---' }}</div>
          </div>
        </div>
      </div>
    </div>
    <fm-calendar :min-date="minDate" v-model="calendarShow" @confirm="onConfirm" />
  </div>
</template>

<script>
import * as apis from '../api'
import { Toast } from 'fawkes-mobile-lib'
export default {
  name: 'onDuty',
  data() {
    return {
      calendarShow: false,
      selectDay: 'today',
      currentSelectDate: null,
      currentDayList: [],
      currentBzObj: null,
      PbList: null,
      toast: null,
      BcList: [], // 班次列表
      minDate: ""
    }
  },
  computed: {
    dividerStyle() {
      return {
        '--height': this.BcList.length * 25 + '%',
      }
    },
  },
  created() {
    this.minDate = new Date(this.$moment().startOf('year').format("YYYY-MM-DD"))
    this.currentSelectDate = new Date()
    this.currentDayList = this.getDayList(this.currentSelectDate)
    this.getBz()
  },
  methods: {
    // 根据当前用户查询所属班组
    getBz() {
      this.toast = Toast.loading({
        duration: 0,
        loadingType: 'spinner',
        message: '排班加载中',
        forbidClick: true
      })
      let params = {
        page: 1,
        size: 10,
        username: this.$store.state.userInfo.userName,
      }
      apis.getBz(params).then((res) => {
        if (res.status && res.data.records.length > 0) {
          this.currentBzObj = res.data.records[0]
          this.getBc(this.currentBzObj.teamId)
        } else {
          this.toast.clear()
          this.toast = null
        }
      })
    },
    // 根据当前班组查询班次
    getBc(teamId) {
      let params = {
        page: 1,
        size: 20,
        teamId
      }
      apis.getBc(params).then((res) => {
        if (res.status && res.data.records.length > 0) {
          this.BcList = res.data.records.map((it) => it.shiftType)
          this.getPb(this.currentBzObj.teamId)
        } else {
          this.toast.clear()
          this.toast = null
        }
      })
    },
    // 根据当前班组查询排班
    getPb(teamId) {
      let startTime = ''
      let endTime = ''
      if (!this.toast) {
          this.toast = Toast.loading({
            duration: 0,
            loadingType: 'spinner',
            message: '排班加载中',
            forbidClick: true
          })
      }
      if (this.selectDay == 'yest') {
        startTime = this.$dayjs(this.currentSelectDate)
          .subtract(1, 'day')
          .format('YYYY-MM-DD 00:00:00')
        endTime = this.$dayjs(this.currentSelectDate)
          .subtract(1, 'day')
          .format('YYYY-MM-DD 23:59:59')
      } else if (this.selectDay == 'today') {
        startTime = this.$dayjs(this.currentSelectDate).format(
          'YYYY-MM-DD 00:00:00'
        )
        endTime = this.$dayjs(this.currentSelectDate).format(
          'YYYY-MM-DD 23:59:59'
        )
      } else if (this.selectDay == 'tomor') {
        startTime = this.$dayjs(this.currentSelectDate)
          .add(1, 'day')
          .format('YYYY-MM-DD 00:00:00')
        endTime = this.$dayjs(this.currentSelectDate)
          .add(1, 'day')
          .format('YYYY-MM-DD 23:59:59')
      }
      let params = {
        page: 1,
        size: 20,
        teamId,
        startTime8: startTime,
        endTime8: endTime,
      }
      apis.getPb(params).then((res) => {
        if (res.status && res.data.records.length > 0) {
          this.PbList = {}
          this.BcList.forEach((item) => {
            this.PbList[item] = res.data.records
              .filter((it) => it.shiftName == item)
              .map((per) => per.memberName)
          })
        } else {
          this.PbList = {}
          this.BcList.forEach((item) => {
            this.PbList[item] = ['---', '---', '---']
          })
        }
      }).finally(() => {
        this.toast.clear()
        this.toast = null
      })
    },
    changeDate(val) {
      this.selectDay = val
      this.getPb(this.currentBzObj.teamId)
    },
    onConfirm(val) {
      this.currentSelectDate = val
      this.currentDayList = this.getDayList(val)
      this.getPb(this.currentBzObj.teamId)
    },
    getDayList(nowDate) {
      let dayList = new Array(3)
      let yest = this.$dayjs(nowDate).subtract(1, 'day')
      let today = this.$dayjs(nowDate)
      let tomor = this.$dayjs(nowDate).add(1, 'day')
      dayList[0] = {
        week: this.getWeek(yest),
        date: yest.format('MM月DD日'),
      }
      dayList[1] = {
        week: this.getWeek(today),
        date: '今天',
      }
      dayList[2] = {
        week: this.getWeek(tomor),
        date: tomor.format('MM月DD日'),
      }
      return dayList
    },
    getWeek(nowDate) {
      let datas = this.$dayjs(nowDate).day()
      var week = ['日', '一', '二', '三', '四', '五', '六']
      return '星期' + week[datas]
    },
  },
  beforeDestroy() {
    this.toast.clear()
  }
}
</script>

<style scoped lang="less">
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.overlay {
  width: 100%;
  height: 356px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 364px;
  z-index: 3;
  .selectArea {
    width: calc(100% - 64px);
    height: 88px;
    background: #e8effb;
    display: flex;
    padding: 0 32px;
    .divider {
      width: 1px;
      background: rgba(0, 0, 0, 0.08);
      height: 60%;
      margin: auto;
    }
    .calendar {
      width: 22%;
      height: 100%;
      .fm-icon {
        color: #1b67d8;
        margin: 16px 48px 16px 16px;
      }
    }
    .day {
      width: 26%;
      height: calc(100% - 20px);
      padding: 10px 28px;
      display: flex;
      flex-direction: column;
      .week {
        height: 28px;
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1b67d8;
        line-height: 28px;
        text-align: center;
      }
      .date {
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1b67d8;
        line-height: 40px;
        text-align: center;
      }
    }
    .actve {
      width: 26%;
      height: calc(100% - 20px);
      background: #1b67d8 !important;
      border-radius: 8px;
    }
    .actve > div {
      color: #ffffff !important;
    }
  }
  .dutyArea {
    width: calc(100% - 64px);
    height: calc(100% - 148px);
    background: #ffffff;
    padding: 22px 32px 38px;
    .scrollArea {
      display: flex;
      overflow: scroll;
      width: 100%;
      height: 100%;
      .dutyOrder {
        width: 17%;
        height: 100%;
        // padding-right: 32px;
        display: flex;
        flex-direction: column;
        .item1 {
          margin-top: 0px !important;
        }
        .item2 {
          height: 40px;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          line-height: 40px;
          margin-bottom: 8px;
          margin-top: 8px;
          margin-left: 16px;
        }
        .item3 {
          margin-bottom: 0px !important;
        }
      }
      .person {
        width: 28%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .person-item1 {
          margin-top: 0px !important;
        }
        .person-item2 {
          padding: 0 20px;
          height: 40px;
          margin: 8px 0;
          display: flex;
          .name {
            height: 40px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 40px;
            margin-left: 17px;
          }
        }
        .person-item3 {
          margin-bottom: 0px !important;
        }
      }
      .divider {
        width: 1px;
        background: rgba(0, 0, 0, 0.05);
        height: var(--height);
      }
    }
  }
}
</style>