<template>
  <div class='main'>
    <!-- 下拉刷新 -->
    <fm-pull-refresh class='main' v-model='refreshing' success-text='刷新成功' @refresh='onRefresh'>
      <fm-nav-bar :title="taskType == 'survey'?'普查计划':'抄表计划'" left-arrow @click-left='goBack'></fm-nav-bar>
      <fm-tabs v-model='selectedTab' @tab-click='changeType' line-width='60px'>
        <fm-tab name='未抄' :label="labelNum('未抄')"></fm-tab>
        <fm-tab name='未提交' :label="labelNum('未提交')"></fm-tab>
        <!-- <fm-tab name="已抄" :label="labelNum('已抄')"></fm-tab> -->
      </fm-tabs>
      <div class='main-container'>
        <template>
          <!-- 列表 -->
          <fm-list v-model='loading' @load='onLoad' :immediate-check='false'>
            <div v-show="selectedTab === '未抄'">
              <div v-for='(item, index) in notStartList' :key='index' class='list-item'
                   @click='toDetail(item.guestNo, 0,item.planCode,item.bookCode)'>
                <span>{{ item.guestName }} - {{ item.address }}</span>
              </div>
              <!-- 无数据 -->
              <template v-if='notStartList && notStartList.length == 0'>
                <div class='no-data-img'>
                  <fm-image fit='cover' :src="require('@/assets/img/no-data-img.png')" />
                </div>
                <div class='no-data-text'>
                  <div class='no-data-text-descripe'>暂无数据，请前往计划下载</div>
                </div>
              </template>
            </div>
            <div>
              <div v-show="selectedTab === '未提交'">
                <div v-for='(item, index) in notCommitList' :key='index' class='list-item'
                     @click='toDetail(item.guestNo, 1, item.planCode,item.bookCode)'>
                  <span>{{ item.guestName }} - {{ item.address }}</span>
                </div>
                <!-- 无数据 -->
                <template v-if='notCommitList && notCommitList.length == 0'>
                  <div class='no-data-img'>
                    <fm-image fit='cover' :src="require('@/assets/img/no-data-img.png')" />
                  </div>
                  <div class='no-data-text'>
                    <div class='no-data-text-descripe'>暂无数据</div>
                  </div>
                </template>
              </div>
            </div>
            <div>
              <!-- <div v-show="selectedTab === '已抄'">
                <div v-for="(item, index) in workDoneList" :key="index" class="list-item" @click="toDetail(item.guestNo, 2,item.planCode,item.bookCode)">
                  <span>{{item.guestName}} - {{item.address}}</span>
                </div>
                <template v-if="workDoneList && workDoneList.length == 0">
                  <div class="no-data-img">
                    <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
                  </div>
                  <div class="no-data-text">
                    <div class="no-data-text-descripe">暂无数据</div>
                  </div>
                </template>
              </div> -->
            </div>
          </fm-list>

        </template>
      </div>
    </fm-pull-refresh>
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
  Dialog
} from 'fawkes-mobile-lib'
import { queryTaskList } from './api'

