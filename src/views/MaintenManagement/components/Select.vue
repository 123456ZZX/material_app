<template>
  <div class="SelectStyle">
    <div class="topSide" @touchend="openSelect">
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
    // options
    selectData: {
      type: Array,
      default: () => {
        return []
      },
    },
    selValue: {
      // 将该prop值作为selValue的初始值
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
      selectValue: this.selValue,
      rotate: false,
      showOptions: false, // 选项开启状态
      nowIndex: 0,
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
  width: 330px;
  height: 72px;
  line-height: 72px;
  position: relative;
  font-size: 28px !important;
  font-family: PingFangSC-Regular, PingFang SC;
  z-index: 1000;
  background-color: #d4e8fc;

  .topSide {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    line-height: 72px;
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
      //   color: #cccccc;
    }

    // 三角样式
    .rightIcon {
      width: 50px;
      height: 50px;
      margin-right: 40px;
      background: url('~@/assets/img/inspection/展开灰.png') no-repeat;
      background-size: 30px;
      background-position: center;
      transition: all 0.3s;
    }

    .rotate {
      transform: rotate(180deg);
      background: url('~@/assets/img/inspection/展开蓝.png') no-repeat;
      background-size: 30px;
      background-position: center;
    }
  }

  .bottomOptions {
    position: absolute;
    top: 96px;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 330px;
    font-size: 28px;
    font-weight: 400;
    color: #333333;
    border: 1px solid #e3e3e3;
    border-radius: 20px;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    background: #ffffff;
    z-index: 100000;

    .oneOption {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 32px;
      cursor: pointer;
    }

    .oneOption::after {
      position: absolute;
      bottom: 0;
      content: '';
      display: inline-block;
      width: 80.5%;
      height: 2px;
      background-color: #e6e6e6;
    }

    // .oneOption:hover {
    //   color: #3a79ee;
    //   background: #eef1fa;
    // }
  }

  .selected {
    color: #3a79ee;
  }

  .show {
    display: block;
  }

  .hidden {
    display: none;
  }
}
</style>
