import { getFormData } from './api'

export default {
  data() {
    return {
      type: this.$route.params.type,
      bizId: this.$route.params.bizId,
    }
  },
  computed: {
    flowConfig() {
      let temp = {}
      if (this.type === 'view' || this.type === 'execute') {
        Object.keys(this.formData).forEach((key) => {
          temp[key] = 'readonly'
        })
      }
      const taskKey = this.$route.params.taskKey
      if (
        this.type === 'execute' &&
        (taskKey === 'UserTask_0' || taskKey === 'fawkes_custom_flow_start')
      ) {
        Object.keys(this.formData).forEach((key) => {
          temp[key] = ''
        })
      }
      this.customConfig && this.customConfig(temp)
      return temp
    },
  },
  created() {
    this.$emit('setFormName', this.formName) //设置表单左上角弹窗名称
    this.$emit('setModelKey', this.modelKey) //设置modelKey
    this.$emit('setEntityName', this.entityName) //设置实体对象名称，需要询问后端
    this.$emit('setService', this.service)
    this.$emit('setPreSaveValidateProps', this.preSaveValidateProps)
    if (this.type !== 'add') {
      let params = {
        entityName: this.entityName,
        bizId: this.bizId,
      }
      if (Array.isArray(this.detailEntityNameList) && this.detailEntityNameList.length > 0) {
        params.detailEntityNameList = this.detailEntityNameList
      }
      getFormData(this.service.initial, params).then(async (res) => {
        // 若业务表单中定义了beforeInit方法
        const result = this.beforeInit && (await this.beforeInit(res))
        if (result) {
          this.formData = result.formData
          this.detailParamList = result.detailParamList
        } else {
          this.formData = res.data.entityObject
          this.detailParamList = res.data.detailParamList || this.detailParamList
        }
        // 回填表单和子表信息到Formcenter组件中
        this.$emit('setFormData', this.formData)
        this.$emit('setDetailParamList', this.detailParamList)
      })
    }
  },
  beforeDestroy() {
    this.formData = {}
    this.detailParamList = []
  },
  methods: {
    // 驼峰转换下划线
    toLine(name) {
      return name.replace(/([A-Z])/g, '_$1').toLowerCase()
    },
  },
}
