<!-- '管线详情面板' -->
<template>
  <div class="arrow-up" :style="mainListStyle" :class="isFullClient ? 'fullBackColor' : ''">
    <div class="topSideBar" v-if="isFullClient">
      <img src="@/assets/img/map/返回.png" alt="" @click="closePopup_line">
      <div class="errorText" @click="reviseForm">
        <img src="@/assets/img/map/纠错.png" alt="">
        <span>纠错</span>
      </div>
    </div>
    <div class="line-c" :class="isFullClient ? 'lessLength' : ''">
      <!-- <div class="beat" v-if="mainListStyle['--top'] == 0"><i class="fm-icon fm-icon-arrow-left" @click="closePopup_line"></i></div> -->
      <div class="lineStyle" id="arrowUp">
        <img class="close" :src="require('@/assets/img/map/矩形.png')" alt="" />
        <div class="content">
          <div class="topLeft">
            <img
              style="height: 25px; margin-right: 10px"
              src="@/assets/img/map/lineTitle.png"
              alt=""
            />
            <div
              style="
                width: 90%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{
                pipelineDataSelf.objectid
                  ? pipelineDataSelf.objectid
                  : pipelineDataSelf.id
                  ? pipelineDataSelf.id
                  : pipelineDataSelf.fid
              }}
            </div>
          </div>
          <div class="top-r">
            <div class="topRight">
              {{
                pipelineDataSelf.line_type
                  ? pipelineDataSelf.line_type
                  : pipelineDataSelf.pipe_category
                  ? pipelineDataSelf.pipe_category
                  : pipelineDataSelf.category
              }}
            </div>
            <!-- <i class="fm-icon fm-icon-cross" @click="closePopup_line"></i> -->
          </div>
        </div>
        <div class="centerSide">
          <div class="value">
            <img
              style="height: 20px; margin-right: 10px"
              src="@/assets/img/map/road.png"
              alt=""
            />
            <div class="leftText">所在道路：</div>
            <div class="rightText">{{ pipelineDataSelf.road_name }}</div>
          </div>
          <div class="value">
            <img
              style="height: 20px; margin-right: 10px"
              src="@/assets/img/map/diameter.png"
              alt=""
            />
            <div class="leftText">管径：</div>
            <div class="rightText">
              {{
                pipelineDataSelf.caliber_section_size
                  ? pipelineDataSelf.caliber_section_size
                  : pipelineDataSelf.section_data1
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="list">
        <div class="tab-top">
          <fm-tabs
            v-model="chooseTab"
            @tab-click="tabClick"
            type="card"
            color="#1B67D8"
          >
            <fm-tab
              v-for="(item, index) in tabArr"
              :label="item.label"
              :name="item.name"
              :key="index"
            >
            </fm-tab>
          </fm-tabs>
        </div>
        <div v-if="chooseTab == '基础信息'" class="basic">
          <fm-cell-group>
            <fm-cell
              title="管线种类："
              :value="
                pipelineDataSelf.line_type
                  ? pipelineDataSelf.line_type
                  : pipelineDataSelf.pipe_category
                  ? pipelineDataSelf.pipe_category
                  : pipelineDataSelf.category
              "
            />
            <fm-cell
              title="管线级别："
              :value="
                pipelineDataSelf.line_class
                  ? pipelineDataSelf.line_class
                  : pipelineDataSelf.pipe_class
              "
            />
            <fm-cell
              title="规格(m)："
              :value="
                pipelineDataSelf.caliber_section_size
                  ? pipelineDataSelf.caliber_section_size
                  : pipelineDataSelf.section_data1
              "
            />
            <fm-cell
              title="管线长度(m)："
              :value="pipelineDataSelf.pipe_length"
            />
            <fm-cell
              title="起点管内底标高(m)："
              :value="pipelineDataSelf.start_surface_elev"
            />
            <fm-cell
              title="终点管内底标高(m)："
              :value="pipelineDataSelf.end_surface_elev"
            />
            <fm-cell title="管线材质：" :value="pipelineDataSelf.material" />
            <fm-cell title="所属社区：" :value="pipelineDataSelf.water_area" />
            <fm-cell title="所在道路：" :value="pipelineDataSelf.road_name" />
            <fm-cell
              title="运维单位："
              :value="pipelineDataSelf.maintenance_unit"
            />
          </fm-cell-group>
        </div>
        <div v-if="chooseTab == '运维信息'" class="basic">
          <div class="x-j item">
            <div class="top" @click="changeState(contentData_1)">
              <div class="title">
                <div class="mark"></div>
                巡检记录（{{ contentData_1.content.length }}）
              </div>
              <div class="time">
                最新记录{{
                  contentData_1.content[0] &&
                  contentData_1.content[0].inspDate
                    ? contentData_1.content[0].inspDate.substring(0, 10)
                    : ''
                }}
                <i
                  class="fm-icon"
                  :class="
                    contentData_1.open
                      ? 'fm-icon-arrow-up'
                      : 'fm-icon-arrow-down'
                  "
                ></i>
              </div>
            </div>
            <div
              class="k-g"
              v-if="
                contentData_1.open &&
                contentData_1.content &&
                contentData_1.content.length
              "
            >
              <div
                class="content-i"
                v-for="(item, index) in contentData_1.content"
                :key="index"
              >
                <div class="con-t">{{ item.inspDate }}</div>
                <div>{{ item.inspector }}</div>
              </div>
            </div>
            <!-- <fm-empty v-else description="暂无数据" /> -->
          </div>
          <div class="y-h item">
            <div class="top" @click="changeState(contentData_2)">
              <div class="title">
                <div class="mark"></div>
                养护记录（{{ contentData_2.content.length }}）
              </div>
              <div class="time">
                最新记录{{
                  contentData_2.content[0] &&
                  contentData_2.content[0].maintainDate
                    ? contentData_2.content[0].maintainDate.substring(0, 10)
                    : ''
                }}
                <i
                  class="fm-icon"
                  :class="
                    contentData_2.open
                      ? 'fm-icon-arrow-up'
                      : 'fm-icon-arrow-down'
                  "
                ></i>
              </div>
            </div>
            <div
              class="k-g"
              v-if="
                contentData_2.open &&
                contentData_2.content &&
                contentData_2.content.length
              "
            >
              <div
                class="content-i"
                v-for="(item, index) in contentData_2.content"
                :key="index"
              >
                <div class="con-t">{{ item.maintainDate }}</div>
                <div>{{ item.maintainer }}</div>
              </div>
            </div>
            <!-- <fm-empty v-else description="暂无数据" /> -->
          </div>
          <div class="q-x item">
            <div class="top" @click="changeState(contentData_3)">
              <div class="title">
                <div class="mark"></div>
                缺陷记录（{{ contentData_3.content.length }}）
              </div>
              <div class="time">
                最新记录{{
                  contentData_3.content[0] &&
                  contentData_3.content[0].createTime
                    ? contentData_3.content[0].createTime.substring(0, 10)
                    : ''
                }}
                <i
                  class="fm-icon"
                  :class="
                    contentData_3.open
                      ? 'fm-icon-arrow-up'
                      : 'fm-icon-arrow-down'
                  "
                ></i>
              </div>
            </div>
            <div
              class="k-g"
              v-if="
                contentData_3.open &&
                contentData_3.content &&
                contentData_3.content.length
              "
            >
              <div
                class="content-i"
                v-for="(item, index) in contentData_3.content"
                :key="index"
              >
                <div class="con-t">
                  {{
                    item.formValue
                      ? item.formValue.detail
                        ? item.formValue.detail.defectType
                        : ''
                      : ''
                  }}
                </div>
                <fm-tag
                  :type="
                    item.ticketStatusName == '已完结'
                      ? 'success'
                      : item.ticketStatusName == '已作废'
                      ? 'info'
                      : 'primary'
                  "
                >
                  {{ item.ticketStatusName }}</fm-tag
                >
              </div>
            </div>
            <!-- <fm-empty v-else description="暂无数据" /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { queryPipeMaintainInfo } from '../api'
export default {
  props: {
    // 基础信息监测点的feature.properties数据
    pipelineBaseInfo: {
      type: Object,
      default: {},
    },
    // 表名
    equipmentType: {
        type: String,
        default: ()=> {
            return "map_supply_pipe"
        }
    }
  },
  data() {
    return {
      pipelineDataSelf: {}, // 监测设备properties数据
      chooseTab: '基础信息',
      tabArr: [
        { label: '基础信息', name: '基础信息' },
        { label: '运维信息', name: '运维信息' },
      ],
      mainListStyle: {
        '--top': document.body.clientHeight - 150 + 'px',
        '--height': '150px',
        '--background': '',
      },
      clientHeight: document.body.clientHeight,
      contentData_1: {
        open: true,
        content: [],
      },
      contentData_2: {
        open: false,
        content: [],
      },
      contentData_3: {
        open: false,
        content: [],
      },
      accessToken: this.$storage.get('access_token'),
      isFullClient: false, // 是否全屏
    }
  },
  computed: {},
  watch: {
    // isFullClient(newValue, oldValue) {
    //   console.log("这是LineDetail的isFullClient", this.isFullClient); 
    // },
    // 监听设备properties内容
    pipelineBaseInfo: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        // console.log(this.pipelineBaseInfo);
        this.pipelineDataSelf = this.pipelineBaseInfo
        this.queryPipeMaintainInfo()
        this.queryThirdToken()
      },
    },
    //监听表名
    equipmentType: {
      deep: true,
      handler(newValue, oldValue) {
        console.log(newValue, oldValue);
        // 当设施类型与从设备切换到管线时，切换到第一个tab，管线没有照片tab，不然会出现白板
        if (newValue.includes("pipe") && oldValue.includes("pipe")) {
        } else if (newValue.includes("pipe") && !oldValue.includes("pipe")) {
          this.activeName_left = "first"
        }
      },
    },
  },
  created() {
    // 基本信息赋值
    this.pipelineDataSelf = this.pipelineBaseInfo
  },
  mounted() {
    let that = this
    let elem = document.querySelector('#arrowUp')
    elem.addEventListener('click', (e) => {
      e.preventDefault()
      console.log('click event!')
    })
    // elem.addEventListener('touchstart', (e) => {
    //   let evt = e || window.event
    //   let touch = evt.targetTouches[0]
    //   let clientHeight = document.body.clientHeight
    //   let clientY = touch.clientY
    //   if (clientY >= clientHeight * 0.1 && clientY <= clientHeight - 150) {
    //     that.mainListStyle['--top'] = clientY + 'px'
    //     that.mainListStyle['--height'] = clientHeight - clientY + 'px'
    //   }
    // })
    elem.addEventListener('touchmove', (e) => {
      let evt = e || window.event
      let touch = evt.targetTouches[0]
      let clientHeight = document.body.clientHeight
      let clientY = touch.clientY
      if (clientY >= clientHeight * 0.1 && clientY <= clientHeight - 150) {
        that.mainListStyle['--top'] = clientY + 'px'
        that.mainListStyle['--height'] = clientHeight - clientY + 'px'
      }
    })
    elem.addEventListener('touchend', (e) => {
      let evt = e || window.event
      let touch = evt.changedTouches[0]
      let clientHeight = document.body.clientHeight
      let clientY = touch.clientY
      if (clientY >= clientHeight * 0.5 && clientY <= clientHeight - 150) {
        that.mainListStyle['--top'] = clientHeight - 150 + 'px'
        that.mainListStyle['--height'] = 150 + 'px'
        this.isFullClient = false
      } else if (clientY < clientHeight * 0.5) {
        that.mainListStyle['--top'] = '0px'
        that.mainListStyle['--height'] = clientHeight - 0 + 'px'
        this.isFullClient = true
      }
    })
  },
  beforeDestroy() {},
  methods: {
    reviseForm() {
      this.$router.push({
        path: '/OneMap/reviseForm',
        query: {
          info: this.pipelineDataSelf
        }
      })
    },
    queryThirdToken() {
      this.defectLoading = true
      axios({
        url:
          process.env.VUE_APP_THIRD_REQUEST_URL +
          '/main/userCenterApi/sso/tokenByToken', //61环境--开发云--绿色vpn
        method: 'post',
        params: {
          token: this.accessToken,
        },
        headers: {
          Authorization: 'Basic b3V0d29yazp3cGcyMDIw',
        },
      }).then((res) => {
        let token = res.data.resultData.token
        let header = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
        this.queryDangerInfo(header) // 获取工单列表
      })
    },
    queryDangerInfo(header) {
      let params = {
        sysCode: 'outwork',
        smallType: 'defect',
        page: {
          current: 1,
          size: 999,
        },
        extParam: {
          deviceDetail: {
            // id: 372
            id: this.pipelineDataSelf.id,
          },
        },
      }
      axios({
        url:
          process.env.VUE_APP_THIRD_REQUEST_URL +
          '/main/outworkapi/ticketStatisticClient/getTicketList', //所有的--ok
        method: 'post',
        data: params,
        headers: header,
      }).then((res) => {
        this.contentData_3.content = res.data.resultData.records
        this.defectLoading = false
      })
    },
    async queryPipeMaintainInfo() {
      // this.recordLoading = true;
      // this.maintenanceLoading = true;
      let params = {
        pipeId: this.pipelineDataSelf.id,
        table: this.equipmentType,
        // pipeId: 4161,
      }
      let res = await queryPipeMaintainInfo(params)
      this.contentData_1.content = res.data.recordList
      this.contentData_1.content.sort((a, b) => {
        return new Date(b.inspDate) - new Date(a.inspDate)
      })
      this.contentData_2.content = res.data.maintainList
      // this.recordLoading = false;
      // this.maintenanceLoading = false;
    },
    // 点击叉号
    closePopup_line() {
      this.$emit('closePopup_line')
    },
    // tab切换回调
    tabClick(name, title) {
      this.chooseTab = name
    },
    changeState(i) {
      i.open = !i.open
      this.$forceUpdate()
    },
  },
}
</script>

