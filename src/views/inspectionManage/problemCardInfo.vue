<!-- '问题上报信息卡片' -->
<template>
  <div class="problemCardInfo" v-if="type === '001'">
    <div class="leftImgStyle">
      <div class="imgStyle">
        <img :src="cardInfo.url" alt="" />
      </div>
    </div>
    <div class="rightTextStyleLeft">
      <div class="commonStyle topTitle">
        <!-- 标题 -->
        <div @click="toDetailPanel(cardInfo)">
          <!-- {{ cardInfo.deviceType.length > 1 ? getZHCN(cardInfo.deviceType) : '' }} -->
          {{ cardInfo.deviceType ? cardInfo.deviceType[0] + '-' + cardInfo.deviceType[1] : cardInfo.deviceType ? cardInfo.deviceType[0] + '-' + cardInfo.deviceType[1] : '' }}
        </div>
        <!-- 右侧定位图标 -->
        <img @click="flyToPoint(cardInfo.lnglat)" src="@/assets/img/inspection/定位.png" alt="" />
      </div>
      <!-- 问题描述 -->
      <div class="commonStyle centerText">
        <span class="text">{{ cardInfo.questionDescribe||"--" }}</span>
      </div>
      <!-- 问题类型 -->
      <div class="commonStyle bottomText">{{ getZHCN(cardInfo.faultTypes) }}</div>
    </div>
  </div>
  <div class="problemCardInfo" v-else>
    <div class="leftImgStyle">
      <div class="imgStyle">
        <img :src="cardInfo.url" alt="" />
      </div>
    </div>
    <div class="rightTextStyleRight">
      <div class="commonStyle topTitle">
        <!-- 标题 -->
        <div @click="toDetailPanel(cardInfo)">
          <!-- {{ cardInfo.deviceType||cardInfo.deviceType }} -->
          {{ cardInfo.deviceType ? cardInfo.deviceType[0] + '-' + cardInfo.deviceType[1] :  '' }}
        </div>
        <!-- 右侧定位图标 -->
        <img @click="flyToPoint(cardInfo.lnglat)" src="@/assets/img/inspection/定位.png" alt="" />
      </div>
      <!-- 问题描述 -->
      <div class="commonStyle centerText ">
        <span class="text">{{ cardInfo.questionDescribe||"-- "}}</span>
      </div>
      <!-- 问题类型 -->
      <div class="commonStyle bottomText">
        <!-- {{ cardInfo.faultTypes || cardInfo.detail.defectType||'--' }} -->
        {{  cardInfo.faultTypes }}
      </div>
    </div>
  </div>
</template>

<script>
import { ENUM } from '@/store/State/stateTypes'
export default {
  props: {
    // 用于区分问题上报和设施缺陷 '001'是问题上报，'002'是设施缺陷
    type: {
      type: String,
      default() {
        return ''
      },
    },
    // 卡片信息
    cardInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  mounted() {
    console.log('卡片数据----------------》',this.cardInfo);
  },
  computed: {
    defectFromDic() {
      console.log('11111111111111111',this.$store.state[ENUM].defectFrom);
      return this.$store.state[ENUM].defectFrom
    },
    faultTypesDic() {
      console.log('22222222222222222',this.$store.state[ENUM].faultTypes);
      return this.$store.state[ENUM].faultTypes
    },
    // 系统字典虽叫defectType，但实际二级为 业务类型/设施类型
    // 业务类型/设施类型
    busDeviceTypeDic() {
      console.log('33333333333333333',this.$store.state[ENUM].defectType);
      return this.$store.state[ENUM].defectType
    },
    getZHCN() {
      return (val) => {
        if (!val) return ''
        try {
          let result = val
          // 翻译二级字典 业务类型/设施类型中  二级字段---设施类型
          if (val instanceof Array) {
            if (this.busDeviceTypeDic.length > 0) {
              this.busDeviceTypeDic.forEach((element) => {
                console.log(val[0] ,'--------------------------', element['zh-CN'],result);
                if (val[0] == element.code || val[0] == element['zh-CN']) {
                  element.child.forEach((second) => {
                    result = val[1]
                    if (val[1] == second.code || val[1] == second['zh-CN']) {
                      result = second['zh-CN']
                    }
                  })
                }
              })
            }
          } else {
            if (this.faultTypesDic.length > 0) {
              this.faultTypesDic.forEach((dic) => {
                console.log(val ,'============================',dic.code, dic['zh-CN'],result);
                if (val == dic.code || val == dic['zh-CN']) {
                  result = dic['zh-CN']
                }
              })
            }
            if (this.defectFromDic.length > 0) {
              this.defectFromDic.forEach((dic) => {
                if (val == dic.code || val == dic['zh-CN']) {
                  result = dic['zh-CN']
                }
              })
            }
            if (this.busDeviceTypeDic.length > 0) {
              this.busDeviceTypeDic.forEach((dic) => {
                if (val == dic.code || val == dic['ch-CN']) {
                  result = dic['zh-CN']
                }
              })
            }
          }
          console.log('----------',result);
          return result
        } catch (error) {
          console.log('error: ', error)
        }
      }
    },
  },
  methods: {
    test(e) { console.log(e) },
    // 定位到某一点
    flyToPoint(lnglat) {
      console.log(lnglat)
      this.$emit('flyToPoint', lnglat)
    },
    // 进入详情页
    toDetailPanel(cardInfo) {
      this.$emit('toDetailPanel', cardInfo)
    },
  },
}
</script>

<style lang="less" scoped>
.problemCardInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 690px;
  height: 210px;
  margin: 20px auto;
  border-radius: 16px;
  box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.1);
  background-color: #fff;

  .leftImgStyle {
    display: flex;
    align-items: center;
    width: 30%;
    height: 100%;

    // background-color: rgb(182, 255, 153);
    .imgStyle {
      position: relative;
      width: 154px;
      height: 154px;
      margin: auto;
      border-radius: 16px;
      overflow: hidden;

      // background-color: red;
      img {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 16px;
      }
    }
  }

  // 问题上报
  .rightTextStyleLeft {
    width: 70%;
    height: 90%;
    // background-color: rgb(255, 136, 156);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: PingFangSC-Regular, PingFang SC;

    .commonStyle {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .topTitle {
      justify-content: space-between;
      height: 40%;
      // background-color: red;
      font-size: 36px;
      font-weight: 600;
      color: #191919;

      img {
        width: 30px;
        height: 39px;
        margin-right: 35px;
      }
    }

    .centerText {
      height: 40%;
      // background-color: green;
      font-size: 28px;
      font-weight: 400;
      color: #333333;

      .text {
        width: 93%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .bottomText {
      height: 40%;
      // background-color: blue;
      font-size: 28px;
      font-weight: 400;
      color: #999999;
    }
  }

  // 设施缺陷
  .rightTextStyleRight {
    width: 70%;
    height: 100%;
    // background-color: rgb(255, 136, 156);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Regular, PingFang SC;

    .commonStyle {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .topTitle {
      justify-content: space-between;
      height: 40%;
      // background-color: red;
      font-size: 36px;
      font-weight: 600;
      color: #191919;

      img {
        width: 30px;
        height: 39px;
        margin-right: 35px;
      }
    }

    .centerText {
      height: 40%;
      // background-color: green;
      font-size: 30px;
      font-weight: 400;
      color: #333333;
    }

    .bottomText {
      height: 40%;
      // background-color: blue;
      font-size: 28px;
      font-weight: 400;
      color: #999999;

      .text {
        width: 93%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
