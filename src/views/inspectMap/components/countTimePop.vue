<!--
 * @Description: 
 * @Author: wei_qx@hdec.com
 * @Date: 2021-04-29 16:39:14
 * @LastEditor: wei_qx@hdec.com
 * @LastEditTime: 2021-04-29 19:32:00
-->
<template>
  <view class="pop-container">
    <u-icon class="pop-icon" name="clock-fill" size="24"></u-icon>:
    <view v-if="!restTime" style="float: right;color: red;">逾期
    </view>
    <!-- <u-count-down v-if="restTime" :timestamp="restTime"></u-count-down> -->
    <u-count-down v-if="restTime" timestamp="9999"></u-count-down>
  </view>
</template>
<script>
export default {
  name: "count-time-popup",
  props: ["restTime"],
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.pop-container {
  &-icon {
    float: left;
  }
}
</style>
