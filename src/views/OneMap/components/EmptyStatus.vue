<template>
  <div class="empty-status">
    <img :style="{ height: height, width: width }" :src="imgSrc" alt="" />
    <span class="empty-status-text">该状态暂无设备</span>
  </div>
</template>

<script>
export default {
  name: 'EmptyStatus',
  props: {
    height: {
      type: String,
      default: () => {
        return '240px'
      },
    },
    width: {
      type: String,
      default: () => {
        return '300px'
      },
    },
    imgSrc: {
      type: String,
      default: () => {
        return require('@/assets/img/map/emptyStatus.png')
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.empty-status {
  display: flex;
  flex-flow: column;
  align-items: center;
  span {
    font-size: 24px;
    font-family: MicrosoftYaHei;
    color: #cccccc;
    line-height: 31px;
    margin-top: 29px;
  }
}
</style>