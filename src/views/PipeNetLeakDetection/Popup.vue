<template>
  <div class="pop">
    <div v-if="isDevice" class="code" style="font-size: 18px">{{ deviceCode }}</div>
    <div v-else class="lnglat">
      <div class="lng" style="font-size: 12px">{{ lng.toFixed(3) }}</div>
      <div class="lng" style="font-size: 12px; margin-top: 5px">{{ lat.toFixed(3) }}</div>
    </div>
    <fm-button @click="fun()" type="primary" style="height: 24px" round>选择</fm-button>
  </div>
</template>
<script>
export default {
  name: 'Popup',
  props: ['lng', 'lat', 'deviceCode', 'type', 'isDevice', 'token', 'deviceDetail', 'fun'],
}
</script>
<style lang="less" scoped>
.pop {
  display: flex;
  .code {
    width: auto;
    height: 24px;
    margin: auto 24px auto 0;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    line-height: 24px;
  }
  .lnglat {
    display: flex;
    flex-direction: column;
    width: auto;
    .lng {
      width: auto;
      height: 24px;
      margin: auto 24px auto 0;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #555555;
      font-size: 12px;
      line-height: 24px;
    }
  }
}
</style>
