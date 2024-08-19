<template>
  <div class="InfoCard" @click="execute(inWarehouseMaterialInfo)">
    <div class="topSide">
      <div class="topIcon">
        <img :src="imageUrl" alt="" />
      </div>
<!--      验收单标题-->
      <div class="bottomTitle">物资名称:{{ inWarehouseMaterialInfo.materialName }}</div>
    </div>
    <div class="bottomSide">
      <div class="commonStyle">
        <img src='../../../assets/img/material/placeOrder.png' alt="" />
        <div class="titleText">物资类别:</div>
        <span class="taskStartTime">{{ this.inWarehouseMaterialInfo.materialTypeName}}</span>
      </div>
      <div class="commonStyle">
        <img src='../../../assets/img/material/supplier.png' alt="" />
        <div class="titleText">单位:</div>
        <span class="taskStartTime">{{ this.inWarehouseMaterialInfo.settlementUnit}}</span>
      </div>
      <div class="commonStyle">
        <img src='../../../assets/img/material/supplier.png' alt="" />
        <div class="titleText">数量:</div>
        <span class="taskStartTime">{{ this.inWarehouseMaterialInfo.buyNumber}}</span>
      </div>
      <div class="commonStyle">
        <img src='../../../assets/img/material/supplier.png' alt="" />
        <div class="titleText">单价:</div>
        <span class="taskStartTime">{{ this.inWarehouseMaterialInfo.price}}</span>
      </div>
    </div>
    <div class="twoButton">
      <div @click="materialInWarehouse(inWarehouseMaterialInfo.id)">入库</div>
    </div>
  </div>
</template>

<script>
export default {
  name:'CheckMaterialCardEle',
  props:{
    inWarehouseMaterialInfo:{}
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
    // 跳转到入库界面，设置入库个数
    materialInWarehouse(id){
      this.$storage.set('materialInWarehouseId',id)//存储的是验收单明细的id
      this.$router.push({
        path: '/material/InWarehouseMaterialInfo',
      })
    }
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
  height: 284px;
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
    background-color: #eee;
    .centerLine {
      height: 70%;
      width: 2px;
      background-color: #eee;
    }
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
