<template>
  <div class="pop">
    <div class="code">{{ smallType }} </div><br />
    <div class="code">{{ deviceCode }}</div>
    <div class="lnglat">
      <div class="lng" style="font-size: 12px;">{{ lng }}</div>
      <div class="lng" style="font-size: 12px; margin-top: 5px;">{{ lat }}</div>

    </div>
    <fm-button @click="fun" type="primary" style="height: 24px;" round>选择</fm-button>
  </div>
</template>
<script>
export default {
  name: 'popup',
  props: ['detailId', 'lng', 'lat', 'bigType', 'smallType', 'deviceCode', 'fun'],
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
