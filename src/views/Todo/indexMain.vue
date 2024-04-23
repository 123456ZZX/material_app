<template>
  <div class="body">
    <img class="title-img" src="@/views/Todo/img/background.png" />
    <div class="title">待办任务</div>
    <div class="tab-div">
      <div :class="tabText == '待办' ? 'tab text2' : 'tab text1'" @click="handleClickTab('待办')">待办{{ doingCount }}</div>
      <div :class="tabText == '已办' ? 'tab text2' : 'tab text1'" @click="handleClickTab('已办')">已办{{ doneCount }}</div>
      <div :class="tabText == '已发起' ? 'tab text2' : 'tab text1'" @click="handleClickTab('已发起')">已发起{{ totalOver }}</div>
      <img v-if="tabText == '待办'" class="tab-img1" src="@/views/Todo/img/tab1.png" />
      <img v-if="tabText == '已办'" class="tab-img2" src="@/views/Todo/img/tab2.png" />
      <img v-if="tabText == '已发起'" class="tab-img3" src="@/views/Todo/img/tab3.png" />
      <div class="drop-div">
        <fm-dropdown-menu>
          <!-- 时间 -->
          <fm-dropdown-item v-model="value1" :options="option1" @change="changeOption1" />
          <!-- 状态 -->
          <fm-dropdown-item v-model="value2" :options="tabText == '待办' ? option_1 : option_2" @change="changeOption2" />
        </fm-dropdown-menu>
      </div>
      <div class="singleText" v-if="Emptystate">{{ singleText }}</div>
      <div class="list-div" v-if="!Emptystate">
        <div class="card" v-for="(item, index) in tableData" :key="index" @click="jumpDetail(item.id, index)">
          <div class="title-div">
            <img src="@/views/Todo/img/titleLogo.png" />
            <div class="card-title">{{ item.templateName }}</div>
            <div v-if="tabText != '待办'" :class="item.ticketStatus == 1 ? 'tag text3' :
                item.ticketStatus == 2 ? 'tag text4' :
                  item.ticketStatus == 3 ? 'tag text5' :
                    item.ticketStatus == 99 ? 'tag text6' : ''">
              {{
                item.ticketStatus == 1 ? '办理中' :
                item.ticketStatus == 2 ? '已完结' :
                  item.ticketStatus == 3 ? '已挂起' :
                    item.ticketStatus == 99 ? '已作废' : ''
              }}
            </div>
            <div v-if="tabText == '待办'" class="time">{{ item.createTime.slice(0, 11) }}</div>
          </div>
          <div class="line-div">
            <img src="@/views/Todo/img/nametask.png" />
            <span class="lineText">任务名称：{{ item.title }}</span>
          </div>
          <div class="line-div">
            <img src="@/views/Todo/img/nowTAsk.png" />
            <span class="lineText">当前环节：{{ item.stepName }}</span>
          </div>
          <div class="line-div">
            <img src="@/views/Todo/img/people.png" />
            <span class="lineText">发起人：{{ item.createByName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { Empty } from 'fawkes-mobile-lib'
import * as apis from './api'
export default {
  data() {
    return {
      totalOver: 0,
      Emptystate: true,
      singleText: '暂无数据！',
      accessToken: this.$storage.get('access_token'),
      formToken: '',
      pageSize: 10,
      currentPage: 1,
      url1:
        process.env.VUE_APP_THIRD_REQUEST_URL +
        '/main/outworkapi/ticketClient/search/selectTicketInfoWaitPage', //待办数据
      url2:
        process.env.VUE_APP_THIRD_REQUEST_URL +
        '/main/outworkapi/ticketClient/search/selectTicketInfoDonePage', //已办数据
      url3:
        process.env.VUE_APP_THIRD_REQUEST_URL +
        '/main/outworkapi/ticketClient/search/selectTicketInfoCreatePage', //已发起数据
      token: '',
      total: 0,
      doneCount: 0,
      doingCount: 0,
      hasDoneData: [],
      toDoData: [],
      myData: [],
      tabText: '待办',
      value1: 'allTime', // 时间选中值
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      value2: '', // 待办状态选中值
      option1: [
        { text: '全部时间', value: 'allTime' },
        { text: '近一周', value: 'oneWeek' },
        { text: '近一月', value: 'oneMonth' },
        { text: '近三月', value: 'threeMonth' },
      ],
      // 待办状态
      option_1: [
        { text: '全部状态', value: '' },
        { text: '办理中', value: '1' },
        { text: '已挂起', value: '3' },
      ],
      // 已办状态、已发起状态
      option_2: [
        { text: '全部状态', value: '' },
        { text: '办理中', value: '1' },
        { text: '已完结', value: '2' },
        { text: '已挂起', value: '3' },
        { text: '已作废', value: '99' },
      ],
      // ticketStatus: "1"  办理中
      // ticketStatus: "2"  已完结
      // ticketStatus: "3"  已挂起
      // ticketStatus: "99" 已作废
    }
  },
  created() {
    this.getFormToken() // 获取工单token
  },
  mounted() { },
  computed: {
    tableData() {
      return this.tabText == '待办'
        ? this.toDoData
        : this.tabText == '已办'
          ? this.hasDoneData
          : this.myData
    },
  },
  methods: {
    jumpDetail(id, index) {
      // 测试附件下载
      // if (index == 0) {
      //   window.parent.outWorkFileDownload('https://xionganwater.cn/api/sys-storage/download?f8s=481c0353dd6e3e7fae4e8a27a5f3c5c2', '接水方案.pdf')
      // }
      // if (index == 1) {
      //   window.parent.outWorkFileDownload('https://xionganwater.cn/main/userCenterApi/FileManager/download/a496b0efbf262c0bd91157577bf12a31', '热线工单导出模板.docx')
      // }
      // if (index == 2) {
      //   window.parent.outWorkFileDownload('https://xionganwater.cn/api/sys-storage/download?f8s=d8b61b32669d63d87fb7f772e881bc89', 'docker.txt')
      // }
      // return
      this.$router.push({
        name: 'detailProblemOrder',
        query: { id },
      })
      // window.location.href =
      //     'http://172.20.79.70/outworkApp/#/pages/ticket/detail/index?id=' +
      //     id +
      //     '&sysCode=outwork' +
      //     '&token=' +
      //     this.formToken
    },
    // 时间切换事件
    changeOption1(val) {
      console.log(777777777, this.value1);
      // startTime: '', // 开始时间
      // endTime: '', // 结束时间
      if (this.value1 == 'allTime') {
        this.startTime = ''
        this.endTime = ''
      } else if (this.value1 == 'oneWeek') {
        this.startTime = this.$dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss')
        this.endTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else if (this.value1 == 'oneMonth') {
        this.startTime = this.$dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
        this.endTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else if (this.value1 == 'threeMonth') {
        this.startTime = this.$dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss')
        this.endTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      console.log(666666666, this.startTime, this.endTime);
      // 数据筛选
      this.searchData()

      // 待办
      // stepStartTimeStart: "2023-04-04 10:10:34"
      // stepStartTimeEnd: "2023-04-28 10:10:34"

      // 已办、已发起
      // createTimeStart: "2023-04-01 10:40:56"
      // createTimeEnd: "2023-04-27 10:40:56"
    },
    // 待办状态切换事件
    changeOption2(val) {
      console.log(888888888, this.value2);
      // 数据筛选
      this.searchData()
    },
    getFormToken() {
      axios({
        url:
          process.env.VUE_APP_THIRD_REQUEST_URL +
          '/main/userCenterApi/sso/tokenByToken',
        method: 'post',
        params: {
          token: this.accessToken,
        },
        headers: {
          Authorization: 'Basic b3V0d29yazp3cGcyMDIw',
        },
      }).then((res) => {
        if (res.status == 200) {
          this.formToken = res.data.resultData.token
          this.getList1(this.formToken, this.url1)
          this.getList2(this.formToken, this.url2)
          this.getList3(this.formToken, this.url3)
        }
      })
    },
    //待办数据
    getList1(token, url) {
      this.toDoData = []
      let params = {
        sysCode: 'outwork',
        ticketStatus: this.value2,
        stepStartTimeStart: this.startTime,
        stepStartTimeEnd: this.endTime,
        page: {
          size: 99999,
          current: this.currentPage,
        },
      }
      apis.getTodoList(url, JSON.stringify(params), token).then((res) => {
        if (res.data.success) {
          if (res.data.resultData.total == 0) {
            this.Emptystate = true
            this.doingCount = res.data.resultData.total
          } else {
            this.Emptystate = false
            this.toDoData = res.data.resultData.records
            this.doingCount = res.data.resultData.total
          }
        }
      })
    },
    //已办列表数据
    getList2(token, url) {
      this.hasDoneData = []
      let params = {
        sysCode: 'outwork',
        ticketStatus: this.value2,
        createTimeStart: this.startTime,
        createTimeEnd: this.endTime,
        page: {
          size: 99999,
          current: this.currentPage,
        },
      }
      apis.getTodoList(url, JSON.stringify(params), token).then((res) => {
        if (res.data.success) {
          if (res.data.resultData.total == 0) {
            this.Emptystate = true
            this.doneCount = res.data.resultData.total
          } else {
            this.Emptystate = false
            this.hasDoneData = res.data.resultData.records
            this.doneCount = res.data.resultData.total
          }
        }
      })
    },
    //已发起
    getList3(token, url) {
      this.myData = []
      let params = {
        sysCode: 'outwork',
        ticketStatus: this.value2,
        createTimeStart: this.startTime,
        createTimeEnd: this.endTime,
        page: {
          size: 99999,
          current: this.currentPage,
        },
      }
      apis.getTodoList(url, JSON.stringify(params), token).then((res) => {
        if (res.data.success) {
          if (res.data.resultData.total == 0) {
            this.Emptystate = true
            this.totalOver = res.data.resultData.total
          } else {
            this.Emptystate = false
            this.myData = res.data.resultData.records
            this.totalOver = res.data.resultData.total
          }
        }
      })
    },
    // 点击tab
    handleClickTab(val) {
      this.tabText = val
      this.value1 = 'allTime'  // 全部时间
      this.value2 = '' // 全部状态
      // 数据查询
      this.searchData()
    },
    // 数据查询及筛选
    searchData() {
      if (this.tabText == '待办') {
        this.getList1(this.formToken, this.url1)
      } else if (this.tabText == '已办') {
        this.getList2(this.formToken, this.url2)
      } else {
        this.getList3(this.formToken, this.url3)
      }
    },
  },
}
</script>
<style scoped lang="less">
.body {
  width: 100%;
  height: 90%;
  background: linear-gradient(180deg, #cee5fe 0%, #eff7ff 8%, #f5f7f9 100%);

  .title-img {
    position: absolute;
    width: 100%;
    height: 460px;
    z-index: 1;
  }

  .title {
    z-index: 2;
    position: relative;
    top: 20px;
    text-align: center;
    width: 100%;
    height: 100px;
    font-size: 36px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 100px;
  }

  .tab-div {
    border-radius: 50px 50px 0 0;
    background: linear-gradient(180deg, #cee5fe 0%, #eff7ff 8%, #f5f7f9 100%);
    position: relative;
    top: 40px;
    z-index: 999;
    width: 100%;
    height: 86%;
    // border: 1px saddlebrown solid;

    .tab {
      width: 33%;
      height: 80px;
      line-height: 80px;
      float: left;
      text-align: center;
      z-index: 99;
      // border: 1px saddlebrown solid;
      // background: #da3030;
    }

    .text2 {
      z-index: 4;
      font-size: 32px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;
    }

    .text1 {
      font-size: 32px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #555555;
    }

    .text3 {
      color: #027aff;
      background-color: rgba(2, 122, 255, 0.1);
    }

    .text4 {
      color: #40bb5a;
      background-color: rgba(64, 187, 90, 0.1);
    }

    .text5 {
      color: #ff4a4a;
      background-color: rgba(255, 74, 74, 0.1);
    }

    .text6 {
      color: #ff9a00;
      background-color: rgba(255, 154, 0, 0.1);
    }

    .tab-img1 {
      position: relative;
      top: -100px;
      left: 0px;
      z-index: -3;
      width: 33%;
    }

    .tab-img2 {
      position: relative;
      top: -100px;
      left: 33%;
      z-index: -3;
      width: 33%;
    }

    .tab-img3 {
      position: relative;
      top: -100px;
      left: 67%;
      z-index: -3;
      width: 33%;
    }

    .drop-div {
      margin-top: -100px;
      width: 100%;
      height: auto;
    }

    .singleText {
      text-align: center;
      font-size: 26px;
      margin-top: 40px;
    }

    .list-div {
      // border: 1px saddlebrown solid;
      height: 83%;
      width: 100%;
      overflow: scroll;

      .card {
        margin-top: 30px;
        margin-left: 25px;
        width: 690px;
        height: 308px;
        background: #ffffff;
        box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
        border-radius: 16px;
        padding-top: 40px;

        .title-div {
          display: inline-flex;
          // border: 1px saddlebrown solid;
          width: 100%;
          height: 80px;
          line-height: 80px;

          img {
            margin-top: 20px;
            width: 6px;
            height: 40px;
          }

          .card-title {
            flex: 0 0 auto;
            // border: 1px sandybrown solid;
            margin-left: 20px;
            height: 80px;
            width: auto;
            font-size: 36px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #191919;
          }

          .time {
            margin-right: 30px;
            margin-left: auto;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #adadad;
          }

          .tag {
            margin-right: 30px;
            margin-left: auto;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            width: auto;
            margin-top: 15px;
            padding: 0 20px 0 20px;
            height: 42px;
            line-height: 42px;
            // border: 1px saddlebrown solid;
            border-radius: 4px;
          }
        }

        .line-div {
          padding-left: 10px;
          padding-right: 10px;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          width: 100%;
          height: 70px;
          line-height: 70px;
          display: flex;
          align-items: center;
          justify-content: flex-start;

          .lineText {
            width: 87%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          img {
            width: 32px;
            height: 32px;
            margin-right: 20px;
          }
        }
      }
    }
  }

  /deep/.fm-dropdown-menu__bar {
    background: linear-gradient(180deg, #ebf3fb 8%, #e6eef5 80%) !important;
  }

  /deep/.fm-dropdown-menu__title {
    background: #ffffff;
    box-shadow: 0px 4px 16px 0px rgb(104 115 127 / 6%);
    border-radius: 36px;
    padding: 10px 110px 10px 110px;
  }

  /deep/.fm-dropdown-menu__title::after {
    right: 50px !important;
  }
}
</style>
