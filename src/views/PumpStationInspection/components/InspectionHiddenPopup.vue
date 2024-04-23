<template>
  <fm-popup :visible.sync="hiddenDangerShow" position="bottom" :style="{ height: '30%' }">
    <div class="hidden-danger">
      <div
        class="hidden-danger-item"
        v-for="(item, index) in hiddenDangerList"
        :key="index"
        @click="workerDetails(item)"
      >
        <div class="item-title">
          <img src="@/assets/img/pump/inspection-hidden-danger.png" class="item-title-img" alt="" />
          <div class="item-title-status">
            {{ getTicketStatusName(item.ticketStatus && item.ticketStatus.ticketStatus) }}
          </div>
        </div>
        <div class="item-content">
          <span class="item-content-title">异常位置：</span>
          <span class="item-content-data">{{
            getPumpAndDeviceName(
              item.ticketInfo && item.ticketInfo.formValue.deviceList[0].devicePart
            )
          }}</span>
        </div>
        <div class="item-content">
          <span class="item-content-title">隐患描述：</span>
          <span class="item-content-data">
            {{ item.ticketInfo && item.ticketInfo.formValue.deviceList[0].detail }}
          </span>
        </div>
      </div>
    </div>
  </fm-popup>
</template>

<script>
import { getToken, pumpInfoList, deviceInfoList } from '../api'
export default {
  props: {
    hiddenDangerList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      hiddenDangerShow: false,
      pumpList: [],
      deviceList: [],
    }
  },

  created() {
    this.getPumpInfoList()
    this.getDeviceInfoList()
  },

  methods: {
    show() {
      this.hiddenDangerShow = true
    },

    //获取泵站列表
    async getPumpInfoList() {
      const { data } = await pumpInfoList()
      this.pumpList = data
    },

    //获取设备列表
    async getDeviceInfoList() {
      const { data } = await deviceInfoList()
      this.deviceList = data
    },

    //id翻译名称
    getPumpAndDeviceName(arr) {
      const [pumpId, devicId] = arr
      console.log(pumpId, devicId)
      let pumpName = this.pumpList?.filter((item) => {
        return item.id === pumpId
      })
      let deviceName = this.deviceList?.filter((item) => {
        return item.id === devicId
      })

      pumpName = pumpName ? pumpName[0]?.pumpName : ''
      deviceName = deviceName ? deviceName[0]?.deviceName : ''

      return `${pumpName} - ${deviceName}`
    },

    //工单详情
    async workerDetails(item) {
      let workOrderId = item.ticketInfo.id
      const { accessToken } = await getToken(this.$storage.get('access_token'))

      let workerDetailsUrl = `${process.env.VUE_APP_WPG_URL}/outworkApp/#/pages/ticket/detail/index?id=${workOrderId}&token=${accessToken}&sysCode=xasw-pump`
      console.log(workerDetailsUrl)

      this.$router.push({
        query: {
          url: workerDetailsUrl,
        },
        path: '/pump/work',
      })
      // window.location.href = workerDetailsUrl
    },

    //获取工单状态名称
    // 工单状态 1办理中 2已完结 3挂起 99 作废
    getTicketStatusName(type) {
      switch (type) {
        case '1':
          return '办理中'
        case '2':
          return '已完结'
        case '99':
          return '作废'
      }
    },
  },
}
</script>

<style scoped lang="less">
.hidden-danger {
  overflow: scroll;
  padding: 30px;

  .hidden-danger-item {
    background: #eee;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    border-radius: 16px;
    padding-bottom: 10px;
    margin-bottom: 21px;

    .item-title {
      display: flex;
      justify-content: space-between;
      height: 44px;
      margin-bottom: 24px;

      .item-title-img {
        width: 142px;
        height: 44px;
      }

      .item-title-status {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 42px;
        font-size: 24px;
        color: #1b67d8;
        background-color: rgba(45, 126, 255, 0.1);
        border-radius: 0px 10px 0px 10px;
      }
    }

    .item-content {
      font-size: 28px;
      padding: 0 30px;
      margin-bottom: 24px;

      .item-content-title {
        font-weight: bold;
        color: #191919;
      }
      .item-content-data {
        word-wrap: break-word;
        word-break: normal;
        color: #555555;
      }
    }
  }
}
</style>
