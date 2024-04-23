<template>
  <view v-show="visible">
    <!-- 指南针 -->
    <view id="compass-container" class="compass-bg" @click="resetCompass">
      <image
        :style="'transform: rotate(' + angle + 'deg)'"
        class="compass-img"
        src="@/static/img/gis/compass.png"
        alt="指南针"
      />
    </view>
    <!-- 工具栏 -->
    <view class="tool-group">
      <view
        class="tool"
        v-for="tool in tools"
        :key="tool.id"
        @click.stop="$emit('changeStatus', tool.id)"
      >
        <image
          class="tool-img"
          :src="'../../static/img/gis/' + tool.id + '.png'"
          :alt="tool.text"
        />
        <span class="tool-text">{{ tool.text }}</span>
      </view>
    </view>
    <!-- 放大/缩小 -->
    <view class="zoom-group">
      <view v-show="disableEnlarge">
        <image
          class="enlarge-img"
          src="@/static/img/gis/enlarge_disable.png"
          alt="放大"
        />
      </view>
      <view v-show="!disableEnlarge">
        <image
          class="enlarge-img"
          src="@/static/img/gis/enlarge.png"
          alt="放大"
          @click.stop="$emit('changeZoom', true)"
        />
      </view>
      <view v-show="disableNarrow">
        <image
          class="narrow-img"
          src="@/static/img/gis/narrow_disable.png"
          alt="缩小"
        />
      </view>
      <view v-show="!disableNarrow">
        <image
          class="narrow-img"
          src="@/static/img/gis/narrow.png"
          alt="缩小"
          @click.stop="$emit('changeZoom', false)"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'rightTool',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    angle: {
      type: Number,
      default: -45,
    },
    // 禁用放大按钮
    disableEnlarge: {
      type: Boolean,
      default: false,
    },
    // 禁用缩小按钮
    disableNarrow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tools: [
        {
          id: 'dimension',
          text: '维度切换',
        },
        {
          id: 'layer',
          text: '图层切换',
        },
        {
          id: 'home',
          text: '视角复原',
        },
      ],
    }
  },
  methods: {
    resetCompass() {
      this.$emit('resetCompass')
    },
  },
}
</script>

<style scoped>
/* 指南针 */
.compass-bg {
  position: absolute;
  right: 12rpx;
  top: calc(16rpx + var(--status-bar-height));
  width: 118rpx;
  height: 118rpx;
  /* background-image: url(../../static/img/gis/compass-bg.png); */
  background-size: 118rpx 118rpx;
  background-repeat: no-repeat;
  text-align: center;
}
.compass-img {
  width: 46rpx;
  height: 44rpx;
  margin-top: 34rpx;
}
/* 工具组 */
.tool-group {
  position: absolute;
  right: 16rpx;
  top: calc(118rpx + var(--status-bar-height));
  width: 112rpx;
  height: 364rpx;
  /* background-image: url(../../static/img/gis/tool-group.png); */
  background-size: 112rpx 364rpx;
  background-repeat: no-repeat;
  text-align: center;
}
.tool {
  height: 88rpx;
  padding: 8rpx 0;
  box-sizing: unset;
}
.tool-group view:first-child {
  padding-top: 34rpx;
}
.tool-img {
  display: block;
  width: 36rpx;
  height: 36rpx;
  margin: 0 auto;
}
.tool-text {
  display: inline-block;
  color: #ffffff;
  font-size: 20rpx;
  line-height: 24rpx;
  opacity: 0.9;
  max-width: 48rpx;
  margin-top: 8rpx;
}
/* 缩放按钮 */
.zoom-group {
  position: absolute;
  top: calc(554rpx + var(--status-bar-height));
  right: 16rpx;
  width: 112rpx;
  height: 200rpx;
  /* background-image: url(../../static/img/gis/zoom-group.png); */
  background-size: 112rpx 200rpx;
  background-repeat: no-repeat;
  text-align: center;
}
.enlarge-img {
  width: 32rpx;
  height: 32rpx;
  display: block;
  margin: 0 auto;
  margin-top: 42rpx;
}
.narrow-img {
  width: 32rpx;
  height: 6rpx;
  display: block;
  margin: 0 auto;
  margin-top: 64rpx;
}
</style>