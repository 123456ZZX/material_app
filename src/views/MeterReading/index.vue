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
  <div style='height: 100%'>
    <keep-alive>
      <router-view />
    </keep-alive>
    <fm-tabbar v-if="$route.path !== '/TaskDetail'&&$route.path !== '/SurveyDetail'&&$route.path !== '/TaskIndex'" route
               v-model='active' safe-area-inset-bottom>
      <fm-tabbar-item to='/BookIndex'>
        <span>抄表计划</span>
        <template #icon='props'>
          <img class='props-img' :src="require(`@/assets/img/tabbar/${props.active ? 'task-active' : 'task'}.png`)" />
        </template>
      </fm-tabbar-item>
      <fm-tabbar-item to='/SurveyIndex' icon='friends-o'>
        <span>普查计划</span>
        <template #icon='props'>
          <img class='props-img'
               :src="require(`@/assets/img/tabbar/${props.active ? 'address-active' : 'address'}.png`)" />
        </template>
      </fm-tabbar-item>
      <fm-tabbar-item name='DownloadPlan' to='/DownloadPlan' icon='clock-o'>
        <span>计划下载</span>
        <template #icon='props'>
          <img class='props-img' :src="require(`@/assets/img/tabbar/${props.active ? 'todo-active' : 'todo'}.png`)" />
        </template>
      </fm-tabbar-item>
      <!-- <fm-tabbar-item to="" icon="user-o">
        <span>任务管理</span>
        <template #icon="props">
          <img class="props-img" :src="require(`@/assets/img/tabbar/${props.active ? 'my-active' : 'my'}.png`)" />
        </template>
      </fm-tabbar-item> -->
    </fm-tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem, Image } from 'fawkes-mobile-lib'

export default {
  name: 'Tabbar',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Image.name]: Image
  },
  data: () => ({
    active: 'DownloadPlan'
  }),
  watch: {},
  created() {
  },
  methods: {}
}
</script>
<style lang='less' scoped>
/deep/ .fm-tabbar-item__icon {
  display: flex;
  align-items: flex-end;
}

.props-img {
  width: 48px;
  height: 48px;
}
</style>
