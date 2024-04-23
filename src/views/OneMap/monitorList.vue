<template>
  <div class="list">
    <div class="topTab">
      <fm-search
        v-model="searchValue"
        placeholder="搜索"
        @clear="onClear"
        @search="onSearch"
      />
      <fm-tabs v-model="chooseTab" @tab-click="tabClick" type="line">
        <fm-tab
          v-for="(item, index) in tabArr"
          :label="item.label"
          :name="item.name"
          :key="index"
        >
        </fm-tab>
      </fm-tabs>
    </div>
    <div class="middleList">
      <div
        class="item blue"
        :class="state == '全部' ? 'active' : ''"
        @click="stateChange('全部')"
      >
        <div>全部</div>
        <div>({{ numList.allNum }})</div>
      </div>
      <div
        class="item red"
        :class="state == '告警' ? 'active' : ''"
        @click="stateChange('告警')"
      >
        <div>告警</div>
        <div>({{ numList.yzNum }})</div>
      </div>
      <div
        class="item orange"
        :class="state == '一般' ? 'active' : ''"
        @click="stateChange('一般')"
      >
        <div>一般</div>
        <div>({{ numList.ybNum }})</div>
      </div>
      <div
        class="item yellow"
        :class="state == '预警' ? 'active' : ''"
        @click="stateChange('预警')"
      >
        <div>预警</div>
        <div>({{ numList.yjNum }})</div>
      </div>
      <div
        class="item gray"
        :class="state == '离线' ? 'active' : ''"
        @click="stateChange('离线')"
      >
        <div>离线</div>
        <div>({{ numList.offlineNum }})</div>
      </div>
    </div>
    <div class="bottomList">
      <div v-if="chooseList.length > 0">
        <div
          v-for="(item, index) in chooseList"
          :key="index"
          class="card"
          @click="cardOpen(item)"
        >
          <div
            class="top"
            :class="
              item.warnStatus == '5'
                ? 'iotOnline'
                : item.warnStatus == '1'
                ? 'yuwarn'
                : item.warnStatus == '3'
                ? 'warn'
                : item.warnStatus == '2'
                ? 'normal'
                : ''
            "
          >
            <div class="name">{{ item.monitorName }}</div>
            <div class="time">
              {{ $dayjs(item.activedAt).format('YYYY-MM-DD hh:mm:ss') || '' }}
            </div>
          </div>
          <div v-for="(i, k) in detail(item)" :key="k" class="bottom">
            <div class="type">{{ i.name }}</div>
            <div class="value">
              <span class="v">{{
                i.val ? Number(i.val).toFixed(3) : '--'
              }}</span
              >{{ i.desc }}
            </div>
          </div>
        </div>
      </div>
      <empty-status v-else></empty-status>
    </div>
  </div>
</template>

<script>
import { getAllEquipmentInformation, getAllNumInformation } from './api'
import _cloneDeep from 'lodash/cloneDeep'
import {
  Toast
} from 'fawkes-mobile-lib'
import EmptyStatus from './components/EmptyStatus.vue'
export default {
  name: 'list',
  props: {},
  computed: {},
  components: {
    EmptyStatus
  },
  data() {
    return {
      searchValue: '',
      state: '全部',
      chooseTab: '供水',
      chooseType: '',
      tabArr: [
        { label: '供水', name: '供水' },
        { label: '污水', name: '污水' },
        { label: '雨水', name: '雨水' },
        { label: '再生水', name: '再生水' },
      ],
      allList: [],
      flowArr: [],
      pressureArr: [],
      chooseList: [],
      numList: {},
      iotOnline: '',
      isWarn: '',
      loading: false,
    }
  },
  watch: {},
  mounted() {
    this.getPressurePoint()
    this.getNum()
  },
  methods: {
    async getPressurePoint() {
      let params = {
        belongSystem: this.chooseTab,
        deviceType: this.chooseType,
        monitorName: this.searchValue,
        isWarn: this.isWarn,
      }
      let arr = []
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
      // 获取所有监测设备基础信息
      await getAllEquipmentInformation(params).then((res) => {
        this.loading = true
        if (res.data && res.data.length > 0) {
          arr = res.data
          this.chooseList = arr
        } else {
          this.chooseList = []
        }
      })
    },
    async getNum() {
      let params = {
        belongSystem: this.chooseTab,
        deviceType: this.chooseType,
        monitorName: this.searchValue,
      }
      let arr = {}
      // 获取所有监测设备基础信息
      await getAllNumInformation(params).then((res) => {
        if (res.data) {
          arr = res.data
          this.numList = arr
        } else {
          this.numList = {}
        }
      })
    },
    // tab切换回调
    typeClick(name) {
      this.chooseType = name
      this.getPressurePoint()
      this.getNum()
    },
    tabClick(name) {
      this.chooseTab = name
      this.getPressurePoint()
      this.getNum()
    },
    stateChange(val) {
      this.state = val
      if (this.state == '全部') {
        this.isWarn = ''
      } else if (this.state == '告警') {
        this.isWarn = 3
      } else if (this.state == '一般') {
        this.isWarn = 2
      } else if (this.state == '预警') {
        this.isWarn = 1
      }else if(this.state == '离线') {
        this.isWarn = 5
      }
      this.getPressurePoint()
    },
    detail(item) {
      let arr = item.realtimeData.filter((item) => {
        return item.isShow == 0
      })
      return arr
    },
    onSearch(val) {
      // 空条件等同于清空
      if (val === '' || !val) {
        this.onClear()
      } else {
        this.searchValue = val
        this.getPressurePoint()
        this.getNum()
      }
    },
    onClear() {
      this.searchValue = ''
      this.getPressurePoint()
      this.getNum()
    },
    cardOpen(item) {
      let pressureDataDetail = _cloneDeep(item)
      this.$router.push({
        name: 'pressureDetails',
        query: {
          data: JSON.stringify(pressureDataDetail),
        },
      })
      return
    },
  },
}
</script>

