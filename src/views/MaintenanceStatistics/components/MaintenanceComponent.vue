<template>
  <div class="commonComponents">
    <ChangeBizDate :dateType="dateType" @dateChange="dateChange" />
    <div class="bigCard">
      <div class="topTitle">养护内容</div>
      <div class="bottomContainer">
        <div
          v-for="item1 in cardDataConfig"
          :key="item1.bigType"
          class="commonCard"
          :style="{ borderColor: item1.typeColor, backgroundColor: item1.typeColor + '35' }"
        >
          <img class="topLeftImg" :src="require(`../imgs/${item1.bigType}.png`)" alt="" />

          <div v-for="item2 in item1.dataArr" :key="item2.typeItem" class="littleCard">
            <div class="topSide">
              <img class="littleImg" :src="require(`../imgs/${item2.typeItem}.png`)" alt="" />
              <span class="littleText">{{ item2.typeItem }}</span>
            </div>
            <div class="bottomSide" :style="{ color: item1.typeColor }">
              <span class="bigNumber">{{ item2.showNumber }}</span>
              <span class="smallUnit">{{ item2.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from '../api.js'
import _cloneDeep from 'lodash/cloneDeep'
import ChangeBizDate from './ChangeBizDate.vue'
export default {
  name: 'MaintenanceComponent',
  components: {
    ChangeBizDate,
  },
  data() {
    return {
      dateType: '年',
      netWorkDate: '',
      cardDataConfig: [
        // typeItem对应接口返回的字段名，不能修改
        {
          bigType: '供水',
          typeColor: '#399AEA',
          dataArr: [
            {
              typeItem: '供水阀门',
              showNumber: '',
              unit: '个',
            },
            {
              typeItem: '消防栓',
              showNumber: '',
              unit: '个',
            },
            {
              typeItem: '供水管线',
              showNumber: '',
              unit: 'km',
            },
          ],
        },
        {
          bigType: '污水',
          typeColor: '#91510A',
          dataArr: [
            {
              typeItem: '污水检查井',
              showNumber: '',
              unit: '个',
            },
            {
              typeItem: '污水管线',
              showNumber: '',
              unit: 'km',
            },
            {
              typeItem: '清淤',
              showNumber: '',
              unit: 'm³',
            },
          ],
        },
        {
          bigType: '雨水',
          typeColor: '#27369B',
          dataArr: [
            {
              typeItem: '雨水管线',
              showNumber: '',
              unit: 'km',
            },
            {
              typeItem: '雨水口',
              showNumber: '',
              unit: '个',
            },
            {
              typeItem: '排放口',
              showNumber: '',
              unit: '个',
            },
            {
              typeItem: '雨水检查井',
              showNumber: '',
              unit: '个',
            },
          ],
        },
        {
          bigType: '再生水',
          typeColor: '#00D186',
          dataArr: [
            {
              typeItem: '再生水阀门',
              showNumber: '',
              unit: '个',
            },
            {
              typeItem: '再生水管线',
              showNumber: '',
              unit: 'km',
            },
          ],
        },
      ],
    }
  },
  mounted() {
    this.netWorkDate = this.$dayjs().format('YYYY')
    this.getMaintainData() // 养护信息数据
  },
  methods: {
    // 时间组件日期切换事件，用于控制本组件网络请求日期 netWorkDate 字段
    dateChange(changeType) {
      // console.log(changeType) // subtract or addition
      if (changeType === 'subtract') {
        this.netWorkDate = this.$dayjs(this.netWorkDate).subtract(1, 'year').format('YYYY')
      } else if (changeType === 'addition') {
        this.netWorkDate = this.$dayjs(this.netWorkDate).add(1, 'year').format('YYYY')
      }
      console.log('网络请求用的日期', this.netWorkDate)
      this.getMaintainData() // 养护信息数据
    },
    // 养护信息数据
    getMaintainData() {
      let params = {
        startTime: this.netWorkDate + '-01-01 00:00:00',
        endTime: this.netWorkDate + '-12-31 23:59:59',
      }
      Api.getMaintainData(params).then((res) => {
        if (res.status) {
          console.log('养护信息数据', _cloneDeep(res))
          this.maintainData = res?.data || {}
          // res.data = {
          //   供水管线: 0,
          //   消防栓: 1,
          //   测漏长度: 6.15,
          //   清淤: 0,
          //   再生水阀门: 3,
          //   雨水口: 4058,
          //   雨水检查井: 227,
          //   雨水管线: 0,
          //   排放口: 0,
          //   再生水管线: 0,
          //   污水管线: 0,
          //   供水阀门: 98,
          //   污水检查井: 155,
          // }
          this.cardDataConfig.forEach((item1) => {
            item1.dataArr.forEach((item2) => {
              item2.showNumber = res.data[item2.typeItem]
            })
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.commonComponents {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 24px 30px 100px;
  overflow-y: scroll;
  position: absolute;
  top: 0;
  left: 100%;
  background-color: #F4F6F8;
  transition: all 0.5s;

  .bigCard {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 24px;
    width: 100%;
    height: 1100px;
    border-radius: 16px;
    background: #ffffff;

    .topTitle {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100px;
      padding: 0 30px;
      font-size: 32px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;
      border-bottom: 1px solid #eeeeee90;
    }

    .bottomContainer {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
      height: calc(100% - 100px);
      padding: 0 30px;
      font-size: 26px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #555555;

      .commonCard {
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        padding: 62px 30px 30px;
        border-radius: 16px;
        border: 1px solid;

        .topLeftImg {
          position: absolute;
          top: 0;
          left: 0;
          width: 79px;
          height: 42px;
        }

        .littleCard {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          width: 33.333%;
          height: 105px;

          .topSide {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            height: 50%;

            .littleImg {
              width: 32px;
              max-height: 32px;
              margin-right: 8px;
            }

            .littleText {
              font-size: 26px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #555555;
            }
          }

          .bottomSide {
            display: flex;
            justify-content: flex-start;
            align-items: baseline;
            width: 100%;
            height: 50%;

            .bigNumber {
              font-size: 38px;
              font-family: Helvetica-Bold, Helvetica;
              font-weight: bold;
              margin-left: 32px;
              margin-right: 2px;
            }

            .smallUnit {
              font-size: 28px;
              font-family: Helvetica-Bold, Helvetica;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
}
</style>