export default {
  name: 'Inspection',
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
    [Dialog.name]: Dialog
  },
  data() {
    return {
      currentTab: '未抄',
      taskType: '',
      pageSize: 10,
      inExecutionPage: 1, // 执行中page
      todoPage: 1, // 未开始page
      finishedPage: 1, // 已完成page
      refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
      loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
      // tab切换标题
      selectedTab: '未抄',
      notStartList: [], //'未抄数组'
      notCommitList: [], //'未提交数组'
      workDoneList: [] //'已抄数组'
    }
  },
  activated() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true
    })
    this.taskType = localStorage.getItem('taskType')
    this.onRefresh()
  },
  methods: {
    labelNum(label) {
      let len = 0
      if (label == '未抄') {
        len = this.notStartList ? this.notStartList.length : 0
      } else if (label == '未提交') {
        len = this.notCommitList ? this.notCommitList.length : 0
      } else if (label == '已抄') {
        len = this.workDoneList ? this.workDoneList.length : 0
      }
      return label + '(' + len + ')'
    },
    // 重置列表page,list值
    pageReset() {
      this.inExecutionPage = 1
      this.todoPage = 1
      this.finishedPage = 1
      this.notStartList = []
      this.notCommitList = []
      this.workDoneList = []
    },
    // tab切换回调
    changeType(name, title) {
      this.selectedTab = name
    },
    // 页面加载/下拉刷新
    onRefresh() {
      this.pageReset()
      this.loading = true
      this.getList()
    },
    // 列表加载更多
    onLoad() {
      this.getList()
    },
    // 获取列表数据
    getList() {
      let bookCode = localStorage.getItem('bookCode')
      let plans = localStorage.getItem('myDownloadPlan')
      let nsList = plans ? JSON.parse(plans) : []
      this.notStartList = nsList.filter((item) => {
        return item.bookCode == bookCode
      })
      let savedTasks = localStorage.getItem('savedTasks')
      let ncList = savedTasks ? JSON.parse(savedTasks) : []
      this.notCommitList = ncList.filter((item) => {
        return item.bookCode == bookCode
      })
      this.loading = false
      this.refreshing = false
    },
    //跳转详情
    toDetail(tId, type, planCode, bookCode) {
      let opType = this.taskType
      if (opType == 'survey') {
        this.$router.push({
          name: 'SurveyDetail',
          params: {
            tId,
            type,
            planCode,
            bookCode
          }
        })
      } else {
        this.$router.push({
          name: 'RevenueTaskDetail',
          params: {
            tId,
            type,
            planCode,
            bookCode
          }
        })
      }
    },
    goBack() {
      let type = this.taskType
      if (type == 'survey') {
        this.$router.replace('/SurveyIndex')
      } else {
        this.$router.replace('/BookIndex')
      }
    }
  }
}
</script>
<style lang='less' scoped>
.main {
  background-color: #ecf4ff !important;
  height: 100%;
}

// 顶部标题背景色
/deep/ .fm-nav-bar__content {
  background-color: #0676fd !important;
  height: 1.8rem;
}

/deep/ .fm-nav-bar__title {
  color: #ffffff !important;
}

/deep/ .fm-nav-bar .fm-icon {
  color: #ffffff !important;
}

// tab切换栏
// 更改背景色
/deep/ .fm-tabs__nav--line {
  background-color: #ecf4ff;
  display: flex;
  align-items: flex-end;
}

// 每个tab高度变低
/deep/ .fm-tab {
  height: 80%;
  border-radius: 20px 20px 0px 0px;
  background-image: linear-gradient(180deg, #d0e7ff, #d3e8fe, #dbebff, #ecf4ff);
}

// 取消选中横条
/deep/ .fm-tabs__line {
  width: 0 !important;
}

// 选中效果
/deep/ .fm-tab--active {
  // 梯形样式
  // height: 0;
  // width: 100px;
  // border-width: 0 20px 90px 20px;
  // border-style: none solid solid;
  // border-color: transparent transparent rgb(141, 247, 155);

  height: 100%;
  font-size: 32px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #191919;
  border-radius: 20px 20px 0px 0px;
  background-image: linear-gradient(180deg, #d0e7ff, #d3e8fe, #dbebff, #ecf4ff);
}

.main-container {
  height: calc(100% - 280px);
  overflow: auto;
  background-color: #ecf4ff;
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
  font-weight: 600;
}

.task-container /deep/ .fm-nav-bar .fm-icon {
  color: #333;
}

.task-container /deep/ .fm-nav-bar__arrow {
  font-size: 48px;
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

.list-item {
  width: 100%;
  height: 80px;
  line-height: 80px;
  padding-left: 8px;
  padding-right: 8px;
  box-sizing: border-box;
  border-bottom: 1px solid #fff;
  background-color: #ecf4ff;
  cursor: pointer;

  span {
    width: 50%;
    font-size: 16px;
    font-weight: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
