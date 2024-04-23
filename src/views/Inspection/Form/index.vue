<template>
  <div class="main-container">
    <fm-nav-bar
      title="普通表单"
      left-text=""
      right-text=""
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div :class="['main', type != 'view' ? 'with-button' : 'without-button']" v-if="loading">
      <fm-form :readonly="isDisabled" class="cus-form">
        <fm-field
          input-align="right"
          v-model="formData.reimburseName"
          name="采购计划名称"
          label="采购计划名称"
          :maxlength="50"
          :placeholder="isDisabled ? '' : '请输入内容'"
        />
        <div>
          <fm-field
            input-align="right"
            :is-link="!isDisabled"
            clickable
            name="calendar"
            :value="formData.planDate"
            label="采购计划日期"
            :placeholder="isDisabled ? '' : '请选择'"
            readonly
            @click.stop.native="isDisabled ? '' : (showCalendar = true)"
          />
          <fm-calendar
            :disabled="isDisabled"
            v-model="showCalendar"
            @confirm="onCalendarConfirm"
            :confirm-button-style="{ height: '44p;', marginBottom: '10px' }"
          />
        </div>
        <div>
          <fm-field name="stepper" label="采购预算" input-align="right">
            <template #input>
              <fm-stepper
                :disabled="isDisabled"
                @change="stepperChange"
                input-width="50"
                async-change
                default-value="null"
                v-model="formData.budget"
              />
            </template>
          </fm-field>
        </div>
        <div>
          <fm-field
            input-align="right"
            :is-link="!isDisabled"
            readonly
            clickable
            name="picker"
            :value="formData.reimburseType | transferEnum('reimburse_type')"
            label="采购类型"
            :placeholder="isDisabled ? '' : '请选择'"
            @click.stop.native="isDisabled ? '' : (showPicker = true)"
          />
          <fm-popup :visible.sync="showPicker" position="bottom">
            <fm-picker
              title="采购类型"
              show-toolbar
              confirm-button-text="完成"
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
              type="textarea"
              :placeholder="isDisabled ? '' : '请输入内容'"
              input-align="left"
              v-model="formData.description"
              :readonly="isDisabled"
              autosize
              show-word-limit
              :maxlength="50"
            >
            </fm-field>
          </fm-cell-group>
        </div>
        <fm-field input-align="right" name="checkboxGroup" label="通知方式">
          <template #input>
            <fm-checkbox-group v-model="checkboxGroup" direction="horizontal" @change="checkbox">
              <fm-checkbox :disabled="true" name="短信" shape="square">短信</fm-checkbox>
              <fm-checkbox :disabled="isDisabled" name="邮箱" shape="square">邮箱</fm-checkbox>
            </fm-checkbox-group>
          </template>
        </fm-field>
        <uploader
          v-model="formData.attachment"
          :deletable="!isDisabled"
          :disabled="isDisabled"
          @fileChange="fileChange"
          ref="attachment"
          type="file"
          class="uploder-attachment"
        />
        <select-user
          title="采购负责人"
          :userFullname.sync="formData.managerFullname"
          :userName.sync="formData.manager"
          :disabled="isDisabled"
          :multiple="false"
          :required="true"
        >
        </select-user>
        <select-user
          title="财务审批人"
          :userFullname.sync="formData.financeAssigneeFullname"
          :userName.sync="formData.financeAssignee"
          :disabled="isDisabled"
          :multiple="false"
          :required="true"
        ></select-user>
        <select-user
          title="经理审批人"
          :userFullname.sync="formData.manageAssigneeFullname"
          :userName.sync="formData.manageAssignee"
          :disabled="isDisabled"
          :required="true"
        ></select-user>
        <select-org
          title="测试部门"
          :deptId.sync="formData.departmentId"
          :deptName.sync="formData.departmentName"
          :disabled="isDisabled"
          :required="true"
        ></select-org>
      </fm-form>
      <div class="form-button" v-if="type != 'view'">
        <fm-button
          round
          block
          type="primary"
          native-type="submit"
          @click="onSubmit"
          class="save-btn"
          >保存</fm-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { ENUM } from '@/store/State/stateTypes'
import { getCommonFormDetail, editCommonFormDetail, addCommonFormDetail } from '../api'
import selectOrg from '@/components/select-org'
import selectUser from '@/components/select-user'

import {
  NavBar,
  Form,
  Field,
  Calendar,
  Button,
  Stepper,
  Popup,
  Picker,
  Checkbox,
  CheckboxGroup,
  Toast,
  CellGroup,
} from 'fawkes-mobile-lib'
import Uploader from '@/components/upload/Uploader.vue'

