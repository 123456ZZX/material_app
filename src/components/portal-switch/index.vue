<!--
 * @Description: 
 * @Author: ye_xf
 * @Date: 2022-08-03 15:20:43
 * @LastEditTime: 2022-09-07 15:03:32
 * @LastEditors: Please set LastEditors
 * @Reference: 
-->
<template>
  <div class="portal-container" v-if="portalSwicth">
    <div class="portal-name-box" @click="openProtal">
      <img :src="require(`@/assets/img/portal.png`)" class="icon-portal" />
      <div class="portal-name">{{ portalTitle }}</div>
      <img :src="require(`@/assets/img/select.png`)" class="icon-portal" />
    </div>
    <fm-popup :visible.sync="show" position="top">
      <div
        class="top-box"
        :style="'padding-top:' + (statusBarHeight + 24) + 'px'"
      >
        <div class="top-title">门户选择</div>
        <img
          :src="require(`@/assets/img/portal-up.png`)"
          class="portal-up"
          @click="close"
        />
      </div>
      <div
        class="bottom-box"
        :style="'margin-top:' + (statusBarHeight + 72) + 'px'"
      >
        <div
          class="portal-box"
          v-for="(item, index) in portalData"
          :key="item.value"
        >
          <div class="portal-box-title">{{ item.text }}</div>
          <div
            class="portal-select"
            v-for="it in primaryPortals[index]"
            :key="it.id"
            @click="handleClick(it, item.value)"
          >
            <div class="portal-select-left">
              <img
                :src="require(`@/assets/img/portal-icon.png`)"
                class="portal-logo"
              />
              <span class="portal-select-title">{{ it.name }}</span>
              <img
                v-if="activePortal.id == it.id"
                :src="require(`@/assets/img/current-portal.png`)"
                class="portal-image"
              />
            </div>
            <div class="portal-select-right">
              <img
                v-if="activePortal.id == it.id"
                :src="require(`@/assets/img/select-icon.png`)"
                class="select-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </fm-popup>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import { CHANGE_PORTAL, UPDATE_USER } from '@/store/Action/actionTypes'
import { getPortals } from './api'
import { STATUS_BAR_HEIGHT } from '@/store/State/stateTypes'

export default {
  name: 'portalSwitch',
  data() {
    return {
      portalSwicth: false,
      show: false,
      portals: [],
      dropdownMenuValue: 1,
      portalData: [],
      portalTitle: '',
      primaryPortals: [],
      activePortal: null,
      isPopup: false,
    }
  },
  computed: {
    statusBarHeight() {
      return this.$store.state[STATUS_BAR_HEIGHT]
    },

    ...mapGetters(['multiPortal']),
  },
  methods: {
    openProtal() {
      this.show = true
    },
    close() {
      this.show = false
    }, //100以内的数字转中文
    numberToChar(num) {
      const chars = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

      if (num <= 10) {
        return chars[num - 1]
      } else {
        const nums = num.toString().split('')
        if (num < 20) {
          return chars[9] + chars[+nums.slice(-1) - 1]
        } else {
          if (num % 10 === 0) {
            return chars[+nums[0] - 1] + chars[9]
          }
          return chars[+nums[0] - 1] + chars[9] + chars[+nums.slice(-1) - 1]
        }
      }
    },
    init() {
      getPortals()
        .then((res) => {
          if (!res.status) {
            return
          }

          this.portals = res.data

          let set = new Set()
          if (res.data.length == 0) {
            return
          }
          this.portals.forEach((item) => {
            set.add(item.type) //去重
          })

          Array.from(set)
            .sort((a, b) => {
              return a - b //正序
            })
            .forEach((type) => {
              this.portalData.push({
                text: `${this.numberToChar(type)}级门户`,
                value: type,
              })
            })
          var currentPortal
          if (JSON.stringify(store.state.portal) == '{}') {
            currentPortal = this.portals[0]
          } else {
            currentPortal = store.state.portal
          }

          this.dropdownMenuValue = currentPortal.type

          this.portalTitle = `${this.numberToChar(currentPortal.type)}级门户`

          this.activePortal = Object.assign({}, currentPortal)
          this.portalSwicth = true
          this.portalData.forEach((item, index) => {
            this.primaryPortals[index] = this.portals.filter(
              (it) => it.type === item.value
            )
          })
        })
        .catch(() => {})
    },
    handleClick(data, value) {
      this.portalTitle = `${this.numberToChar(value)}级门户`

      this.dropdownMenuValue = data.type
      this.activePortal = data

      this.$store.dispatch(CHANGE_PORTAL, data)
      this.$store.dispatch(UPDATE_USER, data.id)

      this.show = false

      this.$router.replace('/distribute')
    },
    dropdownItemClick(value) {
      this.portalTitle = `${this.numberToChar(value)}级门户`
      // this.primaryPortals = this.portals.filter((item) => item.type === value)
    },
    portalClick(data) {
      this.dropdownMenuValue = data.type
      this.activePortal = data

      this.$store.dispatch(CHANGE_PORTAL, data)
      this.$store.dispatch(UPDATE_USER, data.id)

      this.isPopup = false

      this.$router.replace('/distribute')
    },
  },
  created() {
    if (!this.multiPortal) {
      return
    }
    this.init()
  },
}
</script>

<style scoped lang="less">
.portal-container {
  height: 96px;
  display: flex;
}

/deep/.fm-popup {
  background: #f7f8f9;
  border-radius: 0px 0px 16px 16px;
  min-height: 25%;
  max-height: 70%;
  height: auto;
}

.top-box {
  position: fixed;
  height: 48px;
  width: 92%;
  top: 0;
  left: 0;
  background: #ffffff;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 9999;
  .top-title {
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #15171a;
    line-height: 36px;
  }
  .portal-up {
    width: 48px;
    height: 48px;
  }
}

.bottom-box {
  background: #ffffff;
}

.portal-box::after {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 718px;
  height: 2px;
  content: '';
  background: #ebedef;
}

.portal-box {
  padding: 32px;
  position: relative;

  .portal-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 32px;
    .portal-select-left {
      display: flex;
      align-items: center;
    }
    .portal-select-right {
    }
  }
  .portal-logo {
    width: 68px;
    height: 68px;
    margin-right: 16px;
  }
  .select-logo {
    width: 40px;
    height: 40px;
  }
  .portal-image {
    width: 104px;
    height: 32px;
  }
  .portal-select-title {
    height: 68px;
    font-size: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #15171a;
    line-height: 68px;
    margin-right: 16px;
  }
  .portal-box-title {
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #b5b9be;
    line-height: 36px;
  }
}
.portal-name-box {
  display: flex;
  align-items: flex-end;
  .portal-name {
    font-size: 28px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #15171a;
    line-height: 40px;
  }
  .icon-scan {
    width: 40px;
    height: 40px;
    margin-left: 24px;
  }
  .icon-portal {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }
}

// .portal-switch-box {
//   .dropdown-item-box {
//     padding: 0 32px;

//     .item {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       padding: 32px 0;
//       border-bottom: 1px solid #eee;
//     }

//     .active {
//       color: #027aff;
//     }
//   }

//   .popup-content {
//     padding: 32px 32px 0;

//     .portal-title {
//       padding-bottom: 32px;
//       text-align: center;
//       font-weight: bold;
//       border-bottom: 1px solid #eee;
//     }

//     .primary-portal-box {
//       .item {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         padding: 32px 0;
//         border-bottom: 1px solid #eee;
//       }

//       .active {
//         color: #027aff;
//       }
//     }
//   }
// }
</style>