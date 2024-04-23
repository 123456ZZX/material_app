<template>
  <div class="popup-container">
    <div class="popup-item" v-for="(item, index) in displayText" :key="index">
      <span class="popup-text popup-key">{{ item.key }}</span>
      <span class="popup-text popup-value">{{ item.value }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    displayText: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="scss">
@import "./popup.scss"
</style>