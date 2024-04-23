<template>
  <fm-form ref="form" validate-first>
    <fm-field
      input-align="right"
      v-model="formData.reimburseName"
      name="采购计划名称"
      label="采购计划名称"
      :maxlength="255"
      :placeholder="flowConfig.reimburseName == 'readonly' ? '' : '请输入采购计划名称'"
      :readonly="flowConfig.reimburseName == 'readonly'"
    />
    <div>
      <fm-field
        :is-link="flowConfig.planDate != 'readonly'"
        input-align="right"
        readonly
        clickable
        name="calendar"
        :value="formData.planDate"
        label="采购计划日期"
        :placeholder="flowConfig.planDate == 'readonly' ? '' : '请选择'"
        @click.stop.native="flowConfig.planDate == 'readonly' ? '' : (showCalendar = true)"
      />
      <fm-calendar
        v-model="showCalendar"
        @confirm="onCalendarConfirm"
        :confirm-button-style="{ height: '44p;', marginBottom: '10px' }"
      />
    </div>
    <div>
      <fm-field name="stepper" label="采购预算" input-align="right">
        <template #input>
          <fm-stepper
            @change="stepperChange"
            input-width="50"
            :disabled="flowConfig.budget == 'readonly'"
            min="0"
            v-model="formData.budget"
          />
        </template>
      </fm-field>
    </div>
    <div>
      <fm-field
        :is-link="flowConfig.reimburseType != 'readonly'"
        readonly
        clickable
        input-align="right"
        name="picker"
        :value="formData.reimburseType | transferEnum('reimburse_type')"
        label="采购类型"
        :placeholder="flowConfig.reimburseType == 'readonly' ? '' : '请选择'"
        @click.stop.native="flowConfig.reimburseType == 'readonly' ? '' : (showPicker = true)"
      />
      <fm-popup :visible.sync="showPicker" position="bottom">
        <fm-picker
          confirm-button-text="完成"
          title="采购类型"
          show-toolbar
          :columns="reimburseType"
          :value-key="lang"
          @confirm="onReimburseTypeConfirm"
          @cancel="showPicker = false"
        />
      </fm-popup>
    </div>
    <div class="textarea-type">
      <fm-cell-group title="采购说明">
        <fm-field
          v-model="formData.description"
          type="textarea"
          maxlength="50"
          :readonly="flowConfig.description == 'readonly'"
          :placeholder="flowConfig.description == 'readonly' ? '' : '请输入采购说明'"
          show-word-limit
        />
      </fm-cell-group>
    </div>
    <fm-field name="checkboxGroup" label="通知方式" input-align="right">
      <template #input>
        <fm-checkbox-group v-model="checkboxGroup" direction="horizontal" @change="checkbox">
          <fm-checkbox :disabled="true" name="短信" shape="square">短信</fm-checkbox>
          <fm-checkbox :disabled="flowConfig.notification == 'readonly'" name="邮箱" shape="square"
            >邮箱</fm-checkbox
          >
        </fm-checkbox-group>
      </template>
    </fm-field>
    <uploader
      v-model="formData.attachment"
      :deletable="flowConfig.attachment != 'readonly'"
      :disabled="flowConfig.attachment == 'readonly'"
      @fileChange="fileChange"
      :showUpload="flowConfig.attachment != 'readonly'"
      ref="attachment"
      type="image"
      class="uploder-attachment"
    />
    <fm-field
      input-align="right"
      v-model="formData.createBy"
      name="填写人"
      label="填写人"
      :readonly="true"
    />
    <fm-field
      input-align="right"
      v-model="formData.createDate"
      name="填写日期"
      label="填写日期"
      :readonly="true"
    />
    <select-user
      title="采购负责人"
      :userFullname.sync="formData.managerFullname"
      :userName.sync="formData.manager"
      :disabled="flowConfig.manager == 'readonly'"
      :multiple="false"
      :required="true"
    >
    </select-user>
    <select-user
      title="财务审批人"
      :userFullname.sync="formData.financeAssigneeFullname"
      :userName.sync="formData.financeAssignee"
      :disabled="flowConfig.manager == 'readonly'"
      :multiple="false"
      :required="true"
    ></select-user>
    <select-user
      title="经理审批人"
      :userFullname.sync="formData.manageAssigneeFullname"
      :userName.sync="formData.manageAssignee"
      :disabled="flowConfig.manager == 'readonly'"
      :required="true"
    ></select-user>
    <select-org
      title="测试部门"
      :deptId.sync="formData.departmentId"
      :deptName.sync="formData.departmentName"
      :disabled="flowConfig.manager == 'readonly'"
      :required="true"
    ></select-org>

    <!--明细表-->
    <detail-table
      :tableColumn="tableColumn.reimburseAttachementList"
      :formDetail.sync="detailTable.reimburseAttachementList"
      tableName="申请报销子表附件表"
      ref="detailForm0"
      :tableType="type"
      :required="true"
      :readonly="isDisabled ? 'readonly' : ''"
    ></detail-table>
    <detail-table
      :tableColumn="tableColumn.reimburseDetailList"
      :formDetail.sync="detailTable.reimburseDetailList"
      tableName="申请报销子表"
      ref="detailForm0"
      :tableType="type"
      :required="true"
      :readonly="isDisabled ? 'readonly' : ''"
    ></detail-table>
  </fm-form>
