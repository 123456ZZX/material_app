<template>
  <div class="NewsNoticeStyle">
    <fm-nav-bar title="站内信" left-arrow @click-left="onClickLeft">
      <template #left>
        <i class="fm-icon fm-icon-arrow-left" style="font-size: 18px; color: #000 !important"></i>
      </template>
      <template v-if="this.nowCheckedBtn === '未读'" #right>
        <img @click="clearAllMessage" class="clearImgStyle" src="./imgs/清理扫把.png" alt="" />
      </template>
    </fm-nav-bar>
    <!-- 全部、未读切换按钮组件 -->
    <ChangeButton btn1="全部" btn2="未读" @buttonChange="buttonChange"></ChangeButton>
    <div class="mainContainer">
      <div
        @click="goToMessageList(item)"
        v-for="(item, index) in cardConfig"
        :key="index"
        class="typeCardContainer"
      >
        <div class="leftIconSide">
          <!-- 显示全部未读消息 -->
          <!-- <div class="redNumPoint" v-if="item.newMessage > 0">{{ item.newMessage }}</div> -->
          <!-- 当未读消息大于99条时显示'···' -->
          <div class="redNumPoint" v-if="item.newMessage > 0">
            {{ item.newMessage > 99 ? '···' : item.newMessage }}
          </div>
          <img class="iconStyle" :src="item.msgIcon" alt="" />
        </div>
        <div class="rightContentSide">
          <div class="topTitleContainer">
            <div class="topTitle">{{ item.msgTitle }}</div>
            <div class="topTime">{{ item.msgTime }}</div>
          </div>
          <div class="bottomContent">
            <span
              class="textStyle"
              :style="item.msgContent == '暂无消息' ? { color: '#999999' } : ''"
              >{{ item.msgContent }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from '@/views/Home/api.js'
import { updateBatchMsgStatus } from '@/api/message.js'
import ChangeButton from './ChangeButton.vue'
import _cloneDeep from 'lodash/cloneDeep'
import { Toast, Dialog } from 'fawkes-mobile-lib'

export default {
  name: 'NewsNotice',
  components: {
    ChangeButton,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
  },
  data: () => ({
    nowCheckedBtn: '全部',
    // 类型(100:公告，200:业务通知，201:告警，202:工单，203:事件，300:私信)
    cardConfig: [
      {
        msgType: 100,
        msgTitle: '公告',
        msgContent: '',
        msgTime: '',
        newMessage: 0,
        msgIcon: require('./imgs/公告.png'),
      },
      {
        msgType: 200,
        msgTitle: '业务通知',
        msgContent: '',
        msgTime: '',
        newMessage: 0,
        msgIcon: require('./imgs/业务通知.png'),
      },
      {
        msgType: 201,
        msgTitle: '告警',
        msgContent: '',
        msgTime: '',
        newMessage: 0,
        msgIcon: require('./imgs/告警.png'),
      },
      {
        msgType: 202,
        msgTitle: '工单',
        msgContent: '',
        msgTime: '',
        newMessage: 0,
        msgIcon: require('./imgs/工单.png'),
      },
      {
        msgType: 203,
        msgTitle: '事件',
        msgContent: '',
        msgTime: '',
        newMessage: 0,
        msgIcon: require('./imgs/事件.png'),
      },
    ],
    // 类型(100:公告，200:业务通知，201:告警，202:工单，203:事件，300:私信)
    typeList: [100, 200, 201, 202, 203],
  }),
  created() {
    // 获取消息
    this.getMsgList()
  },
  methods: {
    // 全部、未读切换按钮
    buttonChange(btn) {
      console.log(btn)
      this.nowCheckedBtn = btn
      this.getMsgList()
    },
    // 获取消息
    getMsgList() {
      // params = {
      //   currentPage: 1,
      //   pageSize: 2000,
      //   // status: -1, // 状态(0:已读，-1:未读)
      //   searchValue: this.valueText, // 消息内容
      //   startDate: '', // 开始日期
      //   endDate: '', // 结束日期
      //   // type: '' // 类型(100:公告，200:业务通知，201:告警，202:工单，203:事件，300:私信)(支持xxx,xxx格式)(支持xxx-xxx格式)
      // }
      this.typeList.forEach((item, index) => {
        let params = {
          currentPage: 1,
          pageSize: 1,
          // status: -1, // 状态(0:已读，-1:未读)
          type: item,
        }
        if (this.nowCheckedBtn === '未读') {
          params.status = -1
        }
        api.getMsgList(params).then((res) => {
          let msgList = res?.data?.list || []
          this.cardConfig.forEach((card) => {
            if (card.msgType === item) {
              // 如果有消息
              if (msgList.length > 0) {
                // 如果msgBody中含有html标签，则删除html标签
                if (/<[^>]+>/g.test(msgList[0].msgBody)) {
                  msgList[0].msgBody = msgList[0].msgBody.replace(/<[^>]+>/g, '')
                }
                card.msgContent = msgList[0].msgBody
                card.msgTime = msgList[0].updateDate
              } else {
                // 如果没有消息，显示暂无消息
                card.msgContent = '暂无消息'
                card.msgTime = ''
              }

              if (this.nowCheckedBtn === '全部') {
                // 全部消息，红点不显示
                card.newMessage = 0
              } else if (this.nowCheckedBtn === '未读') {
                // 未读消息，红点显示
                card.newMessage = res?.data?.total || 0
              }
            }
          })
          console.log(this.nowCheckedBtn, item, res.data.total, msgList, res.data)
        })
      })
    },
    // 批量更新站内信状态
    clearAllMessage() {
      Dialog.confirm({
        title: '确认清空未读消息么',
        message: '',
      })
        .then(() => {
          let params = {
            msgTypeList: this.typeList.toString(), // 站内信类型
            status: 0, // 状态(0:已读,-1:未读,-2:删除)
          }
          updateBatchMsgStatus(params).then((res) => {
            if (res.message === '成功') {
              Toast('全部已读成功')
              this.getMsgList()
            }
          })
        })
        .catch(() => {})
    },
    // 跳转到消息列表
    goToMessageList(item) {
      // console.log(_cloneDeep(item))
      if (item.msgContent === '暂无消息') {
        Toast('暂无消息')
        return
      }
      item.nowCheckedBtn = this.nowCheckedBtn
      this.$router.push({
        path: '/newsInfo',
        query: item,
      })
    },
    // 返回上一页
    onClickLeft() {
      this.$router.go(-1)
    },
  },
}
</script>
<style lang="less" scoped>
.NewsNoticeStyle {
  height: 100%;
  background-color: #ff5d5d;
  background-color: #f5f7f9;

  .clearImgStyle {
    width: 40px;
    height: 40px;
  }

  .mainContainer {
    width: 100%;
    height: calc(100% - 140px - 92px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: scroll;
    background-color: #f5f7f9;

    .typeCardContainer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: calc(100% - 60px);
      height: 154px;
      min-height: 154px;
      margin-top: 26px;
      border-radius: 24px;
      box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.08);
      background: #ffffff;

      .leftIconSide {
        position: relative;
        width: 20%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .redNumPoint {
          position: absolute;
          top: 26px;
          right: 14px;
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 50%;
          // min-width: 24px;
          // min-height: 24px;
          // padding: 3px 5px;
          // border-radius: 24px;
          text-align: center;
          border: 1px solid #f7f7f7;
          background-color: #ff4b4b;
          // 12px = 0.16rem
          font-size: 16px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #ffffff;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .iconStyle {
          width: 94px;
          height: 94px;
        }
      }

      .rightContentSide {
        width: 80%;
        height: 76%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #ffffff;

        .topTitleContainer {
          width: 100%;
          height: calc(50%);
          display: flex;
          justify-content: space-between;
          align-items: center;

          .topTitle {
            font-size: 28px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #191919;
          }

          .topTime {
            margin-right: 30px;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
          }
        }

        .bottomContent {
          width: 100%;
          height: calc(50%);
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;

          .textStyle {
            width: calc(100% - 30px);
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
