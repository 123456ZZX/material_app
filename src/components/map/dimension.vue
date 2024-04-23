<template>
  <view>
    <!-- 遮罩 TODO 放外面去 -->
    <view
      v-show="visible"
      class="mask"
      @click.stop="$emit('changeStatus', 'home')"
    ></view>
    <!-- 面板 -->
    <transition name="slide-fade">
      <view v-show="visible" class="panel">
        <view class="span-title">
          <span>场景切换</span>
        </view>
        <view class="row">
          <view
            v-for="(img, index) in sceneImg"
            :key="index"
            class="scene-view"
            @click.stop="changeScene(img.id)"
          >
            <view
              :class="currentScene == img.id ? 'checked' : 'unchecked'"
            ></view>
            <image
              class="scene-img"
              :src="'../../static/img/gis/' + img.id + '.png'"
              :alt="img.text"
            />
            <span
              :class="[
                currentScene == img.id ? 'span-checked' : 'span-unchecked',
                'scene-span',
              ]"
              >{{ img.text }}</span
            >
          </view>
        </view>

        <view class="span-title">
          <span>底图切换</span>
        </view>
        <view class="row">
          <view
            v-for="(img, index) in mapImg"
            :key="index"
            class="scene-view"
            @click.stop="changeMap(img.id)"
          >
            <view
              :class="currentMap == img.id ? 'checked' : 'unchecked'"
            ></view>
            <image
              class="scene-img"
              :src="'../../static/img/gis/' + img.id + '.png'"
              :alt="img.text"
            />
            <span
              :class="[
                currentMap == img.id ? 'span-checked' : 'span-unchecked',
                'scene-span',
              ]"
              >{{ img.text }}</span
            >
          </view>
        </view>

        <view class="lang-line"></view>

        <view style="position: relative">
          <view class="span-title">
            <span>开启注记</span>
          </view>
          <switch
            :checked="showAnnotation"
            @change="changeAnnotation"
            color="#00C7BE"
            class="annotation"
          />
        </view>
        <!-- <input type="checkbox" v-model="showAnnotation" @change="changeAnnotation"/> -->
        <view class="lang-line"></view>
      </view>
    </transition>
  </view>
</template>

<script>
export default {
  name: 'Dimension',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sceneImg: [
        // 场景列表
        { id: '2dGIS', text: '2D GIS' },
        { id: '3dGIS', text: '3D GIS' },
        { id: '3dBIM', text: '3D BIM' },
      ],
      mapImg: [
        // 底图列表
        { id: 'vec', text: '矢量' },
        { id: 'img', text: '影像' },
        { id: 'ter', text: '地形' },
      ],
      currentScene: '2dGIS', // 当前场景
      currentMap: 'vec', // 当前底图
      showAnnotation: true, // 是否显示注记
    }
  },
  methods: {
    changeScene(id) {
      this.currentScene = id
    },
    /* 底图切换事件处理 */
    changeMap(id) {
      if (this.currentMap != id) {
        this.$emit('change-map', id)
        this.currentMap = id
      }
    },
    /* 是否开启注记 */
    changeAnnotation(e) {
      this.showAnnotation = e.target.value
      this.$emit('changeAnnotation', this.showAnnotation)
    },
  },
}
</script>

<style scoped>
/* 遮罩层 */
.mask {
  position: fixed;
  left: 0;
  top: var(--status-bar-height);
  width: 100%;
  height: calc(100% - var(--status-bar-height));
  background: rgba(0, 0, 0, 0.2);
}
/* 面板 */
.panel {
  position: absolute;
  box-sizing: border-box;
  right: 0;
  top: var(--status-bar-height);
  width: 600rpx;
  height: calc(100% - var(--status-bar-height));
  padding: 40rpx 30rpx;
  background-color: #12212e;
  opacity: 0.9;
  box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 19, 64, 0.46);
}
/* 面板淡入淡出动画 */
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(40rpx);
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all 1s ease;
}
/* 功能标题 */
.span-title {
  margin-bottom: 40rpx;
  font-size: 30rpx;
  line-height: 30rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
}
/* 一行图片 */
.row {
  height: 160rpx;
  margin-bottom: 40rpx;
}
/* 一个图片 */
.scene-view {
  position: relative;
  display: inline-block;
  width: 160rpx;
  height: 160rpx;
  text-align: center;
  border-radius: 2px;
  overflow: hidden;
}
.scene-view:nth-of-type(n + 2) {
  margin-left: 30rpx;
}
.scene-img {
  width: 160rpx;
  height: 160rpx;
}
/* 图片选中和不选中的边框效果 */
.checked {
  position: absolute;
  z-index: 10;
  width: 160rpx;
  height: 160rpx;
  border: 2px solid #00c7be;
}
.unchecked {
  position: absolute;
  z-index: 10;
  width: 160rpx;
  height: 160rpx;
  background: rgb(0, 0, 0, 0.5);
}
/* 图片上的文字 */
.scene-span {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  line-height: 60rpx;
  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: 400;
}
.span-checked {
  color: #fbfbfb;
}
.span-unchecked {
  color: #ffffff;
  opacity: 0.6;
}
/* 分割线 */
.lang-line {
  width: 600rpx;
  margin: 0 0 40rpx -30rpx;
  height: 2rpx;
  background: #ffffff;
  opacity: 0.2;
}
/* 修改注记大小 */
/deep/ uni-switch .uni-switch-input {
  height: 48rpx;
  width: 88rpx;
  margin-right: 0;
}
/deep/ uni-switch .uni-switch-input:before {
  height: 44rpx;
  width: 84rpx;
}
/deep/ uni-switch .uni-switch-input:after {
  height: 44rpx;
  width: 44rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.4);
}
/deep/ uni-switch .uni-switch-input.uni-switch-input-checked:after {
  transform: translateX(40rpx);
}
/* 注记位置 */
.annotation {
  position: absolute;
  right: 20rpx;
  top: -10rpx;
}
</style>