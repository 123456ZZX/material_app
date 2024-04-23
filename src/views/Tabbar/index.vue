<!--
 * @Author: xie_sm
 * @Date: 2022-04-15 08:54:47
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-04-28 15:17:54
 * @FilePath: \mobile-template\src\views\Tabbar\index.vue
 * @Description: 
 * 
-->
<template>
  <div style="height: 100%">
    <keep-alive>
      <router-view />
    </keep-alive>
    <fm-tabbar route v-model="active" safe-area-inset-bottom>
      <fm-tabbar-item to="/index">
        <span>首页</span>
        <template #icon="props">
          <img
            class="props-img"
            :src="require(`@/assets/img/tabbar/${props.active ? '首页_active' : '首页'}.png`)"
          />
        </template>
      </fm-tabbar-item>
      <fm-tabbar-item to="/todo" icon="clock-o">
        <span>待办</span>
        <template #icon="props">
          <img
            class="props-img"
            :src="require(`@/assets/img/tabbar/${props.active ? '代办_active' : '代办'}.png`)"
          />
        </template>
      </fm-tabbar-item>
      <fm-tabbar-item />
      <fm-tabbar-item to="/OneMap" icon="friends-o">
        <span>一张图</span>
        <template #icon="props">
          <img
            class="props-img"
            :src="require(`@/assets/img/tabbar/${props.active ? '一张图_active' : '一张图'}.png`)"
          />
        </template>
      </fm-tabbar-item>
      <fm-tabbar-item to="/my" icon="user-o">
        <span>我的</span>
        <template #icon="props">
          <img
            class="props-img"
            :src="require(`@/assets/img/tabbar/${props.active ? '我的_active' : '我的'}.png`)"
          />
        </template>
      </fm-tabbar-item>
    </fm-tabbar>
    <div @click="bigAddClick" class="dhl">
      <img width="100%" :src="require('@/assets/img/tabbar/+导航栏.png')" />
    </div>
  </div>
</template>
<script>
import { Tabbar, TabbarItem, Image } from 'fawkes-mobile-lib'

export default {
  name: 'Tabbar',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Image.name]: Image,
  },
  data: () => ({
    active: 0,
  }),
  watch: {},
  created() {},
  // mounted() {
  //   console.log('mounted tabbar')
  //   document.removeEventListener('backbutton', this.$back, false)
  //   document.addEventListener('backbutton', eventBackButton, false)
  // },
  // beforeDestroy() {
  //   console.log('beforeDestroy tabbar')
  //   document.removeEventListener('backbutton', eventBackButton, false)
  //   document.removeEventListener('backbutton', exitApp, false)
  //   document.addEventListener('backbutton', this.$back, false)
  // },
  methods: {
    bigAddClick() {
      this.$router.push({
        path:"/CreateForm"
      })
    },
  },
}
</script>
<style lang="less" scoped>
/deep/.fm-tabbar-item__icon {
  display: flex;
  align-items: flex-end;
}
.props-img {
  width: 48px;
  height: 48px;
}
.dhl {
  z-index: 2;
  width: 20%;
  position: fixed;
  bottom: 10px;
  left: 40%;
}
</style>
