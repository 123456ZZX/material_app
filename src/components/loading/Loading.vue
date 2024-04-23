<!--
 * @Author: xie_sm
 * @Date: 2022-03-03 11:47:41
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-07 09:28:13
 * @FilePath: \mobile-template\src\components\loading\Loading.vue
 * @Description: 全局加载组件
 *
-->
<template>
  <fm-overlay
    :show="show"
    :custom-style="{
      background: 'transparent',
      display: 'flex',
      justifyContent: 'center',
    }"
  >
    <fm-loading
      v-show="show"
      :class="{ loadingWrap: true, 'without-text': !title }"
      :color="color"
      :type="type"
    >
      <span style="color: #4994df">{{ title }}</span>
    </fm-loading>
  </fm-overlay>
</template>
<script>
import { Loading, Overlay } from 'fawkes-mobile-lib'

export default {
  name: 'Loading',
  components: {
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
  },
  props: {
    type: {
      type: String,
      default: 'circular',
    },
    color: {
      type: String,
      default: '#1989fa',
    },
    title: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    show: false,
  }),
}
</script>
<style lang="less" scoped>
.loadingWrap {
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.without-text {
  .fm-loading__text {
    margin-left: 0;
  }
}
</style>
