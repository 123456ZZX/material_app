<!--
 * @Author: xie_sm
 * @Date: 2022-03-16 08:57:40
 * @LastEditors: song_kl
 * @LastEditTime: 2023-02-13 09:09:06
 * @FilePath: \mobile-template\src\views\Home\index.vue
 * @Description:
 *
-->
<template>
  <div class="index-container" ref="app">
    <div
      class="header-container"
      :style="'padding-top:' + statusBarHeight + 'px'"
    >
      <fm-cell class="topCell">
        <!-- 使用 icon 插槽来自定义左侧图标 -->
        <template #icon>
          <div class="logo-pic"></div>
        </template>
        <!-- 使用 title 插槽来自中间内容 -->
        <template #title>
          <div class="title"></div>
        </template>
        <!-- 使用 default 插槽来自定义右侧 value 的内容 -->
        <template #default>
          <fm-popover
            :visible.sync="showPortalFlag"
            trigger="click"
            :actions="portals"
            @select="onSelect"
            placement="bottom-start"
          >
            <template #reference>
              <div class="locationSide">
                <i class="locationIcon"></i>
                <fm-button text>{{ portal.name }}</fm-button>
              </div>
            </template>
          </fm-popover>
          <!-- <fm-popup round :visible.sync="showPortalFlag">
            <div class="select-portal" v-for="(item, index) in portals" :key="index" @click="changePortal(item)">
              {{ item.name }}
            </div>
          </fm-popup> -->
        </template>
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <!-- 隐藏扫一扫 -->
          <!-- <i class="fm-icon-scan rightIcon"></i> -->
        </template>
      </fm-cell>
      <!-- 轮播图区域 -->
      <!-- <fm-swipe class="my-icons" :autoplay="3000">
        <fm-swipe-item v-for="(image, index) in images" :key="index">
          <img :src="image" style="width: 100%; height: 100%" />
        </fm-swipe-item>
      </fm-swipe> -->
      <!-- 图标宫格区域 -->
      <div class="my-icons">
        <fm-grid :column-num="4" class="grid">
          <fm-grid-item
            v-for="(item, index) in quickAccessArea"
            :key="index"
            :icon="item.src"
            :text="$t(item.title)"
            @click="goTo(item.path)"
          />
          <!-- 更多按钮 -->
          <fm-grid-item
            :icon="moreItem.src"
            :text="$t(moreItem.title)"
            @click="goTo(moreItem.path)"
          />
        </fm-grid>
      </div>
    </div>
    <!-- <div class="empty"></div> -->
    <!-- 骨架屏-->
    <div>
      <fm-cell>
        <template #title>
          <div class="topBox">
            <div class="noticeTitleIcon"></div>
            <div>消息通知</div>
          </div>
        </template>
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <div v-if="msgStatus" class="right" @click="goToNewsList">
            <span class="right-more">{{ listNumber }}条新消息</span>
            <i class="fm-icon-arrow right-icon"></i>
          </div>
        </template>
      </fm-cell>
    </div>
    <div v-if="!msgStatus" class="tips">暂无消息！</div>
    <!-- 消息列表，只展示3条未读消息 -->
    <div
      v-if="msgStatus"
      :class="
        quickAccessArea.length > 3
          ? 'small-bottom-container'
          : 'big-bottom-container'
      "
    >
      <!-- 列表项 -->
      <div
        class="list-item"
        v-for="(item, index) in formList"
        :key="index"
        @click="goToNewsInfo(item)"
      >
        <div class="list-item-top">
          <!-- <img class="news-img" :src="require(`@/assets/img/${item.img}.jpg`)" /> -->
          <span class="commonWidth leftWidth">{{ item.title }}</span>
          <span class="commonWidth centerWidth">{{ item.msgBody }}</span>
          <span class="commonWidth rightWidth">{{ item.time }}</span>
        </div>
      </div>
    </div>
    <div>
      <fm-cell>
        <template #title>
          <div class="bottomBox">
            <div class="calendarTitleIcon"></div>
            <div>任务日历</div>
          </div>
          <!-- 日历滑块，显示当前周及前后一周 -->
          <Calendar @dateClick="dateClick"></Calendar>
          <div
            :class="
              msgStatus
                ? 'messageBox messageBoxheight1'
                : 'messageBox messageBoxheight2'
            "
          >
            <div v-if="messageList.length > 0">
              <div
                v-for="(item, index) in messageList"
                :key="index"
                class="messageStyle"
                @click="execute(item)"
              >
                <img
                  class="leftNumber"
                  :src="require('@/assets/img/homepage/时间_time.png')"
                />
                <div class="contentBg">
                  <div class="rightInfo">{{ item.taskName }}</div>
                </div>
              </div>
            </div>
            <div v-if="taskList.length > 0">
              <div
                v-for="(item, index) in taskList"
                :key="index"
                class="messageStyle"
                @click="execute1(item)"
              >
                <img
                  class="leftNumber"
                  :src="require('@/assets/img/homepage/时间_time.png')"
                />
                <div class="contentBg">
                  <div class="rightInfo">{{ item.taskName }}</div>
                </div>
              </div>
            </div>
            <div class="taskState" v-if="status">
              <img src="@assets/img/homepage/暂无数据.png" alt="" />
              <div>暂无任务</div>
            </div>
          </div>
        </template>
      </fm-cell>
    </div>
  </div>
