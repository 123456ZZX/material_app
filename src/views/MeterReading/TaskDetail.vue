<template>
  <div id='TaskDetail'>
    <fm-nav-bar title='用户详情' left-arrow @click-left="$router.replace('/TaskIndex')">
      <!--      <template #right>-->
      <!--        <i class="fm-icon fm-icon-scan rightIcon" @click="scan"></i>-->
      <!--      </template>-->
    </fm-nav-bar>
    <div class='mainContainer'>
      <fm-form @submit='onSubmit'>
        <fm-cell-group>
          <fm-cell>
            <fm-field v-model='userInfo.guestNo' name='客户号' label='客户号' :readonly='true' />
            <fm-field v-model='userInfo.name' name='姓名' label='姓名' :readonly='true' />
            <fm-field v-model='userInfo.phoneOne' name='电话' label='电话' :readonly='true' />
            <fm-field v-model='userInfo.address' name='地址' label='地址' :readonly='true' />
            <fm-field v-model='userInfo.company' name='分公司' label='分公司' :readonly='true' />
            <fm-field v-model='userInfo.businessCompany' name='营业所' label='营业所' :readonly='true' />
          </fm-cell>
          <fm-cell>
            <fm-field v-model='curMeterInfo.meterNum' name='表号' label='表号'>
              <template #input>
                <fm-dropdown-menu :modal='false'>
                  <fm-dropdown-item v-model='curMeterCode' :options='meterCodeList' @change='changeMeterCode' />
                </fm-dropdown-menu>
              </template>
            </fm-field>
            <fm-field v-model='curMeterInfo.waterMeterBrand' name='品牌' label='品牌' :readonly='true' />
            <fm-field v-model='curMeterInfo.bore' name='口径' label='口径' :readonly='true' />
            <fm-field v-model='curMeterInfo.waterMeterType' name='类型' label='类型' :readonly='true' />
            <fm-field v-model='curMeterInfo.usingWaterType' name='用水性质' label='用水性质' :readonly='true' />
            <fm-field v-model='curMeterInfo.remoteModuleNo' name='远传模块号' label='远传模块号' :readonly='true' />
            <fm-field v-model='curMeterInfo.connectingWellNo' name='接驳井编号' label='接驳井编号' :readonly='true' />
            <fm-field v-model='curMeterInfo.meterIndex' name='上次读数' label='上次读数' :readonly='true' />
            <fm-field v-model='curMeterInfo.readingTime' name='上次抄表时间' label='上次抄表时间' :readonly='true' />
            <fm-field v-model='curMeterInfo.curVal' name='本次读数' label='本次读数' :autofocus='true' type='number' required
                      placeholder='请输入读数' v-show='curMeterInfo.state == 0' />
            <!-- <fm-field v-model="curMeterInfo.costVal" name="用水量" label="用水量" :readonly="true" /> -->
            <fm-field name='是否异常' label='是否异常'>
              <template #input>
                <fm-radio-group v-model='curMeterInfo.state' direction='horizontal'>
                  <fm-radio name='1'>是</fm-radio>
                  <fm-radio name='0'>否</fm-radio>
                </fm-radio-group>
              </template>
            </fm-field>
            <fm-field v-model='curMeterInfo.unusualReason' name='异常原因' label='异常原因' required placeholder='请输入异常原因'
                      v-show='curMeterInfo.state == 1' @change='changeMeterInfo' />
          </fm-cell>
        </fm-cell-group>
        <div class='btn-group'>
          <fm-button round block type='primary' native-type='submit' v-if='copyStatus != 2' :disabled='disableCommit'>
            提交
          </fm-button>
          <fm-button round block type='primary' @click='save' v-if='copyStatus == 0'>暂存</fm-button>
        </div>
      </fm-form>
    </div>
    <!-- 增加按钮 -->
    <!--    <div class="bottom" @click="add" v-if="curMeterInfo.state == 1">-->
    <!--      <i class="fm-icon fm-icon-plus"></i>-->
    <!--    </div>-->
  </div>
</template>

<script>
import {
  NavBar,
  Cell,
  Form,
  Field,
  RadioGroup,
  Radio,
  Notify,
  Toast
} from 'fawkes-mobile-lib'
import { queryTaskDetail, getDict, commitTask } from './api'

