<template>
  <div class="InfoCard" @click="execute">
    <div class="topSide">
      <div class="bottomTitle">{{ cardInfo.commandNumber }}</div>
      <fm-tag
        :text-color="
          cardInfo.commandStatus == '已完成'
            ? '#40BB5A'
            : cardInfo.commandStatus == '已发出'
              ? '#6F62FF'
              : cardInfo.commandStatus == '已接单'
                ? '#00AFFF'
                    : cardInfo.commandStatus == '暂存'
                      ? '#1790fe'
                      : cardInfo.commandStatus == '已退单'
                        ? '#909399'
                        : ''
        "
        :color="
          cardInfo.commandStatus == '已完成'
            ? '#ebf8ee'
            : cardInfo.commandStatus == '已发出'
              ? '#f0efff'
              : cardInfo.commandStatus == '已接单'
                ? '#e5f7ff'
                    : cardInfo.commandStatus == '暂存'
                      ? '#e8f4ff'
                      : cardInfo.commandStatus == '已退单'
                        ? '#f4f4f5'
                        : ''
      ">
        {{ cardInfo.commandStatus }}
      </fm-tag>
      <fm-button class="btn" v-show="cardInfo.commandStatus == '暂存' || cardInfo.commandStatus == '已发出' || cardInfo.commandStatus == '已接单'" type="primary" round @click="handleAction">{{ btnType }}</fm-button>
      <fm-button class="btn" v-show="cardInfo.commandStatus == '已发出'" round @click="rejectAction" style="color: #5aa0ff;">{{ '撤回' }}</fm-button>
    </div>
    <div class="bottomSide">
      <div class="commonStyle">
        <img src="@/assets/img/dispatchCenter/事件类型.png" alt="" />
        <div class="titleText">事件类型:</div>
        <div class="bigText">{{ cardInfo.sendDepartment || '***' }} -> {{ cardInfo.receiveDepartment || '***' }}</div>
      </div>
      <div class="commonStyle">
        <img src="@/assets/img/dispatchCenter/现场情况.png" alt="" />
        <div class="titleText">现场情况:</div>
        <div class="bigText">{{ cardInfo.detailedContent || '---' }}</div>
      </div>
      <div class="commonStyle" v-show="cardInfo.commandStatus == '已完成' || cardInfo.commandStatus == '已发出' || cardInfo.commandStatus == '已接单' || cardInfo.commandStatus == '已退单'">
        <img src="@/assets/img/dispatchCenter/发送人.png" alt="" />
        <div class="titleText">发送人:</div>
        <div class="bigText">{{ cardInfo.sendFullName || '---' }}</div>
      </div>
      <div class="commonStyle" v-show="cardInfo.commandStatus == '已完成' || cardInfo.commandStatus == '已发出' || cardInfo.commandStatus == '已接单' || cardInfo.commandStatus == '已退单'">
        <img src="@/assets/img/dispatchCenter/发送时间.png" alt="" />
        <div class="titleText">发送时间:</div>
        <div class="bigText">{{ cardInfo.sendTime || '---' }}</div>
      </div>
      <div class="commonStyle" v-show="cardInfo.commandStatus == '已完成' || cardInfo.commandStatus == '已接单' || cardInfo.commandStatus == '已退单'">
        <img src="@/assets/img/dispatchCenter/发送时间.png" alt="" />
        <div class="titleText">接收人:</div>
        <div class="bigText">{{ cardInfo.receiveFullName || '---' }}</div>
      </div>
      <div class="commonStyle" v-show="cardInfo.commandStatus == '已完成' || cardInfo.commandStatus == '已接单' || cardInfo.commandStatus == '已退单'">
        <img src="@/assets/img/dispatchCenter/发送时间.png" alt="" />
        <div class="titleText">接收时间:</div>
        <div class="bigText">{{ cardInfo.receiveTime || '---' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as apis from '../api'
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
export default {
  props: {
    cardInfo: {
      require: true,
      type: Object,
      default: () => {}
    },
  },
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
  computed: {
    btnType() {
      if (this.cardInfo.commandStatus == '已发出') {
        return '接单'
      } else if (this.cardInfo.commandStatus == '已接单') {
        return '处理'
      } else if (this.cardInfo.commandStatus == '暂存') {
        return '发出'
      }
    }
  },
  data() {
    return {
      actions: [
        { text: '接单' },
        { text: '撤回' }
      ],
      showPopover: false
    }
  },
  methods: {
    rejectAction() {
      this.handleCancel(this.cardInfo)
    },
    handleAction() {
      if (this.cardInfo.commandStatus == '已发出') {
        this.handleAdd('已接单')
      } else if (this.cardInfo.commandStatus == '暂存') {
        this.handleTempSave('已发出')
      } else if (this.cardInfo.commandStatus == '已接单') {
        this.$emit('dealOrder', this.cardInfo, 'deal')
      }
    },
    handleAdd(val) {
      let parmas = {};
      if (val == '已完成') {
        parmas = {
          entityName: 'DispatchingCommand',
          entityObject: {},
          formProcessParam: {
            formKey: 'CommandTask',
            taskId: this.taskId,
            modelKey: 'CommandTask',
            variable: {},
          },
        };
      } else {
        parmas = {
          entityName: 'DispatchingCommand',
          entityObject: {},
          formProcessParam: {
            formKey: 'CommandTask',
            processInstanceId: this.taskId,
            taskId: this.taskId,
            modelKey: 'CommandTask',
            variable: {},
          },
        };
      }
      if (val == '已接单') {
        this.cardInfo.receiveTime = new Date().getTime();
      }
      this.cardInfo.sendName = this.$store.state.userInfo.userName;
      this.cardInfo.commandStatus = val;
      if (val == '已退单') {
        this.cardInfo.ifback = '否';
      }
      if (val == '已完成') {
        this.cardInfo.ifback = '是';
        // this.finishTime = new Date().getTime();
      }
      parmas.entityObject = this.cardInfo;
      parmas.formProcessParam.variable = this.cardInfo;

      apis.getCommit(JSON.parse(JSON.stringify(parmas))).then(res => {
        if (res.message == '成功') {
          Toast.success({
            message: '操作成功！',
            duration: 2000
          });
          this.$emit('refreshList');
        } else {
          Toast.error('操作失败！');
        }
      });
      this.dialogVisible = false;
    },
    //暂存新增
    handleTempSave(val) {
      let params = JSON.parse(JSON.stringify(this.cardInfo))
      if (val == '已发出') {
        params.sendTime = new Date().getTime();
      }
      params.commandStatus = val
      params.id = '';
      apis.AddDispatchingCommand(params).then(res => {
        if (res.message == '成功') {
          Toast.success({
            message: '操作成功！',
            duration: 2000
          });
          this.$emit('refreshList');
        } else {
          Toast.error('操作失败！');
        }
      });
    },
    handleCancel(val) {
      let parmas = [];
      parmas.push(val.id);
      apis.delectCommand(JSON.parse(JSON.stringify(parmas))).then(res => {
        if (res.message == '成功') {
          this.handleTempSave('暂存');
        } else {
          Toast.error('撤销失败！');
        }
      });
      // this.$emit('refreshList');
    },
    execute() {
      if (this.cardInfo.commandStatus == '已完成' || this.cardInfo.commandStatus == '已退单') {
        this.$emit('handleView', this.cardInfo, 'view')
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .fm-tag--default {
  height: 60px;
  margin: auto 0;
  border: none;
}
.InfoCard {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 690px;
  height: auto;
  margin: 24px auto;
  border-radius: 16px;
  box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
  background-color: rgb(255, 255, 255);

  .topSide {
    width: 100%;
    height: 102px;
    font-size: 36px;
    font-weight: 600;
    color: #191919;
    border-bottom: 1px solid #ccc;
    display: flex;
    // background-color: #ffa0a0;

    .topIcon {
      position: relative;
      width: 100%;
      height: 43px;
      // background-color: red;

      img {
        position: absolute;
        top: 0;
        right: 0;
        width: 141px;
        height: 43px;
      }
    }

    .bottomTitle::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 30px;
      background-color: #2062c4;
      margin-right: 34px;
    }

    .bottomTitle {
      width: 48%;
      height: 100%;
      line-height: 102px;
      // background-color: green;
    }
    .btn {
      height: 60px;
      margin: auto;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
    }
  }

  .bottomSide {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    height: auto;
    font-size: 28px;
    font-family: PingFangSC-Semibold, PingFang SC;
    // background-color: #96ff9b;

    img {
      width: 32px;
      height: 32px;
      margin: 0 10px 0 30px;
    }

    .commonStyle {
      display: flex;
      align-items: center;
      width: 100%;
      height: auto;
      margin: 16px 0;
    }

    // 左边标题
    .titleText {
      margin-right: 20px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }

    .bigText {
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #555555;
      line-height: 32px;
    }

    .smallText {
      font-size: 28px;
      margin-left: 6px;
      color: #999999;
    }
  }

  // 转发、开始按钮
  .twoButton {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 72px;
    font-size: 28px;
    color: #1b67d8;
    font-family: PingFangSC-Semibold, PingFang SC;

    .centerLine {
      height: 70%;
      width: 2px;
      background-color: #eee;
    }
  }
}
</style>
