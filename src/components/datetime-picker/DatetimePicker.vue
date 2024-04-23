<!--
 * @Author: xie_sm
 * @Date: 2022-05-17 14:19:19
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-17 16:50:20
 * @FilePath: \mobile-template\src\components\datetime-picker\DatetimePicker.vue
 * @Description: 带弹窗的时间选择器
 *
-->
<template>
  <fm-popup :visible.sync="show" position="bottom">
    <!-- 使用$attrs接收非prop定义的属性，可至组件库官网http://172.20.79.29:9529/#/zh-CN/datetime-picker查看该组件prop属性-->
    <fm-datetime-picker
      v-model="currentTime"
      v-bind="$attrs"
      @confirm="confirm"
      @cancel="cancel"
      :formatter="formatter"
    />
  </fm-popup>
</template>

<script>
import { DatetimePicker, Popup } from 'fawkes-mobile-lib'
export default {
  name: 'DatetimePicker',
  components: {
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD hh:mm:ss',
    },
    // 是否显示xx年xx月xx日
    showFormatter: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.currentTime = newVal ? new Date(newVal) : new Date(Date.now())
      },
      immediate: true,
    },
  },
  data: () => ({
    currentTime: new Date(),
  }),
  methods: {
    confirm(val) {
      this.$emit('change', this.$dayjs(val).format(this.format))
      this.$emit('update:show', false)
    },
    cancel() {
      this.$emit('update:show', false)
    },
    formatter(type, val) {
      if (this.showFormatter) {
        if (type === 'year') {
          return val + '年'
        }
        if (type === 'month') {
          return val + '月'
        }
        if (type === 'day') {
          return val + '日'
        }
      }

      return val
    },
  },
}
</script>

<style></style>