<style scoped lang="less">
.arrow-up {
  position: fixed;
  top: var(--top);
  width: 100%;
  height: var(--height);
  // transition: 0.6s;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fullBackColor {
  background-image: linear-gradient(
    180deg,
    #DAEAFF 0%,
    #edf6ff 40%,
    #F5F7F9 80%,
    #F5F7F9 100%
  );
  z-index: 100000;
  padding-top: 80px;
}
.topSideBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  width: calc(100% - 60px);
  height: 88px;
  margin-bottom: 30px;
  .errorText {
    display: flex;
    align-items: center;
    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191919;
  }
  img {
    width: 48px;
  }
}
.lessLength {
  width: calc(100% - 60px) !important;
}
.line-c {
  // position: absolute;
  // bottom: 0;
  // left: 0;
  // width: calc(100% - 60px);
  width: 100%;
  height: calc(100% - 98px - constant(safe-area-inset-bottom));
  height: calc(100% - 98px - env(safe-area-inset-bottom));
  // height: auto;
  margin: 0 30px;
}
.pic {
  background: linear-gradient(
    180deg,
    #dfedff 0%,
    #edf6ff 44%,
    rgba(243, 248, 255, 0.81) 81%,
    rgba(255, 255, 255, 0) 100%
  );
}
.beat {
  width: 100%;
  height: 88px;
  line-height: 88px;
  margin-bottom: 30px;
  font-size: 42px;
  transition: 1s;
}
.lineStyle {
  width: calc(100% - 60px);
  height: 136px;
  padding: 30px;
  background: #ffffff;
  box-shadow: 0px -6px 12px 0px rgba(104, 115, 127, 0.1);
  margin-bottom: 30px;
  border-radius: 24px;
  .close {
    height: 8px;
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .content {
    width: 100%;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    .topLeft {
      font-size: 36px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;
      display: flex;
      width: 90%;
    }
    .top-r {
      display: flex;
      flex-direction: row;
      font-size: 36px;
    }

    .topRight {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 48px;
      margin-right: 10px;
      background: rgba(255, 148, 41, 0.1);
      border-radius: 4px;
      font-size: 25px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff9429;
      img {
        width: 17px;
        height: 17px;
      }
    }
  }
  .centerSide {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    overflow-x: scroll;
    .value {
      height: 40px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .rightText {
        color: #555555;
      }
    }
  }
}
.list {
  width: calc(100% - 60px);
  // height: 166px;
  padding: 30px;
  // background: #ec7777;
  background: #ffffff;
  box-shadow: 0px 0px 12px 0px rgba(104, 115, 127, 0.1);
  // margin-bottom: 30px;
  border-radius: 24px;
  height: calc(100% - 386px);
  .tab-top {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    /deep/.fm-tabs__nav--card {
      border-color: transparent !important;
    }
    /deep/.fm-tab {
      color: #555555 !important;
      width: 202px !important;
      height: 56px;
      box-shadow: 0px 8px 16px 0px rgba(104, 115, 127, 0.06);
      border-radius: 32px;
      border-right: none !important;
      background-color: #f5f5f5;
    }
    /deep/.fm-tab--active {
      color: #ffffff !important;
      width: 202px !important;
      height: 56px;
      border-radius: 32px;
    }
  }
  .basic {
    width: 100%;
    height: calc(100% - 60px);
    overflow-y: scroll;
    .item {
      width: calc(100% - 60px);
      padding: 40px 30px;
      border-radius: 24px;
      margin-bottom: 30px;
      font-size: 32px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #191919;
      .top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 45px;
      }
      .k-g {
        height: 370px;
        overflow-y: scroll;
      }
      .content-i {
        width: 100%;
        display: flex;
        align-items: center;
        line-height: 80px;
        font-size: 28px;
        font-family: DIN-Medium, DIN;
        font-weight: 500;
        color: #555555;
        .con-t {
          margin-right: 50px;
          margin-left: 30px;
        }
      }
      .time {
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
      .title {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .fm-icon {
        color: #1b67d8;
        margin-left: 10px;
        font-size: 16px;
      }
    }
    .x-j {
      background-color: rgb(236, 242, 252);
      .mark {
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background: #1b67d8;
        margin-right: 16px;
      }
    }
    .y-h {
      background-color: rgb(244, 253, 247);
      .mark {
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background: #5cdc83;
        margin-right: 16px;
      }
    }
    .q-x {
      background-color: rgb(255, 250, 244);
      .mark {
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background: #ffb256;
        margin-right: 16px;
      }
    }
  }
  /deep/.fm-cell {
    padding: 0.26667rem 0;
  }
  /deep/.fm-cell__title {
    font-size: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
  }
  /deep/.fm-cell__value {
    font-size: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
  }
}
</style>
