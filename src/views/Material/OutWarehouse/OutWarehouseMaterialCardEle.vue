<template>
  <div class="InfoCard" @click="execute(outWarehouseMaterialInfo)">
    <div class="topSide">
      <div class="topIcon">
        <img :src="imageUrl" alt="" />
      </div>
      <div class="bottomTitle">物资名称:{{ outWarehouseMaterialInfo.materialName }}</div>
    </div>
    <div class="bottomSide">
      <div class="commonStyle">
        <img src='../../../assets/img/material/supplier.png' alt="" />
        <div class="titleText">库房:</div>
        <span class="taskStartTime">{{outWarehouseMaterialInfo.locationName}}</span>
      </div>

      <div class="commonStyle keyPoint">
        <img src='../../../assets/img/material/supplier.png' alt="" />
        <div class="titleText">库位:</div>
        <span class="taskStartTime">{{outWarehouseMaterialInfo.shelfName}}</span>
      </div>
      <div class="commonStyle">
        <img src='../../../assets/img/material/placeOrder.png' alt="" />
        <div class="titleText">物资类别:</div>
        <span class="taskStartTime">{{outWarehouseMaterialInfo.materialTypeName}}</span>
      </div>
      <div class="commonStyle">
        <img src='../../../assets/img/material/placeOrder.png' alt="" />
        <div class="titleText">单位:</div>
        <span class="taskStartTime">{{outWarehouseMaterialInfo.unit}}</span>
      </div>
      <div class="commonStyle">
        <img src='../../../assets/img/material/supplier.png' alt="" />
        <div class="titleText">物资库存:</div>
        <span class="taskStartTime">{{outWarehouseMaterialInfo.totalNumber}}</span>
      </div>

    </div>
    <div class="twoButton">
      <fm-button class='button_sty' @click="materialOutWarehouse(outWarehouseMaterialInfo.materialId)">出库</fm-button>
    </div>
  </div>
</template>

<script>
export default {
  name:'outWarehouseMaterialCardEle',
  props:{
    outWarehouseMaterialInfo:{}
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
    // 跳转到物资设置出库数量页面
    materialOutWarehouse(id){

      //根据水厂，库房，库位，物资查询物资库存
      this.$storage.set('materialOutWarehouseId',this.outWarehouseMaterialInfo.materialId)//存储的是库存物资的id（要出库的物资id）
      this.$storage.set('locationOutWarehouseId',this.outWarehouseMaterialInfo.locationId)
      this.$storage.set('shelfOutWarehouseId',this.outWarehouseMaterialInfo.shelfId)
      this.$storage.set('warehouseOutWarehouseId',this.outWarehouseMaterialInfo.warehouseId)

      this.$router.push({
        path: '/material/outWarehouseMaterialInfo',
      })
    }
  },
}
</script>


<style lang='less' scoped>
.InfoCard {
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 690px;
  height: 350px;
  margin: auto auto;
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