</template>
<script>
import { CURRENT_ROW, ENUM } from '@/store/State/stateTypes'
import Uploader from '@/components/upload/Uploader.vue'
import SelectUser from '@/components/select-user'
import SelectOrg from '@/components/select-org'
import DetailTable from '@/views/FormCenter/components/DetailTable/index'

import {
  Tab,
  Tabs,
  NavBar,
  Field,
  Calendar,
  Cell,
  CellGroup,
  Button,
  Stepper,
  Popup,
  Picker,
  Checkbox,
  CheckboxGroup,
  Form,
} from 'fawkes-mobile-lib'

import formMixin from '../formMixin'

export default {
  name: 'ReimBurseDetail',
  components: {
    Uploader,
    SelectUser,
    SelectOrg,
    DetailTable,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [Calendar.name]: Calendar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Stepper.name]: Stepper,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Form.name]: Form,
  },
  mixins: [formMixin],
  data() {
    return {
      isDisabled: false,
      service: {
        initial: '/mobile-build/form/query', //初始化接口
        submit: '/mobile-build/form/commit', //提交接口
      },
      entityName: 'Reimburse',
      //输入此表单的头部名称
      formName: '带明细报销',
      modelKey: 'reimburse',
      tab: 0,
      formData: {
        attachment: '', //附件
        budget: ' ', //采购预算
        departmentId: '', //部门ID
        departmentName: '', //部门
        description: '', //报销描述
        financeAssignee: '', //财务审批人
        financeAssigneeFullname: '', //财务审批人
        manageAssignee: '', //经理审批人
        manageAssigneeFullname: '', //经理审批人
        manager: '', //采购负责人
        managerFullname: '', //采购负责人
        notification: '短信', //通知方式
        planDate: '', //采购计划日期
        reimburseName: '', //报销名称
        reimburseType: '', //差旅类型
        createBy: '', //填写人昵称
        createDate: '', //填写日期
      },
      // 明细表列对象
      tableColumn: {
        reimburseAttachementList: [
          {
            index: 0,
            value: '',
            prop: 'fileType',
            align: 'center',
            label: '文件类型',
            edit: true,
            placeholder: '请输入',
            editType: 'input',
            readonly: false,
            disabled: false,
            required: true,
          },
          {
            index: 1,
            value: '',
            prop: 'fileName',
            align: 'center',
            label: '文件名称',
            edit: true,
            placeholder: '请输入',
            editType: 'input',
            readonly: false,
            disabled: false,
            required: true,
          },
          {
            index: 2,
            value: '',
            prop: 'attachment',
            align: 'center',
            label: '附件',
            edit: true,
            placeholder: '',
            editType: 'file',
            readonly: false,
            disabled: false,
            required: false,
          },
          {
            index: 3,
            value: '',
            prop: 'description',
            align: 'center',
            label: '描述',
            edit: true,
            placeholder: '请输入',
            editType: 'textarea',
            readonly: false,
            disabled: false,
            required: true,
          },
        ],
        reimburseDetailList: [
          {
            index: 0,
            value: '',
            prop: 'reimburseType',
            align: 'center',
            label: '报销类型',
            edit: true,
            placeholder: '请输入',
            editType: 'select',
            dictCode: 'reimburse_type',
            readonly: false,
            disabled: false,
            required: true,
          },
          {
            index: 1,
            value: '',
            prop: 'reimburseName',
            align: 'center',
            label: '报销名称',
            edit: true,
            placeholder: '请输入',
            editType: 'input',
            readonly: false,
            disabled: false,
            required: true,
          },
          {
            index: 2,
            value: '',
            prop: 'reimburseFullname',
            align: 'center',
            label: '报销人姓名',
            edit: true,
            placeholder: '请输入',
            editType: 'input',
            readonly: false,
            disabled: false,
            required: true,
          },
          {
            index: 3,
            value: '',
            prop: 'reimburseFee',
            align: 'center',
            label: '报销费用',
            edit: true,
            placeholder: '请输入',
            editType: 'number',
            readonly: false,
            disabled: false,
            required: true,
          },
          {
            index: 4,
            value: '',
            prop: 'reimburseDate',
            align: 'center',
            label: '报销日期',
            edit: true,
            placeholder: '请输入',
            editType: 'datePicker',
            readonly: false,
            disabled: false,
            required: true,
            format: 'YYYY-MM-DD',
          },
          {
            index: 5,
            value: '',
            prop: 'description',
            align: 'center',
            label: '报销描述',
            edit: true,
            placeholder: '请输入',
            editType: 'textarea',
            readonly: false,
            disabled: false,
            required: true,
          },
        ],
      },
      // 明细表对象
      detailTable: {
        reimburseDetailList: [],
        reimburseAttachementList: [],
      },
      // 明细表对象
      detailParamList: [
        {
          detailEntityName: 'ReimburseDetail',
          detailEntityArray: [],
        },
        {
          detailEntityName: 'ReimburseAttachement',
          detailEntityArray: [],
        },
      ],

      // 明细表实体名数组
      detailEntityNameList: ['ReimburseDetail', 'ReimburseAttachement'],
      showPlanDate: '',
      flag: true,
      showDate: false,
      showPicker: false,
      showCalendar: false,
      fileList: [],
      detailScheduleParamList: [],
      attachementScheduleParamList: [],
      checkboxGroup: ['短信'],
      loading: false,
    }
  },
  watch: {},
  computed: {
    row() {
      // 页面中使用row来指代当前记录
      return this.$store.state[CURRENT_ROW]
    },
    reimburseType() {
      return this.$store.state[ENUM][this.toLine('reimburse_type')] || []
    },
    lang() {
      if (this.$storage.get('i18nLocale') == 'zh') {
        return 'zh-CN'
      } else {
        return 'en'
      }
    },
  },
  mounted() {
    // 非暂存环节不可编辑
    if (this.type == 'execute' && this.$route.params.taskKey != 'UserTask_0') {
      this.isDisabled = true
    } else if (this.type == 'view') {
      this.isDisabled = true
    } else if (this.type == 'add') {
      this.formData.createBy = this.$storage.get('username')
      this.formData.createDate = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    beforeInit(res) {
      return new Promise((resolve) => {
        if (res.status) {
          res.data.entityObject.planDate =
            res.data.entityObject.planDate == null
              ? null
              : res.data.entityObject.planDate.split(' ')[0]
          const result = res.data.entityObject
          this.detailParamList = res.data.detailParamList
          this.detailTable.reimburseAttachementList = res.data.detailParamList[1].detailEntityArray
          this.detailTable.reimburseDetailList = res.data.detailParamList[0].detailEntityArray
          result.createBy = this.$storage.get('username')
          result.createDate = this.$dayjs(result.createDate).format('YYYY-MM-DD HH:mm:ss')
          // 判断邮箱短信的选中状态
          if (res.data.entityObject.notification != null) {
            this.checkboxGroup = res.data.entityObject.notification.split(',')
          }
          resolve({ formData: result, detailParamList: this.detailParamList })
        } else {
          resolve()
        }
      })
    },
    // 执行操作前的校验
    validator() {
      if (!this.formData.managerFullname) {
        this.$toast('请选择采购负责人')
        return false
      }
      if (!this.formData.financeAssigneeFullname) {
        this.$toast('请选择财务审批人')
        return false
      }
      if (!this.formData.manageAssigneeFullname) {
        this.$toast('请选择经理审批人')
        return false
      }
      if (!this.formData.departmentName) {
        this.$toast('请选择测试部门')
        return false
      }
      if (this.detailTable.reimburseAttachementList.length == 0) {
        this.$toast('申请报销子表附件表不能为空')
        return false
      }
      if (this.detailTable.reimburseDetailList.length == 0) {
        this.$toast('申请报销子表不能为空')
        return false
      }
      return true
    },
    // 表单提交(审批)前
    beforeSubmit() {
      // 示例表单计划日期字段在数据库类型韦datetime，需要处理下
      this.formData.planDate = this.formData.planDate
        ? this.$dayjs(this.formData.planDate).format('YYYY-MM-DD 00:00:00')
        : null
      // 如果有上传文件，则合并文件filetoken为groupToken
      if (this.fileList.length > 0) {
        // 屏蔽watch监听附件值变更重新获取文件
        this.$refs.attachment.needToGetFile = false
        this.$refs.attachment.setG9s()
      } else {
        this.formData.attachment = ''
      }
      this.$emit('setFormData', this.formData)
      this.detailParamList[0].detailEntityArray = this.detailTable.reimburseDetailList
      this.detailParamList[0].detailEntityArray.forEach((entry) => {
        entry.reimburseDate = this.$dayjs(entry.reimburseDate).format('YYYY-MM-DD 00:00:00')
      })
      this.detailParamList[1].detailEntityArray = this.detailTable.reimburseAttachementList
      this.$emit('setDetailParamList', this.detailParamList)
    },
    // 限制步进器最多只能三位小数
    stepperChange(val) {
      // 当有值或为数字时判断
      if (val === '' || val == null || isNaN(val)) {
        return false
      }
      let reg = /^\d+\.?\d{0,3}$/
      let newVal = null
      if (!reg.test(val)) {
        this.$toast('限制正数或3位小数')
        val = val.toString()
        newVal = val.indexOf('.') > -1 ? val.slice(0, val.indexOf('.') + 4) : val
        setTimeout(() => {
          this.$set(this.formData, 'budget', newVal)
        }, 500)
      }
    },
    // 确认选择日期组件
    onCalendarConfirm(date) {
      this.formData.planDate = this.$dayjs(date).format('YYYY-MM-DD')
      this.showCalendar = false
    },
    // 确认选择差旅类型组件
    onReimburseTypeConfirm(value) {
      this.formData.reimburseType = value.code
      this.showPicker = false
    },
    checkbox(value) {
      this.formData.notification = value.toString()
    },
    fileChange(item) {
      this.fileList = item.fileList
    },
  },
}
</script>

<style scoped lang="less">
.main {
  height: 84%;
  overflow: auto;
}
.add-main {
  height: 76%;
  overflow: auto;
}
/deep/.fm-field--disabled .fm-field__label {
  color: #000;
}
/deep/ .fm-sidebar-item {
  padding: 24px 24px;
}
/deep/ .fm-sidebar-item__text {
  width: 200px;
}
/deep/ .fm-cell-group__title {
  color: #000;
}
.delete-button {
  color: #347df6;
  font-size: 32px;
}
.buttons {
  display: flex;
  margin: 0px 32px;
  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;
}
.button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.field-attachment {
  flex-direction: column;
  /deep/ .fm-field__control--right {
    justify-content: flex-start;
  }
}
.form-button {
  position: fixed;
  left: 10%;
  width: 80%;
  bottom: 16px;
}
.textarea-type /deep/ .fm-field__value {
  border: 1px solid #bbbbbb;
  opacity: 0.5;
}
.textarea-type /deep/ .fm-field--min-height .fm-field__control {
  padding-left: 20px;
  padding-top: 20px;
}
.textarea-type /deep/ .fm-field__word-limit {
  margin-right: 20px;
  margin-bottom: 12px;
}
</style>
