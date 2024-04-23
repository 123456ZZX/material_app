<template>
  <div class="topChangeBtnContainer">
    <div class="changeBtnBackground">
      <div
        class="buttonStyle"
        @click="changeButton(btn1)"
        :class="nowChooseStatus === btn1 ? 'checkedStyle' : ''"
      >
        {{ btn1 }}
      </div>
      <div
        class="buttonStyle"
        @click="changeButton(btn2)"
        :class="nowChooseStatus === btn2 ? 'checkedStyle' : ''"
      >
        {{ btn2 }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    btn1: {
      type: String,
      default: '全部',
    },
    btn2: {
      type: String,
      default: '未读',
    },
  },
  data() {
    return {
      nowChooseStatus: this.btn1,
    }
  },
  methods: {
    changeButton(btn) {
      this.nowChooseStatus = btn
      this.$emit('buttonChange', btn)
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

    .buttonStyle {
      width: calc(100% / 2 - 12px);
      height: calc(100% - 16px);
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
      border-radius: 32px;
      box-shadow: 0px 8px 16px 0px rgba(104, 115, 127, 0.06);
      background: #ffffff;
    }
  }
}
</style>
