<template>
  <div class="main">
    <div class="problemList">
      <div class="con-div" v-for="(item, index) in tableList" :key="index">
        <div class="top" @click="jump(item.id)">
          <div class="name">{{ getZHCN(item.faultTypes) }}</div>
          <div :class="
            item.ticketStatusName == '已完结'
              ? 'state c1'
              : item.ticketStatusName == '办理中'
                ? 'state c2'
                : 'state c3'
          ">
            {{ item.ticketStatusName }}
          </div>
          <!-- <i class="fm-icon fm-icon-arrow" ></i> -->
          <img class="img" src="./img/gps.png" @click.stop="toTarget(item.lnglat)" />
        </div>
        <div class="content">
          {{ item.questionDescribe }}
        </div>
        <div class="under">
          <div class="under-div">
            <img class="imgLogo1" src="@/views/ProblemReport/img/people.png" />
            <span>{{ item.createByName }}</span>
          </div>
          <div class="under-div">
            <img class="imgLogo2" src="@/views/ProblemReport/img/load.png" />
            <span>{{ getZHCN(item.defectFrom) }}</span>
          </div>
          <div class="under-div1">
            <img class="imgLogo" src="@/views/ProblemReport/img/time.png" />
            <span>{{ item.createTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ENUM } from '@/store/State/stateTypes'
import axios from 'axios'
export default {
  name: 'problemList',
  props: {
    tableList: {
      type: Array,
      required: [],
    },
  },
  created() {

    axios({
      url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/userCenterApi/sso/tokenByToken',
      method: 'post',
      params: {
        token: this.accessToken,
      },
      headers: {
        Authorization: 'Basic b3V0d29yazp3cGcyMDIw',
      },
    }).then((res) => {
      if (res.status == 200) {
        this.formToken = res.data.resultData.token
        this.header = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.formToken,
        }
        console.log(' this.header查询工单用 : ', this.header)
      }
    })
  },
  computed: {
    defectFromDic() {
      return this.$store.state[ENUM].defectFrom
    },
    faultTypesDic() {
      return this.$store.state[ENUM].faultTypes
    },
    getZHCN() {
      return (val) => {
        // console.log('val: ', val)
        try {
          let result = val
          if (this.faultTypesDic.length > 0) {
            this.faultTypesDic.forEach((dic) => {
              if (val == dic.code || val == dic['zh-CN']) {
                result = dic['zh-CN']
              }
            })
          }
          if (this.defectFromDic.length > 0) {
            this.defectFromDic.forEach((dic) => {
              if (val == dic.code || val == dic['zh-CN']) {
                result = dic['zh-CN']
              }
            })
          }

          return result
        } catch (error) {
          console.log('error: ', error)
        }
      }
    },
  },
  data() {
    return {
      lnglat: [],
      formToken: '',
      accessToken: this.$storage.get('access_token'),
    }
  },
  methods: {
    jump(id) {
      this.$router.push({
        name: 'detailProblemOrder',
        query: { id }
      })
    },
    // 地图相关
    toTarget(lnglat) {
      if (lnglat.length == 2) {
        this.$emit('flyTo', lnglat)
      } else {
        console.log('无位置信息')
      }
    },
  },
}
</script>

<style lang="less">
.main {
  background-color: #f2f3f4 !important;
  height: 1334px;
  width: 750px;
}

.problemList {
  z-index: 999;
  padding-bottom: 10px;
  position: fixed;
  bottom: 0px;
  width: 750px;
  height: 50%;
  overflow: scroll;
  max-height: 580px;
  background: #f4f7fc;
  box-shadow: 0px -4px 12px 0px rgba(104, 115, 127, 0.1);

  .con-div {
    // border: 1px saddlebrown solid;
    margin-top: 20px;
    width: 690px;
    margin-left: 30px;
    height: 218px;
    background: #ffffff;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.08);
    border-radius: 16px;

    .top {
      // border: 1px saddlebrown solid;
      width: 100%;
      height: 80px;
      line-height: 80px;

      // display: inline;
      .name {
        margin-left: 30px;
        float: left;
        width: auto;
        font-size: 36px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #191919;
      }

      .fm-icon-arrow {
        float: right;
        color: #555555;
      }

      .img {
        width: 30px;
        height: 39px;
        float: right;
        margin-right: 30px;
        margin-top: 15px;
      }

      .state {
        float: left;
        margin-left: 20px;
        margin-top: 20px;
        width: auto;
        padding-left: 10px;
        padding-right: 10px;
        height: 42px;
        line-height: 42px;
        border-radius: 4px;
      }

      .c1 {
        background: rgba(64, 187, 90, 0.1);
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #40bb5a;
      }

      .c2 {
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #027aff;
        background: rgba(2, 122, 255, 0.1);
      }

      .c3 {
        background: rgba(255, 148, 41, 0.1);
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ff9429;
      }
    }

    .content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 96%;
      height: 60px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #555555;
      line-height: 60px;
      padding-left: 30px;
    }

    .under {
      padding-left: 30px;
      padding-right: 30px;
      height: 70px;
      line-height: 70px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #555555;

      .under-div {
        width: 34%;

        float: left;

        .imgLogo1 {
          width: 27px;
          height: 27px;
          margin-right: 5px;
        }

        .imgLogo2 {
          vertical-align: middle;
          margin-top: -3px;
          width: 34px;
          height: 34px;
          margin-right: 5px;
        }
      }

      .under-div1 {
        // border: 1px solid;
        text-align: right;
        float: right;

        .imgLogo {
          vertical-align: middle;
          margin-top: -3px;
          width: 34px;
          height: 34px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
