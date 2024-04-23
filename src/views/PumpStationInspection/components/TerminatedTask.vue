<template>
  <div class="terminated-task">
    <fm-nav-bar title="任务终止" left-arrow @click-left="goTo()" />
    <div class="terminated-task-content">
      <div class="terminated-task-remark">任务终止需要填写终止原因</div>

      <fm-field
        class="field"
        v-model="reason"
        label="终止原因"
        autosize
        maxlength="500"
        show-word-limit
        type="textarea"
        placeholder="请填写终止原因"
      />

      <fm-button type="primary" class="terminated-task-submit" @click="submit()">提交</fm-button>
      <fm-dialog
        :visible.sync="show"
        title="巡检任务提交"
        @confirm="onConfirm"
        show-cancel-button
        width="331"
      >
        <inspection-submit-card :PatrolData="PatrolData"  :reason="reason" @getActualPerson='getActualPerson' />
      </fm-dialog>
    </div>
  </div>
</template>

<script>
import InspectionSubmitCard from './InspectionSubmitCard.vue'
import { patrol, patrolEdit, uploadTrackList } from '../api'
export default {
  components: { InspectionSubmitCard },
  data() {
    return {
      reason: '',
      show: false,
      PatrolData: null,
      patrolPointResultList: [],
    }
  },

  created() {
    this.getPatrol()
  },
  beforeDestroy() {
    this.$store.commit('setUrlQuery', {
      taskId: this.$store.state.pump.urlQuery.taskId,
      firstConfig: false,
    })

    this.stopRequestLocations()
  },

  methods: {
    //获取用户巡检点
    async getPatrol() {
      let { taskId } = this.$store.state.pump.urlQuery
      const {
        data,
        data: { patrolPointResultList },
      } = await patrol(taskId)
      this.PatrolData = data
      this.patrolPointResultList = patrolPointResultList

      this.requestSingleLocation()
    },

    //开始巡检
    requestSingleLocation() {
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
      if (typeof yuanchu != 'undefined') {
        yuanchu.locationAMap.stopRequestLocations()
      }
    },

    //点击提交按钮
    submit() {
      if (this.reason === '') {
        this.$toast('请填写终止原因')
        return
      }

      this.isUnsubmitted()

      this.PatrolData = {
        ...this.PatrolData,
        id: this.$store.state.pump.urlQuery.taskId,
        patrolEndTime: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        submitTime: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        patrolStatus: 4,
        endReason: this.reason,
        patrolPointResultList: this.patrolPointResultList,
      }

      this.show = true
    },

    //检查是否有未提交项,并提交
    async isUnsubmitted() {
      let storageItemDataList = JSON.parse(this.$storage.get('pump-storageItemDataList'))
      this.patrolPointResultList?.forEach((item, index) => {
        storageItemDataList?.forEach((data, i) => {
          item.id === data.id ? (this.patrolPointResultList[index] = storageItemDataList[i]) : null
        })
      })

      this.$storage.remove('pump-storageItemDataList')
    },

    //获取实际巡检人
    getActualPerson(actualPerson) {
      this.$set(this.PatrolData,'actualPerson',actualPerson)
    },

    //提交终止任务
    async onConfirm() {
      try {
        let query = {
          patrolTaskId: this.$store.state.pump.urlQuery.taskId,
          trackDTOS: this.$store.state.pump.pumpPath,
        }

        const path = await uploadTrackList(query)
        this.$store.commit('setPumpPath', [])

        const res = await patrolEdit(this.PatrolData)
        this.$router.replace('/pump/inspectionManage')
      } catch (error) {
        console.log(error)
      }
    },

    //返回列表页
    goTo() {
      this.$router.replace({
        path: '/pump/inspection',
      })
    },
  },
}
</script>

<style scoped lang="less">
.terminated-task {
  height: 100%;
  background: #f5f7f9;

  .terminated-task-content {
    padding: 0 30px;
  }

  .terminated-task-remark {
    display: flex;
    align-items: center;
    height: 74px;
    font-size: 28px;
    color: #999;
  }

  .field {
    height: auto !important;
    min-height: 300px;
    max-height: 70vh;
    overflow: scroll;
    border-radius: 16px !important;
  }

  .terminated-task-submit {
    width: 100%;
    height: 88px;
    border-radius: 44px;
    margin-top: 60px;
  }
}
</style>
