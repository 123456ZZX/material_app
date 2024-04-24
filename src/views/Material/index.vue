<template>
  <div class="main">
    <img :src="require('@/assets/img/blueBg.png')" class="main-bg" />
    <fm-nav-bar title="物资管理" left-arrow @click-left="$router.go(-1)"></fm-nav-bar>
    <div class="content">

      <img :src="bgSrc" class="bgImg" :style="{ '--bgSrcLeft': bgSrcLeft }" />
<!--      <img :src="bgSrc" class="bgImg"-->
<!--        :class="selectedTab == '验收' ? 'left' : selectedTab == '出库'||selectedTab == '入库' ? 'middle' : 'right'" />-->
      <fm-tabs v-model="selectedTab" @tab-click="changeType" line-width="60px">
        <fm-tab name="验收" :label="check"></fm-tab>
        <fm-tab name="入库" :label="inWarehouse"></fm-tab>
        <fm-tab name="出库" :label="outWarehouse"></fm-tab>
        <fm-tab name="盘库" :label="makeWarehouse"></fm-tab>
      </fm-tabs>
      <!-- 选择框 -->
<!--      <div class="selectStyle">-->
<!--        <Select :selectData="checkStateOptions" :selValue="checkState" color="white" @getValue="getValue"></Select>-->
<!--        <Select :selectData="warehouseLocationOptions" :selValue="warehouseLocation" color="white" @getValue="getValue"></Select>-->
<!--      </div>-->
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
            <fm-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="0">
              <div>
                <div v-for="(item, index) in taskList" :key="index">
                  <!-- 执行中卡片 -->
                  <InfoCardinWarehouse :cardInfo="item" @execute="execute" v-if="selectedTab == '执行中'"></InfoCardinWarehouse>
                  <!-- 未巡检卡片 -->
                  <InfoCardNotAndDone :cardInfo="item" cardType="not" @transmitEvent="transmitEvent"
                    v-else-if="selectedTab == '未巡检'" @startEvent="startEvent"></InfoCardNotAndDone>
                  <!-- 已完成卡片 -->
                  <InfoCardNotAndDone :cardInfo="item" cardType="done" @execute="handleView" v-else>
                  </InfoCardNotAndDone>
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
import InfoCardinWarehouse from './InfoCardWorking.vue'
// 未巡检、已完成信息卡片
import InfoCardNotAndDone from './InfoCardNotAndDone.vue'
// 下拉选择框
import Select from './Select.vue'
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
    [Dialog.name]: Dialog,
    InfoCardinWarehouse,
    InfoCardNotAndDone,
    Select,
  },
  data() {
    return {
      taskList: [],
      activeKey: 0,
      searchValue: '', // 搜索文字
      tabs: ['执行中', '未巡检', '已完成'],
      pageSize: 10,
      refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
      loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
      finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
      currentRate: 0,
      checkStateOptions: [
        { type: 1, name: '入库完成', value: 'in_warehouse_finish' },
        { type: 1, name: '入库进行中', value: 'in_warehouse_going' },
        { type: 1, name: '入库未完成', value: 'in_warehouse_unfinish' },
      ],
      warehouseLocationOptions: [
        { type: 2, name: '1号库房', value: '1号库房' },
        { type: 2, name: '2号库房', value: '2号库房' },
        { type: 2, name: '3号库房', value: '3号库房' },
        { type: 2, name: '4号库房', value: '4号库房' },
        { type: 2, name: '5号库房', value: '5号库房' },
      ],
      checkState: '验收单状态',
      warehouseLocation: '库房名称',
      // tab切换标题
      selectedTab: '验收',
      check: '验收',
      inWarehouse: '入库',
      outWarehouse: '出库',
      makeWarehouse: '盘库',
      toast: null
    }
  },
  created() {
    // 初始化下拉框
    this.checkState = this.checkStateOptions[0].value
    this.warehouseLocation = this.warehouseLocationOptions[0].value
  },
  mounted() {
    this.toast = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    this.onRefresh()
  },
  computed: {

    bgSrcLeft() {
      let left = ''
      switch (this.selectedTab) {
        case '验收':
          left = '0px'
          break

        case '入库':
          left = '25%'
          break

        case '出库':
          left = '50%'
          break

        default:
          left = '75%'
          break
      }
      return left
    },
    bgSrc() {
      let src = ''
      switch (this.selectedTab) {
        case '验收':
          src = require('@/assets/img/pump/tab-left@2x.png')
          break

        case '盘库':
          src = require('@/assets/img/pump/tab-right@2x.png')
          break

        default:
          src = require('@/assets/img/pump/tab-center@2x.png')
          break
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
        this.checkState = value
      } else if (type === 2) {
        this.warehouseLocation = value
      }
      this.toast = Toast.loading({
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
      this.toast = Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      this.selectedTab = name
      this.onRefresh()
    },
    onClear() {
      // 复用刷新接口
      // this.searchParams.reimburseName = ''
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
      switch (this.checkState) {
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
        taskStartTime: startTime,
        taskEndTime: this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.warehouseLocation != '全部类型') {
        searchParams.taskType = this.warehouseLocation
      }
      switch (this.selectedTab) {
        case '执行中':
          searchParams.taskStatus = '1'
          break
        case '未巡检':
          searchParams.taskStatus = '0'
          break
        case '已完成':
          searchParams.taskStatus = '2'
          break
        default:
          searchParams.taskStatus = '1'
          break
      }
      queryTaskList(searchParams)
        .then((res) => {
          if (res.data) {
            console.log('巡检任务', res);
            this.taskList = [...this.taskList, ...res.data.records]
            console.log('this.taskList: ', this.taskList);
            // this.taskList.push(JSON.parse(JSON.stringify(this.taskList[0])))
            // this.taskList[this.taskList.length - 1].taskType = '管廊'
            // this.taskList.push({
            //   id:'122333',
            //   taskType: '管廊',
            //   taskName: '2023年2月管廊巡检',
            //   taskEndTime: "2023-02-28 12:00:00",
            // })
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
          this.toast.close()
          this.toast = null
          this.loading = false
        })
    },
    /*打开新增页面*/
    add() {
      this.$router.push({
        name: 'CommonOneFormIndex',
        params: { type: 'add' }
      })
    },

    /*已完成任务，打开任务查看页面*/
    handleView(item) {
      if (item.taskType === '人巡' || item.taskType === '车巡') {
        this.$router.push({
          name: 'InspectionManage',
          query: {
            isView: true,
            taskId: item.id,
            taskType: item.taskType
          },
        })
        return
      }
      if (item.taskType === '管廊' || item.taskType === '管廊巡检') {
        // 任务数据存储在本地，避免数据缺失
        localStorage.setItem('galleryTaskData', null)
        localStorage.setItem('galleryTaskData', JSON.stringify(item))
        // 已完成的管廊巡检任务，点进去，不是进入GalleryInspection，
        // 而是直接进入StartGalleryInspection，同时用 isView 控制一些按钮可点击状态
        this.$router.push({
          name: 'StartGalleryInspection',
          query: {
            isView: true,
          },
        })
      }
    },
    // 转发
    transmitEvent(item) {
      console.log(item)
    },
    // 开始
    // 对于未巡检的任务第一次进入巡检任务需要更新任务状态
    startEvent(item) {
      this.execute(item, true)
    },
    //执行
    execute(item, isNew = false) {
      if (item.taskType === '人巡' || item.taskType === '车巡') {
        this.$router.push({
          name: 'InspectionManage',
          query: {
            name: '执行',
            taskId: item.id,
            isNew: isNew,
            taskType: item.taskType
          },
        })
        return
      }
      if (item.taskType === '管廊' || item.taskType === '管廊巡检') {
        // 任务数据存储在本地，避免数据缺失
        localStorage.setItem('galleryTaskData', null)
        localStorage.setItem('galleryTaskData', JSON.stringify(item))
        this.$router.push({
          name: 'GalleryInspection',
        })
      }
    },

    /*打开编辑*/
    handleEdit(row) {
      this.$router.push({
        name: 'CommonOneFormIndex',
        params: {
          type: 'edit',
          id: row.id,
        },
      })
    },
    /*打开编辑*/
    handleDelete(row) {
      Dialog.confirm({
        title: '提示',
        message: '确认是否删除?',
      })
        .then(() => {
          let idList = []
          idList.push(row.id)

          deleteCommonForm(idList).then((res) => {
            if (res.status) {
              Toast('删除成功')
              this.onRefresh()
            } else {
              Toast(res.message)
            }
          })
        })
        .catch(() => { })
    },
  },
}
</script>
<style lang="less" scoped>
// ecf4ff
//隐藏滚动条
&::-webkit-scrollbar {
  display: none; //Chrome | Safari
}

.main {
  background-color: #055ffc !important;
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
      left: var(--bgSrcLeft);
    }

    .warn-icon {
      position: absolute;
      top: 20px;
      width: 20px;
      height: 20px;
      background-color: #ff4d4f;
      border-radius: 50%;
      z-index: 99;
    }
    .warnMyNotStart {
      left: 350px;
    }
    .warnWorking {
      left: 520px;
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

/deep/.fm-nav-bar {
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
