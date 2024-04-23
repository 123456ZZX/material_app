<template>
  <div class="legend-item">
    <img :src="iconSrc" alt="图例" />
    <!-- <img v-else :src="iconSrcGary" alt="图例" /> -->
    <!-- <div v-else :class="iconClass" :style="info.style_str"></div> -->
    <div class="title" :title="info.label" :class="titleClass">{{ info.label }}</div>
  </div>
</template>

<script>
import { isExternal } from '@/utils/validate';
export default {
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    shape: {
      type: String,
      default: 'circle',
    },
  },
  computed: {
    titleClass() {
      if(this.info.clickFlag) {
        return 'gray-title'
      }else {
        return ''
      }
    },
    iconSrc() {
      // return this.info.icon;
      return isExternal(this.info.icon) || this.info.icon.includes('base64')
        ? this.info.icon
        : require('@/' + this.info.icon + '.png');
    },
    iconSrcGary() {
      // return this.info.icon;
      return isExternal(this.info.icon) || this.info.icon.includes('base64')
        ? this.info.icon
        : require('@/' + this.info.iconGray + '.png');
    },
    iconClass() {
      switch (this.shape) {
        case 'circle':
          return 'circle-fill';
          break;
        case 'square':
          return 'square-fill';
          break;
        case 'rectangle':
          return 'rectangle-fill';
          break;
        default:
          return 'circle-fill';
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.legend-item {
  display: flex;
  align-items: center;
  height: 28px;
  cursor: pointer;
  img {
    width: 42px;
    height: 42px;
    margin: 0 10px 0 16px;
  }
  .circle-fill {
    width: 16px;
    height: 16px;
    border-radius: 8px;
    margin: 0 10px 0 16px;
  }
  .square-fill {
    width: 16px;
    height: 16px;
    margin: 0 10px 0 16px;
  }
  .rectangle-fill {
    width: 16px;
    height: 4px;
    margin: 0 10px 0 16px;
  }
  .title {
    width: 150px;
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    overflow: hidden;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;    
  }
  .gray-title{
    color: #999999;
  }
}
</style>
