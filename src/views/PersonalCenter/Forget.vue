<template>
  <div class="main-conatiner">
    <fm-nav-bar left-arrow fixed @click-left="$router.go(-1)" />
    <!-- 表单登录 -->
    <div class="tip">忘记密码</div>
    <!-- 手机号 获取验证码 -->
    <fm-form validate-trigger="onBlur" ref="firstForm" class="form-container" v-if="!nextStep">
      <fm-field
        class="field-mobile"
        v-model="form.phone"
        type="tel"
        placeholder="请输入手机号"
        clearable
        name="phone"
        @blur="firstCheckValidator"
        :rules="phoneRules"
      />
      <div class="code-item">
        <fm-field
          class="field-code"
          v-model="form.captcha"
          type="number"
          maxlength="6"
          clearable
          placeholder="验证码"
          @blur="firstCheckValidator"
          :rules="captchaRules"
        >
        </fm-field>
        <fm-button class="send-button" v-if="sendCaptcha" :disabled="sendCaptcha" type="primary">
          {{ firstFlag ? countDown + 's重新获取' : '发送验证码' }}
        </fm-button>
        <fm-button
          v-else
          class="send-button"
          :disabled="firstFlag"
          type="primary"
          @click="resetCount"
        >
          {{ firstFlag ? countDown + 's重新获取' : '发送验证码' }}
        </fm-button>
      </div>
      <div style="margin: 16px">
        <fm-button
          block
          :disabled="firstDisabled"
          type="primary"
          @click="firstSubmit"
          native-type="submit"
          >下一步</fm-button
        >
      </div>
    </fm-form>
    <!-- 密码 确认密码 -->
    <fm-form class="form-container" ref="lastForm" v-if="nextStep">
      <fm-field
        class="field-mobile"
        v-model="form.pwd"
        clearable
        name="密码"
        placeholder="请输入新密码"
        @blur="lastCheckValidator"
        :type="firstNewPwdType"
        @click-suffix-icon="viewPassword('firstNewPwdType')"
        :rules="firstNewPwdRules"
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
        @blur="lastCheckValidator"
        :type="lastNewPwdType"
        @click-suffix-icon="viewPassword('lastNewPwdType')"
        :rules="lastNewPwdRules"
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
        <fm-button
          round
          block
          @click="onSubmit"
          :disabled="lastDisabled"
          type="primary"
          native-type="submit"
          >确认</fm-button
        >
      </div>
    </fm-form>
  </div>
</template>
<script>
import { Button, NavBar, Form, Field, Image, Icon, Checkbox, Toast } from 'fawkes-mobile-lib'
import { pwdEncrypt } from '@/utils/encryption/pwd'
import { isPhone, pwdRule } from '@/utils/validate'
import { getCode, resPass } from './api'
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
      nextStep: false,
      firstNewPwdType: 'password',
      lastNewPwdType: 'password',
      firstFlag: false, //获取验证码按钮是否禁用
      countDown: 0,
      form: {
        captcha: '',
        key: '',
        phone: '',
        pwd: '',
        confirmPwd: '',
      },
      firstDisabled: true,
      lastDisabled: true,
      sendCaptcha: true,
      phoneRules: [
        {
          required: true,
          message: '手机号不能为空',
          trigger: 'onBlur',
        },
        {
          // 自定义校验规则
          validator: (value) => {
            return isPhone(value)
          },
          message: '请输入正确的手机号格式',
          trigger: 'onBlur',
        },
      ],
      captchaRules: [
        {
          required: true,
          message: '验证码不能为空',
          trigger: 'onBlur',
        },
        {
          // 自定义校验规则
          validator: (value) => {
            return value.length >= 4
          },
          message: '请输入正确的验证码个数',
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
    //发送验证码
    resetCount() {
      //成功时的程序
      if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
        this.CheckFromErrMsg.phone = '请输入正确格式的手机号码'
        this.$nextTick(() => {
          this.firstDisabled = true
        })
        return false
      }
      getCode(this.form.phone).then((res) => {
        if (res.status == true) {
          this.countDown = 60
          this.form.key = res.data
          this.count()
        } else {
          Toast(res.message)
        }
      })
    },
    // 计时器
    count() {
      this.firstFlag = true
      let counter = window.setInterval(() => {
        this.countDown--
        if (this.countDown == 0) {
          this.firstFlag = false
          window.clearInterval(counter)
        }
      }, 1000)
    },
    // 第一步form校验
    firstCheckValidator() {
      // 手机号单独验证   判断是否禁用发送验证码按钮
      this.$refs.firstForm
        .validate('phone')
        .then(() => {
          //成功时的程序
          this.$nextTick(() => {
            this.sendCaptcha = false
          })
        })
        .catch(() => {
          //失败时的程序
          this.$nextTick(() => {
            this.sendCaptcha = true
          })
        })
      this.$refs.firstForm
        .validate()
        .then(() => {
          //成功时的程序
          this.$nextTick(() => {
            this.firstDisabled = false
          })
        })
        .catch(() => {
          //失败时的程序
          this.$nextTick(() => {
            this.firstDisabled = true
          })
        })
    },
    // 第二步form校验
    lastCheckValidator() {
      this.$refs.lastForm
        .validate()
        .then(() => {
          //成功时的程序
          this.$nextTick(() => {
            this.lastDisabled = false
          })
        })
        .catch(() => {
          //失败时的程序
          this.$nextTick(() => {
            this.lastDisabled = true
          })
        })
    },

    // 第一步提交
    firstSubmit() {
      this.nextStep = true
    },
    // 完成
    onSubmit() {
      const data = {
        captcha: this.form.captcha,
        key: this.form.key,
        phone: this.form.phone,
        pwd: pwdEncrypt(this.form.pwd),
        confirmPwd: pwdEncrypt(this.form.confirmPwd),
      }
      resPass(data).then((res) => {
        if (res.status) {
          Toast('密码修改成功')
          this.$router.push('/login')
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
