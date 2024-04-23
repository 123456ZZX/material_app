<template>
  <div class="NewsInfoStyle">
    <fm-nav-bar :title="routeData.msgTitle" left-arrow @click-left="onClickLeft">
      <template #left>
        <i class="fm-icon fm-icon-arrow-left" style="font-size: 18px; color: #000 !important"></i>
      </template>
    </fm-nav-bar>
    <div class="mainContainer">
      <fm-pull-refresh v-model="topLoading" @refresh="onRefresh">
        <!-- List 组件通过 bottomLoading 和 bottomFinished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 bottomLoading 设置成 true。 -->
        <!-- 此时可以发起异步操作并更新数据，数据更新完毕后，将 bottomLoading 设置成 false 即可。若数据已全部加载完毕，则直接将 bottomFinished 设置成 true 即可。 -->
        <fm-list
          v-model="bottomLoading"
          :bottomFinished="bottomFinished"
          bottomFinished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="(item1, index1) in dealMessageArr" :key="index1" class="cardListArrStyle">
            <div class="timeStyle">{{ item1.time }}</div>
            <div
              v-for="(item2, index2) in item1.seamTimeList"
              :key="index2"
              class="cardContainerStyle"
            >
              <!-- 右上角未读红点，定位 -->
              <span
                v-if="item2.status === -1 && routeData.msgType != 100 && routeData.msgType != 201"
                class="redPoint"
              ></span>
              <div class="topContainer">
                <div class="topTitle">
                  <span class="titleLeft">{{ item2.title }}</span>
                  <span class="timeRight">{{ item2.updateDate.slice(11) }}</span>
                </div>
                <!-- 非告警消息显示内容 -->
                <div v-if="true" class="topContent1">{{ item2.msgBody }}</div>
                <!-- 告警消息显示内容 -->
                <div v-if="false" class="topContent2">
                  <div class="lineStyle">
                    <img src="./imgs/告警数值.png" alt="" />
                    <span class="text1">告警数值</span>
                    <span class="text2" style="color: #ff4d4f">0.21 Mpa（+21%）</span>
                  </div>
                  <div class="lineStyle">
                    <img src="./imgs/告警点位.png" alt="" />
                    <span class="text1">告警点位</span>
                    <span class="text2">奥威路交界口</span>
                  </div>
                  <div class="lineStyle">
                    <img src="./imgs/持续时间.png" alt="" />
                    <span class="text1">持续时间</span>
                    <span class="text2">19分钟</span>
                  </div>
                  <div class="lineStyle">
                    <img src="./imgs/报警时间.png" alt="" />
                    <span class="text1">报警时间</span>
                    <span class="text2">2022-12-23 09:11</span>
                  </div>
                </div>
              </div>
              <!-- 类型(100:公告，200:业务通知，201:告警，202:工单，203:事件，300:私信) -->
              <div
                v-if="routeData.msgType != 100 && routeData.msgType != 201"
                class="bottomDetail"
                @click="viewDetailMsg(item2)"
              >
                <span>查看详情</span>
                <span class="rightIcon"></span>
              </div>
            </div>
          </div>
        </fm-list>
      </fm-pull-refresh>
    </div>
    <fm-dialog :visible.sync="showDialog" :title="viewDialogData.title">
      <div class="textContainer">
        <span class="leftTitle">消息类型：</span>
        <span class="rightText">{{ viewDialogData.msgType | transferEnum('msgTypes') }}</span>
      </div>
      <div class="textContainer">
        <span class="leftTitle">接收时间：</span>
        <span class="rightText">{{ viewDialogData.updateDate }}</span>
      </div>
      <div class="textContainer">
        <span class="leftTitle">消息内容：</span>
        <span class="rightText">{{ viewDialogData.msgBody }}</span>
      </div>
    </fm-dialog>
  </div>
