<template>
  <div class="InfoCard">
    <div class="topSide">
      <div class="bottomTitle">{{ cardInfo.ticketNo }}</div>&nbsp;
      <!-- cardInfo.formValue.status == '2' ? '已发送' :
           cardInfo.formValue.status == '3' ? '已拒绝' :
           cardInfo.formValue.status == '4' ? '办理中' :
           cardInfo.formValue.status == '5' ? '已完成' :  '' -->
      <fm-tag :text-color="
        cardInfo.formValue.status == '5'
          ? '#40BB5A'
          : cardInfo.formValue.status == '4'
            ? '#2E98FF'
            : cardInfo.formValue.status == '3'
              ? '#FA0E27'
              : cardInfo.formValue.status == '2'
                ? '#00AFFF'
                : ''
      " :color="
  cardInfo.formValue.status == '5'
    ? '#ebf8ee'
    : cardInfo.formValue.status == '4'
      ? '#e5f7ff'
      : cardInfo.formValue.status == '3'
        ? '#e8f4ff'
        : cardInfo.formValue.status == '2'
          ? '#f4f4f5'
          : ''
">
        {{ cardInfo.formValue.status == '2' ? '已发送' :
           cardInfo.formValue.status == '3' ? '已拒绝' :
           cardInfo.formValue.status == '4' ? '办理中' :
           cardInfo.formValue.status == '5' ? '已完成' :  ''}}
      </fm-tag>
      <fm-button class="btn" type="primary" round @click="handleAction">{{ btnType }}</fm-button>

    </div>
    <div class="bottomSide">
      <div class="commonStyle">
        <img src="@/assets/img/dispatchCenter/事件类型.png" alt="" />
        <div class="titleText">事件类型:</div>
        <div class="bigText">{{ cardInfo.formValue.createOrgName || '***' }}&nbsp; -> {{
            cardInfo.formValue.receiveOrgName || '***'
        }}</div>
      </div>
      <div class="commonStyle">
        <img src="@/assets/img/dispatchCenter/现场情况.png" alt="" />
        <div class="titleText">指令描述:</div>
        <div class="bigText">{{ cardInfo.formValue.questionDescribe || '---' }}</div>
      </div>
      <div class="commonStyle"
        v-show="cardInfo.formValue.status == '5' || cardInfo.formValue.status == '4' || cardInfo.formValue.status == '3' || cardInfo.formValue.status == '2'">
        <img src="@/assets/img/dispatchCenter/发送人.png" alt="" />
        <div class="titleText">发送人:</div>
        <div class="bigText">{{ cardInfo.formValue.createOrgName || '---' }}</div>
      </div>
      <div class="commonStyle"
        v-show="cardInfo.formValue.status == '5' || cardInfo.formValue.status == '4' || cardInfo.formValue.status == '3' || cardInfo.formValue.status == '2'">
        <img src="@/assets/img/dispatchCenter/发送时间.png" alt="" />
        <div class="titleText">发送时间:</div>
        <div class="bigText">{{ cardInfo.createTime || '---' }}</div>
      </div>
      <div class="commonStyle"
        v-show="cardInfo.formValue.status == '5' || cardInfo.formValue.status == '4' || cardInfo.formValue.status == '3'">
        <img src="@/assets/img/dispatchCenter/发送人.png" alt="" />
        <div class="titleText">接收人:</div>
        <div class="bigText">{{ cardInfo.formValue.receiveOrgName || '---' }}</div>
      </div>
      <div class="commonStyle"
        v-show="cardInfo.formValue.status == '5' || cardInfo.formValue.status == '4' || cardInfo.formValue.status == '3'">
        <img src="@/assets/img/dispatchCenter/发送时间.png" alt="" />
        <div class="titleText">反馈时限:</div>
        <div class="bigText">{{ cardInfo.formValue.agingDeadline || '---' }}</div>
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
export default {
  props: {
    cardInfo: {
      require: true,
      type: Object,
      default: () => { }
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
      // this.cardInfo.formValue.status == '2' ? '已发送' :
      // this.cardInfo.formValue.status == '3' ? '已拒绝' :
      // this.cardInfo.formValue.status == '4' ? '办理中' :
      // this.cardInfo.formValue.status == '5' ? '已完成' :  ''
      if (this.cardInfo.formValue.status == '4') {
        return '处理'
      } else if (this.cardInfo.formValue.status == '2') {
        return '处理'
      } else {
        return '查看'
      }
    }
  },
  data() {
    return {
      showPopover: false
    }
  },
  methods: {
    handleAction() {
      this.$emit('dealOrder',this.cardInfo.id)
    },

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
      // width: 48%;
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