<style scoped lang="less">
.list {
  width: 100%;
  height: calc(100% - 168px - env(safe-area-inset-bottom));
  background: #f5f7f9;
  .topTab {
    height: 17%;
    background-color: #ffffff;
    /deep/ .fm-tab {
      font-size: 32px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
    /deep/ .fm-tab--active {
      font-size: 36px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;
    }
    /deep/ .fm-tabs__active-bar {
      height: 6px;
      background: linear-gradient(
        270deg,
        rgba(27, 103, 216, 0) 0%,
        rgba(27, 103, 216, 0.31) 53%,
        #0784fb 100%
      );
      border-radius: 4px;
      opacity: 0.6;
    }
    /deep/ .fm-tabs--line .fm-tabs__wrap {
      line-height: 50px;
      height: 50px;
    }
    /deep/.fm-tabs__line {
      background: linear-gradient(
        270deg,
        rgba(58, 160, 238, 0) 0%,
        #1b67d8 100%
      );
      border-radius: 7px;
      height: 14px;
    }
  }
  .middleList {
    height: 11%;
    width: calc(100% - 60px);
    padding: 30px;
    display: flex;
    flex-direction: row;
    .item {
      width: 122px;
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 19px;
      background: #ffffff;
      border-radius: 8px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 40px;
    }
    .blue {
      color: #1b67d8;
    }
    .red {
      color: #ff4a4a;
    }
    .orange {
      color: #ff9429;
    }
    .yellow {
      color: #ffcb27;
    }
    .gray {
      color: #999999;
    }
    .green {
      color: #40bb5a;
    }
    .active {
      background-color: #dde8f9;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        top: 120px;
        width: 0;
        height: 0;
        border: 15px solid #dde8f9;
        border-color: #dde8f9 transparent transparent transparent;
      }
    }
  }
  .bottomList {
    height: 72%;
    width: 100%;
    overflow-y: scroll;
    padding: 0 30px;
    .card {
      width: calc(100% - 60px);
      margin-bottom: 24px;
      background: #ffffff;
      box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
      border-radius: 16px;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 102px;
        border-radius: 16px;
        .name {
          font-size: 36px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #191919;
          width: 54%;
          margin-left: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .time {
          font-size: 28px;
          margin-right: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #adadad;
          width: 43%;
        }
      }
      .warn {
        background: linear-gradient(
          270deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 74, 74, 0.1) 100%
        );
      }
      .yuwarn {
        background: linear-gradient(
          270deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 142, 0, 0.1) 100%
        );
      }
      .normal {
        background: linear-gradient(
          270deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 203, 39, 0.1) 100%
        );
      }
      .iotOnline {
        background: linear-gradient(
          270deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(153, 153, 153, 0.15) 100%
        );
      }      
      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 21px 0 23px 0;
        margin: 0 30px;
        border-bottom: 1px solid #f5f5f5;
        .type {
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
        }
        .value {
          font-size: 24px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #999999;
          .v {
            font-size: 32px;
            margin-right: 10px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #191919;
          }
        }
      }
    }
  }
  /deep/.fm-search {
  }
  /deep/.fm-search__content {
    height: 72px;
    background: #ffffff;
    border-radius: 16px;
  }
}
</style>