export default {
  name: 'RevenueTaskDetail',
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [Form.name]: Form,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Notify.name]: Notify,
    [Toast.name]: Toast
  },
  data() {
    return {
      copyStatus: '0',
      bookCode: null,
      planCode: null,
      userInfo: {},
      meterCodeList: [],
      meterInfoList: [],
      curMeterCode: '',
      curMeterInfo: {},
      //字典
      companyDict: [],
      businessCompanyDict: [],
      waterTypeDict: [],
      meterDict: [],
      meterBrandDict: []
    }
  },
  computed: {
    disableCommit() {
      let state = this.curMeterInfo.state
      let cv = this.curMeterInfo.curVal
      let cr = this.curMeterInfo.unusualReason
      if (state == 0) {
        if (cv == '' || cv == null || cv == undefined) {
          return true
        }
      } else {
        if (cr == '' || cr == null || cr == undefined) {
          return true
        }
      }
    }
  },
  methods: {
    //扫描条形码
    // scan() {
    //   if (typeof yuanchu != 'undefined') {
    //     yuanchu.scanner.openScanner((res) => {
    //       if (res) {
    //         // 根据imei号查询户表信息
    //         console.log(res)
    //         // getTaskDetail(res.data.guestNo)
    //       }
    //     })
    //   } else {
    //   }
    // },
    getTaskDetail(guestNo) {
      this.userInfo = {}
      this.curMeterCode = ''
      this.meterCodeList = []
      this.curMeterInfo = {}
      this.meterInfoList = []
      queryTaskDetail({ guestNo }).then((res) => {
        if (res.data) {
          this.userInfo = res.data
          this.userInfo.company = this.filterDict(
            'revenue_company',
            this.userInfo.company
          )
          this.userInfo.businessCompany = this.filterDict(
            'place_of_business',
            this.userInfo.businessCompany
          )
          let data = res.data.waterMeterList
          if (data.length > 0) {
            this.meterInfoList = data
            this.curMeterInfo = data[0]
            this.curMeterInfo.usingWaterType = this.filterDict(
              'water_use_type',
              this.curMeterInfo.usingWaterType
            )
            this.curMeterInfo.waterMeterType = this.filterDict(
              'water_meter_type',
              this.curMeterInfo.waterMeterType
            )
            this.curMeterInfo.waterMeterBrand = this.filterDict(
              'water_meter_brand',
              this.curMeterInfo.waterMeterBrand
            )
            this.curMeterCode = data[0].meterNum
            data.forEach((item) => {
              this.meterCodeList.push({
                value: item.meterNum,
                text: item.meterNum
              })
            })
          }
        }
        this.$set(this.curMeterInfo, 'state', '0')
        this.$set(this.curMeterInfo, 'unusualReason', '')
      })
    },
    //暂存加载信息
    getStagingDetail(guestNo) {
      this.userInfo = {}
      this.curMeterCode = ''
      this.meterCodeList = []
      this.curMeterInfo = {}
      this.meterInfoList = []
      queryTaskDetail({ guestNo }).then((res) => {
        if (res.data) {
          this.userInfo = res.data
          this.userInfo.company = this.filterDict(
            'revenue_company',
            this.userInfo.company
          )
          this.userInfo.businessCompany = this.filterDict(
            'place_of_business',
            this.userInfo.businessCompany
          )
          let savedTasks = localStorage.getItem('savedTasks')
          let allTask = savedTasks ? JSON.parse(savedTasks) : []
          let curTask = allTask.filter((item) => {
            return item.planCode == this.planCode
          })
          let data = curTask[0].paramList
          if (data.length > 0) {
            this.meterInfoList = data
            this.curMeterInfo = data[0]
            this.curMeterCode = data[0].meterNum
            data.forEach((item) => {
              this.meterCodeList.push({
                value: item.meterNum,
                text: item.meterNum
              })
            })
          }
        }

      })
    },
    //点击水表编号切换水表
    changeMeterCode(e) {
      let arr = this.meterInfoList.filter((item) => {
        return item.meterNum == this.curMeterCode
      })
      this.curMeterInfo = arr[0]
      let state = this.curMeterInfo.state ? this.curMeterInfo.state : '0'
      let unusualReason = this.curMeterInfo.unusualReason
        ? this.curMeterInfo.unusualReason
        : ''
      this.$set(this.curMeterInfo, 'state', state)
      this.$set(this.curMeterInfo, 'unusualReason', unusualReason)
      this.curMeterInfo.usingWaterType = this.filterDict(
        'water_use_type',
        this.curMeterInfo.usingWaterType
      )
      this.curMeterInfo.waterMeterType = this.filterDict(
        'water_meter_type',
        this.curMeterInfo.waterMeterType
      )
      this.curMeterInfo.waterMeterBrand = this.filterDict(
        'water_meter_brand',
        this.curMeterInfo.waterMeterBrand
      )
    },
    //输入本次读数后计算用水量
    /* checkCostVal() {
      let lastVal =
        this.curMeterInfo.lastVal == ''
          ? 0
          : parseFloat(this.curMeterInfo.lastVal)
      let curVal =
        this.curMeterInfo.curVal == ''
          ? 0
          : parseFloat(this.curMeterInfo.curVal)
      let coseVal = curVal - lastVal
      this.curMeterInfo.costVal = coseVal
      if (coseVal < 0) {
        this.curMeterInfo.state = '1'
      }
      this.meterInfoList.forEach((item) => {
        if (item.registerNo == this.curMeterCode) {
          item = this.curMeterInfo
        }
      })
    }, */
    changeMeterInfo() {
      this.meterInfoList.forEach((item) => {
        if (item.meterNum == this.curMeterCode) {
          item = this.curMeterInfo
        }
      })
    },
    onSubmit() {
      let paramList = []
      let curTime = this.getCurTime()
      let uid = localStorage.getItem('cs_userId')
      this.meterInfoList.forEach((item) => {
        paramList.push({
          readingType: 'CB',
          registerNo: item.registerNo,
          meterReading: item.state == '0' ? item.curVal : null,
          meterTime: curTime,
          planCode: this.planCode,
          bookCode: this.bookCode,
          lastReadingIndex: item.meterIndex,
          lastReadingTime: item.readingTime,
          state: item.state == '0' ? 'NORMAL' : 'ABNORMAL',
          unusualReason: item.unusualReason,
          readingPerson: uid
        })
      })
      let notAll = false
      this.meterInfoList.map((item) => {
        if (!item.state) {
          notAll = true
          Notify({
            type: 'warning',
            duration: 1000,
            message: '请完善所有水表信息'
          })
        } else {
          if (
            item.state == '0' &&
            (item.curVal == '' ||
              item.curVal == null ||
              item.curVal == undefined)
          ) {
            notAll = true
            Notify({
              type: 'warning',
              duration: 1000,
              message: '请完善所有水表信息'
            })
          }
          if (
            item.state == '1' &&
            (item.unusualReason == '' ||
              item.unusualReason == null ||
              item.unusualReason == undefined)
          ) {
            notAll = true
            Notify({
              type: 'warning',
              duration: 1000,
              message: '请填写异常原因'
            })
          }
        }
      })
      if (!notAll) {
        commitTask(paramList).then((res) => {
          if (res.status) {
            if (this.copyStatus == 0) {
              let all = localStorage.getItem('myDownloadPlan')
              let allTask = all ? JSON.parse(all) : []
              let otherTasks = allTask.filter((item) => {
                return item.planCode != this.planCode
              })
              localStorage.removeItem('myDownloadPlan')
              localStorage.setItem('myDownloadPlan', JSON.stringify(otherTasks))
            } else {
              let all = localStorage.getItem('savedTasks')
              let allTask = all ? JSON.parse(all) : []
              let otherTasks = allTask.filter((item) => {
                return item.planCode != this.planCode
              })
              localStorage.removeItem('savedTasks')
              localStorage.setItem('savedTasks', JSON.stringify(otherTasks))
            }
            Notify({ type: 'success', duration: 500, message: '提交成功' })
            this.$router.replace({
              name: 'TaskIndex'
            })
          } else {
            Notify({ type: 'error', duration: 500, message: '提交失败' })
          }
        })
      }
    },
    save() {
      let all = localStorage.getItem('myDownloadPlan')
      let saved = localStorage.getItem('savedTasks')
      let allTask = all ? JSON.parse(all) : []
      let savedTasks = saved ? JSON.parse(saved) : []
      let curTask = allTask.filter((item) => {
        return item.planCode == this.planCode
      })
      let otherTasks = allTask.filter((item) => {
        return item.planCode != this.planCode
      })
      let paramList = []
      this.meterInfoList.forEach((item) => {
        paramList.push({
          waterMeterBrand: item.waterMeterBrand,
          bore: item.bore,
          remoteModuleNo: item.remoteModuleNo,
          meterIndex: item.meterIndex,
          connectingWellNo: item.connectingWellNo,
          usingWaterType: item.usingWaterType,
          installAddress: item.installAddress,
          waterMeterType: item.waterMeterType,
          readingTime: item.readingTime,
          meterNum: item.meterNum,
          registerNo: item.registerNo,
          curVal: item.curVal,
          planCode: this.planCode,
          bookCode: this.bookCode,
          lastReadingIndex: item.meterIndex,
          lastReadingTime: item.readingTime,
          state: item.state,
          unusualReason: item.unusualReason
        })
      })
      curTask[0].paramList = paramList
      savedTasks.push(...curTask)
      localStorage.removeItem('myDownloadPlan')
      localStorage.removeItem('savedTasks')
      localStorage.setItem('myDownloadPlan', JSON.stringify(otherTasks))
      localStorage.setItem('savedTasks', JSON.stringify(savedTasks))
      Notify({ type: 'success', duration: 500, message: '暂存成功' })
      this.$router.replace({
        name: 'TaskIndex'
      })
    },
    /*打开新增异常工单页面*/
    add() {
      this.$router.push({
        name: 'CommonOneFormIndex',
        params: { type: 'add' }
      })
    },
    //获取类型所有字典
    queryDict(dictType) {
      return new Promise((resolve, reject) => {
        getDict(dictType).then((res) => {
          if (res.data) {
            resolve(res.data)
          }
        })
      })
    },
    //过滤字典
    filterDict(type, detail) {
      if (detail !== null && detail !== '' && detail !== undefined) {
        let dict = []
        if (type == 'revenue_company') {
          dict = this.companyDict
        } else if (type == 'place_of_business') {
          dict = this.businessCompanyDict
        } else if (type == 'water_use_type') {
          dict = this.waterTypeDict
        } else if (type == 'water_meter_type') {
          dict = this.meterDict
        } else if (type == 'water_meter_brand') {
          dict = this.meterBrandDict
        } else {
          dict = []
        }
        return dict.filter((item) => item.dictValue === detail)[0].dictLabel
      }
      return ''
    },
    //获取当前时间
    getCurTime() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      let curTime =
        year +
        '-' +
        (month >= 10 ? month : '0' + month) +
        '-' +
        (day >= 10 ? day : '0' + day) +
        ' ' +
        (hour >= 10 ? hour : '0' + hour) +
        ':' +
        (minute >= 10 ? minute : '0' + minute) +
        ':' +
        second
      return curTime
    }
  },

  async activated() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true
    })
    this.copyStatus = this.$route.params.type
    this.planCode = this.$route.params.planCode
    this.bookCode = this.$route.params.bookCode
    let taskId = this.$route.params.tId
    this.companyDict = await this.queryDict('revenue_company')
    this.businessCompanyDict = await this.queryDict('place_of_business')
    this.waterTypeDict = await this.queryDict('water_use_type')
    this.meterDict = await this.queryDict('water_meter_type')
    this.meterBrandDict = await this.queryDict('water_meter_brand')
    if (this.copyStatus == 1) {
      this.getStagingDetail(taskId)
    } else {
      this.getTaskDetail(taskId)
    }
  }
}
</script>

