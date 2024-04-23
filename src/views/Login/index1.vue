<template>
  <div class="login-container">
    <!-- <change-lange></change-lange> -->
    <div class="logo-container">
      <!-- <div class="logo-pic"></div> -->
      <span class="logo-title"></span>
    </div>
    <!-- 表单登录 -->
    <div class="form-container">
      <fm-tabs>
        <fm-tab label="账号登录">
          <fm-form class="form-content">
            <fm-field
              class="field-username"
              clearable
              v-model="username"
              name="用户名"
              placeholder="请输入用户名"
              :rules="userRules"
              @focus="checkedField = 'user'"
              @blur="checkedField = null"
              clear-trigger="always"
              :class="checkedField == 'user' ? 'field-active' : ''"
            >
              <template #prefix-icon>
                <!-- <img
                  v-if="checkedField == 'user'"
                  class="news-img"
                  :src="require('@/assets/img/login/user-checked.png')"
                /> -->
                <img
                  class="news-img"
                  :src="require('@/assets/img/login/user.png')"
                />
              </template>
            </fm-field>
            <fm-field
              class="field-pwd"
              clearable
              v-model="password"
              :type="passwordType"
              name="密码"
              placeholder="请输入密码"
              :rules="pwdRules"
              @click-suffix-icon="viewPassword"
              @focus="checkedField = 'pwd'"
              @blur="checkedField = null"
              clear-trigger="always"
              :class="checkedField == 'pwd' ? 'field-active' : ''"
            >
              <template #prefix-icon>
                <img
                  class="news-img"
                  :src="require('@/assets/img/login/password.png')"
                />
              </template>
              <template #suffix-icon v-if="showIcon">
                <fm-image
                  v-if="passwordType == 'password'"
                  class="suffix-icon"
                  width="20"
                  height="20"
                  :src="require('@/assets/img/login/no-visible.png')"
                />
                <fm-image
                  v-else
                  class="suffix-icon"
                  width="20"
                  height="20"
                  :src="require('@/assets/img/login/visible.png')"
                />
                <!-- <i class="fm-icon fm-icon-eye-o suffix-icon" v-if="passwordType == 'text'"></i>
          <i class="fm-icon fm-icon-closed-eye suffix-icon" v-else></i> -->
              </template>
            </fm-field>
            <div class="sub-menu">
              <fm-checkbox v-model="rememberMe" shape="square">{{
                $t('login.RememberPassword')
              }}</fm-checkbox>
              <span @click="forgetPassword">{{
                $t('login.forgetPassword')
              }}</span>
            </div>
            <div class="login-btn-container">
              <fm-button
                class="login-btn"
                @click="onSubmit"
                block
                type="primary"
                native-type="submit"
                >{{ $t('login.login') }}</fm-button
              >
            </div>
          </fm-form>
        </fm-tab>
        <fm-tab label="手机登录">
          <fm-form class="form-content">
            <fm-field
              class="field-username"
              clearable
              v-model="phoneNumber"
              name="手机号码"
              placeholder="请输入手机号码"
              maxlength="11"
              :formatter="formatter"
              :rules="phoneRules"
              @focus="checkedField = 'phone'"
              @blur="checkedField = null"
              :class="checkedField == 'phone' ? 'field-active' : ''"
            >
              <template #prefix-icon>
                <img
                  class="news-img"
                  :src="require('@/assets/img/login/phone.png')"
                />
              </template>
            </fm-field>
            <fm-field
              class="field-pwd"
              clearable
              v-model="code"
              name="验证码"
              placeholder="请输入验证码"
              maxlength="50"
              :rules="codeRules"
              @focus="checkedField = 'code'"
              @blur="checkedField = null"
              :class="checkedField == 'code' ? 'field-active' : ''"
            >
              <template #prefix-icon>
                <img
                  class="news-img"
                  :src="require('@/assets/img/login/验证码.png')"
                />
              </template>
              <template #button>
                <div id="buttonDiv" @click="getSMS">
                  <span v-if="countDown != -1 && countDown != -2" class="send_code">{{ countDown + 's重新获取' }}</span>
                  <span v-if="countDown == -1 || countDown == -2 " class="send_code">{{ countDown == -1 ? '重新获取' : '获取验证码' }}</span>
                  <!-- <span v-if="countDown == -1">
                    <fm-loading type="spinner" />
                  </span> -->
                </div>
              </template>
            </fm-field>
            <div class="login-btn-container">
              <fm-button
                class="login-btn"
                @click="onSubmitPhone"
                block
                type="primary"
                native-type="submit"
                >{{ $t('login.login') }}</fm-button
              >
            </div>
          </fm-form>
        </fm-tab>
      </fm-tabs>
    </div>
  </div>
