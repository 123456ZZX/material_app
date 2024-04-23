<template>
  <div class="detail-container">
    <fm-nav-bar title="个人信息" :border="true">
      <template #left>
        <i class="fm-icon fm-icon-arrow-left" @click="back"></i>
      </template>
    </fm-nav-bar>
    <div class="main" v-if="loading">
      <div class="person-top">
        <img v-if="user.photoToken" :src="user.photoToken | lookHeadPhoto" />
        <img v-else :src="require('@/assets/img/avatar-person.png')" />
        <div class="person-userFullname">
          <div class="">{{ user.userFullname }}</div>
          <div>{{ user.sex ? user.sex : '暂无' }}</div>
        </div>
      </div>
      <div class="mian-container">
        <div class="person-item">
          <div class="person-item-left">
            <div>手机</div>
            <div>{{ user.phone }}</div>
          </div>
          <div>
            <img
              class="icon"
              :src="require('@/assets/img/phone.png')"
              @click="callPhone(user.phone)"
            />
            <img
              class="icon"
              :src="require('@/assets/img/sms.png')"
              @click="sendMessage(user.phone)"
            />
          </div>
        </div>
        <div class="person-item">
          <div class="person-item-left">
            <div>邮箱</div>
            <div>{{ user.email }}</div>
          </div>
        </div>
        <div class="person-item">
          <div class="person-item-left">
            <div>单位</div>
            <div>{{ user.orgList.length > 0 ? user.orgList[0].parentName : '暂无' }}</div>
          </div>
        </div>
        <div class="person-item">
          <div class="person-item-left">
            <div>部门</div>
            <div>{{ user.orgList.length > 0 ? user.orgList[0].entName : '暂无' }}</div>
          </div>
        </div>
        <div class="person-item">
          <div class="person-item-left">
            <div>办公地点</div>
            <div>{{ user.officeLocation ? user.officeLocation : '暂无' }}</div>
          </div>
        </div>
      </div>
      <!-- <div class="person-bottom">
        <div>备注</div>
        <div>{{ user.officeLocation ? user.officeLocation : '暂无' }}</div>
      </div> -->
    </div>
  </div>
</template>
<script>
import { getUser } from '@/api/user'
import { NavBar, Cell, CellGroup, Image, Toast } from 'fawkes-mobile-lib'

export default {
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Image.name]: Image,
    [Toast.name]: Toast,
  },
  filters: {
    lookHeadPhoto: function (val) {
      return `${process.env.VUE_APP_BASE_URL}/sys-storage/download_image?f8s=${val}`
    },
  },
  data() {
    return {
      username: this.$route.query.username,
      user: {},
      isActive: null,
      loading: false,
    }
  },

  mounted() {
    // 添加自定义返回键响应事件
    document.removeEventListener('backbutton', this.$back, false)
    document.addEventListener('backbutton', this.back, false)
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    })
    getUser({ userName: this.username }).then((res) => {
      if (res.status) {
        this.loading = true
        // 手动清除 Toast
        Toast.clear()
        this.user = res.data
        if (res.data.sex == '男') {
          this.isActive = res.data.sex == '男' ? true : false
        }
      }
    })
  },
  beforeDestroy() {
    // 移除自定义返回键响应事件
    document.removeEventListener('backbutton', this.back, false)
  },
  methods: {
    back() {
      this.$router.push({
        path: '/address',
      })
    },
    callPhone(phone) {
      window.location.href = 'tel://' + phone
    },
    sendMessage(phone) {
      window.location.href = 'sms:' + phone
    },
  },
}
</script>
<style scoped lang="less">
.detail-container {
  height: 100%;
  background: #eeeeee;
}
.main {
  height: calc(100% - 92px);
  overflow: auto;
}
.mian-container {
  background-color: #ffffff;
  padding: 0 30px;
}
.person-top {
  display: flex;
  padding: 48px 30px;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
  img {
    width: 130px;
    height: 130px;
    border-radius: 50%;
  }
  .person-userFullname {
    margin-left: 24px;
  }
}
.person-userFullname div:first-child {
  font-size: 40px;
  font-weight: 500;
  color: #333333;
  line-height: 48px;
  margin-top: 10px;
}
.person-userFullname div:last-child {
  font-size: 28px;
  color: #999999;
  line-height: 36px;
  margin-top: 26px;
}
.person-item {
  padding: 22px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.person-item-left div:first-child {
  height: 40px;
  font-size: 28px;
  color: #999999;
  line-height: 40px;
}
.person-item-left div:last-child {
  height: 40px;
  font-size: 32px;
  color: #191919;
  line-height: 40px;
  margin-top: 16px;
}
.icon {
  width: 40px;
  height: 40px;
}
.icon:first-child {
  margin-right: 40px;
}
.person-bottom {
  padding: 22px 30px;
  background-color: #fff;
  margin-top: 16px;
  padding-bottom: 96px;
}

.person-bottom div:first-child {
  font-size: 28px;
  color: #999999;
}
.person-bottom div:last-child {
  font-size: 32px;
  color: #191919;
  line-height: 46px;
  margin-top: 13px;
}
</style>
