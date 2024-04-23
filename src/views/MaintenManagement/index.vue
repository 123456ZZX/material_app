<template>
  <div class="main">
    <img :src="require('@/assets/img/blueBg.png')" class="main-bg" />
    <fm-nav-bar title="养护任务" left-arrow @click-left="$router.go(-1)"></fm-nav-bar>
    <div class="content">
      <img :src="bgSrc" class="bgImg" :class="selectedTab == '执行中' ? 'left' : selectedTab == '未养护' ? 'middle' : 'right'" />
      <fm-tabs v-model="selectedTab" @tab-click="changeType" line-width="60px">
        <fm-tab name="执行中" :label="working"></fm-tab>
        <fm-tab name="未养护" :label="notStart"></fm-tab>
        <fm-tab name="已完成" :label="workDone"></fm-tab>
      </fm-tabs>
      <!-- 选择框 -->
      <div class="selectStyle">
        <Select :selectData="mainDateTypeList" :selValue="dateType" color="white" @getValue="getValue"></Select>
        <Select :selectData="mainTaskTypeList" :selValue="mainTaskType" color="white" @getValue="getValue"></Select>
      </div>
      <div class="main-container">
        <template>
          <!-- 下拉刷新 -->
          <fm-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
            <!-- 无数据 -->
            <template v-if="taskList.length == 0 && !loading">
              <div class="no-data-img">
                <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
              </div>
              <div class="no-data-text">
                <div class="no-data-text-descripe">暂无数据</div>
              </div>
            </template>
            <!-- 列表 -->
            <fm-list  v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="0">
              <div>
                <div v-for="(item, index) in taskList" :key="index">
                  <!-- 执行中卡片 -->
                  <InfoCardWorking :cardInfo="item" @execute="execute" v-if="selectedTab == '执行中'"></InfoCardWorking>
                  <!-- 未巡检卡片 -->
                  <InfoCardNotAndDone :cardInfo="item" cardType="not" @transmitEvent="transmitEvent" v-else-if="selectedTab == '未养护'"
                    @startEvent="execute"></InfoCardNotAndDone>
                  <!-- 已完成卡片 -->
                  <InfoCardNotAndDone :cardInfo="item" cardType="done" @execute="handleView" v-else></InfoCardNotAndDone>
                </div>
              </div>
            </fm-list>
          </fm-pull-refresh>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  Search,
  Toast,
  Cell,
  CellGroup,
  PullRefresh,
  List,
  Sidebar,
  SidebarItem,
  SwipeCell,
  Button,
  NoticeBar,
  Icon,
  Dialog,
} from 'fawkes-mobile-lib'
// 执行中信息卡片
import InfoCardWorking from './components/InfoCardWorking.vue'
// 未巡检、已完成信息卡片
import InfoCardNotAndDone from './components/InfoCardNotAndDone.vue'
// 下拉选择框
import Select from './components/Select.vue'
import { queryTaskList } from './api'

export default {
  name: 'MaintenManagement',
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Toast.name]: Toast,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [NoticeBar.name]: NoticeBar,
    [Icon.name]: Icon,
    [Dialog.name]: Dialog,
    InfoCardWorking,
    InfoCardNotAndDone,
    Select,
  },
  data() {
    return {
      taskList: [],
      activeKey: 0,
      searchValue: '', // 搜索文字
      tabs: ['执行中', '未养护', '已完成'],
      pageSize: 10,
      refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
      loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
      finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
      currentRate: 0,
      mainDateTypeList: [
        { type: 1, name: '全部时间', value: '全部时间' },
        { type: 1, name: '近一周', value: '近一周' },
        { type: 1, name: '近一月', value: '近一月' },
        { type: 1, name: '近三月', value: '近三月' },
      ],
      mainTaskTypeList: [
        { type: 2, name: '全部类型', value: '全部类型' },
        { type: 2, name: '污水', value: '污水' },
        { type: 2, name: '雨水', value: '雨水' },
        { type: 2, name: '供水', value: '供水' },
        { type: 2, name: '再生水', value: '再生水' }
      ],
      dateType: '全部时间',
      mainTaskType: '全部类型',
      // tab切换标题
      selectedTab: '执行中',
      working: '执行中',
      notStart: '未养护',
      workDone: '已完成'
    }
  },
  created() {
    // 初始化下拉框
    this.dateType = this.mainDateTypeList[0].value
    this.mainTaskType = this.mainTaskTypeList[0].value
  },
  mounted() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    this.onRefresh()
  },
  computed: {
    bgSrc() {
      let src = ''
      switch (this.selectedTab) {
        case '执行中':
          src = require('@/assets/img/selectLeftBg.png')
          break;
          
        case '已完成':
          src = require('@/assets/img/selectRightBg.png')
          break;
          
        case '未养护':
          src = require('@/assets/img/selectBg.png')
          break;

        default:
          src = require('@/assets/img/selectLeftBg.png')
          break;
      }
      return src
    },
    text() {
      return this.currentRate.toFixed(0) + '%'
    },
  },
  methods: {
    // select框选择回调
    getValue(type, name, value) {
      if (type === 1) {
        this.dateType = value
      } else if (type === 2) {
        this.mainTaskType = value
      }
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      this.onRefresh()
    },
    // 重置列表page,list值
    pageReset() {
      this.pageNum = 1
      this.taskList = []
    },
    // tab切换回调
    changeType(name, title) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      this.selectedTab = name
      this.onRefresh()
    },
    // 搜索
    onSearch(val) {
      // this.searchParams.reimburseName = val
      // 复用刷新接口
      this.onRefresh()
    },
    // 页面加载/下拉刷新
    onRefresh() {
      this.pageReset()
      this.loading = true
      this.finished = false
      this.getList()
    },
    // 列表加载更多
    onLoad() {
      this.pageNum = this.pageNum + 1
      this.getList()
    },
    // 获取列表数据
    getList() {
      let startTime = ''
      switch (this.dateType) {
        case '近一周':
          startTime = this.$dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss')
          break;
        case '近一月':
          startTime = this.$dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
          break;
        case '近三月':
          startTime = this.$dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss')
          break
        default:
          startTime = ''
          break
      }
      let searchParams = {
        page: this.pageNum,
        size: this.pageSize,
        startTime: startTime,
        endTime: this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.mainTaskType != '全部类型') {
        searchParams.bizType = this.mainTaskType
      }
      switch (this.selectedTab) {
        case '执行中':
          searchParams.status = '1'
          break
        case '未养护':
          searchParams.status = '0'
          break
        case '已完成':
          searchParams.status = '2'
          break
        default: 
          searchParams.status = '1'
          break
      }
      queryTaskList(searchParams)
        .then((res) => {
          if (res.data) {
            this.taskList = [...this.taskList, ...res.data.records]
            if (res.data.current >= res.data.pages) {
              this.finished = true
            }
            this.refreshing = false
          }
        })
        .catch(() => {
          this.finished = true
        })
        .finally(() => {
          Toast.clear()
          this.loading = false
        })
    },

    /*打开查看页面*/
    handleView(item) {
      this.$router.push({
        name: 'TaskDetail',
        query: {
          name: '执行',
          taskId: item.id,
          data: JSON.stringify(item),
          isView: true
        }
      })
      return
    },
    // 转发
    transmitEvent(item) {
      console.log(item)
    },
    //执行
    execute(item) {
      this.$router.push({
        name: 'TaskDetail',
        query: {
          name: '执行',
          taskId: item.id,
          data: JSON.stringify(item)
        }
      })
      return
    }
  }
}
</script>
<style lang="less" scoped>
// ecf4ff
.main {
  background-color: #055ffc!important;
  height: 100%;
  .main-bg {
    position: absolute;
    width: 100%;
  }
  .content {
    margin-top: 40px;
    position: relative;
    background: #d4e8fc;
    height: calc(100% - 46px);
    width: 100%;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    .bgImg {
      position: absolute;
      height: 100px;
      z-index: 1;
      top: -20px;
    }
    .middle {
      left: 240px;
    }
    .right {
      right: 0;
    }
  }
}

