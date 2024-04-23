<template>
  <view>
    <!-- 底部菜单栏 -->
    <view class="bottom-tool-panel">
      <view
        class="bottom-tool"
        v-for="tool in tools"
        :key="tool.id"
        @click.stop="openMenu(tool.id)"
      >
        <image
          class="tool-img"
          :src="'../../static/img/gis/bottom-menu/' + tool.id + '.png'"
          :alt="tool.text"
        />
        <span class="tool-text">{{ tool.text }}</span>
        <image
          v-show="currentMenu == tool.id"
          class="selected-img"
          src="@/static/img/gis/bottom-menu/selected.png"
        />
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'bottomTool',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tools: [
        {
          id: 'measure',
          text: '测量',
        },
        {
          id: 'plotting',
          text: '标绘',
        },
        {
          id: 'transparency',
          text: '透明度',
        },
        {
          id: 'business',
          text: '业务浏览',
        },
      ],
      currentMenu: '',
    }
  },
  methods: {
    openMenu(toolId) {
      this.currentMenu = toolId
    },
  },
}
</script>

<style scoped>
/* 底部工具栏面板 */
.bottom-tool-panel {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 128rpx;
  padding: 0 30rpx;
  background-color: rgba(18, 33, 46, 0.8);
  border: 1px solid #12212e;
  box-shadow: 0px 1px 8px 0px rgba(8, 18, 25, 0.1);
}
.bottom-tool {
  position: relative;
  flex: 1;
  text-align: center;
}
.tool-img {
  display: block;
  width: 42rpx;
  height: 42rpx;
  margin: 0 auto;
  margin-top: 28rpx;
}
.tool-text {
  display: inline-block;
  color: #ffffff;
  font-size: 20rpx;
  line-height: 20rpx;
  opacity: 0.9;
  margin-top: 16rpx;
}
.selected-img {
  display: block;
  width: 80rpx;
  height: 4rpx;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
}
</style>