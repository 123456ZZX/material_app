<template>
  <div class="range-container">
    <slot name="title"></slot>
    <fm-cell-group class="time-range">
      <fm-field
        v-model="startTime"
        clearable
        input-align="center"
        placeholder="开始时间"
        @focus="start"
        readonly
      />
      <span>~</span>
      <fm-field
        v-model="endTime"
        clearable
        input-align="center"
        placeholder="结束时间"
        @focus="end"
        readonly
      />
    </fm-cell-group>
    <!-- 开始时间控件 -->
    <fm-popup :visible.sync="showStart" position="bottom">
      <fm-datetime-picker
        v-model="currentStartTime"
        :type="type"
        :min-date="minStartTime"
        :max-date="maxStartTime"
        @confirm="confirm"
        @cancel="cancel"
        :formatter="formatter"
      />
    </fm-popup>
    <!-- 结束时间控件 -->
    <fm-popup :visible.sync="showEnd" position="bottom">
      <fm-datetime-picker
        v-model="currentEndTime"
        :type="type"
        :min-date="minEndTime"
        :max-date="maxEndTime"
        @confirm="confirm1"
        @cancel="cancel1"
        :formatter="formatter"
      />
    </fm-popup>
  </div>
</template>
<script>
import { CellGroup, Popup, Field, DatetimePicker } from 'fawkes-mobile-lib'
import { formatDate } from './util'

export default {
  name: 'DatetimeRangePicker',
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [CellGroup.name]: CellGroup,
    [DatetimePicker.name]: DatetimePicker,
  },
  props: {
    type: {
      type: String,
      default: 'datetime',
    },
    range: {
      type: Object,
      default: () => ({
        startTime: '',
        endTime: '',
      }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'range',
    event: 'confirm',
  },
  data() {
    return {
      // 时间组件可选范围
      minStartTime: null,
      maxStartTime: null,
      minEndTime: null,
      maxEndTime: null,
      date: '',
      currentStartTime: null, // 时间组件默认选中默认时间
      currentEndTime: null,
      startTime: '',
      endTime: '',
      showStart: false,
      showEnd: false,
    }
  },
  watch: {
    range: {
      handler(newVal) {
        this.currentStartTime = new Date(newVal.startTime)
        this.startTime = newVal.startTime
        this.currentEndTime = new Date(newVal.endTime)
        this.endTime = newVal.endTime
      },
      immediate: true,
    },
  },
  created() {
    this.getMaxDate()
    // this.initDate();
  },
  mounted() {},
  methods: {
    // 初始化时间(当前一周)
    initDate() {
      this.endTime = formatDate()
      this.startTime = formatDate()
    },
    // 选择开始时间
    start() {
      this.showStart = true && !this.disabled
    },
    // 选择结束时间
    end() {
      this.showEnd = true && !this.disabled
    },
    // 最大最小时间处理
    getMaxDate() {
      const year = new Date().getFullYear()
      this.minStartTime = new Date()
      this.minEndTime = new Date()
      this.maxStartTime = new Date(year + 1, 11, 31)
      this.maxEndTime = new Date(year + 1, 11, 31)
    },
    // 确认开始日期
    confirm(date) {
      this.showStart = false
      this.startTime = formatDate(this.currentStartTime)
      this.minEndTime = date
      this.$emit('confirm', { startTime: this.startTime, endTime: this.endTime })
    },
    // 确认结束日期
    confirm1(date) {
      this.showEnd = false
      this.endTime = formatDate(this.currentEndTime)
      this.maxStartTime = date
      this.$emit('confirm', { startTime: this.startTime, endTime: this.endTime })
    },
    cancel() {
      this.showStart = false
    },
    cancel1() {
      this.showEnd = false
    },
    // 处理控件显示的时间格式
    formatter(type, value) {
      // 格式化选择器日期
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      if (type === 'day') {
        return `${value}日`
      }
      return value
    },
  },
}
</script>
<style lang="less" scoped>
.range-container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
.time-range {
  display: flex;
  align-items: center;
}
</style>
