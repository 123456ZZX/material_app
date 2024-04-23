<template>
  <fm-popup
    :visible.sync="visible"
    position="right"
    :style="{ height: '100%', width: '280px'}"
    @close="closePop"
  >
    <div class="mapLegend" :style="{paddingTop: statusBarHeight + 'px'}">
      <template v-if="activeNames.length">
        <div
          class="map-Legend"
          :style="`width: ${width}`"
          :class="{ 'map-legend-single': !isDoubleRow }"
        >
          <div style="padding: 8px 0" v-if="dataSource.length === 1 && hideTitle">
            <fm-row class="fmRowStyle" type="flex" justify="space-around">
              <fm-col
                v-for="item in dataSource[0].options"
                :key="item.id"
                :span="item.span ? item.span : isDoubleRow ? 12 : 24"
                class="fmColStyle"
                :class="!item.clickFlag ? 'borderStyle' : ''"
              >
                <LegendItem
                  :info="item"
                  :shape="shape"
                  @click.native="clickFunc($event, item)"
                ></LegendItem>
              </fm-col>
              <!-- 空元素，当该类型图例下图例个数为单数时，添加该元素用于控制space-around布局 -->
              <fm-col class="emptyStyle" v-if="legend.options.length % 2 != 0" span="12"> </fm-col>
            </fm-row>
          </div>
          <!--  -->
          <div v-else class="legendAll">
            <div class="legendItem" v-for="legend in dataSource" :key="legend.id">
              <!-- // 事件弹窗开关 -->
              <div v-if="legend.eventPopup" class="allPopupStyle">
                <span class="leftText">事件弹窗</span>
                <fm-switch v-model="eventPopupChecked" />
              </div>
              <!-- 图例标题 -->
              <div class="legendTitle">
                <span class="legend-title">{{ legend.label }}</span>
                <div
                  class="checkBoxStyle"
                  :class="legend.titleStatus ? 'selectedBox' : ''"
                  @click="titleClick(legend.label)"
                ></div>
              </div>
              <!-- // 监测点弹窗 -->
              <div v-if="legend.allPopupShow" style="margin-top: 0" class="allPopupStyle">
                <span class="leftText">弹窗</span>
                <fm-switch v-model="monitorPopupChecked" />
              </div>
              <!-- 内容区 -->
              <fm-row class="fmRowStyle" type="flex" justify="space-around">
                <fm-col
                  v-for="item in legend.options"
                  :key="item.id"
                  :span="item.span ? item.span : isDoubleRow ? 12 : 24"
                  class="fmColStyle"
                  :class="!item.clickFlag ? 'borderStyle' : ''"
                >
                  <LegendItem
                    :info="item"
                    :shape="shape"
                    @click.native="clickFunc($event, item, legend.id)"
                  >
                  </LegendItem>
                </fm-col>
                <!-- 空元素，当该类型图例下图例个数为单数时，添加该元素用于控制space-around布局 -->
                <fm-col class="emptyStyle" v-if="legend.options.length % 2 != 0" span="12">
                </fm-col>
              </fm-row>
            </div>
          </div>
        </div>
      </template>
    </div>
  </fm-popup>
</template>
<script>
import { Switch } from 'fawkes-mobile-lib'
import LegendItem from './legendItem.vue'
export default {
  name: 'MapLegend',
  components: {
    LegendItem,
    [Switch.name]: Switch,
  },
  data() {
    return {
      visible: false,
      // 事件弹窗开关
      eventPopupChecked: false,
      // 监测点弹窗
      monitorPopupChecked: false,
    }
  },
  watch: {
    popupShow: {
      handler(newVal) {
        this.visible = newVal
      },
      deep: true,
    },
    // 事件弹窗开关
    eventPopupChecked() {
      // console.log('事件', this.eventPopupChecked)
      this.$emit('eventPopupClick', this.eventPopupChecked)
    },
    // 监测点弹窗开关
    monitorPopupChecked() {
      // console.log('监测点', this.monitorPopupChecked)
      this.$emit('monitorPopupClick', this.monitorPopupChecked)
    },
  },
  props: {
    popupShow: {
      type: Boolean,
      default: false,
    },
    dataSource: {
      default: () => [],
      type: [Array, Object],
    },
    // 展示形状  square: 正方形   rectangle: 细长条矩形   circle: 圆形
    shape: {
      type: String,
      default: 'circle',
    },
    // 是否双列显示 false: 单列   true: 双列
    isDoubleRow: {
      type: Boolean,
      default: true,
    },
    clickFunc: {
      type: Function,
      default: () => {
        return () => {}
      },
    },
    width: {
      type: String,
      default: '',
    },
    // 单个图例时 是否隐藏图例标题
    hideTitle: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    activeNames: {
      get() {
        return this.dataSource.map((i) => i.name)
      },
    },
    statusBarHeight() {
      return this.$store.state.StatusBarHeight
    },    
  },
  methods: {
    closePop() {
      this.$emit('closePop', false)
    },
    // 图例标题点击
    titleClick(legendTitleName) {
      // console.log(legendTitleName); // 图例标题名称
      this.$emit('legendTitleNameClick', legendTitleName)
    },
  },
}
</script>
<style lang="less" scoped>
.mapLegend {
  width: 100%;
  height: 100%;
  .map-Legend {
    width: 100%;
    height: 100%;
    z-index: 999;
    box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.1s;
    &::-webkit-scrollbar {
      // chrome safari
      display: none;
    }
    .legendAll {
      padding-top: 50px;
      padding-bottom: 120px;
      .legendItem {
        margin-top: 16px;
        // 弹窗开关样式
        .allPopupStyle {
          margin-top: 32px;
          // width: 100%;
          height: 96px;
          display: flex;
          justify-content: space-between;
          padding: 0 30px;
          align-items: center;
          // background: #e06b6b;
          .leftText {
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
          /deep/.fm-switch {
            width: 74px;
            height: 32px;
          }
          /deep/.fm-switch__node {
            width: 32px;
            height: 32px;
          }
        }
        .legendTitle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 64px;
          // height: 30px;
          background-color: #f5f7f9;

          .legend-title {
            margin-left: 30px;
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #191919;
          }
          .checkBoxStyle {
            width: 30px;
            height: 30px;
            margin-right: 30px;
            background: #ffffff;
            border-radius: 4px;
            border: 2px solid #dddddd;
          }
          .selectedBox {
            background: #245efd;
            background-image: url('~@/assets/img/map/勾.png');
            background-size: 30px;
          }
        }
        .fmRowStyle {
          background-color: #ffffff;
          // padding: 0 30px;
          .fmColStyle {
            display: flex;
            // justify-content: center;
            align-items: center;
            width: 230px;
            height: 64px;
            margin-top: 24px;
            // margin-left: 32px;
            background: #f1f3f6;
            border-radius: 8px;
          }
          .emptyStyle {
            width: 230px;
            height: 64px;
            margin-top: 24px;
            // background-color: rgb(173, 46, 46);
          }
          .borderStyle {
            background: url('~@/assets/img/map/图例选中.png');
            background-size: 230px;
          }
        }
      }
    }
  }

  .map-legend-single {
    width: 130px;
  }

  .selected {
    color: var(--theme-color);
  }

  .notSelected {
    color: #fff;
  }
}
</style>
