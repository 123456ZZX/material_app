<template>
  <div class="main">
    <img :src="require('@/assets/img/blueBg.png')" class="main-bg" />
    <fm-nav-bar title="调度指令" left-arrow @click-left="$router.go(-1)" @click-right="addNew">
      <template #right>
        <fm-popover :visible.sync="showPopover" trigger="click" :actions="actions" @select="onSelect"
          placement="bottom-end">
          <template #reference>
            <i class="fm-icon fm-icon-plus"></i>
          </template>
        </fm-popover>
      </template>
    </fm-nav-bar>
    <div class="content">
      <div style="overflow-y: scroll;">
        <div class="classify">
          <div class="classify-item" :style="orderStatus == '' ? { 'background': '#DDE8F9' } : {}"
            @click="changeSelect('')">
            <div class="item">
              <span class="key" :style="orderStatus == '' ? { 'color': '#1B67D8' } : {}">全部</span>
              <span class="value" :style="orderStatus == '' ? { 'color': '#1B67D8' } : {}">{{ totalAll }}</span>
            </div>
          </div>
          <div class="classify-item" :style="orderStatus == '2' ? { 'background': '#DDE8F9' } : {}"
            @click="changeSelect('2')">
            <div class="item">
              <span class="key" :style="orderStatus == '2' ? { 'color': '#1B67D8' } : {}">已发送</span>
              <span class="value" :style="orderStatus == '2' ? { 'color': '#1B67D8' } : {}">{{ totalPause
              }}</span>
            </div>
          </div>
          <div class="classify-item" :style="orderStatus == '3' ? { 'background': '#DDE8F9' } : {}"
            @click="changeSelect('3')">
            <div class="item">
              <span class="key" :style="orderStatus == '3' ? { 'color': '#1B67D8' } : {}">已拒绝</span>
              <span class="value" :style="orderStatus == '3' ? { 'color': '#1B67D8' } : {}">{{ totalHanding }}</span>
            </div>
          </div>
          <div class="classify-item" :style="orderStatus == '4' ? { 'background': '#DDE8F9' } : {}"
            @click="changeSelect('4')">
            <div class="item">
              <span class="key" :style="orderStatus == '4' ? { 'color': '#1B67D8' } : {}">办理中</span>
              <span class="value" :style="orderStatus == '4' ? { 'color': '#1B67D8' } : {}">{{ totalEd }}</span>
            </div>
          </div>
          <div class="classify-item" :style="orderStatus == '5' ? { 'background': '#DDE8F9' } : {}"
            @click="changeSelect('5')">
            <div class="item">
              <span class="key" :style="orderStatus == '5' ? { 'color': '#1B67D8' } : {}">已完成</span>
              <span class="value" :style="orderStatus == '5' ? { 'color': '#1B67D8' } : {}">{{ totalAbsort
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="main-container">
        <template>
          <!-- 下拉刷新 -->
          <fm-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
            <!-- 无数据 -->
            <template v-if="tableData.length == 0 && !loading">
              <div class="no-data-img">
                <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
              </div>
              <div class="no-data-text">
                <div class="no-data-text-descripe">暂无数据</div>
              </div>
            </template>
            <!-- 列表 -->
            <fm-list v-else v-model="loading" :finished="finished" finished-text="我们是有底线的" @load="onLoad" :offset="0">
              <div>
                <div v-for="(item, index) in tableData" :key="index">
                  <!-- 未巡检卡片 -->
                  <InfoCard :cardInfo="item" @dealOrder="goToDetail">
                  </InfoCard>
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
import axios from 'axios';
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
import InfoCardWorking from '../InfoCardWorking.vue'
// 未巡检、已完成信息卡片
import InfoCard from './InfoCard.vue'
// 下拉选择框
import Select from '../Select.vue'
import * as api from '../../api'

export default {
  name: 'dispatchOrder',
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
    InfoCard,
    Select,
  },
  data() {
    return {
      actions: [
        {
          text: '调度指令'
        }
      ],
      showPopover: false,
      orderStatus: '',
      tableData: [],
      pageSize: 50,
      refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
      loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
      finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
      templateCode: 'dispatch_template',
      smallType: ['pressure_update'],
      formToken: '',
      header: {},
      accessToken: this.$storage.get('access_token'),
      totalAll: 0,
      totalPause: 0,
      totalHanding: 0,
      totalEd: 0,
      totalAbsort: 0,
    }
  },
  created() {
  },
  mounted() {
    // Toast.loading({
    //   message: '加载中...',
    //   forbidClick: true,
    //   duration: 0
    // })
    // let params = {
    //   "sysCode": "outwork",
    //   "smallType": this.smallType,
    //   "page": {
    //     "current": this.currentPage,
    //     "size": this.pageSize
    //   }
    // }
    // 获取header，查询工单用
    axios({
      url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/userCenterApi/sso/tokenByToken', //61环境--开发云--绿色vpn
      method: 'post',
      params: {
        token: this.accessToken
      },
      headers: {
        'Authorization': 'Basic b3V0d29yazp3cGcyMDIw'
      }
    }).then(res => {
      if (res.status == 200) {
        this.formToken = res.data.resultData.token
        this.header = {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + this.formToken
        }
        this.onRefresh()
      }
    })
  },
  methods: {
    onSelect() {
      this.$router.push({
        name: 'addDispatchOrder',
        query: { mode: 'add' }
      })
    },
    goToDetail(id) {
      this.$router.push({
        name: 'addDispatchOrder',
        query: { mode: 'deal', id: id }
      })
    },
    changeSelect(type) {
      this.orderStatus = type
      // Toast.loading({
      //   message: '加载中...',
      //   forbidClick: true,
      //   duration: 0
      // })
      this.pageReset()
      this.loading = true
      this.finished = false
      let extParam = {}
      // 调令状态
      this.orderStatus ? extParam['status'] = this.orderStatus : ''
      let params = {
        "sysCode": "outwork",
        "smallType": this.smallType,
        "extParam": extParam,
        // "ticketStatus": type,
        "page": {
          "current": this.currentPage,
          "size": this.pageSize
        }
      }
      this.getTableList(params)
    },
    addNew() {
      this.showPopover = true
    },

    // 重置列表page,list值
    pageReset() {
      this.currentPage = 1
      this.tableData = []
    },
    // 页面加载/下拉刷新
    onRefresh() {
      // 调令状态
      this.orderStatus = ''
      this.pageReset()
      this.loading = true
      this.finished = false
      let params = {
        "sysCode": "outwork",
        "smallType": this.smallType,
        "page": {
          "current": this.currentPage,
          "size": this.pageSize
        }
      }
      this.getTableList(params)
      this.getAllList()
    },
    // 列表加载更多
    onLoad() {
      this.currentPage = this.currentPage + 1
      let params = {
        "sysCode": "outwork",
        "smallType": this.smallType,
        "page": {
          "current": this.currentPage,
          "size": this.pageSize
        }
      }
      this.getTableList(params)
    },
    // 获取工单状态
    getAllList() {
      // formValue中的status字段
      // status == 2;  已发送
      // status == 3;  已拒绝
      // status == 4;  办理中
      // status == 5;  已完成
      let params = {
        "sysCode": "outwork",
        "smallType": this.smallType,
        "page": {
          "current": 1,
          "size": 9999
        }
      }
      axios({
        url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/outworkapi/ticketStatisticClient/getTicketList',//所有的--ok
        method: 'post',
        data: params,
        headers: this.header,
      }).then(res => {
        console.log('getTableData-res: ', res);
        if (res.status == 200) {
          let allTicket = res.data.resultData.records

          //   ''"> 全部:{{ totalAll }}
          //   2">已发送:{{ totalPause }}
          //   3">已拒绝:{{ totalHanding }}
          //   4">办理中:{{ totalEd }}
          //   5">已完成:{{ totalAbsort }}

          this.totalAll     = allTicket.length
          this.totalPause   = allTicket.filter(item => item.formValue?.status == '2').length
          this.totalHanding = allTicket.filter(item => item.formValue?.status == '3').length
          this.totalEd      = allTicket.filter(item => item.formValue?.status == '4').length
          this.totalAbsort  = allTicket.filter(item => item.formValue?.status == '5').length

          this.finished = true
          this.refreshing = false
          this.loading = false
        }
      })
    },
    // 获取列表数据
    getTableList(params) {
      axios({
        url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/outworkapi/ticketStatisticClient/getTicketList',//所有的--ok
        method: 'post',
        data: params,
        headers: this.header,
      }).then(res => {
        console.log('getTableData-res: ', res);
        if (res.status == 200) {
          this.tableData = res.data.resultData.records
          console.log("表格数据",  this.tableData)
          this.finished = true
          this.refreshing = false
          this.loading = false
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
// ecf4ff
::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}

.main {
  background-color: #055ffc !important;
  height: 100%;
  display: flex;
  flex-direction: column;

  .main-bg {
    position: absolute;
    width: 100%;
  }

  .content {
    position: relative;
    background: linear-gradient(180deg, #E5F2FF 0%, #F6F8FA 25%, #F5F7F9 100%);
    height: calc(100% - 46px);
    width: 100%;
    margin-top: 24px;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;

    .classify {
      min-width: 118%;
      width: auto;
      height: 72px;
      margin: 24px 30px;
      display: flex;
      justify-content: space-between;

      .classify-item {
        width: auto;
        min-width: 100px;
        background: #FFFFFF;
        border-radius: 36px;
        box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
        padding: 16px 32px;

        .item {
          width: auto;
          display: flex;

          .key {
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            line-height: 38px;
          }

          .value {
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            line-height: 38px;
            margin-left: 6px;
          }
        }
      }
    }

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
  // background-color: #d4e8fc;
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
