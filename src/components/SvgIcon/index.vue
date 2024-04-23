<!--
 * @Author: wei_jt@ecidi.com
 * @Date: 2020-06-10 18:34:58
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2021-06-04 10:13:00
 * @Description: svg组件
--> 
<template>
  <svg
    :class="svgClass"
    aria-hidden="true"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'IconSvg',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
  },
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: middle;
  fill: currentColor;
}
</style>