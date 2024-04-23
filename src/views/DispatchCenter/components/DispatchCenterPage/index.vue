<template>
  <div class="DispatchCenterPage">
    <div class="forecast" @click="forecastClick">
      <img src="@/assets/img/dispatchCenter/预测.png" alt="" />
      <span>预测</span>
    </div>
    <div class="recommend" @click="recommendClick">
      <img src="@/assets/img/dispatchCenter/推荐.png" alt="" />
      <span>推荐</span>
    </div>
    <div v-if="scrollTop > 700" class="backToTop" @click="backToTopClick">
      <img src="@/assets/img/dispatchCenter/回到顶部.png" alt="" />
    </div>
    <div class="contentSide">
      <div class="leftSide">
        <div class="textCommon text01"><span>原</span><span>水</span></div>
        <div class="textCommon text02"><span>制</span><span>水</span></div>
        <div class="textCommon text03"><span>输</span><span>水</span></div>
        <div class="textCommon text04"><span>配</span><span>水</span></div>
      </div>
      <div class="rightSide">
        <div class="Card01">
          <div class="topSide1">{{ '原水泵站' }}</div>
          <div class="bottomSide1">
            <img src="@/assets/img/dispatchCenter/原水泵站蓝.png" alt="" />
            <img src="@/assets/img/dispatchCenter/原水泵站蓝.png" alt="" />
            <img src="@/assets/img/dispatchCenter/原水泵站蓝.png" alt="" />
            <img src="@/assets/img/dispatchCenter/原水泵站蓝.png" alt="" />
            <div class="HzStyle">
              <div
                class="hzText"
                v-for="(item, index) in configData['原水泵站1'].pointCode"
                :key="item"
              >
                {{ configData['原水泵站1'].value[index] }} {{ configData['原水泵站1'].unit[index] }}
              </div>
            </div>
          </div>
        </div>
        <div class="Card02">
          <!-- 图片使用定位 -->
          <img class="img21" src="@/assets/img/dispatchCenter/蓝条.png" alt="" />
          <img class="img22" src="@/assets/img/dispatchCenter/蓝条.png" alt="" />
          <div
            class="littleCard"
            v-for="(item, index) in configData['原水泵站2'].pointCode"
            :key="item"
          >
            {{ configData['原水泵站2'].text[index] }}:
            {{ configData['原水泵站2'].value[index] }}
            {{ configData['原水泵站2'].unit[index] }}
          </div>
        </div>
        <div class="Card03">
          <div class="topSide3">{{ '1#水厂' }}</div>
          <div class="bottomSide3">
            <span class="textC"
              >{{ configData['1#水厂1'].value[0] }}{{ configData['1#水厂1'].unit[0] }}</span
            >
            <img src="@/assets/img/dispatchCenter/两个水厂.png" alt="" />
            <span class="textC"
              >{{ configData['1#水厂1'].value[1] }}{{ configData['1#水厂1'].unit[1] }}</span
            >
          </div>
        </div>
        <div class="Card04">
          <img class="img4" src="@/assets/img/dispatchCenter/流程线.png" alt="" />
          <div class="littleCardTop">
            <div class="Card00T">
              <div
                class="twoLineTextStyle threeLine"
                v-for="(item, index) in configData['1#水厂2'].pointCode"
                :key="item"
              >
                <span>
                  {{ configData['1#水厂2'].text[index] }}:
                  {{ configData['1#水厂2'].value[index] }}
                  {{ configData['1#水厂2'].unit[index] }}
                </span>
              </div>
            </div>
          </div>
          <div class="littleCardBottom">
            <!-- 1#进口 -->
            <div class="Card00Common">
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['1#泵站'].text[0] }}:
                  {{ configData['1#泵站'].value[0] }}
                  {{ configData['1#泵站'].unit[0] }}
                </span>
              </div>
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['1#泵站'].text[1] }}:
                  {{ configData['1#泵站'].value[1] }}
                  {{ configData['1#泵站'].unit[1] }}
                </span>
              </div>
            </div>
            <!-- 3#进口 -->
            <div class="Card00Common">
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['3#泵站'].text[0] }}:
                  {{ configData['3#泵站'].value[0] }}
                  {{ configData['3#泵站'].unit[0] }}
                </span>
              </div>
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['3#泵站'].text[1] }}:
                  {{ configData['3#泵站'].value[1] }}
                  {{ configData['3#泵站'].unit[1] }}
                </span>
              </div>
            </div>
            <!-- 2#进口 -->
            <div class="Card00Common">
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['2#泵站'].text[0] }}:
                  {{ configData['2#泵站'].value[0] }}
                  {{ configData['2#泵站'].unit[0] }}
                </span>
              </div>
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['2#泵站'].text[1] }}:
                  {{ configData['2#泵站'].value[1] }}
                  {{ configData['2#泵站'].unit[1] }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="Card05">
          <!-- 点击1#泵站，展示BC；点击2#，展示AF、点击3#泵站，展示DEG -->
          <div
            class="bigCardCommon"
            @click="chooseOneCard('BC')"
            :class="nowChooseCard == 'BC' ? 'showBorder' : ''"
          >
            <div class="text005T">{{ '1#泵站' }}</div>
            <div class="img005B">
              <img
                v-for="(item, index) in pumpStatus1"
                :key="index"
                class="img5"
                :src="item.isRun == true ? pumpY : pumpG"
                alt=""
              />
            </div>
          </div>
          <div
            class="bigCardCommon"
            @click="chooseOneCard('DEG')"
            :class="nowChooseCard == 'DEG' ? 'showBorder' : ''"
          >
            <div class="text005T">{{ '3#泵站' }}</div>
            <div class="img005B">
              <img
                v-for="(item, index) in pumpStatus3"
                :key="index"
                class="img5"
                :src="item.isRun == true ? pumpY : pumpG"
                alt=""
              />
            </div>
          </div>
          <div
            class="bigCardCommon"
            @click="chooseOneCard('AF')"
            :class="nowChooseCard == 'AF' ? 'showBorder' : ''"
          >
            <div class="text005T">{{ '2#泵站' }}</div>
            <div class="img005B">
              <img
                v-for="(item, index) in pumpStatus2"
                :key="index"
                class="img5"
                :src="item.isRun == true ? pumpY : pumpG"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="Card06">
          <div class="backgroundImg">
            <img
              class="img6"
              :class="nowChooseCard == 'BC' ? 'showShadowImg' : ''"
              src="@/assets/img/dispatchCenter/蓝条.png"
              alt=""
            />
            <img
              class="img6"
              :class="nowChooseCard == 'DEG' ? 'showShadowImg' : ''"
              src="@/assets/img/dispatchCenter/蓝条.png"
              alt=""
            />
            <img
              class="img6"
              :class="nowChooseCard == 'AF' ? 'showShadowImg' : ''"
              src="@/assets/img/dispatchCenter/蓝条.png"
              alt=""
            />
          </div>
          <div class="threeCard">
            <!-- 1#出口 -->
            <div class="Card006" :class="nowChooseCard == 'BC' ? 'showShadow' : ''">
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['1#泵站'].text[2] }}:
                  {{ configData['1#泵站'].value[2] }}
                  {{ configData['1#泵站'].unit[2] }}
                </span>
              </div>
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['1#泵站'].text[3] }}:
                  {{ configData['1#泵站'].value[3] }}
                  {{ configData['1#泵站'].unit[3] }}
                </span>
              </div>
            </div>
            <!-- 3#出口 -->
            <div class="Card006" :class="nowChooseCard == 'DEG' ? 'showShadow' : ''">
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['3#泵站'].text[2] }}:
                  {{ configData['3#泵站'].value[2] }}
                  {{ configData['3#泵站'].unit[2] }}
                </span>
              </div>
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['3#泵站'].text[3] }}:
                  {{ configData['3#泵站'].value[3] }}
                  {{ configData['3#泵站'].unit[3] }}
                </span>
              </div>
            </div>
            <!-- 2#出口 -->
            <div class="Card006" :class="nowChooseCard == 'AF' ? 'showShadow' : ''">
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['2#泵站'].text[2] }}:
                  {{ configData['2#泵站'].value[2] }}
                  {{ configData['2#泵站'].unit[2] }}
                </span>
              </div>
              <div class="twoLineTextStyle">
                <span>
                  {{ configData['2#泵站'].text[3] }}:
                  {{ configData['2#泵站'].value[3] }}
                  {{ configData['2#泵站'].unit[3] }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="Card07">
          <div class="topTitle">
            <div class="leftText">{{ nowChooseCard }}片区</div>
            <div class="rightButton" @click="pressureHotMap">压力热力图</div>
          </div>
          <div v-for="(item, index) in areaDataArray" :key="index" class="infoCard">
            <div class="text007">
              <span>{{ item.monitorName }}</span>
            </div>
            <div class="content007">
              <div class="line007" v-for="(item1, index1) in item.realtimeData" :key="index1">
                <img
                  :src="item1.name == '时间' ? img01 : item1.name == '压力值' ? img02 : img03"
                  alt=""
                />
                <span class="leftColor">{{ item1.name }}:</span>
                <span class="rightColor">{{ item1.val }} {{ item1.desc }}</span>
              </div>
              <!-- <div class="line007">
                <img src="@/assets/img/dispatchCenter/压力icon.png" alt="" />
                <span class="leftColor">压力：</span>
                <span class="rightColor">0.21 Mpa</span>
              </div>
              <div class="line007">
                <img src="@/assets/img/dispatchCenter/流量icon.png" alt="" />
                <span class="leftColor">流量：</span>
                <span class="rightColor">1231 m³/h</span>
              </div>
              <div class="line007">
                <img src="@/assets/img/dispatchCenter/时间icon.png" alt="" />
                <span class="leftColor">时间：</span>
                <span class="rightColor">2022-6-24 12:12</span>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from './api.js'
import _cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'DispatchCenterPage',

  data() {
    return {
      img01: require('@/assets/img/dispatchCenter/时间icon.png'),
      img02: require('@/assets/img/dispatchCenter/压力icon.png'),
      img03: require('@/assets/img/dispatchCenter/流量icon.png'),
      pumpY: require('@/assets/img/dispatchCenter/泵站黄.png'),
      pumpG: require('@/assets/img/dispatchCenter/泵站灰.png'),
      // 默认或当前选中泵站模块
      nowChooseCard: 'BC',
      // BCD片区数据数组
      areaDataArray: [],
      scrollTop: -1,
      // 回到顶部定时器
      upRoll: null,
      topDistance: null,
      // 概化图数据
      centerData: {},
      // 页面数据-----
      configData: {
        原水泵站1: {
          pointCode: [
            'ns=100;s=BF1.YSB.YSB1.PL.PV', // 原水泵站中泵组运行频率（该泵站中包含4个泵，分别展示4个泵频率，单位Hz）
            'ns=100;s=BF1.YSB.YSB2.PL.PV', // 原水泵站中泵组运行频率（该泵站中包含4个泵，分别展示4个泵频率，单位Hz）
            'ns=100;s=BF1.YSB.YSB3.PL.PV', // 原水泵站中泵组运行频率（该泵站中包含4个泵，分别展示4个泵频率，单位Hz）
            'ns=100;s=BF1.YSB.YSB4.PL.PV', // 原水泵站中泵组运行频率（该泵站中包含4个泵，分别展示4个泵频率，单位Hz）
          ],
          text: ['', '', '', ''],
          value: ['--', '--', '--', '--'],
          unit: ['Hz', 'Hz', 'Hz', 'Hz'],
        },
        原水泵站2: {
          pointCode: [
            'ns=100;s=BF1.CSG.CSG1CSKYL.PV', // 原水泵站出水压力；分为两个出水口，都进入1#水厂
            'ns=100;s=BF1.CSG.CSG2CSKYL.PV', // 原水泵站出水压力；分为两个出水口，都进入1#水厂
          ],
          text: ['压力', '压力'],
          value: ['--', '--'],
          unit: ['MPa', 'MPa'],
        },
        '1#水厂1': {
          pointCode: [
            'ns=100;s=QSC01.SSYW.PV', // 1#水厂清水池瞬时液位
            'ns=100;s=QSC02.SSYW.PV', // 1#水厂清水池瞬时液位
          ],
          text: ['', ''],
          value: ['--', '--'],
          unit: ['m', 'm'],
        },
        '1#水厂2': {
          pointCode: [
            // 'ns=101;s=QSC2.JSSSLL.PV', // 1#水厂进口瞬时流量 'm³/h'
            'ns=101;s=CSZG.SSLL.PV', // 1#水厂总出水流量
            'ns=101;s=CSZG.LJLL.PV', // 1#水厂总出水累计流量
            'ns=101;s=CSZG.YL.PV', // 1#水厂出水总管压力
          ],
          text: ['总出水流量', '总出水累计流量', '出水总管压力'],
          value: ['--', '--', '--'],
          unit: ['m³/h', 'm³', 'MPa'],
        },
        '1#泵站': {
          pointCode: [
            'ns=100;s=GWRK.SSLL.PV', // 1#泵站进口瞬时流量
            'ns=100;s=GWRK.LJLL.PV', // 1#泵站进口累计流量
            'ns=100;s=CKMG.SSLL.PV', // 1#泵站出口瞬时流量
            'ns=100;s=CKMG.LJLL.PV', // 1#泵站出口累计流量
          ],
          text: ['瞬时流量', '累计流量', '瞬时流量', '累计流量'],
          value: ['--', '--', '--', '--'],
          unit: ['m³/h', 'm³', 'm³/h', 'm³'],
        },
        '3#泵站': {
          pointCode: [
            'ns=104;s=GWRK.SSLL.PV', // 3#泵站进口瞬时流量
            'ns=104;s=GWRK.LJLL.PV', // 3#泵站进口累计流量
            'ns=104;s=CKMG.SSLL.PV', // 3#泵站出口瞬时流量
            'ns=104;s=CKMG.LJLL.PV', // 3#泵站出口累计流量
          ],
          text: ['瞬时流量', '累计流量', '瞬时流量', '累计流量'],
          value: ['--', '--', '--', '--'],
          unit: ['m³/h', 'm³', 'm³/h', 'm³'],
        },
        '2#泵站': {
          pointCode: ['1', '2', '3', '4'],
          text: ['瞬时流量', '累计流量', '瞬时流量', '累计流量'],
          value: ['--', '--', '--', '--'],
          unit: ['m³/h', 'm³', 'm³/h', 'm³'],
        },
      },
      // 1#泵站8台泵的运行状态
      pumpStatus1: [
        {
          code: 'ns=100;s=DYXT.B1.ZT.PV',
          isRun: false,
        },
        {
          code: 'ns=100;s=DYXT.B2.ZT.PV',
          isRun: false,
        },
        {
          code: 'ns=100;s=DYXT.B3.ZT.PV',
          isRun: false,
        },
        {
          code: 'ns=100;s=DYXT.B4.ZT.PV',
          isRun: false,
        },
        {
          code: 'ns=100;s=XSXT.B1.PL.PV',
          isRun: false,
        },
        {
          code: 'ns=100;s=XSXT.B2.PL.PV',
          isRun: false,
        },
        {
          code: 'ns=100;s=XSXT.B3.PL.PV',
          isRun: false,
        },
        {
          code: 'ns=100;s=XSXT.B4.PL.PV',
          isRun: false,
        },
      ],
      // 3#泵站8台泵的运行状态
      pumpStatus3: [
        {
          code: 'ns=104;s=DYXT.B1.ZT.PV',
          isRun: false,
        },
        {
          code: 'ns=104;s=DYXT.B2.ZT.PV',
          isRun: false,
        },
        {
          code: 'ns=104;s=DYXT.B3.ZT.PV',
          isRun: false,
        },
        {
          code: 'ns=104;s=DYXT.B4.ZT.PV',
          isRun: false,
        },
        {
          code: 'ns=104;s=XSXT.B1.PL.PV',
          isRun: false,
        },
        {
          code: 'ns=104;s=XSXT.B2.PL.PV',
          isRun: false,
        },
        {
          code: 'ns=104;s=XSXT.B3.PL.PV',
          isRun: false,
        },
        {
          code: 'ns=104;s=XSXT.B4.PL.PV',
          isRun: false,
        },
      ],
      // 2#泵站8台泵的运行状态
      pumpStatus2: [
        {
          code: '1',
          isRun: false,
        },
        {
          code: '2',
          isRun: false,
        },
        {
          code: '3',
          isRun: false,
        },
        {
          code: '4',
          isRun: false,
        },
        {
          code: '5',
          isRun: false,
        },
        {
          code: '6',
          isRun: false,
        },
        {
          code: '7',
          isRun: false,
        },
        {
          code: '8',
          isRun: false,
        },
      ],
    }
  },
  created() {
    // 获取概化图数据
    this.getGraph()
    // 获取泵组下各个泵站开启状态数据
    this.getPumpStatus()
    // 查询概化图片区详情，进入页面默认查询BC片区
    this.getGraphCommunity(this.nowChooseCard)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollMethod, true)
  },
  mounted() {
    window.addEventListener('scroll', this.scrollMethod, true)
  },
  methods: {
    // 获取概化图数据
    getGraph() {
      let keyArr = Object.keys(this.configData)
      let itemArr = []
      keyArr.forEach((item) => {
        itemArr.push(this.configData[item])
      })
      console.log('keyArr', keyArr)
      console.log('itemArr', _cloneDeep(itemArr))
      Promise.all(
        itemArr.map((item) => {
          return Api.getGraph(item.pointCode)
        })
      )
        .then((res) => {
          console.log('点表数据', _cloneDeep(res))
          // 遍历res，将每个item的数据赋值给configData中的value
          res.forEach((item, index) => {
            if (item.status && item.data.length > 0) {
              console.log(keyArr[index], this.configData[keyArr[index]])
              this.configData[keyArr[index]].value = item.data.map(
                (item) => item.pointValue || '--'
              )
            }
          })
          console.log('configData', _cloneDeep(this.configData))
        })
        .catch((err) => {})
    },
    // 获取泵组下各个泵站开启状态数据
    getPumpStatus() {
      let point1 = this.pumpStatus1.map((item) => item.code)
      let point2 = this.pumpStatus2.map((item) => item.code)
      let point3 = this.pumpStatus3.map((item) => item.code)

      console.log(point1, point2, point3)

      Promise.all([Api.getGraph(point1), Api.getGraph(point2), Api.getGraph(point3)])
        .then((res) => {
          console.log('泵组下各个泵站开启状态数据', _cloneDeep(res))
          res.forEach((item, index) => {
            if (item.status && item.data.length > 0) {
              this['pumpStatus' + (index + 1)] = item.data.map((item1) => {
                return {
                  code: item1.pointCode,
                  pointValue: item1.pointValue,
                  isRun: item1.isRun,
                  pointStatus: item1.pointStatus,
                }
              })
            }
          })
          console.log('this.pumpStatus1', _cloneDeep(this.pumpStatus1))
          console.log('this.pumpStatus2', _cloneDeep(this.pumpStatus2))
          console.log('this.pumpStatus3', _cloneDeep(this.pumpStatus3))
        })
        .catch((err) => {})
    },
    // 滚动函数
    scrollMethod() {
      var scrollTop = document.querySelector('.DispatchCenterPage').scrollTop
      let clientHeight = document.querySelector('.DispatchCenterPage').clientHeight
      var scrollview = document.querySelector('.DispatchCenterPage').scrollHeight
      // console.log(scrollTop, "scrollTop");
      // console.log(clientHeight, "clientHeight");
      // console.log(scrollview, "scrollview");
      // if (scrollTop + clientHeight >= scrollview) {
      // }
      this.scrollTop = scrollTop
      if (scrollTop >= this.topDistance) {
        clearInterval(this.upRoll)
      }
      // if (scrollTop > 700) {
      // }
    },
    // 返回顶部
    backToTopClick() {
      this.upRoll = setInterval(() => {
        this.topDistance = document.querySelector('.DispatchCenterPage').scrollTop // 每次获取页面被卷去的部分
        const speed = Math.ceil(this.topDistance / 70) // 每次滚动多少（步长值）
        // const speed = 10 // 每次滚动多少（步长值）
        if (document.querySelector('.DispatchCenterPage').scrollTop > 0) {
          document.querySelector('.DispatchCenterPage').scrollTop -= speed // 不在顶部 每次滚动到的位置
        } else {
          clearInterval(this.upRoll) // 回到顶部清除定时器
        }
      }, 5)
    },
    // 预测点击
    forecastClick() {
      console.log('预测')
    },
    // 推荐点击
    recommendClick() {
      console.log('推荐')
    },
    // 点击泵站模块
    chooseOneCard(val) {
      if (this.nowChooseCard == val) return
      // 默认或当前选中泵站模块
      this.nowChooseCard = val
      console.log(val)
      // 查询概化图片区详情
      this.getGraphCommunity(val)
    },
    // 查询概化图片区详情
    getGraphCommunity(val) {
      // 每次点击泵组前清空上一次数据
      this.areaDataArray = []
      let params = {
        community: val.split('').toString(), // BC、AF、DEG
      }
      Api.getGraphCommunity(params).then((res) => {
        if (res.status && res.data.length > 0) {
          // 每个设备筛选出需要展示的功能点
          res.data.forEach((item) => {
            item.realtimeData = item.realtimeData.filter((functionId) => {
              // console.log(functionId.name, functionId.isShow);
              return functionId.isShow === 0
            })
            if (item.realtimeData.length == 0) return
            // 从筛选出来的显示的功能点中添加上时间
            item.realtimeData.push({
              // 卡片展示使用到了name、val、desc
              name: '时间',
              val: item.realtimeData[0]?.time.replaceAll('"', '') || '---',
              desc: '',
            })
          })
          console.log('🚀查询概化图片区详情', res.data)
          // BC、AF、DEG片区数据数组
          this.areaDataArray = res.data
        }
      })
    },
    // 压力热力图点击
    pressureHotMap() {
      console.log('压力热力图点击')
      this.$router.push({
        path: '/DispatchCenter/PressureAnalysis',
      })
    },
  },
}
</script>

