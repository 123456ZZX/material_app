<template>
  <div class="InfoCard" @click="execute(makeWarehouseInfo)">
    <div class="topSide">
      <div class="topIcon">
        <img :src="imageUrl" alt="" />
      </div>
      <div class="bottomTitle">盘库编号:{{ makeWarehouseInfo.id }}</div>
    </div>
    <div class="bottomSide">
      <div class="commonStyle">
        <img src='../../../assets/img/material/placeOrder.png' alt="" />
        <div class="titleText">下发时间:</div>
        <span class="taskStartTime">{{ this.makeWarehouseInfo.issueDatetime}}</span>
      </div>
      <div class="commonStyle">
        <img src='../../../assets/img/material/supplier.png' alt="" />
        <div class="titleText">水厂:</div>
        <span class="taskStartTime">{{ this.makeWarehouseInfo.warehouseName}}</span>
      </div>
      <div class="commonStyle">
        <img src='../../../assets/img/material/supplier.png' alt="" />
        <div class="titleText">库房:</div>
        <span class="taskStartTime">{{ this.makeWarehouseInfo.locationName}}</span>
      </div>
    </div>
    <div class="twoButton">
      <fm-button class='button_sty' @click="materialInWarehouse(makeWarehouseInfo)">物资</fm-button>
    </div>
  </div>
</template>

<script>
export default {
  name:'makeWarehouseCardEle',
  props:{
    makeWarehouseInfo:{}
  },
  computed: {
    imageUrl() {
      return require(`../../../assets/img/material/material.png`)
    },
  },
  methods:{
    execute(item) {
      this.$emit('execute', item)
    },

    //跳转盘库物资列表页面
    materialInWarehouse(makeWarehouseInfo){
      this.$storage.set('makeWarehouseId',makeWarehouseInfo.id)
      this.$router.push({
        path: '/material/makeWarehouseMaterialList',
      })
    },
  },
}
</script>


<style lang='less' scoped>
.InfoCard {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 690px;
  height: 300px;
  margin: 24px auto;
  border-radius: 16px;
  box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
  background-color: rgb(255, 255, 255);

  .topSide {
    width: 100%;
    height: 114px;
    font-size: 36px;
    font-weight: 600;
    color: #191919;
    border-bottom: 1px solid #ccc;
    // background-color: #ffa0a0;

    .topIcon {
      position: relative;
      width: 100%;
      height: 43px;
      // background-color: red;

      img {
        position: absolute;
        top: 0;
        right: 0;
        width: 141px;
        height: 43px;
      }
    }

    .bottomTitle::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 30px;
      background-color: #2062c4;
      margin-right: 34px;
    }

    .bottomTitle {
      width: 100%;
      height: 71px;
      // background-color: green;
    }
  }
  // 验收，物资详情按钮
  .twoButton {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 72px;
    font-size: 28px;
    color: #1b67d8;
    font-family: PingFangSC-Semibold, PingFang SC;
  }

  .button_sty {
    margin-top: 13px;
    background-color: #2062c4;
    color: white;
    height: 100%;
    width: 100%;
  }

  .bottomSide {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    height: 218px;
    font-size: 28px;
    font-family: PingFangSC-Semibold, PingFang SC;
    // background-color: #96ff9b;

    .taskStartTime {
      color: #2062c4;
    }

    img {
      width: 32px;
      height: 32px;
      margin: 0 10px 0 30px;
    }

    .commonStyle {
      display: flex;
      align-items: center;
      width: 100%;
      height: 30%;
    }

    .titleText {
      margin-right: 20px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
  }
}
</style>