<style lang='less' scoped>
#TaskDetail {
  height: 100%;
  overflow: auto;
  background-color: #ecf4ff !important;

  /deep/ .fm-nav-bar__content {
    background-color: #0676fd !important;
    height: 1.8rem;
  }

  /deep/ .fm-nav-bar__title {
    color: #ffffff !important;
  }

  /deep/ .fm-nav-bar .fm-icon {
    color: #ffffff !important;
  }

  /deep/ .fm-cell {
    background-color: #ecf4ff !important;
  }

  /deep/ .fm-dropdown-menu {
    width: 100% !important;
    background-color: #ecf4ff !important;
  }

  /deep/ .fm-dropdown-menu__bar {
    background-color: #ecf4ff !important;
    box-shadow: none !important;
  }

  /deep/ .fm-dropdown-menu__item {
    align-items: flex-start;
    justify-content: left !important;
  }

  .rightIcon {
    color: #fff;
    font-size: 55px;
  }

  .btn-group {
    display: flex;
    flex-wrap: nowrap;
    margin: 16px 16px 200px;
  }

  .bottom {
    position: fixed;
    bottom: 300px;
    right: 44px;
    background-color: #027aff;
    width: 102px;
    height: 102px;
    line-height: 102px;
    border-radius: 50%;
    color: #fff;
    z-index: 1000;
    text-align: center;
  }
}
</style>
