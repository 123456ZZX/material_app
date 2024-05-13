<template>
  <div class="InfoCard" @click="execute(outWarehouseMaterialInfo)">
    <div class="topSide">
      <div class="topIcon">
        <img :src="imageUrl" alt="" />
      </div>
      <div class="bottomTitle">物资名称:{{ outWarehouseMaterialInfo.materialName }}</div>
    </div>
    <div class="bottomSide">
      <div class="commonStyle restTime">
        <img src='../../../assets/img/material/下单时间.png' alt="" />
        <div class="titleText">物资类别:</div>
        <span class="taskStartTime">{{outWarehouseMaterialInfo.materialTypeName}}</span>
      </div>
      <div class="commonStyle restTime">
        <img src='../../../assets/img/material/下单时间.png' alt="" />
        <div class="titleText">单位:</div>
        <span class="taskStartTime">{{outWarehouseMaterialInfo.unit}}</span>
      </div>
      <div class="commonStyle keyPoint">
        <img src='../../../assets/img/material/供货商.png' alt="" />
        <div class="titleText">物资库存:</div>
        <span class="taskStartTime">{{outWarehouseMaterialInfo.totalNumber}}</span>
      </div>
      <div class="commonStyle keyPoint">
        <img src='../../../assets/img/material/供货商.png' alt="" />
        <div class="titleText">库位:</div>
        <span class="taskStartTime">{{outWarehouseMaterialInfo.shelfName}}</span>
      </div>
    </div>
    <div class="twoButton">
      <div @click="materialOutWarehouse(outWarehouseMaterialInfo.materialId)">出库</div>
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
      return require(`../../../assets/img/material/物资.png`)
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


<style scoped lang='less' scoped>
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

    // 剩余时间
    .restTime {
      // background-color: rgb(255, 129, 245);

      .colon {
        display: inline-block;
        margin: 0 20px;
        font-size: 24px;
        font-weight: 400;
        color: #2062c4;
        line-height: 33px;
      }

      .block {
        display: inline-block;
        width: 38px;
        font-size: 24px;
        text-align: center;
        color: #2062c4;
        background: rgba(27, 103, 216, 0.1);
        border-radius: 6px;
      }
    }

    // 关键点
    .keyPoint {
      // background-color: rgb(126, 255, 216);

      .bigNumber {
        padding-bottom: 6px;
        font-size: 32px;
        font-weight: 600;
        color: #2062c4;
      }

      .smallText {
        margin-left: 6px;
        font-size: 28px;
        font-weight: 400;
        color: #999999;
      }
    }

    // 覆盖率进度条部分
    .progressBar {
      // background-color: rgb(253, 255, 123);

      // 第一层，固定进度条宽度
      .progressWidth {
        width: var(--totalWidth);
        height: 12px;
        border-radius: 6px;
        background: rgba(27, 103, 216, 0.08);
        box-shadow: inset 0px 0px 5px 0px rgba(39, 123, 214, 0.15);
        margin-right: 20px;

        // 第二层，计算得到的实际比率宽度
        .colorWidth {
          width: var(--barWidth);
          height: 12px;
          border-radius: 6px;
          box-shadow: 0px 4px 8px 0px rgba(50, 127, 211, 0.24);
          border-radius: 6px;
          background: linear-gradient(-45deg, #1b67d8 0%, rgba(58, 160, 238, 0.42) 100%);

          // 第三层，动画
          .progressAnimate {
            width: 0;
            height: 12px;
            border-radius: 6px;
            background: linear-gradient(270deg, #1b67d8 0%, rgba(58, 160, 238, 0.42) 100%);
            // background: linear-gradient(to top right, #CDDC39, #8BC34A, #FFEB3B);
            animation: w 3s linear infinite;

            @keyframes w {
              0% {
                width: 0;
              }

              100% {
                width: var(--barWidth);
              }
            }
          }
        }
      }

      .bluePercent {
        color: #2062c4;
      }
    }
  }
}
</style>
