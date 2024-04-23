<template>
  <div class="main-conatiner">
    <fm-nav-bar left-arrow fixed @click-left="$router.go(-1)" />
    <!-- 表单登录 -->
    <div class="tip">修改密码</div>
    <!-- 密码 确认密码 -->
    <fm-form class="form-container" ref="form">
      <fm-field
        class="field-mobile"
        v-model="form.oldPwd"
        clearable
        name="密码"
        placeholder="请输入当前密码"
        :type="oldPwdType"
        @click-suffix-icon="viewPassword('oldPwdType')"
        :rules="oldPwdRules"
        @blur="checkValidator"
      >
        <template #suffix-icon>
          <i class="fm-icon fm-icon-eye-o suffix-icon" v-if="oldPwdType == 'text'"></i>
          <i class="fm-icon fm-icon-closed-eye suffix-icon" v-else></i>
        </template>
      </fm-field>
      <fm-field
        class="field-mobile"
        v-model="form.pwd"
        clearable
        name="密码"
        placeholder="请输入新密码"
        :type="firstNewPwdType"
        @click-suffix-icon="viewPassword('firstNewPwdType')"
        :rules="firstNewPwdRules"
        @blur="checkValidator"
      >
        <template #suffix-icon>
          <i class="fm-icon fm-icon-eye-o suffix-icon" v-if="firstNewPwdType == 'text'"></i>
          <i class="fm-icon fm-icon-closed-eye suffix-icon" v-else></i>
        </template>
      </fm-field>
      <fm-field
        class="field-mobile"
        v-model="form.confirmPwd"
        name="确认密码"
        placeholder="请输入确认的新密码"
        clearable
        :type="lastNewPwdType"
        @click-suffix-icon="viewPassword('lastNewPwdType')"
        :rules="lastNewPwdRules"
        @blur="checkValidator"
      >
        <template #suffix-icon>
          <i class="fm-icon fm-icon-eye-o suffix-icon" v-if="lastNewPwdType == 'text'"></i>
          <i class="fm-icon fm-icon-closed-eye suffix-icon" v-else></i>
        </template>
      </fm-field>
      <div class="pwd-tip">
        密码设置为8-15位，且必须为数字、大写字母、小写字母和特殊符号四种组合。
      </div>
      <div style="margin: 16px">
        <fm-button block @click="onSubmit" :disabled="disabled" type="primary" native-type="submit"
          >确认</fm-button
        >
      </div>
    </fm-form>
  </div>
</template>
<script>
import { Button, NavBar, Form, Field, Image, Icon, Checkbox, Toast } from 'fawkes-mobile-lib'
import { pwdRule } from '@/utils/validate'
import { pwdEncrypt } from '@/utils/encryption/pwd'
import { changePass, logout } from './api'

export default {
  name: 'login',
  components: {
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Image.name]: Image,
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [Toast.name]: Toast,
  },
  data() {
    return {
      oldPwdType: 'password',
      firstNewPwdType: 'password',
      lastNewPwdType: 'password',
      form: {
        oldPwd: '',
        pwd: '',
        confirmPwd: '',
      },
      CheckFromErrMsg: {
        oldPwd: '',
        pwd: '',
        confirmPwd: '',
      },
      disabled: true,
      oldPwdRules: [
        {
          required: true,
          message: '当前密码不能为空',
          trigger: 'onBlur',
        },
      ],
      firstNewPwdRules: [
        {
          required: true,
          message: '新密码不能为空',
          trigger: 'onBlur',
        },
        {
          // 自定义校验规则
          validator: (value) => {
            return pwdRule(value)
          },
          message: '请输入正确的密码格式',
          trigger: 'onBlur',
        },
      ],
      lastNewPwdRules: [
        {
          required: true,
          message: '确认密码不能为空',
          trigger: 'onBlur',
        },
        {
          // 自定义校验规则
          validator: (value) => {
            return value === this.form.pwd
          },
          message: '两次密码输入不一致',
          trigger: 'onBlur',
        },
      ],
    }
  },
  created() {},
  methods: {
    viewPassword(pwdType) {
      if (this[pwdType] == 'password') {
        this[pwdType] = 'text'
      } else {
        this[pwdType] = 'password'
      }
    },
    // form校验
    checkValidator() {
      this.$refs.form
        .validate()
        .then(() => {
          //成功时的程序
          this.$nextTick(() => {
            this.disabled = false
          })
        })
        .catch(() => {
          //失败时的程序
          this.$nextTick(() => {
            this.disabled = true
          })
        })
    },
    // 提交
    onSubmit() {
      const data = {
        oldPwd: pwdEncrypt(this.form.oldPwd),
        newPwd: pwdEncrypt(this.form.pwd),
      }
      changePass(data).then((res) => {
        if (res.status) {
          Toast('密码修改成功')
          logout()
            .then((res) => {
              if (res.status) {
                this.$storage.remove('access_token')
                this.$router.push('/login')
              }
            })
            .catch(() => {})
        } else {
          Toast(res.message)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.fm-hairline--bottom::after {
  border: none;
}
.suffix-icon {
  margin-left: 10px;
}
.main-conatiner {
  height: 100%;
  background: url('../../assets/img/login/bg.png') no-repeat;
  background-size: 100% 100%;
}
.main-conatiner::before {
  display: table;
  content: '';
}
/deep/.fm-nav-bar {
  background-color: transparent !important;
}
/deep/.fm-cell {
  overflow: visible;
  position: relative;
}
/deep/.fm-field__error-message {
  position: absolute;
  top: 70px;
}
.tip {
  margin-top: 178px;
  font-size: 50px;
  font-weight: 600;
  padding-left: 46px;
  padding-right: 46px;
}
.form-container {
  padding-left: 46px;
  padding-right: 46px;
  font-size: 28px;
  margin-top: 177px;
  .sub-menu {
    display: flex;
    justify-content: space-between;
    padding-left: 32px;
    padding-right: 32px;
    color: #027aff;
    font-size: 28px;
    padding-top: 30px;
  }
}

.field-mobile,
.field-code {
  border-bottom: 2px #e3e3e3 solid;
  padding-left: 24px;
  background-color: #fff;
  margin-bottom: 44px;
  border: none;
  border-radius: 25px;
  /deep/ .fm-field__left-icon {
    height: 48px;
  }
  /deep/ .fm-icon {
    font-size: 48px;
  }
  /deep/ .fm-field__body {
    height: 100%;
  }
}
.code-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.field-code {
  flex: 1.5;
}
.send-button {
  margin-bottom: 44px;
  color: #fff;
  border-radius: 4px;
  width: auto;
  text-align: center;
  background: #347df6;
  margin-left: 20px;
  flex: 1;
  padding: 30px;
  border-radius: 20px;
}
/deep/.fm-cell__value {
  overflow: visible;
}
.fm-field--error ::placeholder {
  color: rgba(159, 159, 159, 0.6);
}
.pwd-tip {
  font-size: 28px;
  color: rgb(159, 159, 159);
  line-height: 42px;
}
</style>
