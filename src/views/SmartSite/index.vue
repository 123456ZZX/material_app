<!-- H5视频监控 -->
<template>
  <div style="overflow: hidden; height: 100%; background: #efeff4">
    <fm-nav-bar title="H5端监控功能演示" left-text="" left-arrow>
      <template #left>
        <i
          class="fm-icon fm-icon-wap-home-o"
          style="font-size: 24px; color: #ffffff"
          @click="$router.push('/index')"
        ></i>
      </template>
    </fm-nav-bar>
    <div class="warning-info" style="height: calc(100% - 66px)">
      <fm-cell class="title-cell" title="监控管理" :value="monitorList.length" is-link />
      <div class="monitor" style="height: calc(100% - 50px); overflow: auto">
        <fm-cell
          @click="gotoMonitor(item)"
          v-for="(item, index) in monitorList"
          :key="index"
          :title="item.monitorName"
          is-link
        />
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, CellGroup, Cell } from "fawkes-mobile-lib";
import { getMonitorData } from "./api";
export default {
  data() {
    return {
      monitorList: [],
    };
  },

  components: {
    [NavBar.name]: NavBar,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
  },

  computed: {},

  mounted() {
    this.getMonitor();
  },

  methods: {
    getMonitor() {
      const data = {
        entityName: "MonitorManagement",
        like: "",
        order: "create_date desc",
        page: 1,
        portalId: this.portalId,
        searchParamList: ["monitorName", "monitorCode", "userFullname"],
        size: 100,
      };
      this.$loading.show();
      getMonitorData(data)
        .then((res) => {
          if (res.status) {
            this.monitorList = res.data.list;
          }
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    gotoMonitor(item) {
      this.$router.push({
        path: "/monitorManagement",
        query: {
          name: item.monitorName,
          // longitudePosition: item.longitudePosition,
          // latitudePosition: item.latitudePosition,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .fm-nav-bar__content {
  background: #2377fc;
}
/deep/ .fm-nav-bar__title {
  color: #f9f9f9;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
}

.warning-info {
  margin: 0.6rem;
  background-color: #ffffff;
  .warning-item {
    display: flex;
    padding: 0.5rem 1rem;
    align-items: center;
    .item {
      margin-left: 15px;
      .time {
        font-family: PingFang SC, PingFang SC-Regular;
        color: #999999;
        font-size: 12px;
      }
    }
  }
}
.title-cell {
  /deep/.fm-cell__title {
    color: #333333;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 600;
    font-size: 17px;
    line-height: 20px;
    padding-left: 5px;
  }
  /deep/.fm-cell__title:before {
    content: "";
    display: block;
    height: 1.4rem;
    width: 4px;
    position: absolute;
    background: -webkit-linear-gradient(0deg, #0060d5 0%, #2292fc 100%);
    background: linear-gradient(0deg, #0060d5 0%, #2292fc 100%);
    left: 7px;
    border-radius: 2px;
  }
  /deep/.fm-cell__value {
    color: #1790fe;
  }
}
</style>
