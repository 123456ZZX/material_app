<template>
  <div class="SelectStyle">
    <div class="topSide" @click="openSelect">
      <input
        :class="['selectInput', color === 'blue' ? 'blueColor' : 'greyColor']"
        type="text"
        readonly
        v-model="selectName"
        @blur="onBlur"
      />
      <!-- 三角 -->
      <div :class="['rightIcon', { rotate: rotate }]"></div>
    </div>

    <div :class="['bottomOptions', showOptions ? 'show' : 'hidden']">
      <div
        class="oneOption"
        style="height: 40px"
        v-for="(item, index) in selectData"
        :key="index"
        :class="nowIndex === index ? 'selected' : ''"
        @touchend="getValue(item.type, item.name, item.value, index)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Select',
  props: {
    selectData: {
      type: Array,
      default: () => {
        return []
      },
    },
    selValue: {
      type: [Number, String],
      default: null,
    },
    color: {
      type: String,
      default: 'blue',
    },
  },
  computed: {
    // 当前选中值
    selectName() {
      for (let item of this.selectData) {
        if (item.value === this.selectValue) {
          return item.name
        }
      }
      return ''
    },
  },
  data() {
    return {
      selectValue: this.selValue, // 选中的值
      rotate: false, // 三角旋转
      showOptions: false, // 选项开启状态
      nowIndex: 0, // 当前选中的索引
    }
  },
  methods: {
    // 打开选项
    openSelect() {
      this.showOptions = !this.showOptions
      this.rotate = !this.rotate
    },
    // 失去焦点
    onBlur() {
      this.showOptions = false
      this.rotate = false
    },
    // 获取选中值
    getValue(type, name, value, index) {
      this.selectValue = value
      this.nowIndex = index
      this.$emit('getValue', type, name, value)
    },
  },
}
</script>
<style lang="scss" scoped>
.SelectStyle {
  position: relative;
  width: 240px;
  height: 54px;
  line-height: 54px;
  border-radius: 8px;
  border: 1px solid rgba(27, 103, 216, 0.32);
  font-size: 24px !important;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  z-index: 1000;
  background: #ffffff;

  .topSide {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    line-height: 54px;
    border-radius: 200px;
    background: #fff;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    cursor: pointer;

    .selectInput {
      width: 70%;
      height: 95%;
      padding-left: 32px;
      border: none;
      border-radius: 200px;
      background: #fff;
    }

    .blueColor {
      color: #4043fa;
    }

    .greyColor {
      // color: #cccccc;
    }

    // 三角样式
    .rightIcon {
      width: 25px;
      height: 25px;
      margin-right: 40px;
      transition: all 0.3s;
      background: url('~@/assets/img/inspection/展开灰.png') no-repeat;
      background-size: 25px;
      background-position: center;
    }

    .rotate {
      transform: rotate(180deg);
      background: url('~@/assets/img/inspection/展开蓝.png') no-repeat;
      background-size: 25px;
      background-position: center;
    }
  }

  .bottomOptions {
    position: absolute;
    top: calc(100% + 20px);
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    font-size: 24px;
    font-weight: 400;
    color: #333333;
    border: 1px solid #e3e3e3;
    border-radius: 20px;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    background: #ffffff;
    z-index: 100000;
    transition: all 0.5s;

    .oneOption {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 32px;
      cursor: pointer;
    }

    .oneOption::after {
      position: absolute;
      bottom: -2px;
      content: '';
      display: inline-block;
      width: 80.5%;
      height: 2px;
      background-color: #e6e6e6;
    }
  }

  .selected {
    color: #3a79ee;
  }

  .show {
    opacity: 1;
    scale: 1;
  }

  .hidden {
    opacity: 0;
    scale: 0;
    display: none;
  }
}
</style>
