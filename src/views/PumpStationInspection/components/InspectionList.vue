<template>
  <div class="inspection-list">
    <div
      class="inspection-list-item"
      v-for="(item, index) in tableList"
      :key="item.id"
      @click="goToInspectionItem(InspectionItemUrl, item)"
    >
      <div
        class="list-item-icon"
        :style="{
          background: getInspectionStatusTypeColor(
            item.patrolStatus === '未巡' ? 0 : getReportHiddenDangerNum(index) === 0 ? 1 : 2
          ),
        }"
      >
        {{ item.patrolStatus === '未巡' ? '未巡' : '已巡' }}
      </div>
      <div class="list-item-box">
        <div class="item-box-title">{{ item.patrolPointName }}</div>
        <div class="item-box-area">
          <span>厂站：{{ item.pumpName }}</span>
          <span> 区域：{{ item.areaLocation }}</span>
        </div>
        <div class="item-box-time">
          <div class="box-time-item">
            <img src="@/assets/img/pump/inspection-time.png" class="box-time-img-time" alt="" />
            <span class="box-time" v-if="!item.isUnsubmitted">
              {{ item.checkTime ? item.checkTime : '未开始' }}</span
            >
            <span class="isUnsubmitted" v-if="item.isUnsubmitted">未提交</span>
            <div v-if="item.nfcCardNo" class="nfc-img">
              <img
                v-if="!item.signMethod"
                src="@/assets/img/pump/inspection-nfc2.png"
                class="box-time-img-nfc"
                alt=""
                @click.stop="selectCause(index)"
              />
              <img
                v-if="item.signMethod === 'NFC'"
                src="@/assets/img/pump/inspection-nfc.png"
                class="box-time-img-nfc"
                alt=""
              />
              <img
                v-if="item.signMethod && item.signMethod !== 'NFC'"
                src="@/assets/img/pump/inspection-nfc1.png"
                class="box-time-img-nfc"
                alt=""
              />
            </div>
          </div>
          <div class="box-time-item" v-if="item.reportHiddenDangerNum > 0">
            <img
              src="@/assets/img/pump/inspection-warning.png"
              class="box-time-img-warning"
              alt=""
              @click.stop="hiddenDangerShow(item)"
            />
            <span style="color: #ff9429">{{ getReportHiddenDangerNum(index) }}</span>
          </div>
        </div>
      </div>
    </div>

    <fm-popup :visible.sync="popupShow" position="bottom" :style="{ height: '30%' }">
      <fm-picker
        title="请选择未刷卡原因"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </fm-popup>
  </div>
</template>