<style lang="less" scoped>
.twoLineTextStyle {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  font-size: 20px;
  font-family: DIN-Medium, DIN;
  font-weight: 500;
  color: #13449d;

  span {
    padding-left: 10px;
    /*强制文本在一行内显示*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.threeLine {
  height: 33.33%;
}

.DispatchCenterPage {
  position: relative;
  width: 100%;
  height: calc(100% - 292px);
  background: url('~@/assets/img/dispatchCenter/裂纹背景.png') no-repeat;
  background-size: 750px 2511px;
  background-position-y: -330px;
  overflow-y: scroll;

  // 预测按钮
  .forecast {
    position: fixed;
    top: 400px;
    right: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(25, 25, 25, 0.15);
    border-radius: 16px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    z-index: 2;

    img {
      width: 44px;
    }
  }

  // 推荐按钮
  .recommend {
    position: fixed;
    top: calc(400px + 80px + 32px);
    right: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(25, 25, 25, 0.15);
    border-radius: 16px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    z-index: 2;

    img {
      width: 44px;
    }
  }

  // 回到顶部
  .backToTop {
    position: fixed;
    bottom: 150px;
    right: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(25, 25, 25, 0.15);
    border-radius: 16px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    z-index: 10000;

    img {
      width: 44px;
    }
  }

  .contentSide {
    display: flex;
    justify-content: space-between;
    width: 100%;

    // padding-bottom: 30px;
    // height: 100%;
    // background-color: rgb(156, 255, 181);
    .leftSide {
      width: 64px;
      border: 1px solid transparent;

      // height: 100%;
      // background-color: rgb(240, 168, 255);
      // 相同样式
      .textCommon {
        margin-top: 30px;
        margin-left: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 48px;
        border-radius: 23px;
        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }

      .text01 {
        height: 346px;
        background: rgba(27, 103, 216, 0.12);
        color: #1b67d8;
      }

      .text02 {
        height: 528px;
        background: rgba(0, 189, 121, 0.12);
        color: #00bd79;
      }

      .text03 {
        height: 590px;
        background: rgba(235, 171, 0, 0.12);
        color: #ebab00;
      }

      .text04 {
        margin-bottom: 30px;
        height: 611px;
        background: rgba(111, 98, 255, 0.12);
        color: #6f62ff;
      }
    }

    .rightSide {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: calc(100% - 64px);
      padding-bottom: 30px;

      // height: 100%;
      // background-color: rgb(255, 168, 168);
      .Card01 {
        margin-top: 30px;
        width: 654px;
        height: 263px;
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0px 8px 24px 0px rgba(13, 35, 72, 0.04);
        border-radius: 32px;
        border: 2px solid rgba(113, 194, 255, 0.14);
        // border-image: linear-gradient(227deg, rgba(113, 194, 255, 0.14), rgba(27, 103, 216, 0.14)) 1
        //   1;
        backdrop-filter: blur(3px);

        .topSide1 {
          display: flex;
          align-items: center;
          // width: 100%;
          height: 100px;
          padding-left: 30px;
          font-size: 32px;
          font-family: SFProText-Medium, SFProText;
          font-weight: 500;
          color: #2a0202;
          // background-color: rgb(163, 40, 40);
        }

        .bottomSide1 {
          position: relative;
          display: flex;
          justify-content: center;
          width: 100%;
          height: calc(100% - 100px);

          // background-color: rgb(35, 207, 49);
          img {
            width: 96px;
            height: 96px;
            margin: 0 16px;
          }

          .HzStyle {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            width: 100%;
            height: 40px;
            // background-color: rgb(83, 255, 97);
            bottom: 20px;
            font-size: 20px;
            font-family: DIN-Medium, DIN;
            font-weight: 500;
            color: #13449d;

            .hzText {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 96px;
              margin: 0 16px;
            }
          }
        }
      }

      .Card02 {
        position: relative;
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 654px;
        height: 110px;
        // background-color: rgba(255, 162, 162, 0.98);

        .img21 {
          position: absolute;
          top: 0;
          left: 25%;
          // transform: translate(-50%, 0);
          width: 12px;
          height: 100%;
        }

        .img22 {
          position: absolute;
          top: 0;
          right: 25%;
          // transform: translate(-50%, 0);
          width: 12px;
          height: 100%;
        }

        .littleCard {
          // width: 215px;
          display: flex;
          align-items: center;

          padding-left: 16px;
          padding-right: 16px;
          height: 61px;
          background: rgba(59, 196, 246, 0.25);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          z-index: 1;

          font-size: 24px;
          font-family: DIN-Medium, DIN;
          font-weight: 500;
          color: #13449d;
        }
      }

      .Card03 {
        width: 654px;
        height: 243px;
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0px 8px 24px 0px rgba(13, 35, 72, 0.04);
        border-radius: 32px;
        border: 2px solid rgba(113, 194, 255, 0.14);
        // border-image: linear-gradient(227deg, rgba(113, 194, 255, 0.14), rgba(27, 103, 216, 0.14)) 1
        //   1;
        backdrop-filter: blur(3px);

        .topSide3 {
          display: flex;
          align-items: center;
          // width: 100%;
          height: 100px;
          padding-left: 30px;
          font-size: 32px;
          font-family: SFProText-Medium, SFProText;
          font-weight: 500;
          color: #2a0202;
          // background-color: rgb(163, 40, 40);
        }

        .bottomSide3 {
          display: flex;
          justify-content: center;
          width: 100%;
          height: calc(100% - 100px);

          // background-color: rgb(35, 207, 49);
          img {
            width: 272px;
            height: 96px;
            margin: 0 22px;
          }

          .textC {
            height: 96px;
            font-size: 28px;
            font-family: DIN-Medium, DIN;
            font-weight: 500;
            color: #555555;
            line-height: 96px;
          }
        }
      }

      .Card04 {
        position: relative;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        width: 654px;
        height: 309px;
        // background-color: rgba(182, 255, 182, 0.98);

        .img4 {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, 0);
          width: 488px;
          height: 100%;
        }

        .littleCardTop {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 152px;
          // background-color: rgb(255, 143, 143);
          z-index: 1000;

          .Card00T {
            width: 340px;
            height: 120px;
            background: rgba(59, 196, 246, 0.25);
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }
        }

        .littleCardBottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: calc(100% - 152px);
          // background-color: rgb(148, 255, 171);
          z-index: 1000;

          .Card00Common {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 206px;
            height: 96px;
            background: rgba(59, 196, 246, 0.25);
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }
        }
      }

      .Card05 {
        display: flex;
        justify-content: space-between;

        width: 654px;
        height: 469px;

        // background-color: rgba(230, 255, 89, 0.98);
        .showBorder {
          // 选中时添加border
          border: 2px solid rgba(113, 194, 255, 0.44);
        }

        .bigCardCommon {
          width: 207px;
          height: 100%;
          background: rgba(255, 255, 255, 0.08);
          box-sizing: border-box;
          box-shadow: 0px 8px 24px 0px rgba(13, 35, 72, 0.04),
            0px 0px 8px 0px rgba(27, 113, 216, 0.15);
          border-radius: 32px;
          // 选中时添加border
          // border: 2px solid rgba(113, 194, 255, 0.14);
          // border-image: linear-gradient(227deg, rgba(113, 194, 255, 0.4), rgba(78, 136, 221, 0.4)) 2
          //   2;
          backdrop-filter: blur(6px);

          .text005T {
            display: flex;
            align-items: center;
            padding-left: 20px;
            padding-right: 20px;
            text-align: center;
            // width: 100%;
            height: 105px;
            font-size: 28px;
            font-family: SFProText-Medium, SFProText;
            font-weight: 500;
            color: #2a0202;
          }

          .img005B {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            // width: 100%;
            height: calc(100% - 105px);
            padding: 0 30px;

            .img5 {
              width: 58px;
              height: 58px;
            }
          }
        }
      }

      .Card06 {
        position: relative;
        width: 654px;
        height: 151px;
        // background-color: rgba(89, 255, 172, 0.98);

        .backgroundImg {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          justify-content: space-around;

          width: 100%;
          height: 100%;

          .showShadowImg {
            // 选中时添加shadow
            box-shadow: 0px 0px 8px 0px rgba(27, 113, 216, 0.56);
          }

          .img6 {
            width: 12px;
            height: 100%;
          }
        }

        .threeCard {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 100%;

          .showShadow {
            // 选中时添加shadow
            box-shadow: 0px 0px 8px 0px rgba(27, 113, 216, 0.36);
          }

          .Card006 {
            width: 206px;
            height: 96px;
            background: rgba(59, 196, 246, 0.25);
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }
        }
      }

      // 由内容撑开高度
      .Card07 {
        width: 654px;
        // height: 611px;
        padding-bottom: 14px;
        margin-bottom: 100px;
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0px 8px 24px 0px rgba(13, 35, 72, 0.04),
          0px 0px 8px 0px rgba(27, 113, 216, 0.15);
        border-radius: 32px;
        border: 2px solid rgba(113, 194, 255, 0.44);
        // border-image: linear-gradient(227deg, rgba(113, 194, 255, 0.4), rgba(78, 136, 221, 0.4)) 2 2;
        backdrop-filter: blur(6px);

        // background: rgba(255, 95, 89, 0.98);
        .topTitle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          // width: 100%;
          height: 105px;
          padding: 0 30px;
          // background-color: rgb(128, 255, 166);

          .leftText {
            font-size: 32px;
            font-family: SFProText-Medium, SFProText;
            font-weight: 500;
            color: #2a0202;
          }

          .rightButton {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 160px;
            height: 44px;
            background: rgba(255, 255, 255, 0.32);
            border-radius: 21px;
            border: 1px solid #1b67d8;

            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1b67d8;
          }
        }

        .infoCard {
          width: 100%;
          height: 230px;
          margin-top: 14px;
          // background-color: rgb(119, 139, 255);

          .text007 {
            display: flex;
            align-items: center;
            width: 100%;
            height: 50px;
            font-size: 32px;
            font-family: PingFangSC;
            color: #191919;
            // background-color: rgb(252, 64, 127);

            span {
              padding-left: 30px;
              padding-right: 30px;
              /*强制文本在一行内显示*/
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .content007 {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            width: 100%;
            margin-top: 10px;
            height: calc(100% - 60px);

            .line007 {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              width: 100%;
              height: 40px;
              // background-color: rgb(46, 224, 100);

              img {
                width: 32px;
                height: 32px;
                margin-left: 28px;
              }

              .leftColor {
                width: 150px;
                margin-left: 12px;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
              }

              .rightColor {
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #555555;
              }
            }
          }
        }
      }
    }
  }
}
</style>
