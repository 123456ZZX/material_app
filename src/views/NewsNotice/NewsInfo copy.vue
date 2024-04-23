<template>
  <div class="NewsInfoStyle">
    <fm-nav-bar :title="routeData.msgTitle" left-arrow @click-left="onClickLeft">
      <template #left>
        <i class="fm-icon fm-icon-arrow-left" style="font-size: 18px; color: #000 !important"></i>
      </template>
    </fm-nav-bar>

    <fm-search
      v-model="valueText"
      placeholder="请输入消息内容"
      @search="onSearch"
      clearable
      @clear="onClear"
    >
      <template #left-icon>
        <i class="fm-icon fm-icon-search"></i>
      </template>
      <!-- <template #action>
        <div @click.stop="onCancel" class="cancel">取消</div>
      </template> -->
    </fm-search>
    <fm-tabs v-model="active" animated swipeable>
      <fm-tab :label="'未读' + '（' + notReadNum + '）'">
        <div class="main-container">
          <fm-pull-refresh
            v-model="refreshing"
            refresh-layer-color="#4b8bf4"
            success-text="刷新成功"
            @refresh="onRefresh()"
          >
            <fm-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              :offset="0"
            >
              <div class="list">
                <div
                  class="list-item"
                  v-for="(item, index) in formListNot"
                  :key="index"
                  @click="goToNewsInfo(item)"
                >
                  <span class="list-item-title textStyle1">{{ item.title }}</span>
                  <span class="list-item-title textStyle2">{{ item.msgBody }}</span>
                  <span class="list-item-time">{{ item.updateDate }}</span>
                </div>
              </div>
            </fm-list>
          </fm-pull-refresh>
        </div>
      </fm-tab>
      <fm-tab label="已读">
        <div class="main-container">
          <fm-pull-refresh
            v-model="refreshing"
            refresh-layer-color="#4b8bf4"
            success-text="刷新成功"
            @refresh="onRefresh()"
          >
            <fm-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              :offset="0"
            >
              <div class="list">
                <div
                  class="list-item"
                  v-for="(item, index) in formListDone"
                  :key="index"
                  @click="goToNewsInfo(item)"
                >
                  <span class="list-item-title textStyle1" style="color: #999">{{
                    item.title
                  }}</span>
                  <span class="list-item-title textStyle2" style="color: #999">{{
                    item.msgBody
                  }}</span>
                  <span class="list-item-time">{{ item.updateDate }}</span>
                </div>
              </div>
            </fm-list>
          </fm-pull-refresh>
        </div>
      </fm-tab>
    </fm-tabs>
    <fm-dialog :visible.sync="showDialog" :title="viewDialogData.title">
      <div class="textContainer">
        <span class="leftTitle">消息类型：</span>
        <span class="rightText">{{ viewDialogData.msgType | transferEnum('msgTypes') }}</span>
      </div>
      <div class="textContainer">
        <span class="leftTitle">接收时间：</span>
        <span class="rightText">{{ viewDialogData.updateDate }}</span>
      </div>
      <div class="textContainer lastChange">
        <span class="leftTitle">消息内容：</span>
        <span class="rightText">{{ viewDialogData.msgBody }}</span>
      </div>
    </fm-dialog>
  </div>
