<template>
  <div class="title-main">
    <div class="title">
      <span
        :class="selectedTab == leftTitleName ? 'active' : ''"
        @click="changeSelectTab(leftTitleName)"
        >{{leftTitleName}}</span
      >
      <span
        :class="selectedTab == rightTitleName ? 'active' : ''"
        @click="changeSelectTab(rightTitleName)"
        >{{rightTitleName}}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleTabs',
  props: {
    leftTitleName: {
        type: String,
        default:()=>{
            return ""
        }
    },
    rightTitleName: {
        type: String,
        default:()=>{
            return ""
        }        
    }
  },
  data() {
    return {
        selectedTab: ''
    }
  },
  methods: {
    changeSelectTab(name) {
        this.selectedTab = name
        this.$emit('changeSelectTab', name)
    }
  },
  mounted() {
    this.selectedTab = this.leftTitleName
  }
}
</script>

<style lang="scss" scoped>
.title-main {
  width: 100%;
  height: 70px;
  padding: 12px 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .title {
    width: 400px;
    height: 64px;
    background: #f5f5f5;
    border-radius: 36px;
    display: flex;
    align-items: center;
    padding: 4px;
    span {
      width: 50%;
      height: 100%;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #555555;
      line-height: 40px;
      border-radius: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .active {
      background: #1b67d8;
      box-shadow: 0px 8px 16px 0px rgba(104, 115, 127, 0.06);
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>