</template>
<script>
import * as api from './api'
import { mapGetters } from 'vuex'
import {
  Image,
  Grid,
  GridItem,
  Swipe,
  SwipeItem,
  Cell,
  Icon,
  Toast,
  Tab,
  Tabs,
} from 'fawkes-mobile-lib'
// import { getToken } from "./SmartSite/api";
// import { encryptSM4 } from "@/utils/sm4";
import { ALL_APP_LIST } from '@/common/constant'
import { SET_QUICK_ACCESS_AREA } from '@/store/Mutation/mutationTypes'
import { STATUS_BAR_HEIGHT } from '@/store/State/stateTypes'
import { eventBackButton, exitApp } from '@/utils/app'
// 底部日历组件
import Calendar from './Calendar.vue'
import request from '@/utils/request'
import { CHANGE_PORTAL, UPDATE_USER } from '@/store/Action/actionTypes'
import eventBus from '@/utils/bus.js'
import _cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'IndexPage',
  components: {
    [Image.name]: Image,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Cell.name]: Cell,
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    Calendar,
  },
  computed: {
    ...mapGetters(['quickAccessArea']),
    userName() {
      return this.$storage.get('username')
    },
    statusBarHeight() {
      return this.$store.state[STATUS_BAR_HEIGHT]
    },
    portal() {
      return this.$store.state.portal
    },
    portals() {
      let arr = this.$store.state?.portals || []
      if (arr.length == 0) {
        return []
      }
      let result = arr.map((item) => {
        return {
          text: item.name,
          value: item,
        }
      })
      return result
    },
  },
  data() {
    return {
      upLoadCoordInterval: null, //定时获取并上传人员定位
      status: true,
      msgStatus: true,
      moreItem: {
        title: '更多',
        src: require('@assets/img/homepage/更多.png'),
        path: '/more',
      },
      images: [
        require(`@assets/img/homepage/img_banner1.png`),
        require(`@assets/img/homepage/img_banner2.png`),
        require(`@assets/img/homepage/img_banner3.png`),
      ],
      active: 0,
      // 新消息条数
      listNumber: 0,
      formList: [],
      messageList: [],
      taskList: [],
      showPortalFlag: false,
    }
  },
  watch: {},
  mounted() {
    this.initJPush()
    this.init()
    this.upLoadCoordInterval = setInterval(this.getUserPosition, 20 * 1000) //获取人员定位
    // 初次进入默认菜单,若本地缓存存在应用列表
    if (this.$storage.get('quickAccessArea')) {
      this.$store.commit(
        SET_QUICK_ACCESS_AREA,
        JSON.parse(this.$storage.get('quickAccessArea'))
      )
    } else {
      // 若无，从全部应用中获取默认应用
      this.$store.commit(
        SET_QUICK_ACCESS_AREA,
        ALL_APP_LIST.filter((app) => app.isFixed)
      )
    }
    // 因屏蔽了视频监控模块而注释
    // let data = {
    //   grant_type: "password",
    //   scope: "all",
    //   username: "zhu_yp2",
    //   password: encryptSM4("shangyu@2021!@#"),
    // };

    // getToken(data).then((res) => {
    //   this.$storage.set("longtang_token", res.access_token);
    // });
    // 监听网页关闭并执行XX操作
    window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
    window.addEventListener("unload", (e) => this.unloadHandler(e));
  },

  activated() {
    console.log('首页activated')
    // 更新消息已读状态
    this.getMsgList();
    // 页面激活时移除默认的返回上一级路由处理事件，设置退出应用事件
    document.removeEventListener('backbutton', this.$back, false)
    document.addEventListener('backbutton', eventBackButton, false)
    // this.upLoadCoordInterval = setInterval(this.getUserPosition, 20 * 1000) //获取人员定位
  },
  deactivated() {
    console.log('首页deactivated')
    // 页面隐藏时移除退出应用事件，恢复默认的返回上一级路由的处理事件
    document.removeEventListener('backbutton', eventBackButton, false)
    document.removeEventListener('backbutton', exitApp, false)
    document.addEventListener('backbutton', this.$back, false)
    // clearInterval(this.upLoadCoordInterval)
  },
  beforeDestroy() {
    this.upLoadCoordInterval && clearInterval(this.upLoadCoordInterval)
    window.removeEventListener("beforeunload", (e) =>this.beforeunloadHandler(e));
    window.removeEventListener("unload", (e) =>this.unloadHandler(e));
    // 移除消息详情页返回时发送的事件
    eventBus.$off("refreshMsgStatus");
  },
  methods: {
    // 页面关闭之前，触发提示框,调用接口，为后台取消，该人员的定时任务
    beforeunloadHandler(e) {
      // 移除在线人员信息
      request({
            url: '/xasw-pipe-operation/remove/onlineLocation',
            method: 'delete',
          }).then((res) => {
            console.log('stop-ghuytttttttttttttttttttttttttttttttt: ', res)
       }) 
       if (e) {
            e = e || window.event;
            if (e) {
              e.returnValue = "关闭前提示";
            }
          }
        return "关闭";
    },
    unloadHandler(e){ },
    async initJPush() {
      window.JPush.init()
      this.getRegistrationID()
      document.addEventListener(
        'jpush.receiveNotification',
        this.onReceiveNotification,
        false
      )
      document.addEventListener(
        'jpush.openNotification',
        this.onOpenNotification,
        false
      )
      document.addEventListener(
        'jpush.receiveMessage',
        this.onReceiveMessage,
        false
      )
    },
    onReceiveNotification(event) {
      try {
        var alertContent
        if (yuanchu.device.platform == 'Android') {
          alertContent = event.alert
        } else {
          alertContent = event.aps.alert
        }
        // alert('接受到消息通知: ' + alertContent)
      } catch (exception) {
        console.log(exception)
      }
    },
    onOpenNotification(event) {
      try {
        var alertContent
        if (yuanchu.device.platform == 'Android') {
          alertContent = event.alert
        } else {
          alertContent = event.aps.alert
        }
        // alert('用户点击消息通知: ' + alertContent)
      } catch (exception) {
        console.log('JPushPlugin:onOpenNotification' + exception)
      }
    },
    onReceiveMessage(event) {
      try {
        var message
        if (yuanchu.device.platform == 'Android') {
          message = event.message
        } else {
          message = event.content
        }
        // alert('接受到消息: ' + message)
      } catch (exception) {
        console.log('JPushPlugin:onReceiveMessage-->' + exception)
      }
    },
    getRegistrationID() {
      window.JPush.getRegistrationID(this.onGetRegistrationID)
    },
    onGetRegistrationID(data) {
      try {
        console.log('JPushPlugin:registrationID is ' + data)
        if (data.length == 0) {
          // 如果获取到为空，重新获取
          var t1 = window.setTimeout(this.getRegistrationID, 1000)
        }else {
          let params = {
            appid: "1620232322541862913",
            registrationId: data,
            userName: this.$store.state.userInfo.userName
          }
          api.bindEquipment(params)
        }
        console.log('registrationID: ' + data)
        
      } catch (exception) {
        console.log(exception)
      }
    },
    init() {
      this.nowTime = this.$dayjs().format('YYYY-MM-DD 00:00:00')
      this.getMsgList()
      this.dateClick(this.nowTime)
    },
    showSelectPortal() {
      this.showPortalFlag = true
    },
    onSelect(val) {
      this.$store.dispatch(CHANGE_PORTAL, val.value)
      this.$store.dispatch(UPDATE_USER, val.value.id)
      this.init()
    },
    // changePortal(portal) {
    //   this.$store.dispatch(CHANGE_PORTAL, portal)
    //   this.$store.dispatch(UPDATE_USER, portal.id)
    //   this.showPortalFlag = false
    //   this.init()
    // },
    //养护跳转
    execute(item) {
      console.log('item: ', item);
      this.$router.push({
        name: 'TaskDetail',
        query: {
          name: '执行',
          taskId: item.id,
          data: JSON.stringify(item),
          isView: item.status == '2' ? true : false, // 养护任务状态0:待执行，1:执行中，2:已完成
        },
      })
      return
    },
    //巡检跳转
    execute1(item) {
      if (item.taskType === '人巡' || item.taskType === '车巡') {
        this.$router.push({
          name: 'InspectionManage',
          query: {
            name: '执行',
            taskId: item.id,
            isNew: false,
            taskType: item.taskType,
          },
        })
        return
      }
    },
    // 获取消息，首页只展示3条数据，所以此处只请求5条未读消息数据
    getMsgList() {
      // 置空默认数据
      this.formList = []
      this.listNumber = 0
      this.msgStatus = false

      let params = {
        currentPage: 1,
        pageSize: 5,
        status: -1, // 状态(0:已读，-1:未读)
        // searchValue: '', // 消息内容
        // startDate: '', // 开始日期
        // endDate: '', // 结束日期
        // type: '' // 类型(100:公告，200:业务(通知)，201:告警,202:工单,203:事件,300:私信)(支持xxx,xxx格式)(支持xxx-xxx格式)
      }
      api.getMsgList(params).then((res) => {
        if (res.data.list.length == 0) {
          this.msgStatus = false
        } else {
          this.msgStatus = true
          this.listNumber = res.data.total
          this.formList = res.data.list.slice(0, 3)
          // console.log('this.formList', _cloneDeep(this.formList));
          this.formList.forEach((item) => {
            let reduceTime =
              new Date().getTime() - new Date(item.updateDate).getTime()
            if (reduceTime < 60 * 1000) {
              // 一分钟以内
              item.time = '刚刚'
            } else if (reduceTime < 60 * 60 * 1000) {
              // 一小时之内
              item.time = Math.floor(reduceTime / 60 / 1000) + '分钟前'
            } else {
              // 一小时之外
              item.time = item.updateDate.slice(0, 10)
            }
          })
        }
      })
    },
    goTo(path) {
      if (path != '') {
        this.$router.push(path)
      } else {
        Toast('开发中')
      }
    },
    // 跳转新闻列表
    goToNewsList() {
      // 跳转到消息分类列表
      this.$router.push('/newsList')
    },
    // 跳转新闻详情
    goToNewsInfo(item) {
      // 跳转到消息分类列表
      this.$router.push('/newsList')
    },
    // 点击日历时间回调
    dateClick(date) {
      this.messageList = []
      this.taskList = []
      let dateTemp = date.slice(0, 11) + '00:00:00'
      api.getTaskName({ date: dateTemp }).then((res) => {
        if (
          res.data.maintainTasks.length == 0 &&
          res.data.taskList.length == 0
        ) {
          this.status = true
        } else {
          this.status = false
          res.data.maintainTasks.forEach((item) => {
            this.messageList.push(item)
          })
          res.data.taskList.forEach((item) => {
            this.taskList.push(item)
          })
        }
      })
    },
    // 获取定位
    getUserPosition() {
      if (typeof yuanchu != 'undefined') {
        yuanchu.locationAMap.requestSingleLocation(
          ['1'],
          (res) => {
            let userPosition = [res.longitude, res.latitude]
            this.upPosition(userPosition)
          }
        )
      } else {
      }
    },
    // 上传定位
    upPosition(userPosition) {
      let locationInfo = JSON.stringify(userPosition)
      request({
        url: '/xasw-pipe-operation/cache/onlineLocation',
        method: 'POST',
        params: {
          locationInfo: locationInfo,
        },
      }).then((res) => {
        console.log('upPosition-res: ', res)
      })
    }
  },
  
}
</script>
<style lang="less" scoped>
// 金刚区
/deep/.fm-icon__image {
  height: 120px !important;
  width: 120px !important;
}

