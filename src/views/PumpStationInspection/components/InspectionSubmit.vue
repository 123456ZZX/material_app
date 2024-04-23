<template>
  <div class="inspection-submit">
    <div class="inspection-map">
      <img
        v-if="modelType === 'list'"
        @click="modelTypeChange('map')"
        src="@/assets/img/pump/inspection-map.png"
        alt=""
        class="inspection-icon"
      />
      <img
        v-if="modelType === 'map'"
        @click="modelTypeChange('list')"
        src="@/assets/img/pump/inspection-list.png"
        alt=""
        class="inspection-icon"
      />
    </div>

    <fm-button
      type="success"
      class="inspection-btn inspection-btn-one"
      v-if="PatrolData && PatrolData.patrolStatus === 1"
      @click="startInspection(2)"
      >开始巡检</fm-button
    >
    <fm-button
      type="success"
      class="inspection-btn"
      v-if="PatrolData && PatrolData.patrolStatus === 2 && !firstConfig && finishConfig"
      @click="submit(3)"
      >完成巡检</fm-button
    >
    <fm-button
      type="warning"
      class="inspection-btn"
      v-if="PatrolData && PatrolData.patrolStatus === 2 && !firstConfig && !finishConfig"
      @click="terminatedInspection(4)"
      >终止巡检</fm-button
    >
    <fm-button
      type="primary"
      class="inspection-btn"
      v-if="PatrolData && PatrolData.patrolStatus === 2 && !firstConfig && !finishConfig"
      @click="stopInspection()"
      >暂停巡检</fm-button
    >
    <fm-button
      type="primary"
      class="inspection-btn inspection-btn-one"
      v-if="PatrolData && PatrolData.patrolStatus === 2 && firstConfig"
      @click="goInspection()"
      >继续巡检</fm-button
    >

    <fm-dialog
      :visible.sync="submitShow"
      title="巡检任务提交"
      @confirm="onConfirm"
      show-cancel-button
      width="331"
    >
      <inspection-submit-card :PatrolData="submitData"  @getActualPerson='getActualPerson' />
    </fm-dialog>
  </div>
</template>