</template>
<script>
import {
  Button,
  NavBar,
  Form,
  Field,
  Image,
  Icon,
  Checkbox,
  Toast,
} from 'fawkes-mobile-lib'
import { getSMSCaptcha } from './api'
import { encryptSM4 } from '@/utils/sm4'
import { GRANT_TYPE } from '@/settings'
import { mapGetters } from 'vuex'
import { SET_TEMP_USER, IS_LOGIN } from '@/store/Mutation/mutationTypes'
import { USER_LOGIN } from '@/store/Action/actionTypes'
import { loadLanguageAsync } from '@/utils/locale' //引入获取系统语言的方法
import { eventBackButton, exitApp } from '@/utils/app'
import md5 from 'js-md5'

export default {
  name: 'login',
  components: {
    // changeLange,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Image.name]: Image,
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
  },
  data() {
    return {
      countDown: -2, //用于记录当前获取短信的状态 -2：还未获取 -1：可再次获取 >0：获取后正在加载
      username: '',
      password: '',
      phoneNumber: '',
      code: '',
      captcha_key: '',
      errorParams: {},
      smsLoading: false, // 获取验证码按钮是否处于加载状态
      rememberMe: false,
      showIcon: true,
      passwordType: 'password',
      checkedField: null,
      userRules: [
        {
          required: true,
          message: '用户名不能为空',
          trigger: 'onBlur',
        },
      ],
      pwdRules: [
        {
          required: true,
          message: '密码不能为空',
          trigger: 'onBlur',
        },
      ],
      phoneRules: [
        {
          required: true,
          message: '手机号码不能为空',
          trigger: 'onBlur',          
        }
      ],
      codeRules: [
        {
          required: true,
          message: '验证码不能为空',
          trigger: 'onBlur',          
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['tempUser']),
  },
  watch: {
    username(newUsername) {
      // 清空用户名时密码也清空
      if (!newUsername) {
        this.password = ''
        this.showIcon = true
      }
    },
    phoneNumber(newValue, oldValue) {
      //清空手机号码，验证码也清空
      if (!newValue) {
        this.code= ''
      }
    },
    password(newPassword) {
      // 清空密码时显示查看密码按钮
      if (!newPassword) {
        this.showIcon = true
      }
    },
  },
  mounted() {
    this.rememberMe = this.$storage.get('rememberMe') === 'true'
    if (this.rememberMe) {
      this.username = this.$storage.get('username')
      this.password = this.$storage.get('password')
      this.showIcon = false
      this.passwordType = 'password'
    } else {
      this.username = this.tempUser?.username
      this.password = this.tempUser?.password
    }
    // 移除返回上一级路由事件，设置退出应用
    document.removeEventListener('backbutton', this.$back, false)
    document.addEventListener('backbutton', eventBackButton, false)
  },
  beforeDestroy() {
    this.$store.commit(SET_TEMP_USER, {
      password: this.password,
      username: this.username,
    })
    // 恢复默认的返回上一级路由响应事件
    document.removeEventListener('backbutton', eventBackButton, false)
    document.removeEventListener('backbutton', exitApp, false)
    document.addEventListener('backbutton', this.$back, false)
  },
  methods: {
    formatter(value) {
      //过滤除数字以外的字符
      return value.replace(/[^\d]/g,'')
    },
    onSubmitPhone() {
      if (!this.phoneNumber) {
        return Toast('手机号码不能为空')
      }
      if (!this.code) {
        return Toast('验证码不能为空')
      }
      let loginData = this.getSMSLoginForm()
      if (loginData.username && loginData.captcha_code) {
        console.log
        Toast.loading({
          message: '登录中',
          duration: 0,
          forbidClick: true
        });
        this.$store
          .dispatch(USER_LOGIN, loginData)
          .then(() => {
            this.$store.commit(IS_LOGIN, true)
            this.$router.push('/tabBar')
            console.log('/tabBAr')
            if (!this.$storage.get('langList')) {
              let key = this.$storage.get('i18nLocale')
              let locale = this.$storage.get('i18nLocaleKey')
              // loadLanguageAsync(key, locale, this)
            }
            this.updataStorage()
          })
          .finally(() => {
            Toast.clear()
            // this.$loading.hide()
          })
      }
    },
    getSMSLoginForm() {
      const form = {}
      form.grant_type = GRANT_TYPE.sms_captcha.code
      form.username = this.phoneNumber
      form.captcha_code = this.code
      form.captcha_key = this.captcha_key
      return form
    },
    viewPassword() {
      if (this.passwordType == 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    onSubmit() {
      if (!this.username) {
        return Toast('用户名不能为空')
      }
      if (!this.password) {
        return Toast('密码不能为空')
      }
      const loginData = this.getLoginForm()
      console.log(loginData, 'loginData222222')

      if (loginData.password && loginData.username) {
        // this.$loading.show({ title: '' })
        Toast.loading({
          message: '登录中',
          duration: 0,
          forbidClick: true
        });
        this.$store
          .dispatch(USER_LOGIN, loginData)
          .then(() => {
            this.$store.commit(IS_LOGIN, true)
            this.$router.push('/tabBar')
            if (!this.$storage.get('langList')) {
              let key = this.$storage.get('i18nLocale')
              let locale = this.$storage.get('i18nLocaleKey')
              // loadLanguageAsync(key, locale, this)
            }
            this.updataStorage()
          })
          .finally(() => {
            Toast.clear()
            // this.$loading.hide()
          })
      }
    },
    getLoginForm() {
      const form = {}
      form.grant_type = GRANT_TYPE.password.code
      form.username = this.username
      // if (this.showIcon) {
      form.password = encryptSM4(this.password)
      // form.password = md5(this.password)
      // } else {
      //   form.password = this.password
      // }
      return form
    },
    // 登录成功时更新缓存
    updataStorage() {
      this.$storage.set('username', this.username)
      this.$storage.set('rememberMe', this.rememberMe)
      if (this.rememberMe) {
        this.$storage.set('password', this.password)
      } else {
        this.$storage.remove('password')
      }
      // 记录错误次数
      this.errorParams[this.username] = 0
      this.$storage.set('errorParams', JSON.stringify(this.errorParams))
    },
    goToSignUp() {
      this.$router.push('/signup')
    },
    // 忘记密码
    forgetPassword() {
      this.$router.push('/forget')
    },
    //手机号验证规则
    testPhone(str) {
      const reg = /^1[3456789]\d{9}$/
      return reg.test(str)
    },
    //验证手机号
    validPhone() {
      if(!this.testPhone(this.phoneNumber)) {
        return false
      } else {
        return true
      }
    },
    // 获取短信验证码
    getSMS() {
      if(!this.phoneNumber) return Toast('手机号码不能为空')
      if(this.countDown < 0 && this.phoneNumber) {
        if(!this.validPhone()) {
          return Toast('格式错误')
        }
        this.smsLoading = true
        getSMSCaptcha({ phone: this.phoneNumber })
          .then((res) => {
            console.log('getSMS res', res)
            this.smsLoading = false
            if (res.status) {
              this.captcha_key = res.data
              this.updataCountDown()
            }
          })
          .catch((err) => {
            this.updataCountDown()
          })
      } else {
        if (this.countDown < 0) {
          
        }
      }
    },
    //更新获取短信验证码的时间
    updataCountDown() {
      this.smsLoading = false
      this.countDown = 60
      const count = setInterval(() => {
        if (this.countDown == 0) {
          clearInterval(count)
          this.countDown = -1
        } else {
          this.countDown--
        }
      }, 1000)
    }
  },
}
</script>
<style lang="less" scoped>
/deep/.fm-field__error-message {
  position: absolute;
  top: 80px;
}
/deep/.fm-cell {
  overflow: visible;
  &::after {
    left: 0px;
    display: none;
  }
}
/deep/ .fm-tabs {
  padding-top: 31px;
  z-index: 1;
}
.suffix-icon {
  margin-left: 10px;
}
/deep/.fm-field__prefix-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/.fm-field__suffix-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
.fm-icon-closed-eye:before {
  width: 36px;
  height: auto;
}
.fm-icon-eye-o:before {
  width: 36px;
  height: auto;
}
.news-img {
  width: 32px;
  height: 32px;
  margin-right: 24px;
}
.send_code {
  font-size: 28px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #5B9DFF;
  line-height: 40px;
  display: flex;
  align-items: center;
  &::before {
    content: '';
    width: 2px;
    height: 21px;
    background: #5bcbff;
    border-radius: 2px;
    margin-right: 32px;
  }
}
.fm-field {
  border-radius: 0;
}
.login-container {
  height: 100%;
  background: url('../../assets/img/login/login_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 164px;
  .logo-pic {
    width: 120px;
    height: 120px;
    background-image: url('../../assets/img/login/new-logo.png');
    background-repeat: no-repeat;
    background-size: 100%;
  }
  .logo-title {
    width: 279px;
    height: 181px;
    background-image: url('../../assets/img/login/login-logo.png');
    background-repeat: no-repeat;
    background-size: 100%;
    // margin-top: 32px;
    // font-size: 60px;
    // font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    // font-weight: bold;
    // color: #ffffff;
    // line-height: 90px;
    // letter-spacing: 8px;
    // text-shadow: 0px 6px 8px rgba(1, 17, 50, 0.2);
    // background-clip: text;
  }
}
.tip {
  margin-bottom: 44px;
  font-size: 36px;
  font-weight: 600;
}
.form-container {
  width: 100%;
  margin: 72px 0 0 0;
  position: relative;
  // background: url('../../assets/img/login/login_form_bg.png');
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  height: calc(100% - 173px);
  &::after{
    content: '';
    position: absolute;
    width: 200%;
    height: 100%;
    left: -50%;
    top: 0;
    border-radius: 50% 50% 0 0;
    background: #fff;
    // z-index: 0;
    overflow: hidden;
  }
  /deep/ .fm-tabs__nav {
    background-color: transparent;
    margin: 0 147px;
    .fm-tab {
      color: rgba(25, 25, 25, 0.4);
      font-weight: 600;
      font-family: PingFangSC-Semibold, PingFang SC;
    }
    .fm-tab--active {
      color: rgba(25, 25, 25, 1);
    }
    .fm-tabs__line {
      background: rgba(30, 108, 218, 1);
      border-radius: 6px;
      width: 50px;
    }
  }
  .form-content {
    padding: 0 50px;
    margin-top: 68px;
    .sub-menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999999;
      font-size: 28px;
      margin-top: -13px;
      /deep/.fm-checkbox__label {
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
        line-height: 33px;
        letter-spacing: 2px;
      }
    }
  }
}
/deep/.fm-checkbox__icon {
  background-color: #f5f5f5;
  height: 24px;
  border-radius: 3px;
}
/deep/.fm-icon {
  border: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;  
}
/deep/ .fm-icon-success:before {
  height: 24px;
  font-size: 24px;
  position: absolute;
  left: -1px;
  top: -1px;
}
/deep/.fm-field__control {
  color: #BDC3CD !important;
  &::placeholder {
    color: #BDC3CD !important;
  }
}
.field-username,
.field-pwd {
  // background-color: #f5f5f5;
  // height: 75px;
  margin-bottom: 57px;
  background: #F1F5FC;
  border-radius: 42px;
  height: 84px;
  display: flex;
  align-items: center;
  /deep/ .fm-cell__value {
    .fm-field__body {
      .fm-icon-clear {
        &::before {
          font-size: 24px;
        }
      }
    }
  }  
}
.field-pwd {
  /deep/ .fm-cell__value {
    .fm-field__body {
      .fm-icon-clear {
        &::before {
          position: absolute;
          bottom: -10px;
        }
      }
    }
  }
}
.field-active {
  /deep/.fm-field__control {
    color: #191919 !important;
  }
}

.footer-container {
  padding-top: 260px;
  display: flex;
  justify-content: center;
  .logo-footer {
    width: 134px;
    height: 20px;
  }
}

.login-btn-container {
  margin: 0 auto;
  padding-top: 64px;
  height: 80px;
  .login-btn {
    width: 100%;
    height: 100%;
    font-size: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 45px;
    border-radius: 44px;
    border: none;
    background: linear-gradient(90deg, #247BFD 0%, #3AA0EE 100%);
  }
}
.fm-field--error ::placeholder {
  color: #BDC3CD;
}
/deep/ .fm-field--error .fm-field__control,
.fm-field--error .fm-field__control::placeholder {
  color: #999999;
}
.fm-field ::placeholder {
  color: #999999;
}
</style>