.topCell {
  height: 140px;
  display: flex;
  align-items: center;
}

// 顶部定位部分
/deep/.fm-cell__value {
  margin-right: 26px;
  flex: 3;

  .fm-popup {
    width: 300px;

    .select-portal {
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.locationSide {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  font-size: 28px;
  height: 60px;
  padding: 8px 20px;

  .locationIcon {
    width: 44px;
    height: 44px;
    background-image: url('~@/assets/img/homepage/location.png');
    background-repeat: no-repeat;
    background-size: 100%;
    margin-right: 8px;
  }
  /deep/ .fm-button--text {
    color: #ffffff;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
}

.rightIcon {
  color: #fff;
  font-size: 60px;
}

.title {
  font-weight: bold;
  font-size: 36px;
  color: #fff;
}

.logo-pic {
  width: 240px;
  height: 79px;
  // margin-left: 28px;
  background: url('~@/assets/img/login/xaswLogo.png');
  background-repeat: no-repeat;
  background-size: 100%;
}

/deep/.fm-grid-item__content::after {
  border: none;
}

/deep/.fm-grid-item__content {
  padding-top: 10px;
}

/deep/.fm-cell::after {
  border: none;
}

.index-container {
  background-color: #fff;
  height: calc(100% - 98px - env(safe-area-inset-bottom));
  height: calc(100% - 98px - constant(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
}

.header-container {
  background-image: url('../../assets/img/homepage/header.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  padding-bottom: 10px;
}

.my-icons {
  width: 670px;
  // height: 405px;
  margin: 0 auto;
  // margin-top: 10px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 0 10px #ccc;
  background-color: rgb(255, 255, 255);
}

.grid {
  text-align: center;
}

/deep/.fm-grid-item__text {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/deep/.fm-grid-item__icon + .fm-grid-item__text {
  margin-top: 0px;
}

.tab-active {
  color: #027aff;
  text-align: center;
  font-weight: 500;
  font-size: 32px;
}

.tab-active::after {
  content: '';
  display: block;
  position: absolute;
  bottom: 10px;
  height: 3px;
  width: 70px;
  background-color: #027aff;
}

.big-bottom-container {
  // height: calc(100% - 630px);
  overflow: auto;
  // border:1px solid saddlebrown;
}

.small-bottom-container {
  height: calc(100% - 910px);
  overflow: auto;
}

.topBox {
  font-size: 32px;
  font-weight: 600;
  display: flex;

  .noticeTitleIcon {
    width: 44px;
    height: 44px;
    background-image: url('~@/assets/img/homepage/notice.png');
    background-repeat: no-repeat;
    background-size: 100%;
    margin-right: 20px;
  }
}

.bottomBox {
  font-size: 32px;
  font-weight: 600;
  display: flex;

  .calendarTitleIcon {
    width: 44px;
    height: 44px;
    background-image: url('~@/assets/img/homepage/日历.png');
    background-repeat: no-repeat;
    background-size: 100%;
    margin-right: 20px;
  }
}

.messageBoxheight1 {
  height: 200px;
}

.messageBoxheight2 {
  height: 400px;
}

.messageBox {
  width: 100%;
  overflow: auto;
  margin-top: 10px;
  // background-color: red;

  .messageStyle {
    display: flex;
    height: 90px;
    align-items: baseline;
    padding-bottom: 30px;
    font-size: 28px;

    .leftNumber {
      margin: auto 0;
      margin-left: 44px;
      width: 40px;
      height: 40px;
      // text-align: center;
      // line-height: 42px;
      // color: #BFBFBF;
      // background-color: #f6f6f6;
      // border-radius: 50%;
    }

    .contentBg {
      width: calc(100% - 114px);
      height: 90px;
      background: #f7f9fc;

      .rightInfo {
        margin-top: 25px;
        margin-left: 30px;
        height: 40px;
        line-height: 40px;
        height: 37px;
        font-size: 28px;
        font-family: MicrosoftYaHei;
        color: #191919;
      }
    }
  }
}

.show-more {
  color: #555555;
  font-size: 28px;
}

.more-box {
  line-height: 1.6;
  width: 100%;
}

/deep/.fm-cell__title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 2;
}

.fm-cell {
  background-color: transparent;
  align-items: center;
}

/deep/.fm-swipe__indicator {
  background-color: #bbb;
  width: 16px;
  height: 16px;
  opacity: 1;
}

/deep/.fm-swipe__indicator--active {
  background-color: #027aff;
  opacity: 1;
}

.list-item {
  padding: 20px 20px 20px 40px;
  // background-color: rgb(252, 115, 115);
}

.news-img {
  width: 180px;
  height: 100%;
  border-radius: 8px;
  margin-right: 20px;
}

.list-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28px;
  // background-color: red;

  .commonWidth {
    // display: flex;
    // justify-content: flex-start;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .leftWidth {
    font-size: 28px;
    font-family: PingFangSC-Medium, PingFang SC;
    width: 21%;
    font-weight: 600;
    color: #333333;
  }

  .centerWidth {
    font-size: 28px;
    font-family: PingFangSC-Medium, PingFang SC;
    width: 56%;
    color: #555555;
  }

  .rightWidth {
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 21%;
  }
}

[class*='fm-hairline']::after {
  border: none;
}

/deep/.fm-grid-item__text {
  font-size: 28px;
  color: #333333;
}

/deep/.fm-grid {
  align-items: flex-start;
}

/deep/.fm-icon {
  height: 120px;
  margin-right: 0 !important;
}

.fm-icon-arrow .fm-icon-scan {
  height: 48px;
  margin-right: 0 !important;
}

.empty {
  height: 16px;
  background-color: #f2f3f4;
}

.right {
  display: flex;
  align-items: center;
}

.right-more {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 400;
  color: #555555;
}

.right-more::after {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: red;
  border-radius: 50%;
}

.right-icon {
  width: 42px;
  color: #999999;
}

.tips {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 202px;
  font-size: 24px;
  font-family: MicrosoftYaHei;
  color: #999999;
}

.taskState {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-family: MicrosoftYaHei;
  color: #999999;

  img {
    width: 100%;
  }
}
</style>