<script>
import InspectionSubmitCard from './InspectionSubmitCard.vue'
import { patrolEdit, uploadTrackList } from '../api'
export default {
  components: { InspectionSubmitCard },
  props: {
    //巡检状态(1:待巡检，2:巡检中，3:已完成 ，4:已终止)(手机端)
    PatrolData: {
      type: Object,
      default: () => {},
    },
    modelType: {
      type: String,
      default: 'list',
    },
  },
  watch: {
    PatrolData: {
      handler: function () {
        this.isFinishConfig()
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      submitData: null,
      firstConfig: true, //是否为第一次进入
      finishConfig: false, //巡检点是否巡检完毕
      submitShow: false, //提交弹框
      disabled: true,
    }
  },

  mounted() {
    this.setFirstConfig()
  },
  beforeDestroy() {
    this.stopRequestLocations()
  },

  methods: {
    //内容变化
    //list列表，map地图
    modelTypeChange(type) {
      if (this.firstConfig && this.PatrolData.patrolStatus === 2) return
      this.$emit('modelTypeChange', type)

      this.stopRequestLocations()
      if (type === 'list') this.requestSingleLocation(false)
    },

    //判断是否为第一次进入
    setFirstConfig() {
      let { firstConfig } = this.$store.state.pump.urlQuery

      if (firstConfig === false) {
        this.firstConfig = false
        this.$emit('isDisabled', false)
        console.log('isDisabled', false)

        this.requestSingleLocation(this.firstConfig)
      } else {
        this.firstConfig = true
      }
    },

    //巡检点是否巡检完毕
    isFinishConfig() {
      let config = this.PatrolData?.patrolPointResultList?.every((item) => {
        return item.patrolStatus === '已巡'
      })
      this.finishConfig = config
    },

    //继续巡检
    goInspection() {
      this.firstConfig = false
      this.$emit('isDisabled', false)

      this.requestSingleLocation(true)
    },

    //开始巡检
    async startInspection(type) {
      let query = {
        id: this.$store.state.pump.urlQuery.taskId,
        patrolStatus: type ? type : this.PatrolData && this.PatrolData.patrolStatus,
        patrolStartTime: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        patrolPointResultList: this.PatrolData && this.PatrolData.patrolPointResultList,
      }

      this.$emit('isDisabled', false)

      this.requestSingleLocation(true)

      const res = await patrolEdit(query)
      this.$parent.getPatrol()
      this.firstConfig = false
      this.$router.push({
        path: '/pump/inspection',
        query: {
          taskId: this.$store.state.pump.urlQuery.taskId,
          firstConfig: 'false',
        },
      })
    },

    //暂停巡检
    stopInspection() {
      this.$dialog
        .confirm({
          title: '暂停巡检',
          message: '暂停巡检将提交未提交的巡检点和隐患数据！',
        })
        .then(async () => {
          await this.isUnsubmitted()

          this.$router.replace('/pump/inspectionManage')
        })
        .catch((error) => {
          console.log(error)
        })
    },

    //终止巡检
    async terminatedInspection() {
      this.$store.commit('setUrlQuery', {
        taskId: this.$store.state.pump.urlQuery.taskId,
      })
      this.$router.push(`/pump/terminated-task`)
    },

    //检查是否有未提交项,并提交
    async isUnsubmitted() {
      this.submitData = JSON.parse(JSON.stringify(this.PatrolData))

      let storageItemDataList = JSON.parse(this.$storage.get('pump-storageItemDataList'))
      this.submitData.patrolPointResultList?.forEach((item, index) => {
        storageItemDataList?.forEach((data, i) => {
          item.id === data.id
            ? (this.submitData.patrolPointResultList[index] = storageItemDataList[i])
            : null
        })
      })

      this.$storage.remove('pump-storageItemDataList')
      const res = await patrolEdit(this.submitData)
    },

    //开始巡检
    requestSingleLocation(isFirst) {
      console.log(isFirst, '记录巡检')
      if (typeof yuanchu != 'undefined') {
        yuanchu.locationAMap.requestSingleLocation(
          ['1'],
          (res) => {
            let { latitude, longitude } = res
            let path
            if (isFirst) {
              path =
                this.PatrolData && this.PatrolData.patrolPointTrackList
                  ? this.PatrolData.patrolPointTrackList
                  : []
              console.log(path)
            } else {
              path = JSON.parse(JSON.stringify(this.$store.state.pump.pumpPath))
            }

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

    //结束定位
    stopRequestLocations() {
      console.log('结束巡检')
      if (typeof yuanchu != 'undefined') {
        yuanchu.locationAMap.stopRequestLocations()
      }
    },

    //完成巡检提交
    async submit(type) {
      this.submitData = JSON.parse(JSON.stringify(this.PatrolData))
      this.submitData.patrolStatus = type
      this.submitData.patrolEndTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      this.submitData.submitTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      this.submitShow = true
    },

    //获取实际巡检人
    getActualPerson(actualPerson) {
      this.$set(this.submitData,'actualPerson',actualPerson)
    },

    //任务提交确认
    async onConfirm() {
      try {
        let query = {
          patrolTaskId: this.$store.state.pump.urlQuery.taskId,
          trackDTOS: this.$store.state.pump.pumpPath,
        }

        const path = await uploadTrackList(query)
        this.$store.commit('setPumpPath', [])

        const res = await patrolEdit(this.submitData)
        this.$parent.getPatrol()
        this.firstConfig = false
        this.$router.replace('/pump/inspectionManage')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style scoped lang="less">
.inspection-submit {
  width: calc(100% - 150px);
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 112px;
  padding: 10px 30px 10px 120px;
  background-color: #fff;

  .inspection-map {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 40px;
    width: 40px;
    height: 40px;

    .inspection-icon {
      width: 100%;
      height: 100%;
    }
  }

  .inspection-btn {
    width: 288px;
    height: 88px;
    border-radius: 44px;
  }

  .inspection-btn-one {
    width: 100%;
  }
}
</style>
