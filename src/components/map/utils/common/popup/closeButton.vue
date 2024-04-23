<template>
  <div>
    <span class="icon-text fm-icon fm-icon-cross" @click="handleClose"></span>
  </div>
</template>

<script>
export default {
  methods: {
    handleClose() {
      this.$emit("close")
    }
  }
}
</script>

<style lang="scss">
.swan-popup-close {
  max-width: none !important;

  .mapboxgl-popup-tip {
    //气泡箭头样式
    border: none;
  }

  .mapboxgl-popup-content {
    //气泡主体样式
    background: rgba(255, 255, 255, 0);
    padding: 10px;
  }

  .icon-text {
    font-size: 18px;
    background: #FFFFFF;
    cursor: pointer;
  }
}
</style>