<script>
import { patrolEdit } from '../api'
export default {
  name: 'InspectionList',
  props: {
    //巡检状态(1:待巡检，2:巡检中，3:已完成 ，4:已终止)(手机端)
    patrolPointResultList: {
      type: Array,
      default: () => [],
    },
    patrolStatus: {
      type: Number,
      default: 0,
    },

    activeIndex: {
      type: Number,
      default: 1,
    },

    disabled: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    activeIndex: {
      handler(newData) {
        const config = newData === 1 ? '未巡' : '已巡'
        this.tableList = this.patrolPointResultList.filter(({ patrolStatus }) => {
          return config === patrolStatus
        })
      },
      immediate: true,
    },
    patrolPointResultList: {
      handler(newData) {
        const config = this.activeIndex === 1 ? '未巡' : '已巡'
        this.tableList = newData.filter(({ patrolStatus }) => {
          return config === patrolStatus
        })
      },
      deep: true,
    },
  },
  data() {
    return {
      InspectionItemUrl: '/pump/inspection-item',
      inspectionPointStatusType: 0, //0未巡，1已巡正常，2已巡异常
      popupShow: false,
      NFCIndex: -1,
      columns: ['标签损坏', '未贴标签', '其它'],
      tableList: [],
    }
  },

  async created() {},

  methods: {
    //跳转巡检点页面
    async goToInspectionItem(url,  item) {
      if (this.disabled && this.patrolStatus !== 3) return
      if (item.nfcCardNo && !item.signMethod) return

      const { taskId } = this.$store.state.pump.urlQuery

      let patrolPointResultList = this.patrolPointResultList
      let index = 0
      patrolPointResultList.forEach((data,i)=>{
        if(data.id === item.id)
          index = i
      })

      if (!item.patrolItemsResultList) {
        patrolPointResultList[index].patrolStatus = '已巡'
        let query = {
          id: taskId,
          patrolPointResultList,
        }
        const res = await patrolEdit(query)
        this.$parent.getPatrol()
      }

      this.$store.commit('setUrlQuery', {
        taskId,
        index,
      })
      this.$router.push(url)
    },

    //隐患列表展示
    hiddenDangerShow(item) {
      this.$emit('hiddenDangerClick', item, 'item')
    },

    //弹出刷卡界面
    handMovementNFC() {
      console.log('执行NFC')
      let isFindNFC = false
      let code = undefined
      if (typeof yuanchu != 'undefined') {
        //异步事件
        yuanchu.nfc.nfcScan((res) => {
          code = res

          // alert(code)

          //匹配到对应的NFC并进入巡检项
          this.patrolPointResultList?.filter(async (item, index) => {
            console.log(item.nfcCardNo)
            if (item.nfcCardNo === code) {
              this.NFCIndex = index
              this.onConfirm('NFC')

              isFindNFC = true
              this.goToInspectionItem(this.InspectionItemUrl, item)
            } else {
              console.log(111)
            }
          })

          isFindNFC ? this.$toast('匹配成功') : this.$toast('匹配失败')
        })
      }
    },

    //手动NFC-标签损坏、未贴标签、其它
    selectCause(index) {
      this.NFCIndex = index
      this.popupShow = true
    },

    //手动NFC确认
    async onConfirm(e) {
      try {
        let patrolPointResultList = this.patrolPointResultList
        patrolPointResultList[this.NFCIndex].signMethod = e
        let query = {
          id: this.$store.state.pump.urlQuery.taskId,
          patrolPointResultList,
        }
        const res = await patrolEdit(query)

        this.$parent.getPatrol()
      } catch (error) {
        console.log(error)
        this.$toast('更新失败')
      }

      this.popupShow = false
    },
    //手动NFC取消
    onCancel() {
      this.$toast('取消')
      this.popupShow = false
    },

    //获取异常上报工单数量
    getReportHiddenDangerNum(index) {
      let sum = 0
      this.patrolPointResultList[index].patrolItemsResultList?.forEach((item) => {
        item.workOrderId ? sum++ : null
      })
      return sum
    },

    //巡检点图标颜色
    //0未巡，1已巡正常，2已巡异常
    getInspectionStatusTypeColor(type) {
      switch (type) {
        case 0:
          return '#2D7EFF'
        case 1:
          return '#40BB5A'
        case 2:
          return '#FF3546'
      }
    },
  },
}
</script>

<style scoped lang="less">
.inspection-list {
  padding: 30px;
}

.inspection-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;

  .list-item-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    line-height: 60px;
    font-size: 20px;
    color: #ffffff;
    background: #2d7eff;
    border-radius: 50%;
    margin-right: 30px;
  }

  .list-item-box {
    width: 612px;
    background: #ffffff;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    border-radius: 12px;
    font-size: 24px;
    color: #191919;
    padding: 24px 30px;

    .item-box-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 30px;
    }

    .item-box-area {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;

      span {
        flex: 1;
      }
    }

    .item-box-time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #555;

      .box-time-item {
        display: flex;
        align-items: center;

        .nfc-img {
          display: flex;
          align-items: center;
        }
      }

      .box-time {
        margin: 0 12px;
      }

      .box-time-img-nfc {
        width: 58px;
        height: 24px;
      }

      .box-time-img-warning {
        width: 32px;
        height: 28px;
        margin-right: 12px;
      }
    }
  }

  .isUnsubmitted {
    color: #ff4d4f;
    margin-left: 8px;
  }
}
</style>