export default {
  name: 'index',
  components: {
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Calendar.name]: Calendar,
    [Button.name]: Button,
    [Stepper.name]: Stepper,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [CellGroup.name]: CellGroup,
    Uploader,
    selectOrg,
    selectUser,
  },
  data() {
    return {
      isDisabled: false,
      showCalendar: false, //是否展示选择日期组件
      showPicker: false, //是否展示选择报销类型组件
      checkboxGroup: ['短信'],
      smsilIsCheck: true,
      emailIsCheck: true,
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
        notification: '', //通知方式
        planDate: '', //采购计划日期
        reimburseName: '', //报销名称
        reimburseType: '', //差旅类型
      },
      fileList: [],
      loading: false,
    }
  },
  watch: {},
  computed: {
    id() {
      return this.$router.currentRoute.params.id
    },
    type() {
      return this.$router.currentRoute.params.type
    },
    // 主表分类字典 //选择器字段
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
    if (this.type != 'add') {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
      this.getFromDetail()
    }
    if (this.type == 'view') {
      this.isDisabled = true
    }
    if (this.type == 'add') {
      this.loading = true
      this.checkbox('短信')
    }
  },
  methods: {
    // 限制步进器最多只能三位小数
    stepperChange(val) {
      // 当有值或为数字时判断
      if (val === '' || val == null || isNaN(val)) {
        return false
      }
      let reg = /^\d+\.?\d{0,3}$/
      let newVal = null
      if (!reg.test(val)) {
        Toast('限制正数或3位小数')
        val = val.toString()
        newVal = val.indexOf('.') > -1 ? val.slice(0, val.indexOf('.') + 4) : val
        setTimeout(() => {
          this.$set(this.formData, 'budget', newVal)
        }, 500)
      }
    },
    getFromDetail() {
      getCommonFormDetail(this.id)
        .then((res) => {
          res.data.planDate = res.data.planDate == null ? null : res.data.planDate.split(' ')[0]
          this.formData = res.data
          // 判断邮箱短信的选中状态
          if (res.data.notification != null) {
            this.checkboxGroup = res.data.notification.split(',')
          }
        })
        .finally(() => {
          Toast.clear()
          this.loading = true
        })
    },
    onSubmit() {
      if (!this.formData.managerFullname) {
        return Toast('请选择采购负责人')
      }
      if (!this.formData.financeAssigneeFullname) {
        return Toast('请选择财务审批人')
      }
      if (!this.formData.manageAssigneeFullname) {
        return Toast('请选择经理审批人')
      }
      if (!this.formData.departmentName) {
        return Toast('请选择测试部门')
      }
      // 如果有上传文件，则合并文件filetoken为groupToken
      if (this.fileList.length > 0) {
        // 屏蔽watch监听附件值变更重新获取文件
        this.$refs.attachment.needToGetFile = false
        this.$refs.attachment.setG9s()
      } else {
        this.formData.attachment = ''
      }
      let data = Object.assign({}, this.formData)
      if (data.planDate) {
        data.planDate = this.$dayjs(data.planDate).format('YYYY-MM-DD 00:00:00')
      }
      if (this.type == 'add') {
        addCommonFormDetail(data).then((res) => {
          if (res.status) {
            Toast('保存成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          } else {
            Toast(res.message)
          }
        })
      } else {
        editCommonFormDetail(data).then((res) => {
          if (res.status) {
            Toast('编辑成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          } else {
            Toast(res.message)
          }
        })
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
    // 驼峰转换下划线
    toLine(name) {
      return name.replace(/([A-Z])/g, '_$1').toLowerCase()
    },
    fileChange(item) {
      this.fileList = item.fileList
    },
    clickUpload() {
      this?.$refs?.attachment?.triggerUpload()
    },
  },
}
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}
.main-container {
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.main,
.cus-form {
  overflow: auto;
  flex: 1;
}
.with-button,
.cus-form {
  height: calc(100% - 122px - env(safe-area-inset-bottom));
  height: calc(100% - 122px - constant(safe-area-inset-bottom));
}
.without-button {
  height: calc(100% - 92px);
  .cus-form {
    height: 100%;
  }
}

/deep/.fm-field--disabled .fm-field__label {
  color: #000;
}
/deep/ .fm-cell-group__title {
  color: #000;
}
.field-attachment {
  flex-direction: column;
  /deep/ .fm-field__control--right {
    justify-content: flex-start;
  }
}

.form-button {
  display: flex;
  padding: 18px 30px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(0 + env(safe-area-inset-bottom));
  bottom: calc(0 + constant(safe-area-inset-bottom));
  height: 122px;

  .save-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.uploder-attachment {
  width: 100%;
}

.no-upload-list {
  /deep/ .fm-field__control {
    display: none;
  }
}
.textarea-type /deep/ .fm-field__value {
  border: 1px solid #bbbbbb;
  opacity: 0.5;
}
.textarea-type /deep/ .fm-field__control {
  padding-left: 20px;
  padding-top: 20px;
}
.textarea-type /deep/ .fm-field__word-limit {
  margin-right: 20px;
  margin-bottom: 12px;
}
</style>