</template>
<script>
import {
  NavBar,
  Form,
  Field,
  Button,
  Search,
  Cell,
  CellGroup,
  PullRefresh,
  List,
  Sidebar,
  SidebarItem,
  Image,
  Toast,
} from 'fawkes-mobile-lib'
import * as api from '@/views/Home/api.js'
import { updateMsgStatusById } from '@/api/message.js'
import eventBus from '@/utils/bus.js'
export default {
  name: 'NewsNotice',
  components: {
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
    [Search.name]: Search,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    [Image.name]: Image,
    [Toast.name]: Toast,
  },
  data: () => ({
    valueText: '',
    activeKey: 0,
    pageSize: 10,
    refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
    loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
    finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
    formList: [],
    // 未读
    formListNot: [],
    // 已读
    formListDone: [],
    pageNum: 1,
    active: 0,
    showDialog: false,
    viewDialogData: {},
    notReadNum: 0,
    routeData: {},
  }),
  watch: {},
  created() {
    // 从路由中获取参数
    this.routeData = this.$route.query
    console.log('this.routeData', this.routeData)
  },
  mounted() {
    this.onRefresh()
  },
  methods: {
    // 下拉刷新
    onRefresh() {
      // 重置列表page、list值
      this.pageNum = 1
      // 任务列表
      this.formList = []

      this.loading = true
      this.finished = false

      this.getMsgList()
    },
    // 当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true
    onLoad() {
      this.pageNum = this.pageNum + 1
      this.getMsgList()
    },
    // 获取消息
    getMsgList() {
      // 获取全部未读消息
      this.getTotalNotView()

      let params = {
        currentPage: this.pageNum,
        pageSize: 50,
        // status: -1, // 状态(0:已读，-1:未读)
        searchValue: this.valueText, // 消息内容
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        // type: '' // 类型(100:公告，200:业务(通知)，201:告警,202:工单,203:事件,300:私信)(支持xxx,xxx格式)(支持xxx-xxx格式)
      }
      api
        .getMsgList(params)
        .then((res) => {
          if (res.data && res.data.list.length > 0) {
            // 若数据已全部加载完毕，则直接将 finished 设置成 true，展示: 没有更多了
            if (res.data.pageNum >= res.data.pages) {
              this.finished = true
            }
            // 下拉刷新状态
            this.refreshing = false
            this.formList = [...this.formList, ...res.data.list]
            this.formList.forEach((item) => {
              let reduceTime = new Date().getTime() - new Date(item.updateDate).getTime()
              if (reduceTime < 60 * 1000) {
                // 一分钟以内
                item.time = '刚刚'
              } else if (reduceTime < 3600 * 1000) {
                // 一小时之内
                item.time = Math.floor((reduceTime / 60) * 1000) + '分钟前'
              } else {
                item.time = item.updateDate.slice(0, 10)
              }
            })
          } else {
            this.formList = []
          }
        })
        .catch(() => {
          // 若数据已全部加载完毕，则直接将 finished 设置成 true，展示: 没有更多了
          this.finished = true
        })
        .finally(() => {
          if (this.formList.length > 0) {
            this.formListNot = this.formList.filter((item) => item.status == -1)
            this.formListDone = this.formList.filter((item) => item.status == 0)
            console.log('this.formListNot', this.formListNot.length)
            console.log('this.formListDone', this.formListDone.length)
          } else {
            this.formListNot = []
            this.formListDone = []
          }
          Toast.clear()
          this.loading = false
        })
    },
    // 获取全部未读消息
    getTotalNotView() {
      let params = {
        currentPage: 1,
        pageSize: 1000,
        status: -1,
      }
      api.getMsgList(params).then((res) => {
        this.notReadNum = res?.data?.total || 0
      })
    },
    // 点击清除按钮后触发
    onClear() {
      this.onRefresh()
    },
    // 确定搜索时触发
    onSearch() {
      this.onRefresh()
    },
    // 跳转新闻详情
    goToNewsInfo(item) {
      let msgTemplateParam = JSON.parse(item.msgTemplateParam)
      console.log('msgTemplateParam', msgTemplateParam)
      // 通知消息状态
      // status: -1, // 状态(0:已读，-1:未读)
      if (item.status == -1) {
        let params = {
          receiveLogIdList: item.receiveLogId,
          status: 0,
        }
        updateMsgStatusById(params).then((res) => {
          this.onRefresh()
        })
      }

      // 消息来源自威派格
      if (msgTemplateParam.source == 'wpg') {
        // msgTemplateParam = {
        //   "destination": "/topic/message",
        //   "content": "报警平台:管网告警工单【工单编号：20230413000118】，发起节点已办理完结，请及时关注。",
        //   "stepDetailId": "d708ee5bb8eae5d5ef6a50f49e38296a",
        //   "currentUserName": "系统管理员",
        //   "messageType": "done_cc_step",
        //   "ticketNo": "20230413000118",
        //   "stepName": "发起",
        //   "src": "https://xionganwater.cn/outworkApp/#/pages/ticket/detail/index?id=d4cbf93d702f657d48c60cf69ddbb144",
        //   "label": "节点办结抄送",
        //   "source": "wpg",
        //   "title": "节点办结通知",
        //   "stepStatus": "2",
        //   "sendTime": "2023-04-13 10:04:20"
        // }
        this.$router.push({
          path: '/iframeMessage',
          query: {
            src: msgTemplateParam?.src || '',
          },
        })
      }

      // 消息不来源自威派格
      if (!msgTemplateParam?.source || msgTemplateParam?.source != 'wpg') {
        this.viewDialogData = item
        this.showDialog = true
      }
    },
    onClickLeft() {
      this.$router.go(-1)
    },
  },
}
</script>
<style lang="less" scoped>
.NewsInfoStyle {
  background-color: #f5f7f9;
  height: 100%;
}

.main-container {
  height: calc(100vh - 294px);
  overflow: auto;
  margin-top: 14px;
}

.fm-sidebar {
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
  border-bottom: 2px solid #ebedf0;
}

.fm-pull-refresh {
  overflow: visible;
}

.fm-cell-group {
  margin-top: 24px;
}

.list {
  padding: 0 32px;
  background-color: #fff;
}

.list-item {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 180px;
  width: 100%;
  padding: 26px 0;
  border-bottom: 1px solid #eee;
}

.list-item-title {
  font-size: 32px;
  padding-left: 10px;
  // flex-grow: 2;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.textStyle1 {
  font-weight: 600;
}

.textStyle2 {
  font-size: 30px;
  color: #333333;
}

.list-item-time {
  padding-left: 10px;
  font-size: 24px;
  color: #999;
  line-height: 24px;
}

/deep/.fm-dialog__content {
  .textContainer {
    margin: 16px 0;
    display: flex;
    justify-content: flex-start;

    .leftTitle {
      margin-left: 16px;
    }

    .rightText {
      color: #333333;
    }
  }

  .lastChange {
    display: flex;
    flex-direction: column;

    .rightText {
      margin-top: 8px;
      margin-left: 16px;
    }
  }
}
</style>