</template>
<script>
import * as api from '@/views/Home/api.js'
import { updateMsgStatusById, updateBatchMsgStatus } from '@/api/message.js'
import { Toast } from 'fawkes-mobile-lib'
import _cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'NewsInfo',
  components: {
    [Toast.name]: Toast,
  },
  data: () => ({
    // 路由参数
    routeData: {},
    topLoading: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true，下拉刷新时会触发 refresh 事件，操作完成后将 v-model 设置为 false，表示加载完成。
    bottomLoading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
    bottomFinished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
    pageNum: 1,
    valueText: '', // 搜索框文本
    showDialog: false, // 是否显示详情弹窗
    viewDialogData: {}, // 查看详情弹窗数据
    // 消息列表
    messageList: [],
    // 根据消息通知时间分类的数组
    dealMessageArr: [{ time: '', seamTimeList: [] }],
    // 未读
    // formListNot: [],
    // 已读
    // formListDone: [],
  }),
  watch: {},
  created() {
    // 从路由中获取参数
    this.routeData = this.$route.query
    console.log('msgType === ', this.routeData.msgType, _cloneDeep(this.routeData))
    // {
    // "msgType": "200",
    // "msgTitle": "业务通知",
    // "msgContent": "报警平台:管网告警工单【工单编号：20230421000263】，发起节点已办理完结，请及时关注。",
    // "msgTime": "2023-04-21 16:07:06",
    // "newMessage": "2508",
    // "msgIcon": "data:image/",
    // "nowCheckedBtn": "未读"
    // }

    if (this.routeData.msgType != 200) {
      // 批量更新站内信状态，将未读改为已读，成功后请求消息列表
      this.clearAllMessage(this.routeData.msgType)
    } else {
      // 请求消息列表
      this.onRefresh()
    }
  },
  methods: {
    // 批量更新站内信状态
    clearAllMessage(msgType) {
      let params = {
        msgTypeList: msgType.toString(), // 站内信类型
        status: 0, // 状态(0:已读,-1:未读,-2:删除)
      }
      updateBatchMsgStatus(params).then((res) => {
        if (res.message === '成功') {
          this.onRefresh()
        }
      })
    },
    // 下拉刷新，下拉时组件会自动设置 topLoading 为 true
    onRefresh() {
      console.log('onRefresh触发')
      // 重置列表
      this.pageNum = 1
      // 任务列表
      this.messageList = []
      // 全部数据加载完毕状态改为false
      this.bottomFinished = false
      this.getMsgList()
    },
    // 当组件滚动到底部时，会触发 load 事件并将 bottomLoading 设置成 true
    onLoad() {
      console.log('onLoad触发')
      this.pageNum = this.pageNum + 1
      if (this.bottomFinished === true) {
        this.bottomLoading = false
        return
      }
      this.getMsgList()
    },
    // 获取消息
    getMsgList() {
      let params = {
        currentPage: this.pageNum,
        pageSize: 15,
        // status: -1, // 状态(0:已读，-1:未读)
        searchValue: this.valueText, // 消息内容
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        type: this.routeData.msgType, // 消息类型
      }
      if (this.routeData.nowCheckedBtn === '未读') {
        params.status = -1
      }
      api
        .getMsgList(params)
        .then((res) => {
          if (res.data && res.data.list.length > 0) {
            console.log('res.data', res.data)

            // 若数据已全部加载完毕，则直接将 bottomFinished 设置成 true，展示: 没有更多了
            if (res.data.pageNum >= res.data.pages) {
              this.bottomFinished = true
            }

            this.messageList = [...(res?.data?.list || []), ...this.messageList]
            // 根据消息的id去重
            this.messageList = this.messageList.reduce((prev, next) => {
              prev.some((item) => item.id === next.id) ? console.log(next.id) : prev.push(next)
              return prev
            }, [])

            console.log('this.messageList', _cloneDeep(this.messageList))

            // 根据消息通知时间分类的数组
            this.dealMessageArr = []

            // 遍历消息列表，将消息按照 updateDate 分组，将相同年月日时分的消息放在同一个数组中，根据时间排序，最后将分组后的数组赋值给 dealMessageArr
            if (this.messageList.length > 0) {
              // 如果msgBody中含有html标签，则删除html标签
              this.messageList.forEach((item) => {
                if (item.msgBody.indexOf('<') !== -1) {
                  item.msgBody = item.msgBody.replace(/<[^>]+>/g, '')
                }
              })

              let tempArr = []
              this.messageList.forEach((item) => {
                let time = item.updateDate.slice(0, 16)
                let index = tempArr.findIndex((item) => item.time === time)
                if (index === -1) {
                  tempArr.push({
                    time: time,
                    seamTimeList: [item],
                  })
                } else {
                  tempArr[index].seamTimeList.push(item)
                }
              })
              this.dealMessageArr = tempArr.sort((a, b) => {
                return new Date(b.time).getTime() - new Date(a.time).getTime()
              })
              console.log('this.dealMessageArr', _cloneDeep(this.dealMessageArr))
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          // 下拉时组件会自动设置true，下拉刷新时会触发 refresh 事件，操作完成后将 v-model 设置为 false，表示加载完成。
          this.topLoading = false
          // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
          this.bottomLoading = false
        })
    },
    // 跳转消息详情
    viewDetailMsg(item) {
      let msgTemplateParam = JSON.parse(item.msgTemplateParam)
      console.log('msgTemplateParam', msgTemplateParam)
      // 通知消息状态
      // status: -1, // 状态(0:已读，-1:未读)
      if (item.status == -1) {
        let params = {
          receiveLogIdList: item.receiveLogId,
          status: 0,
        }
        // 更新消息状态为已读
        updateMsgStatusById(params).then((res) => {
          item.status = 0
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
      // if (!msgTemplateParam?.source || msgTemplateParam?.source != 'wpg')
      else {
        this.viewDialogData = item
        this.showDialog = true
      }
    },
    // 返回上一页
    onClickLeft() {
      this.$router.go(-1)
    },
  },
}
</script>
<style lang="less" scoped>
.NewsInfoStyle {
  height: 100%;
  background-color: #5dff73;
  background-color: #f5f7f9;
}

.mainContainer {
  width: 100%;
  height: calc(100% - 140px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: scroll;
  background-color: #f5f7f9;

  // 下拉刷新组件内容溢出显示
  .fm-pull-refresh {
    overflow: visible;
  }

  .cardListArrStyle {
    width: 690px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background: #f5f7f9;

    .timeStyle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 40px;
      margin: 24px 0;
      font-size: 28px;
      font-family: SFProText-Regular, SFProText;
      font-weight: 400;
      color: #cccccc;
    }

    .cardContainerStyle {
      position: relative;
      width: 690px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      box-sizing: border-box;
      padding: 30px 30px 0 30px;
      margin-bottom: 24px;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);

      .redPoint {
        position: absolute;
        top: 16px;
        right: 16px;
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fe4854;
      }

      .topContainer {
        width: 100%;

        .topTitle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: baseline;

          .titleLeft {
            font-size: 32px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #191919;
          }

          .timeRight {
            font-size: 24px;
            font-family: SFProText-Regular, SFProText;
            font-weight: 400;
            color: #cccccc;
          }
        }

        // 非告警消息显示内容
        .topContent1 {
          width: 100%;
          margin-top: 24px;
          margin-bottom: 24px;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
        }

        // 告警消息显示内容
        .topContent2 {
          width: 100%;
          display: flex;
          flex-direction: column;
          margin-top: 24px;
          margin-bottom: 24px;

          .lineStyle {
            display: flex;
            width: 100%;
            height: 56px;
            justify-content: flex-start;
            align-items: center;

            .text1 {
              margin: 0 32px 0 8px;
              font-size: 24px;
              font-family: SFProText-Regular, SFProText;
              font-weight: 400;
              color: #999999;
            }

            .text2 {
              width: 72%;
              font-size: 24px;
              font-family: SFProText-Regular, SFProText;
              font-weight: 400;
              color: #555555;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            img {
              width: 32px;
              height: 32px;
            }
          }
        }
      }

      .bottomDetail {
        width: 100%;
        height: 88px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #e9e9e9;
        background-color: #ffffff;
        font-size: 28px;
        font-family: SFProText-Regular, SFProText;
        font-weight: 400;
        color: #333333;

        .rightIcon {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #c7c7c7;
          border-top: none;
          border-left: none;
          transform: rotate(-45deg);
        }
      }
    }
  }
}

/deep/.fm-dialog__content {
  .textContainer {
    margin: 20px 0;
    padding-left: 16px;
    display: flex;
    justify-content: flex-start;

    .leftTitle {
      width: 130px;
      min-width: 130px;
      font-size: 24px;
      font-family: SFProText-Regular, SFProText;
      font-weight: 400;
      color: #999999;
    }

    .rightText {
      font-size: 24px;
      font-family: SFProText-Regular, SFProText;
      font-weight: 400;
      color: #555555;
    }
  }
}
</style>
