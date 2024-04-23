<template>
  <div class="topChangeBtnContainer">
    <div class="changeBtnBackground">
      <div
        v-for="btn in buttonArray"
        :key="btn"
        class="buttonStyle"
        @click="changeButton(btn)"
        :class="nowChooseStatus === btn ? 'checkedStyle' : ''"
      >
        {{ btn }}
      </div>
      <div class="checkedStyleBgc"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttonArray: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      nowChooseStatus: this.buttonArray[0],
    }
  },
  mounted() {
    this.addBgcStyle() // 初始化背景色
  },

  methods: {
    changeButton(btn) {
      this.nowChooseStatus = btn
      this.$emit('buttonChange', btn)
      this.$nextTick(() => {
        this.addBgcStyle() // 初始化背景色
      })
    },
    // 初始化背景色
    addBgcStyle() {
      let checkedStyleDom = document.getElementsByClassName('checkedStyle') // 获取选中的按钮
      let checkedStyleBgcDom = document.querySelector('.checkedStyleBgc') // 获取选中按钮的背景色
      checkedStyleBgcDom.style.left = checkedStyleDom[0].offsetLeft + 'px' // 设置选中按钮背景色的宽高和位置
      checkedStyleBgcDom.style.top = checkedStyleDom[0].offsetTop + 'px' // 设置选中按钮背景色的宽高和位置
    },
  },
}
</script>

<style lang="less" scoped>
.topChangeBtnContainer {
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #555555;
  background-color: #ffffff;

  .changeBtnBackground {
    width: calc(100% - 60px);
    height: 80px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 40px;
    background-color: #f5f5f5;
    position: relative;

    .buttonStyle {
      z-index: 10;
      width: calc((100% / 3 - (4 * 8px / 3))); // 三个按钮共有4个间距，每个间距8px
      height: calc(100% - 16px); // 16px是两边的padding, 8px是两个按钮之间的间距
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.5s;
    }

    .checkedStyle {
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #1b67d8;
    }

    .checkedStyleBgc {
      position: absolute;
      width: calc((100% / 3 - (4 * 8px / 3))); // 三个按钮共有4个间距，每个间距8px
      height: calc(100% - 16px); // 16px是两边的padding, 8px是两个按钮之间的间距
      border-radius: 32px;
      background-color: #ffffff;
      box-shadow: 0px 8px 16px 0px rgba(104, 115, 127, 0.06);
      transition: all 0.5s;
    }
  }
}
</style>