// 顶部标题背景色
/deep/.fm-nav-bar__content {
  background-color: transparent;
}
/deep/.fm-hairline--bottom::after {
  border-bottom-width: 0;
}
/deep/.fm-nav-bar__title {
  color: #FFFFFF !important;
}

// tab切换栏
// 更改背景色
/deep/.fm-tabs__nav--line {
  background-color: #d4e8fc;
  display: flex;
  align-items: flex-end;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}
/deep/.fm-nav-bar  {
  background: transparent;
}
/deep/ .fm-nav-bar .fm-icon {
  color: #FFFFFF !important;
}

// 每个tab高度变低
/deep/.fm-tab {
  line-height: 72px;
  // height: 80%;
  // border-radius: 20px 20px 0px 0px;
  // // background-image: linear-gradient(40deg, #99cc33, #ff6666, #336699, #ff0033);
  // background-image: linear-gradient(180deg, #d0e7ff, #d3e8fe, #dbebff, #ecf4ff);
}

// 取消选中横条
/deep/.fm-tabs__line {
  width: 0 !important;
}

// 选中效果
/deep/.fm-tab--active {
  // 梯形样式
  // height: 0;
  // width: 100px;
  // border-width: 0 20px 90px 20px;
  // border-style: none solid solid;
  // border-color: transparent transparent rgb(141, 247, 155);

  // height: 100%;
  font-size: 32px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #191919;
}

// 选中tab的文字样式
/deep/.fm-tab--active .fm-tab__text--ellipsis {
  // margin-top: 90px;
  z-index: 1;
}

// select选择框
.selectStyle {
  display: flex;
  justify-content: space-between;
  width: 690px;
  margin: 24px auto 12px;
}

.main-container {
  height: calc(100% - 208px);
  overflow: auto;
  background-color: #d4e8fc;
}

/* 暂无数据begin */
.no-data-img {
  margin: 200px 95px 0 95px;
}

.no-data-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data-text-descripe {
  font-size: 32px;
  font-weight: 400;
  color: #999999;
}

/* 暂无数据end */
/* 解决下拉时，数据和全部加载的提示文案超出列表元素不显示的问题 */
/deep/ .fm-pull-refresh {
  overflow: visible;
}

.task-container /deep/ .fm-nav-bar__content {
  height: 88px;
}

.task-container /deep/ .fm-nav-bar__title {
  font-size: 36px;
  color: #FFFFFF !important;
  font-weight: 600;
}

.task-container /deep/ .fm-nav-bar .fm-icon {
  color: #027aff !important;
}

.task-container /deep/ .fm-nav-bar__arrow {
  font-size: 48px;
}

.fm-sidebar {
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
  border-bottom: 2px solid #ebedf0;
}

.fm-cell::after {
  border: none;
}

.fm-cell-group {
  margin-top: 24px;
}

/deep/ .fm-swipe-cell__right {
  display: flex;
  align-items: center;
}

/deep/ .fm-button--square {
  border-radius: 50%;
  width: 106px;
  height: 106px;
  padding: 0;
  margin-right: 20px;
}

.bottom {
  position: fixed;
  bottom: 24px;
  right: 44px;
  background-color: #027aff;
  width: 102px;
  height: 102px;
  line-height: 102px;
  border-radius: 50%;
  color: #fff;
  z-index: 1000;
  text-align: center;
}
</style>
