<template>
  <div class="inspection-items">
    <fm-nav-bar
      :title="itemData && itemData.patrolPointName"
      fixed
      placeholder
      left-arrow
      :right-text="rightText"
      @click-left="goToInspection()"
      @click-right="isExpandImg = !isExpandImg"
    />
    <div v-if="isExpandImg" class="inspection-item-area">
      <div class="area-content">
        <div class="area">
          <span>所属区域：</span>
          <span>{{ itemData && itemData.areaLocation }}</span>
          <span style="margin: 0 10px">|</span>
          <span>关联设备：</span>
          <span>{{ itemData && itemData.deviceName }}</span>
        </div>
        <img
          src="@/assets/img/pump/inspection-amplifier.png"
          class="area-content-icon"
          @click="imgShow = true"
          alt=""
        />
      </div>

      <fm-image width="100%" height="100%" :src="imgUrl" />
      <fm-image
        class="mark-icon"
        :style="{
          top: `calc(${itemData && itemData.topPixel} - 0.56rem )`,
          left: `calc(${itemData && itemData.leftPixel} - 0.42667rem)`,
        }"
        v-if="imgUrl"
        :src="require('@/assets/img/pump/inspection-mark-icon.png')"
      />

      <fm-popup
        :visible.sync="imgShow"
        :style="{ width: '100%', height: '30%', overflow: 'hidden' }"
      >
        <div class="zoomImgBox">
          <fm-image width="100%" height="100%" :src="imgUrl" class="zoomImg" />
          <fm-image
            class="mark-icon"
            :style="{
              top: `calc(${itemData && itemData.topPixel} - 0.56rem )`,
              left: `calc(${itemData && itemData.leftPixel} - 0.42667rem)`,
            }"
            v-if="imgUrl"
            :src="require('@/assets/img/pump/inspection-mark-icon.png')"
          />
        </div>
      </fm-popup>
    </div>

    <div class="inspection-items-content" :style="{ height: contentHeight }">
      <div class="inspection-items-title"><span style="color: red">*</span> 巡检点拍照</div>
      <div class="inspection-item-upload">
        <Uploader
          v-model="fileValue"
          class="img-upload"
          @fileChange="fileChange"
          :limit="6"
          :maxImagesCount="6"
          multiple
          label=""
          type="image"
          :disabled="allData.patrolStatus === 3"
          :deletable="allData.patrolStatus !== 3"
        />
      </div>

      <div v-for="(item, index) in patrolItemsResultList" :key="item.id">
        <div class="inspection-item" v-if="item.inputType === '1'">
          <div class="inspection-item-input">
            <div class="item-content">
              {{ `${item.patrolItemsCode || ''}${item.patrolItemName}` }}
            </div>
            <fm-switch
              :disabled="allData.patrolStatus === 3"
              v-model="patrolItemsResultList[index].patrolItemValue"
              active-color="#40BB5A"
              inactive-color="#FF4D4F"
              class="item-switch"
              @change="switchChange(index)"
            />
          </div>

          <div
            class="inspection-btn-row"
            v-if="
              !patrolItemsResultList[index].patrolItemValue &&
              !item.reportTime &&
              allData.patrolStatus !== 3
            "
          >
            <div>
              <fm-button
                type="danger"
                class="inspection-btn"
                style="margin-right: 20px"
                @click="createWork(item.id, index, 'trouble_template')"
                >隐患上报</fm-button
              >
              <fm-button
                type="danger"
                class="inspection-btn"
                @click="createWork(item.id, index, 'pump_repair')"
                >检修上报</fm-button
              >
            </div>
          </div>

          <div
            class="inspection-dispaly-row"
            style="justify-content: flex-end"
            v-if="!patrolItemsResultList[index].patrolItemValue && item.reportTime"
          >
            <span @click="workerDetails(index)">{{ `上报时间:${item.reportTime}` }}</span>
          </div>
        </div>

        <div class="inspection-item" v-else-if="item.inputType === '2'">
          <div class="inspection-item-input">
            <div class="item-label">
              {{ `${item.patrolItemsCode || ''}${item.patrolItemName}` }}
            </div>
            <fm-field
              v-model="patrolItemsResultList[index].patrolItemValue"
              :disabled="!!item.reportTime || allData.patrolStatus === 3"
              placeholder="请输入值"
              type="number"
            >
              <template #button>
                <i
                  class="fm-icon fm-icon-close"
                  v-if="allData.patrolStatus !== 3"
                  @click="valueChange(index)"
                ></i>
              </template>
            </fm-field>
          </div>
          <div
            class="inspection-btn-row"
            v-if="
              configRangeValue(
                patrolItemsResultList[index].patrolItemValue,
                item.upperLimitValue,
                item.lowerLimitValue
              ) &&
              !item.reportTime &&
              allData.patrolStatus !== 3
            "
          >
            <div>
              <fm-button
                type="danger"
                class="inspection-btn"
                style="margin-right: 20px"
                @click="createWork(item.id, index, 'trouble_template')"
                >隐患上报</fm-button
              >
              <fm-button
                type="danger"
                class="inspection-btn"
                @click="createWork(item.id, index, 'pump_repair')"
                >检修上报</fm-button
              >
            </div>
            <div class="inspection-item-input-limit">
              上下限值：{{ item.lowerLimitValue }}~{{ item.upperLimitValue }}
            </div>
          </div>

          <div
            class="inspection-dispaly-row"
            v-if="
              configRangeValue(
                patrolItemsResultList[index].patrolItemValue,
                item.upperLimitValue,
                item.lowerLimitValue
              ) && item.reportTime
            "
          >
            <span style="color: #ff4d4f"
              >上下限值：{{ item.lowerLimitValue }}~{{ item.upperLimitValue }}</span
            >
            <span @click="workerDetails(index)">{{ `上报时间:${item.reportTime}` }}</span>
          </div>
        </div>

        <div class="inspection-item" v-else>
          <div class="item-label">{{ `${item.patrolItemsCode || ''}${item.patrolItemName}` }}</div>
          <fm-radio-group
            v-model="patrolItemsResultList[index].patrolItemValue"
            direction="horizontal"
            class="item-radio"
          >
            <fm-radio name="1">运行</fm-radio>
            <fm-radio name="2">备用</fm-radio>
            <fm-radio name="3">故障</fm-radio>
            <fm-radio name="4">检修</fm-radio>
          </fm-radio-group>

          <div
            class="inspection-btn-row"
            v-if="patrolItemsResultList[index]?.patrolItemValue === '3' && !item.reportTime"
          >
            <div>
              <fm-button
                type="danger"
                class="inspection-btn"
                style="margin-right: 20px"
                @click="createWork(item.id, index, 'trouble_template')"
                >隐患上报</fm-button
              >
              <fm-button
                type="danger"
                class="inspection-btn"
                @click="createWork(item.id, index, 'pump_repair')"
                >检修上报</fm-button
              >
            </div>
          </div>
          <div
            class="inspection-dispaly-row"
            style="justify-content: flex-end"
            v-if="patrolItemsResultList[index]?.patrolItemValue === '3' && item.reportTime"
          >
            <span @click="workerDetails(index)">{{ item.reportTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <fm-dialog
      :visible.sync="noAlarmShow"
      title="巡检点记录提交确认"
      show-cancel-button
      @confirm="confirmSubmit"
    >
      <div v-if="noAlarm() > 0" class="noAlarmClass">
        <div>
          该巡检点存在
          <span style="color: #ff4d4f">{{ noAlarm() }}</span> 条未上报异常项，请上报！
        </div>
      </div>
      <div v-if="noAlarm() === 0" class="noAlarmClass">是否进行提交！</div>
    </fm-dialog>

    <div class="inspection-submit" v-if="allData.patrolStatus !== 3">
      <fm-button type="primary" class="inspection-btn" @click="submit()">完成提交</fm-button>
    </div>
  </div>
</template>

<script>
import Uploader from './Uploader.vue'
import { getToken, closeTicket, patrol, patrolEdit, patrolItemsResult, valueattime } from '../api'
export default {
  name: 'InspectionItem',
  components: { Uploader },
  data() {
    return {
      fileValue: '',
      fileList: [],
      picUrl: '',
      checked: false,
      value: '',
      isExpandImg: false,
      imgShow: false,
      noAlarmShow: false,
      itemData: null,
      autoFillObj: {},
      patrolItemsResultList: [],
      imgUrl: '',
      allData: '',
    }
  },
  computed: {
    rightText: function () {
      return this.isExpandImg ? '展开' : '收起'
    },
    contentHeight: function () {
      return this.isExpandImg ? 'calc(100vh - 260px)' : 'calc(100vh - 150px)'
    },
  },

  created() {
    this.getPatrol()
  },
  mounted() {},
  beforeDestroy() {
    const { taskId, index } = this.$store.state.pump.urlQuery
    this.$store.commit('setUrlQuery', {
      taskId,
      index,
      firstConfig: false,
    })

    this.stopRequestLocations()
  },

  methods: {
    //文件大小
    onOversize(file) {
      console.log(file)
      this.$notify({ type: 'error', message: '文件大小不能超过 6MB', duration: '1000' })
    },

    //范围值判断
    configRangeValue(value, upperLimitValue = null, lowerLimitValue = null) {
      if (
        !value ||
        upperLimitValue === null ||
        lowerLimitValue === null ||
        upperLimitValue === '' ||
        lowerLimitValue === ''
      )
        return
      const up = upperLimitValue * 1
      const low = lowerLimitValue * 1
      return up < value || low > value
    },

    //获取用户巡检点
    async getPatrol() {
      let { taskId, index } = this.$store.state.pump.urlQuery
      console.log(taskId, index)

      let PatrolData
      try {
        const { data } = await patrol(taskId)
        PatrolData = data
      } catch (error) {
        PatrolData = JSON.parse(this.$storage.get('PatrolData'))
      }

      this.allData = PatrolData
      this.itemData = PatrolData.patrolPointResultList[index]

      this.isUnsubmitted()

      this.requestSingleLocation()
    },

    //开始巡检
    requestSingleLocation() {
      console.log('巡检点记录')
      if (typeof yuanchu != 'undefined') {
        yuanchu.locationAMap.requestSingleLocation(
          ['1'],
          (res) => {
            let { latitude, longitude } = res
            let path = JSON.parse(JSON.stringify(this.$store.state.pump.pumpPath))
            path.push({
              lat: latitude,
              lon: longitude,
            })
            this.$store.commit('setPumpPath', path)

            console.log(this.$store.state.pump.pumpPath)
          },
          (err) => {
            console.log('err=', err)
          }
        )
      }
    },

    //结束巡检
    stopRequestLocations() {
      console.log('巡检点记录结束')
      if (typeof yuanchu != 'undefined') {
        yuanchu.locationAMap.stopRequestLocations()
      }
    },

    //检查是否有未提交项
    isUnsubmitted() {
      let itemData = JSON.parse(JSON.stringify(this.itemData))
      let storageItemDataList = JSON.parse(this.$storage.get('pump-storageItemDataList'))
      storageItemDataList?.forEach((item, i) => {
        item.id === this.itemData.id
          ? (this.itemData = Object.assign(itemData, storageItemDataList[i]))
          : null
      })

      this.workDataShow(this.allData)
    },

    //异常上报后回显
    workDataShow(data) {
      let { index } = this.$store.state.pump.urlQuery
      let itemData = data.patrolPointResultList[index]

      itemData &&
        itemData.patrolItemsResultList?.forEach((item, index) => {
          if (item.workOrderId) {
            console.log(item.workOrderId)
            this.itemData.patrolItemsResultList[index].workOrderId = item.workOrderId
            this.itemData.patrolItemsResultList[index].reportTime = item.reportTime
          }
        })

      this.getInfoData()
    },

    //异常返回正常,确认后清除异常上报事件
    switchChange(index) {
      let config =
        this.patrolItemsResultList[index].patrolItemValue &&
        this.patrolItemsResultList[index].workOrderId

      config &&
        this.$dialog
          .confirm({
            title: '是否取消异常上报事件',
          })
          .then(async () => {
            let { workOrderId } = this.patrolItemsResultList[index]
            await this.setCloseTicket(workOrderId)
            this.workerPush(this.patrolItemsResultList[index].id, null, null, index)
          })
          .catch(() => {
            this.patrolItemsResultList[index].patrolItemValue = false
          })
    },

    //异常返回正常,确认后清除异常上报事件
    valueChange(index) {
      //如果没有工单,数据清空,然后退出
      if (!this.patrolItemsResultList[index].workOrderId) {
        this.patrolItemsResultList[index].patrolItemValue = ''
        return
      }
      this.$dialog
        .confirm({
          title: '是否取消异常上报事件',
        })
        .then(async () => {
          let { workOrderId } = this.patrolItemsResultList[index]
          await this.setCloseTicket(workOrderId)
          this.patrolItemsResultList[index].patrolItemValue = ''
          this.workerPush(this.patrolItemsResultList[index].id, null, null, index)
        })
        .catch(() => {})
    },

    //清除工单
    async setCloseTicket(ticketId) {
      let query = {
        reason: '巡检异常项恢复正常',
        ticketId: ticketId,
      }
      const { accessToken } = await getToken(this.$storage.get('access_token'))
      const res = await closeTicket(accessToken, query)
    },

    //获取巡检点信息
    getInfoData() {
      let { patrolItemsResultList, locationPlan, picUrl } = this.itemData

      this.patrolItemsResultList = patrolItemsResultList.map((item) => {
        if (item.inputType === '1') {
          let data = item
          data.patrolItemValue = data?.patrolItemValue?.toString() === 'false' ? false : true
          return { ...data }
        } else if (item.inputType === '3') {
          let data = item
          data.patrolItemValue = data?.patrolItemValue ? data.patrolItemValue : '1'
          return { ...data }
        } else {
          return { ...item }
        }
      })

      this.autoFill()

      this.fileValue = picUrl ? picUrl : ''
      this.getImg(locationPlan?.url)
    },

    // 监测巡检项
    async autoFill() {
      //获取巡检项code
      const list = []
      this.patrolItemsResultList.forEach((item) => {
        if (item.patrolType === 2) {
          list.push(item.pointCode)
        }
      })
      const { taskStartTime } = this.allData
      const times = `${taskStartTime}.000`

      // 获取开始任务实际点的巡检项值
      const { data } = await valueattime({
        // nodeIds: ['ns=102;s=CSBF.HJJC.CSLLLJZ.PV', 'ns=102;s=CSBF.HJJC.CSLL.PV'],
        nodeIds: list,
        times: [times],
      })
      // const data =
      //   '{"msg":"success","result":[{"values":[{"s":2161573888,"t":1677632415401,"v":0.0,"nodeid":"ns=102;s=CSBF.HJJC.CSLLLJZ.PV"}]},{"values":[{"s":2161573888,"t":1677632415401,"v":0.0,"nodeid":"ns=102;s=CSBF.HJJC.CSLL.PV"}]}],"code":0}'

      const result = JSON.parse(data)?.result

      // 生成对象：{ cdoe: value }
      if (!result) return
      result?.forEach((item) => {
        const { nodeid, v } = item.values[0]

        this.$set(this.autoFillObj, nodeid, v)
      })

      //匹配到对象code并进行赋值
      this.patrolItemsResultList = this.patrolItemsResultList.map((item) => {
        if (item.patrolType === 2 && !item.patrolItemValue) {
          return {
            ...item,
            patrolItemValue: this.autoFillObj[item.pointCode],
          }
        } else {
          return {
            ...item,
          }
        }
      })
    },

    //获取图片
    getImg(imgToken) {
      this.imgUrl = imgToken
        ? '/api/sys-storage/download_image?f8s=' + imgToken
        : require('@/assets/img/pump/inspection-img-null.png')
    },

    //上传文件更新
    fileChange(item) {
      this.fileList = item.fileList
    },

    //创建工单
    async createWork(ticketId, i, type) {
      const { accessToken } = await getToken(this.$storage.get('access_token'))
      let uuid = this.getUUID()
      let formValue = {
        ticketId: uuid,
      }

      let encodeURIFormValue = encodeURIComponent(JSON.stringify(formValue))
      let time = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')

      let { taskId, index } = this.$store.state.pump.urlQuery

      this.itemData.patrolItemsResultList = this.patrolItemsResultList
      this.itemData.picUrl = this.fileValue

      let pointData = this.allData.patrolPointResultList
      pointData[index] = this.itemData
      let query = {
        id: taskId,
        patrolPointResultList: pointData,
      }

      try {
        const res = await patrolEdit(query)
      } catch (error) {
        this.setOffLineStorage()
      }

      await this.workerPush(ticketId, uuid, time, i)

      this.createWorkUrl = `${process.env.VUE_APP_WPG_URL}/outworkApp/#/pages/index/form?sysCode=xasw-pump&templateCode=${type}&token=${accessToken}&formValue=${encodeURIFormValue}`
      this.$router.push({
        query: {
          url: this.createWorkUrl,
        },
        path: '/pump/work',
      })
      // window.location.href = this.createWorkUrl
    },

    //工单详情
    async workerDetails(index) {
      const { accessToken } = await getToken(this.$storage.get('access_token'))
      let workOrderId = this.patrolItemsResultList[index].workOrderId
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

    // 获取UUID
    getUUID(n = 32) {
      var str = 'abcdefghijklmnopqrstuvwxyz0123456789' // 可以作为常量放到random外面
      var result = ''
      for (var i = 0; i < n; i++) {
        result += str[parseInt(Math.random() * str.length)]
      }
      return result
    },

    //判断是否有未上报巡检项
    noAlarm() {
      let count = 0
      this.patrolItemsResultList?.forEach((item) => {
        let isAlarm
        if (item.inputType === '2') {
          isAlarm = this.configRangeValue(
            item.patrolItemValue,
            item.upperLimitValue,
            item.lowerLimitValue
          )
        } else {
          isAlarm = !item.patrolItemValue
        }
        isAlarm && item.workOrderId === null ? count++ : null
      })
      return count
    },

    //是否上传图片(1:是，2:否) 是必须上传一张图片
    isUploadImageConfig() {
      let config = false
      config = this.itemData.isUploadImage && this.fileList.length === 0 ? true : false
      config && this.$toast.warning('请至少上传一张图片')

      return config
    },

    //巡检点巡检提交
    async submit() {
      if (this.isUploadImageConfig()) return

      this.noAlarmShow = true
    },

    //工单上报
    async workerPush(id, workOrderId, time, index) {
      let query = {
        id: id,
        workOrderId: workOrderId,
        reportTime: time,
        patrolItemValue: this.patrolItemsResultList[index].patrolItemValue,
      }
      const res = await patrolItemsResult(query)

      this.getPatrol()
    },

    //  确认提交
    async confirmSubmit() {
      let { taskId, index } = this.$store.state.pump.urlQuery

      this.itemData.patrolStatus = '已巡'
      this.itemData.patrolItemsResultList = this.patrolItemsResultList
      this.itemData.picUrl = this.fileValue
      this.itemData.checkTime = this.$dayjs().format('YYYY-MM-DD HH:mm')

      let pointData = this.allData.patrolPointResultList
      pointData[index] = this.itemData
      let query = {
        id: taskId,
        patrolPointResultList: pointData,
      }

      try {
        let storageItemDataList = JSON.parse(this.$storage.get('pump-storageItemDataList'))

        storageItemDataList?.forEach((item, i) => {
          item.id === this.itemData.id ? storageItemDataList.splice(i, 1) : null
        })

        this.$storage.set('pump-storageItemDataList', JSON.stringify(storageItemDataList))

        const res = await patrolEdit(query)
        this.$toast('提交成功')
        this.goToInspection()
      } catch (error) {
        this.setOffLineStorage()
      }
    },

    // 离线缓存
    setOffLineStorage() {
      this.itemData.patrolItemsResultList = this.patrolItemsResultList

      let storageItemDataList = JSON.parse(this.$storage.get('pump-storageItemDataList'))
      storageItemDataList ? storageItemDataList : (storageItemDataList = [])

      if (storageItemDataList.length === 0) {
        storageItemDataList.push(this.itemData)
      } else {
        storageItemDataList?.forEach((item, i) => {
          item.id === this.itemData.id
            ? (storageItemDataList[i] = this.itemData)
            : storageItemDataList.push(this.itemData)
        })
      }

      console.log(storageItemDataList)

      this.$storage.set('pump-storageItemDataList', JSON.stringify(storageItemDataList))

      this.$toast('缓存成功')
      this.goToInspection()
    },

    //返回列表页
    goToInspection() {
      this.$router.replace({
        path: '/pump/inspection',
      })
    },
  },
}
</script>

<style scoped lang="less">
.inspection-items {
  position: relative;
  height: 100%;

  background: #f5f7f9;

  .inspection-item-area {
    position: relative;
    height: 440px;

    .area-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      bottom: 0px;
      width: calc(100% - 60px);
      height: 50px;
      font-size: 28px;
      color: #fff;
      padding: 0 30px;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.3);

      .area {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .area-content-icon {
        width: 32px;
        height: 32px;
      }
    }

    .mark-icon {
      position: absolute;
      width: 32px;
      height: 32px;
    }
  }

  .inspection-items-content {
    // height: calc(100% - 700px);
    overflow: scroll;

    .inspection-items-title {
      margin: 30px 30px 0;
      font-size: 26px;
      font-weight: 600;
    }
  }

  .inspection-item-upload {
    display: flex;
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    border-radius: 16px;
    padding: 30px;
    margin: 20px 30px 20px;

    /deep/ .fm-uploader__preview:nth-child(4n) {
      margin: 0 0.37333rem 0.21333rem 0 !important;
    }
  }

  .inspection-item {
    margin: 0 30px 20px;
    padding: 30px;
    background: #ffffff;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    border-radius: 16px;
    font-size: 32px;

    .inspection-item-input {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .item-label {
        width: 500px;
      }
    }

    .item-radio {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
    }

    .inspection-btn-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .inspection-item-input-limit {
        color: #ff4d4f;
        margin-top: 20px;
      }
    }

    .inspection-dispaly-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      font-size: 28px;
      color: #1b67d8;
    }

    .inspection-btn {
      text-align: center;
      width: 168px;
      height: 64px;
      border-radius: 38px;
      font-size: 26px;
      margin-top: 30px;
    }

    .item-content {
      flex: 4;
    }
  }

  .inspection-submit {
    width: 100%;
    height: 112px;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    padding: 10px 0;

    .inspection-btn {
      width: calc(100% - 60px);
      height: 88px;
      border-radius: 44px;
    }
  }

  .noAlarmClass {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    padding: 10px 40px;
  }

  .zoomImgBox {
    width: 100%;
    height: 100%;
  }
}
</style>
